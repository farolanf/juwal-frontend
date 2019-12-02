import React from 'react'
import { Head } from 'react-static'

import { Segment } from 'semantic-ui-react'

import useGlobal from '~store'

const TestGlobal = () => {
  const [state, actions] = useGlobal()
  return (
    <div>
      <Segment>
        <h2>Messages</h2>
        <button onClick={() => actions.messages.addMessage({ message: 'Some info ' + Date.now(), title: 'You need to know this' })}>Info message</button>
        <button onClick={() => actions.messages.addMessage({ message: 'Some error ' + Date.now(), title: 'Ooops!', type: 'error', timeout: 0 })} >Error message</button>
      </Segment>
      <Segment>
        <h2>Auth</h2>
        <button onClick={() => actions.auth.logout()}>Logout</button>
        <h3>User</h3>
        <pre>{JSON.stringify(state.user, null, 2)}</pre>
      </Segment>
    </div>
  )
}

const TestPage = (props) => (
  <div>
    <Head title='Test' />
    <Segment basic>
      <TestGlobal />
    </Segment>
  </div>
)

export default TestPage
