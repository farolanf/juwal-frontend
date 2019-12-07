import { normalize, schema } from 'normalizr'
import * as cityApi from '~api/city'

const provinsiSchema = new schema.Entity('provinsi', {
  kabupatens: [new schema.Entity('kabupaten')]
})
const provinsisSchema = [provinsiSchema]

export const getProvinsis = store => {
  cityApi.getProvinsis()
    .then(res => store.setState({
      city: {
        provinsis: res.data,
        provinsisNormal: normalize(res.data, provinsisSchema),
      },
      error: null
    }))
    .catch(error => store.setState({
      provinsis: null,
      provinsisNormal: null,
      error
    }))
}