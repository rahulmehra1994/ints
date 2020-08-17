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
    if (_.isEmpty(this.props.requirementsData)) {
      return null
    }

    let questions = this.props.requirementsData.required_questions
    let valArray = Object.values(questions)

    return (
      <>
        {this.state.disabler ? (
          <div className="epModalCover">
            <CenterLoading />
          </div>
        ) : null}
        <div
          id="requirementsEl"
          className="mt-3 p-4 text-left bg-white shadow-1">
          <div className="mt-4">
            <span className="text-16-demi">Your requirements </span>
          </div>

          <section
            className="overflow-auto requirements-scroll"
            style={{ maxHeight: 458 }}>
            {_.map(valArray, (val, index) => {
              return (
                <div
                  key={index}
                  className="requirementQues relative"
                  style={{
                    paddingTop: 25,
                    paddingBottom: 25,
                    borderBottom: '1px solid lightgray',
                  }}>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: '35px 1fr' }}>
                    <div>{`Q${index + 1}`}.</div>
                    <div>{val.question_content}</div>
                  </div>
                  <div className="absolute pin-r" style={{ bottom: 5 }}>
                    {val.is_attempted ? (
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
                        this.handleAttemptThisQues(val.question_id)
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
