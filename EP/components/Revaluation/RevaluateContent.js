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
import { mutuals } from './../../actions/commonActions'

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
      disableSubmitButton: true,
      buttonTxt: 'Re-evaluate Feedback',
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

  addEscEvent() {
    document.onkeyup = evt => {
      evt = evt || window.event
      if (evt.keyCode === 27) {
        this.modalClose()
      }
    }
  }

  removeEscEvent() {
    document.onkeyup = null
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
    if (data.status === 'processing' && this.recalltranscriptCounter < 40) {
      this.recalltranscriptCounter++
      this.recallTranscript()
      return
    }
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
          buttonTxt: 'Re-evaluate Feedback',
          transcriptDataArrived: false,
          interviewKeysArrived: false,
        },
        () => {
          this.modalClose()
        }
      )
    }, 1000)
  }

  proceedFurther() {
    if (this.state.transcriptDataArrived && this.state.interviewKeysArrived) {
      this.showSuccessTxt()
    }
  }

  modalClose = () => {
    mutuals.socketTracking({
      event_type: 'click',
      event_description: 'EP revaluation modal closed',
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
    this.addEscEvent()
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

  modalClose() {
    this.removeEscEvent()
    trackingDebounceSmall({
      event_type: 'click',
      event_description: 'EP revaluation modal closed',
    })
    if (this.showLoader() || this.state.loaderStatus) return
    this.setState({
      showButton: true,
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
    let txt = this.refs.scriptTextArea.value
    if (this.refs.scriptTextArea.value.trim() === '') {
      alert('Transcript cannot be empty')
      return
    }

    if (this.refs.scriptTextArea.value.trim().length < 3) {
      alert('Transcript cannot be less then 3 characters')
      return
    }

    if (txt === this.props.transcriptCleaned.trim()) {
      alert('Cannot submit the same transcript')
      return
    }

    trackingDebounceSmall({
      event_type: 'click',
      event_description: 'revaluation data submitted',
    })

    this.setState({ loaderStatus: true, buttonTxt: 'Processing...' })
    submitTranscript(
      txt,
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
          this.modalClose()
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
      <div>
        <p className="hintColor">
          Speech Transcript not accurate? Edit it and modify the feedback
        </p>

        <div className="mt-6">
          <button
            className="bluePrimaryTxt font-semibold"
            onClick={() => {
              this.modalOpener()
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                this.modalOpener()
              }
            }}
            tabIndex={tabIndex}
            aria-label={`Do you find speech transcript not accurate. To modify it, click here to re-evaluate feedback`}>
            Edit Transcript
          </button>
        </div>

        {showButton === false ? (
          <FocusTrap>
            <div className="epModalCover">
              <div
                className="revaluateModal epModal relative"
                style={{ width: 646 }}>
                <button
                  className="epModalClose"
                  onClick={() => {
                    this.modalClose()
                  }}
                  tabIndex="1"
                  aria-label={'close edit transcript popup'}>
                  <span className="ep-icon-close"></span>
                </button>

                <div className="epModalContent text-left">
                  <div
                    className="text-24-bold"
                    aria-label={`Please provide accurate transcript of your speech if it is not
                  recorded accurately at some places. We will provide your
                  feedback on content strength. next selection will read your transcript.`}>
                    Edit Transcript
                  </div>

                  <div className="text-18-demi mt-4"> Transcript</div>

                  <div className="mt-2">
                    <textarea
                      ref="scriptTextArea"
                      maxLength="4000"
                      defaultValue={
                        transcriptCleaned.toLowerCase().trim() !== 'null'
                          ? transcriptCleaned
                          : null
                      }
                      placeholder={
                        transcriptCleaned.toLowerCase().trim() === 'null'
                          ? 'No transcript detected'
                          : null
                      }
                      onChange={e => {
                        this.enableDisableButton(e)
                      }}
                      tabIndex={1}
                    />
                    <div className="hintColor text-12-normal">
                      Accuracy improves in noise free surroundings. Use
                      microphone for better quality.
                    </div>
                  </div>

                  <div className="clearfix mt-4">
                    <div className="text-18-demi">Audio</div>
                    <div className="basic-audio mt-2 revaluateAudio relative">
                      <audio
                        tabIndex="1"
                        className="w-full"
                        controls
                        controlsList="nodownload"
                        onPlay={() => {
                          trackingDebounceSmall({
                            event_type: 'click',
                            event_description:
                              'revaluation interview audio played',
                          })
                        }}
                        onPause={() => {
                          trackingDebounceSmall({
                            event_type: 'click',
                            event_description:
                              'revaluation interview audio paused',
                          })
                        }}
                        onCanPlayThrough={() => {
                          this.setState({
                            audioLoader: false,
                          })
                        }}
                        onPlaying={() => {
                          this.setState({ audioLoader: false })
                        }}
                        onWaiting={() => {
                          this.setState({ audioLoader: true })
                        }}>
                        <source src={audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      {this.state.audioLoader ? (
                        <div className="absolute audio-loader-wrap">
                          <Loader type={'ball-clip-rotate'} />
                        </div>
                      ) : null}
                    </div>

                    {isReevaluationEnabled ? (
                      <div className="clearfix mt-10">
                        <span className="float-right">
                          <span
                            className="bluePrimaryTxt mr-16 cursor-pointer"
                            onClick={this.modalClose}
                            onKeyDown={e => {
                              e.key === 'Enter' && this.modalClose()
                            }}
                            tabIndex="1"
                            aria-label={'close edit transcript popup'}>
                            Cancel
                          </span>
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
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {reValuationStatus === 'processing' || loaderStatus ? (
                  <div className="clearfix revaluateLoader" />
                ) : null}
              </div>
            </div>
          </FocusTrap>
        ) : null}
      </div>
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
