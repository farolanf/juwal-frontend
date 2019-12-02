import axios from 'axios'
import { getBearerToken, removeToken } from './auth'

const getAxiosConfig = () => ({
  headers: {
    authorization: getBearerToken()
  },
})

const handleAuthorizationError = error => {
  if (error.response && error.response.status === 401) {
    removeToken()
  }
  throw error
}

export const get = (url, params) => axios.get(url, { ...getAxiosConfig(), params })
  .catch(handleAuthorizationError)

export const post = (url, data) => axios.post(url, data, getAxiosConfig())
  .catch(handleAuthorizationError)

export const put = (url, data) => axios.put(url, data, getAxiosConfig())
  .catch(handleAuthorizationError)
