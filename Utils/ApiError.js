/** @description this class for optional error  */
class ApiError extends Error {
  constructor(massage, statusCode) {
    super(massage);
    this.statusCode = statusCode;
    this.status  = `${statusCode}`.startsWith(4) ? 'fail' : 'error'
  }
}
module.exports = ApiError;
