const { assert } = require('chai');

const {
  getRGBColorStr,
  getRGBAColorStr,
  getHSLColorStr,
  getHSLAColorStr,
  getHEXColorStr,
} = require('../src/utils');

/* eslint-disable prefer-arrow-callback, func-names */

describe('Test convert functions', function () {
  it('Color must be correct converted to rgb', function () {
    assert.equal(getRGBColorStr('#ffffff', 'hex'), 'rgb(255, 255, 255)');
    assert.equal(getRGBColorStr('#CC55AA', 'hex'), 'rgb(204, 85, 170)');
    assert.equal(getRGBColorStr('#37b', 'hex'), 'rgb(51, 119, 187)');
    assert.equal(getRGBColorStr([0, 0, 100], 'hsl'), 'rgb(255, 255, 255)');
  });

  it('Color must be correct converted to rgba', function () {
    assert.equal(getRGBAColorStr('#ffffff', 'ff', 'hex'), 'rgba(255, 255, 255, 1)');
    assert.equal(getRGBAColorStr('#60cd56', '7e', 'hex'), 'rgba(96, 205, 86, 0.49)');
    assert.equal(getRGBAColorStr('#93b', '66', 'hex'), 'rgba(153, 51, 187, 0.4)');
    assert.equal(getRGBAColorStr([0, 0, 100], 0.4, 'hsl'), 'rgba(255, 255, 255, 0.4)');
  });

  it('Color must be correct converted to hsl', function () {
    assert.equal(getHSLColorStr('#ffffff', 'hex'), 'hsl(0, 0%, 100%)');
    assert.equal(getHSLColorStr('#CC55AA', 'hex'), 'hsl(317, 54%, 57%)');
    assert.equal(getHSLColorStr('#3b6', 'hex'), 'hsl(143, 57%, 47%)');
    assert.equal(getHSLColorStr([255, 255, 255], 'rgb'), 'hsl(0, 0%, 100%)');
  });

  it('Color must be correct converted to hsla', function () {
    assert.equal(getHSLAColorStr('#ffffff', 'ff', 'hex'), 'hsla(0, 0%, 100%, 1)');
    assert.equal(getHSLAColorStr('#db9a39', 'a1', 'hex'), 'hsla(36, 69%, 54%, 0.63)');
    assert.equal(getHSLAColorStr('#7b3', 'dd', 'hex'), 'hsla(90, 57%, 47%, 0.87)');
    assert.equal(getHSLAColorStr([255, 255, 255], 0.85, 'rgb'), 'hsla(0, 0%, 100%, 0.85)');
  });

  it('Color must be correct converted to hex', function () {
    assert.equal(getHEXColorStr('rgb', [255, 255, 255]), '#ffffff');
    assert.equal(getHEXColorStr('rgb', [55, 55, 55]), '#373737');
    assert.equal(getHEXColorStr('hsl', [317, 54, 57]), '#cd56ab');
  });

  it('Color must be correct converted to hexa', function () {
    assert.equal(getHEXColorStr('rgb', [255, 255, 255], 0.5), '#ffffff80');
    assert.equal(getHEXColorStr('hsl', [36, 69, 54], 0.63), '#db9a39a1');
  });
});
