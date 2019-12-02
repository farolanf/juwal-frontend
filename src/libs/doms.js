export const location = typeof global.location !== 'undefined' ? global.location : {}

export const blobsFromDataUrls = dataUrls => {
  return Promise.all(
    dataUrls.map(dataUrl => dataUrl && fetch(dataUrl).then(res => res.blob()))
  )
}
