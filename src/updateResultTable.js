// 実行結果を表に反映
const updateResultTable = (resElm, detailElm, result, detail) => {
  resElm
    .text(result.status)
    .attr('data-original-title', result.description)
    .removeClass('label-default')
    .addClass('label-' + result.color)

  detailElm
    .attr('href', 'data:application/json;base64,' + btoa(JSON.stringify(detail, null, '  ')))
    .removeClass('disabled')
}

export default updateResultTable
