import React from 'react'
import useGlobalHook from '@farolan/use-global-hook'

import state from './state'
import actions from './actions'

const useGlobal = useGlobalHook(React, state, actions)

export default useGlobal