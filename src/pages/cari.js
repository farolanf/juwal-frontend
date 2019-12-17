import React, { useState, useEffect } from 'react'
import qs from 'qs'
import { navigate, Match } from '@reach/router'

import { Input } from 'semantic-ui-react'

import { queryProducts } from '~api/products'

const CariPage = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState()
  const [qstr, setQstr] = useState()

  useEffect(() => {
    const queryObj = qs.parse(qstr, { ignoreQueryPrefix: true })
    if (queryObj.q) {
      setQuery(queryObj.q)
      ;(async function() {
        const results = await queryProducts({ q: queryObj.q }).then(res => res.data)
        setResults(results)
      }())
    }
  }, [qstr])

  const handleSubmit = async e => {
    e.preventDefault()
    navigate(`cari?q=${query}`)
  }

  return (
    <div>
      <Match path='*'>
        {({ location }) => location.search !== qstr && setQstr(location.search)}
      </Match>
      <form onSubmit={handleSubmit}>
        <Input value={query} onChange={e => setQuery(e.target.value)} />
      </form>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}

export default CariPage