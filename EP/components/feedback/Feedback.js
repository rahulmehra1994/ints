import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals, log, common } from '../../actions/commonActions'
import { updateFeedback } from '../../actions/apiActions'
import { Form, TextArea } from 'semantic-ui-react'
import { notify } from '@vmockinc/dashboard/services/helpers'

const feedback =
  process.env.APP_PRODUCT_BASE_URL + '/dist/images/icons/feedback-icon.svg'

const notification = (val, type) => {
  notify(val, type, {
    layout: 'topCenter',
    timeout: 4000,
    callback: {
      onClose: () => {},
    },
  })
}

const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)
const FocusTrap = require('focus-trap-react')
var classNames = require('classnames')

let options = [
  { label: 'very bad', img: 'very-bad', color: '#ed1c24', selected: false },
  { label: 'bad', img: 'bad', color: '#f7941e', selected: false },
  { label: 'neutral', img: 'neutral', color: '#ffc62d', selected: false },
  { label: 'happy', img: 'happy', color: '#8dc63f', selected: false },
  { label: 'very happy', img: 'very-happy', color: '#009444', selected: false },
]

let demoQues = [
  {
    question_id: 1,
    question: 'Q1. How satisfied are you with the Interview Feedback?',
    options: JSON.parse(JSON.stringify(options)),
    config: {
      type: 'select',
      suggestion: true,
      mandatory: true,
    },
    error: { status: false, msg: null },
  },
  {
    question_id: 2,
    question: 'Q2. How was your overall experience?',
    options: JSON.parse(JSON.stringify(options)),
    config: {
      type: 'select',
      suggestion: true,
      mandatory: true,
    },
    error: { status: false, msg: null },
  },
  {
    question_id: 3,
    question: 'Any other comments or issues faced?',
    options: JSON.parse(JSON.stringify(options)),
    config: {
      type: 'textarea',
      suggestion: false,
      mandatory: false,
    },
    error: { status: false, msg: null },
  },
]

class Feedback extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      isFeedbackActive: false,
      questions: [],
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFailure = this.onFailure.bind(this)
    this.onFeedbackClose = this.onFeedbackClose.bind(this)
    this.updateParent = this.updateParent.bind(this)
    this.attachEscEvent()
  }

  attachEscEvent() {
    document.onkeydown = e => {
      if (e.key === 'Escape') this.onFeedbackClose()
    }
  }

  componentWillUnmount() {
    document.onkeydown = null
  }

  componentDidMount() {
    this.intialiseState()
  }

  onSuccess() {
    this.setState({ isFeedbackActive: false }, () => {
      trackingDebounceSmall({
        event_type: 'click',
        event_description: 'feedback modal closed',
      })
      notification('Feedback submitted successfully', 'success')
    })
    this.intialiseState()
  }

  onFailure() {
    notification('Server error! Please try again later.', 'error')
    this.setState({ isFeedbackActive: false }, () => {
      trackingDebounceSmall({
        event_type: 'click',
        event_description: 'feedback modal closed',
      })
    })
    this.intialiseState()
  }

  onFeedbackClose() {
    this.setState({ isFeedbackActive: false }, () => {
      trackingDebounceSmall({
        event_type: 'click',
        event_description: 'feedback modal closed',
      })
    })
    this.intialiseState()
  }

  tasksOnFeedbackMount = () => {
    this.props.pauseVideo()
  }

  intialiseState() {
    let temp = demoQues.map((item, index) => {
      item.answer = ''
      item.comment = ''
      item.error = { status: false, msg: null }
      return item
    })

    this.setState({ questions: temp })
  }

  updateParent = modifiedItem => {
    let temp = this.state.questions.map((item, index) => {
      if (modifiedItem.question_id === item.question_id) {
        return modifiedItem
      } else {
        return item
      }
    })

    this.setState({ questions: temp })
  }

  submitFeedback() {
    let temp = this.state.questions.map((item, index) => {
      if (item.config.mandatory && item.answer === '') {
        item.error.status = true
        item.error.msg = 'This is a mandatory question'
        return item
      } else {
        return item
      }
    })
    this.setState({ questions: temp })

    if (this.isSubmitable()) {
      mutuals.socketTracking({
        event_type: 'click',
        event_description: 'feedback form confirm button clicked',
      })

      updateFeedback(
        JSON.stringify(this.state.questions),
        this.onSuccess,
        this.onFailure
      )
    }
  }

  isSubmitable() {
    let { questions } = this.state
    let goodToSubmit = true
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].config.mandatory && questions[i].answer === '') {
        goodToSubmit = false
        break
      }
    }

    return goodToSubmit
  }

  render() {
    let { tabIndex } = 20

    if (this.state.isFeedbackActive) this.tasksOnFeedbackMount()

    return this.state.isFeedbackActive ? (
      <div className="epModalCover">
        <div className="epModal">
          <Form>
            <button
              tabIndex={tabIndex}
              aria-label="Click to close the pop-up"
              className="epModalClose"
              onClick={this.onFeedbackClose}>
              <span className="ep-icon-close"></span>
            </button>
            <div className="p-4">
              <h1
                ref="label"
                className="font-bold pt-5 pl-3"
                style={{ fontSize: 30 }}>
                VMock Elevator Pitch Feedback
              </h1>
              <label className="para mt-4 pl-3">
                Have a suggestion, faced an issue or liked something? Tell us
                about your experience.
              </label>

              {this.state.questions.map((item, index) => {
                return (
                  <Question
                    key={index}
                    data={item}
                    updateParent={this.updateParent}
                    tabIndex={tabIndex}
                  />
                )
              })}

              <div className="mt-4 pl-3 hintColor">*Mandatory</div>

              <div className="mt-10 text-right">
                <button
                  type="submit"
                  onClick={() => {
                    this.submitFeedback()
                  }}
                  style={{ padding: '10px 40px' }}
                  className="button blueButton"
                  tabIndex={tabIndex}
                  aria-label={`confirm your options`}>
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    ) : (
      <button
        tabIndex={tabIndex}
        aria-label="Click to give feedback about the app"
        className="bluePrimaryTxt"
        style={{ position: 'fixed', top: 80, right: 10 }}
        onClick={() => {
          this.setState({ isFeedbackActive: true })

          mutuals.socketTracking({
            event_type: 'click',
            event_description: 'feedback form openend',
          })
        }}>
        <img src={feedback} style={{ width: 40 }} alt={'feedback'} />
        <span className="font-semibold" aria-hidden={true}>
          Share your feedback!
        </span>
      </button>
    )
  }
}

const mapStateToProps = state => {
  return {
    common: state.commonStuff,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedback)

class Question extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleClick(selectedItem) {
    let temp = JSON.parse(JSON.stringify(this.props.data))

    let modifiedOptions = temp.options.map((item, index) => {
      if (item.label === selectedItem.label) item.selected = true
      else item.selected = false

      return item
    })

    temp.options = modifiedOptions
    temp.answer = selectedItem.label
    this.props.updateParent(temp)
  }

  handleTextArea(event) {
    let text = event.target.value
    let temp = JSON.parse(JSON.stringify(this.props.data))
    temp.comment = text
    this.props.updateParent(temp)
  }

  handleTextAnswer(event) {
    let text = event.target.value
    let temp = JSON.parse(JSON.stringify(this.props.data))
    temp.answer = text
    this.props.updateParent(temp)
  }

  render() {
    let { data, tabIndex } = this.props

    return (
      <div className="feedback-ep mt-6">
        <div
          className="border-left pl-3"
          style={
            data.error.status
              ? { borderLeftColor: common.sectionColor[2] }
              : null
          }>
          <label className="subHead">
            {' '}
            {data.config.mandatory ? '*' : null}
            {data.question}
          </label>

          {data.config.type === 'select' ? (
            <div className="icon-wrap clearfix mt-6">
              {data.options.map((item, index) => {
                return (
                  <button
                    tabIndex={tabIndex}
                    aria-label={`${item.label}. ${
                      data.config.mandatory ? 'this is a mandatory field' : ''
                    }`}
                    key={index}
                    className="float-left feedback-select"
                    onClick={() => {
                      this.handleClick(item)
                    }}>
                    <div className="icon">
                      <div
                        className="ep-icon-underlay"
                        style={
                          item.selected
                            ? {
                                background: item.color,
                              }
                            : null
                        }></div>

                      <span
                        style={{ color: item.color }}
                        className={classNames(`ep-icon-${item.img}`, {
                          'opacity-50': item.selected === false,
                        })}
                      />
                    </div>

                    <p
                      className="mt-2 text-14-med capitalize app-text-font"
                      style={item.selected ? { fontWeight: 'bold' } : null}>
                      {item.label}
                    </p>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mt-6">
              <TextArea
                placeholder="Type here"
                onChange={event => {
                  this.handleTextAnswer(event)
                }}
                tabIndex={tabIndex}
                aria-label={`any other comments or issues faced. ${
                  data.config.mandatory ? 'this is a mandatory field' : ''
                }`}
                rows="1"
                maxlength="2000"
              />
            </div>
          )}

          {data.error.status ? (
            <div className="mt-6 hintColor">
              <span
                className="ep-icon-warning-4-side"
                style={{ color: common.sectionColor[2] }}>
                {' '}
              </span>
              <span>{data.error.msg}</span>
            </div>
          ) : null}
        </div>

        {data.config.suggestion ? (
          <div className="mt-4 pl-3">
            <TextArea
              placeholder="Tell us more"
              onChange={event => {
                this.handleTextArea(event)
              }}
              tabIndex={tabIndex}
              aria-label={`suggestion`}
              rows="1"
              maxlength="2000"
            />
          </div>
        ) : null}
      </div>
    )
  }
}
