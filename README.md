# babel-plugin-transform-regexp-literal-interpolation

input:

```javascript
const sign = /[+-]/;
const uint = /\d+/;
const int = /[$$sign]?[$$uint]/;
const
  exponent = /[eE][$$int]/,
  fractional = /[$$uint]\.|\d*\.\d+/,
  number = /[$$sign]?(?:[$$fractional])(?:[$$exponent])?/;
console.log(+'-1.23e+4'.match(/^[$$number]$/)[0]); // -12300
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
console.log(+'-1.23e+4'.match(/^[+-]?(?:\d+\.|\d*\.\d+)(?:[eE][+-]?\d+)?$/)[0]); // -12300
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
