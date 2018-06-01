import packageJson from './package.json'

const banner = `
// ==UserScript==
// @name         AtCoder Sample Case Tester
// @namespace    https://ciffelia.com/
// @version      ${packageJson.version}
// @description  ${packageJson.description}
// @author       ${packageJson.author}
// @match        https://beta.atcoder.jp/contests/*/tasks/*
// ==/UserScript==
`.trim() + '\n'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    banner
  }
}
