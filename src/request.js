const axios = require('axios').default
const urlResolve = require('url').resolve
const FormData = require('form-data')

const request = (method, url, headers, params = null) =>
  new Promise((resolve, reject) => {
    const options = { url, method, headers }
    // 对上传类型做处理
    if (url.indexOf('upload') > -1) {
      options.headers['Content-Type'] = params.getHeaders()['content-type']
      options.data = params.getBuffer()
    } else if (method === 'POST') {
      options.data = params
    } else {
      options.params = params
    }
    axios(options)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })

const apiRequest = (method = 'POST', type = 'caiyun', path, data) => {
  // 咪咕URL
  const contentType = 'application/x-www-form-urlencoded'
  let url = 'https://filesystem.api.jituancaiyun.net/'
  if (type === 'migu') {
    url = 'https://gw.aikan.miguvideo.com/'
  }
  // 彩云 URL https://filesystem.api.jituancaiyun.com/sfs/webUpload/srvfile?fileType=2&src=cdn
  // 咪咕 URL 'https://gw.aikan.miguvideo.com/ygw/external/upload'

  console.log(type, url, path)

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
    'Content-Type': contentType,
    'Referer': url,
    'Origin': url
  }
  return request(method, urlResolve(url, path), headers, data).then(response => response)
}

const api = {
  // upload: ({ file, name }) => {
  //   const basePath = '/sfs/webUpload/srvfile?fileType=2&src=cdn'
  //   const form = new FormData()
  //   form.append('upfile', file, { filename: name })
  //   return apiRequest('POST', 'caiyun', basePath, form)
  // },
  uploadToMigu: ({ file, name }) => {
    const basePath = '/ygw/external/upload'
    const form = new FormData()
    form.append('file', file, { filename: name })
    return apiRequest('POST', 'migu', basePath, form)
  }
}

module.exports = api
