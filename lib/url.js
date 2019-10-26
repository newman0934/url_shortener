const Url = require('../models/url')

//檢查資料庫是否有同樣的短網址
const checkUrl = async () => {
    let shortUrl = ""
    do {
        shortUrl = makeRandom(5)
        const findUrl = await Url.findOne({
            shortUrl
        }).exec()

        if (!findUrl) {
            return shortUrl
        }

    } while (findUrl)
}


//隨機產生短網址
const makeRandom = (digits) => {

    let getdigits = "";
    const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < digits; i++)
        getdigits += text.charAt(Math.floor(Math.random() * text.length));

    return getdigits;

}

module.exports = checkUrl