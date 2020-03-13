import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Provider } from 'react-redux'
import MainRoutes from '../routes'
import { Router, Route } from 'react-router-dom'
import AppStyles from 'commonComps/AppStyles'

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history}>
      <AppStyles />
      <Route path="/aspire/" component={MainRoutes} />
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default Root
