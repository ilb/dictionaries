export default class Response {
  static createResponse(httpCode, data, contentType) {
    if (data) {
      return { httpCode, data, contentType };
    } else {
      return { httpCode };
    }
  }
  static ok(data, contentType) {
    return Response.createResponse(200, data, contentType);
  }
  static noContent() {
    return Response.createResponse(204, null);
  }
  static badRequest(message) {
    return Response.createResponse(400, message, 'text/plain');
  }
  static internalError(message = 'Ошибка на сервере') {
    return Response.createResponse(500, message, 'text/plain');
  }
}
