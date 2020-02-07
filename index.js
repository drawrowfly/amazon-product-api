'use strict';

const AmazonScraper = require('./lib/instance');

const scraper = options => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await AmazonScraper(options)._startScraper());
        } catch (error) {
            reject(error);
        }
    });
};

exports.products = options => {
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

exports.reviews = options => {
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
