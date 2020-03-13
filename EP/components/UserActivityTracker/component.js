import React, { Component } from 'react'
// import { browserHistory } from 'react-router'
// import { BrowserRouter } from 'react-router-dom'
import _ from 'lodash'
import $ from 'jquery'
// import { AccountLoginTokenUpdate } from '../../../Account/states'
import { notify } from '@vmockinc/dashboard/services/helpers'
import { connect } from 'react-redux'
import { userActivityMeasure } from './../../actions/apiActions'

const notificationTime = 900
const debounceTime = 30 * 1000
const intervalTime = seconds => {
  if (_.isUndefined(seconds)) {
    seconds = 1800 // default value
  }

  if (seconds >= 900) {
    return (seconds - 600) * 1000
  }

  return Math.round(seconds / 2) * 1000
}
let notification = null
let inactivityTimeout = null
const done = response => {
  if (notification) {
    return
  }
  if (response.expires_in <= notificationTime) {
    notification = notify(
      'You will be logged out soon.<br>Please login again to continue.',
      'warning',
      {
        layout: 'topCenter',
        timeout: false,
      }
    )
  } else {
    clearTimeout(inactivityTimeout)
    inactivityTimeout = setTimeout(() => {
      notification = notify(
        'You will be logged out soon.<br>Please click <a>here</a> to stay logged in.',
        'warning',
        {
          layout: 'topCenter',
          timeout: false,
          callback: {
            onClose: () => {
              notification = null
              track.flush()
            },
          },
        }
      )
    }, intervalTime(response.inactive_in))
  }
}
export const track = _.debounce(
  () => {
    //AccountLoginTokenUpdate.send({}, done)
    userActivityMeasure(done)
  },
  debounceTime,
  {
    leading: true,
    trailing: true,
  }
)

class UserActivityTracker extends Component {
  componentDidMount() {
    // this.unlisten = browserHistory.listen(track)
    // this.unlisten = BrowserRouter.listen(track)

    $(window).on('mousemove resize scroll keydown click', track)
  }

  componentWillUnmount() {
    // this.unlisten()
    clearTimeout(inactivityTimeout)
  }

  render() {
    return null
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    userActivityMeasure: () => {
      dispatch(userActivityMeasure())
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserActivityTracker)
