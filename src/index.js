import { displayInfo, displayError } from './displayAlert'
import detectSampleCases from './detectSampleCases'
import getSourceCode from './getSourceCode'
import getLanguage from './getLanguage'
import runOnWandbox from './runOnWandbox'
import parseWandboxResult from './parseWandboxResult'
import displayResultTable from './displayResultTable'
import updateResultTable from './updateResultTable'

const main = async () => {
  const execButtonElm = $('#testOnWandbox')
  execButtonElm.addClass('disabled')

  const loadingGifElm = $('<img src="/public/img/icon/waiting.gif" />')

  let sourceCode, sampleCases, language
  try {
    sourceCode = getSourceCode()
    sampleCases = detectSampleCases()
    language = getLanguage()
  } catch (err) {
    displayError(err)
    execButtonElm.removeClass('disabled')
    return
  }

  displayResultTable(sampleCases)

  const langMoreUrl = 'data:application/json;base64,' + btoa(JSON.stringify(language, null, '  '))
  displayInfo(`
    Running on <strong>${language.wandbox.name}</strong> on Wandbox.
    <a href="${langMoreUrl}" target="blank" rel="noopener" class="alert-link">More</a>
  `)

  for (const [i, sampleCase] of sampleCases.entries()) {
    const resElm = $('#wandbox-result-' + i)
    const detailElm = $('#wandbox-detail-' + i)

    loadingGifElm.insertAfter(resElm)

    try {
      const wandboxResult = await runOnWandbox(language, sourceCode, sampleCase.input)
      const result = parseWandboxResult(sampleCase, wandboxResult)
      updateResultTable(resElm, detailElm, result, wandboxResult)
    } catch (err) {
      updateResultTable(resElm, detailElm, {
        status: 'IE',
        description: 'Internal Error',
        color: 'warning'
      }, err)
    }

    loadingGifElm.remove()
  }

  execButtonElm.removeClass('disabled')
}

$(`
  <button type="button" class="btn btn-info" id="testOnWandbox" style="margin-right: 5px">
    Test sample cases on Wandbox
  </button>
`.trim())
  .insertBefore('#submit')
  .click(main)
