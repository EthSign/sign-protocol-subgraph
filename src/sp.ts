import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  AttestationMade as AttestationMadeEvent,
  AttestationRevoked as AttestationRevokedEvent,
  OffchainAttestationMade as OffchainAttestationMadeEvent,
  OffchainAttestationRevoked as OffchainAttestationRevokedEvent,
  SchemaRegistered as SchemaRegisteredEvent,
  SP,
} from "../generated/SP/SP";
import {
  Schema,
  Attestation,
  OffchainAttestation,
  User,
  AttestationRecipient,
  Event,
} from "../generated/schema";

function processAttestationRecipients(
  recipientArray: Bytes[],
  attestationId: BigInt
): void {
  for (let i = 0; i < recipientArray.length; i++) {
    addAttestationToUser(recipientArray[i], attestationId);
  }
}

function addAttestationToUser(recipient: Bytes, attestationId: BigInt): void {
  let user = User.load(recipient);
  if (user === null) {
    user = new User(recipient);
    user.attestations = [];
    user.schemas = [];
    user.attestationRecipient = [attestationId.toHexString()];
    user.numberOfAttestations = 0;
    user.numberOfSchemas = 0;
    user.numberOfAttestationRecipient = 1;
  } else {
    let attestationRecipient = user.attestationRecipient;
    attestationRecipient.push(attestationId.toHexString());
    user.attestationRecipient = attestationRecipient;
    user.numberOfAttestationRecipient++;
  }
  user.save();

  const attestationReceipientEntityID = `${attestationId.toHexString()}-${recipient.toHexString()}`;
  let attestationReceipientEntity = AttestationRecipient.load(
    attestationReceipientEntityID
  );
  if (attestationReceipientEntity === null) {
    attestationReceipientEntity = new AttestationRecipient(
      attestationReceipientEntityID
    );
    attestationReceipientEntity.attestationId = attestationId.toHexString();
    attestationReceipientEntity.recipient = recipient;
    attestationReceipientEntity.save();
  }
}

function dataLocationNumberToEnumString(dataLocation: number): string {
  if (dataLocation == 0) {
    return "ONCHAIN";
  } else if (dataLocation == 1) {
    return "ARWEAVE";
  } else if (dataLocation == 2) {
    return "IPFS";
  } else if (dataLocation == 3) {
    return "CUSTOM";
  } else {
    return "UNSUPPORTED";
  }
}

function updateUserMetric(
  address: Bytes,
  attestation: boolean,
  id: BigInt
): void {
  let user = User.load(address);
  if (user == null) {
    user = new User(address);
    user.attestationRecipient = [];
    user.numberOfAttestationRecipient = 0;
    if (attestation) {
      user.numberOfAttestations = 1;
      user.numberOfSchemas = 0;
      user.attestations = [id.toHexString()];
      user.schemas = [];
    } else {
      user.numberOfAttestations = 0;
      user.numberOfSchemas = 1;
      user.attestations = [];
      user.schemas = [id.toHexString()];
    }
  } else {
    if (attestation) {
      user.numberOfAttestations++;
      let attestations = user.attestations;
      attestations.push(id.toHexString());
      user.attestations = attestations;
    } else {
      user.numberOfSchemas++;
      let schemas = user.schemas;
      schemas.push(id.toHexString());
      user.schemas = schemas;
    }
  }
  user.save();
}

export function handleAttestationMade(event: AttestationMadeEvent): void {
  let entity = new Attestation(event.params.attestationId.toHexString());
  const attestation = SP.bind(event.address).getAttestation(
    event.params.attestationId
  );
  entity.schema = attestation.schemaId.toHexString();
  if (attestation.linkedAttestationId !== BigInt.fromI32(0)) {
    entity.linkedAttestation = attestation.linkedAttestationId.toHexString();
  }
  entity.transactionHash = event.transaction.hash;
  entity.dataLocation = dataLocationNumberToEnumString(
    attestation.dataLocation
  );
  entity.indexingKey = event.params.indexingKey;
  entity.attester = event.transaction.from;
  entity.attestTimestamp = event.block.timestamp;
  entity.validUntil = attestation.validUntil;
  entity.data = attestation.data;
  processAttestationRecipients(
    attestation.recipients,
    event.params.attestationId
  );
  entity.save();

  updateUserMetric(event.transaction.from, true, event.params.attestationId);

  let _event = new Event(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  _event.timestamp = event.block.timestamp;
  _event.transactionHash = event.transaction.hash;
  _event.type = "AttestationMade";
  _event.attestation = event.params.attestationId.toHexString();
  _event.save();
}

export function handleAttestationRevoked(event: AttestationRevokedEvent): void {
  let entity = Attestation.load(event.params.attestationId.toHexString())!;
  entity.revoked = true;
  entity.revokeReason = event.params.reason;
  entity.revokeTimestamp = event.block.timestamp;
  entity.revokeTransactionHash = event.transaction.hash;
  entity.save();

  let _event = new Event(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  _event.timestamp = event.block.timestamp;
  _event.transactionHash = event.transaction.hash;
  _event.type = "AttestationRevoked";
  _event.attestation = event.params.attestationId.toHexString();
  _event.save();
}

export function handleOffchainAttestationMade(
  event: OffchainAttestationMadeEvent
): void {
  let entity = new OffchainAttestation(event.params.attestationId);
  entity.transactionHash = event.transaction.hash;
  entity.attestTimestamp = event.block.timestamp;
  entity.save();

  let _event = new Event(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  _event.timestamp = event.block.timestamp;
  _event.transactionHash = event.transaction.hash;
  _event.type = "OffchainAttestationMade";
  _event.offchainAttestation = event.params.attestationId;
  _event.save();
}

export function handleOffchainAttestationRevoked(
  event: OffchainAttestationRevokedEvent
): void {
  let entity = OffchainAttestation.load(event.params.attestationId)!;
  entity.revoked = true;
  entity.revokeTimestamp = event.block.timestamp;
  entity.revokeReason = event.params.reason;
  entity.revokeTransactionHash = event.transaction.hash;
  entity.save();

  let _event = new Event(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  _event.timestamp = event.block.timestamp;
  _event.transactionHash = event.transaction.hash;
  _event.type = "OffchainAttestationRevoked";
  _event.offchainAttestation = event.params.attestationId;
  _event.save();
}

export function handleSchemaRegistered(event: SchemaRegisteredEvent): void {
  let entity = new Schema(event.params.schemaId.toHexString());
  const schema = SP.bind(event.address).getSchema(event.params.schemaId);
  entity.transactionHash = event.transaction.hash;
  entity.registrant = event.transaction.from;
  entity.revocable = schema.revocable;
  entity.dataLocation = dataLocationNumberToEnumString(schema.dataLocation);
  entity.maxValidFor = schema.maxValidFor;
  entity.resolver = schema.resolver;
  entity.data = schema.data;
  entity.registerTimestamp = event.block.timestamp;
  entity.numberOfAttestations = 0;
  entity.save();

  updateUserMetric(event.transaction.from, false, event.params.schemaId);

  let _event = new Event(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  _event.timestamp = event.block.timestamp;
  _event.transactionHash = event.transaction.hash;
  _event.type = "SchemaRegistered";
  _event.schema = event.params.schemaId.toHexString();
  _event.save();
}
