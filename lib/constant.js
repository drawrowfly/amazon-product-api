module.exports = {
    limit: {
        product: 500,
        reviews: 1000,
    },
    defaultItemLimit: 10,
    fields: {
        reviews: ['id', 'review_data', 'name', 'rating', 'title', 'review'],
        products: [
            'title',
            'price',
            'savings',
            'rating',
            'reviews',
            'score',
            'url',
            'sponsored',
            'discounted',
            'amazonChoice',
            'beforeDiscount',
            'asin',
            'thumbnail',
        ],
        asin: [''],
    },
};
