import React, { useState, useEffect } from 'react'
import { Head } from 'react-static'
import { navigate } from '@reach/router'

import { Segment, Header, Input } from 'semantic-ui-react'

const IndexPage = () => {
  const [query, setQuery] = useState('')

  const handleSearchSubmit = e => {
    e.preventDefault()
    navigate(`/cari?q=${query}`)
  }

  return (
    <div>
      <Head title='Home' />
      <Segment basic vertical>
        <Header as='h1'>Home</Header>
        <form onSubmit={handleSearchSubmit}>
          <Input value={query} onChange={e => setQuery(e.target.value)} />
        </form>
      </Segment>
    </div>
  )
}

export default IndexPage
