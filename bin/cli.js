#!/usr/bin/env node
"use strict";

const os = require("os");
 
const AmazonScraper = require("../lib/instance");

const startScraper = async (argv) => {
    argv.scrapeType = argv._[0];
    try{
        argv = {
            ...argv,
            cli: true,
        };
        
        await AmazonScraper(argv)._searchProduct()
    } catch(error){
        console.log(error);
    }
}

require("yargs")
    .usage('Usage: $0 <command> [options]')
    .example(`$0 search -k 'Xbox one'`)
    .command(
        "search", 
        "scrape for a products from the provided key word", 
        {}, 
        (argv) => {
            startScraper(argv);
        }
    )
    .options({
        'help': {
            alias: 'h',
            describe: 'help'
        },
        'keyword': {
            alias: 'k',
            default: '',
            type: 'string',
            describe: "Amazon search keyword ex. 'Xbox one'"
        },
        'number':{
            alias: 'n',
            default: 20,
            type: 'integer',
            describe: 'Number of products to scrape. Maximum 100'
        },
        'save':{
            alias: 's',
            default: false,
            type: 'boolean',
            describe: 'Save to a CSV file?'
        },
    })
    .demandCommand()
    .demandOption(['keyword'])
    .argv