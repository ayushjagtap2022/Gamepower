const jwt = require('jsonwebtoken')
require('dotenv').config()
const tokenGen =  (res,_id) =>{
    const expirationDate = Math.floor(Date.now() / 1000) + 6 * 30 * 24 * 60 * 60; //6months
    const signTokenPromise = new Promise((resolve, reject) => {
        let payload = {
            user: {
                _id:_id,
            },
        };
        jwt.sign({ payload }, process.env.PRIVATE_KEY, { expiresIn: expirationDate, algorithm: 'HS256' }, (err, token) => {
            if (err) {
                res.send({Error:"Error while generating Token"})
                reject(err)
            } else {
                resolve(token)
            };
        });
    });
return signTokenPromise
}
module.exports=tokenGen