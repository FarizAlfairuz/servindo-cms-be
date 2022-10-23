const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

cloudinary.getStorage = (type) => {
  const subFolder = type ? String(type).toLowerCase() : ''

  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `/Servindo/${subFolder}`,
      allowedFormats: ['jpeg', 'jpg', 'png', 'pdf'],
    },
  })
}

cloudinary.deleteCloudPicture = (picture) => {
  const pictArr = picture.split('/')
  const cloudFileName = pictArr
    .slice(pictArr.indexOf('Servindo'))
    .join('/')
    .replace('.png', '')

  return cloudinary.uploader.destroy(cloudFileName)
}

module.exports = cloudinary
