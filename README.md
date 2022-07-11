# Amazon Product Api (Unofficial)

![NPM](https://img.shields.io/npm/l/amazon-buddy.svg?style=for-the-badge) ![npm](https://img.shields.io/npm/v/amazon-buddy.svg?style=for-the-badge)

Very useful tool that is able to extract almost same amount of data as the official Amazon Product API

## If you like this tool then please Star it

---

<a href="https://www.buymeacoffee.com/Usom2qC" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 134px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

---

## Features

-   **Extract product data from the search result(by category, by country)**
-   **Extract lots of single product data by using ASIN id**
-   **Extract product reviews data by using ASIN id**
-   **Extract list of categories**
-   **Is supporting all available Amazon Marketplaces**
-   Sort result by sponsored products only
-   Sorts result by discounted products only
-   Result can be saved to the JSON/CSV files
-   You can scrape up to **500 products** and **1000 reviews**

**Product List**
![alt text](https://i.imgur.com/ES5M4Rx.png)
**Review List**
![alt text](https://i.imgur.com/HuBW3rl.png)

**Note:**

-   Empty parameter = empty value

**Possible errors**

-   If there will be let me know

## Installation

**Install from NPM**

```sh
$ npm i -g amazon-buddy
```

**Install from YARN**

```sh
$ yarn global add amazon-buddy
```

## USAGE

**Terminal**

```sh
$ amazon-buddy --help

Usage: amazon-buddy <command> [options]

Commands:
  amazon-buddy products      collect products by using keyword
  amazon-buddy reviews [id]  collect reviews from product by using ASIN id
  amazon-buddy asin [id]     single product details
  amazon-buddy categories    get list of categories
  amazon-buddy countries     get list of countries

Options:
  --help, -h      help                                                 [boolean]
  --version       Show version number                                  [boolean]
  --async, -a     Number of async tasks                  [string] [default: "5"]
  --keyword, -k   Amazon search keyword ex. 'Xbox one'    [string] [default: ""]
  --number, -n    Number of products to scrape. Maximum 100 products or 300
                  reviews                                 [number] [default: 20]
  --filetype      Type of the output file where the data will be saved. 'all' -
                  save data to the 'json' and 'csv' files
                            [choices: "csv", "json", "all", ""] [default: "csv"]
  --sort          If searching for the products then the list will be sorted by
                  the higher score(number of reviews*rating). If searching for
                  the reviews then they will be sorted by the rating.
                                                      [boolean] [default: false]
  --discount, -d  Scrape only products with the discount
                                                      [boolean] [default: false]
  --sponsored     Scrape only sponsored products      [boolean] [default: false]
  --min-rating    Minimum allowed rating                   [number] [default: 1]
  --max-rating    Maximum allowed rating                   [number] [default: 5]
  --country       In ISO 3166 (Alpha-2 code) format. To get available list of
                  countries type and use (index) from the shown table as value:
                  amazon-buddy countries                [string] [default: "US"]
  --category      To get available list of categories type and use (index) from
                  the shown table as value: amazon-buddy categories
                                                       [string] [default: "aps"]
  --random-ua     Randomize user agent version. This helps to prevent request
                  blocking from the amazon side       [boolean] [default: false]
  --user-agent    Set custom user-agent                   [string] [default: ""]
  --timeout, -t   Timeout between requests. Timeout is set in mls: 1000 mls = 1


Examples:
  amazon-buddy products -k 'Xbox one'
  amazon-buddy products -k 'Xbox one' --country 'GB'
  amazon-buddy reviews B01GW3H3U8
  amazon-buddy asin B01GW3H3U8
  amazon-buddy categories
  amazon-buddy countries
```

#### Example 1

Scrape 40 products from the amazon search result by using keyword "vacuum cleaner" and save result to the CSV file

```sh
$ amazon-buddy products -k 'vacuum cleaner' -n 40 --filetype csv
```

**Output:
1552945544582_products.csv**

#### Example 2

Scrape 40 products from the amazon search result by using keyword "vacuum cleaner" and display raw result in the terminal

```sh
$ amazon-buddy products -k 'vacuum cleaner' -n 40 --filetype ''
```

#### Example 3

Scrape 40 products from the amazon search result by using keyword "vacuum cleaner" from the Amazon.NL(Netherlands) and display raw result in the terminal

```sh
$ amazon-buddy products -k 'vacuum cleaner' -n 40 --filetype '' --country NL
```

#### Example 4

Scrape 40 products from the amazon search result from the category "Apps & Games" by using keyword "games" from the Amazon.ES(SPAIN) and display raw result in the terminal

```sh
$ amazon-buddy products -k 'games' -n 40 --filetype '' --country ES --category mobile-apps
```

#### Example 5

Scrape 100 reviews from a product by using ASIN.
**_NOTE: ASIN is a unique amazon product ID, it can be found in product URL or if you have scraped product list with our tool you will find it in the CSV/JSON files_**

```sh
$ amazon-buddy reviews B01GW3H3U8 -n 100
```

**Output:
reviews(B01GW3H3U8)\_1589470878252**

#### Example 6

Scrape 300 products from the "Xbox one" keyword with rating minimum rating 3 and maximum rating 4 and save everything to the CSV file

```sh
$ amazon-buddy products -k 'xbox one' -n 300 --min-rating 3 --max-rating 4
```

**Output:
1552945544582_products.csv**

#### Example 7

Show list of all available countries

```sh
$ amazon-buddy countries
```

**Output:**
![alt text](https://i.imgur.com/SyPRHcN.png)

#### Example 7

Show list of all available categories from the Amazon.CO.UK

```sh
$ amazon-buddy categories --country GB
```

**Output:**
![alt text](https://i.imgur.com/k4MBg2h.png)

## Module

### Methods

```javascript
.products() - product search
.reviews() - reviews search
.asin() - single product details
.categories() - available categories
```

### Example

```javascript
const amazonScraper = require('amazon-buddy');

(async () => {
    try {
        // Collect 50 products from a keyword 'xbox one'
        // Default country is US
        const products = await amazonScraper.products({ keyword: 'Xbox One', number: 50 });

        // Collect 50 products from a keyword 'xbox one' from Amazon.NL
        const products = await amazonScraper.products({ keyword: 'Xbox One', number: 50, country: 'NL' });

        // Collect 50 products from a keyword 'xbox one' from Amazon.CO.UK
        const products = await amazonScraper.products({ keyword: 'Xbox One', number: 50, country: 'GB' });

        // Collect products that are located on page number 2
        const reviews = await amazonScraper.products({ keyword: 'Xbox One', bulk: false, page: 2 });

        // Collect 50 products from a keyword 'xbox one' with rating between 3-5 stars
        const products_rank = await amazonScraper.products({ keyword: 'Xbox One', number: 50, rating: [3, 5] });

        // Collect 50 reviews from a product ID B01GW3H3U8
        const reviews = await amazonScraper.reviews({ asin: 'B01GW3H3U8', number: 50 });

        // Collect 50 reviews from a product ID B01GW3H3U8  with rating between 1-2 stars
        const reviews_rank = await amazonScraper.reviews({ asin: 'B01GW3H3U8', number: 50, rating: [1, 2] });

        // Get single product details by using ASIN id
        const product_by_asin = await amazonScraper.asin({ asin: 'B01GW3H3U8' });

        // Get categories from amazon.COM.AU
        const categories_AU = await amazonScraper.categories({ country: 'AU' });

        // Get categories from amazon.CN
        const categories_CN = await amazonScraper.categories({ country: 'CN' });
    } catch (error) {
        console.log(error);
    }
})();
```

### .products() output

```javascript
[{
    position: { page: 1, position: 1, global_position: 1 },
    asin: 'B07CSLG8ST',
    price: {
        discounted: false,
        current_price: 574,
        currency: 'USD',
        before_price: 0,
        savings_amount: 0,
        savings_percent: 0
    },
    reviews: { total_reviews: 317, rating: 4.6 },
    url: 'https://www.amazon.com/dp/B07CSLG8ST',
    score: '1458.20',
    sponsored: false,
    amazonChoice: false,
    bestSeller: false,
    amazonPrime: false,
    title: 'Newest Flagship Microsoft Xbox One S 1TB HDD Bundle with Two (2X) Wireless Controllers, 1-Month Game Pass Trial, 14-Day Xbox Live Gold Trial - White',
    thumbnail: 'https://m.media-amazon.com/images/I/51-JAEI1jzL._AC_UY218_.jpg'
},...]
```

### .reviews() output

```javascript
[{
    id: 'R3OZ9T0YATJ5UM',
    review_data: 'Reviewed in the United States on May 31, 2018',
    name: 'Danyelle Arbour',
    rating: 5,
    title: 'I would 100% suggest this to everyone.',
    review:
        'I love this. It just arrived today, I immediately plugged it ' +
        'into my computer and it has the best picture. My old webcam I ' +
        'got like 8 years ago and it was so pixellated then it suddenly ' +
        'was just white with pink streaks. I hopped on amazon because I ' +
        'really desperately needed a new cam but at a very tight budget ' +
        'and this one fit the bill. I would 100% suggest this to ' +
        'everyone. Very easy to adjust the angle and it sets up with ' +
        'zero effort.',
},...]
```

### .asin() output

```javascript
{
    title: 'New Apple MacBook Pro (16-inch, 16GB RAM, 512GB Storage, 2.6GHz Intel Core i7) - Space Gray',
    description: '',
    feature_bullets: [
        'Ninth-generation 6-Core Intel Core i7 Processor',
        'Stunning 16-inch Retina Display with True Tone technology',
        'Touch Bar and Touch ID',
        'AMD Radeon Pro 5300M Graphics with GDDR6 memory',
        'Ultrafast SSD',
        'Intel UHD Graphics 630',
        'Six-speaker system with force-cancelling woofers',
        'Four Thunderbolt 3 (USB-C) ports',
        'Up to 11 hours of battery life',
        '802.11AC Wi-Fi',
    ],
    variants: [
        {
            asin: 'B081FWLDZ2',
            images: [
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31Ky7oRBGtL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31Ky7oRBGtL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SL1500_.jpg',
                    variant: 'MAIN',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX522_.jpg': ['522', '522'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/418onp2C2%2BL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/418onp2C2%2BL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SL1500_.jpg',
                    variant: 'PT01',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX466_.jpg': ['466', '466'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51U4uOwYbUL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51U4uOwYbUL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SL1500_.jpg',
                    variant: 'PT02',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51MFgSmK%2B1L._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51MFgSmK%2B1L._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SL1500_.jpg',
                    variant: 'PT03',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX679_.jpg': ['679', '679'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31tkOrl17nL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31tkOrl17nL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SL1500_.jpg',
                    variant: 'PT04',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/21nvGq8dsRL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/21nvGq8dsRL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SL1500_.jpg',
                    variant: 'PT05',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX679_.jpg': ['679', '679'],
                    },
                },
            ],
            title: 'Intel Core i7 512GB Silver',
            link: 'https://www.amazon.com/dp/B081FWLDZ2/?th=1&psc=1',
            is_current_product: false,
            price: '',
        },
        {
            asin: 'B081FZV45H',
            images: [
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg',
                    variant: 'MAIN',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX466_.jpg': ['466', '466'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SL1500_.jpg',
                    variant: 'PT01',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SL1500_.jpg',
                    variant: 'PT02',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SL1500_.jpg',
                    variant: 'PT03',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SL1500_.jpg',
                    variant: 'PT04',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SL1500_.jpg',
                    variant: 'PT05',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX522_.jpg': ['522', '522'],
                    },
                },
            ],
            title: 'Intel Core i7 512GB Space Gray',
            link: 'https://www.amazon.com/dp/B081FZV45H/?th=1&psc=1',
            is_current_product: true,
            price: '',
        },
        {
            asin: 'B081FTNGNC',
            images: [
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31Ky7oRBGtL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31Ky7oRBGtL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SL1500_.jpg',
                    variant: 'MAIN',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX522_.jpg': ['522', '522'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/418onp2C2%2BL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/418onp2C2%2BL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SL1500_.jpg',
                    variant: 'PT01',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX466_.jpg': ['466', '466'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51U4uOwYbUL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51U4uOwYbUL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SL1500_.jpg',
                    variant: 'PT02',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51MFgSmK%2B1L._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51MFgSmK%2B1L._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SL1500_.jpg',
                    variant: 'PT03',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX679_.jpg': ['679', '679'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31tkOrl17nL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31tkOrl17nL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SL1500_.jpg',
                    variant: 'PT04',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/21nvGq8dsRL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/21nvGq8dsRL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SL1500_.jpg',
                    variant: 'PT05',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX679_.jpg': ['679', '679'],
                    },
                },
            ],
            title: 'Intel Core i9 1TB Silver',
            link: 'https://www.amazon.com/dp/B081FTNGNC/?th=1&psc=1',
            is_current_product: false,
            price: '',
        },
        {
            asin: 'B081FV1Y57',
            images: [
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg',
                    variant: 'MAIN',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX466_.jpg': ['466', '466'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SL1500_.jpg',
                    variant: 'PT01',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SL1500_.jpg',
                    variant: 'PT02',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SL1500_.jpg',
                    variant: 'PT03',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SL1500_.jpg',
                    variant: 'PT04',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SL1500_.jpg',
                    variant: 'PT05',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX522_.jpg': ['522', '522'],
                    },
                },
            ],
            title: 'Intel Core i9 1TB Space Gray',
            link: 'https://www.amazon.com/dp/B081FV1Y57/?th=1&psc=1',
            is_current_product: false,
            price: '',
        },
    ],
    asin: 'B081FZV45H',
    url: 'https://www.amazon.com/dp/B081FZV45H',
    reviews: { total_reviews: 1224, rating: '4.6', answered_questions: 297 },
    price: { symbol: '$', currency: 'USD', current_price: 2149, discounted: true, before_price: 2399, savings_amount: 250, savings_percent: 10.42 },
    bestsellers_rank: [],
    main_image: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_SY879_.jpg',
    total_images: 6,
    images: [
        'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_SY879_.jpg',
    ],
    total_videos: 0,
    videos: [],
    delivery_message: 'FREE delivery: Sunday, Sep 6Details',
    product_information: {
        dimensions: '9.68 x 14.09 x 0.64 inches',
        weight: '8.23 pounds',
        available_from: 'November 13, 2019',
        available_from_utc: '2019-11-12T23:00:00.000Z',
        available_for_months: 10,
        available_for_days: 291,
        manufacturer: 'Apple Computer',
        model_number: 'MVVJ2LL/A',
        department: '',
        sold_by: 'Amazon.com',
        fulfilled_by: 'Amazon.com',
        qty_per_order: 2,
        store_id: '',
        brand: 'Visit the Apple Store',
    },
    badges: { amazon_сhoice: true, amazon_prime: false },
};
```

### .categories() output

```javascript
{
    aps: { name: 'All Departments', category: 'aps' },
    'arts-crafts-intl-ship': { name: 'Arts & Crafts', category: 'arts-crafts-intl-ship' },
    'automotive-intl-ship': { name: 'Automotive', category: 'automotive-intl-ship' },
    'baby-products-intl-ship': { name: 'Baby', category: 'baby-products-intl-ship' },
    'beauty-intl-ship': { name: 'Beauty & Personal Care', category: 'beauty-intl-ship' },
    'stripbooks-intl-ship': { name: 'Books', category: 'stripbooks-intl-ship' },
    'computers-intl-ship': { name: 'Computers', category: 'computers-intl-ship' },
    'digital-music': { name: 'Digital Music', category: 'digital-music' },
    'electronics-intl-ship': { name: 'Electronics', category: 'electronics-intl-ship' },
    'digital-text': { name: 'Kindle Store', category: 'digital-text' },
    'instant-video': { name: 'Prime Video', category: 'instant-video' },
    'fashion-womens-intl-ship': { name: "Women's Fashion", category: 'fashion-womens-intl-ship' },
    'fashion-mens-intl-ship': { name: "Men's Fashion", category: 'fashion-mens-intl-ship' },
    'fashion-girls-intl-ship': { name: "Girls' Fashion", category: 'fashion-girls-intl-ship' },
    'fashion-boys-intl-ship': { name: "Boys' Fashion", category: 'fashion-boys-intl-ship' },
    'deals-intl-ship': { name: 'Deals', category: 'deals-intl-ship' },
    'hpc-intl-ship': { name: 'Health & Household', category: 'hpc-intl-ship' },
    'kitchen-intl-ship': { name: 'Home & Kitchen', category: 'kitchen-intl-ship' },
    'industrial-intl-ship': { name: 'Industrial & Scientific', category: 'industrial-intl-ship' },
    'luggage-intl-ship': { name: 'Luggage', category: 'luggage-intl-ship' },
    'movies-tv-intl-ship': { name: 'Movies & TV', category: 'movies-tv-intl-ship' },
    'music-intl-ship': { name: 'Music, CDs & Vinyl', category: 'music-intl-ship' },
    'pets-intl-ship': { name: 'Pet Supplies', category: 'pets-intl-ship' },
    'software-intl-ship': { name: 'Software', category: 'software-intl-ship' },
    'sporting-intl-ship': { name: 'Sports & Outdoors', category: 'sporting-intl-ship' },
    'tools-intl-ship': { name: 'Tools & Home Improvement', category: 'tools-intl-ship' },
    'toys-and-games-intl-ship': { name: 'Toys & Games', category: 'toys-and-games-intl-ship' },
    'videogames-intl-ship': { name: 'Video Games', category: 'videogames-intl-ship' },
}
```

### Options

```javascript
const options = {
    //Search keyword: {string default: ""}
    keyword: '',

    //Number of products to scrape: {int default: 10}
    number: 10,

    // If {bulk} is set to {false} then you can only scrape products by page. Note that {number} will be ignored
    // Very usefull if you need to scrape products from a specific page
    bulk: true,

    // Search result {page} number
    // You can set this value to 5 and scraper will collect all products starting from the {page} number 5
    page: 0,

    // Save result to a file: {boolean default: ''}
    // You can set ['json', 'csv', 'all', '']
    // 'all' - save result to JSON and CSV files
    filetype: '',

    // Set proxy: {string default: []}
    // Array of proxies. If more then 1 then each http request will use randmon proxy from the array
    proxy: ['username:password@ip:port', 'username:password@ip:port'],

    //Sort by rating. [minRating, maxRating]: {array default: [1,5]}
    rating: [1, 5],

    //Sorting. If searching for a product then list will be sorted by a higher score(number of reviews*rating). If searching for a reviews then they will be sorted by rating.: {boolean default: false}
    sort: false,

    //Scrape only products with the discount: {boolean default: false}
    discount: false,

    //Scrape only sponsored products: {boolean default: false}
    sponsored: false,

    //Amazon is supported in 16 countries
    //List of all countries is posted below
    //Value should be in ISO 3166 (Alpha-2 code) format
    //{string default: "US"}
    country: 'GB',

    // Number of async task {number default: 5}
    // The more the faster but do not go wild as usually 5 is enough
    asyncTasks: 5,

    //Product search can be performed in the specific category
    //To get list of categories you can use method .categories()
    category: 'digital-text',

    //Some product metadata is binded to the ZIP code
    //When you are setting the ZIP code new session is being generated by the Amazon
    //By setting cookie values you will receive more accurate data(pricing and etc)
    //Cookie example that can be extracted from the browser :session-id=222-22222-22222; session-id-time=222221l; ubid-main=444-4444-4444444
    cookie: '',

    //Randomize user agent version. This helps to prevent request blocking from the amazon side
    randomUa: false,

    //Timeout between requests. Timeout is set in mls: 1000 mls = 1 second
    timeout: 0,
};
```

### List of supported countries

```javascript
{
    US: {
        country: 'United States of America',
        currency: 'USD',
        host: 'www.amazon.com',
    },
    AU: {
        country: 'Australia',
        currency: 'AUD',
        host: 'www.amazon.com.au',
    },
    BR: {
        country: 'Brazil',
        currency: 'BRL',
        host: 'www.amazon.com.br',
    },
    CA: {
        country: 'Canada',
        currency: 'CAD',
        host: 'www.amazon.ca',
    },
    CN: {
        country: 'China',
        currency: 'CNY',
        host: 'www.amazon.cn',
    },
    FR: {
        country: 'France',
        currency: 'EUR',
        host: 'www.amazon.fr',
    },
    DE: {
        country: 'Germany',
        currency: 'EUR',
        host: 'www.amazon.de',
    },
    IN: {
        country: 'India',
        currency: 'INR',
        host: 'www.amazon.in',
    },
    IT: {
        country: 'Italy',
        currency: 'EUR',
        host: 'www.amazon.it',
    },
    MX: {
        country: 'Mexico',
        currency: 'MXN',
        host: 'www.amazon.com.mx',
    },
    NL: {
        country: 'Netherlands',
        currency: 'EUR',
        host: 'www.amazon.nl',
    },
    SG: {
        country: 'Singapore',
        currency: 'SGD',
        host: 'www.amazon.sg',
    },
    ES: {
        country: 'Spain',
        currency: 'EUR',
        host: 'www.amazon.es',
    },
    TR: {
        country: 'Turkey',
        currency: 'TRY',
        host: 'www.amazon.com.tr',
    },
    AE: {
        country: 'United Arab Emirates',
        currency: 'AED',
        host: 'www.amazon.ae',
    },
    GB: {
        country: 'United Kingdom',
        currency: 'GBP',
        host: 'www.amazon.co.uk',
    },
    JP: {
        country: 'Japan',
        currency: 'JPY',
        host: 'www.amazon.jp',
    },
}
```

---

## License

**MIT**

**Free Software**
