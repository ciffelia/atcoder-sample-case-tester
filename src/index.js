import TestButton from './TestButton'
import { InfoAlert, ErrorAlert } from './Alert'
import SampleCaseExtractor from './SampleCaseExtractor'
import SubmitForm from './SubmitForm'
import ResultTable from './ResultTable'
import runOnWandbox from './runOnWandbox'
import parseWandboxResult from './parseWandboxResult'

const testButton = new TestButton()

const main = async () => {
  testButton.disable()

  let sourceCode, sampleCases, language
  try {
    const sampleCaseExtractor = new SampleCaseExtractor()
    sampleCases = sampleCaseExtractor.getSampleCases()

    const submitForm = new SubmitForm()
    language = submitForm.getLanguage()
    sourceCode = submitForm.getSourceCode()
  } catch (err) {
    new ErrorAlert(err).show()
    testButton.enable()
    return
  }

  const langMoreUrl = 'data:application/json;base64,' + btoa(JSON.stringify(language, null, '  '))
  new InfoAlert(`
    Running on <strong>${language.wandbox.name}</strong> on Wandbox.
    <a href="${langMoreUrl}" target="blank" rel="noopener" class="alert-link">More</a>
  `).show()

  const resultTable = new ResultTable(sampleCases)
  resultTable.show()

  for (const [i, sampleCase] of sampleCases.entries()) {
    resultTable.setJudgingGif(i)

    try {
      const wandboxResult = await runOnWandbox(language, sourceCode, sampleCase.input)
      const result = parseWandboxResult(sampleCase, wandboxResult)
      resultTable.addResult(i, result, wandboxResult)
    } catch (err) {
      resultTable.addResult(i, {
        status: 'IE',
        description: 'Internal Error',
        color: 'warning'
      }, err)
    }

    resultTable.removeJudgingGif()
  }

  testButton.enable()
}

testButton.setListener(main)
testButton.insert()
