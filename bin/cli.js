#!/usr/bin/env node

const AmazonScraper = require('../lib');

const startScraper = async (argv) => {
    argv.scrapeType = argv._[0];
    try {
        await AmazonScraper[argv.scrapeType]({ ...argv, cli: true, rating: [argv['min-rating'], argv['max-rating']] });
    } catch (error) {
        console.log(error);
    }
};

require('yargs')
    .usage('Usage: $0 <command> [options]')
    .example(`$0 products -k 'Xbox one'`)
    .example(`$0 products -k 'Xbox one' -H 'www.amazon.de'`)
    .example(`$0 reviews B01GW3H3U8`)
    .example(`$0 asin B01GW3H3U8`)
    .command('products', 'scrape for a products from the provided key word', {}, (argv) => {
        startScraper(argv);
    })
    .command('reviews [id]', 'scrape reviews from a product by using ASIN', {}, (argv) => {
        startScraper(argv);
    })
    .command('asin [id]', 'scrape data from a single product by using ASIN', {}, (argv) => {
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
        number: {
            alias: 'n',
            default: 20,
            type: 'number',
            describe: 'Number of products to scrape. Maximum 100 products or 300 reviews',
        },
        filetype: {
            default: 'csv',
            choices: ['csv', 'json', 'all', ''],
            describe: "Type of the output file where data will be saved. 'all' - save datat to the ` 'json' and 'csv' files",
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
        'random-ua': {
            default: false,
            type: 'boolean',
            describe: 'Randomize user agent version. This helps to prevent request blocking from the amazon side',
        },
        timeout: {
            alias: 't',
            default: 0,
            type: 'number',
            describe: 'Timeout between requests. Timeout is set in mls: 1000 mls = 1 second',
        },
    })
    .check((argv) => {
        if (['products', 'reviews', 'asin'].indexOf(argv['_'][0]) === -1) {
            throw 'Wrong command';
        }
        if (argv['_'][0] === 'products') {
            if (!argv.keyword || !argv.k) {
                throw 'Keyword is missing';
            }
        }
        if (argv['_'][0] === 'reviews') {
            if (!argv.id) {
                throw 'ASIN is missing';
            } else {
                argv.asin = argv.id;
            }
        }

        if (argv['_'][0] === 'asin') {
            if (!argv.id) {
                throw 'ASIN is missing';
            } else {
                argv.asin = argv.id;
            }
        }
        if (!argv['min-rating']) {
            argv['min-rating'] = 1;
        }
        if (!argv['max-rating']) {
            argv['max-rating'] = 5;
        }
        if (argv['random-ua']) {
            argv.randomUa = true;
        }
        return true;
    })
    .demandCommand().argv;
