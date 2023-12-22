import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AttestationMade } from "../generated/schema"
import { AttestationMade as AttestationMadeEvent } from "../generated/SAP/SAP"
import { handleAttestationMade } from "../src/sap"
import { createAttestationMadeEvent } from "./sap-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let attestationId = "Example string value"
    let newAttestationMadeEvent = createAttestationMadeEvent(attestationId)
    handleAttestationMade(newAttestationMadeEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AttestationMade created and stored", () => {
    assert.entityCount("AttestationMade", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AttestationMade",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "attestationId",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
