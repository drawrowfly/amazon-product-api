const amazonScraper = require('amazon-buddy');

test('asin', async () => {
    const asin = await amazonScraper.asin({ asin: 'B01GW3H3U8' });
    expect(asin);
});

test('categories', async () => {
    const categories = await amazonScraper.categories();
    expect(categories);
});

test('countries', async () => {
    const countries = await amazonScraper.countries();
    expect(countries.length).toBeGreaterThan(0);
    const us = countries.find(({ country_code }) => country_code.toLowerCase() === 'us');
    expect(us);
});

test('products', async () => {
    const products = await amazonScraper.products({ keyword: 'Xbox One', number: 1 });
    expect(Object.keys(products || {}).length).toBeGreaterThan(0);
});

test('reviews', async () => {
    const reviews = await amazonScraper.reviews({ asin: 'B01GW3H3U8' });
    expect(reviews);
});
