const fs = require('fs').promises
const HttpError = require('./HttpError')

const uploadPath = 'storage/uploads'

module.exports = {
    
    fileExist: filePath => new Promise(resolve => {
        fs.access(filePath, fs.F_OK)
            .then(() => resolve(true))
            .catch(() => resolve(false))
    }),

    uploadImage: (image, name) => {
        const uniqueNumber = Date.now()
        const allowed = ['jpg', 'jpeg', 'png', 'svg']
        const ext = image.mimetype.split('/')[1]

        if (!allowed.find(ex => ex === ext))
            throw new HttpError(409, 'Validation Error', `File must be an image (${allowed.join('/')})`)

        const imageName = `${name.toLowerCase().replace(/\s+/g, '-')}_${uniqueNumber}.${ext}`
        image.mv(`${uploadPath}/images/products/${imageName}`)
        return imageName
    }
}