import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  AttestationMade as AttestationMadeEvent,
  AttestationRevoked as AttestationRevokedEvent,
  OffchainAttestationMade as OffchainAttestationMadeEvent,
  OffchainAttestationRevoked as OffchainAttestationRevokedEvent,
  SchemaRegistered as SchemaRegisteredEvent,
  SAP,
} from "../generated/SAP/SAP";
import {
  Schema,
  Attestation,
  OffchainAttestation,
  User,
} from "../generated/schema";

function processAttestationRecipients(
  addressArray: Address[],
  attestationId: string
): Bytes[] {
  let bytesArray: Bytes[] = [];
  for (let i = 0; i < addressArray.length; i++) {
    bytesArray.push(addressArray[i]);
    addAttestationToUser(addressArray[i], attestationId);
  }
  return bytesArray;
}

function addAttestationToUser(address: Bytes, attestationId: string): void {
  let user = User.load(address);
  if (user === null) {
    user = new User(address);
    user.attestations = [];
    user.schemas = [];
    user.attestationRecipient = [attestationId];
    user.numberOfAttestations = 0;
    user.numberOfSchemas = 0;
    user.numberOfAttestationRecipient = 1;
  } else {
    let attestationRecipient = user.attestationRecipient;
    attestationRecipient.push(attestationId);
    user.attestationRecipient = attestationRecipient;
    user.numberOfAttestationRecipient++;
  }
  user.save();
}

function dataLocationNumberToEnumString(dataLocation: number): string {
  if (dataLocation == 0) {
    return "ONCHAIN";
  } else if (dataLocation == 1) {
    return "ARWEAVE";
  } else {
    return "UNSUPPORTED";
  }
}

function updateUserMetric(
  address: Bytes,
  attestation: boolean,
  id: string
): void {
  let user = User.load(address);
  if (user == null) {
    user = new User(address);
    user.attestationRecipient = [];
    user.numberOfAttestationRecipient = 0;
    if (attestation) {
      user.numberOfAttestations = 1;
      user.numberOfSchemas = 0;
      user.attestations = [id];
      user.schemas = [];
    } else {
      user.numberOfAttestations = 0;
      user.numberOfSchemas = 1;
      user.attestations = [];
      user.schemas = [id];
    }
  } else {
    if (attestation) {
      user.numberOfAttestations++;
      let attestations = user.attestations;
      attestations.push(id);
      user.attestations = attestations;
    } else {
      user.numberOfSchemas++;
      let schemas = user.schemas;
      schemas.push(id);
      user.schemas = schemas;
    }
  }
  user.save();
}

export function handleAttestationMade(event: AttestationMadeEvent): void {
  let entity = new Attestation(event.params.attestationId);
  const attestation = SAP.bind(event.address).getAttestation(
    event.params.attestationId
  );
  entity.schema = attestation.schemaId;
  if (attestation.linkedAttestationId !== "") {
    entity.linkedAttestation = attestation.linkedAttestationId;
  }
  entity.tx = event.transaction.hash;
  entity.attester = event.transaction.from;
  entity.attestTimestamp = event.block.timestamp;
  entity.validUntil = attestation.validUntil;
  entity.recipients = processAttestationRecipients(
    attestation.recipients,
    event.params.attestationId
  );
  entity.data = attestation.data;
  entity.save();

  updateUserMetric(event.transaction.from, true, event.params.attestationId);
}

export function handleAttestationRevoked(event: AttestationRevokedEvent): void {
  let entity = Attestation.load(event.params.attestationId)!;
  entity.revoked = true;
  entity.revokeReason = event.params.reason;
  entity.revokeTimestamp = event.block.timestamp;
  entity.revokeTx = event.transaction.hash;
  entity.save();
}

export function handleOffchainAttestationMade(
  event: OffchainAttestationMadeEvent
): void {
  let entity = new OffchainAttestation(event.params.attestationId);
  entity.tx = event.transaction.hash;
  entity.attestTimestamp = event.block.timestamp;
  entity.save();
}

export function handleOffchainAttestationRevoked(
  event: OffchainAttestationRevokedEvent
): void {
  let entity = OffchainAttestation.load(event.params.attestationId)!;
  entity.revoked = true;
  entity.revokeTimestamp = event.block.timestamp;
  entity.revokeReason = event.params.reason;
  entity.revokeTx = event.transaction.hash;
  entity.save();
}

export function handleSchemaRegistered(event: SchemaRegisteredEvent): void {
  let entity = new Schema(event.params.schemaId);
  const schema = SAP.bind(event.address).getSchema(event.params.schemaId);
  entity.tx = event.transaction.hash;
  entity.registrant = event.transaction.from;
  entity.revocable = schema.revocable;
  entity.dataLocation = dataLocationNumberToEnumString(schema.dataLocation);
  entity.maxValidFor = schema.maxValidFor;
  entity.resolver = schema.resolver;
  entity.schema = schema.schema;
  entity.registerTimestamp = event.block.timestamp;
  entity.numberOfAttestations = 0;
  entity.save();

  updateUserMetric(event.transaction.from, false, event.params.schemaId);
}
