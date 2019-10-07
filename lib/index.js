'use strict'

const rp = require('request-promise');
const { jar } = require('request');
const fs = require('fs');
const Bluebird = require('bluebird');
const cheerio = require('cheerio');
const ora = require('ora');
const spinner = ora('Amazon Scraper on Duty');
const Json2csvParser = require('json2csv').Parser;

const json2csvParser = new Json2csvParser({ fields: ['title', 'price', 'rating', 'reviews', 'score', 'url', 'sponsored', 'discounted', 'before_discount', 'asin' ] });


class AmazonScraper{
    constructor({ keyword, number, sponsored, proxy, cli, save }){
        this._mainHost = `https://www.amazon.com/`;
        this._cookieJar = jar();
        this._scrapedProducts = {};
        this._endProductList = [];
        this._keyword = keyword;
        this._number = parseInt(number) || 20;
        this._continue = true;
        this._searchPage = 1;
        this._sponsored = sponsored || false;
        this._proxy = proxy;
        this._save = save || false;
        this._cli = cli || false;
    }

    _request({uri, headers, method, qs, json, body, form, timeout}){
        return new Promise( async (resolve, reject) => {
            try{
                let response = await rp({
                    uri: uri ? `${this._mainHost}${uri}` : this._mainHost,
                    method,
                    ...(qs ? { qs } : {}),
                    ...(body ? { body } : {}),
                    ...(form ? { form } : {}),
                    'headers':{
                        'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:69.0) Gecko/20100101 Firefox/69.0',
                        ...headers,
                        'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'accept-language':'en-US,en;q=0.5',
                        'accept-encoding':'gzip, deflate, br',
                        'te':'trailers',
                    },
                    ...(json ?{ json: true } : {}),
                    'gzip':true,
                    'jar': this._cookieJar,
                    'resolveWithFullResponse': true,
                    ...(this._proxy ? {proxy:`https://${this._proxy}/`} : {}),
                });

                resolve(response);
            } catch(error){
                reject(error)
            }
        })
    }

    _openMainPage(){
        return new Promise( async (resolve, reject) => {
            let request = {
                'method': 'GET',
            }
            try{
                resolve(await this._request(request));
            } catch(error){
                reject(error)
            }
        })
    }

    _searchProduct(){
        return new Promise( async (resolve, reject) => {
            if (!this._keyword){
                return reject('Keyword is missing');
            }
            if (this._number>100){
                return reject('Wow.... slow down cowboy. Maximum you can get is 100 products');
            }
            if (typeof(this._sponsored)!=='boolean'){
                return reject('Sponsored can only be {true} or {false}');
            }
            if(this._cli){
                spinner.start()
            }
            
            await this._openMainPage();
            while(this._continue){
                if (Object.keys(this._scrapedProducts).length>=this._number){
                    break;
                }
                let body = await this._initSearch();
                this._grabProduct(body);
            }
            for(let key in this._scrapedProducts){
                this._endProductList.push(this._scrapedProducts[key])
            }
            this._endProductList.sort((a,b)=>{
                return b.score-a.score;
            })
            if (this._save){
                fs.writeFileSync(`${Date.now()}.csv`, json2csvParser.parse(this._endProductList));
            }
            if (this._cli){
                spinner.stop()
            }
            resolve(this._endProductList)
        })
    }

    _initSearch(){
        return new Promise( async (resolve, reject) => {
            let request = {
                'method': 'GET',
                'uri': 's',
                'qs':{
                    'k': this._keyword,
                    ...(this._searchPage>1 ? {'page': this._searchPage, 'ref': `sr_pg_${this._searchPage}` }: {})
                },
                'headers':{
                    'referer':'https://www.amazon.com/',
                }
            }
            try{
                let response = await this._request(request);
                this._searchPage++;
                resolve(response.body);
            } catch(error){
                reject(error)
            }
        })
    }

    _grabProduct(body){
        let $ = cheerio.load(body.replace(/\s\s+/g, '').replace(/\n/g, ''));
        let productList = $('div[data-index]');
        for(let i=0; i<productList.length; i++){
            if (Object.keys(this._scrapedProducts).length >=this._number){
                break;
            }
            if (!productList[i].attribs['data-asin']){
                continue;
            }
            this._scrapedProducts[productList[i].attribs['data-asin']] = { asin: productList[i].attribs['data-asin'], discounted: false, sponsored: false }
        }
        for (let key in this._scrapedProducts){
            let search = $(`div[data-asin=${key}] .a-offscreen`);
            try{
                this._scrapedProducts[key].price = search[0].children[0].data;
                if (search.length>1){
                    this._scrapedProducts[key].before_discount = search[1].children[0].data;
                    this._scrapedProducts[key].discounted = true;
                }
            }catch(err){
                continue;
            }
        }

        for (let key in this._scrapedProducts){
            let search = $(`div[data-asin=${key}] .a-icon-star-small`);
            try{
                this._scrapedProducts[key].rating = parseFloat(search[0].children[0].children[0].data)
                this._scrapedProducts[key].reviews = parseInt(search[0].parent.parent.parent.next.attribs['aria-label'].replace(/\,/g, ''));
                this._scrapedProducts[key].score = parseFloat(this._scrapedProducts[key].rating*this._scrapedProducts[key].reviews).toFixed(2);
            }catch(err){
                continue;
            }
        }
        for (let key in this._scrapedProducts){
            let search = $(`div[data-asin=${key}] [data-image-source-density="1"]`);
            try{
                this._scrapedProducts[key].title = search[0].attribs.alt
                this._scrapedProducts[key].url = `https://www.amazon.com${search[0].parent.parent.attribs.href}`;
            }catch(err){
                continue;
            }
        }
        return;
    }
}

module.exports = AmazonScraper;