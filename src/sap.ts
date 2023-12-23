import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  AttestationMade as AttestationMadeEvent,
  AttestationRevoked as AttestationRevokedEvent,
  OffchainAttestationMade as OffchainAttestationMadeEvent,
  OffchainAttestationRevoked as OffchainAttestationRevokedEvent,
  SchemaRegistered as SchemaRegisteredEvent,
  SAP,
} from "../generated/SAP/SAP";
import { Schema, Attestation, OffchainAttestation } from "../generated/schema";

function addressArrayToBytesArray(addressArray: Address[]): Bytes[] {
  let bytesArray: Bytes[] = [];
  for (let i = 0; i < addressArray.length; i++) {
    bytesArray.push(addressArray[i]);
  }
  return bytesArray;
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

export function handleAttestationMade(event: AttestationMadeEvent): void {
  let entity = new Attestation(event.params.attestationId);
  const attestation = SAP.bind(event.address).attestationRegistry(
    event.params.attestationId
  );
  entity.schema = attestation.schemaId;
  entity.linkedAttestation = attestation.linkedAttestationId;
  entity.attester = event.transaction.from;
  entity.attestTimestamp = event.block.timestamp;
  entity.validUntil = attestation.validUntil;
  entity.recipients = addressArrayToBytesArray(attestation.recipients);
  entity.save();
}

export function handleAttestationRevoked(event: AttestationRevokedEvent): void {
  let entity = Attestation.load(event.params.attestationId)!;
  entity.revoked = true;
  entity.revokeReason = event.params.reason;
  entity.revokeTimestamp = event.block.timestamp;
  entity.save();
}

export function handleOffchainAttestationMade(
  event: OffchainAttestationMadeEvent
): void {
  let entity = new OffchainAttestation(event.params.attestationId);
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
  entity.save();
}

export function handleSchemaRegistered(event: SchemaRegisteredEvent): void {
  let entity = new Schema(event.params.schemaId);
  const schema = SAP.bind(event.address).schemaRegistry(event.params.schemaId);
  entity.registrant = event.transaction.from;
  entity.revocable = schema.revocable;
  entity.dataLocation = dataLocationNumberToEnumString(schema.dataLocation);
  entity.maxValidFor = schema.maxValidFor;
  entity.resolver = schema.resolver;
  entity.schema = schema.schema;
  entity.registerTimestamp = event.block.timestamp;
  entity.numberOfAttestations = 0;
  entity.save();
}
