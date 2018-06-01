// 結果の表を表示
const displayResultTable = sampleCases => {
  $('#sampleTestResult').remove()

  const tableElm = $('<table class="table table-bordered table-striped th-center" id="sampleTestResult" />')

  for (const i of sampleCases.keys()) {
    $(`
      <tr>
        <td class="text-center">
          #${i}
        </td>
        <td class="text-center">
          <span class="label label-default" aria-hidden="true" data-toggle="tooltip" data-original-title="ジャッジ中" id="wandbox-result-${i}">WJ</span>
        </td>
        <td class="text-center">
          <a target="blank" rel="noopener" role="button" class="btn btn-info btn-xs disabled" id="wandbox-detail-${i}">More</a>
        </td>
      </tr>
    `.trim()).appendTo(tableElm)
  }

  tableElm.find('[data-toggle="tooltip"]').tooltip()
  tableElm.insertAfter('.form-horizontal')
}

export default displayResultTable
