import React, { useEffect } from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Router } from '@reach/router'

import { Container, Segment } from 'semantic-ui-react'
import Header from '~components/header'
import Messages from '~components/messages'
import IklanSayaPage from '~src/pages/iklan-saya'
import ItemPage from '~src/pages/item'

import useGlobal from '~store'
import { getToken } from '~libs/auth'

addPrefetchExcludes([
  /iklan-saya\/.+/i,
  /item\/.+/i
])

function App() {
  const [, actions] = useGlobal(() => null)

  useEffect(() => {
    if (getToken()) {
      actions.auth.getUser()
    }
  }, [actions])

  return (
    <Root>
      <Header />
      <Container>
        <main>
          <React.Suspense fallback={<em>Loading...</em>}>
            <Router>
              <IklanSayaPage path='iklan-saya/*' />
              <ItemPage path='item/*' />
              <Routes path="*" />
            </Router>
          </React.Suspense>
        </main>
        <footer>
          <Segment vertical>
            Copyright {new Date().getFullYear()} Juwal
          </Segment>
        </footer>
        <Messages />
      </Container>
    </Root>
  )
}

export default App
