const bcrypt = require('bcryptjs')
const genHash =  (password) =>{
    let salt = bcrypt.genSaltSync(12);
    let passwordHash = bcrypt.hashSync(password, salt);
    return passwordHash
}
module.exports = genHash