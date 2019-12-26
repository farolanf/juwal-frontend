const localStorage = global.localStorage ? global.localStorage : {
  setItem() {},
  getItem() {},
  removeItem() {}
}

export const setToken = token => localStorage.setItem('token', token)

export const getToken = () => localStorage.getItem('token')

export const getBearerToken = () => `Bearer ${getToken()}`

export const removeToken = () => localStorage.removeItem('token')
