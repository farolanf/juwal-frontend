import * as categoryApi from '~api/category'

export const getCategory = (store, rootName) => {
  categoryApi.getCategory(rootName)
    .then(res => {
      store.setState({
        categories: {
          ...store.state.categories,
          [rootName]: res.data[0]
        }
      })
    })
    .catch(error => {
      store.setState({
        categories: {
          ...store.state.categories,
          [rootName]: null
        },
        error
      })
    })
}