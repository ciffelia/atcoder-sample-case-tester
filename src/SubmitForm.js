class SubmitForm {
  // 提出フォームで選択されている言語を取得
  getLanguageId () {
    return $('#select-lang select.current').val()
  }

  // 提出フォームに入力されたソースコードを取得
  getSourceCode () {
    if ($('.btn-toggle-editor').hasClass('active')) {
      return $('.plain-textarea').val()
    } else {
      return $('.editor').data('editor').doc.getValue()
    }
  }
}

export default SubmitForm
