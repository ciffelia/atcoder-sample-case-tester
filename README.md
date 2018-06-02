# atcoder-sample-case-tester

[![Build Status](https://travis-ci.org/prince0203/atcoder-sample-case-tester.svg?branch=master)](https://travis-ci.org/prince0203/atcoder-sample-case-tester)
[![Greenkeeper badge](https://badges.greenkeeper.io/prince0203/atcoder-sample-case-tester.svg)](https://greenkeeper.io/)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE)  
Detect sample cases on AtCoder and run tests on Wandbox
![screenshot](https://github.com/prince0203/atcoder-sample-case-tester/raw/master/img/screenshot.gif)

**日本語版のREADMEは[こちら](https://qiita.com/prince_0203/items/b9cd2986dd31d76899d0)をご覧ください。**

## Install

1. Install [TamperMonkey](https://tampermonkey.net/) on your browser.
2. Install script from [here](https://greasyfork.org/ja/scripts/368836-atcoder-sample-case-tester).

## Limitations

- Only works on [beta.atcoder.jp](https://beta.atcoder.jp/)
- Some languages are not supported (Java, Node.js, etc.)

## Supported languages

| AtCoder                   | Wandbox                                |
|---------------------------|----------------------------------------|
| Bash (GNU bash v4.3.11)   | bash 4.3.48(1)-release                 |
| C (GCC 5.4.1)             | gcc 5.4.0                              |
| C++14 (GCC 5.4.1)         | gcc 5.4.0, Boost 1.60.0                |
| C (Clang 3.8.0)           | clang 3.8.1                            |
| C++14 (Clang 3.8.0)       | clang 3.8.1, Boost 1.60.0              |
| C# (Mono 4.6.2.0)         | mcs 4.8.0.382                          |
| Common Lisp (SBCL 1.1.14) | sbcl 1.2.16                            |
| D (DMD64 v2.070.1)        | dmd 2.073.0                            |
| D (LDC 0.17.0)            | ldc 1.1.1 dmd-2.071.2                  |
| D (GDC 4.9.4)             | gdc HEAD 9.0.0 20180528 (experimental) |
| Go (1.6)                  | go 1.6.3                               |
| Haskell (GHC 7.10.3)      | ghc 7.10.3                             |
| OCaml (4.02.3)            | ocaml 4.04.0                           |
| Pascal (FPC 2.6.2)        | Free Pascal 2.6.2                      |
| Perl (v5.18.2)            | perl 5.18.4                            |
| PHP (5.6.30)              | php 5.6.30                             |
| Python2 (2.7.6)           | CPython 2.7.13                         |
| Python3 (3.4.3)           | CPython 3.4.3                          |
| Ruby (2.3.3)              | ruby 2.3.3                             |
| Scala (2.11.7)            | Scala 2.11.8                           |
| C++ (GCC 5.4.1)           | gcc 5.4.0, Boost 1.60.0                |
| C++ (Clang 3.8.0)         | clang 3.8.1, Boost 1.60.0              |
| Swift (swift-2.2-RELEASE) | Swift 2.2                              |
| Rust (1.15.1)             | rust 1.15.0                            |
| PyPy2 (5.6.0)             | pypy 5.6.0 cpython-2.7.12              |
| PyPy3 (2.4.0)             | pypy 5.5.0-alpha0 cpython-3.3.5        |
| Crystal (0.20.5)          | crystal 0.20.5                         |
| F# (Mono 4.0)             | fsharpc 4.0.0.4                        |
| Lua (5.3.2)               | Lua 5.3.4                              |
| LuaJIT (2.0.4)            | LuaJIT 2.0.4                           |
| Nim (0.13.0)              | nim 0.16.0                             |
| PHP7 (7.0.15)             | php 7.1.2                              |
