import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'

import { Container, Segment } from 'semantic-ui-react'
import { Link, Router } from '~components/router'
import Dynamic from 'containers/Dynamic'
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
              <Dynamic path="dynamic" />
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
