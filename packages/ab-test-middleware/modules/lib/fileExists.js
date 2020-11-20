const fs = require('fs');

const fileExists = (filePath) => {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = fileExists;