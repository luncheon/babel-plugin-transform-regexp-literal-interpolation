const assert = require('assert')
const babel = require('@babel/core')
const plugins = [require('.')]
const tests = [
  {
    title: 'usage',
    code: `
      const sign = /[+-]/;
      const uint = /\d+/;
      const int = /[$$sign]?[$$uint]/;
      const
        exponent = /[eE][$$int]/,
        fractional = /[$$uint]\.|\d*\.\d+/,
        number = /[$$sign]?(?:[$$fractional])(?:[$$exponent])?/;
      console.log(+'-1.23e+4'.match(/^[$$number]$/)[0]); // -12300
    `,
    output: `
      const sign = /[+-]/;
      const uint = /\d+/;
      const int = /[+-]?\d+/;
      const
        exponent = /[eE][+-]?\d+/,
        fractional = /\d+\.|\d*\.\d+/,
        number = /[+-]?(?:\d+\.|\d*\.\d+)(?:[eE][+-]?\d+)?/;
      console.log(+'-1.23e+4'.match(/^[+-]?(?:\d+\.|\d*\.\d+)(?:[eE][+-]?\d+)?$/)[0]); // -12300
    `,
  },
  {
    title: 'flags',
    code: `
      const a = /a/m
      const ab = /[$$a]b/
      const ab_i = /[$$a]b/i
      const ab_gm = /[$$a]b/gm
    `,
    output: `
      const a = /a/m;
      const ab = /ab/;
      const ab_i = /ab/i;
      const ab_gm = /ab/gm;
    `,
  },
  {
    title: 'error: not found',
    error: true,
    code: `
      const ab = /[$$a]/
    `,
  },
  {
    title: 'error: let',
    error: true,
    code: `
      let a = /a/
      const ab = /[$$a]/
    `,
  },
  {
    title: 'error: var',
    error: true,
    code: `
      var a = /a/
      const ab = /[$$a]/
    `,
  },
  {
    title: 'error: not regexp literal',
    error: true,
    code: `
      const a = 'a'
      const ab = /[$$a]/
    `,
  },
  {
    title: 'error: referencing self',
    error: true,
    code: `
      const a = /[$$a]/
    `,
  },
  {
    title: 'error: referencing before declaration',
    error: true,
    code: `
      const ab = /[$$a]b/
      const a = /a/
    `,
  },
  {
    title: 'error: referencing before declaration',
    error: true,
    code: `
      const ab = /[$$a]b/, a = /a/
    `,
  },
]

tests.forEach(({ code, output, error, title }, i) => {
  if (error) {
    assert.throws(() => babel.transformSync(code, { plugins, retainLines: true }))
  } else {
    const actual = babel.transformSync(code, { plugins, retainLines: true }).code.trim()
    const expected = output.trim().replace(/^ */gm, '')
    assert.strictEqual(actual, expected)
  }
  console.log('  ✅', title)
})
