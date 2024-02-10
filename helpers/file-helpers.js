const fs = require('fs')
// const imgur = require('imgur')
// const IMGUR_ID = process.env.IMGUR_ID
// imgur.setClientId(IMGUR_ID)

async function localFileHandler (file) {
  try {
    if (!file) return null
    const fileName = `uploads/${file.originalname}`
    const data = await fs.promises.readFile(file.path)
    await fs.promises.writeFile(fileName, data)
    await fs.promises.rm(file.path) // 上傳完成後刪除temp資料夾臨時檔案
    return `/${fileName}`
  } catch (error) {
    return error
  }
}

// const imgurFileHandler = (file) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!file) return resolve(null)
//       const img = await imgur.uploadFile(file.path)
//       return resolve(img?.link || null)
//     } catch (err) {
//       return reject(err)
//     }
//   })
// }

module.exports = {
  localFileHandler
}
