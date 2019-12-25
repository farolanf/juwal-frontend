import React, { useState, useEffect } from 'react'
import qs from 'qs'
import _ from 'lodash'
import { Head } from 'react-static'
import { navigate, Match } from '@reach/router'

import { Segment, Header, Input, List, Checkbox, Label, Icon, Button } from 'semantic-ui-react'
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

const FiltersGroup = ({ activeFilters, bucket, onChange }) => {
  const isChecked = (label, value) => !!activeFilters && !!activeFilters.find(a => a.label === label && a.value === value)  

  const handleFilterChange = (e, opt, label, value) => {
    onChange({ label, value }, opt.checked)
  }

  return (
    <List.Item>
      <List.Header>{bucket.key} ({bucket.doc_count})</List.Header>
      <List.Content>
        {bucket.values && bucket.values.buckets.map(value => (
          <Checkbox key={value.key} label={`${value.key} (${value.doc_count})`} checked={isChecked(bucket.key, value.key)} onChange={_.curryRight(handleFilterChange)(bucket.key, value.key)} />
        ))}
      </List.Content>
    </List.Item>
  )
}

const FiltersBox = ({ results, activeFilters, onChange }) => (
  <Segment>
    <List horizontal>
      {results && results.aggregations.attrs.attrs.buckets.map(bucket => (
        <FiltersGroup key={bucket.key} bucket={bucket} activeFilters={activeFilters} onChange={onChange} />
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
    queryObj.q && setQuery(queryObj.q)
    queryObj.attrs && setActiveFilters(JSON.parse(queryObj.attrs))
    ;(async function() {
      const results = await queryProducts(queryObj).then(res => res.data)
      setResults(results)
    }())
  }, [qstr])

  const updateFiltersParam = filters => {
    navigate(`cari?q=${query}&attrs=${JSON.stringify(filters)}`)
  }

  const handleSubmit = e => {
    e.preventDefault()
    navigate(`cari?q=${query}`)
  }

  const handleAddFilter = attr => {
    const filters = [...(activeFilters || []), attr]
    updateFiltersParam(filters)
  }

  const handleRemoveFilter = attr => {
    const filters = activeFilters.slice()
    filters.splice(filters.findIndex(a => a.label === attr.label && a.value === attr.value), 1)
    updateFiltersParam(filters)
  }

  const handleFilterChange = (attr, active) => {
    active ? handleAddFilter(attr) : handleRemoveFilter(attr)
  }

  return (
    <>
      <Head title='Cari' />
      <Segment vertical>
        <Header as='h1'>Cari</Header>
        <form onSubmit={handleSubmit}>
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder='Cari...' icon='search' iconPosition='left' />
        </form>
        <FiltersBox results={results} activeFilters={activeFilters} onChange={handleFilterChange} />
        <ActiveFiltersBox filters={activeFilters} onRemoveFilter={handleRemoveFilter} />
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </Segment>
      <Match path='*'>
        {({ location }) => location.search !== qstr && setQstr(location.search)}
      </Match>
    </>
  )
}

export default CariPage