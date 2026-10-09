import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    gemini_api_key: process.env.GEMINI_API_KEY,
    firebase_project_id: process.env.FIREBASE_PROJECT_ID,
    firebase_client_email: process.env.FIREBASE_CLIENT_EMAIL,
    firebase_private_key: process.env.FIREBASE_PRIVATE_KEY,
    firebase_access_token: process.env.FIREBASE_ACCESS_TOKEN,
    access_token: process.env.ACCESS_TOKEN,
    DB_DEV: process.env.DB_DEV,
    DB_PROD: process.env.DB_PROD,
    stripe_secret_key: process.env.stripe_secret_key,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};


// console.log(config)

// console.log(config)

export default config;