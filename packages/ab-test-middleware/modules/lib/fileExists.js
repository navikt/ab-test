const fs = require('fs');

const fileExists = (filePath) => {
    try {
        console.log(filePath)
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (e) {
        console.log('Didnt find it')
        return false;
    }
}

module.exports = fileExists;