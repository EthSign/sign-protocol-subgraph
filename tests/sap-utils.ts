import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AttestationMade,
  AttestationRevoked,
  Initialized,
  OffchainAttestationMade,
  OwnershipTransferred,
  SchemaRegistered,
  Upgraded
} from "../generated/SAP/SAP"

export function createAttestationMadeEvent(
  attestationId: string
): AttestationMade {
  let attestationMadeEvent = changetype<AttestationMade>(newMockEvent())

  attestationMadeEvent.parameters = new Array()

  attestationMadeEvent.parameters.push(
    new ethereum.EventParam(
      "attestationId",
      ethereum.Value.fromString(attestationId)
    )
  )

  return attestationMadeEvent
}

export function createAttestationRevokedEvent(
  attestationId: string,
  reason: string
): AttestationRevoked {
  let attestationRevokedEvent = changetype<AttestationRevoked>(newMockEvent())

  attestationRevokedEvent.parameters = new Array()

  attestationRevokedEvent.parameters.push(
    new ethereum.EventParam(
      "attestationId",
      ethereum.Value.fromString(attestationId)
    )
  )
  attestationRevokedEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return attestationRevokedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createOffchainAttestationMadeEvent(
  attestationId: string
): OffchainAttestationMade {
  let offchainAttestationMadeEvent = changetype<OffchainAttestationMade>(
    newMockEvent()
  )

  offchainAttestationMadeEvent.parameters = new Array()

  offchainAttestationMadeEvent.parameters.push(
    new ethereum.EventParam(
      "attestationId",
      ethereum.Value.fromString(attestationId)
    )
  )

  return offchainAttestationMadeEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSchemaRegisteredEvent(
  schemaId: string
): SchemaRegistered {
  let schemaRegisteredEvent = changetype<SchemaRegistered>(newMockEvent())

  schemaRegisteredEvent.parameters = new Array()

  schemaRegisteredEvent.parameters.push(
    new ethereum.EventParam("schemaId", ethereum.Value.fromString(schemaId))
  )

  return schemaRegisteredEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}
