import { normalize, schema } from 'normalizr'
import * as categoryApi from '~api/category'

const categorySchema = new schema.Entity('category')
categorySchema.define({ categories: [categorySchema] })

export const getCategory = (store, rootName) => {
  categoryApi.getCategory(rootName)
    .then(res => {
      store.setState({
        categories: {
          ...store.state.categories,
          [rootName]: res.data[0],
          [`${rootName}Normal`]: normalize(res.data[0], categorySchema)
        }
      })
    })
    .catch(error => {
      store.setState({
        categories: {
          ...store.state.categories,
          [rootName]: null,
          [`${rootName}Normal`]: null
        },
        error
      })
    })
}