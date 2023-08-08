if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const firebase = require('firebase')
require('firebase/auth')

//Firebase stuff
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJ_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

try {
    firebase.initializeApp(firebaseConfig);
} catch (error) {
    console.error('Error initializing Firebase', error)
    process.exit(1)
}

const database = firebase.database()

module.exports = database