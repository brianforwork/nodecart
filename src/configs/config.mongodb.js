// './configs/config.mongodb.js'
'use strict'
// Level 0

const config1 = {
    app: {
        port: 3000
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'db'
    }
}


// Level 1

const dev1 = {
    app: {
        port: 3000
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'dbDev'
    }
}

const pro1 = {
    app: {
        port: 3000
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'dbProduct'
    }
}

// const config = { dev, pro }
// const env = process.env.NODE_ENV || 'dev'
// export default config[env]
// Level 2 

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017, 
        name: process.env.DEV_DB_NAME || 'dbDev'
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3000
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'dbProduct'
    }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'
export default config[env]