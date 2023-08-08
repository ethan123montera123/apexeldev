const admin = require('firebase-admin')
const serviceAccount = require('../apexel-development-firebase-adminsdk-81x2v-62264fd63a.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = admin