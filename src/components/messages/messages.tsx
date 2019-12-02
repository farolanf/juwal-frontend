import React from 'react'

import { Message as MessageType } from '~types'

import { Message as Message, Transition } from 'semantic-ui-react'
import useGlobal from '~store'

import './messages.module.scss'

const Messages = () => {
  const [messages] = useGlobal(state => state.messages)
  return (
    <div styleName='messages'>
      <Transition.Group animation='fade' duration={500}>
        {messages.slice().reverse().map((msg: MessageType) => (
          <Message key={msg.id} info={msg.type === 'info'} positive={msg.type === 'success'} negative={msg.type === 'error'} onDismiss={msg.remove}>
            <Message.Header>{msg.title}</Message.Header>
            <p>{msg.message}</p>
          </Message>
        ))}
      </Transition.Group>
    </div>
  )
}

export default Messages