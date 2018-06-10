import languageList from './languageList'

class SubmitForm {
  // 提出フォームで選択されている言語を取得
  getLanguage () {
    const language = languageList[$('#select-lang select.current').val()]

    if (typeof language === 'undefined') {
      throw new Error('The language is not supported.')
    }

    return language
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
