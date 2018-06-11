import CustomTestResultExtractor from './CustomTestResultExtractor'
import CustomTestRunner from './CustomTestRunner'
import TestButton from './TestButton'
import { InfoAlert, ErrorAlert } from './Alert'
import SampleCaseExtractor from './SampleCaseExtractor'
import SubmitForm from './SubmitForm'
import ResultTable from './ResultTable'

const testButton = new TestButton()

const main = async () => {
  testButton.disable()

  let sourceCode, sampleCases, languageId
  try {
    const sampleCaseExtractor = new SampleCaseExtractor()
    sampleCases = sampleCaseExtractor.getSampleCases()

    const submitForm = new SubmitForm()
    languageId = submitForm.getLanguageId()
    sourceCode = submitForm.getSourceCode()
  } catch (err) {
    console.error(err)
    new ErrorAlert(err).show()
    testButton.enable()
    return
  }

  new InfoAlert('Running on AtCoder\'s custom test.').show()

  const resultTable = new ResultTable(sampleCases)
  resultTable.show()

  for (const [i, sampleCase] of sampleCases.entries()) {
    resultTable.setJudgingGif(i)

    try {
      const customTestResult = await new CustomTestRunner().run(languageId, sourceCode, sampleCase.input)
      const result = await new CustomTestResultExtractor().extract(sampleCase.output, customTestResult)
      resultTable.addResult(i, result, customTestResult)
    } catch (err) {
      console.error(err)
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
