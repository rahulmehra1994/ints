import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import mainReducer from './reducers/mainReducer'

let mid
if (
  process.env.APP_ENV !== 'live' &&
  process.env.APP_ENV !== 'staging'
) {
  mid = applyMiddleware(thunk, logger)
} else {
  mid = applyMiddleware(thunk)
}

const store = createStore(mainReducer, {}, mid)

export default store
