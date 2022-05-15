/**
 * Base of response handler
 * Note: `should not be used in controller`
 * @param res     - response object passed by express
 * @param status  - status code of a response
 * @param success  - success boolean
 * @param data - the response data
 * @param message - description of a response
 * @param errors  - list of errors if any
 * @s response
 */
const responseHandler = (
  res,
  status,
  success,
  data = undefined,
  message = '',
  errors = undefined
) => res.status(status).json({ success, data, message, errors })

/**
 * Bad Request :
 * The server could not understand the request due to invalid syntax
 * @param res response object
 * @param errors list of errors
 * @param message description
 */
exports.bad_request = (res, errors, message = 'Bad Request') =>
  responseHandler(res, 400, false, undefined, message, errors)

/**
 * Unauthorized :
 * The client must authenticate itself to get the requested response
 * @param res response object
 * @param errors list of errors
 * @param message description
 */
exports.unauthorized = (res, errors, message = 'Unauthorized') =>
  responseHandler(res, 401, false, undefined, message, errors)

/**
 * Forbidden :
 * The client does not have access rights to the data
 * @param res response object
 * @param errors list of errors
 * @param message description
 */
exports.forbidden = (res, errors, message = 'Forbidden') =>
  responseHandler(res, 403, false, undefined, message, errors)

/**
 * Not Found
 * The server can not find the requested resource
 * @param res response object
 * @param errors list of errors
 * @param message description
 */
exports.not_found = (res, errors, message = 'Not found') =>
  responseHandler(res, 404, false, undefined, message, errors)

/**
 * Conflict
 * This response is sent when a request conflicts with the current state of the server
 * @param res response object
 * @param errors list of errors
 * @param message description
 */
exports.conflict = (res, errors, message = 'Conflict') =>
  responseHandler(res, 409, false, undefined, message, errors)

/**
 * Unprocessable Entity
 * The request was well-formed but was unable to be followed due to semantic errors
 * @param res response object
 * @param errors list of errors
 * @param message description
 */
exports.unprocessable_entity = (
  res,
  errors,
  message = 'Unprocessable Entity'
) => responseHandler(res, 422, false, undefined, message, errors)

/**
 * Internal Server Error
 * The server encountered an unexpected condition that prevented it from fulfilling the request
 * @param res response object
 * @param errors list of errors
 * @param message description
 */
exports.internal_server_error = (
  res,
  errors,
  message = 'Internal Server Error'
) => responseHandler(res, 500, false, undefined, message, errors)

/**
 * Ok
 * The request has succeeded
 * @param res response object
 * @param data response data
 * @param message description
 */
exports.success = (res, data, message = 'Success') =>
  responseHandler(res, 200, true, data, message, undefined)

/**
 * Created
 * The request has succeeded and a new resource has been created as a result
 * @param res response object
 * @param data response data
 * @param message description
 */
exports.created = (res, data, message = 'Created') =>
  responseHandler(res, 201, true, data, message, undefined)
