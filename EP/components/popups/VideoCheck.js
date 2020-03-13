import React, { Component } from 'react'
import {
  captureUserMediaWithAudio,
  captureUserMedia,
  captureUserMediaAudio,
  mediaPermisssion,
  checkForVideoTracks,
  checkForAudioTracks,
} from './../utilities/AppUtils'
import RecordRTC from 'recordrtc'
import VoiceRecognition from './../interview/VoiceRecognition.js'
import { highContrast, log } from './../../actions/commonActions'
import _ from 'underscore'
import { Media, Player, controls } from 'react-media-player'
import CustomPlayPause from '../utilities/CustomPlayPause'
import CustomMuteUnmute from '../utilities/CustomMuteUnmute'
import { updateChecksDone } from './../../actions/apiActions'

const refresh = process.env.APP_BASE_URL + '/dist/images/icons/refresh-icon.svg'
const speechMic = process.env.APP_BASE_URL + '/dist/images/icons/speech-mic.svg'
const tickGreen = process.env.APP_BASE_URL + '/dist/images/icons/tick-green.svg'
const warning =
  process.env.APP_BASE_URL + '/dist/images/animation/exclamation.svg'

const { SeekBar } = controls
var paths
var visualizer
var mask
var path
var source, context, analyser

var Loader = require('react-loaders').Loader
var classNames = require('classnames')

var recordAudio

class VideoCheck extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      showRecordButton: true,
      voiceStart: false,
      voiceStop: false,
      finalRecognitionStop: false,
      transcript: null,
      processCompleted: false,
      isSpeechDetected: null,
      micPermission: null,
      cameraPermission: null,
      micThresholdMet: null,
      loopEnabled: true,
      audioLoader: true,
      inputsSuccess: false,
      showIntensityBar: false,
      audioData: null,
      cameraTracksError: null,
      micTracksError: null,
    }
    this.compHasUnMounted = null
    this.checkForTranscriptTimer = null
    this.listenTimeout = null
    this.videoStream = null
    this.requestAnimationFrame = null
    this.startSpeechRecognition = this.startSpeechRecognition.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.onVoiceResult = this.onVoiceResult.bind(this)
    this.onError = this.onError.bind(this)
    this.stopVoice = this.stopVoice.bind(this)
    this.initRecorder = this.initRecorder.bind(this)
    this.frameLooper = this.frameLooper.bind(this)
    this.startAudioRecording = this.startAudioRecording.bind(this)
    this.stopAudioRecording = this.stopAudioRecording.bind(this)
  }

  componentDidMount() {
    mediaPermisssion('camera').then(res => {
      if (res.state === 'granted') {
        this.setState({ cameraPermission: true })
        checkForVideoTracks().then(tracksRes => {
          if (tracksRes.status === false)
            this.setState({ cameraTracksError: true })
          else
            captureUserMedia(stream => {
              this.videoStream = stream
              this.refs.videoPlayBack.srcObject = this.videoStream
              this.refs.videoPlayBack.play()
            })
        })
      } else this.setState({ cameraPermission: false })
    })

    mediaPermisssion('microphone').then(res => {
      if (res.state === 'granted') {
        this.setState({ micPermission: true })
        checkForAudioTracks().then(tracksRes => {
          if (tracksRes.status === false)
            this.setState({ micTracksError: true })
        })
      } else this.setState({ micPermission: false })
    })

    this.svgPlayer()
    this.compHasUnMounted = false
  }

  componentWillUnmount() {
    this.setState({ loopEnabled: false })
    cancelAnimationFrame(this.requestAnimationFrame)
    this.compHasUnMounted = true
  }

  startAudioRecording() {
    this.initRecorder()

    recordAudio = RecordRTC(this.audioStream, {
      type: 'audio',
      audioBitsPerSecond: 128000,
    })
    recordAudio.startRecording()
  }

  stopAudioRecording() {
    recordAudio.stopRecording(() => {
      this.setState({ audioData: recordAudio.blob })
    })
  }

  initRecorder = _.once(() => {
    context = new (window.AudioContext || window.webkitAudioContext)()
    analyser = context.createAnalyser()
    source = context.createMediaStreamSource(this.audioStream)
    source.connect(analyser)
    analyser.fftSize = 512

    this.frameLooper()
  })

  svgPlayer() {
    paths = document.getElementsByTagName('path')
    visualizer = document.getElementById('visualizer')
    mask = visualizer.getElementById('mask')
    visualizer.setAttribute('viewBox', '0 0 255 255')
    for (let i = 0; i < 255; i++) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('stroke-dasharray', '4,1')
      mask.appendChild(path)
    }
  }

  frameLooper() {
    this.requestAnimationFrame = window.requestAnimationFrame(this.frameLooper)
    if (this.state.loopEnabled) {
      var frequencyArray = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(frequencyArray)

      let sortedArray = frequencyArray.sort((a, b) => {
        return b - a
      })

      let sum = 0
      for (let i = 0; i < 25; i++) sum = sum + sortedArray[i]

      let avg = sum / 25

      if (avg > 175) {
        this.setState({
          micThresholdMet: true,
          valToGraph: avg,
          valToShow: avg,
        })
      } else {
        this.setState({
          valToGraph: avg,
        })
      }

      for (var i = 0; i < 255; i++) {
        if (paths) {
          paths[i].setAttribute(
            'd',
            'M ' + i + ',255 l 0,-' + this.state.valToGraph
          )
        }
      }
    }
  }

  onVoiceEnd() {
    this.setState({ voiceStart: false, voiceStop: false })
  }

  onEnd() {
    log('%c ON VOICE RECOGINTION END: ', 'background: cyan; color: black', '')
    if (this.state.finalRecognitionStop === false) {
      this.setState({ voiceStart: false }, () => {
        this.setState({ voiceStart: true })
      })
    }
  }

  checkForTranscript() {
    clearTimeout(this.checkForTranscriptTimer)
    this.checkForTranscriptTimer = setTimeout(() => {
      if (this.state.transcript === null) {
        this.stopTasks()
      }
    }, 5000)
  }

  onVoiceResult(args) {
    const finalTranscript = args.finalTranscript
    if (finalTranscript !== ' ') {
      clearTimeout(this.listenTimeout)
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
      this.listenTimeout = setTimeout(() => {
        this.endListening()
      }, 5000)
    }
  }

  endListening() {
    this.stopTasks()

    setTimeout(() => {
      this.shouldSendToNetworkCheck()
    }, 1000)
  }

  stopTasks() {
    this.stopVoice()
    for (var i = 0; i < 255; i++) {
      if (paths) {
        paths[i].setAttribute('d', 'M ' + i + ',255 l 0,-' + 0)
      }
    }

    this.setState(
      {
        processCompleted: true,
        loopEnabled: false,
        micThresholdMet: this.state.micThresholdMet === null ? false : true,
        isSpeechDetected: this.state.transcript === null ? false : true,
      },
      () => {
        this.stopAudioRecording()
      }
    )
  }

  displayIntensityBar = _.once(() => {
    this.setState({ showIntensityBar: true })
  })

  shouldSendToNetworkCheck() {
    if (this.state.isSpeechDetected && this.state.micThresholdMet) {
      setTimeout(() => {
        if (this.compHasUnMounted === false) {
          this.showInputsSuccessBlock()
          this.props.inputsCheckCompleted()
        }
      }, 3000)
      setTimeout(() => {
        if (this.compHasUnMounted === false) {
          // this.props.displayNetworkCheck()
          this.props.gotoBasicDetails()
        }
      }, 6000)
    }
  }

  onError(error) {
    log('%c VOICE RECOGINTION ERROR: ', 'background: cyan; color: black', error)
    //below code to startSpeechRecognition voice recogintion
  }

  stopVoice() {
    this.setState({
      voiceStart: false,
      voiceStop: true,
      finalRecognitionStop: true,
    })
  }

  startSpeechRecognition() {
    if (this.state.micTracksError || this.state.cameraTracksError) return

    this.displayIntensityBar()
    this.checkForTranscript()
    this.setState({
      voiceStop: false,
      finalRecognitionStop: false,
      isSpeechDetected: null,
      voiceStart: true,
      transcript: null,
      showRecordButton: false,
      processCompleted: false,
      micThresholdMet: null,
      loopEnabled: true,
      audioData: null,
    })

    captureUserMediaAudio(audioStream => {
      this.audioStream = audioStream
      this.startAudioRecording()
    })
  }

  showInputsSuccessBlock = () => {
    this.setState({
      inputsSuccess: true,
    })
  }

  render() {
    let { showRecordButton, processCompleted, inputsSuccess } = this.state

    if (inputsSuccess) return this.videoAndAudioSucess()

    return (
      <React.Fragment>
        <div
          className="clearfix relative px-20 m-top-system-check"
          style={{ marginTop: 80 }}>
          <div className="w-3/5 float-left">
            {this.micAllowedOrNot()}
            {this.cameraAllowedOrNot()}
            {this.micErrorLogics()}
            {this.cameraErrorLogics()}
            {this.wordsToSpeakBlock()}
          </div>

          <div className="float-right w-2/5">
            <div className="relative">
              <video className="inputs-check-video" ref="videoPlayBack" muted />
              <div
                className="absolute bg-white p-3"
                style={{
                  bottom: 15,
                  right: 10,
                  left: 10,
                  height: 31,
                }}>
                <div
                  className="blackTextApp whitespace-no-wrap t-area text-left"
                  style={{
                    height: 24,
                    width: '100%',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                  }}>
                  {this.state.transcript}
                </div>
              </div>

              <div
                className={classNames('clearfix')}
                style={{
                  width: 15,
                  height: 230,
                  position: 'absolute',
                  right: '-10%',
                  bottom: 5,
                  borderRadius: 5,
                  background: 'black',
                  opacity: this.state.showIntensityBar ? 1 : 0,
                }}>
                <svg
                  preserveAspectRatio="none"
                  id="visualizer"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <mask id="mask">
                      <g id="maskGroup" />
                    </mask>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%">
                      <stop
                        offset="0%"
                        style={{ stopColor: '#51d923', stopOpacity: 1 }}
                      />
                      <stop
                        offset="50%"
                        style={{ stopColor: '#f1ff0a', stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: '#ff0a0a', stopOpacity: 1 }}
                      />
                      {/* <stop
                        offset="100%"
                        style={{ stopColor: '#050d61', stopOpacity: 1 }}
                      /> */}
                    </linearGradient>
                  </defs>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#gradient)"
                    mask="url(#mask)"
                  />
                </svg>

                <div className="arrow-left micThresholdArrow" />
              </div>
            </div>

            {showRecordButton
              ? this.buttonBlock()
              : processCompleted
              ? this.belowVideoSpeechDetectBlock()
              : this.speakNowBlock()}

            {this.state.voiceStart ? (
              <VoiceRecognition
                onStart={this.start}
                onEnd={this.onEnd}
                onResult={this.onVoiceResult}
                stop={this.state.voiceStop}
                onError={this.onError.bind(this)}
              />
            ) : null}
          </div>
        </div>
      </React.Fragment>
    )
  }

  micAllowedOrNot() {
    let comp = (
      <div className="font-size-s grey-color mt-4">
        Set Microphone permissions to “Allow” for the website from your browser.
      </div>
    )
    if (this.state.micPermission === null || this.state.micPermission)
      return null
    return this.micNotWorkingBlock(comp)
  }

  retryBlock() {
    return (
      <div className="mt-6 paraHead">
        <button
          className="bluePrimaryTxt cursor-pointer"
          onClick={this.startSpeechRecognition}
          tabIndex={this.props.tabIndex}
          aria-label={`retry button click to restart the input check process`}>
          <img
            className="float-left"
            style={{
              width: 16,
            }}
            src={refresh}
            alt={'start voice recognition'}
          />
          <span className="ml-4">Retry</span>
        </button>

        <button
          className="bluePrimaryTxt cursor-pointer"
          style={{ marginLeft: 40 }}
          onClick={() => {
            this.props.inputsCheckCompleted()
            this.props.gotoBasicDetails()
          }}
          tabIndex={this.props.tabIndex}
          aria-label={`skip button click to skip to basic details form`}>
          <span className="ml-6">Skip</span>
        </button>
      </div>
    )
  }

  micErrorLogics() {
    let { processCompleted } = this.state
    let comp1 = (
      <React.Fragment>
        {this.audioProviderBlock()}
        <div className="font-size-s grey-color mt-4">
          Be a little more louder.
        </div>

        {this.retryBlock()}
      </React.Fragment>
    )

    let comp2 = (
      <React.Fragment>
        {this.audioProviderBlock()}

        <div className="font-size-s grey-color mt-4">
          You may try the following:
        </div>

        <div className="font-size-s grey-color mt-4">
          a. Be a little more louder.
        </div>

        <div className="font-size-s grey-color mt-4">
          b. Consider using different earphones if your microphone is not
          working.
        </div>

        {this.retryBlock()}
      </React.Fragment>
    )

    let comp3 = (
      <React.Fragment>
        {this.audioProviderBlock()}
        <div className="font-size-s grey-color mt-4">
          You may try the following:
        </div>
        <div className="font-size-s grey-color mt-4">
          a. Check there is not too much ambient noise or try to be clearer.
        </div>

        <div className="font-size-s grey-color mt-4">
          b. Close any online dictation website if you are using currently.
        </div>

        {this.retryBlock()}
      </React.Fragment>
    )

    let comp4 = (
      <React.Fragment>
        <div className="font-size-s grey-color mt-4">
          You may try the following:
        </div>

        <div className="font-size-s grey-color mt-4">
          a. Set Microphone permission to “Allow” for Chrome
        </div>

        <div className="font-size-s grey-color mt-4">
          b. Try closing any other application/website that is currently using
          microphone”
        </div>
      </React.Fragment>
    )

    if (this.state.micTracksError) {
      return this.micNotWorkingBlock(comp4)
    }

    if (
      this.state.micThresholdMet === false &&
      this.state.isSpeechDetected &&
      processCompleted
    )
      return this.micNotWorkingBlock(comp1)

    if (
      this.state.micThresholdMet === false &&
      this.state.isSpeechDetected === false &&
      processCompleted
    )
      return this.micNotWorkingBlock(comp2)

    if (
      this.state.micThresholdMet &&
      this.state.isSpeechDetected === false &&
      processCompleted
    )
      return this.micNotWorkingBlock(comp3)
  }

  cameraAllowedOrNot() {
    let comp = (
      <div className="font-size-s grey-color mt-4">
        Set Camera permissions to “Allow” for the website from your browser
      </div>
    )

    if (this.state.cameraPermission === null || this.state.cameraPermission)
      return null
    return this.cameraNotWorkingBlock(comp)
  }

  cameraErrorLogics() {
    let comp = (
      <React.Fragment>
        <div className="font-size-s grey-color mt-4">
          You may try the following:
        </div>
        <div className="font-size-s grey-color mt-4">
          a. You may try the following:
        </div>
        <div className="font-size-s grey-color mt-4">
          b. Try closing any other applicaition that is currently using camera
        </div>
      </React.Fragment>
    )

    if (
      this.state.cameraTracksError === null ||
      this.state.cameraTracksError === false
    )
      return null
    return this.cameraNotWorkingBlock(comp)
  }

  belowVideoSpeechDetectBlock() {
    if (this.state.isSpeechDetected)
      return (
        <div className="mt-4 flex justify-center items-center">
          <img src={tickGreen} alt="tick green" />
          <div className="ml-5 font-semibold">Speech Detected</div>
        </div>
      )

    return null
  }

  speakNowBlock() {
    return (
      <div className="mt-4 flex justify-center items-center">
        <div className="relative text-center" style={{ width: 22, height: 22 }}>
          <div
            className="pulsate"
            style={{ background: 'lightgrey', zIndex: 0 }}
          />
          <img src={speechMic} alt="speech mic" />
        </div>

        <div className="font-semibold ml-5">Speak Now</div>
      </div>
    )
  }

  wordsToSpeakBlock() {
    let {
      micPermission,
      cameraPermission,
      cameraTracksError,
      micTracksError,
      isSpeechDetected,
      micThresholdMet,
    } = this.state

    if (
      micPermission &&
      cameraPermission &&
      cameraTracksError === null &&
      micTracksError === null &&
      (isSpeechDetected === null || isSpeechDetected) &&
      (micThresholdMet === null || micThresholdMet)
    )
      return (
        <div className="text-left" style={{ marginTop: 70 }}>
          <div className="">Press start and say</div>
          <div className="mainHead mt-12">Hello everyone!</div>
        </div>
      )
  }

  audioProviderBlock() {
    if (this.state.audioData)
      return (
        <div className="flex mt-4 mb-6">
          <span
            className="relative custom-audio-wrap"
            style={{
              width: 'initial',
              display: 'inline-block',
              borderRadius: '100%',
            }}>
            <Media>
              <div className="media">
                <Player
                  vendor="audio"
                  src={URL.createObjectURL(this.state.audioData)}
                  onPlay={() => {
                    // this.onAudioEvent(
                    //   `shortPause${index}`,
                    //   `short_pause_audio_played_${index + 1}`
                    // )
                  }}
                  onPause={() => {
                    // trackingDebounceSmall({
                    //   event_type: 'click',
                    //   event_description: `short pause audio paused ${index +
                    //     1}`,
                    // })
                  }}
                />

                <nav className="media-controls">
                  <CustomPlayPause
                    tabIndex={this.props.tabIndex}
                    className="ml-2 mr-1"
                    style={{ fontSize: 20, transform: 'translateY(2px)' }}
                    toggleAudio={null}
                  />
                </nav>
              </div>
            </Media>
          </span>
          <span className="ml-4 paraHead mt-3">Audio</span>
        </div>
      )
  }

  micNotWorkingBlock(children) {
    return (
      <div className="mt-6 clearfix text-left">
        <img
          className="float-left"
          style={{ width: 25 }}
          src={warning}
          alt={'warning'}
        />

        <div className="float-left ml-5">
          <div className="mainHead" style={{ fontSize: 20 }}>
            Microphone facing problems
          </div>{' '}
          {children}
        </div>
      </div>
    )
  }

  cameraNotWorkingBlock(children) {
    return (
      <div className="mt-6 clearfix text-left">
        <img
          className="float-left"
          style={{ width: 25 }}
          src={warning}
          alt={'warning'}
        />

        <div className="float-left ml-5">
          <div className="mainHead" style={{ fontSize: 20 }}>
            Camera facing problems
          </div>{' '}
          {children}
        </div>
      </div>
    )
  }

  micWorkingBlock() {
    return (
      <div className="mt-6 clearfix">
        <img
          className="float-left mt-1"
          style={{ width: 25 }}
          src={tickGreen}
          alt={'tick green'}
        />
        <div className="float-left ml-5">
          <div className="mainHead" style={{ fontSize: 20 }}>
            Microphone Working
          </div>
        </div>
      </div>
    )
  }

  buttonBlock() {
    let {
      micPermission,
      cameraPermission,
      micTracksError,
      cameraTracksError,
    } = this.state
    let condition =
      micPermission &&
      cameraPermission &&
      (micTracksError === false || micTracksError === null) &&
      (cameraTracksError === false || cameraTracksError === null)
        ? false
        : true
    return (
      <button
        onClick={this.startSpeechRecognition}
        className={classNames('button blueButton', {
          'opacity-50': condition,
        })}
        disabled={condition}
        style={{ width: '100%', paddingTop: 10, paddingBottom: 10 }}
        tabIndex={this.props.tabIndex}
        aria-label={`Input check start button click to start input check process`}>
        Start
      </button>
    )
  }

  videoAndAudioSucess = props => {
    return (
      <div className="clearfix relative" style={{ marginTop: 100 }}>
        <div className="w-3/5 h-full flex items-center justify-center absolute">
          <div className="">
            <div className="clearfix">
              <img
                className="float-left mt-1"
                style={{ width: 25 }}
                src={tickGreen}
                alt="green tick"
              />
              <div
                className="float-left ml-6 mainHead"
                style={{ fontSize: 20 }}>
                {' '}
                Microphone Working
              </div>
            </div>

            <div className="clearfix mt-10">
              <img
                className="float-left mt-1"
                style={{ width: 25 }}
                src={tickGreen}
                alt="green tick"
              />
              <div
                className="float-left ml-6 mainHead"
                style={{ fontSize: 20 }}>
                {' '}
                Camera Working
              </div>
            </div>
          </div>
        </div>

        <div className="float-right w-2/5 flex items-center justify-center">
          <img
            style={{ height: 210, width: 210 }}
            src={process.env.APP_BASE_URL + '/dist/images/animation/check.png'}
            alt="check"
          />
        </div>
      </div>
    )
  }
}

export default VideoCheck
