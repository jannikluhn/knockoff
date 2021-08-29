const errorCodes = {
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  CHAIN_ERROR: "CHAIN_ERROR",
  APOLLO_ERROR: "APOLLO_ERROR",
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

function logError(message, error) {
  let m = error.message;
  if (error.obj) {
    m += String(error.obj);
  }
  if (message) {
    m = message + ": " + m;
  }
  console.error(m);
}

export { errorCodes, KnockOffError, throwError, logError };
