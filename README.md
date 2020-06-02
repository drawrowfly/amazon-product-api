# Amazon Product Scraper

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
  amazon-buddy products   scrape for a products from the provided key word
  amazon-buddy reviews    scrape reviews from a product by using ASIN
  amazon-buddy asin [id]  scrape data from a single product by using ASIN

Options:
  --help, -h     help                                                  [boolean]
  --version      Show version number                                   [boolean]
  --keyword, -k  Amazon search keyword ex. 'Xbox one'     [string] [default: ""]
  --number, -n   Number of products to scrape. Maximum 100 products or 300 reviews        [default: 10]
  --filetype      Type of the output file where data will be saved. 'all' - save
                  datat to the ` 'json' and 'csv' files
                            [choices: "csv", "json", "all", ""] [default: "csv"]
  --sort         If searching for a products then list will be sorted by a higher
                 score(reviews*rating). If searching for a reviews then they will
                 be sorted by rating.                 [boolean] [default: false]
  --discount, -d Scrape only products with the discount
                                                      [boolean] [default: false]
  --sponsored     Scrape only sponsored products      [boolean] [default: false]
  --min-rating    Minimum allowed rating                            [default: 1]
  --max-rating    Maximum allowed rating                            [default: 5]
  --host, -H      The custom amazon host (can be www.amazon.fr, www.amazon.de, etc.)
                                            [string] [default: "www.amazon.com"]
  --random-ua     Randomize user agent version. This helps to prevent request
                  blocking from the amazon side       [boolean] [default: false]
  --timeout, -t   Timeout between requests. Timeout is set in mls: 1000 mls = 1
                  second                                   [number] [default: 0]


Examples:
  amazon-buddy products -k 'Xbox one'
  amazon-buddy products -k 'Xbox one' --host 'www.amazon.fr'
  amazon-buddy reviews B01GW3H3U8
  amazon-buddy asin B01GW3H3U8
```

**Example 1**

Scrape 40 producs from amazon search result by using keyword "vacume cleaner" and save result to the CSV file

```sh
$ amazon-buddy products -k 'vacume cleaner' -n 40 --filetype csv
```

**The file will be saved in a folder from which you run the script:
products(vacume cleaner)\_1589470796380**

**Example 2**

Scrape 100 reviews from a product by using ASIN.
**_NOTE: ASIN is a uniq amazon product ID, it can be found in product URL or if you have scraped product list with our tool you will find it in a CSV/JSON files_**

```sh
$ amazon-buddy reviews B01GW3H3U8 -n 100
```

**The file will be saved in a folder from which you run the script:
reviews(B01GW3H3U8)\_1589470878252**

**Example 3**

Scrape 300 producs from the "xbox one" keyword with rating minimum rating 3 and maximum rating 4 and save everything to a CSV file

```sh
$ amazon-buddy products -k 'xbox one' -n 300 --min-rating 3 --max-rating 4
```

**The file will be saved in a folder from which you run the script:
1552945544582_products.csv**

# Module

### Promise

```javascript
const amazonScraper = require('amazon-buddy');

(async () => {
    try {
        // Collect 50 products from a keyword 'xbox one'
        const products = await amazonScraper.products({ keyword: 'Xbox One', number: 50, save: true });
        // Collect products that are located on page number 2
        const reviews = await amazonScraper.products({ keyword: 'Xbox One', bulk: false, page: 2 });
        // Collect 50 products from a keyword 'xbox one' with rating between 3-5 stars
        const products_rank = await amazonScraper.products({ keyword: 'Xbox One', number: 50, rating: [3, 5] });

        // Collect 50 reviews from a product ID B01GW3H3U8
        const reviews = await amazonScraper.reviews({ asin: 'B01GW3H3U8', number: 50, save: true });
        // Collect 50 reviews from a product ID B01GW3H3U8  with rating between 1-2 stars
        const reviews_rank = await amazonScraper.reviews({ asin: 'B01GW3H3U8', number: 50, rating: [1, 2] });

        const product_by_asin = await amazonScraper.asin({ asin: 'B01GW3H3U8' });
    } catch (error) {
        console.log(error);
    }
})();
```

### Event

-   You won't be able to use promises.
-   {sort} and {save} will be ignored

```javascript
const amazonScraper = require('amazon-buddy');

let products = amazonScraper.products({
    keyword: 'xbox',
    number: 50,
    event: true,
});

products.on('error message', (error) => {
    console.log(error);
});

products.on('item', (item) => {
    console.log(item);
});

products.on('completed', () => {
    console.log('completed');
});
products._startScraper();
```

**JSON/CSV output(products):**

```javascript
[{
    asin: 'B01N6HLV9L',
    discounted: false,  // is true if product is with the discount
    sponsored: false,  // is true if product is sponsored
    amazonChoice: true,// if amazon choice badge is present
    price: '$32.99',
    before_discount: '$42.99', // displayed only if price is discounted
    title:'product title',
    url:'long amazon url'
}...]
```

**JSON/CSV output(reviews):**

```javascript
[{
    id: 'R335O5YFEWQUNE',
    review_data: '6-Apr-17',
    name: 'Bob',
    title: 'Happy Gamer',
    rating: 5,
    review: 'blah blah blah'
}...]
```

**JSON/CSV output(asin):**

```javascript
{
        title: 'Apple iPhone 6S, 64GB, Rose Gold - For AT&T / T-Mobile (Renewed)',
        url: 'https://www.amazon.com/dp/B01CR1FQMG',
        reviews: { total_reviews: 2406, rating: '3.8', answered_questions: 677 },
        price: { current_price: 14.98, discounted: false, before_price: 14.98, savings_amount: 0, savings_percent: 0 },
        images: [
            'https://images-na.ssl-images-amazon.com/images/I/412jWjEIzKL._AC_SY879_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/41XdO4T0xvL._AC_SY879_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/31qHuwnKOkL._AC_SY879_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/21CAx9aDlfL._AC_SY879_.jpg',
        ],
        storeID: 'wireless',
        brand: 'Amazon Renewed',
        badges: { amazonChoice: false, amazonPrime: false },
    }
```

**Options**

```javascript
let options = {
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

    // Enable/disabled EventEmitter: {boolean default: false}
    // If enabled then you won't be able to use promises
    event: false,

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

    //Search on custom amazon host to list products in specific language
    host: "www.amazon.de",

    //Randomize user agent version. This helps to prevent request blocking from the amazon side
    randomUa: false

    //Timeout between requests. Timeout is set in mls: 1000 mls = 1 second
    timeout: 0
};
```

---

## License

**MIT**

**Free Software**
