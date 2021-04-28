
// DOM purify config
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const DOMPurify = createDOMPurify(new JSDOM().window);

module.exports = DOMPurify;