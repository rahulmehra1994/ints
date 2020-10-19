import React, { Component } from 'react'
import VoiceRecognition from './../interview/VoiceRecognition'
import myEnv from './../../myEnv'
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
  throughInterview,
  concatenateResults,
  appIntKey,
} from './../../actions/resultsActions'
import { initializeEpResults, setAppUrls } from './../../actions/actions'
import {
  counters,
  apiCallAgain,
  getInterviewStatus,
  getInterviewStatus2,
  fetchFacePointsImg,
  fetchUserfacePoints,
} from './../../actions/apiActions'
import {
  startInterviewApi,
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
import CenterLoading from './../CenterLoading/index'
import { notify } from '@vmockinc/dashboard/services/helpers'
import { OverlayMask } from './../../images/svg-files/CalibOverlayMask'

const clock =
  process.env.APP_PRODUCT_BASE_URL + '/dist/images/ic-timer-black-24-px.svg'
const interviewerImage =
  process.env.APP_PRODUCT_BASE_URL + '/dist/images/group-3.svg'

var classNames = require('classnames')
var fullStream = ''
var audioStream = ''

const hasGetUserMedia = !!(
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
)

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
      time: this.props.questionData.duration,
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
      oneTabAlert: false,
      shouldMount: false,
      interviewKey: this.props.match.params.interviewKey,
      shouldReallyMount: false,
      jazzCount: highContrast
        ? 20
        : this.props.epCustomizations.parameter_thresholds.prep_duration
            .prep_time,
      finalRecognitionStop: false,
      tabIndex: common.tabIndexes.interview,
      instructions: temp(),
      ariaLabel: temp(),
      isCountdownVisible: false,
      dynamicFontSize: null,
      limitOfParallelUpload: 2,
      enableParallelUploadTweeking: false,
    }

    this.intTimePeriod = 0
    this.totalTime = this.props.questionData.duration
    this.audioRecorder = null
    this.mediaRecorder = null
    this.recordedBlobs = []
    this.recordedBlobsAudio = []
    this.startInterview = this.startInterview.bind(this)
    this.requestUserMedia = this.requestUserMedia.bind(this)
    this.handleBlob = this.handleBlob.bind(this)
    this.beginRecording = this.beginRecording.bind(this)
    this.chunkRecord = this.chunkRecord.bind(this)
    this.stopRecord = this.stopRecord.bind(this)
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
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: 'releaseCameraAndAudioStream called',
    })
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
    this.checkCameFromCalibration()
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
      this.videoTrailer()
      this.initializeMediaRecorder()
    })
  }

  showCountdown = _.once(() => {
    setTimeout(() => {
      this.setState(
        {
          isCountdownVisible: true,
        },
        () => {
          this.focusFullScreenCenterText()
          this.jazzCounter()
        }
      )
    }, 2000)
  })

  videoTrailer = _.once(() => {
    this.refs.videoTrailer.srcObject = fullStream
    this.refs.videoTrailer.play()
  })

  checkCameFromCalibration() {
    if (localStorage.getItem('cameFromCalibration') !== null) {
      if (localStorage.getItem('cameFromCalibration') === 'true') {
        localStorage.setItem('cameFromCalibration', 'false')
        this.checkInterviewStatus()
      } else {
        window.location.href = myEnv.folder + '/calibration'
      }
    } else {
      window.location.href = myEnv.folder + '/calibration'
    }
  }

  checkInterviewStatus() {
    getInterviewStatus2('interview').then(result => {
      if (result === 'success') {
        this.setState({ oneTabAlert: false })
        this.initRun()
      }
      if (result === 'failed') {
        this.setState({ oneTabAlert: true })
        window.location.href = myEnv.folder + '/calibration'
      }
      if (result === 'API_FAILED') {
        apiCallAgain(
          counters,
          'setInterviewStatusCount',
          () => {
            this.checkInterviewStatus()
          },
          1000,
          5,
          'xhr'
        )
      }
    })
  }

  initializeStore() {
    //intialize store data
    this.props.setConcatenateResults({})
    this.props.setPunctuatorResults({})
    this.props.setGentleResults({})
    this.props.throughInterview(false)
    this.props.initializeEpResults()
  }

  initRun() {
    this.initializeStore()

    if (!hasGetUserMedia) {
      alert(
        'Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.'
      )
      return
    }

    if (this.props.finalCalibrationId !== -1) {
      startInterviewApi(this.props.finalCalibrationId, this.intCreated)
    }
  }

  intCreated() {
    this.state.intCreated = true
    fetchFacePointsImg()
    fetchUserfacePoints()
  }

  jazzCounter() {
    setTimeout(() => {
      if (this.state.jazzCount > 1) {
        this.setState({ jazzCount: --this.state.jazzCount }, () => {
          this.jazzCounter()
        })
      } else {
        this.setState({ isCountdownVisible: false }, () => {
          this.readyToStartInt()
        })
      }
    }, 1000)
  }

  readyToStartInt() {
    if (this.state.intCreated) {
      this.setState({ shouldReallyMount: true }, () => {
        this.requestUserMedia()
      })
    } else {
      setTimeout(() => {
        this.readyToStartInt()
      }, 150)
    }
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
    let intKey = this.props.match.params.interviewKey
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
        this.props.history.push('/calibration')
      })
      return
    }

    uploadVideoAPI(
      id,
      blob,
      this.state.interviewKey,
      this.onUploadVideoSuccess,
      this.onUploadVideoFailure
    )
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

    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `Api faliure /processclip of video id ${id}`,
    })

    log('%c Api faliure /processclip', 'background: red; color: white', xhr)
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
    sendNoOfVideoClips(this.state.totalsent, this.intTimePeriod)
    log('all video clips =>', allClipsQueue)
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `total sent clips: ${this.state.totalsent} and interview time: ${this.intTimePeriod}`,
    })
  }

  checkParallelUpload(id) {
    countOfParallelUpload -= 1
    this.checkStorageQueueIsNotEmpty()
    allClipsQueue.forEach((item, index) => {
      if (item.id === id) item.status = 'success'
    })
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

  checkAllIntDataSentSuccessfully() {
    if (
      this.state.audioSaved === true &&
      this.state.transcriptSaved === true &&
      this.state.totalsent === this.state.totalprocessed &&
      this.state.interviewEnded
    ) {
      processresults(this.props, this.intTimePeriod)
      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: `processresults api called int time was: ${this.intTimePeriod}`,
      })
    }
  }

  saveTranscript = () => {
    let transcript =
      this.state.transcript === null ? null : this.state.transcript.trim()
    submitTranscriptApi(transcript, this.onSuccessTranscript)

    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `transcript upload api called transcript: ${JSON.stringify(
        this.state.transcript
      )}`,
    })
  }

  onSuccessTranscript() {
    this.setState({ transcriptSaved: true }, () => {
      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: 'on success of transcript upload api',
      })
      this.checkAllIntDataSentSuccessfully()
    })
  }

  getAudio = () => {
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: 'getAudio method called',
    })
    this.stopToRecordAudio(blob => {
      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: 'Audio blob formed',
      })
      this.saveAudio(blob)
    })
  }

  saveAudio(audioBlob) {
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: 'save audio API called',
    })
    saveAudioAPI(
      { audio: audioBlob, intKey: this.state.interviewKey },
      this.onSaveAudioAPISuccess
    )
  }

  onSaveAudioAPISuccess() {
    this.setState(
      {
        audioSaved: true,
      },
      () => {
        mutuals.socketTracking({
          event_type: 'app flow',
          local_date_time: new Date().getTime(),
          event_description: 'on save audio API upload success',
        })
        this.checkAllIntDataSentSuccessfully()
      }
    )
    this.releaseCameraAndAudioStream()
  }

  startInterview() {
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: 'interview started',
    })
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
    this.audioRecorder.start()
  }

  handleDataAvailableAudio(event) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobsAudio.push(event.data)

      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: `inside handleDataAvailableAudio method with blob size: ${JSON.stringify(
          event.data.size
        )}`,
      })
    }

    console.count('handleDataAvailableAudio')
  }

  handleStopAudio(event) {
    log('Audio Recorder stopped: ', event)
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `inside audio recorder handleStopAudio method`,
    })
  }

  stopToRecordAudio(callback) {
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: 'stopToRecordAudio method called',
    })

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

      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: `recorded audio blobs length: ${JSON.stringify(
          this.recordedBlobsAudio.length
        )}`,
      })

      this.recordedBlobsAudio.length = 0
      callback(superBlob)
    }, 300)
  }

  beginRecording() {
    this.setState({ interviewEnded: false, voiceStart: true })
    this.mediaRecorder.start() //started recording video with audio
    this.startToRecordAudio() //started recording audio only
    this.videoPlaybackOnScreen()
    this.chunkRecord(0)
  }

  chunkRecord(id) {
    setTimeout(() => {
      if (this.state.interviewEnded === false) {
        this.chunkRecord(id + 1)
        this.handleBlob(id)
        this.setState({ curr_id: id + 1 })
      }
    }, 5000)
  }

  handleBlob(id) {
    this.stopToRecord(blob => {
      if (blob.size === 0)
        console.error('blob of size zero and id is' + id, '', '')

      log('blob in handleBlob of id => ' + id, blob, '')
      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: `video ${id} blob size: ${JSON.stringify(
          blob.size
        )}`,
      })
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
            mutuals.socketTracking({
              event_type: 'app flow',
              local_date_time: new Date().getTime(),
              event_description: `Video playback started without issue in Interview`,
            })
          })
          .catch(error => {
            log(
              'Video playback failed in interview',
              'background: red; color: white',
              error
            )
            mutuals.socketTracking({
              event_type: 'app flow',
              local_date_time: new Date().getTime(),
              event_description: `Video playback failed in interview`,
            })
          })
      }
    } catch (e) {
      log('Error', '', e)
      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: `Video playback try catch block`,
      })
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
    }, 5000)
  }

  focusFullScreenCenterText = _.once(() => {
    setTimeout(() => {
      this.refs.intStartCounter.focus()
    }, 500)
  })

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

    if (this.state.oneTabAlert) {
      return (
        <div>
          <div className="fullScreenAlert">
            <h1>Please close this tab! Another Interview is open right now.</h1>
          </div>
        </div>
      )
    } else if (
      this.state.oneTabAlert === false &&
      this.state.shouldMount &&
      this.state.shouldReallyMount
    ) {
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
                        onClick={() => {
                          mutuals.socketTracking({
                            event_type: 'click',
                            event_description: 'stop interview button',
                          })
                          this.endInterview()
                        }}
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
          </div>
        </div>
      )
    } else {
      return this.countdownBlock()
    }
  }

  countdownBlock() {
    let { tabIndex, jazzCount, isCountdownVisible } = this.state
    this.showCountdown()
    return (
      <React.Fragment>
        <div className="fullscreen-loader">
          <CenterLoading />
        </div>

        {this.state.enableParallelUploadTweeking ? (
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
        ) : null}

        <div style={{ opacity: isCountdownVisible ? 1 : 0 }}>
          <div className="video-trail-wrap">
            <div className="hugger">
              <video ref="videoTrailer" muted />
              <div className="overlay-mask">
                <OverlayMask className="calibTransparent" />
                <div
                  ref="intStartCounter"
                  className="intStartCounter"
                  tabIndex={tabIndex}>
                  <h1
                    className="header"
                    style={{ marginTop: 200 }}
                    aria-label={'Please be ready with your answer'}>
                    Please be ready with your answer
                  </h1>

                  <h1 className="counter" aria-live={jazzCount}>
                    {jazzCount}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    userInfo: !_.isEmpty(state.user.data) ? state.user.data : null,
    concatResults: state.concatenateResults,
    finalCalibrationId: state.calibration.finalCalibrationId,
    questionData: state.userInfoEP.questionData,
    epCustomizations: state.epCustomizations,
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
    throughInterview: val => {
      dispatch(throughInterview(val))
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
