const fileExists = require('file-exists')
const HttpError = require('./HttpError')

const uploadPath = 'storage/uploads'

module.exports = {
    fileExists,
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