// Wandboxで実行
const runOnWandbox = async (language, sourceCode, input) => {
  if (language.atCoderName === 'Java7 (OpenJDK 1.7.0)' || language.atCoderName === 'Java8 (OpenJDK 1.8.0)') {
    sourceCode = sourceCode.replace(/public\s+class\s+Main/g, 'class Main')
  }

  const params = {
    code: sourceCode,
    stdin: input,
    ...language.wandbox.params
  }

  const res = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })

  if (!res.ok) {
    throw new Error('!res.ok')
  }

  return res.json()
}

export default runOnWandbox
