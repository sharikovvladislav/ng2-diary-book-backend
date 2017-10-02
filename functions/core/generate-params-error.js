module.exports = generateParamsError;

function generateParamsError(res, customMessage) {
  let response = {
    code: 'INCORRECT_PARAMS',
    message: 'Неправильно переданы параметры'
  };

  if (customMessage) {
    response.customMessage = customMessage;
  }

  res.status(400).send(response);
}
