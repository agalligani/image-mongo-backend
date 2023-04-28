require('dotenv').config()
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map(origin=>origin)
console.log("The following domains will be allowed to upload images:\r\n" + `${allowedOrigins.join("\r\n")}`)
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions 