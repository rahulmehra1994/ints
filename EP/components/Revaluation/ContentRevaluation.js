import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  submitTranscript,
  fetchTranscript,
  punctDataToStore,
  fetchInterviews,
  fetchGentleAfterRevaluation,
  fetchTotalResult,
} from './../../actions/apiActions'

import {
  mutuals,
  storeOnlyInterviewBasicData,
} from './../../actions/commonActions'

const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

const FocusTrap = require('focus-trap-react')
var unidecode = require('unidecode')
var Loader = require('react-loaders').Loader
var classNames = require('classnames')

class RevaluateContent extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      showButton: true,
      loaderStatus: false,
      disableSubmitButton: false,
      buttonTxt: 'Re-evaluate Interview',
      transcriptDataArrived: false,
      interviewKeysArrived: false,
      audioLoader: false,
    }
    this.recalltranscriptCounter = 0
    this.modalToggler = this.modalToggler.bind(this)
    this.onTranscriptSaveSuccess = this.onTranscriptSaveSuccess.bind(this)
    this.onTranscriptSaveFail = this.onTranscriptSaveFail.bind(this)
    this.onFetchTranscriptSuccess = this.onFetchTranscriptSuccess.bind(this)
    this.enableDisableButton = this.enableDisableButton.bind(this)
    this.resetForTranscriptApiCall = this.resetForTranscriptApiCall.bind(this)
    this.onFetchInterviewsSuccess = this.onFetchInterviewsSuccess.bind(this)
    this.fetchApiCounter = 0
    this.canRecallFetch = true
  }

  onTranscriptSaveSuccess() {
    fetchTranscript(this.onFetchTranscriptSuccess, this.onTranscriptSaveFail)
    fetchInterviews(this.onFetchInterviewsSuccess, this.onTranscriptSaveFail)
  }

  recallTranscript() {
    setTimeout(() => {
      this.onTranscriptSaveSuccess()
    }, 1000)
  }

  onFetchTranscriptSuccess(data) {
    if (data.status === 'processing' && this.recalltranscriptCounter < 20) {
      this.recalltranscriptCounter++
      this.recallTranscript()
      return
    }

    storeOnlyInterviewBasicData()
    punctDataToStore(data)
    this.setState({ transcriptDataArrived: true }, () => {
      this.proceedFurther()
    })
    //call gentle data after success of trancript api which contains punctuator data
    if (this.props.statuses.post_gentle_praat === 'success') {
      fetchGentleAfterRevaluation()
      fetchTotalResult()
    }
  }

  onFetchInterviewsSuccess() {
    this.setState({ interviewKeysArrived: true }, () => {
      this.proceedFurther()
    })
  }

  showSuccessTxt() {
    this.setState({ buttonTxt: 'Success!' })
    setTimeout(() => {
      this.recalltranscriptCounter = 0
      this.setState(
        {
          loaderStatus: false,
          buttonTxt: 'Re-evaluate Interview',
          transcriptDataArrived: false,
          interviewKeysArrived: false,
        },
        () => {
          this.closeParent()
        }
      )
    }, 1000)
  }

  proceedFurther() {
    if (this.state.transcriptDataArrived && this.state.interviewKeysArrived) {
      this.showSuccessTxt()
    }
  }

  closeParent = () => {
    mutuals.socketTracking({
      event_type: 'click',
      event_description: 'First revaluation popup closed',
    })
    if (this.showLoader() || this.state.loaderStatus) return
    this.setState({
      showButton: true,
      disableSubmitButton: true,
    })
  }

  modalToggler() {
    trackingDebounceSmall({
      event_type: 'click',
      event_description: this.state.showButton
        ? 'EP revaluation modal opened'
        : 'EP revaluation modal closed',
    })

    if (this.showLoader() || this.state.loaderStatus) return
    this.setState({
      showButton: !this.state.showButton,
      disableSubmitButton: true,
    })
  }

  modalOpener() {
    trackingDebounceSmall({
      event_type: 'click',
      event_description: 'EP revaluation modal opened',
    })
    if (this.showLoader() || this.state.loaderStatus) return
    this.setState({
      showButton: false,
      disableSubmitButton: true,
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.reValuationStatus === 'processing' &&
      this.fetchApiCounter < 4
    ) {
      if (this.canRecallFetch === true) {
        this.canRecallFetch = false
        fetchTranscript(this.resetForTranscriptApiCall)
      }
    } else {
      this.canRecallFetch = true
      this.fetchApiCounter = 0
    }
  }

  resetForTranscriptApiCall() {
    this.canRecallFetch = true
    this.fetchApiCounter += 1
  }

  showLoader() {
    if (this.props.reValuationStatus === 'processing') {
      return true
    } else {
      return false
    }
  }

  submit() {
    trackingDebounceSmall({
      event_type: 'click',
      event_description: 'first time revaluation data submitted',
    })

    let txtCopy = this.props.transcriptCleaned.trim()

    this.setState({ loaderStatus: true, buttonTxt: 'Processing...' })
    submitTranscript(
      txtCopy,
      this.onTranscriptSaveSuccess,
      this.onTranscriptSaveFail
    )
  }

  onTranscriptSaveFail() {
    this.setState({ buttonTxt: 'failure!' })
    setTimeout(() => {
      this.recalltranscriptCounter = 0
      this.setState(
        {
          loaderStatus: false,
          buttonTxt: 'Re-evaluate Feedback',
          transcriptDataArrived: false,
          interviewKeysArrived: false,
        },
        () => {
          this.closeParent()
        }
      )
    }, 1000)
  }

  changeToAscciTxt(txt) {
    let asciiTxt = unidecode(txt)
    this.refs.scriptTextArea.value = asciiTxt
  }

  enableDisableButton(e) {
    let txt = e.target.value.trim()
    if (txt === this.props.transcriptCleaned.trim()) {
      this.setState({ disableSubmitButton: true })
    } else {
      this.changeToAscciTxt(e.target.value)
      this.setState({ disableSubmitButton: false })
    }
  }

  render() {
    let {
      isRevaluated,
      transcriptCleaned,
      reValuationStatus,
      tabIndex,
      audioUrl,
      isReevaluationEnabled,
    } = this.props
    let { compLoader } = this.props.common
    let { showButton, disableSubmitButton, loaderStatus } = this.state

    return (
      <>
        <button
          type="button"
          onClick={() => {
            this.submit()
          }}
          className={classNames('button blueButton', {
            'opacity-50': disableSubmitButton,
          })}
          style={{ textTransform: 'initial' }}
          disabled={disableSubmitButton}
          tabIndex="1"
          aria-label={`Click to re-evaluate content strength feedback`}>
          {this.state.buttonTxt}
        </button>

        {reValuationStatus === 'processing' || loaderStatus ? (
          <div className="fullScreenCover" />
        ) : null}
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    common: state.commonStuff,
    transcriptNotCleaned: state.transcript.transcript,
    transcriptCleaned: state.transcript.punctuated_transcript_cleaned,
    isRevaluated: state.transcript.is_already_reevaluated,
    reValuationStatus: state.transcript.status,
    transcriptApiData: state.transcript,
    audioUrl: state.transcript.audio_url_full_interview,
    isReevaluationEnabled: state.transcript.is_reevaluation_enabled,
    statuses: state.statuses,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(RevaluateContent)
