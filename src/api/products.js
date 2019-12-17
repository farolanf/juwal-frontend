import config from '~config'
import { get, post, put } from '~libs/api'

export const queryProducts = params => get(`${config.apiUrl}/products/search`, params)

export const searchProducts = params => get(`${config.apiUrl}/products`, params)

export const getProduct = id => get(`${config.apiUrl}/products/${id}`)

export const addProduct = data => post(`${config.apiUrl}/products`, data)

export const updateProduct = (id, data) => put(`${config.apiUrl}/products/${id}`, data)

export const uploadImage = (id, data) =>
  id ? post(`${config.apiUrl}/products/${id}/upload-image`, data)
    : post(`${config.apiUrl}/products/upload-image`, data)
