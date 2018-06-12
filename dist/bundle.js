// ==UserScript==
// @name         AtCoder Sample Case Tester
// @namespace    https://ciffelia.com/
// @version      3.0.1
// @description  Detect sample cases on AtCoder and run custom tests
// @author       prince <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @license      MIT
// @homepage     https://github.com/prince0203/atcoder-sample-case-tester#readme
// @supportURL   https://github.com/prince0203/atcoder-sample-case-tester/issues
// @match        https://beta.atcoder.jp/contests/*/tasks/*
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  class CustomTestResultExtractor {
    extract (expected, res) {
      if (res.exitCode === '-1') {
        return {
          status: 'CE',
          description: 'Compilation Error',
          color: 'warning'
        }
      } else if (res.exitCode === '9') {
        return {
          status: 'TLE / MLE',
          description: 'Time Limit Exceeded / Memory Limit Exceeded',
          color: 'warning'
        }
      } else if (res.exitCode === '153') {
        return {
          status: 'OLE',
          description: 'Output Limit Exceeded',
          color: 'warning'
        }
      } else if (res.exitCode !== '0') {
        return {
          status: 'RE',
          description: 'Return code was not zero',
          color: 'warning'
        }
      } else if (expected.trim() === res.stdout.trim()) {
        return {
          status: 'AC',
          description: 'Accepted',
          color: 'success'
        }
      } else {
        return {
          status: 'WA',
          description: 'Wrong Answer',
          color: 'warning'
        }
      }
    }
  }

  const sleep = ms => new Promise(resolve => {
    setTimeout(resolve, ms);
  });

  class CustomTestRunner {
    constructor () {
      const path = location.pathname;
      const contestScreenName = path.match(/^\/contests\/([^/]+)/)[1];
      this.customTestUrl = `https://beta.atcoder.jp/contests/${contestScreenName}/custom_test`;
    }

    async postSource (params) {
      const res = await fetch(this.customTestUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&')
      });

      if (!res.ok) {
        throw new Error('!res.ok')
      }
    }

    async getPageDoc () {
      const res = await fetch(this.customTestUrl, { credentials: 'include' });

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
      const csrfToken = this.parseCsrfToken(await this.getPageDoc());

      await this.postSource({
        csrf_token: csrfToken,
        'data.LanguageId': langId,
        input,
        sourceCode: code
      });

      while (true) {
        const pageDoc = await this.getPageDoc();
        if (!this.isRunning(pageDoc)) {
          return this.parseResult(pageDoc)
        }

        await sleep(800);
      }
    }
  }

  class TestButton {
    constructor () {
      this.btnElm = $(`
      <button type="button" class="btn btn-info" style="margin-right: 5px">
        Test sample cases on AtCoder's custom test
      </button>
    `.trim());
    }

    setListener (listener) {
      this.btnElm.click(listener);
    }

    insert () {
      this.btnElm.insertBefore('#submit');
    }

    disable () {
      this.btnElm.addClass('disabled');
    }

    enable () {
      this.btnElm.removeClass('disabled');
    }
  }

  class Alert {
    constructor (color, content) {
      this.alertElm = $(`
      <div role="alert" class="alert alert-${color} alert-dismissible" id="customTestAlert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        ${content}
      </div>
    `.trim());
    }

    show () {
      $('#customTestAlert').remove();
      this.alertElm.insertAfter('.form-horizontal');
    }
  }

  class InfoAlert extends Alert {
    constructor (message) {
      super('info', message);
    }
  }

  class ErrorAlert extends Alert {
    constructor (err) {
      super('warning', `<strong>Error!</strong> ${err.message}`);
    }
  }

  class SampleCaseExtractor {
    // サンプルケースが記述されたpre要素のリストを取得
    getSampleCaseElms () {
      const sampleCaseElms = $('.lang-ja pre[id^="pre-sample"]');
      if (sampleCaseElms.length % 2 !== 0) {
        throw new Error('sampleCaseElms.length % 2 !== 0')
      }

      return sampleCaseElms
    }

    // サンプルケースの一覧を取得
    getSampleCases () {
      const sampleCaseElms = this.getSampleCaseElms();

      let sampleCases = [];
      for (let i = 0; i < sampleCaseElms.length; i += 2) {
        sampleCases.push({
          input: sampleCaseElms.get(i).innerText,
          output: sampleCaseElms.get(i + 1).innerText
        });
      }

      if (sampleCases.length === 0) {
        throw new Error('sampleCases.length === 0')
      }

      return sampleCases
    }
  }

  class SubmitForm {
    // 提出フォームで選択されている言語を取得
    getLanguageId () {
      return $('#select-lang select.current').val()
    }

    // 提出フォームに入力されたソースコードを取得
    getSourceCode () {
      if ($('.btn-toggle-editor').hasClass('active')) {
        return $('.plain-textarea').val()
      } else {
        return $('.editor').data('editor').doc.getValue()
      }
    }
  }

  class ResultTable {
    constructor (sampleCases) {
      this.judgingGifElm = $('<img src="/public/img/icon/waiting.gif" />');

      this.tableElm = $('<table class="table table-bordered table-striped th-center" id="sampleTestResult" />');

      for (const i of sampleCases.keys()) {
        $(`
        <tr>
          <td class="text-center">
            #${i}
          </td>
          <td class="text-center">
            <span class="label label-default" aria-hidden="true" data-toggle="tooltip" data-original-title="ジャッジ中" id="customTest-result-${i}">WJ</span>
          </td>
          <td class="text-center">
            <a target="blank" rel="noopener" role="button" class="btn btn-info btn-xs disabled" id="customTest-detail-${i}">More</a>
          </td>
        </tr>
      `.trim()).appendTo(this.tableElm);
      }

      this.tableElm.find('[data-toggle="tooltip"]').tooltip();
    }

    show () {
      $('#sampleTestResult').remove();
      $('#customTestAlert').after(this.tableElm);
    }

    setJudgingGif (i) {
      $('#customTest-result-' + i).after(this.judgingGifElm);
    }

    removeJudgingGif () {
      this.judgingGifElm.remove();
    }

    addResult (i, result, detail) {
      const detailJson = JSON.stringify(detail, null, '  ');
      const detailJsonBlob = new Blob([detailJson], { type: 'application/json' });

      $('#customTest-result-' + i)
        .text(result.status)
        .attr('data-original-title', result.description)
        .removeClass('label-default')
        .addClass('label-' + result.color);

      $('#customTest-detail-' + i)
        .attr('href', URL.createObjectURL(detailJsonBlob))
        .removeClass('disabled');
    }
  }

  const testButton = new TestButton();

  const main = async () => {
    testButton.disable();

    let sourceCode, sampleCases, languageId;
    try {
      const sampleCaseExtractor = new SampleCaseExtractor();
      sampleCases = sampleCaseExtractor.getSampleCases();

      const submitForm = new SubmitForm();
      languageId = submitForm.getLanguageId();
      sourceCode = submitForm.getSourceCode();
    } catch (err) {
      console.error(err);
      new ErrorAlert(err).show();
      testButton.enable();
      return
    }

    new InfoAlert('Running on AtCoder\'s custom test.').show();

    const resultTable = new ResultTable(sampleCases);
    resultTable.show();

    for (const [i, sampleCase] of sampleCases.entries()) {
      resultTable.setJudgingGif(i);

      try {
        const customTestResult = await new CustomTestRunner().run(languageId, sourceCode, sampleCase.input);
        const result = await new CustomTestResultExtractor().extract(sampleCase.output, customTestResult);
        resultTable.addResult(i, result, customTestResult);
      } catch (err) {
        console.error(err);
        resultTable.addResult(i, {
          status: 'IE',
          description: 'Internal Error',
          color: 'warning'
        }, err);
      }

      resultTable.removeJudgingGif();
    }

    testButton.enable();
  };

  testButton.setListener(main);
  testButton.insert();

}());
