import React, { Component } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import {
  getIntResults,
  updateInterviewStatus,
} from './../../actions/interviewActions'
import { setAppUrls } from './../../actions/actions'
import { appIntKey } from './../../actions/resultsActions'
import {
  fetchInterviews,
  newGentle,
  reCallImgVideo,
  fetchTranscript,
  fetchIllustrationData,
  fetchUserSpeechSubtitles,
  fetchImproveArticles,
  intKeyIsValid,
} from './../../actions/apiActions'
import { mutuals, log } from './../../actions/commonActions'
import Interview from './Interview'
import InterviewCountdown from './InterviewCountdown'
import InterviewProcessing from './InterviewProcessing'

class InterviewContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentQues: this.props.questionsArr[0],
      currentIndex: 0,
      showProcessing: false,
      totalSent: 0,
      totalProcessed: 0,
      displayCountdown: true,
      displayInterview: false,
    }
    this.enableCheckingOfConcatResults = false
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    // this.continouslyCheckToMoveToSummary(newProps)
  }

  componentDidMount() {
    log('the question arr => ', this.props.questionsArr)
  }

  questionCompleted = () => {
    if (this.state.currentIndex === this.props.questionsArr.length - 1) {
      this.enableInterviewProcessing()
    } else {
      this.takeNextQuestion()
    }
  }

  takeNextQuestion() {
    let index = this.state.currentIndex + 1
    this.setState({
      currentIndex: index,
      currentQues: this.props.questionsArr[index],
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

  questionSkipped = () => {}

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
    getIntResults()
    this.enableCheckingOfConcatResults = true
    log('interview container state => ', this.state)
  }

  render() {
    let { currentQues } = this.state

    if (this.state.showProcessing)
      return (
        <InterviewProcessing
          totalSent={this.state.totalSent}
          totalProcessed={this.state.totalProcessed}
          showProcessing={this.state.showProcessing}
        />
      )

    if (this.state.displayCountdown)
      return <InterviewCountdown hideDisplayCounter={this.hideDisplayCounter} />

    if (this.state.displayInterview)
      return (
        <Interview
          {...this.props}
          currentQuestion={currentQues}
          currentIndex={this.state.currentIndex}
          questionCompleted={this.questionCompleted}
          questionSkipped={this.questionSkipped}
          interviewEnded={this.interviewEnded}
          updateTotalVideoClipsUpload={this.updateTotalVideoClipsUpload}
          updateTotalProcessedVideoClipsUpload={
            this.updateTotalProcessedVideoClipsUpload
          }
        />
      )

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
