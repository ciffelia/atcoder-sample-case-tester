import packageJson from './package.json'

const banner = `
// ==UserScript==
// @name         AtCoder Sample Case Tester
// @namespace    https://ciffelia.com/
// @version      ${packageJson.version}
// @description  ${packageJson.description}
// @author       ${packageJson.author}
// @license      ${packageJson.license}
// @homepage     ${packageJson.homepage}
// @supportURL   ${packageJson.bugs}
// @match        https://beta.atcoder.jp/contests/*/tasks/*
// @run-at       document-end
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
