import React, { useState } from 'react'

import { queryProducts } from '~api/products'

const CariPage = () => {
  const [q, setQ] = useState('')
  const [results, setResults] = useState()

  const handleSubmit = async e => {
    e.preventDefault()
    const results = await queryProducts({ q }).then(res => res.data)
    setResults(results)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={q} onChange={e => setQ(e.target.value)} />
      </form>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}

export default CariPage