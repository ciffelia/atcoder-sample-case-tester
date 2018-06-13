class Alert {
  constructor (color, content) {
    this.alertElm = $(`
      <div role="alert" class="alert alert-${color} alert-dismissible" id="customTestAlert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        ${content}
      </div>
    `.trim())
  }

  show () {
    $('#customTestAlert').remove()
    this.alertElm.insertAfter('.form-horizontal')
  }
}

class InfoAlert extends Alert {
  constructor (message) {
    super('info', message)
  }
}

class ErrorAlert extends Alert {
  constructor (err, message = 'Error') {
    super('warning', `<strong>${message}:</strong> ${err.message}`)
  }
}

export { InfoAlert, ErrorAlert }
