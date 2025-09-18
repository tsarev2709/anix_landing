#!/usr/bin/env node

const stylelint = require('stylelint');
let prettier;
try {
  prettier = require('prettier');
} catch (error) {
  prettier = null;
}

if (prettier && typeof prettier.resolveConfig === 'function' && !prettier.resolveConfig.sync) {
  prettier.resolveConfig.sync = () => null;
}

if (prettier && typeof prettier.getFileInfo === 'function' && !prettier.getFileInfo.sync) {
  prettier.getFileInfo.sync = () => ({
    ignored: false,
    inferredParser: null,
  });
}

(async () => {
  try {
    const files = process.argv.slice(2);
    if (!files.length) {
      process.exit(0);
    }

    const result = await stylelint.lint({
      files,
      fix: true,
      formatter: 'string',
    });

    if (result.output) {
      process.stdout.write(result.output);
    }

    if (result.errored) {
      process.exit(1);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
