// @ts-nocheck
const rp = require('request-promise');
const { forEachLimit } = require('async');
const { writeFile } = require('fs');
const { fromCallback } = require('bluebird');
const cheerio = require('cheerio');
const ora = require('ora');
const spinner = ora('Amazon Scraper Started');
const { Parser } = require('json2csv');
const moment = require('moment');
const { SocksProxyAgent } = require('socks-proxy-agent');

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
        reviewFilter,
        referer,
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
        this.reviewMetadata = {
            total_reviews: 0,
            stars_stat: {},
        };
        this.referer = referer;
        this.fileType = filetype;
        this.jsonToCsv = new Parser({ flatten: true });
        this.initTime = Date.now();
        this.ua = ua || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36';
        this.reviewFilter = reviewFilter;
    }

    /**
     * Get user agent
     * if randomUa then user agent version will be randomized, this helps to prevent request blocking from the amazon side
     */
    get userAgent() {
        {
            const os = [
                'Macintosh; Intel Mac OS X 10_15_7',
                'Macintosh; Intel Mac OS X 10_15_5',
                'Macintosh; Intel Mac OS X 10_11_6',
                'Macintosh; Intel Mac OS X 10_6_6',
                'Macintosh; Intel Mac OS X 10_9_5',
                'Macintosh; Intel Mac OS X 10_10_5',
                'Macintosh; Intel Mac OS X 10_7_5',
                'Macintosh; Intel Mac OS X 10_11_3',
                'Macintosh; Intel Mac OS X 10_10_3',
                'Macintosh; Intel Mac OS X 10_6_8',
                'Macintosh; Intel Mac OS X 10_10_2',
                'Macintosh; Intel Mac OS X 10_10_3',
                'Macintosh; Intel Mac OS X 10_11_5',
                'Windows NT 10.0; Win64; x64',
                'Windows NT 10.0; WOW64',
                'Windows NT 10.0',
            ];

            return `Mozilla/5.0 (${os[Math.floor(Math.random() * os.length)]}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${
                Math.floor(Math.random() * 3) + 85
            }.0.${Math.floor(Math.random() * 190) + 4100}.${Math.floor(Math.random() * 50) + 140} Safari/537.36`;
        }
    }

    /**
     * Get referer method
     * {this.referer} should an array of referers
     */
    get getReferer() {
        if (Array.isArray(this.referer)) {
            return this.referer[Math.floor(Math.random() * this.referer.length)];
        }

        return '';
    }

    /**
     * Get proxy
     */
    get getProxy() {
        const selectProxy = Array.isArray(this.proxy) && this.proxy.length ? this.proxy[Math.floor(Math.random() * this.proxy.length)] : '';
        if (selectProxy.indexOf('socks4://') > -1 || selectProxy.indexOf('socks5://') > -1) {
            return {
                socks: true,
                proxy: new SocksProxyAgent(selectProxy),
            };
        }
        return {
            socks: false,
            proxy: selectProxy,
        };
    }

    /**
     * Main request method
     * @param {*} param0
     */
    httpRequest({ uri, method, qs, json, body, form }) {
        const proxy = this.getProxy;
        return new Promise(async (resolve, reject) => {
            const options = {
                uri: uri ? `${this.mainHost}/${uri}` : this.mainHost,
                method,
                ...(qs ? { qs } : {}),
                ...(body ? { body } : {}),
                ...(form ? { form } : {}),
                headers: {
                    'user-agent': this.userAgent,
                    cookie: this.cookie,
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'accept-language': 'en-US,en;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    ...(this.getReferer ? { referer: this.getReferer } : {}),
                    ...(Math.round(Math.random()) ? { downlink: Math.floor(Math.random() * 30) + 10 } : {}),
                    ...(Math.round(Math.random()) ? { rtt: Math.floor(Math.random() * 100) + 50 } : {}),
                    ...(Math.round(Math.random()) ? { pragma: 'no-cache' } : {}),
                    ...(Math.round(Math.random()) ? { ect: '4g' } : {}),
                    ...(Math.round(Math.random()) ? { DNT: 1 } : {}),
                },
                strictSSL: false,
                ...(json ? { json: true } : {}),
                gzip: true,
                resolveWithFullResponse: true,
                ...(proxy.proxy && proxy.socks ? { agent: proxy.proxy } : {}),
                ...(proxy.proxy && !proxy.socks ? { proxy: `http://${proxy.proxy}/` } : {}),
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
                throw new Error(`Wow.... slow down cowboy. Maximum you can get is ${CONST.limit.reviews} reviews`);
            }
        }
        if (this.scrapeType === 'asin') {
            if (!this.asin) {
                throw new Error('ASIN is missing');
            }
        }
        if (!Array.isArray(this.rating)) {
            throw new Error('rating can only be an array with length of 2');
        }

        if (this.rating.length > 2) {
            throw new Error('rating can only be an array with length of 2');
        }

        if (!parseFloat(this.rating[0]) || !parseFloat(this.rating[1])) {
            throw new Error('rating can only contain 2 float values');
        }

        this.minRating = parseFloat(this.rating[0]);

        this.maxRating = parseFloat(this.rating[1]);

        if (this.minRating > this.maxRating) {
            throw new Error(`min rating can't be larger then max rating`);
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
            ...(this.scrapeType === 'reviews' ? { ...this.reviewMetadata } : {}),
            result: this.collector,
        };
    }

    /**
     * Main loop that collects data
     */
    async mainLoop() {
        return new Promise((resolve, reject) => {
            forEachLimit(
                Array.from({ length: this.asyncPage }, (_, k) => k + 1),
                this.asyncTasks,
                async (item) => {
                    const body = await this.buildRequest(this.bulk ? item : this.searchPage);
                    if (this.scrapeType === 'asin') {
                        this.grabAsinDetails(body);
                        throw new Error('Done');
                    }
                    if (this.scrapeType === 'products') {
                        let totalResultCount = body.match(/"totalResultCount":\w+(.[0-9])/gm);

                        if (totalResultCount) {
                            this.totalProducts = totalResultCount[0].split('totalResultCount":')[1];
                        }
                        this.grabProduct(body, item);
                    }
                    if (this.scrapeType === 'reviews') {
                        this.grabReviews(body);
                    }
                    if (!this.bulk) {
                        throw new Error('Done');
                    }
                },
                (err) => {
                    if (err && err.message != 'Done') reject(err);
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
            this.collector.sort((a, b) => a.position.global_position - b.position.global_position);
            this.collector.forEach((item, index) => {
                item.position.global_position = index += 1;
            });

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
                return `product-reviews/${this.asin}/ref=cm_cr_arp_d_viewopt_srt?formatType=${
                    CONST.reviewFilter.formatType[this.reviewFilter.formatType]
                }&sortBy=${CONST.reviewFilter.sortBy[this.reviewFilter.sortBy] ? CONST.reviewFilter.sortBy[this.reviewFilter.sortBy] : ''}${
                    this.reviewFilter.verifiedPurchaseOnly ? '&reviewerType=avp_only_reviews' : ''
                }${this.reviewFilter.filterByStar ? `&filterByStar=${CONST.reviewFilter.filterByStar[this.reviewFilter.filterByStar]}` : ''}`;
            case 'asin':
                return `dp/${this.asin}/ref=sspa_dk_detail_3&th=1&psc=1?th=1&psc=1`;
            default:
                return '';
        }
    }
    /**
     * Create request
     */
    async buildRequest(page) {
        const options = {
            method: 'GET',
            uri: this.setRequestEndpoint,
            qs: {
                ...(this.scrapeType === 'products'
                    ? {
                          k: this.keyword,
                          ...(this.productSearchCategory ? { i: this.productSearchCategory } : {}),
                          ...(page > 1 ? { page, ref: `sr_pg_${page}` } : {}),
                      }
                    : {}),
                ...(this.scrapeType === 'reviews' ? { ...(page > 1 ? { pageNumber: page } : {}) } : {}),
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

        /**
         * Get star and star percentage
         */
        const reviewListStat = $('#histogramTable > tbody')[0];
        try {
            reviewListStat.children.forEach((item) => {
                const star = parseInt($(item.children[0]).text(), 10);
                const percentage = $(item.children[2]).text();
                this.reviewMetadata.stars_stat[star] = percentage;
            });
        } catch {
            return;
        }

        /**
         * Get total number of reviews
         */
        this.reviewMetadata.total_reviews = parseInt($('.averageStarRatingNumerical').text(), 10);

        const reviewsList = $('#cm_cr-review_list')[0].children;
        let scrapingResult = {};
        for (let i = 0; i < reviewsList.length; i++) {
            const totalInResult = Object.keys(scrapingResult).length + this.collector.length;
            if (totalInResult >= this.number && this.bulk) {
                break;
            }
            const reviewId = reviewsList[i].attribs['id'];
            if (!reviewId) {
                continue;
            }
            scrapingResult[reviewId] = { id: reviewId };
        }

        /**
         * Review date
         */
        for (let key in scrapingResult) {
            const search = $(`#${key} [data-hook="review-date"]`);

            scrapingResult[key].asin = {
                original: this.asin,
                variant: '',
            };
            try {
                scrapingResult[key].review_data = search[0].children[0].data;
                if (scrapingResult[key].review_data) {
                    scrapingResult[key].date = this.geo.review_date(scrapingResult[key].review_data);
                }
            } catch (error) {
                continue;
            }
        }

        /**
         * If product has more then one variant and {formatType} is set to {all_formats} then some reviews can be written for specific variants(ASIN)
         * We can extract those ASIN id's
         */
        for (let key in scrapingResult) {
            const search = $(`#${key} div.a-row.a-spacing-mini.review-data.review-format-strip > a`);

            try {
                const url = search[0].attribs.href;
                const asinRegex = /product-reviews\/(\w+)\//.exec(url);
                if (asinRegex) {
                    scrapingResult[key].asin.variant = asinRegex[1];
                }
            } catch (error) {
                continue;
            }
        }

        /**
         * Reviewer name
         */
        for (let key in scrapingResult) {
            const search = $(`#${key} .a-profile-name`);

            try {
                scrapingResult[key].name = search[0].children[0].data;
            } catch (error) {
                continue;
            }
        }

        /**
         * Rating
         */
        for (let key in scrapingResult) {
            const search = $(`#${key} [data-hook="review-star-rating"]`);

            try {
                scrapingResult[key].rating = parseFloat(search[0].children[0].children[0].data.split(' ')[0]);
            } catch (error) {
                continue;
            }
        }

        /**
         * Review title
         */
        for (let key in scrapingResult) {
            const search = $(`#${key} [data-hook="review-title"]`);

            try {
                scrapingResult[key].title = $(search[0]).text().toString();
            } catch (error) {
                continue;
            }
        }

        /**
         * Review text
         */
        for (let key in scrapingResult) {
            const search = $(`#${key} [data-hook="review-body"]`);

            try {
                scrapingResult[key].review = $(search[0]).text();
            } catch (error) {
                continue;
            }
        }

        /**
         * If purchase is verified
         */
        for (let key in scrapingResult) {
            const search = $(`#${key} [data-reftag="cm_cr_arp_d_rvw_rvwer"]`);
            scrapingResult[key].verified_purchase = false;

            try {
                scrapingResult[key].verified_purchase = !!search[0];
            } catch (error) {
                continue;
            }
        }

        /**
         * Get review images if available
         */

        for (let key in scrapingResult) {
            const search = $(`#${key} .review-image-tile-section`);

            scrapingResult[key].media = search[0]
                ? search[0].children.map((item) => {
                      let media = item.children[0].children[0].attribs.src;
                      if (media.indexOf('.jpg') > -1) {
                          media = media.replace('_SY88', '_SL1600_');
                      }
                      return media;
                  })
                : [];
        }

        for (let key in scrapingResult) {
            this.collector.push(scrapingResult[key]);
        }
    }

    // Extract product features
    extractProductFeatures($) {
        const featureBullets = [];

        try {
            const featureList = $('#feature-bullets > ul .a-list-item');
            for (let item in featureList) {
                if (featureList[item].children[0].data) featureBullets.push(featureList[item].children[0].data);
            }
        } catch {
            // continue regardless of error
        }

        // Features on some items can be hidden with the expander tag
        // We will try to extract them
        try {
            const featureListExpanded = $('#feature-bullets > div > div')[0].children[0].children;
            for (let item of featureListExpanded) {
                if (item.children[0].children[0].data) featureBullets.push(item.children[0].children[0].data);
            }
        } catch {
            // continue regardless of error
        }

        return featureBullets;
    }

    // Extract infromation from the Product Information section
    extractProductInfromation($) {
        const bestsellers_rank = [];
        const product_information = {
            dimensions: '',
            weight: '',
            available_from: '',
            available_from_utc: '',
            available_for_months: 0,
            available_for_days: 0,
            manufacturer: '',
            model_number: '',
            department: '',
        };

        let unOrderedList = false;

        try {
            const bestSalesSection = $('#SalesRank > ul > li');
            for (let item in bestSalesSection) {
                const rank = $(bestSalesSection[item].children[0]).text();
                const category = $(bestSalesSection[item].children[1]).text();
                const link = bestSalesSection[item].children[1].children[1].attribs.href;
                if (category && rank) {
                    const bestSeller = this.geo.best_seller(`${rank} ${category}`);
                    if (bestSeller) {
                        bestsellers_rank.push({ ...bestSeller, link: `${this.mainHost}${link}` });
                    }
                }
            }
        } catch {
            // continue regardless of error
        }

        try {
            const bestSalesSection = $('.prodDetSectionEntry')[0].parent.children[1].children[0];
            bestSalesSection.children.forEach((item) => {
                const bestSeller = this.geo.best_seller($(item).text());
                if (bestSeller) {
                    bestsellers_rank.push({ ...bestSeller, link: `${this.mainHost}${item.next.attribs.href}` });
                }
            });
        } catch {
            // continue regardless of error
        }

        try {
            const bestSalesSection = $(`#detailBulletsWrapper_feature_div > ul:nth-child(5) > li > span`)[0];
            bestSalesSection.children.forEach((item) => {
                if (item.type === 'text' && item.data != '') {
                    const bestSeller = this.geo.best_seller(item.data);
                    if (bestSeller) {
                        bestsellers_rank.push({ ...bestSeller, link: `${this.mainHost}${item.next.attribs.href}` });
                    }
                }
                if (item.type === 'tag' && item.name === 'ul') {
                    if (item.children) {
                        item.children.forEach((rankItem) => {
                            const rank = $(rankItem.children[0].children[0]).text();
                            const category = $(rankItem.children[0].children[1]).text();
                            const link = rankItem.children[0].children[1].attribs.href;
                            if (category && rank) {
                                const bestSeller = this.geo.best_seller(`${rank} ${category}`);
                                if (bestSeller) {
                                    bestsellers_rank.push({ ...bestSeller, link: `${this.mainHost}${link}` });
                                }
                            }
                        });
                    }
                }
            });
        } catch {
            // continue regardless of error
        }

        try {
            for (let id of this.geo.product_information.id) {
                const informationSection = $(id);
                if (informationSection[0]) {
                    const len = informationSection[0].children.length;
                    let arr = informationSection[0].children;
                    if (len === 1) {
                        arr = informationSection[0].children[0].children;
                    }

                    for (let item of arr) {
                        let key = '';
                        let value = '';
                        if (len === 1) {
                            try {
                                // Some of the product information can be located in the unordered list of data
                                if (id === '#detailBulletsWrapper_feature_div > ul:nth-child(5)') {
                                    unOrderedList = true;
                                    key = item.children[0].data;
                                    value = item.children[1].data;
                                } else {
                                    key = item.children[0].children[0].data;
                                    value = item.children[1].children[0].data;
                                }
                            } catch {
                                // continue regardless of error
                            }
                        } else {
                            try {
                                key = item.children[0].children[0].children[0].data.replace(':', '');
                                value = item.children[0].children[1].children[0].data;
                            } catch {
                                // continue regardless of error
                            }
                        }

                        const fieldToExtract = this.geo.product_information.fields[key];
                        if (fieldToExtract) {
                            // Extracting data from the Best Sellers Rank section
                            if (fieldToExtract.rank) {
                                try {
                                    let rankArray = [];
                                    if (unOrderedList) {
                                        rankArray = item.children[1].children;
                                    } else {
                                        rankArray = item.children[1].children[0].children;
                                    }
                                    rankArray.forEach((item) => {
                                        if (item.name === 'span') {
                                            const bestSeller = this.geo.best_seller($(item).text());
                                            const link = item.children[1].attribs.href;
                                            if (bestSeller) {
                                                bestsellers_rank.push({ ...bestSeller, link: `${this.mainHost}${link}` });
                                            }
                                        }
                                    });
                                } catch {
                                    // continue regardless of error
                                }
                            }

                            if (fieldToExtract && value) {
                                if (fieldToExtract.key === 'dimensions') {
                                    // Sometimes weight is located in the dimensions section and in such cases we can separate both values and place them in the correct fields
                                    if (value.indexOf('; ') > -1) {
                                        const splitDimensions = value.split('; ');
                                        if (!product_information.weight && splitDimensions[1]) {
                                            product_information.weight = splitDimensions[1];
                                        }
                                        value = splitDimensions[0];
                                    }
                                }
                                product_information[fieldToExtract.key] = value;
                            }
                        }
                    }
                }
            }
        } catch {
            // continue regardless of error
        }

        // Calculate months and dyas on amazon
        if (product_information.available_from) {
            const from = moment(new Date(product_information.available_from));
            const now = moment(new Date());
            const duration = moment.duration(now.diff(from));
            try {
                product_information.available_from_utc = new Date(product_information.available_from).toISOString();
                product_information.available_for_months = Math.ceil(duration.asMonths());
                product_information.available_for_days = Math.ceil(duration.asDays());
            } catch {
                // continue regardless of error
            }
        }

        return [product_information, bestsellers_rank];
    }

    // Extract products from the variants section (different color,size and etc)
    extractProductVariants($, body) {
        const variants = [];
        let videos = [];

        let variantsSelector = $('#variation_color_name > ul');
        let productJsonMeta = '';

        if (!variantsSelector[0]) {
            variantsSelector = $('#variation_style_name > ul');
        }

        if (!variantsSelector[0]) {
            variantsSelector = $('#variation_size_name > ul');
        }

        // Most of the variant related data can be extracted from the JSON that is located right on the product page
        // But sometimes it isn't and for such cases we will use again cheerio
        try {
            const json = /jQuery.parseJSON\('([\w{}:;&,-.[\]\s+%\/()\/"|\\`']+)'\)/.exec(body);

            if (json) {
                productJsonMeta = JSON.parse(json[1].replace(/\\'/g, `'`));
            }
        } catch {
            // continue regardless of error
        }

        // If there is a valid JSON
        if (productJsonMeta) {
            if (Object.keys(productJsonMeta.colorToAsin).length) {
                for (let item in productJsonMeta.colorToAsin) {
                    const images = productJsonMeta.colorImages[item] || [];

                    const variant = {
                        asin: productJsonMeta.colorToAsin[item].asin,
                        images: images,
                        title: item,
                        link: `https://www.amazon.com/dp/${productJsonMeta.colorToAsin[item].asin}/?th=1&psc=1`,
                        is_current_product: productJsonMeta.colorToAsin[item].asin === this.asin,
                        price: '',
                    };
                    try {
                        const price = $(`li[data-defaultasin="${productJsonMeta.colorToAsin[item].asin}"] div.twisterSlotDiv`).text();
                        if (price) variant.price = this.geo.price_format(price);
                    } catch {
                        // continue regardless of error
                    }
                    variants.push(variant);
                }
            }
            videos = productJsonMeta.videos;
            // If there is no valid JSON
        } else {
            try {
                for (let item of variantsSelector[0].children) {
                    const variant = {
                        asin: '',
                        images: '',
                        title: '',
                        link: ``,
                        is_current_product: false,
                        price: '',
                    };
                    if (item.attribs['data-defaultasin']) {
                        variant.asin = item.attribs['data-defaultasin'];
                    }
                    if (item.attribs['data-dp-url']) {
                        const findAsin = /dp\/(\w+)\//.exec(item.attribs['data-dp-url']);
                        if (findAsin) {
                            variant.asin = findAsin[1];
                        }
                    }

                    try {
                        const price = $(`li[id=${item.attribs['id']}] div.twisterSlotDiv`).text();
                        if (price) variant.price = this.geo.price_format(price);
                        variant.images =
                            item.children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].attribs.src;
                    } catch {
                        // continue regardless of error
                    }
                    variant.title = item.attribs['title'] ? item.attribs['title'].split(this.geo.variants.split_text)[1] : ''; //item.children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].attribs.alt;

                    variants.push({
                        ...variant,
                        images: variant.images ? [`${variant.images.split('._')[0]}._AC_SY879_.jpg`] : [],
                        link: `https://www.amazon.com/dp/${variant.asin}/?th=1&psc=1`,
                        is_current_product: variant.asin === this.asin,
                    });
                }
            } catch {
                // continue regardless of error
            }
        }
        return [variants, videos];
    }

    // Extract product from section "Customers who bought this item also bought"
    extractAlsoBought($) {
        const also_bought = [];
        const bought = $(
            '#desktop-dp-sims_purchase-similarities-sims-feature > div > div.a-row.a-carousel-controls.a-carousel-row.a-carousel-has-buttons > div > div.a-carousel-col.a-carousel-center > div',
        );

        if (!bought[0]) {
            return also_bought;
        }

        try {
            if (!bought[0].children[0].children) return also_bought;
        } catch {
            return also_bought;
        }
        for (let item of bought[0].children[0].children) {
            const product = {
                asin: '',
                title: '',
                image: [],
                url: ``,
                reviews: {
                    total_reviews: 0,
                    rating: 0,
                },
                price: {
                    symbol: this.geo.symbol,
                    currency: this.geo.currency,
                    current_price: 0,
                },
                badges: {
                    amazon_prime: false,
                },
            };
            try {
                const asin = JSON.parse(item.children[0].attribs['data-p13n-asin-metadata']);
                product.asin = asin.asin;
                product.url = `https://www.amazon.com/dp/${product.asin}/?th=1&psc=1`;
            } catch {
                // continue regardless of error
            }

            try {
                const titleImg = item.children[0].children[0].children[0].children[0];
                if (titleImg) {
                    product.title = titleImg.attribs.alt;
                    product.image = [titleImg.attribs.src];
                }
            } catch {
                // continue regardless of error
            }

            try {
                const review = $(item.children[0].children[1].children[1]).text();
                if (review) {
                    product.reviews.total_reviews = parseInt(review.replace(/[^\d]/g, ''), 10);
                }
            } catch {
                // continue regardless of error
            }

            try {
                const rating = item.children[0].children[1].children[0].children[0];
                if (rating) {
                    const classRating = rating.attribs.class;
                    if (classRating.indexOf('a-star-') > -1) {
                        const splitRating = classRating.split('a-star-')[1];
                        product.reviews.rating = parseFloat(splitRating.replace('-', '.'));
                    }
                }
            } catch {
                // continue regardless of error
            }

            try {
                const price = $(item.children[0].children[2]).text();
                if (price) {
                    product.price.current_price = this.geo.price_format(price);
                }
            } catch {
                // continue regardless of error
            }
            also_bought.push(product);
        }
        return also_bought;
    }

    // Extract products from the section "Sponsored products related to this item"
    extractSponsoredProducts($) {
        const sponsored_products = [];
        const sponsored = $('#sp_detail-none > div:nth-child(3) > div > div > div.a-carousel-col.a-carousel-center > div');

        if (!sponsored[0]) {
            return sponsored_products;
        }

        try {
            if (!sponsored[0].children[0].children) return sponsored_products;
        } catch {
            return sponsored_products;
        }

        for (let item of sponsored[0].children[0].children) {
            const product = {
                asin: '',
                title: '',
                image: [],
                url: ``,
                reviews: {
                    total_reviews: 0,
                    rating: 0,
                },
                price: {
                    symbol: this.geo.symbol,
                    currency: this.geo.currency,
                    current_price: 0,
                },
                badges: {
                    amazon_prime: false,
                },
            };

            product.asin = item.children[1].attribs['data-asin'];
            product.url = `https://www.amazon.com/dp/${product.asin}/?th=1&psc=1`;

            try {
                const titleImg = $(`#sp_detail-none_${product.asin} > a > img`);
                if (titleImg[0]) {
                    product.title = titleImg[0].attribs.alt;
                    product.image = [titleImg[0].attribs.src];
                }
            } catch {}

            const review = $(`#sp_detail-none_${product.asin} > div:nth-child(6) > a > span`).text();
            if (review) {
                product.reviews.total_reviews = parseInt(review.replace(/[^\d]/g, ''), 10);
            }

            const price = $(`#sp_detail-none_${product.asin} > div.a-row.a-color-price > a:nth-child(1) > span`).text();
            if (price) {
                product.price.current_price = this.geo.price_format(price);
            }

            const prime = $(`#sp_detail-none_${product.asin} > div.a-row.a-color-price > a:nth-child(2) > span > i`);
            if (prime[0]) {
                if (prime[0].attribs.class.indexOf('a-icon-prime') > -1) {
                    product.badges.amazon_prime = true;
                }
            }

            const rating = $(`#sp_detail-none_${product.asin} > div:nth-child(6) > a > i`);
            if (rating[0]) {
                const classRating = rating[0].attribs.class;
                if (classRating.indexOf('a-star-') > -1) {
                    const splitRating = classRating.split('a-star-')[1];
                    product.reviews.rating = splitRating.indexOf('-') > -1 ? splitRating.replace('-', '.') : splitRating;
                }
            }

            sponsored_products.push(product);
        }
        return sponsored_products;
    }
    /**
     * Collect asin details from the html response
     * @param {*} body
     */
    grabAsinDetails(body) {
        body = body.replace(/\s\s+/g, '').replace(/\n/g, '');
        const $ = cheerio.load(body);

        const output = {
            title: '',
            description: '',
            feature_bullets: [],
            variants: [],
            categories: [],
            asin: this.asin,
            url: `${this.mainHost}/dp/${this.asin}`,
            reviews: {
                total_reviews: 0,
                rating: 0,
                answered_questions: 0,
            },
            item_available: true,
            price: {
                symbol: this.geo.symbol,
                currency: this.geo.currency,
                current_price: 0,
                discounted: false,
                before_price: 0,
                savings_amount: 0,
                savings_percent: 0,
            },
            bestsellers_rank: [],
            main_image: '',
            total_images: 0,
            images: [],
            total_videos: 0,
            videos: [],
            delivery_message: '',
            product_information: {
                dimensions: '',
                weight: '',
                available_from: '',
                available_for_months: 0,
                available_for_days: 0,
                manufacturer: '',
                model_number: '',
                department: '',

                store_id: '',
                brand: '',
                sold_by: '',
                fulfilled_by: '',
                qty_per_order: 'na',
            },
            badges: {
                amazon_сhoice: false,
                amazon_prime: false,
                best_seller: false,
            },
            sponsored_products: [],
            also_bought: [],
            other_sellers: [],
        };

        const book_in_series = this.extractBookInSeries($);
        if (book_in_series.length) {
            output.book_in_series = book_in_series;
        }

        output.other_sellers = this.extractOtherSellers($);

        const authors = this.extractAuthors($);
        if (authors.length) {
            output.authors = authors;
        }

        output.categories = this.extractProductCategories($);
        output.item_available = $('span.qa-availability-message').text() ? false : true;

        output.sponsored_products = this.extractSponsoredProducts($);
        output.also_bought = this.extractAlsoBought($);

        [output.variants, output.videos] = this.extractProductVariants($, body);
        output.total_videos = output.videos.length;

        output.description = $('#productDescription').text();

        if (body.indexOf('bookDescription_feature_div') > -1 && !output.description) {
            output.description = $('#bookDescription_feature_div').text();
            try {
                output.description = $(output.description).text() || '';
            } catch {
                // continue regardless of error
            }
        }

        output.feature_bullets = this.extractProductFeatures($);
        [output.product_information, output.bestsellers_rank] = this.extractProductInfromation($);

        const deliveryMessage = $('#deliveryMessageMirId').text();
        output.delivery_message = deliveryMessage;

        const merchantInfo = $('div[id="merchant-info"]').text();
        if (merchantInfo) {
            try {
                if (merchantInfo.indexOf('Ships from and sold by ') > -1) {
                    const splitSoldBy = merchantInfo.split('Ships from and sold by ')[1];
                    output.product_information.sold_by = splitSoldBy.slice(0, -1);
                    output.product_information.fulfilled_by = splitSoldBy.slice(0, -1);
                } else {
                    const splitSoldBy = merchantInfo.split('Sold by ')[1].split(' and ');
                    output.product_information.sold_by = splitSoldBy[0];
                    output.product_information.fulfilled_by = splitSoldBy[1].split('Fulfilled by ')[1].slice(0, -1);
                }
            } catch {
                // continue regardless of error
            }
        }

        const maxOrderQty = $('select[id="quantity"]');
        if (maxOrderQty) {
            try {
                output.product_information.qty_per_order = maxOrderQty[0] ? maxOrderQty[0].children.length : 'na';
            } catch {
                // continue regardless of error
            }
        }

        output.title = $(`span[id="productTitle"]`).text() || $('.qa-title-text').text();
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

        output.price.current_price = $(`span.a-price.priceToPay`)[0]
            ? this.geo.price_format($($(`span.a-price.priceToPay`)[0].children[0]).text())
            : 0;
        if (!output.current_price) {
            try {
                output.price.current_price = this.geo.price_format($($(`span.a-price.apexPriceToPay`)[0].children[0]).text());
            } catch {
                try {
                    output.price.current_price = this.geo.price_format($($('.a-price')[0].children[0]).text());
                } catch {
                    // continue regardless of error
                }
            }
        }

        output.product_information.store_id = $(`input[id="storeID"]`).val();
        output.product_information.brand = $(`a[id="bylineInfo"]`).text() || '';

        output.badges.amazon_сhoice = $(`div.ac-badge-wrapper`)[0] ? true : false;
        output.badges.amazon_prime = $(`span[id="priceBadging_feature_div"]`) || $(`span[id="priceBadging_feature_div"]`)[0] ? true : false;
        output.badges.best_seller = $(`i.p13n-best-seller-badge`)[0] ? true : false;
        output.price.discounted = $(`span.savingsPercentage`)[0] ? true : false;
        output.price.before_price = output.price.discounted
            ? this.geo.price_format($(`span.a-price.a-text-price`).text())
            : output.price.current_price;

        if (output.price.discounted) {
            output.price.savings_amount = +(output.price.before_price - output.price.current_price).toFixed(2);

            output.price.savings_percent = +((100 / output.price.before_price) * output.price.savings_amount).toFixed(2);
        }

        output.images = this.extractImages($, body);
        output.main_image = output.images.length ? output.images[0] : '';
        output.total_images = output.images.length;

        this.collector.push(output);
    }

    /**
     * Collect products from html response
     * @param {*} body
     */
    grabProduct(body, p) {
        const $ = cheerio.load(body.replace(/\s\s+/g, '').replace(/\n/g, ''));
        let productList = $('div[data-index]');
        const scrapingResult = {};

        let position = 0;
        for (let i = 0; i < productList.length; i++) {
            if (this.cli) {
                spinner.text = `Found ${this.collector.length + productList.length} products`;
            }

            const asin = productList[i].attribs['data-asin'];

            if (!asin) {
                continue;
            }

            scrapingResult[asin] = {
                position: {
                    page: p,
                    position: (position += 1),
                    global_position: `${p}${i}`,
                },
                asin,
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
                url: `${this.mainHost}/dp/${asin}`,
                score: 0,
                sponsored: false,
                amazonChoice: false,
                bestSeller: false,
                amazonPrime: false,
            };
        }

        for (let key in scrapingResult) {
            try {
                const priceSearch =
                    $(`div[data-asin=${key}] span[data-a-size="xl"]`)[0] ||
                    $(`div[data-asin=${key}] span[data-a-size="l"]`)[0] ||
                    $(`div[data-asin=${key}] span[data-a-size="m"]`)[0];
                const discountSearch = $(`div[data-asin=${key}] span[data-a-strike="true"]`)[0];
                const ratingSearch = $(`div[data-asin=${key}] .a-icon-star-small`)[0];
                const titleThumbnailSearch = $(`div[data-asin=${key}] [data-image-source-density="1"]`)[0];
                const amazonChoice = $(`div[data-asin=${key}] span[id="${key}-amazons-choice"]`).text();
                const bestSeller = $(`div[data-asin=${key}] span[id="${key}-best-seller"]`).text();
                const amazonPrime = $(`div[data-asin=${key}] .s-prime`)[0];

                if (priceSearch) {
                    scrapingResult[key].price.current_price = this.geo.price_format($(priceSearch.children[0]).text());
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
                    scrapingResult[key].price.before_price = this.geo.price_format($(discountSearch.children[0]).text());

                    scrapingResult[key].price.discounted = true;

                    const savings = scrapingResult[key].price.before_price - scrapingResult[key].price.current_price;
                    if (savings <= 0) {
                        scrapingResult[key].price.discounted = false;

                        scrapingResult[key].price.before_price = 0;
                    } else {
                        scrapingResult[key].price.savings_amount = +(
                            scrapingResult[key].price.before_price - scrapingResult[key].price.current_price
                        ).toFixed(2);
                        scrapingResult[key].price.savings_percent = +(
                            (100 / scrapingResult[key].price.before_price) *
                            scrapingResult[key].price.savings_amount
                        ).toFixed(2);
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
        if (productList.length < 10) {
            throw new Error('No more products');
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

    /**
     * Extract product category/subcategory
     * @param {*} $
     */
    extractProductCategories($) {
        const categories = [];
        const cateogriesss = $('#wayfinding-breadcrumbs_feature_div > ul')[0];
        if (cateogriesss && cateogriesss.children) {
            cateogriesss.children.forEach((item) => {
                try {
                    if (!item.attribs.class) {
                        const url = `${this.mainHost}${item.children[0].children[0].attribs.href}`;
                        const category = item.children[0].children[0].children[0].data;
                        categories.push({
                            category,
                            url,
                        });
                    }
                } catch {
                    // continue regardless of error
                }
            });
        } else {
            const category = $('#nav-subnav > .nav-b');
            if (category && category.length) {
                categories.push({
                    category: category.text(),
                    url: `${this.mainHost}${category[0].attribs.href}`,
                });
            }
        }
        return categories;
    }

    /**
     * In case of a book we can extract name of authors
     */
    extractAuthors($) {
        const authors = [];
        const byAuthors = $('#bylineInfo')[0];
        if (byAuthors && byAuthors.children) {
            byAuthors.children.forEach((item, index) => {
                try {
                    if (item && item.name === 'span' && item.attribs.class.indexOf('author') > -1) {
                        let url = '';
                        let author = '';
                        let role = $(`#bylineInfo > span:nth-child(${index}) > span.contribution`).text();
                        if (role) {
                            role = role.replace(/[(),\s]/g, '');
                        }
                        if (item.children[0].name === 'a') {
                            const link = $(`#bylineInfo > span:nth-child(${index}) > a`)[0].attribs.href;
                            if (link != '#') {
                                url = `${this.mainHost}${link}`;
                                author = $(`#bylineInfo > span:nth-child(${index}) > a`).text();
                            }
                        } else {
                            const link = $(`#bylineInfo > span:nth-child(1) > span.a-declarative > a.a-link-normal.contributorNameID`)[0].attribs
                                .href;
                            url = `${this.mainHost}${link}`;
                            author = $(`#bylineInfo > span:nth-child(1) > span.a-declarative > a.a-link-normal.contributorNameID`).text();
                        }
                        if (author && url) {
                            authors.push({
                                author,
                                role,
                                url,
                            });
                        }
                    }
                } catch {
                    // continue regardless of error
                }
            });
        }
        return authors;
    }

    /**
     * Extract data from section "Other sellers on Amazon"
     * @param {*} $
     */
    extractOtherSellers($) {
        const other_sellers = [];
        const moreBuyingOptions = $('#mbc')[0];
        let position = 0;
        if (moreBuyingOptions && moreBuyingOptions.children) {
            moreBuyingOptions.children.forEach((item, index) => {
                try {
                    if (item.attribs.class && item.attribs.class === 'a-box mbc-offer-row pa_mbc_on_amazon_offer') {
                        position += 1;
                        const price = $(`#mbc > div:nth-child(${index + 1}) > div > span.a-declarative > div > div:nth-child(1)`).text();
                        const seller = $(`#mbc-sold-by-${position} > span.a-size-small.mbcMerchantName`).text();
                        const url = `${this.mainHost}${$(`#mbc-buybutton-addtocart-${position}-announce`)[0].attribs.href}`;
                        other_sellers.push({
                            position,
                            seller,
                            url,
                            price: {
                                symbol: this.geo.symbol,
                                currency: this.geo.currency,
                                current_price: this.geo.price_format(price),
                            },
                        });
                    }
                } catch {
                    // continue regardless of error
                }
            });
        }
        return other_sellers;
    }

    /**
     * Extract images
     * @param {*} $
     * @param {*} body
     */
    extractImages($, body) {
        let images = [];
        /**
         *  Some product have all the images located in the imageGalleryData array
         *  We will check if this array exists, if exists then we will extract it and collect the image url's
         *  Product types: books
         * */
        const imgRegex = /'colorImages': { 'initial': (.+)},'colorToAsin'/.exec(body);
        if (imgRegex) {
            try {
                const imageGalleryData = JSON.parse(imgRegex[1]);
                images = imageGalleryData.map((item) => item.hiRes || item.large);
            } catch {
                // continue regardless of error
            }
        }

        /**
         * If for example book item does have only one image
         * then {imageGalleryData} won't exist and we will use different way of extracting required data
         * Product types: books
         */
        if (!images.length) {
            const imageData = $('#imgBlkFront')[0] || $('#ebooksImgBlkFront')[0];
            if (imageData) {
                const data = imageData.attribs['data-a-dynamic-image'];
                const json = JSON.parse(data);
                const keys = Object.keys(json);
                const imageIdregex = /\/([\w-+]{9,13})\./.exec(keys[0]);
                if (imageIdregex) {
                    images.push(`https://images-na.ssl-images-amazon.com/images/I/${imageIdregex[1]}.jpg`);
                }
            }
        }

        /**
         * Extract images from other types of products
         * Product types: all other
         */
        if (!images.length) {
            const thumbnail = $('span[data-action="thumb-action"]');
            for (let i = 0; i < thumbnail.length; i++) {
                try {
                    let url = thumbnail[i].children[0].children[0].children[1].children[0].attribs.src;
                    if (url.indexOf('x-locale/common') === -1) {
                        images.push(`${url.split('._')[0]}._AC_SY879_.jpg`);
                    }
                } catch {
                    // continue regardless of error
                }
            }
        }
        return images;
    }

    /**
     * Extract book series (if available)
     * @param {*} $
     */
    extractBookInSeries($) {
        const series = [];

        const bookSeriesName = $(`div.shoveler-cell:nth-child(2)`)[0];
        if (bookSeriesName) {
            try {
                const url = $('div.shoveler-cell:nth-child(2) > a:nth-child(1)')[0].attribs.href;
                const image = $(`img.product-image:nth-child(1)`)[0].attribs.src;
                const series_name = $('div.shoveler-cell:nth-child(2) > a:nth-child(2)').text();
                series.push({
                    series_name: series_name.trim(),
                    images: [image],
                    url: `${this.mainHost}${url}`,
                });
            } catch {
                // continue regardless of error
            }
        }
        const booksInTheSeries = $(
            'div.a-carousel-controls:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ol:nth-child(1)',
        )[0];
        if (booksInTheSeries && booksInTheSeries.children) {
            booksInTheSeries.children.forEach((item, index) => {
                try {
                    index += 1;
                    const reviews = {
                        total_reviews: 0,
                        rating: 0,
                    };

                    const price = {
                        symbol: this.geo.symbol,
                        currency: this.geo.currency,
                        current_price: 0,
                    };

                    const serie = $(
                        `div.a-carousel-controls:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ol:nth-child(1) > li:nth-child(${index}) > div:nth-child(1) > a:nth-child(1) > div:nth-child(1) > span:nth-child(1)`,
                    ).text();
                    const image = $(
                        `div.a-carousel-controls:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ol:nth-child(1) > li:nth-child(${index}) > div:nth-child(1) > a:nth-child(1) > div:nth-child(1) > img:nth-child(2)`,
                    )[0].attribs.src;
                    const url = $(
                        `div.a-carousel-controls:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ol:nth-child(1) > li:nth-child(${index}) > div:nth-child(1) > a:nth-child(1)`,
                    )[0].attribs.href;
                    const title = $(
                        `div.a-carousel-controls:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ol:nth-child(1) > li:nth-child(${index}) > div:nth-child(1) > a:nth-child(2) > span:nth-child(1)`,
                    ).text();

                    const total_reviews = $(
                        `div.a-carousel-controls:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ol:nth-child(1) > li:nth-child(${index}) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > span:nth-child(2)`,
                    ).text();
                    const rating = $(
                        `div.a-carousel-controls:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ol:nth-child(1) > li:nth-child(${index}) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > i:nth-child(1) > span:nth-child(1)`,
                    )[0]
                        ? $(
                              $(
                                  `div.a-carousel-controls:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ol:nth-child(1) > li:nth-child(${index}) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > i:nth-child(1) > span:nth-child(1)`,
                              )[0],
                          )
                              .text()
                              .split(/\s/g)[0]
                        : 0;
                    reviews.total_reviews = parseInt(total_reviews.replace(/[^\d]/g, ''), 10);
                    reviews.rating = rating;

                    const current_price = $(
                        `div.a-carousel-controls:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ol:nth-child(1) > li:nth-child(${index}) > div:nth-child(1) > div:nth-child(5)`,
                    ).text();

                    price.current_price = this.geo.price_format(current_price);

                    series.push({
                        serie,
                        title,
                        images: [image],
                        url: `${this.mainHost}${url}`,
                        reviews,
                        price,
                    });
                } catch {
                    // continue regardless of error
                }
            });
        }
        return series;
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
