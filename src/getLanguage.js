import languageList from './languageList'

// 選択された言語のIDを取得
const getLanguage = () => {
  const language = languageList[$('#select-lang select.current').val()]

  if (typeof language === 'undefined') {
    throw new Error('The language is not supported.')
  }

  return language
}

export default getLanguage
