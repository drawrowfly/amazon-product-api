
# Amazon Product Scraper
 ![NPM](https://img.shields.io/npm/l/amazon-buddy.svg?style=for-the-badge) ![npm](https://img.shields.io/npm/v/amazon-buddy.svg?style=for-the-badge)

Useful tool to scrape product information from amazon

## If you like this tool then please Star it

***
<a href="https://www.buymeacoffee.com/Usom2qC" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 134px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
***

## Features
*   **Scrape products** from amazon search result: asin, rating, number of reviews, price, title, url, sponsored or not, discounted or not
*   **Scrape reviews** from amazon search result: title, review, rating, reviewer name and date when it was posted
*   Sort result by rating(stars)
*   Sort result by sponsored products only
*   Sorts result by discounted products only
*   Result can be save to a CSV file
*   You can scrape up to **500 produtcs** and **1000 reviews**

**Product List**
![alt text](https://i.imgur.com/ES5M4Rx.png)
**Review List**
![alt text](https://i.imgur.com/HuBW3rl.png)

**Note:**
*   Empty parameter = empty value

**Possible errors**
*   If there will be let me know

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
  amazon-buddy products  scrape products from the provided key word
  amazon-buddy reviews   scrape reviews from a product

Options:
  --help, -h     help                                                  [boolean]
  --version      Show version number                                   [boolean]
  --keyword, -k  Amazon search keyword ex. 'Xbox one'     [string] [default: ""]
  --asin, -a     To scrape reviews you need to provide product ASIN(amazon
                 product id)                              [string] [default: ""]
  --number, -n   Number of products to scrape. Maximum 100 products or 300 reviews        [default: 10]
  --save, -s     Save to a CSV file?                   [boolean] [default: true]
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


Examples:
  amazon-buddy products -k 'Xbox one'
  amazon-buddy products -k 'Xbox one' -h 'www.amazon.fr'
  amazon-buddy reviews -a B01GW3H3U8
```

**Example 1**

Scrape 40 producs from the "vacume cleaner" keyword and save everything to a CSV file
```sh
$ amazon-buddy products -k 'vacume cleaner' -n 40
```
**The file will be saved in a folder from which you run the script:
1552945544582_products.csv**

**Example 2**

Scrape 100 reviews from a product by using ASIN.
***NOTE: ASIN is a uniq amazon product ID, it can be found in product URL or if you have scraped product list with our tool you will find it in a CSV file***
```sh
$ amazon-buddy reviews -a B01GW3H3U8 -n 100
```
**The file will be saved in a folder from which you run the script:
1552945544582_B01GW3H3U8_reviews.csv**

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

(async() => {
    try{
        // Collect 50 products from a keyword 'xbox one'
        let products = await amazonScraper.products({keyword: 'Xbox One', number: 50, save: true });
        // Collect 50 reviews from a product ID B01GW3H3U8
        let reviews = await amazonScraper.rewviews({asin: 'B01GW3H3U8', number: 50, save: true });
        
        // Collect 50 products from a keyword 'xbox one' with rating between 3-5 stars
        let products_rank = await amazonScraper.products({keyword: 'Xbox One', number: 50, rating:[3,5] });
        // Collect 50 reviews from a product ID B01GW3H3U8  with rating between 1-2 stars
        let reviews_rank = await amazonScraper.rewviews({asin: 'B01GW3H3U8', number: 50,  rating: [1,2] });
    }catch(error){
        console.log(error);
    }
})()
```

### Event
* You won't be able to use promises.
* {sort} and {save} will be ignored
```javascript
const amazonScraper = require('amazon-buddy');

let products = amazonScraper.products({
    keyword: 'xbox',
    number: 50,
    event: true,
});

products.on('error message', error => {
    console.log(error);
});

products.on('item', item => {
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

**Options**
```javascript
let options = {
    //Search keyword: {string default: ""}
    keyword: "",

    //Number of products to scrape: {int default: 10}
    number: 10,
    
    // Enable/disabled EventEmitter: {boolean default: false}
    // If enabled then you won't be able to use promises 
    event: false,

    //Save to a CSV file: {boolean default: false}
    save: false,

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
    host: "www.amazon.de"
};
```

***
<a href="https://www.buymeacoffee.com/Usom2qC" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

----
License
----

**MIT**

**Free Software**
