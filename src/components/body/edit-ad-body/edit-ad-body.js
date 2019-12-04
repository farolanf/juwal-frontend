import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'
import { Formik, useFormikContext } from 'formik'

import { Segment, Form, Button, Icon, Grid, Image, Label, Menu, Dropdown } from 'semantic-ui-react'
import FormInput from '~components/form/form-input'
import './edit-ad-body.module.scss'

import { MAX_AD_IMAGES } from '~constants'
import useGlobal from '~store'

const titleMaxLen = 70
const descMaxLen = 4000
const priceMin = 0
const maxImages = MAX_AD_IMAGES

const adSchema = yup.object().shape({
  category: yup.string().required().label('Kategori'),
  title: yup.string().max(titleMaxLen).required().label('Judul iklan'),
  description: yup.string().max(descMaxLen).required().label('Deskripsi iklan'),
  price: yup.number().min(priceMin).required().label('Harga'),
  images: yup.array().min(maxImages).max(maxImages)
})

const getDataUrl = file => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', e => resolve(e.target.result))
    reader.readAsDataURL(file)
  })
}

const ImageUploadField = ({ id, name, index, ...props }) => {
  const { values, setFieldValue } = useFormikContext()
  const dataUrl = _.get(values, [name, index, 'dataUrl'])

  id = `${id}${index}`

  const handleClickRemove = () => {
    const images = values[name]
    images[index].file = null
    images[index].dataUrl = null
    setFieldValue('images', images)
  }

  const handleChange = async e => {
    let files = _.toArray(e.target.files)
    files.splice(maxImages - index)
    const dataUrls = await Promise.all(files.map(getDataUrl))
    dataUrls.forEach((dataUrl, i) => {
      const images = values[name]
      images[index + i] = {
        file: files[i],
        dataUrl          
      }
      setFieldValue('images', images)
    })
  }
  
  return (
    <Form.Field styleName='image-upload-field'>
      {dataUrl ? (
        <Segment styleName='image-segment'>
          <div styleName='image-width'>
            <div styleName='image-ratio'>
              <Image src={dataUrl} alt={name} size='small' />
            </div>
          </div>
          <Button type='button' compact icon='close' color='red' styleName='close-btn' onClick={handleClickRemove} />
        </Segment>
      ) : (
        <>
            <input id={id} type='file' styleName='image-upload-input' name={name} multiple onChange={handleChange} />
          <Button as='label' htmlFor={id}>
            <Icon name='upload' /> Pilih foto
          </Button>
        </>
      )}
    </Form.Field>
  )
}

const EditAdBody = ({ data, onSubmit }) => {
  const [productsCategory, actions] = useGlobal(state => state.categories.Products)
  const [selectedCategory, setSelectedCategory] = useState()

  useEffect(() => {
    actions.category.getCategory('Products')
  }, [actions])

  const handleCategoryItemClick = (category, formik) => {
    setSelectedCategory(category)
    formik.setFieldValue('category', category.id)
  }

  const renderCategoryMenu = (category, formik) => (
    category.categories ? (
      <Dropdown key={category.id} item text={category.name}>
        <Dropdown.Menu>
          {category.categories.map(child => renderCategoryMenu(child, formik))}
        </Dropdown.Menu>
      </Dropdown>
    ) : (
      <Dropdown.Item key={category.id} text={category.name} active={formik.values.category === category.id} onClick={() => handleCategoryItemClick(category, formik)} />
    )
  )

  return (
    <Formik
      initialValues={data}
      validationSchema={adSchema}
      onSubmit={onSubmit}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
          <Form.Field>
            <label>Kategori</label>
            <input type="hidden" name="category" />
            <Menu secondary>
              <Dropdown item text={(selectedCategory || {}).name || 'Pilih kategori'}>
                <Dropdown.Menu>
                  {productsCategory && productsCategory.categories.map(category => renderCategoryMenu(category, formik))}
                </Dropdown.Menu>
              </Dropdown>
            </Menu>
            {formik.errors.category && (
              <Label pointing color='red' styleName='category-help'>{formik.errors.category}</Label>
            )}
          </Form.Field>

          <FormInput id='title' name='title' label='Judul iklan' maxLength={titleMaxLen} required help='Sebutkan fitur utama barang atau jasa yang dijual' rightHelp={`${formik.values.title.length}/${titleMaxLen}`} />

          <FormInput id='description' name='description' label='Deskripsi iklan' maxLength={descMaxLen} required control='textarea' help='Jelaskan barang atau jasa yang dijual' rightHelp={`${formik.values.description.length}/${descMaxLen}`} />
          
          <FormInput id='price' name='price' label='Harga' type='number' min={priceMin} required />

          <Form.Field>
            <label>Foto</label>
            <Grid centered stackable columns={2}>
              <Grid.Row>
                {_.times(maxImages).map((val, i) => (
                  <Grid.Column key={i}>
                    <ImageUploadField id='image-upload' index={i} name='images' />
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
            {formik.touched.images && formik.errors.images && (
              <Label pointing color='red'>{formik.errors.images}</Label>
            )}
          </Form.Field>

          <Button type='submit' primary disabled={!formik.isValid || formik.isSubmitting}>Simpan</Button>
        </Form>
      )}
    </Formik>
  )
}

EditAdBody.propTypes = {
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
}

export default EditAdBody