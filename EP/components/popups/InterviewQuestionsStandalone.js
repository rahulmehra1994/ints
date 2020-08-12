import React, { Component } from 'react'
import {
  mutuals,
  log,
  common,
  ContentStrengthBlock,
  COMMUNITY,
} from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'
import InterviewQuestions from './InterviewQuestions'
import Requirements from './../popups/Requirements'

const FocusTrap = require('focus-trap-react')
var classNames = require('classnames')

class InterviewQuestionsStandalone extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.contentLimit = 95
  }

  truncateQuestionContent() {
    return this.props.latestQuestion.question_content.length > this.contentLimit
  }

  questionElipses() {
    if (this.truncateQuestionContent()) {
      return (
        this.props.latestQuestion.question_content.substring(
          0,
          this.contentLimit
        ) + '...'
      )
    } else {
      return this.props.latestQuestion.question_content
    }
  }

  render() {
    let { customizations, latestQuestion } = this.props

    if (!this.props.multipleQuestionEnabled) return null

    if (this.props.firstTimeUser) return null

    if (latestQuestion.question_id === -1) return null

    return (
      <div
        className="px-4 text-left bg-white absolute pin-t shadow-1"
        style={{ width: 300, right: -310, zIndex: 501 }}>
        <div className="mt-4">
          <span className="text-16-demi">Question</span>

          {customizations.question_id_mapping[latestQuestion.question_id]
            .is_content_strength_enabled ? (
            <div
              className="relative float-right px-2 border flex items-center hover-wrap"
              style={{ background: '#fafafa', borderRadius: 10 }}>
              {ContentStrengthBlock()}
              <span className="ml-2">Content Strength</span>

              <div
                className="hover-elm bg-white p-4 shadow-1 pin-r"
                style={{ width: 220, top: 22 }}>
                <div className="text-14-demi">Content Strength Available</div>
                <div className="mt-3 grey-color">
                  Feedback on content is available for this question.
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div
          className={classNames('mt-2 relative', {
            'hover-wrap': this.truncateQuestionContent(),
          })}>
          {this.questionElipses()}

          <div
            className="hover-elm bg-black rounded p-4 shadow-1 pin-l"
            style={{ top: 24 }}>
            <span
              className="ep-icon-marker absolute"
              style={{ top: -8, left: '50%', transform: 'translateX(-50%)' }}
            />
            <div className="text-white">{latestQuestion.question_content}</div>
          </div>
        </div>
        <div className="p-4 flex justify-center">
          <button
            className="brand-blue-color flex justify-center items-center"
            onClick={() => {
              this.props.openPopup('questions-panel')
            }}>
            <span className="ep-icon-change text-16-demi" />
            <span className="ml-4 text-14-demi">Change Question</span>
          </button>
        </div>
        {this.props.user.community === COMMUNITY ? (
          <Requirements {...this.props} />
        ) : null}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    latestQuestion: state.userInfoEP['questionData'],
    customizations: state.epCustomizations,
    user: state.user.data,
  }
}

export default connect(mapStateToProps, {})(InterviewQuestionsStandalone)
