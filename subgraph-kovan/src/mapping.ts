import { BigInt } from "@graphprotocol/graph-ts"
import {
  Bondage,
  Bound,
  Unbound,
  Escrowed,
  Released,
  Returned,
  OwnershipTransferred
} from "../generated/Bondage/Bondage"
import { Event, Data } from "../generated/schema"

export function handleBound(event: Bound): void {
  let bondID = event.params.endpoint.toHex() + event.params.holder.toHexString() + event.transaction.hash.toHex()
  let bond = Event.load(bondID)
  if (bond == null){
    bond = new Event(bondID)
  }

 let dataID = event.params.oracle.toHexString() + event.params.endpoint.toString() + event.transaction.hash.toHex()
  let data = Data.load(dataID)
  if (data == null){
    data = new Data(dataID)
  }

  bond.txnHash = event.transaction.hash
  bond.block = event.block.number
  bond.to = event.transaction.to.toHexString()
  bond.from = event.transaction.from.toHexString()
  bond.timestamp = event.block.timestamp
  // bond.status = 
  bond.txAction = "to"
  bond.tokenTransfer = null
  
  bond.transactionFee = event.transaction.gasUsed.times(event.transaction.gasPrice)

  bond.gasPrice = event.transaction.gasPrice
  bond.gasLimit = event.block.gasLimit
  bond.action = "bond"

  data.name = "bond"
  data.endpoint = event.params.endpoint.toString()
  data.numDots = event.params.numDots

  bond.data = data.id

  bond.save()
  data.save()
}

export function handleUnbound(event: Unbound): void {
  let bondID = event.params.endpoint.toHex() + event.params.holder.toHexString() + event.transaction.hash.toHex()
  let bond = Event.load(bondID)
  if (bond == null){
    bond = new Event(bondID)
  }

  let dataID = event.params.oracle.toHexString() + event.params.endpoint.toString() + event.transaction.hash.toHex()
  let data = Data.load(dataID)
  if (data == null){
    data = new Data(dataID)
  }

  bond.txnHash = event.transaction.hash
  bond.block = event.block.number
  bond.to = event.transaction.to.toHexString()
  bond.from = event.transaction.from.toHexString()
  bond.timestamp = event.block.timestamp
  // bond.status = 
  bond.txAction = "to"
  bond.tokenTransfer = null
  
  bond.transactionFee = event.transaction.gasUsed.times(event.transaction.gasPrice)

  bond.gasPrice = event.transaction.gasPrice
  bond.gasLimit = event.block.gasLimit
  bond.action = "unbond"

  data.name = "unbond"
  data.endpoint = event.params.endpoint.toString()
  data.numDots = event.params.numDots

  bond.data = data.id

  bond.save()
  data.save()
}

export function handleEscrowed(event: Escrowed): void {}

export function handleReleased(event: Released): void {}

export function handleReturned(event: Returned): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
