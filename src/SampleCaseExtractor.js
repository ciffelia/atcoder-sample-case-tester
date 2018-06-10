class SampleCaseExtractor {
  // サンプルケースが記述されたpre要素のリストを取得
  getSampleCaseElms () {
    const sampleCaseElms = $('.lang-ja pre[id^="pre-sample"]')
    if (sampleCaseElms.length % 2 !== 0) {
      throw new Error('sampleCaseElms.length % 2 !== 0')
    }

    return sampleCaseElms
  }

  // サンプルケースの一覧を取得
  getSampleCases () {
    const sampleCaseElms = this.getSampleCaseElms()

    let sampleCases = []
    for (let i = 0; i < sampleCaseElms.length; i += 2) {
      sampleCases.push({
        input: sampleCaseElms.get(i).innerText,
        output: sampleCaseElms.get(i + 1).innerText
      })
    }

    if (sampleCases.length === 0) {
      throw new Error('sampleCases.length === 0')
    }

    return sampleCases
  }
}

export default SampleCaseExtractor
