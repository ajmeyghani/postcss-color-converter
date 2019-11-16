const postcss = require('postcss');
const valueParser = require('postcss-values-parser');

const {
  parseHEXAColor,
  getRGBColorStr,
  getHSLColorStr,
  getRGBAColorStr,
  getHSLAColorStr,
  getHEXColorStr,
} = require('./src/utils');
const { CSS_COLOR_NAMES, colorFormats } = require('./src/colors');

const HEXRegExp = /#([a-f\d]{3}|[a-f\d]{6})($|\s)/i;
const HEXARegExp = /#([a-f\d]{4}|[a-f\d]{8})($|\s)/i;
const fullHEXRegExp = /#([a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})($|\s)/i;
const fullRGBRegExp = /rgba?\(/;
const fullHSLRegExp = /hsla?\(/;

const defaultOptions = {
  syntax: '',
  outputColorFormat: '',
  alwaysAlpha: false,
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
          decl.value && (
            fullHEXRegExp.test(decl.value) ||
            fullRGBRegExp.test(decl.value) ||
            fullHSLRegExp.test(decl.value)
          )
        ) {
          let valueObj = valueParser.parse(decl.value);

          valueObj.walk(node => {
            if (node.isColor) {
              if (currentOptions.outputColorFormat !== 'hex' && node.isHex) {
                const colorObj = parseHEXAColor(node.value);

                if (HEXRegExp.test(node.value)) {
                  if (currentOptions.outputColorFormat === 'rgb') {
                    node.value = currentOptions.alwaysAlpha
                      ? getRGBAColorStr(colorObj.hexColor, colorObj.hexAlpha, 'hex')
                      : getRGBColorStr(colorObj.hexColor, 'hex');
                  } else if (currentOptions.outputColorFormat === 'hsl') {
                    node.value = currentOptions.alwaysAlpha
                      ? getHSLAColorStr(colorObj.hexColor, colorObj.hexAlpha, 'hex')
                      : getHSLColorStr(colorObj.hexColor, 'hex');
                  }
                } else if (HEXARegExp.test(node.value)) {
                  if (currentOptions.outputColorFormat === 'rgb') {
                    node.value = getRGBAColorStr(colorObj.hexColor, colorObj.hexAlpha, 'hex');
                  } else if (currentOptions.outputColorFormat === 'hsl') {
                    node.value = getHSLAColorStr(colorObj.hexColor, colorObj.hexAlpha, 'hex');
                  }
                }
              } else if (
                currentOptions.outputColorFormat !== 'rgb' &&
                (node.name === 'rgb' || node.name === 'rgba')
              ) {
                const newNode = node.clone({ type: 'word' });

                if (currentOptions.outputColorFormat === 'hex') {
                  if (node.name === 'rgb') {
                    newNode.value = getHEXColorStr(
                      'rgb',
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                    );
                  } else if (node.name === 'rgba') {
                    newNode.value = getHEXColorStr(
                      'rgb',
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      +node.nodes[6].value,
                    );
                  }
                } else if (currentOptions.outputColorFormat === 'hsl') {
                  if (node.name === 'rgb') {
                    newNode.value = getHSLColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      'rgb',
                    );
                  } else if (node.name === 'rgba') {
                    newNode.value = getHSLAColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      +node.nodes[6].value,
                      'rgb',
                    );
                  }
                }

                node.replaceWith(newNode);
              } else if (
                currentOptions.outputColorFormat !== 'hsl' &&
                (node.name === 'hsl' || node.name === 'hsla')
              ) {
                const newNode = node.clone({ type: 'word' });

                if (currentOptions.outputColorFormat === 'hex') {
                  if (node.name === 'hsl') {
                    newNode.value = getHEXColorStr(
                      'hsl',
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                    );
                  } else if (node.name === 'hsla') {
                    newNode.value = getHEXColorStr(
                      'hsl',
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      +node.nodes[6].value,
                    );
                  }
                } else if (currentOptions.outputColorFormat === 'rgb') {
                  if (node.name === 'hsl') {
                    newNode.value = getRGBColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      'hsl',
                    );
                  } else if (node.name === 'hsla') {
                    newNode.value = getRGBAColorStr(
                      [+node.nodes[0].value, +node.nodes[2].value, +node.nodes[4].value],
                      +node.nodes[6].value,
                      'hsl',
                    );
                  }
                }

                node.replaceWith(newNode);
              }
            }
          });

          decl.value = valueObj.toString();
        }
      });
    } else {
      console.log('Сolor output format not provided, the plugin will do nothing');
    }
  };
});
