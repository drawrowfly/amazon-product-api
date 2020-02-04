
# Amazon Product Scraper
 ![NPM](https://img.shields.io/npm/l/amazon-buddy.svg?style=for-the-badge) ![npm](https://img.shields.io/npm/v/amazon-buddy.svg?style=for-the-badge)

Useful tool to scrape product information from amazon

## If you like this tool then please Star it

## Features
*   **Scrape products** from amazon search result: asin, rating, number of reviews, price, title, url, sponsored or not, discounted or not
*   **Scrape reviews** from amazon search result: title, review, rating, reviewer name and date when it was posted
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
  --discount, -d Scrape only for a products with the discount
                                                      [boolean] [default: false]
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

**Module**
```
const amazonScraper = require('amazon-buddy');

(async() => {
    try{
        let products = await amazonScraper.products({keyword: 'Xbox One', number: 50, save: true });
        let reviews = await amazonScraper.rewviews({asin: 'B01GW3H3U8', number: 50, save: true });
    }catch(error){
        console.log(error);
    }
})()
```
**JSON/CSV output(products):**
```
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
```
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
```
let options = {
    //Search keyword
    keyword: 0,

    //Number of products to scrape. Default 10
    number: 20,

    //Save to a CSV file
    save: true,

    //Set proxy
    proxy: "",

    //Sorting. If searching for a products then list will be sorted by a higher score(number of reviews*rating). If searching for a reviews then they will be sorted by rating.
    sort: true,

    //Scrape only for a products with the discount
    discount: true,

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
