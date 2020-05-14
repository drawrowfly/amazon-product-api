'use strict';

const AmazonScraper = require('./Amazon');

const scraper = async (options) => await new AmazonScraper(options)._startScraper();

exports.products = (options) => {
    options.scrapeType = 'products';
    if (options.event) {
        return AmazonScraper(options);
    }
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await scraper(options));
        } catch (error) {
            return reject(error);
        }
    });
};

exports.reviews = (options) => {
    options.scrapeType = 'reviews';
    if (options.event) {
        return AmazonScraper(options);
    }
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await scraper(options));
        } catch (error) {
            return reject(error);
        }
    });
};

exports.asin = (options) => {
    options.scrapeType = 'asin';
    if (options.event) {
        return AmazonScraper(options);
    }
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await scraper(options));
        } catch (error) {
            return reject(error);
        }
    });
};
