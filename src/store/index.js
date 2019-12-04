import React from 'react'
import globalHook from '@farolan/use-global-hook'

import state from './state'
import actions from './actions'

const useGlobal = globalHook(React, state, actions)

export default useGlobal