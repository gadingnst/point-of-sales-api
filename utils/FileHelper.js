const fs = require('fs')

module.exports = {
    fileExist: filePath => new Promise(resolve => {
        fs.access(filePath, fs.F_OK, err => err ? resolve(false) : resolve(true))
    })
}