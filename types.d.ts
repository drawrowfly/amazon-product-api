declare module 'amazon-buddy' {
    export interface Categories {
        [key: string]: {
            name: string;
            category: string;
        };
    }

    export interface Product {
        amazonChoice: boolean;
        amazonPrime: boolean;
        asin: string;
        bestSeller: boolean;
        position: {
            global_position: number;
            page: number;
            position: number;
        };
        price: {
            before_price: number;
            currency: string;
            current_price: number;
            discounted: boolean;
            savings_amount: number;
            savings_percent: number;
        };
        reviews: {
            rating: number;
            total_reviews: number;
        };
        score: string;
        sponsored: boolean;
        thumbnail: string;
        title: string;
        url: string;
    }

    export interface ProductsResult {
        category: string;
        totalProducts: string;
        result: Product[];
    }

    export interface AsinCategory {
        category: string;
        url: string;
    }

    export interface AsinReview {
        total_reviews: number;
        rating: string;
        answered_questions: number;
    }

    export interface AsinPrice {
        symbol: string;
        currency: string;
        current_price: number;
        discounted: boolean;
        before_price: number;
        savings_amount: number;
        savings_percent: 0;
    }

    export interface AsinVideo {
        groupType: string;
        offset: string;
        thumb: string;
        durationSeconds: number;
        marketPlaceID: string;
        isVideo: boolean;
        isHeroVideo: boolean;
        title: string;
        languageCode: string;
        holderId: string;
        url: string;
        videoHeight: string;
        videoWidth: string;
        durationTimestamp: string;
        slateUrl: string;
        minimumAge: number;
        variant: string;
        slateHash: {
            extension: string;
            physicalID: any; // null?
            width: string;
            height: string;
        };
        mediaObjectId: string;
        thumbUrl: string;
    }

    export interface Asin {
        title: string;
        description: string;
        feature_bullets: string[];
        variants: any[];
        categories: AsinCategory[];
        asin: string;
        url: string;
        reviews: AsinReview[];
        item_available: boolean;
        price: AsinPrice[];
        bestsellers_rank: any[];
        main_image: string;
        total_images: 5;
        images: string[];
        total_videos: 3;
        videos: AsinVideo[];
        delivery_message: string;
        product_information: {
            dimensions: string;
            weight: string;
            available_from: string;
            available_from_utc: string;
            available_for_months: number;
            available_for_days: number;
            manufacturer: string;
            model_number: string;
            department: string;
            qty_per_order: string;
            store_id: string;
            brand: string;
        };
        badges: {
            amazon_сhoice: boolean;
            amazon_prime: boolean;
            best_seller: boolean;
        };
        sponsored_products: any[];
        also_bought: any[];
        other_sellers: any[];
    }

    export interface AsinResult {
        result: Asin[];
    }

    export interface Country {
        country: string;
        country_code: string;
        currency: string;
        host: string;
    }

    export interface Review {
        id: string;
        asin: {
            original: string;
            variant: string;
        };
        review_data: string;
        date: {
            date: string;
            unix: number;
        };
        name: string;
        rating: number;
        title: string;
        review: string;
        verified_purchase: boolean;
        media: any[]; // Unknown
    }

    export interface ReviewResult {
        total_reviews: number;
        stars_stat: {
            [key: string]: string;
        };
        result: any[];
    }

    export interface ProductsOptions {
        keyword: string;
        number?: number;
        country?: string;
    }

    export interface ReviewsOptions {
        asin: string;
        number: number;
        rating: number[];
    }

    export interface CategoriesOptions {
        country: string;
    }

    export function asin(options: ProductsOptions): Promise<AsinResult>;

    export function categories(options: CategoriesOptions): Promise<Categories>;

    export function countries(): Promise<Country[]>;

    export function products(options: ProductsOptions): Promise<ProductsResult>;

    export function reviews(options: ReviewsOptions): Promise<ReviewResult>;
}
