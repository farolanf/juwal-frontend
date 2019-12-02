import { ReactNode } from 'react'

interface MessageParams {
  message: ReactNode,
  title: ReactNode,
  type: 'info' | 'success' | 'error'
  timeout: number
}

interface Message {
  id: number,
  message: ReactNode,
  title: ReactNode,
  type: 'info' | 'success' | 'error',
  remove: () => void
}
