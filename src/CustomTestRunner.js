import sleep from './sleep'

class CustomTestRunner {
  constructor () {
    const path = location.pathname
    const contestScreenName = path.match(/^\/contests\/([^/]+)/)[1]
    this.customTestUrl = `https://beta.atcoder.jp/contests/${contestScreenName}/custom_test`
  }

  async postSource (params) {
    const res = await fetch(this.customTestUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&')
    })

    if (!res.ok) {
      throw new Error('!res.ok')
    }
  }

  async getPageDoc () {
    const res = await fetch(this.customTestUrl, { credentials: 'include' })

    if (!res.ok) {
      throw new Error('!res.ok')
    }

    return new DOMParser().parseFromString(await res.text(), 'text/html')
  }

  isRunning (doc) {
    return $('#main-container table', doc).size() === 0
  }

  parseCsrfToken (doc) {
    return $('input[name=csrf_token]', doc).val()
  }

  parseResult (doc) {
    return {
      langId: $('#select-lang select.current', doc).val(),
      stdin: $('#input', doc).text(),
      stdout: $('#stdout', doc).text(),
      stderr: $('#stderr', doc).text(),
      exitCode: $('#main-container table tr:nth-child(1) td', doc).text(),
      execTime: $('#main-container table tr:nth-child(2) td', doc).text(),
      memory: $('#main-container table tr:nth-child(3) td', doc).text()
    }
  }

  async run (langId, code, input) {
    const csrfToken = this.parseCsrfToken(await this.getPageDoc())

    await this.postSource({
      csrf_token: csrfToken,
      'data.LanguageId': langId,
      input,
      sourceCode: code
    })

    while (true) {
      const pageDoc = await this.getPageDoc()
      if (!this.isRunning(pageDoc)) {
        return this.parseResult(pageDoc)
      }

      await sleep(800)
    }
  }
}

export default CustomTestRunner
