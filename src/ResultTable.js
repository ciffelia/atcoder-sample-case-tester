class ResultTable {
  constructor (sampleCases) {
    this.judgingGifElm = $('<img src="/public/img/icon/waiting.gif" />')

    this.tableElm = $('<table class="table table-bordered table-striped th-center" id="sampleTestResult" />')

    const theadElm = $(`
      <thead>
        <tr>
          <th>Sample</th>
          <th>Status</th>
          <th>Exit Code</a></th>
          <th>Exec Time</a></th>
          <th>Memory</a></th>
          <th />
        </tr>
      </thead>
    `.trim())

    const tbodyElm = $('<tbody />')

    for (const i of sampleCases.keys()) {
      $(`
        <tr>
          <td class="text-center">
            #${i + 1}
          </td>
          <td class="text-center">
            <span class="label label-default" aria-hidden="true" data-toggle="tooltip" data-original-title="ジャッジ中" id="customTest-result-${i}">WJ</span>
          </td>
          <td class="text-center">
            <span id="customTest-exitCode-${i}">-</span>
          </td>
          <td class="text-center">
            <span id="customTest-execTime-${i}">-</span>
          </td>
          <td class="text-center">
            <span id="customTest-memory-${i}">-</span>
          </td>
          <td class="text-center">
            <a target="blank" rel="noopener" role="button" class="btn btn-info btn-xs disabled" id="customTest-detail-${i}">More</a>
          </td>
        </tr>
      `.trim()).appendTo(tbodyElm)
    }

    tbodyElm.find('[data-toggle="tooltip"]').tooltip()

    this.tableElm.append(theadElm, tbodyElm)
  }

  show () {
    $('#sampleTestResult').remove()
    $('#customTestAlert').after(this.tableElm)
  }

  setJudgingGif (i) {
    $('#customTest-result-' + i).after(this.judgingGifElm)
  }

  removeJudgingGif () {
    this.judgingGifElm.remove()
  }

  addResult (i, result, detail) {
    const detailJson = JSON.stringify(detail, null, '  ')
    const detailJsonBlob = new Blob([detailJson], { type: 'application/json' })

    $('#customTest-result-' + i)
      .text(result.status)
      .attr('data-original-title', result.description)
      .removeClass('label-default')
      .addClass('label-' + result.color)

    $('#customTest-detail-' + i)
      .attr('href', URL.createObjectURL(detailJsonBlob))
      .removeClass('disabled')
  }
}

export default ResultTable
