const AmazonScrapper = require('./lib/index');

const getAsinFromUrl = (rawUrl) => {
    const url = new URL(rawUrl);
    const paths = url.pathname.split('/');

    let lastPath = null;
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        if (lastPath && lastPath == 'dp') {
            return path;
        }
        lastPath = path;
    }
};

const uniqueUrls = [
    'https://www.amazon.com/dp/B085L71L9R',
    // 'https://www.amazon.com/NUK-Orthodontic-Pacifiers-Timeless-Collection/dp/B0876YCC9B?th=52',
];

// const { uniqueUrls } = require('../scripts/productNERTrainingData/getAmazonUrls');

const main = async () => {
    const amazonData = [];
    for (let index = 0; index < uniqueUrls.slice(0, 10).length; index++) {
        console.log(`Processing ${index} of ${uniqueUrls.slice(0, 10).length}`);
        const url = uniqueUrls[index];
        const asin = getAsinFromUrl(url);
        const data = await AmazonScrapper.asin({ asin: asin });
        console.log(JSON.stringify(data.result[0], null, 4));
        amazonData.push(data.result[0]);
    }

    // const fs = require('fs');
    // fs.writeFileSync('amazonData.json', JSON.stringify(amazonData, null, 4));
};

main();
