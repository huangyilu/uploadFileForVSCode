const vscode = require('vscode')
const api = require('./request')
const { createReadStream } = require('fs')
const clipboardy = require('clipboardy')

const interaction = {
  uploadFile: () => {
    vscode.window.showOpenDialog({
      filters: {
        Images: ['png', 'jpg']
      }
    }).then(res => {
      // const filePath = res[0]
      res.forEach(filePath => {
        const readstream = createReadStream(filePath.path, { flags: 'r', encoding: null })
        const chunks = []
        let length = 0
        readstream.on('data', function (chunk) {
          length += chunk.length
          chunks.push(chunk)
        })
        readstream.on('end', function () {
          const buffer = Buffer.alloc(length)
          for (let i = 0, pos = 0; i < chunks.length; i++) {
            chunks[i].copy(buffer, pos)
            pos += chunks[i].length
          }

          api.uploadToMigu({
            file: buffer,
            name: filePath.path.match(/\/([^\/]*$)/)[1]
          }).then(({ data }) => {
            console.log(data)
            if (data.success) {
              clipboardy.writeSync(data.value)
              vscode.window.showInformationMessage(`上传成功！文件路径已复制到剪贴板: ${data.value}`)
            } else {
              vscode.window.showInformationMessage('上传失败：' + data.code)
            }
            // resolve()
          }).catch(err => {
            console.log(err)

            vscode.window.showInformationMessage('上传失败：' + err)
            // resolve()
          })

          // api.upload({
          // file: buffer,
          // name: filePath.path.match(/\/([^\/]*$)/)[1]
          // }).then(({ data }) => {
          // console.log(data, data.code, data.fileUrl)
          // if (+data.code === 200) {
          // let resUrl = data.fileUrl.replace('srvfile', 'file').replace('statics.jituancaiyun.com', 'global.uban360.com')
          // resUrl = resUrl + '&fileType=2'
          // clipboardy.writeSync(resUrl)
          // vscode.window.showInformationMessage(`上传成功！文件路径已复制到剪贴板: ${resUrl}`)
          // } else {
          // vscode.window.showInformationMessage('上传失败：' + data.code)
          // }
          // resolve()
          // }).catch(err => {
          // vscode.window.showInformationMessage('上传失败：' + err)
          // resolve()
          // })

        })
      })

    })
  }
}
module.exports = interaction
