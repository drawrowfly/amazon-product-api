module.exports = {
    limit: {
        product: 500,
        reviews: 1000,
    },
    defaultItemLimit: 15,
    geo: {
        US: {
            country: 'United States of America',
            currency: 'USD',
            host: 'www.amazon.com',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\.]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        AU: {
            country: 'Australia',
            currency: 'AUD',
            host: 'www.amazon.com.au',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\.]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        BR: {
            country: 'Brazil',
            currency: 'BRL',
            host: 'www.amazon.com.br',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\,]/g, '');
                return parseFloat(formatedPrice.replace(/,/g, '.'));
            },
            product_information: {
                // <<------ NOT CORRECT! Requires translation of the {fields} key values. I don't have much time to do it
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        CA: {
            country: 'Canada',
            currency: 'CAD',
            host: 'www.amazon.ca',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\.]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        CN: {
            country: 'China',
            currency: 'CNY',
            host: 'www.amazon.cn',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\.]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    商品尺寸: { key: 'dimensions' },
                    商品重量: { key: 'weight' },
                    制造商: { key: 'manufacturer' },
                },
            },
        },
        FR: {
            country: 'France',
            currency: 'EUR',
            host: 'www.amazon.fr',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\,]/g, '').replace(',', '.');
                return parseFloat(formatedPrice);
            },
            product_information: {
                // <<------ NOT CORRECT! Requires translation of the {fields} key values. I don't have much time to do it
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        DE: {
            country: 'Germany',
            currency: 'EUR',
            host: 'www.amazon.de',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\,]/g, '').replace(',', '.');
                return parseFloat(formatedPrice);
            },
            product_information: {
                // <<------ NOT CORRECT! Requires translation of the {fields} key values. I don't have much time to do it
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        IN: {
            country: 'India',
            currency: 'INR',
            host: 'www.amazon.in',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\.]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                // <<------ NOT CORRECT! Requires translation of the {fields} key values. I don't have much time to do it
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        IT: {
            country: 'Italy',
            currency: 'EUR',
            host: 'www.amazon.it',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\,]/g, '').replace(',', '.');
                return parseFloat(formatedPrice);
            },
            product_information: {
                // <<------ NOT CORRECT! Requires translation of the {fields} key values. I don't have much time to do it
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        MX: {
            country: 'Mexico',
            currency: 'MXN',
            host: 'www.amazon.com.mx',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\.]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                // <<------ NOT CORRECT! Requires translation of the {fields} key values. I don't have much time to do it
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        NL: {
            country: 'Netherlands',
            currency: 'EUR',
            host: 'www.amazon.nl',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\,]/g, '').replace(',', '.');
                return parseFloat(formatedPrice);
            },
            product_information: {
                // <<------ NOT CORRECT! Requires translation of the {fields} key values. I don't have much time to do it
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        SG: {
            country: 'Singapore',
            currency: 'SGD',
            host: 'www.amazon.sg',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\.]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        ES: {
            country: 'Spain',
            currency: 'EUR',
            host: 'www.amazon.es',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\,]/g, '').replace(',', '.');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Dimensiones del producto': { key: 'dimensions' },
                    Fabricante: { key: 'manufacturer' },
                    'Producto en Amazon.es desde': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Departamento: { key: 'department' },
                },
            },
        },
        TR: {
            country: 'Turkey',
            currency: 'TRY',
            host: 'www.amazon.com.tr',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\,]/g, '').replace(',', '.');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Ürün Boyutları': { key: 'dimensions' },
                    'Ürün Ağırlığı': { key: 'weight' },
                    Üretici: { key: 'manufacturer' },
                    'Satışa Sunulduğu İlk Tarih': { key: 'available_from' },
                    'Model Numarası': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        AE: {
            country: 'United Arab Emirates',
            currency: 'AED',
            host: 'www.amazon.ae',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\.]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        GB: {
            country: 'United Kingdom',
            currency: 'GBP',
            host: 'www.amazon.co.uk',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+\.]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    'Package Dimensions': { key: 'dimensions' },
                    'Product Dimensions': { key: 'dimensions' },
                    'Parcel Dimensions': { key: 'dimensions' },
                    'Item Weight': { key: 'weight' },
                    Manufacturer: { key: 'manufacturer' },
                    'Release date': { key: 'available_from' },
                    'Date First Available': { key: 'available_from' },
                    'Item model number': { key: 'model_number' },
                    Department: { key: 'department' },
                },
            },
        },
        JP: {
            country: 'Japan',
            currency: 'JPY',
            host: 'www.amazon.jp',
            price_format: (price) => {
                const formatedPrice = price.replace(/[^\d+]/g, '');
                return parseFloat(formatedPrice);
            },
            product_information: {
                id: ['#detailBullets_feature_div > ul', '#productDetails_detailBullets_sections1', '#productDetails_techSpec_section_1'],
                fields: {
                    梱包サイズ: { key: 'dimensions' },
                    発売日: { key: 'available_from' },
                    商品の重量: { key: 'weight' },
                },
            },
        },
    },
};
