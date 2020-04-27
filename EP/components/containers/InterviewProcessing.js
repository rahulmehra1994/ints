import React, { Component } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { appIntKey } from './../../actions/resultsActions'
import {
  highContrast,
  log,
  mutuals,
  common,
} from './../../actions/commonActions'
import CenterLoading from './../CenterLoading/index'
import { OverlayMask } from './../../images/svg-files/CalibOverlayMask'
import ProcessingJazz from './../videoJazz/ProcessingJazz'

class InterviewProcessing extends Component {
  constructor(props) {
    super(props)
    this.fullStream = null
    this.state = {
      tabIndex: common.tabIndexes.interview,
    }
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: '/start-processing',
      event_type: 'click',
    })

    let instruction = `${
      this.props.userInfo
        ? `Thank you ${this.props.userInfo.firstName} ${this.props.userInfo.lastName}. We will provide your feedback in a moment.`
        : 'We will provide your feedback in a moment.'
    }`

    let ariaLabel =
      instruction +
      ' please do not close the tab before the interview is uploaded. we will automatically redirect to interview summary page'

    this.setState({ instructions: instruction, ariaLabel: ariaLabel }, () => {
      setTimeout(() => {
        this.refs.thankYouContainer.focus()
      }, 500)
    })
  }

  render() {
    return (
      <div id="interview-body">
        <div id="interview-box">
          <h1
            className="thankYouContainer"
            ref="thankYouContainer"
            tabIndex={this.state.tabIndex}
            aria-label={this.state.ariaLabel}>
            {this.state.instructions}
          </h1>

          <div
            className={classNames({
              hidden: !this.props.showProcessing,
            })}>
            <ProcessingJazz
              animState={this.props.showProcessing}
              status="pending"
              noOfVideoSent={this.props.totalSent}
              noOfVideoProcessed={this.props.totalProcessed}
              tabIndex={this.props.tabIndex}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    statuses: state.statuses,
    appUrls: state.appUrls,
    userInfo: !_.isEmpty(state.user.data) ? state.user.data : null,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewProcessing)
