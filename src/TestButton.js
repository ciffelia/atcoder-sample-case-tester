class TestButton {
  constructor () {
    this.btnElm = $(`
      <button type="button" class="btn btn-info" style="margin-right: 5px">
        Test sample cases on AtCoder's custom test
      </button>
    `.trim())
  }

  setListener (listener) {
    this.btnElm.click(listener)
  }

  insert () {
    this.btnElm.insertBefore('#submit')
  }

  disable () {
    this.btnElm.addClass('disabled')
  }

  enable () {
    this.btnElm.removeClass('disabled')
  }
}

export default TestButton
