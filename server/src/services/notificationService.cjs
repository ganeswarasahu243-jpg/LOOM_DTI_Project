function sendOtpEmail(email, code, purpose) {
  return {
    channel: 'email',
    delivered: true,
    preview: {
      email,
      code,
      purpose,
    },
  }
}

function sendOtpSms(phone, code, purpose) {
  return {
    channel: 'sms',
    delivered: true,
    preview: {
      phone,
      code,
      purpose,
    },
  }
}

function sendReleaseAlert(userId, message) {
  return {
    channel: 'alert-log',
    delivered: true,
    preview: {
      userId,
      message,
    },
  }
}

module.exports = { sendOtpEmail, sendOtpSms, sendReleaseAlert }
