import config from '~config'
import { get } from '~libs/api'

export const getCategory = rootName => get(`${config.apiUrl}/categories?name=${rootName}`)