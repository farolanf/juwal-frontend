import React from 'react'
import { Head } from 'react-static'

import { Segment, Header } from 'semantic-ui-react'

const IndexPage = () => (
  <div>
    <Head title='Home' />
    <Segment basic vertical>
      <Header as='h1'>Home</Header>
    </Segment>
  </div>
)

export default IndexPage
