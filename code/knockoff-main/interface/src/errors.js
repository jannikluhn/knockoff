const errorCodes = {
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  CHAIN_ERROR: "CHAIN_ERROR",
  APOLLO_ERROR: "APOLLO_ERROR",
  TX_ERROR: "TX_ERROR",
};

class KnockOffError extends Error {
  constructor(code, message, obj, ...params) {
    super(message, ...params);

    this.code = code;
    this.obj = obj || null;
  }
}

function throwError(code, message, obj, ...params) {
  const error = new KnockOffError(code, message, obj, ...params);
  throw error;
}

function formatErrorWithMessage(message, error) {
  let m = error.message;
  if (error.obj) {
    if (error.obj.message) {
      m += ": " + String(error.obj.message);
    } else {
      m += ": " + String(error.obj);
    }
  }
  if (message) {
    m = message + ": " + m;
  }
  return m;
}

function formatErrorWithoutMessage(error) {
  return formatErrorWithMessage(null, error);
}

function logError(message, error) {
  console.error(formatErrorWithMessage(message, error));
}

export {
  errorCodes,
  KnockOffError,
  throwError,
  formatErrorWithMessage,
  formatErrorWithoutMessage,
  logError,
};
