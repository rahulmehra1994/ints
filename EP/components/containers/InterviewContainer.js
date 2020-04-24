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

let questionsArr = [
  {
    question_id: 1,
    order_id: 1,
    question_content: 'Please tell me something about yourself',
    question_duration: 120,
  },
  {
    question_id: 2,
    order_id: 2,
    question_content: 'What is your class ?',
    question_duration: 120,
  },
  {
    question_id: 3,
    order_id: 3,
    question_content: 'Where do you live ?',
    question_duration: 120,
  },
]

class InterviewContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentQues: questionsArr[0],
      currentIndex: 0,
      displayCountdown: true,
    }
  }

  componentDidMount() {}

  questionCompleted = suppliedIndex => {
    let temp = questionsArr.map((item, index) => {
      if (suppliedIndex === this.state.currentIndex) {
        item.status = 'skipped'
      }
      return item
    })

    questionsArr = temp

    this.setState({
      currentQues: questionsArr[suppliedIndex + 1],
      currentIndex: suppliedIndex + 1,
    })
  }

  questionSkipped = () => {}

  interviewEnded = () => {}

  hideDisplayCounter = () => {
    this.setState({ displayCountdown: false })
  }

  render() {
    let { currentQues } = this.state

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
