const fs = require('fs')
const path = require('path')
const response = require('../utils/response')

const baseUrl = 'http://localhost:8000/api/invoice/'

exports.getListFiles = (req, res) => {
  const directoryPath = path.join(__dirname, '../../invoice/')

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return response.internal_server_error(
        res,
        undefined,
        'Failed to retrieve files!'
      )
    }

    const fileInfo = []

    files.forEach((file) => {
      fileInfo.push({
        name: file,
        url: baseUrl + file,
      })
    })

    return response.success(res, fileInfo, 'Successfully retrieved files!')
  })
}

exports.downloadFile = (req, res) => {
  const fileName = req.params.name
  const directoryPath = path.join(__dirname, '../../invoice/')
  console.log(directoryPath)

  return res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      response.internal_server_error(res, err, 'Could not download file!')
    }
  })
}
