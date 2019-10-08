"use strict";

const AmazonScraper = require("./lib/instance");

const scraper = ( options ) => {
    return new Promise( async (resolve, reject) => {
        try{
            resolve(await AmazonScraper(options)._startScraper());
        } catch(error){
            reject(error);
        }
    })
}

exports.products = ( options ) => {
    return new Promise( async (resolve, reject) => {
        options.scrapeType = 'products';
        try{
            return resolve(await scraper(options));
        }catch(error){
            return reject(error);
        }
    })
}

exports.reviews = ( options ) => {
    return new Promise( async (resolve, reject) => {
        options.scrapeType = 'reviews';
        try{
            return resolve(await scraper(options));
        }catch(error){
            return reject(error);
        }

    })
}