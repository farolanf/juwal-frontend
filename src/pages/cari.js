import React, { useState, useEffect } from 'react'
import qs from 'qs'
import _ from 'lodash'
import { Head } from 'react-static'
import { navigate, Match } from '@reach/router'

import { Segment, Header, Input, List, Checkbox, Label, Icon } from 'semantic-ui-react'
import './cari.module.scss'

import { queryProducts } from '~api/products'

const ActiveFiltersBox = ({ filters, onRemoveFilter }) => (
  filters && filters.length > 0 ? (
    <Segment>
      <List horizontal>
        {filters.map(filter => (
          <List.Item key={filter.label}>
            <List.Content>
              <Label as='a' color='green' onClick={() => onRemoveFilter(filter)}>
                {`${filter.label} ${filter.value}`}
                <Icon name='delete' onClick={() => onRemoveFilter(filter)} />
              </Label>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  ) : null
)

const FiltersGroup = ({ bucket, onAddFilter }) => {
  const handleAddFilter = (e, label, value) => {
    console.log(e.target.checked, label, value)
    e.target.checked && onAddFilter({ label, value })
  }

  return (
    <List.Item>
      <List.Header>{bucket.key} ({bucket.doc_count})</List.Header>
      <List.Content>
        {bucket.values && bucket.values.buckets.map(value => (
          <Checkbox key={value.key} label={`${value.key} (${value.doc_count})`} onChange={_.curryRight(handleAddFilter)(bucket.key, value.key)} />
        ))}
      </List.Content>
    </List.Item>
  )
}

const FiltersBox = ({ results, onAddFilter }) => (
  <Segment>
    <List horizontal>
      {results && results.aggregations.attrs.attrs.buckets.map(bucket => (
        <FiltersGroup bucket={bucket} onAddFilter={onAddFilter} />
      ))}
    </List>
  </Segment>
)

const CariPage = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState()
  const [qstr, setQstr] = useState()
  const [activeFilters, setActiveFilters] = useState()

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

  const handleSubmit = e => {
    e.preventDefault()
    navigate(`cari?q=${query}`)
  }

  const handleAddFilter = attr => {
    const filters = (activeFilters && activeFilters.slice()) || []
    filters.push(attr)
    setActiveFilters(filters)
  }

  const handleRemoveFilter = attr => {
    const filters = activeFilters.slice()
    _.pull(filters, attr)
    setActiveFilters(filters)    
  }

  console.log(activeFilters)

  return (
    <>
      <Head title='Cari' />
      <Segment vertical>
        <Header as='h1'>Cari</Header>
        <form onSubmit={handleSubmit}>
          <Input value={query} onChange={e => setQuery(e.target.value)} />
        </form>
        <ActiveFiltersBox filters={activeFilters} onRemoveFilter={handleRemoveFilter} />
        <FiltersBox results={results} onAddFilter={handleAddFilter} />
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </Segment>
      <Match path='*'>
        {({ location }) => location.search !== qstr && setQstr(location.search)}
      </Match>
    </>
  )
}

export default CariPage