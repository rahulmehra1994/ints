import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  common,
  log,
  mutuals,
  showFirstTimeRevaluationPopup,
} from './../../actions/commonActions'
import {
  changeInterviewToSuccess,
  setInterviewBasicData,
} from './../../actions/interviewActions'
import ContentRevaluation from '../Revaluation/ContentRevaluation'
import { notify } from '@vmockinc/dashboard/services/helpers'

var classNames = require('classnames')

class FirstTimeRevaluationModal extends Component {
  constructor(props) {
    super(props)
    this.state = { viewOlderFeedbackProcessing: false }
  }

  viewOlderFeedback() {
    if (!this.props.intData.is_own_interview) {
      mutuals.adminNoti()
      return
    }

    this.firstTimeRevaluationSaveRemotely(this.props)
  }

  firstTimeRevaluationSaveLocally = props => {
    let intData = mutuals.deepCopy(props.interviewEP.basicData)
    intData['initial_competency_processed_status'] = true

    setInterviewBasicData(intData)
    this.setState({ viewOlderFeedbackProcessing: false })
  }

  firstTimeRevaluationSaveRemotely(props) {
    this.setState({ viewOlderFeedbackProcessing: true })
    let fd = new FormData()
    fd.append('interview_key', props.intKey)
    fd.append('initial_competency_processed_status', true)
    changeInterviewToSuccess(fd, () => {
      this.firstTimeRevaluationSaveLocally(props)
    })
  }

  render() {
    return showFirstTimeRevaluationPopup(this.props) ? (
      <div className="fullScreenCover">
        <div
          className="mx-auto bg-white rounded-sm p-10"
          style={{ marginTop: 50, width: 640 }}>
          <div className="text-24-bold text-center">
            Feedback has been updated for this interview
          </div>
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => {
                this.viewOlderFeedback()
              }}
              className="button whiteButton mr-8"
              tabIndex="1"
              aria-label="View Old Results"
              disabled={this.state.viewOlderFeedbackProcessing}>
              {this.state.viewOlderFeedbackProcessing
                ? 'Processing'
                : 'View Old Results'}
            </button>

            <ContentRevaluation buttonTxt={'View Updated Results'} />
          </div>
        </div>
      </div>
    ) : null
  }
}

const mapStateToProps = state => {
  return {
    intKey: state.appIntKey.key,
    interviewEP: state.interviewEP,
    epCustomizations: state.epCustomizations,
    intData: state.interviewEP.basicData,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstTimeRevaluationModal)
