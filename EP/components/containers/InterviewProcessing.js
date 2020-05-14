import React, { Component } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import {
  highContrast,
  log,
  mutuals,
  common,
} from './../../actions/commonActions'
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

    this.setState({ instructions: instruction, ariaLabel: ariaLabel })
  }

  render() {
    return (
      <div className="flex justify-center">
        <section className="mt-10">
          <div
            className="flex justify-center items-center border border-red-lighter rounded-sm"
            style={{
              height: 47,
              color: common.primaryColor[2],
              background: common.lightBgColor[2],
            }}>
            <span className="ep-icon-warning-4-side text-24-normal" />
            <span className="ml-4 text-14-demi">
              Please do not close this tab before the interview is processed
            </span>
          </div>

          <div className="bg-white p-10 shadow-1">
            {/* <h1
          className="thankYouContainer"
       
          tabIndex={this.state.tabIndex}
          aria-label={this.state.ariaLabel}>
          {this.state.instructions}
        </h1> */}

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
        </section>
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

export default connect(mapStateToProps, {})(InterviewProcessing)
