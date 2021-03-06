const {
  parseHEXAColor,
  getRGBColorStr,
  getHSLColorStr,
  getHEXColorStr,
} = require('./utils');
const {
  DEFAULT_HEX_ALPHA,
  DEFAULT_ALPHA,
  HEX_COLOR,
  RGB_COLOR,
  HSL_COLOR,
  KEYWORD_COLOR,
} = require('./constants');

const convertingHEXColor = (node, options) => {
  const colorObj = parseHEXAColor(node.value);

  if (options.outputColorFormat === RGB_COLOR) {
    node.value = options.alwaysAlpha || colorObj.hexAlpha !== DEFAULT_HEX_ALPHA
      ? getRGBColorStr(HEX_COLOR, colorObj.hexColor, colorObj.hexAlpha)
      : getRGBColorStr(HEX_COLOR, colorObj.hexColor);
  } else if (options.outputColorFormat === HSL_COLOR) {
    node.value = options.alwaysAlpha || colorObj.hexAlpha !== DEFAULT_HEX_ALPHA
      ? getHSLColorStr(HEX_COLOR, colorObj.hexColor, colorObj.hexAlpha)
      : getHSLColorStr(HEX_COLOR, colorObj.hexColor);
  }

  return node;
};

const convertingRGBColor = (node, options) => {
  const newNode = node.clone({ type: 'word' });
  const [r, , g, , b, , a] = node.nodes;

  if (options.outputColorFormat === HEX_COLOR) {
    newNode.value = getHEXColorStr(
      RGB_COLOR,
      [+r.value, +g.value, +b.value],
      ((a && +a.value !== DEFAULT_ALPHA && +a.value)),
    );
  } else if (options.outputColorFormat === HSL_COLOR) {
    newNode.value = getHSLColorStr(
      RGB_COLOR,
      [+r.value, +g.value, +b.value],
      ((a && +a.value) || (options.alwaysAlpha && DEFAULT_ALPHA)),
    );
  } else if (options.outputColorFormat === RGB_COLOR) {
    newNode.value = getRGBColorStr(
      RGB_COLOR,
      [+r.value, +g.value, +b.value],
      (a && +a.value) || (options.alwaysAlpha && DEFAULT_ALPHA),
    );
  }

  node.replaceWith(newNode);

  return node;
};

const convertingHSLColor = (node, options) => {
  const newNode = node.clone({ type: 'word' });
  const [h, , s, , l, , a] = node.nodes;

  if (options.outputColorFormat === HEX_COLOR) {
    newNode.value = getHEXColorStr(
      HSL_COLOR,
      [+h.value, +s.value, +l.value],
      ((a && +a.value !== DEFAULT_ALPHA && +a.value)),
    );
  } else if (options.outputColorFormat === RGB_COLOR) {
    newNode.value = getRGBColorStr(
      HSL_COLOR,
      [+h.value, +s.value, +l.value],
      ((a && +a.value) || (options.alwaysAlpha && DEFAULT_ALPHA)),
    );
  } else if (options.outputColorFormat === HSL_COLOR) {
    newNode.value = getHSLColorStr(
      HSL_COLOR,
      [+h.value, +s.value, +l.value],
      (a && +a.value) || (options.alwaysAlpha && DEFAULT_ALPHA),
    );
  }

  node.replaceWith(newNode);

  return node;
};

const convertingKeywordColor = (node, options) => {
  if (options.outputColorFormat === HEX_COLOR) {
    node.value = getHEXColorStr(
      KEYWORD_COLOR,
      node.value,
    );
  } else if (options.outputColorFormat === RGB_COLOR) {
    node.value = getRGBColorStr(
      KEYWORD_COLOR,
      node.value,
      options.alwaysAlpha && DEFAULT_ALPHA,
    );
  } else if (options.outputColorFormat === HSL_COLOR) {
    node.value = getHSLColorStr(
      KEYWORD_COLOR,
      node.value,
      options.alwaysAlpha && DEFAULT_ALPHA,
    );
  }

  return node;
};

module.exports = {
  convertingHEXColor,
  convertingRGBColor,
  convertingHSLColor,
  convertingKeywordColor,
};
