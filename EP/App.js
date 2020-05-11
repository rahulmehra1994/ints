import React, { Component } from 'react'
import CenterLoading from './components/CenterLoading'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'underscore'
import * as cookie from 'js-cookie'
import Main from './components/Main'
import {
  // fetchUserCustomizations,
  userCustomizationsEP,
} from './actions/apiActions'
import CustomerSupport from '@vmockinc/dashboard/CustomerSupport'
import { fetchUserCustomizations } from '@vmockinc/dashboard/Dashboard/actions/UserCustomizations'

class App extends Component {
  constructor(props) {
    super(props)
    this.props.fetchUserCustomizations()
    userCustomizationsEP()
    this.intializeHighContrastCookie()
  }

  intializeHighContrastCookie() {
    if (cookie.get('accessible_styles') === true) {
      cookie.set('accessible_styles', 'true')
    } else {
      cookie.set('accessible_styles', 'false')
    }
  }

  customizeHasResult() {
    if (process.env.APP_ENV === 'dev') return true

    let customizations = this.props.userCustomizations.data
    if (customizations !== null && !_.isEmpty(customizations)) {
      return this.customizeHasKeys(customizations)
    } else {
      return false
    }
  }

  customizeHasKeys(customizations) {
    if (
      _.has(customizations, 'show_ep_product') &&
      _.has(customizations, 'is_ep_enabled')
    ) {
      if (customizations.show_ep_product && customizations.is_ep_enabled) {
        return true
      } else {
        return this.sendToDashboard()
      }
    } else {
      return this.sendToDashboard()
    }
  }

  sendToDashboard() {
    window.location.href = '/dashboard'
    return false
  }

  render() {
    if (this.customizeHasResult() && !_.isEmpty(this.props.customizationsEP)) {
      return (
        <React.Fragment>
          <div className="ep-app">
            <Main />
          </div>
          <CustomerSupport />
        </React.Fragment>
      )
    }
    return (
      <div className="fixed pin flex items-center justify-center">
        <CenterLoading />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userCustomizations: state.userCustomizations,
    customizationsEP: state.epCustomizations,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUserCustomizations: () => {
      dispatch(fetchUserCustomizations())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))
