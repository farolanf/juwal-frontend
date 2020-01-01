import React, { useState, useEffect } from 'react'
import qs from 'qs'
import _ from 'lodash'
import { Head } from 'react-static'
import { navigate, Match, Link } from '@reach/router'

import { Grid, Segment, Header, Input, List, Checkbox, Label, Icon, Card, Image, Responsive } from 'semantic-ui-react'
import './cari.module.scss'

import { queryProducts } from '~api/products'
import { formatCurrency } from '~libs/helpers'

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

  const sortValues = buckets => buckets.sort((a, b) => {
    return a.key && !b.key
      ? -1
      : !a.key && b.key ? 1 : 0
  })

  const handleFilterChange = (e, opt, label, value) => {
    onChange({ label, value }, opt.checked)
  }

  return (
    <List.Item>
      <List.Header>{bucket.key} ({bucket.doc_count})</List.Header>
      <List.Content>
        {bucket.values && sortValues(bucket.values.buckets).map(value => (
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

const ProductOverview = ({ item }) => (
  <Card as={Link} to={`/item/${item.id}`} styleName='product-overview'>
    <div className='' styleName='image-container'>
      <Image src={item.images[0]} />
    </div>
    <Card.Content>
      <Card.Header>{formatCurrency(item.price)}</Card.Header>
      <Card.Meta>2019</Card.Meta>
      <Card.Description>{item.title} test long title test long titletest long test long title test long titletest long title test long title test long title test long title</Card.Description>
    </Card.Content>
    <Card.Content extra>
      <footer>
        <div>Banjarmasin</div>
        <div>5 Des</div>
      </footer>
    </Card.Content>
  </Card>
)

const SearchResults = ({ results }) => (
  <Segment styleName='search-results' basic>
    <Grid stackable>
      {_.get(results, 'hits.hits', []).map(hit => (
        <ProductOverview key={hit._id} item={hit._source} />
      ))}
    </Grid>
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
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder='Cari...' icon='search' iconPosition='left' fluid />
        </form>
        <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
          <Segment vertical>
            <ActiveFiltersBox filters={activeFilters} onRemoveFilter={handleRemoveFilter} />
            <FiltersBox results={results} activeFilters={activeFilters} onChange={handleFilterChange} />
            <SearchResults results={results} />
          </Segment>
        </Responsive>
        <Responsive minWidth={Responsive.onlyComputer.minWidth}>
          <Segment vertical>
            <Grid>
              <Grid.Column width={4}>
                <FiltersBox results={results} activeFilters={activeFilters} onChange={handleFilterChange} />
              </Grid.Column>
              <Grid.Column width={12}>
                <ActiveFiltersBox filters={activeFilters} onRemoveFilter={handleRemoveFilter} />
                <SearchResults results={results} />
              </Grid.Column>
            </Grid>
          </Segment>
        </Responsive>
      </Segment>
      <Match path='*'>
        {({ location }) => location.search !== qstr && setQstr(location.search)}
      </Match>
    </>
  )
}

export default CariPage