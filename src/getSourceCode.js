// 入力されたソースコードを取得
const getSourceCode = () => {
  if ($('.btn-toggle-editor').hasClass('active')) {
    return $('.plain-textarea').val()
  } else {
    return $('.editor').data('editor').doc.getValue()
  }
}

export default getSourceCode
