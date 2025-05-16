class ConnectReq {
    constructor(token, host, port) {
      this.token = token;
      this.host = host;
      this.port = port;
    }
  
    toJSON() {
      return {
        token: this.token,
        host: this.host,
        port: this.port,
      };
    }
  }
  class SubscribeReq {
    constructor(topicList = []) {
      this.subscriptionList = topicList;
    }
  
    toJSON() {
      return { subscriptionList: this.subscriptionList };
    }
  }
  
  class UnSubscribeReq {
    constructor(topicList = []) {
      this.unSubscriptionList = topicList;
    }
  
    toJSON() {
      return { unSubscriptionList: this.unSubscriptionList };
    }
  }
  
  class Depth {
    constructor(buffer, offset) {
      this.quantity = buffer.readUInt32LE(offset);
      this.price = buffer.readInt32LE(offset + 4);
      this.orders = buffer.readInt16LE(offset + 8);
      this.transactionType = buffer.readInt16LE(offset + 10);
    }
  }
  
  class MWBOCombined {
    constructor(buffer) {
      this.ltp = buffer.readInt32LE(0);
      this.lastTradedQuantity = buffer.readUInt32LE(4);
      this.tradedVolume = buffer.readUInt32LE(8);
      this.high = buffer.readInt32LE(12);
      this.low = buffer.readInt32LE(16);
      this.open = buffer.readInt32LE(20);
      this.close = buffer.readInt32LE(24);
      this.averageTradedPrice = buffer.readInt32LE(28);
      this.reserved = buffer.readUInt16LE(32);
      this.bestBidQuantity = buffer.readUInt32LE(34);
      this.bestBidPrice = buffer.readInt32LE(38);
      this.bestAskQuantity = buffer.readUInt32LE(42);
      this.bestAskPrice = buffer.readInt32LE(46);
      this.totalBidQuantity = buffer.readUInt32LE(50);
      this.totalAskQuantity = buffer.readUInt32LE(54);
      this.priceDivisor = buffer.readInt32LE(58);
      this.lastTradedTime = buffer.readInt32LE(62);
  
      this.marketDepth = [];
      let offset = 66;
      for (let i = 0; i < 10; i++) {
        this.marketDepth.push(new Depth(buffer, offset));
        offset += 12;
      }
    }
  }
  class OpenInterestData {
    constructor(buffer) {
      this.openInterest = buffer.readInt32LE(0);
      this.dayHighOi = buffer.readInt32LE(4);
      this.dayLowOi = buffer.readInt32LE(8);
      this.previousOi = buffer.readInt32LE(12);
    }
  }
  
  class LppData {
    constructor(buffer) {
      this.lppHigh = buffer.readUInt32LE(0);
      this.lppLow = buffer.readUInt32LE(4);
      this.priceDivisor = buffer.readInt32LE(8);
    }
  }
  
  class UpperCircuitData {
    constructor(buffer) {
      this.instrumentId = buffer.readUInt32LE(0);
      this.upperCircuit = buffer.readUInt32LE(4);
      this.priceDivisor = buffer.readInt32LE(8);
    }
  }
  
  class LowerCircuitData {
    constructor(buffer) {
      this.instrumentId = buffer.readUInt32LE(0);
      this.lowerCircuit = buffer.readUInt32LE(4);
      this.priceDivisor = buffer.readInt32LE(8);
    }
  }
  
  class MarketStatusData {
    constructor(buffer) {
      this.marketStatusCode = buffer.readUInt16LE(0);
    }
  }
  
  class High52WeekData {
    constructor(buffer) {
      this.instrumentId = buffer.readUInt32LE(0);
      this.high52Week = buffer.readUInt32LE(4);
      this.priceDivisor = buffer.readInt32LE(8);
    }
  }
  
  class Low52WeekData {
    constructor(buffer) {
      this.instrumentId = buffer.readUInt32LE(0);
      this.low52Week = buffer.readUInt32LE(4);
      this.priceDivisor = buffer.readInt32LE(8);
    }
  }
  
  class Index {
    constructor(buffer){
      this.indexId = buffer.readUInt8(0);
      this.time = buffer.readUInt16LE(1);
      this.indexValue = buffer.readUInt32LE(3);
      this.noOfUpMoves = buffer.readUInt16LE(7);
      this.noOfDownMoves = buffer.readUInt16LE(9);
      this.closingIndex = buffer.readUInt32LE(11);
      this.priceDivisor = buffer.readInt32LE(15);
    }
  }
  
  module.exports = {
    ConnectReq,
    SubscribeReq,
    UnSubscribeReq,
    MWBOCombined,
    OpenInterestData,
    LppData,
    UpperCircuitData,
    LowerCircuitData,
    MarketStatusData,
    High52WeekData,
    Low52WeekData,
    Index,
  };
  