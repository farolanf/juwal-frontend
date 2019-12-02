import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Router } from '@reach/router'

import { Container, Segment } from 'semantic-ui-react'
import Header from '~components/header'
import 'semantic-ui-css/semantic.min.css'

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App() {
  return (
    <Root>
      <Header />
      <Container>
        <main>
          <React.Suspense fallback={<em>Loading...</em>}>
            <Router>
              <Routes path="*" />
            </Router>
          </React.Suspense>
        </main>
        <footer>
          <Segment vertical>
            Copyright {new Date().getFullYear()} Juwal
          </Segment>
        </footer>
      </Container>
    </Root>
  )
}

export default App
