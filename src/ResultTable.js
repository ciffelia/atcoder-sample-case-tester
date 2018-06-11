class ResultTable {
  constructor (sampleCases) {
    this.judgingGifElm = $('<img src="/public/img/icon/waiting.gif" />')

    this.tableElm = $('<table class="table table-bordered table-striped th-center" id="sampleTestResult" />')

    for (const i of sampleCases.keys()) {
      $(`
        <tr>
          <td class="text-center">
            #${i}
          </td>
          <td class="text-center">
            <span class="label label-default" aria-hidden="true" data-toggle="tooltip" data-original-title="ジャッジ中" id="customTest-result-${i}">WJ</span>
          </td>
          <td class="text-center">
            <a target="blank" rel="noopener" role="button" class="btn btn-info btn-xs disabled" id="customTest-detail-${i}">More</a>
          </td>
        </tr>
      `.trim()).appendTo(this.tableElm)
    }

    this.tableElm.find('[data-toggle="tooltip"]').tooltip()
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
    $('#customTest-result-' + i)
      .text(result.status)
      .attr('data-original-title', result.description)
      .removeClass('label-default')
      .addClass('label-' + result.color)

    $('#customTest-detail-' + i)
      .attr('href', 'data:application/json;base64,' + btoa(JSON.stringify(detail, null, '  ')))
      .removeClass('disabled')
  }
}

export default ResultTable
