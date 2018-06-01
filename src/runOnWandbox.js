// Wandboxで実行
const runOnWandbox = async (language, sourceCode, input) => {
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
