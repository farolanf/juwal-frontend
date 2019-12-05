import React from 'react'
import { Head } from 'react-static'
import { navigate } from '@reach/router'
import _ from 'lodash'

import { Segment, Header } from 'semantic-ui-react'
import EditAdBody from '~components/body/edit-ad-body'

import { addProduct, uploadImage } from '~api/products'
import { blobsFromDataUrls } from '~libs/doms'
import { createUploadFormData } from '~libs/helpers'
import { MAX_AD_IMAGES } from '~constants'

const NewAdPage = () => {
  const handleSubmit = async (values, { setSubmitting }) => {
    const blobs = await blobsFromDataUrls(values.images.map(item => item && item.file && item.dataUrl))
    const fileMetas = blobs.map((blob, i) => {
      if (blob) return {
        meta: { index: i },
        file: blob,
        filename: values.images[i].file.name
      }
      return { meta: { index: i, delete: true } }
    })
    await uploadImage(null, createUploadFormData(fileMetas))

    const data = _.pick(values, ['title', 'description', 'price', 'category', 'productType', 'specFields'])
    await addProduct(data)

    setSubmitting(false)
    navigate('/iklan-saya', { state: { afterAdd: true } })
  }

  return (
    <>
      <Head title='Pasang Iklan' />
      <Segment vertical>
        <Header as='h1'>Pasang Iklan</Header>
        <EditAdBody onSubmit={handleSubmit} data={{
            category: '',
            productType: '',
            specFields: [],
            title: '',
            description: '',
            price: 0,
            images: _.times(MAX_AD_IMAGES, _.constant(null))
          }}
        />
      </Segment>
    </>
  )
}

export default NewAdPage