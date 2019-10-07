"use strict";

const AmazonScraper = require("./lib/instance");

const scraper = ( options ) => {
    return new Promise( async (resolve, reject) => {
        try{
            resolve(await AmazonScraper(options)._searchProduct());
        } catch(error){
            reject(error);
        }
    })
}

module.exports = scraper;