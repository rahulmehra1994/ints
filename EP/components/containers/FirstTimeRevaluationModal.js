import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  common,
  log,
  mutuals,
  showFirstTimeRevaluationPopup,
  storeOnlyInterviewBasicData,
} from './../../actions/commonActions'
import { changeInterviewToSuccess } from './../../actions/interviewActions'
import ContentRevaluation from '../Revaluation/ContentRevaluation'

var classNames = require('classnames')

class FirstTimeRevaluationModal extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  viewOlderFeedback = () => {
    this.stage2()
  }

  stage2() {
    let fd = new FormData()
    fd.append('interview_key', this.props.intQuestionId)
    fd.append('initial_competency_processed_status', 'true')
    changeInterviewToSuccess(fd, this.afterChangeInterviewToSuccess)
  }

  afterChangeInterviewToSuccess = () => {
    storeOnlyInterviewBasicData()
  }

  render() {
    return (
      <React.Fragment>
        {showFirstTimeRevaluationPopup() ? (
          <div className="fullScreenCover">
            <div
              className="mt-20 mx-auto bg-white rounded-sm p-10"
              style={{ width: 640 }}>
              <div className="text-24-bold text-center">
                In order to view feedback for competency section
              </div>
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={this.viewOlderFeedback}
                  className="button whiteButton mr-8"
                  tabIndex="1"
                  aria-label={`View old results`}>
                  View old results
                </button>

                <ContentRevaluation />
              </div>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    intQuestionId: state.interviewEP.intQuestionId,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstTimeRevaluationModal)
