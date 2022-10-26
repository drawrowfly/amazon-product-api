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

exports.handler = async (event) => {
    const { url, useProxy = true } = event.queryStringParameters;
    // USE PROXY HOW CRI MIX
    const asin = getAsinFromUrl(url);
    const data = await AmazonScrapper.asin({ asin: asin });

    const response = {
        statusCode: 200,
        body: JSON.stringify(data.result[0]),
    };
    return response;
};
