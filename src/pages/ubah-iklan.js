import React from 'react'
import { Head } from 'react-static'
import _ from 'lodash'

import EditAdBody from '~components/body/edit-ad-body'
import { updateProduct } from '~api/products'
import { blobsFromDataUrls } from '~libs/doms'
import { MAX_AD_IMAGES } from '~constants'

const EditAdPage = () => {
  const handleSubmit = async (values, { setSubmitting }) => {
    const blobs = await blobsFromDataUrls(values.images.map(item => item && item.file && item.dataUrl))
    const data = _.pick(values, ['title', 'description', 'price'])
    const fd = new FormData()
    fd.append('data', JSON.stringify(data))
    blobs.forEach((blob, i) => {
      blob && fd.append('files.images', blob, values.images[i].file.name)
    })
    await updateProduct(0, fd)
    setSubmitting(false)
  }

  return (
    <>
      <Head title='Ubah Iklan' />
      <EditAdBody title='Ubah Iklan' onSubmit={handleSubmit} data={{
          title: '',
          description: '',
          price: 0,
          images: _.times(MAX_AD_IMAGES, _.constant(null))
        }}
      />
    </>
  )
}

export default EditAdPage