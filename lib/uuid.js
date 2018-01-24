const uuidv1 = require('uuid/v1');
// eslint-disable-next-line no-process-env
module.exports = process.env.NODE_ENV === 'test' ? () => 'uuid' : () => uuidv1().replace(/-/g, '_');
