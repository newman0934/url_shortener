const Url = require('../models/url')


const checkUrl = ()=>{
    do{
        let shortUrl = makeRandom(5)
        const findUrl = Url.findOne({shortUrl}).exec()

        if(!findUrl){
            return shortUrl
        }
        
    }while(findUrl)
}



const makeRandom = (digits) => {

    let getdigits = "";
    const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < digits; i++)
    getdigits += text.charAt(Math.floor(Math.random() * text.length));
  
    return getdigits;

  }

  module.exports = checkUrl