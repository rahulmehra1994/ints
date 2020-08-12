import React, { Component } from 'react'
import {
  mutuals,
  log,
  common,
  ContentStrengthBlock,
} from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'
import { notify } from '@vmockinc/dashboard/services/helpers'
import { createInterview2 } from './../../actions/interviewActions'
import { getUserInfo } from './../../actions/apiActions'
import CenterLoading from './../CenterLoading/index'

const FocusTrap = require('focus-trap-react')
var classNames = require('classnames')

class Requirements extends Component {
  constructor(props) {
    super(props)
    this.state = { disabler: false }
    this.contentLimit = 95
    this.onSuccess = this.onSuccess.bind(this)
    this.handleAttemptThisQues = this.handleAttemptThisQues.bind(this)
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

  mouseEnter = () => {
    this.setState({ isMouseInside: true })
  }
  mouseLeave = () => {
    this.setState({ isMouseInside: false })
  }

  handleAttemptThisQues(question_id) {
    this.setState({ disabler: true })
    let fd = new FormData()
    fd.append('question_id', question_id)
    createInterview2(this.onSuccess, fd)
  }

  onSuccess(data) {
    this.setState({ disabler: false })
    this.props.onSuccessOfCreateInt(data)
    getUserInfo()
    notify('Question Selected', 'success', {
      layout: 'topRight',
    })
  }

  render() {
    let questions = this.props.requirementsData.required_questions

    return (
      <>
        {this.state.disabler ? (
          <div className="epModalCover">
            <CenterLoading />
          </div>
        ) : null}
        <div
          id="requirementsEl"
          className="px-4 text-left bg-white absolute pin-l shadow-1"
          style={{ width: 300, bottom: -505 }}>
          <div className="mt-4">
            <span className="text-16-demi">Question</span>
          </div>

          {/* <div
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
        </div> */}

          <section
            className="overflow-auto requirements-scroll"
            style={{ maxHeight: 458 }}>
            {_.map(questions, (val, key) => {
              return (
                <div
                  key={key}
                  className="requirementQues"
                  style={{
                    paddingTop: 15,
                    paddingBottom: 15,
                    borderBottom: '1px solid lightgray',
                  }}>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: '35px 1fr' }}>
                    <div>{`Q${key}`}.</div>
                    <div>{val.question_content}</div>
                  </div>
                  <div className="mt-4 text-right">
                    {true || val.is_attempted ? (
                      <span
                        className="px-3 py-1 attempted-el"
                        style={{
                          borderRadius: 25,
                          color: common.sectionColor[0],
                          backgroundColor: common.lightBgColor[0],
                        }}>
                        Attempted
                      </span>
                    ) : null}

                    <button
                      className="attempt-this-ques brand-blue-color text-12-med"
                      onClick={() => {
                        this.handleAttemptThisQues(key)
                      }}>
                      Attempt this question
                    </button>
                  </div>
                </div>
              )
            })}
          </section>
        </div>
      </>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    latestQuestion: state.userInfoEP['questionData'],
    customizations: state.epCustomizations,
    requirementsData: state.epRequirements,
  }
}

export default connect(mapStateToProps, {})(Requirements)
