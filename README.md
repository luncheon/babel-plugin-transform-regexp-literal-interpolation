# babel-plugin-transform-regexp-literal-interpolation

> ⚠️ You don't need this plugin. Consider template literals with `String.raw` tag.
>
> ```javascript
> const sign = /[+-]/
> const uint = RegExp(String.raw`\d+`)
> const int = RegExp(String.raw`${sign.source}?${uint.source}`)
> ```
>
> * [String.raw() - JavaScript | MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/raw)

input:

```javascript
const sign = /[+-]/;
const uint = /\d+/;
const int = /[$$sign]?[$$uint]/;
const
  exponent = /[eE][$$int]/,
  fractional = /[$$uint]\.|\d*\.\d+/,
  number = /[$$sign]?(?:[$$fractional])(?:[$$exponent])?/;
console.log(+'A-1.23e+4'.match(/^A([$$number])$/)[1]); // -12300
```

output:

```javascript
const sign = /[+-]/;
const uint = /\d+/;
const int = /[+-]?\d+/;
const
  exponent = /[eE][+-]?\d+/,
  fractional = /\d+\.|\d*\.\d+/,
  number = /[+-]?(?:\d+\.|\d*\.\d+)(?:[eE][+-]?\d+)?/;
console.log(+'A-1.23e+4'.match(/^A([+-]?(?:\d+\.|\d*\.\d+)(?:[eE][+-]?\d+))?$/)[1]); // -12300
```

## Install

```bash
npm install --save-dev @babel/core luncheon/babel-plugin-transform-regexp-literal-interpolation
```

## Usage

.babelrc

```json
{
  "plugins": ["babel-plugin-transform-regexp-literal-interpolation"]
}
```

## License

[WTFPL](http://www.wtfpl.net/)
