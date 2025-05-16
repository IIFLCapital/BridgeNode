/**
 * Represents a connection response.
 */
class ConnectionResponse {
  /**
   * Creates an instance of ConnectionResponse.
   * @param {number} status - The status code of the response.
   * @param {string} message - The message of the response.
   */
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }

  /**
   * Converts the response to a JSON object.
   * @returns {Object} The JSON representation of the response.
   */
  toJSON() {
    return { status: this.status, message: this.message };
  }
}

/**
 * Represents a subscription feed response.
 */
class SubscribeFeedResponse {
  /**
   * Creates an instance of SubscribeFeedResponse.
   * @param {number} status - The status code of the response.
   * @param {string} message - The message of the response.
   * @param {Array} Result - The result array containing subscription details.
   */
  constructor(status, message, Result) {
    this.status = status;
    this.message = message;
    this.subscriptionResult = Result.map((sub) => ({
      resultCode: sub.resultCode,
      result: sub.result,
      topic: sub.topic,
    }));
  }
}

/**
 * Represents an unsubscription feed response.
 */
class UnSubscribeFeedResponse {
  /**
   * Creates an instance of UnSubscribeFeedResponse.
   * @param {number} status - The status code of the response.
   * @param {string} message - The message of the response.
   * @param {Array} Result - The result array containing unsubscription details.
   */
  constructor(status, message, Result) {
    this.status = status;
    this.message = message;
    this.unSubscriptionResult = Result.map((sub) => ({
      resultCode: sub.resultCode,
      result: sub.result,
      topic: sub.topic,
    }));
  }
}

/**
 * Represents a result of a subscription or unsubscription.
 */
class Result {
  /**
   * Creates an instance of Result.
   * @param {number} resultCode - The result code.
   * @param {string} result - The result message.
   * @param {string} topic - The topic of the subscription or unsubscription.
   */
  constructor(resultCode, result, topic) {
    this.resultCode = resultCode;
    this.result = result;
    this.topic = topic;
  }
}

/**
 * Represents a disconnection response.
 */
class DisconnectionResponse {
  /**
   * Creates an instance of DisconnectionResponse.
   * @param {number} status - The status code of the response.
   * @param {string} message - The message of the response.
   */
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

module.exports = {
  ConnectionResponse,
  SubscribeFeedResponse,
  UnSubscribeFeedResponse,
  Result,
  DisconnectionResponse,
};
