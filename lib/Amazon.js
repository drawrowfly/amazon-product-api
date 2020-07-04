// @ts-nocheck
'use strict';

const rp = require('request-promise');

const { jar } = require('request');
const { writeFile } = require('fs');

const { fromCallback } = require('bluebird');
const cheerio = require('cheerio');

const ora = require('ora');
const spinner = ora('Amazon Scraper Started');

const { Parser } = require('json2csv');
const EventEmitter = require('events');

const CONST = require('./constant');

class AmazonScraper extends EventEmitter {
    constructor({
        keyword,
        number = 20,
        sponsored,
        proxy,
        cli,
        filetype = '',
        scrapeType,
        asin,
        sort,
        discount,
        host,
        event,
        rating = [1, 5],
        ua,
        timeout,
        randomUa,
        page = 1,
        bulk = true,
        category = '',
        cookie = '',
    }) {
        super();
        this._mainHost = `https://${host || 'www.amazon.com'}`;

        this._cookieJar = jar();
        this._scrapedProducts = {};
        this.cookie = cookie;
        this.bulk = bulk;
        this.productSearchCategory = category;
        this.collector = [];
        this._keyword = keyword;
        this._number = parseInt(number) || CONST.defaultItemLimit;
        this._continue = true;
        this._searchPage = page;
        this._sponsored = sponsored || false;
        this._proxy = proxy;
        this._cli = cli || false;
        this._scrapeType = scrapeType;
        this._asin = asin;
        this._sort = sort || false;
        this._discount = discount || false;
        this._event = event || false;
        this._rating = rating;
        this._minRating = 1;
        this._maxRating = 5;
        this.timeout = timeout;
        this.randomUa = randomUa;
        this.totalProducts = 0;
        this.fileType = filetype;
        this.jsonToCsv = new Parser({ flatten: true });
        this.initTime = Date.now();

        this.ua = ua || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36';
    }

    /**
     * Get user agent
     * if randomUa then user agent version will be randomized, this helps to prevent request blocking from the amazon side
     */
    get userAgent() {
        return this.randomUa
            ? `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${
                  Math.floor(Math.random() * 14) + 65
              }.0.4044.113 Safari/537.36`
            : this.ua;
    }

    /**
     * Main request method
     * @param {*} param0
     */
    _request({ uri, headers, method, qs, json, body, form }) {
        return new Promise(async (resolve, reject) => {
            const options = {
                uri: uri ? `${this._mainHost}/${uri}` : this._mainHost,
                method,
                ...(qs ? { qs } : {}),
                ...(body ? { body } : {}),
                ...(form ? { form } : {}),
                headers: {
                    'user-agent': this.userAgent,
                    ...headers,
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'accept-language': 'en-US,en;q=0.5',
                    'accept-encoding': 'gzip, deflate, br',
                    te: 'trailers',
                },
                ...(json ? { json: true } : {}),
                gzip: true,
                jar: this._cookieJar,
                resolveWithFullResponse: true,
                ...(this._proxy ? { proxy: `http://${this._proxy}/` } : {}),
            };

            try {
                const response = await rp(options);
                setTimeout(() => {
                    resolve(response);
                }, this.timeout);
            } catch (error) {
                reject(error);
            }
        });
    }

    _returnError(error) {
        if (this._event) {
            return this.emit('error message', error);
        } else {
            throw error;
        }
    }

    /**
     * Start scraper
     */
    async _startScraper() {
        if (this._scrapeType === 'products') {
            if (!this._keyword) {
                return this._returnError('Keyword is missing');
            }
            if (this._number > CONST.limit.product) {
                return this._returnError(`Wow.... slow down cowboy. Maximum you can get is ${CONST.limit.product} products`);
            }
            if (typeof this._sponsored !== 'boolean') {
                return this._returnError('Sponsored can only be {true} or {false}');
            }
        }
        if (this._scrapeType === 'reviews') {
            if (!this._asin) {
                return this._returnError('ASIN is missing');
            }
            if (this._number > CONST.limit.reviews) {
                return this._returnError(`Wow.... slow down cowboy. Maximum you can get is ${CONST.limit.reviews} reviews`, reject);
            }
        }
        if (this._scrapeType === 'asin') {
            if (!this._asin) {
                return this._returnError('ASIN is missing');
            }
        }
        if (!Array.isArray(this._rating)) {
            return this._returnError('rating can only be an array with length of 2', reject);
        }

        if (this._rating.length > 2) {
            return this._returnError('rating can only be an array with length of 2', reject);
        }

        if (!parseFloat(this._rating[0]) || !parseFloat(this._rating[1])) {
            return this._returnError('rating can only contain 2 float values', reject);
        }

        this._minRating = parseFloat(this._rating[0]);

        this._maxRating = parseFloat(this._rating[1]);

        if (this._minRating > this._maxRating) {
            return this._returnError(`min rating can't be larger then max rating`, reject);
        }
        if (this._cli) {
            spinner.start();
        }

        await this.mainLoop();

        if (this._event) {
            this.emit('completed');
        }

        if (!this._event) {
            this.sortAndFilterResult();

            await this.saveResultToFile();

            if (this._cli) {
                spinner.stop();
            }
            if (this.fileType && this._cli) {
                console.log(`Result was saved to: ${this.fileName}`);
            }
            return {
                ...(this._scrapeType === 'products' ? { totalProducts: this.totalProducts, category: this.productSearchCategory || 'all' } : {}),
                result: this.collector,
            };
        }
    }

    /**
     * Main loop that collects data
     * NOTE: while loop is very inefficient and should be replaced
     */
    async mainLoop() {
        while (this._continue) {
            if (this.collector.length >= this._number && this.bulk) {
                break;
            }
            try {
                let body = await this._initSearch();
                if (this._scrapeType === 'asin') {
                    this._grapAsinDetails(body);
                    break;
                }
                if (this._scrapeType === 'products') {
                    let totalResultCount = body.match(/"totalResultCount":\w+(.[0-9])/gm);

                    if (totalResultCount) {
                        this.totalProducts = totalResultCount[0].split('totalResultCount":')[1];
                    }
                    this._grabProduct(body);
                }
                if (this._scrapeType === 'reviews') {
                    this._grabReviews(body);
                }
            } catch (error) {
                if (this._event) {
                    this.emit('error message', error);
                }
                break;
            }
            if (!this.bulk) {
                break;
            }
        }
    }

    /**
     * Get filename
     */
    get fileName() {
        switch (this._scrapeType) {
            case 'products':
                return `${this._scrapeType}(${this._keyword})_${this.initTime}`;
            case 'reviews':
            case 'asin':
                return `${this._scrapeType}(${this._asin})_${this.initTime}`;
            default:
                throw new Error(`Unknow scraping type: ${this._scrapeType}`);
        }
    }
    /**
     * Save results to the file
     */
    async saveResultToFile() {
        if (this.collector.length) {
            switch (this.fileType) {
                case 'json':
                    await fromCallback((cb) => writeFile(`${this.fileName}.json`, JSON.stringify(this.collector), cb));
                    break;
                case 'csv':
                    await fromCallback((cb) => writeFile(`${this.fileName}.csv`, this.jsonToCsv.parse(this.collector), cb));
                    break;
                case 'all':
                    await Promise.all([
                        await fromCallback((cb) => writeFile(`${this.fileName}.json`, JSON.stringify(this.collector), cb)),
                        await fromCallback((cb) => writeFile(`${this.fileName}.csv`, this.jsonToCsv.parse(this.collector), cb)),
                    ]);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Sort and filet the result data
     */
    sortAndFilterResult() {
        if (this._scrapeType === 'reviews') {
            if (this._sort) {
                this.collector.sort((a, b) => b.rating - a.rating);
            }
        }
        if (this._scrapeType === 'products') {
            if (this._sort) {
                this.collector.sort((a, b) => b.score - a.score);
            }
            if (this._discount) {
                this.collector = this.collector.filter((item) => item.discounted);
            }
            if (this._sponsored) {
                this.collector = this.collector.filter((item) => item.sponsored);
            }
        }
        if (this._scrapeType === 'products' || this._scrapeType === 'reviews') {
            this.collector = this.collector.filter((item) => this._validateRating(item));
        }
    }

    get setRequestEndpoint() {
        switch (this._scrapeType) {
            case 'products':
                return 's';
            case 'reviews':
                return `product-reviews/${this._asin}/`;
            case 'asin':
                return `dp/${this._asin}/ref=sspa_dk_detail_3?psc=1`;
            default:
                throw new Error('Unknow type');
        }
    }
    /**
     * Create request
     */
    async _initSearch() {
        const options = {
            method: 'GET',
            uri: this.setRequestEndpoint,
            qs: {
                ...(this._scrapeType === 'products'
                    ? {
                          k: this._keyword,
                          ...(this.productSearchCategory ? { i: this.productSearchCategory } : {}),
                          ...(this._searchPage > 1 ? { page: this._searchPage, ref: `sr_pg_${this._searchPage}` } : {}),
                      }
                    : {}),
                ...(this._scrapeType === 'reviews' ? { ...(this._searchPage > 1 ? { pageNumber: this._searchPage } : {}) } : {}),
            },
            headers: {
                referer: this._mainHost,
                cookie: this.cookie,
            },
        };
        try {
            let response = await this._request(options);
            this._searchPage++;
            return response.body;
        } catch (error) {
            throw error.message;
        }
    }

    /**
     * Collect reviews from the html response
     * @param {} body
     */
    _grabReviews(body) {
        let $ = cheerio.load(body.replace(/\s\s+/g, '').replace(/\n/g, ''));
        let reviewsList = $('.a-section.a-spacing-none.review-views.celwidget')[0].children;
        let scrapingResult = {};
        for (let i = 0; i < reviewsList.length; i++) {
            let totalInResult = Object.keys(scrapingResult).length + this.collector.length;
            if (totalInResult >= this._number && this.bulk) {
                break;
            }
            if (!reviewsList[i].attribs['id']) {
                continue;
            }

            scrapingResult[reviewsList[i].attribs['id']] = { id: reviewsList[i].attribs['id'] };
        }
        for (let key in scrapingResult) {
            let search = $(`#${key} [data-hook="review-date"]`);

            try {
                scrapingResult[key].review_data = search[0].children[0].data;
            } catch (error) {
                continue;
            }
        }
        for (let key in scrapingResult) {
            let search = $(`#${key} .a-profile-name`);

            try {
                scrapingResult[key].name = search[0].children[0].data;
            } catch (error) {
                continue;
            }
        }
        for (let key in scrapingResult) {
            let search = $(`#${key} [data-hook="review-star-rating"]`);

            try {
                scrapingResult[key].rating = parseFloat(search[0].children[0].children[0].data.split(' ')[0]);
            } catch (error) {
                continue;
            }
        }
        for (let key in scrapingResult) {
            let search = $(`#${key} [data-hook="review-title"]`);

            try {
                scrapingResult[key].title = $(search[0]).text().toString();
            } catch (error) {
                continue;
            }
        }
        for (let key in scrapingResult) {
            let search = $(`#${key} [data-hook="review-body"]`);

            try {
                scrapingResult[key].review = $(search[0]).text();
            } catch (error) {
                continue;
            }
        }

        if (Object.keys(scrapingResult).length < 1) {
            this._continue = false;
            return;
        }

        for (let key in scrapingResult) {
            if (this._event) {
                let item = this._validateRating(scrapingResult[key]);
                if (item) {
                    this.emit('item', scrapingResult[key]);
                }
            }

            this.collector.push(scrapingResult[key]);
        }
        return;
    }

    /**
     * Collect asin details from the html response
     * @param {*} body
     */
    _grapAsinDetails(body) {
        body = body.replace(/\s\s+/g, '').replace(/\n/g, '');

        const $ = cheerio.load(body.replace(/\s\s+/g, '').replace(/\n/g, ''));

        const output = {
            title: '',
            url: `${this._mainHost}/dp/${this._asin}`,
            reviews: {
                total_reviews: 0,
                rating: 0,
                answered_questions: 0,
            },
            price: {
                current_price: 0,
                discounted: false,
                before_price: 0,
                savings_amount: 0,
                savings_percent: 0,
            },
            images: [],
            storeID: '',
            brand: '',
            soldBy: '',
            fulfilledBy: '',
            qtyPerOrder: 'na',
            badges: {
                amazonChoice: false,
                amazonPrime: false,
            },
        };

        const merchantInfo = $('div[id="merchant-info"]').text();
        if (merchantInfo) {
            try {
                if (merchantInfo.indexOf('Ships from and sold by ') > -1) {
                    const splitSoldBy = merchantInfo.split('Ships from and sold by ')[1];
                    output.soldBy = splitSoldBy.slice(0, -1);
                    output.fulfilledBy = splitSoldBy.slice(0, -1);
                } else {
                    const splitSoldBy = merchantInfo.split('Sold by ')[1].split(' and ');
                    output.soldBy = splitSoldBy[0];
                    output.fulfilledBy = splitSoldBy[1].split('Fulfilled by ')[1].slice(0, -1);
                }
            } catch (error) {
                //continue regardless of error
            }
        }

        const maxOrderQty = $('select[id="quantity"]');

        if (maxOrderQty) {
            try {
                output.qtyPerOrder = maxOrderQty[0] ? maxOrderQty[0].children.length : 'na';
            } catch (error) {
                //continue regardless of error
            }
        }

        output.title = $(`span[id="productTitle"]`).text();
        output.reviews.total_reviews = $(`span[id="acrCustomerReviewText"]`).text().split(/\s/)[0]
            ? parseInt(
                  $(`span[id="acrCustomerReviewText"]`)
                      .text()
                      .split(/\s/)[0]
                      .replace(/[^0-9]/g, ''),
                  10,
              )
            : 0;
        output.reviews.answered_questions = $(`a[id="askATFLink"]`).text() ? parseInt($(`a[id="askATFLink"]`).text(), 10) : 0;
        output.reviews.rating = $(`span.reviewCountTextLinkedHistogram.noUnderline`)[0]
            ? $($(`span.reviewCountTextLinkedHistogram.noUnderline`)[0]).text().split(/\s/g)[0]
            : 0;

        output.price.current_price = $(`span.a-color-price`)[0]
            ? parseFloat(
                  $($(`span.a-color-price`)[0].children[0])
                      .text()
                      .replace(/[^D+0-9.,]/g, ''),
                  2,
              ) || 0
            : 0;

        output.storeID = $(`input[id="storeID"]`).val();
        output.brand = $(`a[id="bylineInfo"]`).text() || '';

        output.badges.amazonChoice = $(`div.ac-badge-wrapper`)[0] ? true : false;
        output.badges.amazonPrime = $(`span[id="priceBadging_feature_div"]`)[0] ? true : false;

        output.price.discounted = $(`span.priceBlockStrikePriceString.a-text-strike`)[0] ? true : false;
        output.price.before_price = output.price.discounted
            ? parseFloat(
                  $(`span.priceBlockStrikePriceString.a-text-strike`)
                      .text()
                      .replace(/[^D+0-9.,]/g, ''),
                  2,
              )
            : output.price.current_price;

        if (output.price.discounted) {
            const savingAmount = $(`td.a-span12.a-color-price.a-size-base.priceBlockSavingsString`).text()
                ? $(`td.a-span12.a-color-price.a-size-base.priceBlockSavingsString`)
                      .text()
                      .split(/\s/)[0]
                      .replace(/[^D+0-9.,]/g, '')
                : 0;

            output.price.savings_amount = savingAmount ? savingAmount : +(output.price.before_price - output.price.current_price).toFixed(2);

            const savingPercent = $(`td.a-span12.a-color-price.a-size-base.priceBlockSavingsString`).text()
                ? $(`td.a-span12.a-color-price.a-size-base.priceBlockSavingsString`)
                      .text()
                      .split(/\s/)[1]
                      .replace(/[^D+0-9.,]/g, '')
                : 0;
            output.price.savings_percent = savingPercent
                ? savingPercent
                : +((100 / output.price.before_price) * output.price.savings_amount).toFixed(2);
        }

        const thumbnail = $('span[data-action="thumb-action"]');
        for (let i = 0; i < thumbnail.length; i++) {
            try {
                let url = thumbnail[i].children[0].children[0].children[1].children[0].attribs.src;
                if (url.indexOf('x-locale/common') === -1) {
                    output.images.push(`${url.split('._')[0]}._AC_SY879_.jpg`);
                }
            } catch (error) {
                // continue regardless of error
            }
        }
        this.collector.push(output);
    }

    /**
     * Collect products from html response
     * @param {*} body
     */
    _grabProduct(body) {
        let $ = cheerio.load(body.replace(/\s\s+/g, '').replace(/\n/g, ''));
        let productList = $('div[data-index]');
        let scrapingResult = {};

        if (productList.length < 10) {
            throw new Error('No more products');
        }
        for (let i = 0; i < productList.length; i++) {
            if (this._cli) {
                spinner.text = `Found ${this.collector.length + productList.length} products`;
            }
            let totalInResult = Object.keys(scrapingResult).length + this.collector.length;
            if (totalInResult >= this._number && this.bulk) {
                break;
            }
            if (!productList[i].attribs['data-asin']) {
                continue;
            }

            scrapingResult[productList[i].attribs['data-asin']] = {
                asin: productList[i].attribs['data-asin'],
                discounted: false,
                price: 0,
                beforeDiscount: 0,
                savings: 0,
                reviews: 0,
                rating: 0,
                score: 0,
                sponsored: false,
                amazonChoice: false,
                bestSeller: false,
                amazonPrime: false,
            };
        }

        for (let key in scrapingResult) {
            try {
                let priceSearch = $(`div[data-asin=${key}] span[data-a-size="l"]`)[0] || $(`div[data-asin=${key}] span[data-a-size="m"]`)[0];
                let discountSearch = $(`div[data-asin=${key}] span[data-a-strike="true"]`)[0];
                let ratingSearch = $(`div[data-asin=${key}] .a-icon-star-small`)[0];
                let titleThumbnailSearch = $(`div[data-asin=${key}] [data-image-source-density="1"]`)[0];
                let urlSearch = $(`div[data-asin=${key}] span[data-component-type="s-product-image"] .a-link-normal`);
                const amazonChoice = $(`div[data-asin=${key}] span[id="${key}-amazons-choice"]`).text();
                const bestSeller = $(`div[data-asin=${key}] span[id="${key}-best-seller"]`).text();
                const amazonPrime = $(`div[data-asin=${key}] .s-prime`)[0];

                if (priceSearch) {
                    scrapingResult[key].price = $(priceSearch.children[0])
                        .text()
                        .replace(/[^D+0-9.,]/g, '');
                }

                if (amazonChoice) {
                    scrapingResult[key].amazonChoice = true;
                }
                if (bestSeller) {
                    scrapingResult[key].bestSeller = true;
                }
                if (amazonPrime) {
                    scrapingResult[key].amazonPrime = true;
                }

                if (discountSearch) {
                    scrapingResult[key].beforeDiscount = $(discountSearch.children[0])
                        .text()
                        .replace(/[^D+0-9.,]/g, '');

                    scrapingResult[key].discounted = true;

                    let savings = scrapingResult[key].beforeDiscount - scrapingResult[key].price;
                    if (savings <= 0) {
                        scrapingResult[key].discounted = false;

                        scrapingResult[key].beforeDiscount = 0;
                    } else {
                        scrapingResult[key].savings = savings.toFixed(2);
                    }
                }

                if (ratingSearch) {
                    scrapingResult[key].rating = parseFloat(ratingSearch.children[0].children[0].data);

                    scrapingResult[key].reviews = parseInt(ratingSearch.parent.parent.parent.next.attribs['aria-label'].replace(/\,/g, ''));

                    scrapingResult[key].score = parseFloat(scrapingResult[key].rating * scrapingResult[key].reviews).toFixed(2);
                }

                if (titleThumbnailSearch) {
                    scrapingResult[key].title = titleThumbnailSearch.attribs.alt;

                    scrapingResult[key].thumbnail = titleThumbnailSearch.attribs.src;
                }

                if (urlSearch) {
                    let url = urlSearch[0].attribs.href;
                    if (url.indexOf('/gcx/-/') > -1) {
                        url = urlSearch[1].attribs.href;
                    }

                    if (url.indexOf('/gp/') > -1) {
                        scrapingResult[key].sponsored = true;
                    }

                    scrapingResult[key].url = `${this._mainHost}${url}`;
                }
            } catch (err) {
                continue;
            }
        }

        for (let key in scrapingResult) {
            if (this._event) {
                this._eventProductFilter(scrapingResult[key]);
            }

            this.collector.push(scrapingResult[key]);
        }
        return;
    }

    /**
     * If {sponsored} or {discounted} filters are enabled then we need to filter the output data
     * @param {*} item
     */
    _eventProductFilter(item) {
        if (this._discount && this._sponsored) {
            if (!item.discounted && !item.sponsored) return;
        }
        if (this._discount && !this._sponsored) {
            if (!item.discounted) return;
        }
        if (!this._discount && this._sponsored) {
            if (!item.sponsored) return;
        }
        item = this._validateRating(item);
        if (item) {
            return this.emit('item', item);
        }
    }

    /**
     * Check item rating
     * @param {*} item
     */
    _validateRating(item) {
        if (item.rating >= this._minRating && item.rating <= this._maxRating) {
            return item;
        }
        return false;
    }
}

module.exports = AmazonScraper;
