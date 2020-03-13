import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navbar from '@vmockinc/dashboard/Navbar'
import UnsupportedBrowser from '@vmockinc/dashboard/Pages/components/UnsupportedBrowser'
import CustomerSupport from '@vmockinc/dashboard/CustomerSupport'
import Loading from '@vmockinc/dashboard/Dashboard/components/Loading'
import config from '@vmockinc/dashboard/config/app'
import { fetchUserCustomizations } from '@vmockinc/dashboard/Dashboard/actions/UserCustomizations'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

import { getLatestFetchId, functionMappings } from '../actions/Login'
import { getCommunityCustomisation } from '../actions/AspireCommunityCustomisation'
import { fetchTourStatus } from '../tour/Action'

class App extends Component {
  UNSAFE_componentWillMount() {
    const {
      fetchUserCustomizations,
      getLatestFetchId,
      functionMappings,
      fetchTourStatus,
      getCommunityCustomisation,
    } = this.props
    fetchUserCustomizations()
    getLatestFetchId()
    functionMappings()
    fetchTourStatus()
    getCommunityCustomisation()
  }

  renderLoading() {
    return <Loading className="fullscreen" />
  }

  componentDidMount() {
    if (document.referrer.indexOf('dashboard/aspire') >= 0) {
      sendTrackingData(
        'event',
        'dashboard_aspire_second_screen',
        'click',
        'see_detailed_feedback_btn'
      )
    }
    // Let the document know when the mouse is being used,
    // so accessibility styling can be removed.

    document.body.addEventListener('mousedown', function() {
      document.body.classList.add('using-mouse')
    })

    document.body.addEventListener('keydown', function() {
      document.body.classList.remove('using-mouse')
    })
  }

  render() {
    const { children } = this.props

    return (
      <div>
        <div className="tour-body-curtain js-tour-curtain hidden" />
        <Navbar id="nav" navUrl="/dashboard/aspire" />
        <div className="main-body">{children}</div>
        <UnsupportedBrowser />
        <CustomerSupport />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user.data,
    customizations: state.userCustomizations.data,
  }
}

export default connect(mapStateToProps, {
  fetchUserCustomizations,
  getLatestFetchId,
  functionMappings,
  fetchTourStatus,
  getCommunityCustomisation,
})(App)
