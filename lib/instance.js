'use strict';

const AmazonScraper = require("./");

let vending = (options) => {
    return vending.create(options);
};

vending.create = (options) => {

    let instance = new AmazonScraper(options);

    return instance;
};


module.exports = vending;
