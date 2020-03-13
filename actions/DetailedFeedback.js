import { createAction } from 'redux-actions'

const PREFIX = 'DetailedFeedback.'

export const SELECT_SECTION = PREFIX + 'SELECT_SECTION'
export const SELECT_INDEX = PREFIX + 'SELECT_INDEX'
export const UPDATE_TEXT = PREFIX + 'UPDATE_TEXT'

export const selectSection = createAction(SELECT_SECTION)
export const selectIndex = createAction(SELECT_INDEX)
export const updateText = createAction(UPDATE_TEXT)
