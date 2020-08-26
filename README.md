# Amazon Product/Reviews Scraper

![NPM](https://img.shields.io/npm/l/amazon-buddy.svg?style=for-the-badge) ![npm](https://img.shields.io/npm/v/amazon-buddy.svg?style=for-the-badge)

Useful tool to scrape product information from the amazon

## If you like this tool then please Star it

---

<a href="https://www.buymeacoffee.com/Usom2qC" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 134px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

---

## Features

-   **Scrape products from the search result**
-   **Scrape product data by asin**
-   **Scrape product reviews**
-   Sort result by sponsored products only
-   Sorts result by discounted products only
-   Result can be saved to the JSON/CSV files
-   You can scrape up to **500 produtcs** and **1000 reviews**

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
  --filetype      Type of the output file where data will be saved. 'all' - save
                  datat to the ` 'json' and 'csv' files
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

Scrape 40 producs from the amazon search result by using keyword "vacume cleaner" and save result to the CSV file

```sh
$ amazon-buddy products -k 'vacume cleaner' -n 40 --filetype csv
```

**Output:
1552945544582_products.csv**

#### Example 2

Scrape 40 producs from the amazon search result by using keyword "vacume cleaner" and display raw result in the terminal

```sh
$ amazon-buddy products -k 'vacume cleaner' -n 40 --filetype ''
```

#### Example 3

Scrape 40 producs from the amazon search result by using keyword "vacume cleaner" from the Amazon.NL(Netherlands) and display raw result in the terminal

```sh
$ amazon-buddy products -k 'vacume cleaner' -n 40 --filetype '' --country NL
```

#### Example 4

Scrape 40 producs from the amazon search result from the category "Apps & Games" by using keyword "games" from the Amazon.ES(SPAIN) and display raw result in the terminal

```sh
$ amazon-buddy products -k 'games' -n 40 --filetype '' --country ES --category mobile-apps
```

#### Example 5

Scrape 100 reviews from a product by using ASIN.
**_NOTE: ASIN is a uniq amazon product ID, it can be found in product URL or if you have scraped product list with our tool you will find it in the CSV/JSON files_**

```sh
$ amazon-buddy reviews B01GW3H3U8 -n 100
```

**Output:
reviews(B01GW3H3U8)\_1589470878252**

#### Example 6

Scrape 300 producs from the "xbox one" keyword with rating minimum rating 3 and maximum rating 4 and save everything to the CSV file

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
        const products = await amazonScraper.products({ keyword: 'Xbox One', number: 50, country: "NL" });
        
        // Collect 50 products from a keyword 'xbox one' from Amazon.CO.UK
        const products = await amazonScraper.products({ keyword: 'Xbox One', number: 50, country: "GB" });
        
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
    asin: 'B07MJV1K6M',
    price: {
        discounted: false,
        current_price: '1.99',
        currency: 'USD',
        before_price: 0,
        savings_amount: 0,
        savings_percent: 0
    },
    reviews: { total_reviews: 27, rating: 2.9 },
    url: 'https://www.amazon.com/dp/B07MJV1K6M',
    score: '78.30',
    sponsored: false,
    amazonChoice: false,
    bestSeller: false,
    amazonPrime: false,
    title: 'Savage Planet',
    thumbnail: 'https://m.media-amazon.com/images/I/71VF1gJv9iL._AC_UY218_.jpg'
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
[{
    title:
        'Newest Flagship Microsoft Xbox One S 1TB HDD ' +
        'Bundle with Two (2X) Wireless Controllers, 1-Month ' +
        'Game Pass Trial, 14-Day Xbox Live Gold Trial - ' +
        'White',
    asin: 'B08231TPSF',
    offerListingID: '',
    url: 'https://www.amazon.com/dp/B08231TPSF',
    reviews: { total_reviews: 302, rating: '4.6', answered_questions: 0 },
    price: {
        currency: 'USD',
        current_price: 475.98,
        discounted: false,
        before_price: 475.98,
        savings_amount: 0,
        savings_percent: 0,
    },
    images: [
        'https://images-na.ssl-images-amazon.com/images/I/31WOQ4LhYXL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/31t-e5lFMHL._AC_SY879_.jpg',
    ],
    storeID: '',
    brand: 'Brand: Xbox',
    soldBy: '',
    fulfilledBy: '',
    qtyPerOrder: 'na',
    badges: { amazonChoice: false, amazonPrime: false },
}]
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
    keyword: "",

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

    //Set proxy: {string default: ""}
    proxy: "",

    //Sort by rating. [minRating, maxRating]: {array default: [1,5]}
    rating:[1,5],

    //Sorting. If searching for a products then list will be sorted by a higher score(number of reviews*rating). If searching for a reviews then they will be sorted by rating.: {boolean default: false}
    sort: false,

    //Scrape only products with the discount: {boolean default: false}
    discount: false,

    //Scrape only sponsored products: {boolean default: false}
    sponsored: false,

    //Amazon is supported in 16 countries
    //List of all countries is posted below
    //Value should be in ISO 3166 (Alpha-2 code) format
    //{string default: "US"}
    country: "GB",
    
    // Number of async task {number default: 5}
    // The more the faster but do not go wild as usually 5 is enough 
    asyncTasks: 5,
    
    //Product search can be performed in the specific category
    //To get list of categories you can use method .categories()
    category:"digital-text",
    
    //Some product metadata is binded to the ZIP code
    //When you are setting the ZIP code new session is being generated by the Amazon
    //By setting cookie values you will receive more accurate data(pricing and etc)
    //Cookie example that can be extracted from the browser :session-id=222-22222-22222; session-id-time=222221l; ubid-main=444-4444-4444444
    cookie:"",

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
