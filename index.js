const postcss = require('postcss');
const valueParser = require('postcss-values-parser');
const convert = require('color-convert');

const {
  getRGBColorStr,
  getHSLColorStr,
  getRGBAColorStr,
  getHSLAColorStr,
} = require('./src/utils');
const { CSS_COLOR_NAMES, colorFormats } = require('./src/colors');

const regexpHEX = /#([a-f\d]{3}|[a-f\d]{6})($|\s)/i;
const regexpHEXAlpha = /#([a-f\d]{4}|[a-f\d]{8})($|\s)/i;
const fullHEXRegExp = /#([a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})($|\s)/i;
const regexpRGB = /rgb?a\(/;
const regexpHSL = /hsl?a\(/;

const defaultOptions = {
  syntax: '',
  outputColorFormat: '',
};

module.exports = postcss.plugin('postcss-color-converter', (opts = {}) => {
  let currentOptions = {
    ...defaultOptions,
    ...opts,
  };

  return style => {
    if (
      currentOptions.outputColorFormat &&
      colorFormats.includes(currentOptions.outputColorFormat)
    ) {
      style.walkDecls(decl => {
        if (
          decl.value &&
          (fullHEXRegExp.test(decl.value) ||
          regexpRGB.test(decl.value) ||
          regexpHSL.test(decl.value))
        ) {
          let value = decl.value;
          let valueObj = valueParser.parse(value);

          if (fullHEXRegExp) {
            valueObj.walk(node => {
              if (node.type === 'word' && node.isColor && node.isHex) {
                if (regexpHEX.test(node.value)) {
                  if (currentOptions.outputColorFormat === 'rgb') {
                    node.value = getRGBColorStr(node.value, 'hex');
                  } else if (currentOptions.outputColorFormat === 'hsl') {
                    node.value = getHSLColorStr(node.value, 'hex');
                  }
                } else if (regexpHEXAlpha.test(node.value)) {
                  if (currentOptions.outputColorFormat === 'rgb') {
                    node.value = getRGBAColorStr(node.value, 'hex');
                  } else if (currentOptions.outputColorFormat === 'hsl') {
                    node.value = getHSLAColorStr(node.value, 'hex');
                  }
                }
              }
            });
          }

          if (regexpRGB.test(value)) {
            valueObj.walk(node => {
              if (node.type === 'word' && node.isColor) {
                if (currentOptions.outputColorFormat === 'hex') {
                  const newNode = node.clone({ type: 'word' });
                  newNode.value = `#${ convert.rgb.hex(node.nodes[0], node.nodes[2], node.nodes[4]) }`;
                  node.replaceWith(newNode);
                }
                if (currentOptions.outputColorFormat === 'hsl') {
                  node.value = getHSLColorStr(node.value, 'rgb');
                }
              }
            });
          }

          if (regexpHSL.test(value) && currentOptions.outputColorFormat === 'rgb') {
            valueObj.walk(node => {
              if (node.type === 'word' && node.isColor && node.isHex) {
                node.value = `rgb(${ convert.hex.rgb(node.value).join(', ') })`;
              }
            });
          }

          decl.value = valueObj.toString();
        }
      });
    } else {
      console.log('Сolor output format not provided, the plugin will do nothing');
    }
  };
});
