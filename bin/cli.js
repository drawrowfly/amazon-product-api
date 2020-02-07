#!/usr/bin/env node
'use strict';

const os = require('os');

const AmazonScraper = require('../lib/instance');

const startScraper = async argv => {
    argv.scrapeType = argv._[0];
    try {
        await AmazonScraper({ ...argv, cli: true, rating: [argv['min-rating'], argv['max-rating']] })._startScraper();
    } catch (error) {
        console.log(error);
    }
};

require('yargs')
    .usage('Usage: $0 <command> [options]')
    .example(`$0 products -k 'Xbox one'`)
    .example(`$0 products -k 'Xbox one' -H 'www.amazon.de'`)
    .example(`$0 reviews -a B01GW3H3U8`)
    .command('products', 'scrape for a products from the provided key word', {}, argv => {
        startScraper(argv);
    })
    .command('reviews', 'scrape reviews from a product, by providing ASIN', {}, argv => {
        startScraper(argv);
    })
    .options({
        help: {
            alias: 'h',
            describe: 'help',
        },
        keyword: {
            alias: 'k',
            default: '',
            type: 'string',
            describe: "Amazon search keyword ex. 'Xbox one'",
        },
        asin: {
            alias: 'a',
            default: '',
            type: 'string',
            describe: 'To scrape reviews you need to provide product ASIN(amazon product id)',
        },
        number: {
            alias: 'n',
            default: 10,
            type: 'number',
            describe: 'Number of products to scrape. Maximum 100 products or 300 reviews',
        },
        save: {
            alias: 's',
            default: true,
            type: 'boolean',
            describe: 'Save to a CSV file?',
        },
        sort: {
            default: false,
            type: 'boolean',
            describe:
                'If searching for a products then list will be sorted by a higher score(number of reviews*rating). If searching for a reviews then they will be sorted by rating.',
        },
        discount: {
            alias: 'd',
            default: false,
            type: 'boolean',
            describe: 'Scrape only products with the discount',
        },
        sponsored: {
            default: false,
            type: 'boolean',
            describe: 'Scrape only sponsored products',
        },
        'min-rating': {
            default: 1,
            type: 'number',
            describe: 'Minimum allowed rating',
        },
        'max-rating': {
            default: 5,
            type: 'number',
            describe: 'Maximum allowed rating',
        },
        host: {
            alias: 'H',
            default: 'www.amazon.com',
            type: 'string',
            describe: 'The custom amazon host (can be www.amazon.fr, www.amazon.de, etc.)',
        },
    })
    .check(argv => {
        if (['products', 'reviews'].indexOf(argv['_'][0]) === -1) {
            throw 'Wrong command';
        }
        if (argv['_'][0] === 'products') {
            if (!argv.keyword || !argv.k) {
                throw 'Keyword is missing';
            }
        }
        if (argv['_'][0] === 'reviews') {
            if (!argv.asin || !argv.a) {
                throw 'AsinId is missing';
            }
        }
        if (!argv['min-rating']) {
            argv['min-rating'] = 1;
        }
        if (!argv['max-rating']) {
            argv['max-rating'] = 5;
        }
        return true;
    })
    .demandCommand().argv;
