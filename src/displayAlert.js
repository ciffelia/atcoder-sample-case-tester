// アラートを表示
const displayAlert = (color, content) => {
  $('#wandboxAlert').remove()
  $(`
      <div role="alert" class="alert alert-${color} alert-dismissible" id="wandboxAlert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        ${content}
      </div>
  `.trim()).insertAfter('.form-horizontal')
}

const displayInfo = message => displayAlert('info', message)
const displayError = err => displayAlert('warning', `<strong>Error!</strong> ${err.message}`)

export { displayInfo, displayError }
