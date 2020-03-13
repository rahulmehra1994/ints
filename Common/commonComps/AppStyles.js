import React from 'react'
import * as cookie from 'js-cookie'
import '@vmockinc/dashboard/styles/dashboard.scss'
import '../../styles/styles.scss'

export default class DashboardStyles extends React.Component {
  componentDidMount() {
    const cookieVal = cookie.get('accessible_styles')
    if (cookieVal === 'true') {
      import('@vmockinc/dashboard/styles/dashboard_accessible.scss')
      import('../../styles/styles_accessible.scss')
    }
  }

  render() {
    return null
  }
}
