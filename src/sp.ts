import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  AttestationMade as AttestationMadeEvent,
  AttestationRevoked as AttestationRevokedEvent,
  OffchainAttestationMade as OffchainAttestationMadeEvent,
  OffchainAttestationRevoked as OffchainAttestationRevokedEvent,
  SchemaRegistered as SchemaRegisteredEvent,
  Initialized as InitializedEvent,
  SP,
} from "../generated/SP/SP";
import {
  Schema,
  Attestation,
  OffchainAttestation,
  User,
  AttestationRecipient,
  Event,
  Global,
} from "../generated/schema";

const GLOBAL_ID = "GLOBAL_ID";

function incrementGlobalSchemaCount(): void {
  let entity = Global.load(GLOBAL_ID)!;
  entity.totalNumberOfSchemas += 1;
  entity.save();
}

function incrementGlobalAttestationCount(): void {
  let entity = Global.load(GLOBAL_ID)!;
  entity.totalNumberOfAttestations += 1;
  entity.save();
}

function incrementGlobalOffchainAttestationCount(): void {
  let entity = Global.load(GLOBAL_ID)!;
  entity.totalNumberOfOffchainAttestations += 1;
  entity.save();
}

function incrementGlobalRevocationCount(): void {
  let entity = Global.load(GLOBAL_ID)!;
  entity.totalNumberOfRevocations += 1;
  entity.save();
}

function incrementGlobalOffchainRevocationCount(): void {
  let entity = Global.load(GLOBAL_ID)!;
  entity.totalNumberOfOffchainRevocations += 1;
  entity.save();
}

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

export function handleInitialized(event: InitializedEvent): void {
  let entity = Global.load(GLOBAL_ID);
  if (entity === null) {
    entity = new Global(GLOBAL_ID);
    entity.totalNumberOfSchemas = 0;
    entity.totalNumberOfAttestations = 0;
    entity.totalNumberOfOffchainAttestations = 0;
    entity.totalNumberOfRevocations = 0;
    entity.totalNumberOfOffchainRevocations = 0;
    entity.save();
  }
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
  entity.from = event.transaction.from;
  entity.transactionHash = event.transaction.hash;
  entity.attestBlock = event.block.number;
  entity.dataLocation = dataLocationNumberToEnumString(
    attestation.dataLocation
  );
  entity.indexingKey = event.params.indexingKey;
  entity.attester = attestation.attester;
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
  _event.block = event.block.number;
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
  entity.revokeBlock = event.block.number;
  entity.revokeTransactionHash = event.transaction.hash;
  entity.save();

  let _event = new Event(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  _event.block = event.block.number;
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
  entity.attestBlock = event.block.number;
  entity.save();

  let _event = new Event(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  _event.block = event.block.number;
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
  entity.revokeBlock = event.block.number;
  entity.revokeReason = event.params.reason;
  entity.revokeTransactionHash = event.transaction.hash;
  entity.save();

  let _event = new Event(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  _event.block = event.block.number;
  _event.timestamp = event.block.timestamp;
  _event.transactionHash = event.transaction.hash;
  _event.type = "OffchainAttestationRevoked";
  _event.offchainAttestation = event.params.attestationId;
  _event.save();
}

export function handleSchemaRegistered(event: SchemaRegisteredEvent): void {
  let entity = new Schema(event.params.schemaId.toHexString());
  const schema = SP.bind(event.address).getSchema(event.params.schemaId);
  entity.block = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.registrant = event.transaction.from;
  entity.revocable = schema.revocable;
  entity.dataLocation = dataLocationNumberToEnumString(schema.dataLocation);
  entity.maxValidFor = schema.maxValidFor;
  entity.hook = schema.hook;
  entity.data = schema.data;
  entity.registerTimestamp = event.block.timestamp;
  entity.numberOfAttestations = 0;
  entity.save();

  updateUserMetric(event.transaction.from, false, event.params.schemaId);

  let _event = new Event(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  _event.block = event.block.number;
  _event.timestamp = event.block.timestamp;
  _event.transactionHash = event.transaction.hash;
  _event.type = "SchemaRegistered";
  _event.schema = event.params.schemaId.toHexString();
  _event.save();
}
