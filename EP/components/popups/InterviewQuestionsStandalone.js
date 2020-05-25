import React, { Component } from 'react'
import { mutuals, log, common } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'
import InterviewQuestions from './InterviewQuestions'

const FocusTrap = require('focus-trap-react')
var classNames = require('classnames')

class InterviewQuestionsStandalone extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div
        className="px-4 text-left bg-white absolute pin-t shadow-1"
        style={{ width: 300, right: -300 }}>
        <div className="mt-4">
          <span className="text-16-demi">Question</span>
          <div className="float-right px-2 border rounded-lg flex items-center">
            <span
              className="ep-icon-right-rounded text-16-normal"
              style={{ color: common.sectionColor[0] }}
            />
            <span className="ml-2">Content Strength</span>
          </div>
        </div>

        <div className="mt-3">{this.props.latestQuestion.question_content}</div>

        <div className="hr mt-4" />

        <div className="p-4 flex justify-center">
          <button
            className="brand-blue-color "
            onClick={() => {
              this.props.openPopup('questions-panel')
            }}>
            <span className="ep-icon-replay font-bold" />
            <span className="ml-4 text-14-demi">Change Question</span>
          </button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    latestQuestion: state.userInfoEP['questionData'],
  }
}

export default connect(mapStateToProps, {})(InterviewQuestionsStandalone)