import React, { useState, useEffect } from 'react'
import { Head } from 'react-static'
import { Router } from '@reach/router'

import { Segment, Header, Item, Grid, Placeholder, Responsive } from 'semantic-ui-react'
import { Carousel } from 'react-responsive-carousel'
import './item.module.scss'

import config from '~config'
import { getProduct } from '~api/products'
import { formatCurrency } from '~libs/helpers'

const DetailPage = ({ id }) => {
  const [{ title, description, price, images } = {}, setProduct] = useState()

  useEffect(() => {
    let canceled
    (async function () {
      const product = await getProduct(id).then(res => res.data)
      !canceled && setProduct(product)
    })()
    return () => canceled = true
  }, [id])

  const renderCarousel = () => {
    if (!images || images.filter(item => item).length <= 0) {
      return null
    }
    const getUrl = url => url[0] === '/' ? `${config.apiUrl}${url}` : url
    return (
      <Carousel infiniteLoop emulateTouch>
        {images.filter(item => item).map(item => (
          <div key={item.id} styleName='carousel-item'>
            <img src={getUrl(item.url)} alt='product' />
          </div>
        ))}
      </Carousel>
    )
  }

  const renderDetails = () => (
    <Item>
      <Item.Content>
        <Item.Header as='h2'>{formatCurrency(price)}</Item.Header>
        <Item.Meta>
          <Placeholder>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </Item.Meta>
      </Item.Content>
    </Item>
  )

  const renderDescription = () => (
    <Item>
      <Item.Content>
        <Item.Header as='h5'>Deskripsi</Item.Header>
        <Item.Description>{description}</Item.Description>
      </Item.Content>
    </Item>
  )

  return (
    <Segment basic vertical padded>
      <Head title={`Item: ${title || ''}`} />
      <Header as='h1'>{title || ''}</Header>
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Segment>{renderCarousel()}</Segment>
        <Segment>{renderDetails()}</Segment>
        <Segment>{renderDescription()}</Segment>
      </Responsive>

      <Responsive as={Grid} minWidth={Responsive.onlyTablet.minWidth}>
        <Grid.Column width={10}>
          <Segment>{renderCarousel()}</Segment>
          <Segment>{renderDescription()}</Segment>
        </Grid.Column>
        <Grid.Column width={6}>
          <Segment>{renderDetails()}</Segment>
        </Grid.Column>
      </Responsive>
    </Segment>
  )
}

const ItemPage = () => (
  <>
    <Router>
      <DetailPage path='/:id' />
    </Router>
  </>
)

export default ItemPage
