#!/usr/bin/env node

const AmazonScraper = require('../lib');

const startScraper = async (argv) => {
    argv.scrapeType = argv._[0];
    try {
        const data = await AmazonScraper[argv.scrapeType]({ ...argv, cli: true, rating: [argv['min-rating'], argv['max-rating']] });
        switch (argv.scrapeType) {
            case 'countries':
                console.table(data);
                break;
            case 'categories':
                console.table(data);
                break;
            case 'products':
            case 'reviews':
                if (!argv.filetype) {
                    console.log(JSON.stringify(data));
                }
                break;
            case 'asin':
                if (!argv.filetype) {
                    console.log(data.result[0]);
                }
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
};

require('yargs')
    .usage('Usage: $0 <command> [options]')
    .example(`$0 products -k 'Xbox one'`)
    .example(`$0 products -k 'Xbox one' --country 'GB'`)
    .example(`$0 reviews B01GW3H3U8`)
    .example(`$0 asin B01GW3H3U8`)
    .example(`$0 categories`)
    .example(`$0 countries`)
    .command('products', 'collect products by using keyword', {}, (argv) => {
        startScraper(argv);
    })
    .command('reviews [id]', 'collect reviews from product by using ASIN id', {}, (argv) => {
        startScraper(argv);
    })
    .command('asin [id]', 'single product details', {}, (argv) => {
        startScraper(argv);
    })
    .command('categories', 'get list of categories', {}, (argv) => {
        startScraper(argv);
    })
    .command('countries', 'get list of countries', {}, (argv) => {
        startScraper(argv);
    })
    .options({
        help: {
            alias: 'h',
            describe: 'help',
        },
        async: {
            alias: 'a',
            default: '5',
            type: 'string',
            describe: 'Number of async tasks',
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
            describe: "Type of the output file where the data will be saved. 'all' - save data to the 'json' and 'csv' files",
        },
        sort: {
            default: false,
            type: 'boolean',
            describe:
                'If searching for the products then the list will be sorted by the higher score(number of reviews*rating). If searching for the reviews then they will be sorted by the rating.',
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
        country: {
            default: 'US',
            type: 'string',
            describe:
                'In ISO 3166 (Alpha-2 code) format. To get available list of countries enter and use country_code value from the displayed table: amazon-buddy countries',
        },
        category: {
            default: 'aps',
            type: 'string',
            describe: 'To get available list of categories type and use {category} value from the displayed table: amazon-buddy categories',
        },
        'random-ua': {
            default: false,
            type: 'boolean',
            describe: 'Randomize user agent version. This helps to prevent request blocking from the amazon side',
        },
        'user-agent': {
            default: '',
            type: 'string',
            describe: 'Set custom user-agent',
        },
        timeout: {
            alias: 't',
            default: 0,
            type: 'number',
            describe: 'Timeout between requests. Timeout is set in mls: 1000 mls = 1 second',
        },
    })
    .check((argv) => {
        if (['products', 'reviews', 'asin', 'categories', 'countries'].indexOf(argv['_'][0]) === -1) {
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

        // Minimum allowed rating is 1
        if (!argv['min-rating']) {
            argv['min-rating'] = 1;
        }
        // Maximum allowed rating is 5
        if (!argv['max-rating']) {
            argv['max-rating'] = 5;
        }

        // If custom 'user-agent' was set then we need to make sure that 'random-ua' is disabled
        if (argv['random-ua'] && argv['user-agent']) {
            argv['random-ua'] = false;
        }
        if (argv['user-agent']) {
            argv.ua = argv['user-agent'];
        }
        if (argv['random-ua']) {
            argv.randomUa = true;
        }
        return true;
    })
    .demandCommand().argv;
