class TestButton {
  constructor () {
    this.btnElm = $(`
      <button type="button" class="btn btn-info" id="testOnWandbox" style="margin-right: 5px">
        Test sample cases on Wandbox
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
