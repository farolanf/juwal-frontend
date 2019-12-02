import React, { useEffect } from 'react'
import { navigate } from '@reach/router'
import qs from 'qs'

import { setToken } from '~libs/auth'
import { location } from '~libs/doms'

const SessionPage = () => {
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  setToken(query.jwt)
  useEffect(() => {
    navigate('/')
  }, [])
  return (
    <>
      Logging in...
    </>
  )
}

export default SessionPage