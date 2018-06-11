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

export default CustomTestResultExtractor
