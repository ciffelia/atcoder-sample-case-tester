// Wandboxから返された結果を解析
const parseWandboxResult = (sampleCase, wandboxResult) => {
  const compileError = wandboxResult.compiler_error || ''
  const programOutput = wandboxResult.program_output || ''
  const sampleOutput = sampleCase.output

  if (compileError !== '' && programOutput === '') {
    return {
      status: 'CE',
      description: 'Compilation Error',
      color: 'warning'
    }
  } else if (wandboxResult.signal === 'Killed') {
    return {
      status: 'RE/TLE/MLE',
      description: 'The program was terminated',
      color: 'warning'
    }
  } else if (wandboxResult.signal === 'File size limit exceeded') {
    return {
      status: 'OLE',
      description: 'Output Limit Exceeded',
      color: 'warning'
    }
  } else if (wandboxResult.status !== '0') {
    return {
      status: 'RE',
      description: 'Return code was not zero',
      color: 'warning'
    }
  } else if (programOutput === sampleOutput) {
    return {
      status: 'AC',
      description: 'Accepted',
      color: 'success'
    }
  } else if (programOutput.trim() === sampleOutput.trim()) {
    return {
      status: 'WA (Whitespace Error)',
      description: 'Answer is correct, but trailing linebreak was missing or extra spaces were found (space, tab, no-break space, LF, CR, etc.)',
      color: 'danger'
    }
  } else {
    return {
      status: 'WA',
      description: 'Wrong Answer',
      color: 'warning'
    }
  }
}

export default parseWandboxResult
