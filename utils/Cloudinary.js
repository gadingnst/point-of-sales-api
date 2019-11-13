const path = require('path')
const Datauri = require('datauri')
const HttpError = require('./HttpError')
const cloudinary = require('../config/cloudinary')

const cloudPath = 'point-of-sales/products/images'
const imagePath = publicId => `${cloudPath}/${publicId}`

module.exports = {
    url: publicId => cloudinary.url(imagePath(publicId), { secure: true }),
    destroy: publicId => cloudinary.uploader.destroy(imagePath(publicId)),
    upload: (image, name, overwrite = false) => {
        const uniqueNumber = Date.now()
        const allowed = ['jpg', 'jpeg', 'png', 'svg']
        const ext = image.mimetype.split('/')[1]
    
        if (!allowed.find(ex => ex === ext))
            throw new HttpError(409, 'Validation Error', `File must be an image (${allowed.join('/')})`)

        const publicId = `${name.toLowerCase().replace(/\s+/g, '-')}_${uniqueNumber}`

        image = new Datauri()
            .format(path.extname(`${publicId}.${ext}`).toString(), image.data)

        return cloudinary.uploader.upload(image.content, {
            overwrite,
            public_id: publicId,
            folder: cloudPath
        })
            .then(({ public_id }) => Promise.resolve(public_id.match(/([^\/]*)\/*$/)[1]))
            .catch(err => Promise.reject(err))
    }
}