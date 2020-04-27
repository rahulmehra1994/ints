import React, { Component } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { getIntResults } from './../../actions/interviewActions'
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
import { mutuals } from './../../actions/commonActions'
import Interview from './Interview'
import InterviewCountdown from './InterviewCountdown'

class InterviewContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentQues: this.props.questionsArr[0],
      currentIndex: 0,
      displayCountdown: true,
      showProcessing: false,
    }
  }

  componentDidMount() {}

  questionCompleted = suppliedIndex => {}

  questionSkipped = () => {}

  interviewEnded = () => {}

  hideDisplayCounter = () => {
    this.setState({ displayCountdown: false })
  }

  enableInterviewProcessingModule = () => {
    this.setState({ showProcessing: true })
  }

  updateInterviewProcessingData = (totalSent, totalProcessed) => {
    this.setState({ totalSent, totalProcessed })
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

    return (
      <Interview
        {...this.props}
        currentQuestion={currentQues}
        currentIndex={this.state.currentIndex}
        questionCompleted={this.questionCompleted}
        questionSkipped={this.questionSkipped}
        interviewEnded={this.interviewEnded}
        enableInterviewProcessingModule={
          this.props.enableInterviewProcessingModule
        }
        updateInterviewProcessingData={this.props.updateInterviewProcessingData}
      />
    )
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
