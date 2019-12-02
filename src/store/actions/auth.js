import * as authApi from '~api/auth'
import { removeToken } from '~libs/auth'

export const getUser = store => {
  authApi.getUser()
    .then(res => store.setState({ user: res.data, error: null }))
    .catch(error => store.setState({ user: null, error }))
}

export const logout = store => {
  store.setState({ user: null })
  removeToken()
}