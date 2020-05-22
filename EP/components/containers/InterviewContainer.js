import React, { Component } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import {
  getIntResults,
  skipQuestionsApi,
} from './../../actions/interviewActions'
import { setAppUrls } from './../../actions/actions'
import { appIntKey } from './../../actions/resultsActions'
import { getAllQuestionsResults } from './../../actions/interviewActions'
import {
  fetchFacePointsImg,
  fetchUserfacePoints,
} from './../../actions/apiActions'
import { mutuals, log } from './../../actions/commonActions'
import Interview from './Interview'
import InterviewCountdown from './InterviewCountdown'
import InterviewProcessing from './InterviewProcessing'
import CenterLoading from './../CenterLoading/index'

const interviewerImage =
  process.env.APP_BASE_URL + '/dist/images/interviewer.svg'
class InterviewContainer extends Component {
  constructor(props) {
    super(props)
    let questions = mutuals.deepCopy(this.props.questionsArr)
    this.state = {
      questionsCopy: questions,
      currentQues: questions[0],
      currentIndex: 0,
      showProcessing: false,
      totalSent: 0,
      totalProcessed: 0,
      displayCountdown: true,
      displayInterview: false,
      resetCountdown: false,
      showInterviewer: false,
      fullscreenDisable: false,
      pauseCountdown: false,
    }
    this.enableCheckingOfConcatResults = false
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    // this.continouslyCheckToMoveToSummary(newProps)
  }

  componentDidMount() {
    this.modifyQuestions()
  }

  modifyQuestions() {
    let questions = mutuals.deepCopy(this.state.questionsCopy)
    let temp = questions.map((item, index) => {
      item.skipped = false
      return item
    })
    this.setState({
      questionsCopy: temp,
    })
  }

  interviewProcessingDataFetch() {
    fetchFacePointsImg()
    fetchUserfacePoints()
  }

  questionCompleted = () => {
    if (this.state.currentIndex === this.state.questionsCopy.length - 1) {
      this.enableInterviewProcessing()
    } else {
      this.takeNextQuestion()
    }
  }

  takeNextQuestion() {
    let index = this.state.currentIndex + 1
    this.setState({
      currentIndex: index,
      currentQues: this.state.questionsCopy[index],
      displayCountdown: true,
      displayInterview: false,
    })
  }

  continouslyCheckToMoveToSummary(newProps) {
    if (this.enableCheckingOfConcatResults) {
      let newConcatStatus = newProps.statuses.concatenate
      let oldConcatStatus = this.props.statuses.concatenate

      if (
        newConcatStatus !== oldConcatStatus &&
        newConcatStatus === 'success'
      ) {
        this.props.history.push(`/${this.props.interviewKey}/results/summary`)
      }
    }
  }

  skipQuestion = () => {
    if (this.onTheLastQuestion()) return
    this.setState({ fullscreenDisable: true, pauseCountdown: true })
    this.traverseQuestionsAndMarkSkipped()
  }

  traverseQuestionsAndMarkSkipped() {
    let temp = mutuals.deepCopy(this.state.questions)
    let questions = temp.map((item, index) => {
      if (this.state.currentIndex === index) item.skipped = true
      return item
    })
    this.setState({ questionsCopy: questions }, () => {
      this.callSkipAPI()
    })
  }

  callSkipAPI() {
    let data = {
      question_ids: JSON.stringify([this.state.currentQues.question_id]),
    }
    skipQuestionsApi(data, this.onSkipQuestionSuccess)
  }

  onSkipQuestionSuccess = () => {
    let index = this.state.currentIndex + 1
    this.setState({
      currentIndex: index,
      currentQues: this.state.questionsCopy[index],
      resetCountdown: true,
      fullscreenDisable: false,
      pauseCountdown: false,
    })
  }

  onTheLastQuestion() {
    if (this.state.currentIndex === this.state.questionsCopy.length - 1)
      return true
    else return false
  }

  interviewEnded = () => {}

  hideDisplayCounter = () => {
    this.setState({ displayCountdown: false, displayInterview: true })
  }

  updateTotalVideoClipsUpload = () => {
    this.setState({ totalSent: this.state.totalSent + 1 })
  }

  updateTotalProcessedVideoClipsUpload = () => {
    this.setState({ totalProcessed: this.state.totalProcessed + 1 })
  }

  enableInterviewProcessing() {
    this.setState({ showProcessing: true })
    // getIntResults()

    let data = { question_ids: JSON.stringify(this.getAllUnSkippedQuestions()) }
    getAllQuestionsResults(data)
    this.enableCheckingOfConcatResults = true
    log('interview container state => ', this.state)
  }

  getAllUnSkippedQuestions() {
    let questions = mutuals.deepCopy(this.state.questionsCopy)

    let results = questions.filter((item, index) => {
      return item.skipped === false
    })

    return results
  }

  hideMyFace = () => {
    this.setState({ showInterviewer: !this.state.showInterviewer })
  }

  inteviewerBlock() {
    return this.state.showInterviewer ? (
      <div className="absolute pin" style={{ zIndex: 1000 }}>
        <img className="w-full h-full" src={interviewerImage} />
      </div>
    ) : null
  }

  CountdownBlock() {
    return (
      <React.Fragment>
        {this.state.fullscreenDisable ? (
          <div className="fullscreen-loader bg-black-transcluent">
            <CenterLoading />
          </div>
        ) : null}
        <div className="interview-container">
          <div className="video-stream-panel">
            <InterviewCountdown
              hideDisplayCounter={this.hideDisplayCounter}
              resetCountdown={this.state.resetCountdown}
              pauseCountdown={this.state.pauseCountdown}
            />
          </div>

          <div className="interview-control-panel">
            <section className="relative">
              <div className="mt-4 text-14-demi text-center">
                Question {this.state.currentIndex + 1}
              </div>
              <div className="mt-2 text-24-normal text-center">
                {this.state.currentQues.question_content}
              </div>
              <div className="absolute w-100 pin-b flex justify-center">
                <section>
                  {this.state.questionsCopy.map((item, index) => {
                    if (index <= this.state.currentIndex)
                      return <div className="question-position-cue-visited" />
                    else return <div className="question-position-cue" />
                  })}
                </section>
              </div>
            </section>

            <section className="sticky-int-controls-bar">
              <div />

              <div className="flex justify-around items-center brand-blue-color left-grey-border">
                <div className="flex items-center">
                  <label
                    className="switch"
                    style={{ transform: 'scale(0.55)' }}>
                    <input ref="check_me" type="checkbox" />
                    <span
                      className="slider round"
                      tabIndex={1}
                      aria-label={`This is a toggle button. Click here to hide your face`}
                      onClick={() => {
                        this.hideMyFace()
                      }}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          this.refs.check_me.checked = !this.refs.check_me
                            .checked
                          this.hideMyFace()
                        }
                      }}
                    />
                  </label>

                  <span className="ml-1 text-14-demi">
                    Hide my face during Interview
                  </span>
                </div>

                <button
                  className="flex items-center cursor-pointer"
                  onClick={this.skipQuestion}
                  disabled={this.onTheLastQuestion()}
                  style={{ opacity: this.onTheLastQuestion() ? 0.3 : 1 }}>
                  <span className="ep-icon-forward-outline text-18-med"></span>
                  <span className="ml-2 text-14-demi">Skip Question</span>
                </button>
              </div>

              <div className="flex justify-around items-center brand-blue-color left-grey-border">
                <div className="flex items-center">
                  <span className="ep-icon-finish text-18-med"></span>
                  <span className="ml-2 text-14-demi">Finish Now</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </React.Fragment>
    )
  }
  InterviewBlock() {
    return (
      <div className="interview-container">
        <div className="video-stream-panel">
          <Interview
            {...this.props}
            currentQuestion={this.state.currentQues}
            currentIndex={this.state.currentIndex}
            questionCompleted={this.questionCompleted}
            questionSkipped={this.questionSkipped}
            interviewEnded={this.interviewEnded}
            updateTotalVideoClipsUpload={this.updateTotalVideoClipsUpload}
            updateTotalProcessedVideoClipsUpload={
              this.updateTotalProcessedVideoClipsUpload
            }
            children={this.inteviewerBlock.bind(this)}
          />
        </div>
      </div>
    )
  }

  render() {
    if (this.state.showProcessing)
      return (
        <InterviewProcessing
          totalSent={this.state.totalSent}
          totalProcessed={this.state.totalProcessed}
          showProcessing={this.state.showProcessing}
        />
      )

    if (this.state.displayCountdown) return this.CountdownBlock()

    if (this.state.displayInterview) return this.InterviewBlock()

    return null
  }
}

const mapStateToProps = state => {
  return {
    statuses: state.statuses,
    appUrls: state.appUrls,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAppIntKey: key => {
      dispatch(appIntKey(key))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewContainer)
