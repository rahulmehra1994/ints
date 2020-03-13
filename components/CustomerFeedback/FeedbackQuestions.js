import React, { Component } from 'react'
import _ from 'underscore'
import FeedbackRating from './FeedbackRating'

export class MultipleChoiceQuestion extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { options, type, className, questionName } = this.props
    let mainText = this.props.mainText
    if (this.props.mandatory) {
      mainText = (
        <div>
          {mainText} <span className="red-star">*</span>
        </div>
      )
    }
    let changeOption = this.props.changeOption
    let optionsDivs = Object.keys(options).map(function(value) {
      return (
        <div className="row">
          <div className="col-sm-1 col-sm-offset-2">
            <input
              type={type}
              name={questionName}
              value={value}
              onChange={changeOption}
            />
          </div>
          <div className="col-sm-8">{options[value]}</div>
        </div>
      )
    })
    return (
      <div className={`${className} feedback-questions`}>
        <div className="feedback-question">{mainText}</div>
        <div className="feedback-options">{optionsDivs}</div>
      </div>
    )
  }
}

export class SelectCheckBoxesQuestion extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { options, type, className, questionName } = this.props
    let mainText = this.props.mainText
    let questionLabel = this.props.mandatory
      ? 'Mandatory question. ' + this.props.mainText
      : this.props.mainText
    if (this.props.mandatory) {
      mainText = (
        <div>
          {mainText} <span className="red-star">*</span>
        </div>
      )
    }
    let changeOption = this.props.changeOption
    let i = 0
    let optionsDivs = Object.keys(options).map(function(value) {
      i++
      return (
        <div className="col-sm-4" key={i}>
          <input
            aria-label={`Please check if you like ${options[value]}`}
            type={type}
            name={value}
            value={value}
            onChange={changeOption}
          />
          <span style={{ verticalAlign: '12%' }}>{options[value]}</span>
        </div>
      )
    })

    return (
      <div className={`${className} feedback-questions`}>
        <div
          className="feedback-question"
          tabIndex={0}
          aria-label={questionLabel}>
          {mainText}
        </div>
        <div className="feedback-options">
          <div className="row">{optionsDivs}</div>
        </div>
      </div>
    )
  }
}

export class TextQuestion extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let setFeedbackRating = this.props.setFeedbackRating
    let mainText = this.props.mainText
    let questionLabel = this.props.mandatory
      ? 'Mandatory question. ' + this.props.mainText
      : this.props.mainText
    if (this.props.mandatory) {
      mainText = (
        <div>
          {mainText} <span className="red-star">*</span>
        </div>
      )
    }
    return (
      <div className={`${this.props.className} feedback-questions`}>
        <div className="feedback-question">{mainText}</div>
        <div className="margin-5" />
        <div className="feedback-options">
          <textarea
            aria-label={questionLabel}
            placeholder={
              _.isUndefined(this.props.placeholder)
                ? ''
                : this.props.placeholder
            }
            name={this.props.fieldName}
            maxLength={
              _.isUndefined(this.props.maxLength)
                ? '1000'
                : this.props.maxLength
            }
            onChange={this.props.textareaChange}
          />
        </div>
      </div>
    )
  }
}

export class SingleRatingQuestion extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let setFeedbackRating = this.props.setFeedbackRating
    let mainText = this.props.mainText
    let questionLabel = this.props.mandatory
      ? this.props.mainText +
        'Mandatory rating question. 1 being the lowest, 5 being the highest. '
      : this.props.mainText
    if (this.props.mandatory) {
      mainText = (
        <div>
          {mainText} <span className="red-star">*</span>
        </div>
      )
    }
    return (
      <div className={`${this.props.className} feedback-questions`}>
        <div
          className="feedback-question"
          aria-label={questionLabel}
          tabIndex={0}>
          {mainText}
        </div>
        <br />
        <div className="row">
          <div className="col-sm-3 col-sm-offset-4">
            <div className="feedback-sub-options">
              <FeedbackRating
                setFeedbackRating={setFeedbackRating}
                rating={this.props.rating}
                className={'col-sm-2'}
                feedback_rating={1}
                column={this.props.fieldName}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export class QuestionSet extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let questions = this.props.questions
    let setFeedbackRating = this.props.setFeedbackRating
    let mainText = this.props.mainText
    let questionLabel = this.props.mandatory
      ? 'mandatory question. ' + mainText
      : mainText
    if (this.props.mandatory) {
      mainText = (
        <div>
          {mainText} <span className="red-star">*</span>
        </div>
      )
    }
    let i = 0
    let questionsDivs = Object.keys(questions).map(function(value) {
      i++
      return (
        <div className="row" key={i}>
          <div className="feedback-sub-question">
            <div className="col-sm-5 col-sm-offset-2">
              <div
                className="feedback-question-subquestion"
                tabIndex={0}
                aria-label={questions[value].text}>
                {questions[value].text}
              </div>
            </div>
            <div className="col-sm-3">
              <div className="feedback-sub-options">
                <FeedbackRating
                  setFeedbackRating={setFeedbackRating}
                  rating={questions[value].value}
                  className="col-sm-2"
                  feedback_rating={1}
                  column={value}
                />
              </div>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div className={`${this.props.className} feedback-questions`}>
        <div
          className="feedback-question"
          tabIndex={0}
          aria-label={questionLabel}>
          {mainText}
        </div>
        {questionsDivs}
      </div>
    )
  }
}
