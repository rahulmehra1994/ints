import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'
import { routerMiddleware } from 'react-router-redux'
import * as DashboardStates from '@vmockinc/dashboard/Dashboard/states'
import * as AccountStates from '@vmockinc/dashboard/Account/states'
import { createBrowserHistory } from 'history'

const browserHistory = createBrowserHistory()
const logger = createLogger()
const routerMiddleWare = routerMiddleware(browserHistory)
let middleware

if (process.env.APP_ENV === 'live') {
  middleware = applyMiddleware(thunk, routerMiddleWare)
} else {
  // middleware = applyMiddleware(thunk, routerMiddleWare, logger)
  middleware = applyMiddleware(thunk, routerMiddleWare)
}

function configureStore() {
  const store = createStore(rootReducer, middleware)

  _.map(DashboardStates, state => state.connect(store))
  _.map(AccountStates, state => state.connect(store))

  return store
}

let store = configureStore()

export default store
