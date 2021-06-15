import { Address, log, BigInt } from "@graphprotocol/graph-ts"

import {
  BondCall,
  UnbondCall,
  Bondage,
  Bound,
  Unbound,
  Escrowed,
  Released,
  Returned,
  OwnershipTransferred
} from "../generated/Bondage/Bondage"
import { Registry } from "../generated/Bondage/Registry"

import { Event, Data } from "../generated/schema"

import {getZapRequired, getEnd} from "./utils"

const REGADDRESS = Address.fromString("0xC7Ab7FFc4FC2f3C75FfB621f574d4b9c861330f0")
const BONDADDRESS = Address.fromString("0x188f79b0a8edc10ad53285c47c3feaa0d2716e83")

export function handleBound(event: Bound): void {
}

export function handleUnbound(event: Unbound): void {

}

export function handleBond(call: BondCall): void {
  let bondID = call.inputs.endpoint.toHex() + call.from.toHexString() + call.transaction.hash.toHex()
  let bond = Event.load(bondID)
  if (bond == null){
    bond = new Event(bondID)
  }

 let dataID = call.inputs.oracleAddress.toHexString() + call.inputs.endpoint.toString() + call.transaction.hash.toHex()
  let data = Data.load(dataID)
  if (data == null){
    data = new Data(dataID)
  }


  bond.txnHash = call.transaction.hash
  bond.block = call.block.number
  bond.to = call.transaction.to.toHexString()
  bond.from = call.transaction.from.toHexString()
  bond.timestamp = call.block.timestamp
  // bond.status = 
  bond.txAction = "to"
  bond.tokenTransfer = null
  
  bond.transactionFee = call.transaction.gasUsed.times(call.transaction.gasPrice)

  bond.gasPrice = call.transaction.gasPrice
  bond.gasLimit = call.transaction.gasUsed
  bond.action = "bond"

  data.name = "bond"
  data.endpoint = call.inputs.endpoint.toString()
  data.numDots = call.inputs.numDots

  const bondage = Bondage.bind(BONDADDRESS)
  let numZap = bondage.try_calcZapForDots(call.inputs.oracleAddress, call.inputs.endpoint, call.inputs.numDots)
  if (!numZap.reverted) {
    data.numZap = numZap.value    
  } else {
    bond.status = "failed"
    bond.save()
    return
  }
  data.holder = call.from.toHexString()

  bond.data = data.id

  bond.save()
  data.save()
}

export function handleUnbond(call: UnbondCall): void {
  let bondID = call.inputs.endpoint.toHex() + call.from.toHexString() + call.transaction.hash.toHex()
  let bond = Event.load(bondID)
  if (bond == null){
    bond = new Event(bondID)
  }

  let dataID = call.inputs.oracleAddress.toHexString() + call.inputs.endpoint.toString() + call.transaction.hash.toHex()
  let data = Data.load(dataID)
  if (data == null){
    data = new Data(dataID)
  }


  bond.txnHash = call.transaction.hash
  bond.block = call.block.number
  bond.to = call.transaction.to.toHexString()
  bond.from = call.transaction.from.toHexString()
  bond.timestamp = call.block.timestamp
  // bond.status = 
  bond.txAction = "to"
  bond.tokenTransfer = null
  
  bond.transactionFee = call.transaction.gasUsed.times(call.transaction.gasPrice)

  bond.gasPrice = call.transaction.gasPrice
  bond.gasLimit = call.transaction.gasUsed
  bond.action = "unbond"

  data.name = "unbond"
  data.endpoint = call.inputs.endpoint.toString()
  data.numDots = call.inputs.numDots

  const bondage = Bondage.bind(BONDADDRESS)
  let numZap = bondage.try_calcZapForDots(call.inputs.oracleAddress, call.inputs.endpoint, call.inputs.numDots)
  if (!numZap.reverted) {
    data.numZap = numZap.value    
  } else {
    bond.status = "failed"
    bond.save()
    return
  }
  data.holder = call.from.toHexString()

  bond.data = data.id

  bond.save()
  data.save()
}

export function handleEscrowed(event: Escrowed): void {}

export function handleReleased(event: Released): void {}

export function handleReturned(event: Returned): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
