// @ts-nocheck
const rp = require('request-promise');
const { forEachLimit } = require('async');
const { writeFile } = require('fs');
const { fromCallback } = require('bluebird');
const cheerio = require('cheerio');
const ora = require('ora');
const spinner = ora('Amazon Scraper Started');
const { Parser } = require('json2csv');

const CONST = require('./constant');

class AmazonScraper {
    constructor({
        keyword,
        number,
        sponsored,
        proxy,
        cli,
        filetype,
        scrapeType,
        asin,
        sort,
        discount,
        rating,
        ua,
        timeout,
        randomUa,
        page,
        bulk,
        category,
        cookie,
        geo,
        asyncTasks,
    }) {
        this.asyncTasks = asyncTasks;
        this.asyncPage = 1;
        this.mainHost = `https://${geo.host}`;
        this.geo = geo;
        this.cookie = cookie;
        this.bulk = bulk;
        this.productSearchCategory = category;
        this.collector = [];
        this.keyword = keyword;
        this.number = parseInt(number, 10);
        this.searchPage = page;
        this.sponsored = sponsored;
        this.proxy = proxy;
        this.cli = cli;
        this.scrapeType = scrapeType;
        this.asin = asin;
        this.sort = sort;
        this.discount = discount;
        this.rating = rating;
        this.minRating = 1;
        this.maxRating = 5;
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
    httpRequest({ uri, headers, method, qs, json, body, form }) {
        return new Promise(async (resolve, reject) => {
            const options = {
                uri: uri ? `${this.mainHost}/${uri}` : this.mainHost,
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
                resolveWithFullResponse: true,
                ...(this.proxy ? { proxy: `http://${this.proxy}/` } : {}),
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

    /**
     * Start scraper
     */
    async startScraper() {
        if (this.scrapeType === 'products') {
            this.asyncPage = Math.ceil(this.number / 15);
            if (!this.keyword) {
                throw new Error('Keyword is missing');
            }
            if (this.number > CONST.limit.product) {
                throw new Error(`Wow.... slow down cowboy. Maximum you can get is ${CONST.limit.product} products`);
            }
            if (typeof this.sponsored !== 'boolean') {
                throw new Error('Sponsored can only be {true} or {false}');
            }
        }
        if (this.scrapeType === 'reviews') {
            this.asyncPage = Math.ceil(this.number / 10);
            if (!this.asin) {
                throw new Error('ASIN is missing');
            }
            if (this.number > CONST.limit.reviews) {
                throw new Error(`Wow.... slow down cowboy. Maximum you can get is ${CONST.limit.reviews} reviews`, reject);
            }
        }
        if (this.scrapeType === 'asin') {
            if (!this.asin) {
                throw new Error('ASIN is missing');
            }
        }
        if (!Array.isArray(this.rating)) {
            throw new Error('rating can only be an array with length of 2', reject);
        }

        if (this.rating.length > 2) {
            throw new Error('rating can only be an array with length of 2', reject);
        }

        if (!parseFloat(this.rating[0]) || !parseFloat(this.rating[1])) {
            throw new Error('rating can only contain 2 float values', reject);
        }

        this.minRating = parseFloat(this.rating[0]);

        this.maxRating = parseFloat(this.rating[1]);

        if (this.minRating > this.maxRating) {
            throw new Error(`min rating can't be larger then max rating`, reject);
        }
        if (this.cli) {
            spinner.start();
        }

        await this.mainLoop();

        this.sortAndFilterResult();

        await this.saveResultToFile();

        if (this.cli) {
            spinner.stop();
        }
        if (this.fileType && this.cli) {
            console.log(`Result was saved to: ${this.fileName}`);
        }
        return {
            ...(this.scrapeType === 'products' ? { totalProducts: this.totalProducts, category: this.productSearchCategory } : {}),
            result: this.collector,
        };
    }

    /**
     * Main loop that collects data
     */
    async mainLoop() {
        return new Promise((resolve) => {
            forEachLimit(
                Array.from({ length: this.asyncPage }, (v, k) => k + 1),
                this.asyncTasks,
                async (item) => {
                    this.searchPage = item;
                    if (this.collector.length >= this.number && this.bulk) {
                        throw new Error('Done');
                    }

                    const body = await this.buildRequest();
                    if (this.scrapeType === 'asin') {
                        this.grapAsinDetails(body);
                        throw new Error('Done');
                    }
                    if (this.scrapeType === 'products') {
                        let totalResultCount = body.match(/"totalResultCount":\w+(.[0-9])/gm);

                        if (totalResultCount) {
                            this.totalProducts = totalResultCount[0].split('totalResultCount":')[1];
                        }
                        this.grabProduct(body);
                    }
                    if (this.scrapeType === 'reviews') {
                        this.grabReviews(body);
                    }
                    if (!this.bulk) {
                        throw new Error('Done');
                    }
                },
                () => {
                    resolve();
                },
            );
        });
    }

    /**
     * Get filename
     */
    get fileName() {
        switch (this.scrapeType) {
            case 'products':
                return `${this.scrapeType}(${this.keyword})_${this.initTime}`;
            case 'reviews':
            case 'asin':
                return `${this.scrapeType}(${this.asin})_${this.initTime}`;
            default:
                throw new Error(`Unknow scraping type: ${this.scrapeType}`);
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
        if (this.scrapeType === 'reviews') {
            if (this.sort) {
                this.collector.sort((a, b) => b.rating - a.rating);
            }
        }
        if (this.scrapeType === 'products') {
            if (this.sort) {
                this.collector.sort((a, b) => b.score - a.score);
            }
            if (this.discount) {
                this.collector = this.collector.filter((item) => item.discounted);
            }
            if (this.sponsored) {
                this.collector = this.collector.filter((item) => item.sponsored);
            }
        }
        if (this.scrapeType === 'products' || this.scrapeType === 'reviews') {
            this.collector = this.collector.filter((item) => this.validateRating(item));
        }
    }

    get setRequestEndpoint() {
        switch (this.scrapeType) {
            case 'products':
                return 's';
            case 'reviews':
                return `product-reviews/${this.asin}/`;
            case 'asin':
                return `dp/${this.asin}/ref=sspa_dk_detail_3?smid=ATVPDKIKX0DER`;
            default:
                return '';
        }
    }
    /**
     * Create request
     */
    async buildRequest() {
        const options = {
            method: 'GET',
            uri: this.setRequestEndpoint,
            qs: {
                ...(this.scrapeType === 'products'
                    ? {
                          k: this.keyword,
                          ...(this.productSearchCategory ? { i: this.productSearchCategory } : {}),
                          ...(this.searchPage > 1 ? { page: this.searchPage, ref: `sr_pg_${this.searchPage}` } : {}),
                      }
                    : {}),
                ...(this.scrapeType === 'reviews' ? { ...(this.searchPage > 1 ? { pageNumber: this.searchPage } : {}) } : {}),
            },
            headers: {
                referer: this.mainHost,
                cookie: this.cookie,
            },
        };

        try {
            const response = await this.httpRequest(options);
            return response.body;
        } catch (error) {
            throw error.message;
        }
    }

    /**
     * Collect reviews from the html response
     * @param {} body
     */
    grabReviews(body) {
        const $ = cheerio.load(body.replace(/\s\s+/g, '').replace(/\n/g, ''));
        const reviewsList = $('.a-section.a-spacing-none.review-views.celwidget')[0].children;
        let scrapingResult = {};
        for (let i = 0; i < reviewsList.length; i++) {
            const totalInResult = Object.keys(scrapingResult).length + this.collector.length;
            if (totalInResult >= this.number && this.bulk) {
                break;
            }
            if (!reviewsList[i].attribs['id']) {
                continue;
            }
            scrapingResult[reviewsList[i].attribs['id']] = { id: reviewsList[i].attribs['id'] };
        }
        for (let key in scrapingResult) {
            const search = $(`#${key} [data-hook="review-date"]`);

            try {
                scrapingResult[key].review_data = search[0].children[0].data;
            } catch (error) {
                continue;
            }
        }
        for (let key in scrapingResult) {
            const search = $(`#${key} .a-profile-name`);

            try {
                scrapingResult[key].name = search[0].children[0].data;
            } catch (error) {
                continue;
            }
        }
        for (let key in scrapingResult) {
            const search = $(`#${key} [data-hook="review-star-rating"]`);

            try {
                scrapingResult[key].rating = parseFloat(search[0].children[0].children[0].data.split(' ')[0]);
            } catch (error) {
                continue;
            }
        }
        for (let key in scrapingResult) {
            const search = $(`#${key} [data-hook="review-title"]`);

            try {
                scrapingResult[key].title = $(search[0]).text().toString();
            } catch (error) {
                continue;
            }
        }
        for (let key in scrapingResult) {
            const search = $(`#${key} [data-hook="review-body"]`);

            try {
                scrapingResult[key].review = $(search[0]).text();
            } catch (error) {
                continue;
            }
        }

        for (let key in scrapingResult) {
            this.collector.push(scrapingResult[key]);
        }
        return;
    }

    priceFormater(price) {
        // Input format: 3.199,55
        // Output format: 3199.55
        if (/\d+(\.|)\d+(,)\d+/.test(price)) {
            price = price.replace(/[^\d+,]/g, '');
            return price.replace(/,/g, '.');
        }

        // Input format: 3,199.55
        // Output format: 3199.55
        if (/\d+(,|)\d+(\.|)\d+/.test(price)) {
            price = price.replace(/[^\d+\.]/g, '');
            return price.replace(/,/g, ',');
        }
    }

    /**
     * Collect asin details from the html response
     * @param {*} body
     */
    grapAsinDetails(body) {
        body = body.replace(/\s\s+/g, '').replace(/\n/g, '');

        const $ = cheerio.load(body.replace(/\s\s+/g, '').replace(/\n/g, ''));

        const output = {
            title: '',
            asin: this.asin,
            offerListingID: '',
            url: `${this.mainHost}/dp/${this.asin}`,
            reviews: {
                total_reviews: 0,
                rating: 0,
                answered_questions: 0,
            },
            price: {
                currency: this.geo.currency,
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
        output.offerListingID = $(`input[id="offerListingID"]`).val();

        this.collector.push(output);
    }

    /**
     * Collect products from html response
     * @param {*} body
     */
    grabProduct(body) {
        const $ = cheerio.load(body.replace(/\s\s+/g, '').replace(/\n/g, ''));
        const productList = $('div[data-index]');
        let scrapingResult = {};

        if (productList.length < 10) {
            throw new Error('No more products');
        }
        for (let i = 0; i < productList.length; i++) {
            if (this.cli) {
                spinner.text = `Found ${this.collector.length + productList.length} products`;
            }
            const totalInResult = Object.keys(scrapingResult).length + this.collector.length;
            if (totalInResult >= this.number && this.bulk) {
                break;
            }
            if (!productList[i].attribs['data-asin']) {
                continue;
            }

            scrapingResult[productList[i].attribs['data-asin']] = {
                asin: productList[i].attribs['data-asin'],
                price: {
                    discounted: false,
                    current_price: 0,
                    currency: this.geo.currency,
                    before_price: 0,
                    savings_amount: 0,
                    savings_percent: 0,
                },
                reviews: {
                    total_reviews: 0,
                    rating: 0,
                },
                url: `${this.mainHost}/dp/${productList[i].attribs['data-asin']}`,
                score: 0,
                sponsored: false,
                amazonChoice: false,
                bestSeller: false,
                amazonPrime: false,
            };
        }

        for (let key in scrapingResult) {
            try {
                const priceSearch = $(`div[data-asin=${key}] span[data-a-size="l"]`)[0] || $(`div[data-asin=${key}] span[data-a-size="m"]`)[0];
                const discountSearch = $(`div[data-asin=${key}] span[data-a-strike="true"]`)[0];
                const ratingSearch = $(`div[data-asin=${key}] .a-icon-star-small`)[0];
                const titleThumbnailSearch = $(`div[data-asin=${key}] [data-image-source-density="1"]`)[0];
                const amazonChoice = $(`div[data-asin=${key}] span[id="${key}-amazons-choice"]`).text();
                const bestSeller = $(`div[data-asin=${key}] span[id="${key}-best-seller"]`).text();
                const amazonPrime = $(`div[data-asin=${key}] .s-prime`)[0];

                if (priceSearch) {
                    scrapingResult[key].price.current_price = $(priceSearch.children[0])
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
                    scrapingResult[key].price.before_price = $(discountSearch.children[0])
                        .text()
                        .replace(/[^D+0-9.,]/g, '');

                    scrapingResult[key].price.discounted = true;

                    const savings = scrapingResult[key].price.before_price - scrapingResult[key].price.current_price;
                    if (savings <= 0) {
                        scrapingResult[key].price.discounted = false;

                        scrapingResult[key].price.before_price = 0;
                    } else {
                        scrapingResult[key].price.savings_percent = (scrapingResult[key].price.before_price / savings).toFixed(2);

                        scrapingResult[key].price.savings_amount = savings.toFixed(2);
                    }
                }

                if (ratingSearch) {
                    scrapingResult[key].reviews.rating = parseFloat(ratingSearch.children[0].children[0].data);

                    scrapingResult[key].reviews.total_reviews = parseInt(
                        ratingSearch.parent.parent.parent.next.attribs['aria-label'].replace(/\,/g, ''),
                    );

                    scrapingResult[key].score = parseFloat(scrapingResult[key].reviews.rating * scrapingResult[key].reviews.total_reviews).toFixed(2);
                }

                if (titleThumbnailSearch) {
                    scrapingResult[key].title = titleThumbnailSearch.attribs.alt;

                    scrapingResult[key].thumbnail = titleThumbnailSearch.attribs.src;
                }
            } catch (err) {
                continue;
            }
        }

        for (let key in scrapingResult) {
            this.collector.push(scrapingResult[key]);
        }
        return;
    }

    /**
     * Filter reviews/products by required rating
     * @param {*} item
     */
    validateRating(item) {
        if (this.scrapeType === 'products') {
            if (item.reviews.rating >= this.minRating && item.reviews.rating <= this.maxRating) {
                return item;
            }
        }
        if (this.scrapeType === 'reviews') {
            if (item.rating >= this.minRating && item.rating <= this.maxRating) {
                return item;
            }
        }
        return false;
    }

    async extractCategories() {
        const body = await this.buildRequest();
        const $ = cheerio.load(body.replace(/\s\s+/g, '').replace(/\n/g, ''));
        const categorySelect = $('#searchDropdownBox')[0];

        if (!Array.isArray(categorySelect.children)) {
            throw new Error("Can't find category selector");
        }

        let categories = {};
        for (let select of categorySelect.children) {
            const category = select.attribs.value.split('search-alias=')[1];
            categories[category] = {
                name: select.children[0].data,
                category,
            };
        }

        return categories;
    }
}

module.exports = AmazonScraper;
