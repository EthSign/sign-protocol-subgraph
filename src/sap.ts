import {
  AttestationMade as AttestationMadeEvent,
  AttestationRevoked as AttestationRevokedEvent,
  Initialized as InitializedEvent,
  OffchainAttestationMade as OffchainAttestationMadeEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SchemaRegistered as SchemaRegisteredEvent,
  Upgraded as UpgradedEvent
} from "../generated/SAP/SAP"
import {
  AttestationMade,
  AttestationRevoked,
  Initialized,
  OffchainAttestationMade,
  OwnershipTransferred,
  SchemaRegistered,
  Upgraded
} from "../generated/schema"

export function handleAttestationMade(event: AttestationMadeEvent): void {
  let entity = new AttestationMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.attestationId = event.params.attestationId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAttestationRevoked(event: AttestationRevokedEvent): void {
  let entity = new AttestationRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.attestationId = event.params.attestationId
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOffchainAttestationMade(
  event: OffchainAttestationMadeEvent
): void {
  let entity = new OffchainAttestationMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.attestationId = event.params.attestationId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSchemaRegistered(event: SchemaRegisteredEvent): void {
  let entity = new SchemaRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.schemaId = event.params.schemaId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
