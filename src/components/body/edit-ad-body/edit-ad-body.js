import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'
import { Formik, useFormikContext } from 'formik'

import { Segment, Form, Button, Icon, Grid, Image, Label, Menu, Dropdown } from 'semantic-ui-react'
import FormInput from '~components/form/form-input'

import { MAX_AD_IMAGES } from '~constants'
import useGlobal from '~store'

import './edit-ad-body.module.scss'

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
  const [{ Products: productsCategory, ProductsNormal: productsCategoryNormal }, actions] = useGlobal(state => state.categories)
  const [{ provinsis, provinsisNormal }] = useGlobal(state => state.city)

  useEffect(() => {
    actions.category.getCategory('Products')
    actions.city.getProvinsis()
  }, [actions])

  const getCategory = id => _.get(productsCategoryNormal, ['entities', 'category', id])

  const getProductType = (categoryId, productTypeId) => {
    const category = getCategory(categoryId)
    return category && _.find(category.producttypes, { id: productTypeId })
  }

  const getProvinsi = id => {
    if (provinsisNormal && provinsisNormal.entities.provinsi[id]) {
      return provinsisNormal.entities.provinsi[id]
    }
  }

  const getKabupatenOptions = formik => {
    const provinsi = getProvinsi(formik.values.provinsi)
    if (provinsi) {
      return provinsi.kabupatens.map(kabupatenId => {
        const kabupaten = provinsisNormal.entities.kabupaten[kabupatenId]
        return {
          key: kabupaten.id,
          text: kabupaten.name,
          value: kabupaten.id
        }
      })
    }
    return []
  }

  const productTypeOptions = formik => {
    const category = getCategory(formik.values.category)
    const options = category
      ? category.producttypes.map(pt => ({
        value: pt.id,
        text: pt.name
      }))
      : []
    options.unshift({
      value: '',
      text: '--- Pilih produk ---'
    })
    return options
  }

  const handleCategoryItemClick = (category, formik) => {
    formik.setFieldValue('productType', '')
    formik.setFieldValue('specFields', [])
    formik.setFieldValue('category', category.id)
  }

  const handleProductTypeChange = formik => (e, opt) => {
    formik.setFieldValue('specFields', [])
    formik.setFieldValue('productType', opt.value)
  }

  const handleSpecFieldChange = (field, formik) => (e, opt) => {
    let specFields = formik.values.specFields
    if (_.isEmpty(specFields)) {
      const productType = getProductType(formik.values.category, formik.values.productType)
      specFields = productType.fields.map(field => ({ id: field.id, value: '' }))
    }
    formik.setFieldValue('specFields', specFields.map(sf => {
      if (sf.id === field.id) {
        sf.value = opt.value
      }
      return sf
    }))
  }

  const handleProvinsiChange = formik => (e, opt) => {
    formik.setFieldValue('kabupaten', '')
    formik.setFieldValue('provinsi', opt.value)
  }

  const renderCategoryMenu = (category, formik) => (
    category.categories ? (
      <Dropdown key={category.id} item text={category.name}>
        <Dropdown.Menu>
          <Dropdown.Item text={category.name} active={formik.values.category === category.id} onClick={() => handleCategoryItemClick(category, formik)} />
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
          <Form.Field required>
            <label>Kategori</label>
            <Menu secondary styleName='category-picker'>
              <Dropdown item text={(getCategory(formik.values.category) || {}).name || 'Pilih kategori'}>
                <Dropdown.Menu>
                  {productsCategory && productsCategory.categories.map(category => renderCategoryMenu(category, formik))}
                </Dropdown.Menu>
              </Dropdown>
            </Menu>
            {formik.errors.category && (
              <Label pointing color='red' styleName='category-help'>{formik.errors.category}</Label>
            )}
          </Form.Field>

          <Form.Field>
            <label>Jenis Produk</label>
            <Dropdown search selection placeholder='Pilih produk' options={productTypeOptions(formik)} value={formik.values.productType} onChange={handleProductTypeChange(formik)} />
          </Form.Field>

          {getProductType(formik.values.category, formik.values.productType) && (
            <Form.Field>
              <label>Spek</label>
              <Segment basic>
                {getProductType(formik.values.category, formik.values.productType).fields.map(field => (
                  <Form.Field key={field.id} inline className='field-small'>
                    <label className='inline-label'>{field.label}</label>
                    <Dropdown search selection options={field.options.value.map(value => ({
                      value,
                      text: value
                    }))} value={_.get(_.find(formik.values.specFields, { id: field.id }), 'value')} onChange={handleSpecFieldChange(field, formik)} />
                  </Form.Field>
                ))}
              </Segment>
            </Form.Field>
          )}

          <FormInput id='title' name='title' label='Judul Iklan' maxLength={titleMaxLen} required help='Sebutkan fitur utama barang atau jasa yang dijual' rightHelp={`${formik.values.title.length}/${titleMaxLen}`} />

          <FormInput id='description' name='description' label='Deskripsi Iklan' maxLength={descMaxLen} required control='textarea' help='Jelaskan barang atau jasa yang dijual' rightHelp={`${formik.values.description.length}/${descMaxLen}`} />
          
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

          <Form.Field>
            <label>Lokasi</label>
            <Form.Field inline className='field-small'>
              <label className='inline-label'>Provinsi</label>
              <Dropdown search selection options={(provinsis || []).map(provinsi => ({
                text: provinsi.name,
                value: provinsi.id
              }))} value={formik.values.provinsi} onChange={handleProvinsiChange(formik)} />
            </Form.Field>
            <Form.Field inline className='field-small'>
              <label className='inline-label'>Kabupaten / Kota</label>
              <Dropdown search selection options={getKabupatenOptions(formik)} value={formik.values.kabupaten} onChange={(e, opt) => formik.setFieldValue('kabupaten', opt.value)} />
            </Form.Field>
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