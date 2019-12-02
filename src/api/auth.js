import config from '~config'
import { get } from '~libs/api'

export const getUser = () => get(`${config.apiUrl}/users/me`)