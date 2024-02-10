const multer = require('multer')

const upload = multer({
  // 檔案上傳路徑
  dest: 'temp/',

  // 限制只能上傳jpg、jpeg、png三種副檔名的檔案
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image!'))
    }
    return cb(null, true)
  }
})

module.exports = upload
