import formatNumber from 'format-number'

export const formatCurrency = number => formatNumber({ prefix: 'Rp', integerSeparator: '.' })(number)

export const createUploadFormData = fileMetas => {
  let fileIndex = 0
  const fd = new FormData()
  fd.append('data', JSON.stringify({
    fileMetas: fileMetas.map(item => {
      if (item.file && item.filename) {
        return Object.assign({}, item.meta, { fileIndex: fileIndex++ })
      }
      return item.meta
    })
  }))
  fileMetas.forEach(item => {
    item.file && item.filename && fd.append('files.files', item.file, item.filename)
  })
  return fd
}
