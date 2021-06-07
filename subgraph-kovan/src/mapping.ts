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
import { Event } from "../generated/schema"

export function handleBound(event: Bound): void {
  let bondID = event.params.endpoint.toHex() + event.params.holder.toHex()
  let bond = Event.load(bondID)
  if (bond == null){
    bond = new Event(bondID)
  }

  bond.txnHash = event.transaction.hash
  bond.block = event.block.number
  bond.to = event.transaction.to.toHexString()
  bond.from = event.transaction.from.toHexString()
  bond.timestamp = event.block.timestamp
  // bond.status = 
  bond.txAction = "to"
  bond.tokenTransfer = null
  
  let gasUsed = event.transaction.gasUsed.toI32()
  let gasPrice = event.transaction.gasPrice.toI32()

  bond.transactionFee = BigInt.fromI32(gasUsed * gasPrice)

  let gasPriceStr = event.transaction.gasPrice.toString()
  let gasLimitStr = event.block.gasLimit.toString()
  bond.gasInfo = gasPriceStr + "Gas Used From " + gasLimitStr + " Gas Limit @ "
                  + `${Math.round(gasPrice * 1 ** -18)}` + " ether "
                  + "(" + `${Math.round(gasPrice * 10 ** -9)}` + " gwei)"
  bond.action = "bond"
}

export function handleUnbound(event: Unbound): void {}

export function handleEscrowed(event: Escrowed): void {}

export function handleReleased(event: Released): void {}

export function handleReturned(event: Returned): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
