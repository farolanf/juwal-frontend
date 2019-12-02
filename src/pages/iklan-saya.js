import React, { useState, useEffect } from 'react'
import { Router } from '@reach/router'
import { Head } from 'react-static'
import _ from 'lodash'

import { Message, Segment, Header, Item, Button, Loader, Dimmer } from 'semantic-ui-react'
import EditAdBody from '~components/body/edit-ad-body'
import './iklan-saya.module.scss'

import config from '~config'
import useGlobal from '~store'
import { searchProducts, getProduct, updateProduct, uploadImage } from '~api/products'
import { formatCurrency, createUploadFormData } from '~libs/helpers'
import { location, blobsFromDataUrls } from '~libs/doms'
import { MAX_AD_IMAGES } from '~constants'

const ProductOverview = ({ item: { id, title, description, price, images } }) => {
  const imgUrl = _.get(images, [0, 'url'])
  return (
    <Item>
      <Item.Image src={imgUrl && `${config.apiUrl}${imgUrl}`} />
      <Item.Content>
        <Item.Header styleName='product-overview__header'>
          <a href={`/iklan-saya/${id}`}>{title}</a>
          <Button size='mini' color='blue' floated='right' as='a' href={`/item/${id}`} icon='eye' title='Preview' />
          <Button size='mini' color='blue' floated='right' as='a' href={`/iklan-saya/${id}`} icon='edit' title='Ubah' />
        </Item.Header>
        <Item.Description>
          {description}
        </Item.Description>
        <Item.Extra>
          <strong>{formatCurrency(price)}</strong>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

const ListPage = () => {
  const [user] = useGlobal(state => state.user)
  const [products, setProducts] = useState([])

  useEffect(() => {
    (async function () {
      user && setProducts(await searchProducts({ owner: user.id }).then(res => res.data))
    })()
  }, [user])

  return (
    <Segment basic vertical padded>
      <Header as='h1'>Iklan Saya</Header>
      {location.state && location.state.afterAdd && (
        <Message positive header='Pemasangan Iklan Sukses' content='Iklan telah ditambahkan dan akan tampil dalam pencarian beberapa saat lagi' />
      )}
      <Item.Group divided>
        {products.map(product => <ProductOverview key={product.id} item={product} />)}
      </Item.Group>
    </Segment>
  )
}

const EditPage = ({ id }) => {
  const [loading, setLoading] = useState()
  const [product, setProduct] = useState()
  const [, actions] = useGlobal(() => null)

  const prepareProduct = product => {
    product.images = _.times(MAX_AD_IMAGES, i => _.get(product.images, i, null))
    product.images.forEach(item => {
      if (item) {
        item.dataUrl = `${config.apiUrl}${item.url}`
      }
    })
    return product
  }

  useEffect(() => {
    (async function () {
      const product = await getProduct(id).then(res => res.data)
      setProduct(prepareProduct(product))
    })()
  }, [id])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)

    const data = _.defaults(
      _.pick(values, ['title', 'description', 'price', 'images']),
      { images: _.times(MAX_AD_IMAGES, _.constant(null)) }
    )

    // create blobs from new or changed image
    const blobs = await blobsFromDataUrls(values.images.map(item => {
      if (!item || !item.dataUrl) return null
      if (item.url && item.dataUrl.endsWith(item.url)) return null
      return item.dataUrl
    }))

    // remove uploaded images
    const removeFileMetas = values.images.map((item, i) => {
      if (item && item.url && !item.dataUrl) return {
        meta: { index: i, delete: true }
      }
      return null
    }).filter(item => item)
    
    const fileMetas = blobs.map((blob, i) => {
      if (blob) return {
        meta: { index: i },
        file: blob,
        filename: values.images[i].file.name
      }
      return null
    }).filter(item => item)
    await uploadImage(id, createUploadFormData(removeFileMetas.concat(fileMetas)))

    // images field already hanlded with uploadImage
    delete data.images

    const product = await updateProduct(id, data).then(res => res.data)

    setSubmitting(false)
    setProduct()
    setProduct(prepareProduct(product))
    setLoading()
    actions.messages.addMessage({ message: 'Perubahan berhasil disimpan', type: 'success' })
  }

  return (
    <Segment vertical>
      <Header as='h1'>Ubah Iklan</Header>
      <Dimmer.Dimmable blurring dimmed={!product || loading}>
        {product && <EditAdBody onSubmit={handleSubmit} data={product} />}
        <Dimmer inverted active={!product || loading}>
          <Loader />
        </Dimmer>
      </Dimmer.Dimmable>
    </Segment>
  )
}

const MyAdsPage = () => (
  <>
    <Head title='Iklan Saya' />
    <Router>
      <ListPage path='/iklan-saya' />
      <EditPage path='/iklan-saya/:id' />
    </Router>
  </>
)

export default MyAdsPage