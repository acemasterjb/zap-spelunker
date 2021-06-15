import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"

export function getZapRequired(a: BigInt, n: BigInt, max: BigInt, curve: BigInt[]): BigInt{
  if(n.gt(max)){
    return BigInt.fromI32(0)
  }

  let count = BigInt.fromI32(0)
  for (let i = a; i < a.plus(n); i = i.plus(BigInt.fromI32(1))) {
    count = count.plus(getPrice(i, max, curve))
  }

  return count
}

export function getEnd(curve: BigInt[]): BigInt{
    let prevEnd = BigInt.fromI32(1)
    let index = 0
  
    while (index < curve.length) {
      let length = curve[index].toI32()
      let endIndex = index + length + 1
      let end = curve[endIndex]
  
      prevEnd = end
      index += length + 2
    }
  
    return prevEnd
  }
  
  function getPrice(x: BigInt, max: BigInt, curve: BigInt[]): BigInt{  
    let index = 0
    while (index < curve.length) {
      let length = curve[index]
      let end = curve[index + length.toI32() + 1]
  
      if (x.gt(end)){
        index += length.toI32() + 2
        continue
      }
  
      let count = BigInt.fromI32(0)
      for (let i = 0; i < length.toI32(); i++) {
        let coeff = curve[index + i + 1]
        count = count.plus(coeff.times((x.pow(u8(i)))))
      }

      
      return count
    }
  
    return BigInt.fromI32(-1)
  }