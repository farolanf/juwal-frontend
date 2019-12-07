import config from '~config'
import { get } from '~libs/api'

export const getProvinsis = () => get(`${config.apiUrl}/provinsis`)