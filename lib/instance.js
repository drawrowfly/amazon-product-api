'use strict';

const AmazonScraper = require('./');

let vending = (options) => {
    return vending.create(options);
};

vending.create = (options) => {
    return new AmazonScraper(options);
};

module.exports = vending;
