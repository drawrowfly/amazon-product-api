
# Amazon Product Scraper
 

Useful tool to scrape product information from amazon

## Features
*   Scrape products from amazon search result: asin, rating, number of reviews, price, title, url, sponsored or not, discounted or not
*   Result can be save to a CSV file
*   You can scrape up to 100 produtcs

![alt text](https://i.imgur.com/FfNDX2J.png)

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
  amazon-buddy search [options]

Options:
  --help, -h       help                                                [boolean]
  --version        Show version number                                 [boolean]
  --keyword, -k    Amazon search keyword ex. 'Xbox one'
                                               [string] [required] [default: ""]
  --number, -n   Number of products to scrape. Maximum 100       [default: 20]
  --save, -s       Save to a CSV file?                [boolean] [default: false]

Examples:
  amazon-buddy search -k 'Xbox one'
```

**Example**

Scrape 40 producs from the "vacuum cleaner" keyword and save everything to a CSV file
```sh
$ amazon-buddy search -k 'vacuum cleaner' -s -n 40

```
**The file will be saved in a folder from which you run the script:
1552945544582.csv**

**Module**
```
const amazonScraper = require('amazon-buddy');

(async() => {
    try{
        let result = await amazonScraper({keyword: 'Xbox One', number: 50, save: true });
        console.log(result)
    }catch(error){
        console.log(error);
    }
})()
```
**JSON/CSV output:**
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

**Options**
```
let options = {
    //Search keyword
    keyword: 0,

    //Number of products to scrape. Default 20
    number: 20,

    //Save to a CSV file
    save: true,
    
    //Set proxy
    proxy: "",
};
```

License
----

**MIT**

**Free Software**