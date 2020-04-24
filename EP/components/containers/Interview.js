import React, { Component } from 'react'
import VoiceRecognition from './../interview/VoiceRecognition'
import ProcessingJazz from './../videoJazz/ProcessingJazz'
import _ from 'underscore'
import { connect } from 'react-redux'
import {
  captureUserMediaWithAudio,
  captureUserMedia,
  captureUserMediaAudio,
  pad,
} from './../utilities/AppUtils'
import {
  gentleResults,
  punctuatorResults,
  concatenateResults,
  appIntKey,
} from './../../actions/resultsActions'
import { initializeEpResults, setAppUrls } from './../../actions/actions'
import {
  counters,
  apiCallAgain,
  fetchFacePointsImg,
  fetchUserfacePoints,
} from './../../actions/apiActions'
import {
  startInterviewApi,
  checkAppearance,
  saveAudioAPI,
  processresults,
  getIntResults,
  sendNoOfVideoClips,
  uploadVideoAPI,
  submitTranscriptApi,
} from './../../actions/interviewActions'
import {
  highContrast,
  log,
  mutuals,
  common,
} from './../../actions/commonActions'
import { notify } from '@vmockinc/dashboard/services/helpers'
import CenterLoading from './../CenterLoading/index'

const clock = process.env.APP_BASE_URL + '/dist/images/ic-timer-black-24-px.svg'
const interviewerImage = process.env.APP_BASE_URL + '/dist/images/group-3.svg'

var classNames = require('classnames')
var fullStream = ''
var audioStream = ''

let storageQueue = []
let allClipsQueue = []
let countOfParallelUpload = 0

class Interview extends Component {
  constructor(props) {
    super(props)

    let temp = () => {
      return props.questionData.question_id !== -1
        ? props.questionData.question_content
        : 'Please tell me something about yourself'
    }

    this.state = {
      recordAudio: null,
      src: null,
      time: this.props.epCustomizations.interview_duration,
      interviewEnded: null,
      voiceStart: false,
      voiceStop: false,
      transcript: null,
      totalsent: 0,
      totalprocessed: 0,
      audioSaved: false, //true when audio is saved
      transcriptSaved: false, //true when transcript is saved
      curr_id: 0,
      showProcessing: false,
      cancelsaveinterview: false,
      shouldMount: false,
      interviewKey: this.props.interviewKey,
      finalRecognitionStop: false,
      tabIndex: common.tabIndexes.interview,
      instructions: temp(),
      ariaLabel: temp(),
      dynamicFontSize: null,
      limitOfParallelUpload: 2,
      enableParallelUploadTweeking: false,
    }

    this.chunkDuration = 5000
    this.intTimePeriod = 0
    this.totalTime = this.props.epCustomizations.interview_duration
    this.audioRecorder = null
    this.mediaRecorder = null
    this.recordedBlobs = []
    this.recordedBlobsAudio = []
    this.startInterview = this.startInterview.bind(this)
    this.requestUserMedia = this.requestUserMedia.bind(this)
    this.handleBlob = this.handleBlob.bind(this)
    this.beginRecording = this.beginRecording.bind(this)
    this.recordChunk = this.recordChunk.bind(this)
    this.stopRecord = this.stopRecord.bind(this)
    this.onVoiceEnd = this.onVoiceEnd.bind(this)
    this.onVoiceResult = this.onVoiceResult.bind(this)
    this.stopVoice = this.stopVoice.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.onUploadVideoSuccess = this.onUploadVideoSuccess.bind(this)
    this.onSaveAudioAPISuccess = this.onSaveAudioAPISuccess.bind(this)
    this.intCreated = this.intCreated.bind(this)
    this.saveTranscript = this.saveTranscript.bind(this)
    this.onSuccessTranscript = this.onSuccessTranscript.bind(this)
    this.checkAllIntDataSentSuccessfully = this.checkAllIntDataSentSuccessfully.bind(
      this
    )
    this.onUploadVideoFailure = this.onUploadVideoFailure.bind(this)
    this.setAppIntKey()
  }

  componentWillUnmount() {
    this.releaseCameraAndAudioStream()
    mutuals.removeTimers()
  }

  releaseCameraAndAudioStream() {
    fullStream.getTracks().forEach(track => track.stop())
    audioStream.getTracks().forEach(track => track.stop())
  }

  componentDidMount() {
    this.adminsFunctionalityActivation()
    this.getAllStreams()
    mutuals.changeInactivityTime(mutuals.largeInactivityTime)
    mutuals.setupTimers()
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['interview'],
      event_type: 'mount',
    })

    this.initRun()
  }

  static getDerivedStateFromProps(newProps, state) {
    // if (
    //   newProps.currentQuestion.question_id !==
    //   this.props.currentQuestion.question_id
    // ) {
    //   let currentQuestion = mutuals.deepCopy(newProps.currentQuestion)
    //   this.setState({
    //     instructions: currentQuestion.question_content,
    //     ariaLabel: currentQuestion.question_content,
    //     currentQuestion,
    //   })
    // }
  }

  adminsFunctionalityActivation() {
    if (this.props.epCustomizations.user_type === 'admin')
      this.setState({ enableParallelUploadTweeking: true })
  }

  getAllStreams() {
    captureUserMediaAudio(stream => {
      audioStream = stream
    })

    captureUserMediaWithAudio(stream => {
      fullStream = stream
      this.setState({ src: stream })
      this.initializeMediaRecorder()
    })
  }

  initializeStore() {
    //intialize store data
    this.props.setConcatenateResults({})
    this.props.setPunctuatorResults({})
    this.props.setGentleResults({})
    this.props.initializeEpResults()
  }

  initRun() {
    this.initializeStore()

    if (this.props.finalCalibrationId !== -1) {
      let data = {
        clip_id: this.props.finalCalibrationId,
        interview_duration: this.props.currentQuestion.question_duration,
      }

      startInterviewApi(data, this.intCreated)
    }
  }

  intCreated() {
    checkAppearance()
    this.readyToStartInt()
    fetchFacePointsImg()
    fetchUserfacePoints()
  }

  readyToStartInt() {
    this.requestUserMedia()
  }

  onVoiceEnd() {
    this.setState({ voiceStart: false, voiceStop: false })
  }

  onVoiceResult(args) {
    const finalTranscript = args.finalTranscript
    if (finalTranscript !== ' ') {
      log(
        '%c Transcript ' + finalTranscript,
        'background: orange; color: white',
        ''
      )

      if (this.state.transcript) {
        this.setState({ transcript: this.state.transcript + finalTranscript })
      } else {
        this.setState({ transcript: finalTranscript })
      }

      log(
        '%c Transcript from onVoiceResult: ' + this.state.transcript,
        'background: yellow; color: black',
        ''
      )
    }
  }

  onError(error) {
    log('%c VOICE RECOGINTION ERROR: ', 'background: cyan; color: black', error)
    //below code to restart voice recogintion
  }

  onEnd() {
    log('%c ON VOICE RECOGINTION END: ', 'background: cyan; color: black', '')
    if (this.state.finalRecognitionStop === false) {
      this.setState({ voiceStart: false }, () => {
        this.setState({ voiceStart: true })
      })
    }
  }

  stopVoice() {
    this.setState({ voiceStop: true, finalRecognitionStop: true })
  }

  setAppIntKey() {
    let intKey = this.props.interviewKey
    this.props.setAppIntKey(intKey)
    setAppUrls('/' + intKey)
  }

  requestUserMedia = () => {
    try {
      this.startInterview()
    } catch (e) {
      console.error('Error in getting stream from request user media', e)
    }
  }

  showPopup(callback) {
    notify(
      'Video recording library is not working properly. Please try again.',
      'error',
      {
        layout: 'center',
        timeout: 4000,
        callback: {
          onClose: () => {
            callback()
          },
        },
      }
    )
  }

  sendClip = (id, blob) => {
    log('In ​sendClip function blob => ', blob)
    if (
      (_.isNull(blob) || _.isUndefined(blob)) &&
      this.state.interviewEnded === false
    ) {
      this.showPopup(() => {
        this.props.history.push(this.props.appUrls.calibration)
      })
      return
    }

    let params = {
      clip: blob,
      id: id,
      interview_key: this.state.interviewKey,
      question_id: this.props.currentQuestion.question_id,
    }
    uploadVideoAPI(params, this.onUploadVideoSuccess, this.onUploadVideoFailure)
  }

  onUploadVideoFailure(
    id,
    blob,
    interviewKey,
    onUploadVideoSuccess,
    onFailure,
    xhr
  ) {
    apiCallAgain(
      counters.sendClip,
      id,
      () => {
        uploadVideoAPI(id, blob, interviewKey, onUploadVideoSuccess, onFailure)
      },
      2000,
      10,
      xhr
    )

    log('%c Api faliure /processclip', 'background: red; color: white', xhr)
  }

  onUploadVideoSuccess(id) {
    this.checkParallelUpload(id)
    let totalprocessed = this.state.totalprocessed + 1
    this.state.totalprocessed = totalprocessed
    if (this.state.totalsent === totalprocessed && this.state.interviewEnded) {
      this.updateClipCounts()
      this.checkAllIntDataSentSuccessfully()
    }

    log('Total Sent Clips after success of api call', '', this.state.totalsent)
    log('Total Processed Clips after success of api call', '', totalprocessed)
  }

  storeClip = (id, blob) => {
    let storageItem = { id, blob, status: '' }
    log('totalsent before api call', this.state.totalsent)
    log('totalprocessed before api call', this.state.totalprocessed)
    this.incrementRecordedClipsCount()
    storageQueue.push(storageItem)
    allClipsQueue.push(storageItem)
    this.checkStorageQueueIsNotEmpty()
  }

  incrementRecordedClipsCount() {
    this.setState({ totalsent: this.state.totalsent + 1 }, () => {
      if (this.state.interviewEnded) this.updateClipCounts()
    })
  }

  checkStorageQueueIsNotEmpty() {
    if (storageQueue.length > 0) {
      this.eachRecordedClip()
    }
  }

  eachRecordedClip() {
    if (countOfParallelUpload < this.state.limitOfParallelUpload) {
      countOfParallelUpload += 1
      let firstObj = storageQueue.shift()
      this.sendClip(firstObj.id, firstObj.blob)
    }
  }

  updateClipCounts() {
    let data = {
      total_clips: this.state.totalsent,
      duration_interview: this.intTimePeriod,
      question_id: this.props.currentQuestion.question_id,
    }
    sendNoOfVideoClips(data)
    log('all video clips =>', allClipsQueue)
  }

  checkParallelUpload(id) {
    countOfParallelUpload -= 1
    this.checkStorageQueueIsNotEmpty()
    allClipsQueue.forEach((item, index) => {
      if (item.id === id) item.status = 'success'
    })
  }

  checkAllIntDataSentSuccessfully() {
    if (
      this.state.audioSaved === true &&
      this.state.transcriptSaved === true &&
      this.state.totalsent === this.state.totalprocessed &&
      this.state.interviewEnded
    ) {
      let params = {
        interview_key: this.state.interviewKey,
        question_id: this.props.currentQuestion.question_id,
        duration_interview: this.intTimePeriod,
      }

      processresults(this.props, params)
    }
  }

  saveTranscript = () => {
    let transcript =
      this.state.transcript === null ? null : this.state.transcript.trim()

    let params = {
      transcript: transcript,
      interview_key: this.state.interviewKey,
      question_id: this.props.currentQuestion.question_id,
      is_original: 1,
    }

    submitTranscriptApi(params, this.onSuccessTranscript)
  }

  onSuccessTranscript() {
    this.setState({ transcriptSaved: true }, () => {
      this.checkAllIntDataSentSuccessfully()
    })
  }

  getAudio = () => {
    this.stopToRecordAudio(blob => {
      this.saveAudio(blob)
    })
  }

  saveAudio(audioBlob) {
    let params = {
      audio: audioBlob,
      interview_key: this.state.interviewKey,
      question_id: this.props.currentQuestion.question_id,
    }

    saveAudioAPI(params, this.onSaveAudioAPISuccess)
  }

  onSaveAudioAPISuccess() {
    this.setState(
      {
        audioSaved: true,
      },
      () => {
        this.checkAllIntDataSentSuccessfully()
      }
    )
    this.releaseCameraAndAudioStream()
  }

  startInterview() {
    this.beginRecording()
    var timer = setInterval(() => {
      if (this.state.interviewEnded) {
        clearInterval(timer)
      } else {
        let time = this.state.time - 1
        if (time <= 0) {
          if (this.state.interviewEnded === false) this.endInterview()
          clearInterval(timer)
        }
        log(
          '%cInterview time',
          'background: green; color: white',
          this.totalTime - this.state.time
        )
        this.setState({ time: time })
        if (this.state.interviewEnded === false) {
          if (this.refs.timeremaining)
            this.refs.timeremaining.innerHTML =
              pad(Math.floor(time / 60), 2) + ' : ' + pad(time % 60, 2)
        }
      }
    }, 1000)
  }

  initializeMediaRecorder() {
    var options = {
      mimeType: 'video/webm',
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
    }

    try {
      this.mediaRecorder = new MediaRecorder(fullStream, options)
    } catch (e) {
      console.error(`Exception while creating MediaRecorder: ${e}`)
      alert(
        `Exception while creating MediaRecorder: ${e}. mimeType: ${options.mimeType}`
      )
      return
    }

    this.mediaRecorder.onstop = event => {
      this.handleStop(event)
    }
    this.mediaRecorder.ondataavailable = event => {
      this.handleDataAvailable(event)
    }
  }

  handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data)
    }
  }

  handleStop(event) {
    log('Recorder stopped: ', '', event)
  }

  stopToRecord(callback) {
    this.mediaRecorder.stop()
    // When the stop() method is invoked, the UA queues a task that runs the following steps:
    // If MediaRecorder.state is "inactive", raise a DOM InvalidState error and terminate these steps. If the MediaRecorder.state is not "inactive", continue on to the next step.
    // Set the MediaRecorder.state to "inactive" and stop capturing media.
    // Raise a dataavailable event containing the Blob of data that has been gathered.
    // Raise a stop event.

    if (this.state.interviewEnded === false) {
      this.mediaRecorder.start()
    }

    setTimeout(() => {
      const superBlob = new Blob(this.recordedBlobs, {
        type: 'video/webm',
      })

      this.recordedBlobs.length = 0
      callback(superBlob)
      return superBlob
    }, 100)
  }

  startToRecordAudio() {
    var options = {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 128000,
    }

    try {
      this.audioRecorder = new MediaRecorder(audioStream, options)
    } catch (e) {
      console.error(`Exception while creating audioRecorder: ${e}`)
      alert(
        `Exception while creating audioRecorder: ${e}. mimeType: ${options.mimeType}`
      )
      return
    }

    this.audioRecorder.onstop = event => {
      this.handleStopAudio(event)
    }
    this.audioRecorder.ondataavailable = event => {
      this.handleDataAvailableAudio(event)
    }
    this.audioRecorder.start() // this what starts the audio recording
  }

  handleDataAvailableAudio(event) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobsAudio.push(event.data)
    }
  }

  handleStopAudio(event) {
    log('Audio Recorder stopped: ', '', event)
  }

  stopToRecordAudio(callback) {
    this.audioRecorder.stop()
    // When the stop() method is invoked, the UA queues a task that runs the following steps:
    // If MediaRecorder.state is "inactive", raise a DOM InvalidState error and terminate these steps. If the MediaRecorder.state is not "inactive", continue on to the next step.
    // Set the MediaRecorder.state to "inactive" and stop capturing media.
    // Raise a dataavailable event containing the Blob of data that has been gathered.
    // Raise a stop event.
    setTimeout(() => {
      const superBlob = new Blob(this.recordedBlobsAudio, {
        type: 'audio/webm',
      })

      this.recordedBlobsAudio.length = 0
      callback(superBlob)
    }, 100)
  }

  beginRecording() {
    this.setState({ interviewEnded: false, voiceStart: true })
    this.mediaRecorder.start() //started recording video with audio
    this.startToRecordAudio() //started recording audio only
    this.videoPlaybackOnScreen()
    this.recordChunk(0)
  }

  recordChunk(id) {
    setTimeout(() => {
      if (this.state.interviewEnded === false) {
        this.recordChunk(id + 1)
        this.handleBlob(id)
        this.setState({ curr_id: id + 1 })
      }
    }, this.chunkDuration)
  }

  handleBlob(id) {
    this.stopToRecord(blob => {
      if (blob.size === 0) console.error('blob of size zero and id is' + id)

      log('blob in handleBlob of id => ' + id, blob)
      this.storeClip(id, blob)
    })
  }

  videoPlaybackOnScreen() {
    let playPromise
    try {
      this.setState({ shouldMount: true }, () => {
        this.refs.interviewVideo.srcObject = this.state.src
        playPromise = this.refs.interviewVideo.play()
      })

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            log(
              '%c Video playback started without issue in Interview',
              'background: green; color: white',
              ''
            )
          })
          .catch(error => {
            log(
              'Video playback failed in interview',
              'background: red; color: white',
              error
            )
          })
      }
    } catch (e) {
      log('Error', e)
    }
  }

  stopRecord() {
    this.setState({ interviewEnded: true }, () => {
      this.handleBlob(this.state.curr_id)
    })

    this.getAudio()
  }

  endInterview = () => {
    getIntResults()

    mutuals.socketTracking({
      event_type: 'click',
      event_description: 'stop interview button',
    })

    mutuals.socketTracking({
      curr_page: '/start-processing',
      event_type: 'click',
    })

    localStorage.setItem('interviewDuration', this.totalTime - this.state.time)
    this.intTimePeriod = this.totalTime - this.state.time

    let instruction = `${
      this.props.userInfo
        ? `Thank you ${this.props.userInfo.firstName} ${this.props.userInfo.lastName}. We will provide your feedback in a moment.`
        : 'We will provide your feedback in a moment.'
    }`

    let ariaLabel =
      instruction +
      ' please do not close the tab before the interview is uploaded. we will automatically redirect to interview summary page'

    this.setState(
      { showProcessing: true, instructions: instruction, ariaLabel: ariaLabel },
      () => {
        setTimeout(() => {
          this.refs.thankYouContainer.focus()
        }, 500)
      }
    )

    this.stopRecord()
    this.stopVoice()

    setTimeout(() => {
      if (this.state.cancelsaveinterview === false) {
        this.setState({ cancelsaveinterview: true }, () => {
          this.saveTranscript()
        })
      }
    }, 2500)
  }

  fitFontSize = _.once(() => {
    if (
      this.state.instructions.length > 0 &&
      this.state.instructions.length <= 50
    ) {
      this.setState({ dynamicfontSize: 36 })
    }

    if (
      this.state.instructions.length > 50 &&
      this.state.instructions.length <= 100
    ) {
      this.setState({ dynamicfontSize: 32 })
    }

    if (
      this.state.instructions.length > 100 &&
      this.state.instructions.length <= 150
    ) {
      this.setState({ dynamicfontSize: 28 })
    }

    if (
      this.state.instructions.length > 150 &&
      this.state.instructions.length <= 200
    ) {
      this.setState({ dynamicfontSize: 24 })
    }

    if (
      this.state.instructions.length > 200 &&
      this.state.instructions.length <= 250
    ) {
      this.setState({ dynamicfontSize: 23 })
    }

    if (
      this.state.instructions.length > 250 &&
      this.state.instructions.length <= 300
    ) {
      this.setState({ dynamicfontSize: 21 })
    }

    if (this.state.instructions.length > 300) {
      this.setState({ dynamicfontSize: 20 })
    }
  })

  render() {
    let { tabIndex, instructions, ariaLabel } = this.state

    if (this.state.shouldMount) {
      return (
        <div>
          <div id="interviewPage">
            <div id="interview-body">
              <div id="interview-box">
                {!this.state.showProcessing ? (
                  <div className="interviewer">
                    <video
                      id="interview-video"
                      ref="interviewVideo"
                      muted
                      type="video/webm"
                    />
                    <div
                      className="interviewer-container-old"
                      style={{ backgroundImage: `url(${interviewerImage})` }}
                    />
                    <div className="clock">
                      <div
                        id="clock-logo"
                        style={{ backgroundImage: `url(${clock})` }}
                      />

                      <div id="time">
                        <div id="time-remaining" ref="timeremaining" />
                      </div>
                    </div>

                    <div className="ints">
                      <div
                        id="question-container"
                        tabIndex={tabIndex}
                        aria-label={ariaLabel}
                        style={{ fontSize: this.state.dynamicfontSize }}>
                        {instructions}
                      </div>
                      {this.fitFontSize()}

                      <button
                        type="button"
                        className="b1"
                        onClick={this.endInterview}
                        id="start-of-content"
                        tabIndex={tabIndex}
                        aria-label={`Click here to stop the interview`}>
                        <div
                          className={classNames({
                            accessiblityRedBg: highContrast,
                            [`redBg`]: !highContrast,
                          })}>
                          Stop
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <h1
                    className="thankYouContainer"
                    ref="thankYouContainer"
                    tabIndex={tabIndex}
                    aria-label={ariaLabel}>
                    {instructions}
                  </h1>
                )}

                <div
                  className={classNames({
                    hidden: !this.state.showProcessing,
                  })}>
                  <ProcessingJazz
                    animState={this.state.showProcessing}
                    status="pending"
                    noOfVideoSent={this.state.totalsent}
                    noOfVideoProcessed={this.state.totalprocessed}
                    tabIndex={tabIndex}
                  />
                </div>
              </div>
            </div>

            {this.state.voiceStart && (
              <VoiceRecognition
                onStart={this.start}
                onEnd={this.onEnd}
                onResult={this.onVoiceResult}
                stop={this.state.voiceStop}
                onError={this.onError.bind(this)}
              />
            )}

            {this.ParallelUploadBlock()}
          </div>
        </div>
      )
    }

    return (
      <div className="fullscreen-loader">
        <CenterLoading />
      </div>
    )
  }

  ParallelUploadBlock() {
    return this.state.enableParallelUploadTweeking ? (
      <div
        className="fixed pin-b pin-l bg-yellow"
        style={{ height: 100, width: 250, zIndex: 10000 }}>
        Current Upload Limit =>
        <select
          value={this.state.limitOfParallelUpload}
          onChange={e => {
            this.setState({ limitOfParallelUpload: e.target.value })
          }}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="25">25</option>
        </select>
      </div>
    ) : null
  }
}

const mapStateToProps = state => {
  return {
    userInfo: !_.isEmpty(state.user.data) ? state.user.data : null,
    concatResults: state.concatenateResults,
    finalCalibrationId: state.calibration.finalCalibrationId,
    questionData: state.userInfoEP.questionData,
    epCustomizations: state.epCustomizations,
    appUrls: state.appUrls,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPunctuatorResults: data => {
      dispatch(punctuatorResults(data))
    },
    setConcatenateResults: results => {
      dispatch(concatenateResults(results))
    },
    setGentleResults: data => {
      dispatch(gentleResults(data))
    },
    initializeEpResults: () => {
      dispatch(initializeEpResults())
    },
    setAppIntKey: key => {
      dispatch(appIntKey(key))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Interview)
