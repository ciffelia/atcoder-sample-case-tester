// ==UserScript==
// @name         AtCoder Sample Case Tester
// @namespace    https://ciffelia.com/
// @version      1.0.0
// @description  Detect sample cases on AtCoder and run tests on Wandbox
// @author       prince
// @match        https://beta.atcoder.jp/contests/*/tasks/*
// ==/UserScript==

(function () {
  'use strict';

  // アラートを表示
  const displayAlert = (color, content) => {
    $('#wandboxAlert').remove();
    $(`
      <div role="alert" class="alert alert-${color} alert-dismissible" id="wandboxAlert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        ${content}
      </div>
  `.trim()).insertAfter('.form-horizontal');
  };

  const displayInfo = message => displayAlert('info', message);
  const displayError = err => displayAlert('warning', `<strong>Error!</strong> ${err.message}`);

  // サンプルケースを検出
  const detectSampleCases = () => {
    const sampleElms = $('.lang-en pre[id^="pre-sample"]');
    if (sampleElms.length % 2 !== 0) {
      throw new Error('sampleElms.length % 2 !== 0')
    }

    let sampleCases = [];
    for (let i = 0; i < sampleElms.length; i += 2) {
      sampleCases.push({
        input: sampleElms.get(i).innerText,
        output: sampleElms.get(i + 1).innerText
      });
    }

    if (sampleCases.length === 0) {
      throw new Error('sampleCases.length === 0')
    }

    return sampleCases
  };

  // 入力されたソースコードを取得
  const getSourceCode = () => {
    if ($('.btn-toggle-editor').hasClass('active')) {
      return $('.plain-textarea').val()
    } else {
      return $('.editor').data('editor').doc.getValue()
    }
  };

  const languageList = {
    '3001': {
      atCoderName: 'Bash (GNU bash v4.3.11)',
      wandbox: {
        name: 'bash 4.3.48(1)-release',
        params: {
          'compiler': 'bash'
        }
      }
    },
    '3002': {
      atCoderName: 'C (GCC 5.4.1)',
      wandbox: {
        name: 'gcc 5.4.0',
        params: {
          'compiler': 'gcc-5.4.0-c',
          'compiler-option-raw': '-std=gnu11\n-O2\n-lm',
          'options': 'warning'
        }
      }
    },
    '3003': {
      atCoderName: 'C++14 (GCC 5.4.1)',
      wandbox: {
        name: 'gcc 5.4.0, Boost 1.60.0',
        params: {
          'compiler': 'gcc-5.4.0',
          'compiler-option-raw': '-std=gnu++1y\n-O2',
          'options': 'warning,boost-1.60.0-gcc-5.4.0'
        }
      }
    },
    '3004': {
      atCoderName: 'C (Clang 3.8.0)',
      wandbox: {
        name: 'clang 3.8.1',
        params: {
          'compiler': 'clang-3.8.1-c',
          'compiler-option-raw': '-O2\n-lm',
          'options': 'warning'
        }
      }
    },
    '3005': {
      atCoderName: 'C++14 (Clang 3.8.0)',
      wandbox: {
        name: 'clang 3.8.1, Boost 1.60.0',
        params: {
          'compiler': 'clang-3.8.1',
          'compiler-option-raw': '-std=c++14\n-stdlib=libc++\n-O2',
          'options': 'warning,boost-1.60.0-clang-3.8.1'
        }
      }
    },
    '3006': {
      atCoderName: 'C# (Mono 4.6.2.0)',
      wandbox: {
        name: 'mcs 4.8.0.382',
        params: {
          'compiler': 'mono-4.8.0.382',
          'compiler-option-raw': '-o+\n-r:System.Numerics'
        }
      }
    },
    '3008': {
      atCoderName: 'Common Lisp (SBCL 1.1.14)',
      wandbox: {
        name: 'sbcl 1.2.16',
        params: {
          'compiler': 'sbcl-1.2.16'
        }
      }
    },
    '3009': {
      atCoderName: 'D (DMD64 v2.070.1)',
      wandbox: {
        name: 'dmd 2.073.0',
        params: {
          'compiler': 'dmd-2.073.0',
          'compiler-option-raw': '-m64\n-w\n-O\n-release\n-inline'
        }
      }
    },
    '3010': {
      atCoderName: 'D (LDC 0.17.0)',
      wandbox: {
        name: 'ldc 1.1.1 dmd-2.071.2',
        params: {
          'compiler': 'ldc-1.1.1',
          'compiler-option-raw': '-O'
        }
      }
    },
    // D (GDC 4.9.4) は使用しているユーザーが全く見つからなかったため動作未確認
    '3011': {
      atCoderName: 'D (GDC 4.9.4)',
      wandbox: {
        name: 'gdc HEAD 9.0.0 20180528 (experimental)',
        params: {
          'compiler': 'gdc-head',
          'compiler-option-raw': '-O2\n-frelease'
        }
      }
    },
    '3013': {
      atCoderName: 'Go (1.6)',
      wandbox: {
        name: 'go 1.6.3',
        params: {
          'compiler': 'go-1.6.3'
        }
      }
    },
    '3014': {
      atCoderName: 'Haskell (GHC 7.10.3)',
      wandbox: {
        name: 'ghc 7.10.3',
        params: {
          'compiler': 'ghc-7.10.3',
          'compiler-option-raw': '-O2',
          'options': 'haskell-warning'
        }
      }
    },
    // AtCoderのソースをWandboxでそのまま実行するとCEになる
    // 解決策がわからないのでコメントアウト
    // '3015': {
    //   atCoderName: 'Java7 (OpenJDK 1.7.0)',
    //   wandbox: {
    //     name: 'OpenJDK jdk7u121-b00',
    //     params: {
    //       'compiler': 'openjdk-jdk7u121-b00'
    //     }
    //   }
    // },
    // '3016': {
    //   atCoderName: 'Java8 (OpenJDK 1.8.0)',
    //   wandbox: {
    //     name: 'OpenJDK jdk8u121-b13',
    //     params: {
    //       'compiler': 'openjdk-jdk8u121-b13'
    //     }
    //   }
    // },
    // AtCoderで使う /dev/stdin はWandboxでは使えない
    // 解決策がわからないのでコメントアウト
    // '3017': {
    //   atCoderName: 'JavaScript (node.js v5.12)',
    //   wandbox: {
    //     name: 'Node.js 5.12.0',
    //     params: {
    //       'compiler': 'nodejs-5.12.0'
    //     }
    //   }
    // },
    '3018': {
      atCoderName: 'OCaml (4.02.3)',
      wandbox: {
        name: 'ocaml 4.04.0',
        params: {
          'compiler': 'ocaml-4.04.0'
        }
      }
    },
    '3019': {
      atCoderName: 'Pascal (FPC 2.6.2)',
      wandbox: {
        name: 'Free Pascal 2.6.2',
        params: {
          'compiler': 'fpc-2.6.2',
          'compiler-option-raw': '-O2\n-Sd\n-Sh'
        }
      }
    },
    '3020': {
      atCoderName: 'Perl (v5.18.2)',
      wandbox: {
        name: 'perl 5.18.4',
        params: {
          'compiler': 'perl-5.18.4',
          'compiler-option-raw': '-W\n-c'
        }
      }
    },
    '3021': {
      atCoderName: 'PHP (5.6.30)',
      wandbox: {
        name: 'php 5.6.30',
        params: {
          'compiler': 'php-5.6.30',
          'compiler-option-raw': '-l'
        }
      }
    },
    '3022': {
      atCoderName: 'Python2 (2.7.6)',
      wandbox: {
        name: 'CPython 2.7.13',
        params: {
          'compiler': 'cpython-2.7.13',
          'compiler-option-raw': '-B'
        }
      }
    },
    '3023': {
      atCoderName: 'Python3 (3.4.3)',
      wandbox: {
        name: 'CPython 3.4.3',
        params: {
          'compiler': 'cpython-3.4.3',
          'compiler-option-raw': '-B'
        }
      }
    },
    '3024': {
      atCoderName: 'Ruby (2.3.3)',
      wandbox: {
        name: 'ruby 2.3.3',
        params: {
          'compiler': 'ruby-2.3.3',
          'compiler-option-raw': '--disable-gems -w -c'
        }
      }
    },
    '3025': {
      atCoderName: 'Scala (2.11.7)',
      wandbox: {
        name: 'Scala 2.11.8',
        params: {
          'compiler': 'scala-2.11.8',
          'compiler-option-raw': '-optimise'
        }
      }
    },
    '3029': {
      atCoderName: 'C++ (GCC 5.4.1)',
      wandbox: {
        name: 'gcc 5.4.0, Boost 1.60.0',
        params: {
          'compiler': 'gcc-5.4.0',
          'compiler-option-raw': '-std=gnu++03\n-O2',
          'options': 'warning,boost-1.60.0-gcc-5.4.0'
        }
      }
    },
    '3030': {
      atCoderName: 'C++ (Clang 3.8.0)',
      wandbox: {
        name: 'clang 3.8.1, Boost 1.60.0',
        params: {
          'compiler': 'clang-3.8.1',
          'compiler-option-raw': '-std=c++03\n-stdlib=libc++\n-O2',
          'options': 'warning,boost-1.60.0-clang-3.8.1'
        }
      }
    },
    '3503': {
      atCoderName: 'Swift (swift-2.2-RELEASE)',
      wandbox: {
        name: 'Swift 2.2',
        params: {
          'compiler': 'swift-2.2'
        }
      }
    },
    '3504': {
      atCoderName: 'Rust (1.15.1)',
      wandbox: {
        name: 'rust 1.15.0',
        params: {
          'compiler': 'rust-1.15.0',
          'compiler-option-raw': '-O'
        }
      }
    },
    '3509': {
      atCoderName: 'PyPy2 (5.6.0)',
      wandbox: {
        name: 'pypy 5.6.0 cpython-2.7.12',
        params: {
          'compiler': 'pypy-5.6.0'
        }
      }
    },
    '3510': {
      atCoderName: 'PyPy3 (2.4.0)',
      wandbox: {
        name: 'pypy 5.5.0-alpha0 cpython-3.3.5',
        params: {
          'compiler': 'pypy-5.5.0'
        }
      }
    },
    '3511': {
      atCoderName: 'Crystal (0.20.5)',
      wandbox: {
        name: 'crystal 0.20.5',
        params: {
          'compiler': 'crystal-0.20.5'
        }
      }
    },
    '3512': {
      atCoderName: 'F# (Mono 4.0)',
      wandbox: {
        name: 'fsharpc 4.0.0.4',
        params: {
          'compiler': 'fsharp-4.0.0.4'
        }
      }
    },
    '3514': {
      atCoderName: 'Lua (5.3.2)',
      wandbox: {
        name: 'Lua 5.3.4',
        params: {
          'compiler': 'lua-5.3.4'
        }
      }
    },
    '3515': {
      atCoderName: 'LuaJIT (2.0.4)',
      wandbox: {
        name: 'LuaJIT 2.0.4',
        params: {
          'compiler': 'luajit-2.0.4'
        }
      }
    },
    '3520': {
      atCoderName: 'Nim (0.13.0)',
      wandbox: {
        name: 'nim 0.16.0',
        params: {
          'compiler': 'nim-0.16.0',
          'compiler-option-raw': '-d:release'
        }
      }
    },
    '3524': {
      atCoderName: 'PHP7 (7.0.15)',
      wandbox: {
        name: 'php 7.1.2',
        params: {
          'compiler': 'php-7.1.2',
          'compiler-option-raw': '-l'
        }
      }
    }
  };

  // 選択された言語のIDを取得
  const getLanguage = () => {
    const language = languageList[$('#select-lang select.current').val()];

    if (typeof language === 'undefined') {
      throw new Error('The language is not supported.')
    }

    return language
  };

  // Wandboxで実行
  const runOnWandbox = async (language, sourceCode, input) => {
    const params = {
      code: sourceCode,
      stdin: input,
      ...language.wandbox.params
    };

    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      throw new Error('!res.ok')
    }

    return res.json()
  };

  // Wandboxから返された結果を解析
  const parseWandboxResult = (sampleCase, wandboxResult) => {
    const compileError = wandboxResult.compiler_error || '';
    const programOutput = wandboxResult.program_output || '';
    const sampleOutput = sampleCase.output;

    if (compileError !== '' && programOutput === '') {
      return {
        status: 'CE',
        description: 'Compilation Error',
        color: 'warning'
      }
    } else if (wandboxResult.signal === 'Killed') {
      return {
        status: 'RE/TLE/MLE',
        description: 'The program was terminated',
        color: 'warning'
      }
    } else if (wandboxResult.signal === 'File size limit exceeded') {
      return {
        status: 'OLE',
        description: 'Output Limit Exceeded',
        color: 'warning'
      }
    } else if (wandboxResult.status !== '0') {
      return {
        status: 'RE',
        description: 'Return code was not zero',
        color: 'warning'
      }
    } else if (programOutput === sampleOutput) {
      return {
        status: 'AC',
        description: 'Accepted',
        color: 'success'
      }
    } else if (programOutput.trim() === sampleOutput.trim()) {
      return {
        status: 'WA (Whitespace Error)',
        description: 'Answer is correct, but trailing linebreak was missing or extra spaces were found (space, tab, no-break space, LF, CR, etc.)',
        color: 'danger'
      }
    } else {
      return {
        status: 'WA',
        description: 'Wrong Answer',
        color: 'warning'
      }
    }
  };

  // 結果の表を表示
  const displayResultTable = sampleCases => {
    $('#sampleTestResult').remove();

    const tableElm = $('<table class="table table-bordered table-striped th-center" id="sampleTestResult" />');

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
    `.trim()).appendTo(tableElm);
    }

    tableElm.find('[data-toggle="tooltip"]').tooltip();
    tableElm.insertAfter('.form-horizontal');
  };

  // 実行結果を表に反映
  const updateResultTable = (resElm, detailElm, result, detail) => {
    resElm
      .text(result.status)
      .attr('data-original-title', result.description)
      .removeClass('label-default')
      .addClass('label-' + result.color);

    detailElm
      .attr('href', 'data:application/json;base64,' + btoa(JSON.stringify(detail, null, '  ')))
      .removeClass('disabled');
  };

  const main = async () => {
    const execButtonElm = $('#testOnWandbox');
    execButtonElm.addClass('disabled');

    const loadingGifElm = $('<img src="/public/img/icon/waiting.gif" />');

    let sourceCode, sampleCases, language;
    try {
      sourceCode = getSourceCode();
      sampleCases = detectSampleCases();
      language = getLanguage();
    } catch (err) {
      displayError(err);
      execButtonElm.removeClass('disabled');
      return
    }

    displayResultTable(sampleCases);

    const langMoreUrl = 'data:application/json;base64,' + btoa(JSON.stringify(language, null, '  '));
    displayInfo(`
    Running on <strong>${language.wandbox.name}</strong> on Wandbox.
    <a href="${langMoreUrl}" target="blank" rel="noopener" class="alert-link">More</a>
  `);

    for (const [i, sampleCase] of sampleCases.entries()) {
      const resElm = $('#wandbox-result-' + i);
      const detailElm = $('#wandbox-detail-' + i);

      loadingGifElm.insertAfter(resElm);

      try {
        const wandboxResult = await runOnWandbox(language, sourceCode, sampleCase.input);
        const result = parseWandboxResult(sampleCase, wandboxResult);
        updateResultTable(resElm, detailElm, result, wandboxResult);
      } catch (err) {
        updateResultTable(resElm, detailElm, {
          status: 'IE',
          description: 'Internal Error',
          color: 'warning'
        }, err);
      }

      loadingGifElm.remove();
    }

    execButtonElm.removeClass('disabled');
  };

  $(`
  <button type="button" class="btn btn-info" id="testOnWandbox" style="margin-right: 5px">
    Test sample cases on Wandbox
  </button>
`.trim())
    .insertBefore('#submit')
    .click(main);

}());
