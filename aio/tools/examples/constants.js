const path = require('canonical-path');

exports.EXAMPLES_BASE_PATH = path.resolve(__dirname, '../../content/examples');
exports.EXAMPLE_CONFIG_FILENAME = 'example-config.json';
exports.SHARED_PATH = path.resolve(__dirname, 'shared');
exports.STACKBLITZ_CONFIG_FILENAME = 'stackblitz.json';
exports.BAZEL_EXAMPLE_BOILERPLATE_OUTPUT_PATH = process.env.BAZEL_EXAMPLE_BOILERPLATE_OUTPUT_PATH;
