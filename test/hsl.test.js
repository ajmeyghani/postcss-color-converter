const postcss = require('postcss');
const { assert } = require('chai');

const plugin = require('../index');

/* eslint-disable prefer-arrow-callback, func-names */

describe('postcss-color-converter for hsl colors', function () {
  function transform (source, opts) {
    return postcss([plugin(opts)]).process(source).css;
  }

  it('Input color should not be converted', function () {
    assert.equal(transform(
      'body { color: hsl(255, 0%, 0%); }',
      { outputColorFormat: 'hsl' },
    ), 'body { color: hsl(255, 0%, 0%); }');
  });

  it('Input color must be converted to hex', function () {
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 1); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff; }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 1); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff; }');
  });

  it('Input color must be converted to hexa', function () {
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff80; }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, .5); }',
      { outputColorFormat: 'hex' },
    ), 'body { color: #ffffff80; }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'hex', alwaysAlpha: true },
    ), 'body { color: #ffffff80; }');
  });

  it('Input color must be converted to rgb', function () {
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgb(255, 255, 255); }');
  });

  it('Input color must be converted to rgba', function () {
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'rgb' },
    ), 'body { color: rgba(255, 255, 255, 0.5); }');
    assert.equal(transform(
      'body { color: hsl(0, 0%, 100%); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(255, 255, 255, 1); }');
    assert.equal(transform(
      'body { color: hsla(0, 0%, 100%, 0.5); }',
      { outputColorFormat: 'rgb', alwaysAlpha: true },
    ), 'body { color: rgba(255, 255, 255, 0.5); }');
  });

  it('All input colors must be correct converted to hsl(a)', function () {
    assert.equal(transform(
      `ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 10%,
          #cd56ab80 20%,
          rgb(68, 187, 221) 30%,
          rgba(68, 188, 221, 0.5) 40%,
          hsl(56, 69%, 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'hsl' },
    ), `ul {
        background: linear-gradient(
          to bottom,
          hsl(317, 54%, 57%) 10%,
          hsla(317, 54%, 57%, 0.5) 20%,
          hsl(193, 69%, 57%) 30%,
          hsla(193, 69%, 57%, 0.5) 40%,
          hsl(56, 69%, 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          hsl(120, 100%, 25%) 100%,
        );
      }`);
    assert.equal(transform(
      `ul {
        background: linear-gradient(
          to bottom,
          #cd56ab 10%,
          #cd56ab80 20%,
          rgb(68, 187, 221) 30%,
          rgba(68, 188, 221, 0.5) 40%,
          hsl(56, 69%, 57%) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          green 100%,
        );
      }`,
      { outputColorFormat: 'hsl', alwaysAlpha: true },
    ), `ul {
        background: linear-gradient(
          to bottom,
          hsla(317, 54%, 57%, 1) 10%,
          hsla(317, 54%, 57%, 0.5) 20%,
          hsla(193, 69%, 57%, 1) 30%,
          hsla(193, 69%, 57%, 0.5) 40%,
          hsla(56, 69%, 57%, 1) 50%,
          hsla(56, 69%, 57%, 0.5) 60%,
          hsla(120, 100%, 25%, 1) 100%,
        );
      }`);
  });
});
