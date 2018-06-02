// サンプルケースを検出
const detectSampleCases = () => {
  const sampleElms = $('.lang-ja pre[id^="pre-sample"]')
  if (sampleElms.length % 2 !== 0) {
    throw new Error('sampleElms.length % 2 !== 0')
  }

  let sampleCases = []
  for (let i = 0; i < sampleElms.length; i += 2) {
    sampleCases.push({
      input: sampleElms.get(i).innerText,
      output: sampleElms.get(i + 1).innerText
    })
  }

  if (sampleCases.length === 0) {
    throw new Error('sampleCases.length === 0')
  }

  return sampleCases
}

export default detectSampleCases
