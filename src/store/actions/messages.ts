import { MessageParams, Message } from '~types'

let messageId = 1

const newMessageId = () => messageId++

export const addMessage = (store, { message, title, type = 'info', timeout = 4000 }: MessageParams) => {
  const msgId = newMessageId()
  const msg: Message = {
    id: msgId,
    message,
    title,
    type,
    remove: () => store.actions.messages.removeMessage(msgId)
  }
  store.setState({
    messages: [
      ...store.state.messages,
      msg
    ]
  })
  timeout > 0 && setTimeout(msg.remove, timeout)
}

export const removeMessage = (store, id) => {
  store.setState({
    messages: store.state.messages.filter(msg => msg.id !== id)
  })
}