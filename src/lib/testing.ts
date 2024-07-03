export function phoneCheck(countryCode, phoneNumber) {
  var telStr
  switch (countryCode) {
    case '+86':
      telStr =
        /^[1](([3][0-9])|([4][0-9])|([5][0-9])|([6][0-9])|([7][0-9])|([8][0-9])|([9][0-9]))[0-9]{8}$/

      return telStr.test(phoneNumber)

    case '+886':
      telStr = /^[09]\d{8}$/

      return telStr.test(phoneNumber)

    case '+852':
      telStr = /^[5|6|9]\d{7}$/

      return telStr.test(phoneNumber)

    default:
      return /\D/g.test(phoneNumber) ? false : true
  }
}
