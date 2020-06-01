import React, { Component } from 'react'
import {
  captureUserMediaWithAudio,
  permissionStatus,
} from './../utilities/AppUtils'
import { connect } from 'react-redux'
import { appIntKey } from './../../actions/resultsActions'
import { setAppUrls, setFinalCalibId } from './../../actions/actions'
import {
  counters,
  apiCallAgain,
  getInterviewStatus2,
  checkUserRegistration,
} from './../../actions/apiActions'
import { mutuals, log, common } from './../../actions/commonActions'
import { calibrationAPIStage1 } from './../../actions/calibrationActions'
import { createInterview2 } from './../../actions/interviewActions'
import CenterLoading from './../CenterLoading/index'
import _ from 'underscore'
import {
  OverlayMask,
  OverlayMaskRed,
  OverlayMaskGreen,
} from './../../images/svg-files/CalibOverlayMask'
import Bowser from 'bowser'
import {
  ErrorExclam,
  SuccessTick,
  AnalyzeAnim,
} from './../../images/svg-files/InstantLoad'
import ReactHtmlParser from 'react-html-parser'
import anime from 'animejs/lib/anime'
import SystemCheck from './../popups/SystemCheck'
import InterviewQuestionsStandalone from './../popups/InterviewQuestionsStandalone'

const leftArrowBlack =
  process.env.APP_BASE_URL + '/dist/images/icons/left-arrow-white.svg'
const calibPositionGuide =
  process.env.APP_BASE_URL + '/dist/images/calib-position-guide.svg'
const calibPostureGuide =
  process.env.APP_BASE_URL + '/dist/images/calib-posture-guide.svg'
const headphones = process.env.APP_BASE_URL + '/dist/images/new/headphones.svg'
const maintainDistance =
  process.env.APP_BASE_URL + '/dist/images/new/maintain-distance.svg'
const lamp = process.env.APP_BASE_URL + '/dist/images/new/lamp.svg'
const microphone = process.env.APP_BASE_URL + '/dist/images/new/microphone.svg'
const backgorundNoise =
  process.env.APP_BASE_URL + '/dist/images/new/minimize-background-noise.svg'
const webcam = process.env.APP_BASE_URL + '/dist/images/new/webcam.svg'
const person = process.env.APP_BASE_URL + '/dist/images/new/person.svg'

const browser = Bowser.getParser(window.navigator.userAgent)
const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

var classNames = require('classnames')
const hasGetUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

const CALIB_CLIPS_REFRESH_NO = 20
class Calibration extends Component {
  constructor(props) {
    super(props)
    this.isUserRegistered = false
    this.mediaRecorder = null
    this.recordedBlobs = []
    this.calicount = 0
    this.state = {
      src: null,
      calibrationSuccess: false,
      stopCalibration: false,
      continueCalibration: false,
      startCalibrationVisible: false,
      superBlob: null,
      permsAlert: false,
      oneTabAlert: null,
      permsMsg: '',
      calibInstructions: 'Important Instructions',
      shouldMount: false,
      opacityOne: true,
      interviewKey: null,
      basicDetailsVisible: false,
      tabIndex: common.tabIndexes.calibration,
      showIntSetup: true,
      fullOverlayVisible: true,
      whiteOverlayVisible: false,
      redOverlayVisible: false,
      greenOverlayVisible: false,
      statusBar1Completed: null,
      statusBar2Completed: null,
      statusBar3Completed: null,
      analyzingAnim: false,
      calibStatusVisible: false,
      continueVisble: true,
      calibStage1SuccessCount: 0,
      systemCheck: false,
      instructionAnimDone: false,
      isSystemCheckOpen: false,
      firstTimeUser: false,
      opacityComebackLoader: true,
      allowOpacityChange: true,
    }

    this.startCalibration = this.startCalibration.bind(this)
    this.requestUserMedia = this.requestUserMedia.bind(this)
    this.handleBlob = this.handleBlob.bind(this)
    this.startRecord = this.startRecord.bind(this)
    this.calibrationStage1 = this.calibrationStage1.bind(this)
    this.calibStage1Success = this.calibStage1Success.bind(this)
    this.initRun = this.initRun.bind(this)
    this.onSuccessOfCreateInt = this.onSuccessOfCreateInt.bind(this)
    this.onSuccessCheckUser = this.onSuccessCheckUser.bind(this)
    this.closePopup = this.closePopup.bind(this)
    this.openPopup = this.openPopup.bind(this)
    this.keepInPosition = this.keepInPosition.bind(this)
    this.onContinue = this.onContinue.bind(this)
    this.changeFirstTimeUserStatusAndClosePopup = this.changeFirstTimeUserStatusAndClosePopup.bind(
      this
    )
  }

  componentWillUnmount() {
    this.releaseCameraAndAudioStream()
    mutuals.removeTimers()
    window.removeEventListener('resize', this.keepInPosition)
  }

  releaseCameraAndAudioStream() {
    window.stream.getTracks().forEach(track => track.stop())
    window.stream2.getTracks().forEach(track => track.stop())
  }

  componentDidMount() {
    if (browser.getBrowserName() !== 'Chrome') return

    mutuals.changeInactivityTime(mutuals.largeInactivityTime)
    mutuals.setupTimers()

    mutuals.socketTracking({
      event_type: 'mount',
      event_description: 'calibraiton page',
      interview_id: -1,
    })

    this.findPermission()

    checkUserRegistration(this.onSuccessCheckUser)

    getInterviewStatus2('calibration').then(result => {
      if (result === 'success') {
        this.setState({ oneTabAlert: false }, () => {
          this.furtherProceed()
        })
      }
      if (result === 'failed') {
        setTimeout(() => {
          this.setState({ oneTabAlert: true })
        }, 2000)
      }
    })
  }

  onSuccessCheckUser() {
    this.isUserRegistered = true
    this.furtherProceed()
  }

  findPermission() {
    permissionStatus().then(res => {
      if (res.status) {
        this.setState({ permsAlert: false })
      } else {
        this.setState({ permsAlert: true, permsMsg: res.msg }, () => {
          alert(res.msg)
        })
      }
    })
  }

  furtherProceed() {
    if (this.state.oneTabAlert === false && this.isUserRegistered) {
      let fd = new FormData()
      if (
        this.props.latestQuestion !== null &&
        this.props.latestQuestion.question_id !== -1 &&
        mutuals.multipleQuesEnabled(this.props)
      )
        fd.append('question_id', this.props.latestQuestion.question_id)
      createInterview2(this.onSuccessOfCreateInt, fd)
    }
  }

  onSuccessOfCreateInt(data) {
    if (data) {
      this.props.setAppIntKey(data.interview_key)
      setAppUrls('/' + data.interview_key)
      this.setState({ interviewKey: data.interview_key }, () => {
        this.initRun()
      })
    }
  }

  startToRecord() {
    var options = { mimeType: 'video/webm;codecs=vp9' }

    try {
      this.mediaRecorder = new MediaRecorder(window.stream, options)
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
    this.mediaRecorder.start()
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
    setTimeout(() => {
      const superBlob = new Blob(this.recordedBlobs, {
        type: 'video/webm',
      })

      this.recordedBlobs.length = 0
      callback(superBlob)
      return superBlob
    }, 200)
  }

  initRun() {
    if (this.state.showIntSetup === false) {
      if (!hasGetUserMedia) {
        alert(
          'Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.'
        )
        return
      }
      this.requestUserMedia()
      this.findPermission()
    }
  }

  requestUserMedia() {
    try {
      this.setState({ shouldMount: true }, () => {
        captureUserMediaWithAudio(stream => {
          this.setState({ src: stream }, () => {
            this.handleSuccess(stream)
            setTimeout(() => {
              this.playVideoOnScreen()
            }, 500)
          })
        })
      })
    } catch (e) {
      console.error('Error in getting stream', e)
    }
  }

  playVideoOnScreen() {
    var playPromise
    this.refs.calibrationVideo.srcObject = this.state.src
    playPromise = this.refs.calibrationVideo.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          log(
            '%c Video playback started without issue in calibration',
            'background: green; color: white',
            ''
          )
          document.querySelector('body').click()
        })
        .catch(error => {
          console.error('Video playback failed in calibration', error)
        })
    }
  }

  isFirstTimeUser2 = _.once(() => {
    let { gender, langCode } = this.props

    if (gender === null && langCode === -1)
      this.setState({
        isSystemCheckOpen: false,
      })
    if (gender === '' && langCode === '') {
      this.setState({
        isSystemCheckOpen: true,
        firstTimeUser: true,
      })
    }
    if (
      (gender === 'male' || gender === 'female' || gender === 'undisclosed') &&
      langCode !== -1 &&
      langCode !== ''
    )
      this.setState({
        isSystemCheckOpen: false,
        firstTimeUser: false,
      })
  })

  changeFirstTimeUserStatusAndClosePopup() {
    this.setState(
      {
        firstTimeUser: false,
      },
      () => {
        this.closePopup()
      }
    )
  }

  closePopup() {
    if (this.state.firstTimeUser) return
    this.setState({
      basicDetailsVisible: false,
      isSystemCheckOpen: false,
    })
  }

  openPopup(type) {
    this.setState({ modalOpenType: type }, () => {
      this.resetAnimation()
      window.removeEventListener('resize', this.keepInPosition)
      this.stopCalibProcess({
        basicDetailsVisible: true,
        isSystemCheckOpen: true,
      })
    })
  }

  excededLimitOfId() {
    window.location.reload(true)
  }

  messages() {
    if (this.state.stopCalibration === null) return
    this.setState({
      analyzingAnim: true,
      whiteOverlayVisible: true,
      redOverlayVisible: false,
      greenOverlayVisible: false,
      statusBar1Completed: true,
      statusBar2Completed: null,
      statusBar3Completed: null,
      calibStatusVisible: true,
      calibInstructions: 'We are analyzing your face',
    })
  }

  calibrationStage1(id) {
    if (id > CALIB_CLIPS_REFRESH_NO) this.excededLimitOfId()
    let { calibrationSuccess, stopCalibration } = this.state

    setTimeout(() => {
      if (calibrationSuccess === true) this.startToRecord()
    }, 700)

    if (calibrationSuccess === true) {
      this.stopAndCallApi(id, 1000)
      return
    }

    setTimeout(() => {
      if (stopCalibration === false) this.messages()
    }, 1500)

    setTimeout(() => {
      if (stopCalibration === false) this.startToRecord()
    }, 2200)

    if (stopCalibration === false) this.stopAndCallApi(id, 2500)
  }

  stopAndCallApi(id, time) {
    setTimeout(() => {
      this.stopToRecord(blob => {
        if (blob.size === 0) {
          this.calibrationStage1(id)
          return
        }
        log('Ajax request initiated for id ' + id, '', '')
        calibrationAPIStage1(
          id + '000' + this.calicount,
          id,
          blob,
          this.calibStage1Success,
          this.calibrationStage1
        )
      })
    }, time)
  }

  calibStage1Success(data, id) {
    let data_res = data['data']
    let clip_id = data['clip_id']
    if (this.state.stopCalibration === false) {
      if (
        data_res[0] === '1' &&
        data_res[1] === '1' &&
        data_res[2] === '1' &&
        this.state.calibStage1SuccessCount <= 1
      ) {
        this.calibSuccess(clip_id, id)
      } else {
        this.calibError(data_res, id)
      }
    }
  }

  calibSuccess(clip_id, id) {
    if (this.state.calibStage1SuccessCount === 0) {
      this.setState(
        {
          calibrationSuccess: true,
          calibInstructions: 'Do not move now',
          whiteOverlayVisible: true,
          statusBar1Completed: true,
          statusBar2Completed: true,
          statusBar3Completed: null,
          analyzingAnim: true,
          calibStage1SuccessCount: this.state.calibStage1SuccessCount + 1,
        },
        () => {
          mutuals.socketTracking({
            event_type: 'app flow',
            event_description: 'Calibration process please hold your position',
            interview_id: -1,
          })
          this.calibrationStage1(id + 1)
        }
      )
      return
    }

    if (this.state.calibStage1SuccessCount === 1) {
      this.setState({
        stopCalibration: true,
        calibInstructions: 'Calibration Successful',
        greenOverlayVisible: true,
        redOverlayVisible: false,
        whiteOverlayVisible: false,
        statusBar1Completed: true,
        statusBar2Completed: true,
        statusBar3Completed: true,
        analyzingAnim: false,
        clip_id: clip_id,
      })

      this.props.setFinalCalibrationId(this.state.clip_id)
      this.reloadIfStillOnCalibration()
      this.checkAndSendToSumm()
      mutuals.socketTracking({
        event_type: 'app flow',
        event_description: 'Calibration successful',
        interview_id: -1,
      })
    }
  }

  calibError(data_res, id) {
    var msg = ''

    if (data_res[0] === '0') msg += 'Face not detected.<br>'
    if (data_res[1] === '0') msg += 'Eyes not detected.<br>'
    if (data_res[3] === '0')
      msg += 'Not enough light. Please move to a brighter place.<br>'
    if (data_res[4] === '0') msg += 'Please bend the screen forward.<br>'
    if (data_res[5] === '0')
      msg += 'You are sitting too far. Please come closer to the screen.<br>'
    if (data_res[5] === '2')
      msg += 'You are sitting too close. Please move away a little.<br>'

    if (this.state.calibStage1SuccessCount === 0) {
      this.setState(
        {
          calibInstructions: msg,
          redOverlayVisible: true,
          whiteOverlayVisible: false,
          statusBar1Completed: false,
          statusBar2Completed: null,
          statusBar3Completed: null,
          analyzingAnim: false,
          calibStage1SuccessCount: 0,
        },
        () => {
          this.calibrationStage1(id + 1)
        }
      )
    }

    if (this.state.calibStage1SuccessCount === 1) {
      this.calicount = 0
      this.setState({
        calibrationSuccess: false,
        calibInstructions: msg,
        redOverlayVisible: true,
        whiteOverlayVisible: false,
        greenOverlayVisible: false,
        statusBar1Completed: false,
        statusBar2Completed: false,
        statusBar3Completed: null,
        analyzingAnim: false,
        calibStage1SuccessCount: 0,
      })
      this.calibrationStage1(id + 1)
    }
  }

  stopTheCalibration() {
    debugger
  }

  reloadIfStillOnCalibration() {
    setTimeout(() => {
      if (window.location.pathname === '/elevator-pitch/calibration') {
        window.location.reload(true)
      }
    }, 7000)
  }

  checkAndSendToSumm() {
    getInterviewStatus2('calibration').then(result => {
      if (result === 'success') {
        this.setState({ oneTabAlert: false })
        localStorage.setItem('cameFromCalibration', 'true')
        this.props.history.push(`/${this.state.interviewKey}/interview`)
      }
      if (result === 'failed') this.setState({ oneTabAlert: true })

      if (result === 'API_FAILED') {
        apiCallAgain(
          counters,
          'interviewStatusCount2',
          () => {
            this.checkAndSendToSumm()
          },
          1000,
          5,
          'xhr'
        )
      }
    })
  }

  handleBlob(id) {
    if (this.state.continueCalibration) {
      this.messages()
      this.calibrationStage1(id)
    }
  }

  handleSuccess(stream) {
    window.stream = stream
  }

  startRecord() {
    captureUserMediaWithAudio(stream => {
      window.stream2 = stream
      this.handleBlob(0)
    })
  }

  onContinue() {
    window.addEventListener('resize', this.keepInPosition)
    this.animation()

    this.setState({
      calibInstructions:
        'Sit straight and align your face in the highlighted region',
      whiteOverlayVisible: true,
      fullOverlayVisible: false,
      startCalibrationVisible: true,
      continueVisble: false,
    })
  }

  startCalibration() {
    mutuals.socketTracking({
      event_type: 'click',
      event_description: 'Calibration started',
      curr_page: '/start-calibration',
      interview_id: -1,
    })

    this.startRecord()
    this.setState({
      stopCalibration: false,
      continueCalibration: true,
      startCalibrationVisible: false,
    })
  }

  disableOpacity = () => {
    if (this.state.allowOpacityChange) {
      this.setState({ allowOpacityChange: false })
      setTimeout(() => {
        this.setState({ opacityOne: false, opacityComebackLoader: false })
      }, 2000)
    }
  }

  refreshPage = () => {
    window.location.reload(true)
  }

  focusFullScreenCenterText = _.once(() => {
    setTimeout(() => {
      // this.refs.ensureProperLighting.focus()
    }, 500)
  })

  keepInPosition() {
    if (!this.refs.calibSidebar) return
    let sidebarWidth = this.refs.calibSidebar.offsetWidth * 0.81 + 65
    document.getElementById('leftGuide').style.left = -sidebarWidth + 'px'
    document.getElementById('rightGuide').style.right = -sidebarWidth + 'px'
  }

  animation() {
    let sidebarWidth = this.refs.calibSidebar.offsetWidth * 0.81 + 65
    anime({
      targets: '#leftGuide',
      left: -sidebarWidth,
      easing: 'cubicBezier(0.44, 0.01, 0.32, 1)',
      duration: 1000,
    })
    anime({
      targets: '#rightGuide',
      right: -sidebarWidth,
      easing: 'cubicBezier(0.44, 0.01, 0.32, 1)',
      duration: 1000,
    })
  }

  calibSetupAnimation = _.once(() => {
    setTimeout(() => {
      anime({
        targets: '#instructionOne',
        opacity: ['0', '1'],
        translateY: [100, 0],
        easing: 'easeOutQuad',
        duration: 800,
        complete: () => {
          setTimeout(() => {
            document.getElementById('instructionOne').style.display = 'none'
            run2()
          }, 1000) // one seconds halt time
        },
      })

      let run2 = () => {
        anime({
          targets: '#start-of-content',
          opacity: ['0', '1'],
          translateY: [320, 0],
          easing: 'easeOutQuad',
          duration: 1500,
          begin: () => {
            document.getElementById('start-of-content').style.display = 'block'
            this.setState({ instructionAnimDone: true })
          },
        })
      }
    }, 300)
  })

  resetAnimation() {
    document.getElementById('leftGuide').style.left = '0px'
    document.getElementById('rightGuide').style.right = '0px'
  }

  backToTipsBlock() {
    return (
      <button
        style={{
          position: 'absolute',
          left: 50,
          top: 20,
        }}
        onClick={this.backToTips}
        tabIndex={this.state.tabIndex}
        aria-label={`back to tips button it takes you to the instructions page`}>
        <img src={leftArrowBlack} alt="left arrow black" />
        <span className="ml-4">Back to tips</span>
      </button>
    )
  }

  backToTips = () => {
    window.removeEventListener('resize', this.keepInPosition)
    this.stopCalibProcess({
      showIntSetup: true,
      opacityOne: true,
      allowOpacityChange: true,
      opacityComebackLoader: true,
    })
  }

  stopCalibProcess(temp) {
    let obj = Object.assign(
      {},
      {
        calibrationSuccess: false,
        continueCalibration: false,
        stopCalibration: null,
        startCalibrationVisible: false,
        superBlob: null,
        calibInstructions: 'Important Instructions',
        basicDetailsVisible: false,
        fullOverlayVisible: true,
        whiteOverlayVisible: false,
        redOverlayVisible: false,
        greenOverlayVisible: false,
        statusBar1Completed: null,
        statusBar2Completed: null,
        statusBar3Completed: null,
        analyzingAnim: false,
        calibStatusVisible: false,
        continueVisble: true,
        calibStage1SuccessCount: 0,
        systemCheck: false,
      },
      temp
    )
    this.setState(obj)
  }

  showCalibModule = () => {
    this.setState({ showIntSetup: false }, () => {
      setTimeout(() => {
        this.initRun()
      }, 500)
    })

    trackingDebounceSmall({
      event_type: 'click',
      event_description: 'Calibration next button clicked',
      interview_id: -1,
    })
  }

  render() {
    let {
      oneTabAlert,
      shouldMount,
      tabIndex,
      showIntSetup,
      stopCalibration,
      statusBar1Completed,
      statusBar2Completed,
      statusBar3Completed,
      calibStatusVisible,
      startCalibrationVisible,
      continueVisble,
    } = this.state

    let stage1Color, stage2Color, stage3Color

    if (statusBar1Completed) stage1Color = '#0075cb'
    if (statusBar1Completed === false) stage1Color = common.sectionColor[2]
    if (statusBar1Completed === null) stage1Color = ''

    if (statusBar2Completed) stage2Color = '#0075cb'
    if (statusBar2Completed === false) stage2Color = common.sectionColor[2]
    if (statusBar2Completed === null) stage2Color = ''

    if (statusBar3Completed) stage3Color = '#0075cb'
    if (statusBar3Completed === false) stage3Color = common.sectionColor[2]
    if (statusBar3Completed === null) stage3Color = ''

    if (stopCalibration === true)
      stage1Color = stage2Color = stage3Color = common.sectionColor[0]

    if (browser.getBrowserName() !== 'Chrome')
      return (
        <div className="fullScreenAlert">
          <div className="text-center">
            <h1>
              Elevator pitch application is currently supported only on Google
              Chrome web browser
            </h1>
          </div>
        </div>
      )

    if (oneTabAlert) {
      return (
        <div className="fullScreenAlert">
          <div className="text-center">
            <h1>
              Please refresh this tab after two minutes! Another Interview is
              open right now.
            </h1>
            <div>
              <button
                onClick={this.refreshPage}
                className="button blueButton mt-6">
                Refresh page
              </button>
            </div>
          </div>
        </div>
      )
    } else if (oneTabAlert === false && shouldMount && showIntSetup === false) {
      this.disableOpacity()
      return (
        <React.Fragment>
          {this.state.opacityComebackLoader ? (
            <div className="fullscreen-loader">
              <CenterLoading />
            </div>
          ) : null}

          <div className={classNames({ opacity0: this.state.opacityOne })}>
            {this.state.permsAlert ? (
              <div className="fullScreenAlert opacity75">
                <h1>{this.state.permsMsg}</h1>
              </div>
            ) : null}

            {this.isFirstTimeUser2()}

            <div id="calibration-body">
              {this.state.isSystemCheckOpen ? (
                <SystemCheck
                  closePopup={this.closePopup}
                  changeFirstTimeUserStatusAndClosePopup={
                    this.changeFirstTimeUserStatusAndClosePopup
                  }
                  gender={this.props.gender}
                  langCode={this.props.langCode}
                  backToTips={this.backToTips}
                  firstTimeUser={this.state.firstTimeUser}
                  tabIndex={tabIndex}
                  onSuccessOfCreateInt={this.onSuccessOfCreateInt}
                  modalOpenType={this.state.modalOpenType}
                />
              ) : null}

              <div ref="calibSidebar" className="calibration-right-images">
                {this.state.basicDetailsVisible ? null : this.backToTipsBlock()}
              </div>

              <div ref="calibBox" id="calibration-box">
                <InterviewQuestionsStandalone
                  tabIndex={tabIndex}
                  openPopup={this.openPopup}
                  firstTimeUser={this.state.firstTimeUser}
                  multipleQuestionEnabled={mutuals.multipleQuesEnabled(
                    this.props
                  )}
                />

                <div className="calibration-video-container">
                  <div
                    tabIndex={tabIndex}
                    className="calibrationMsgsWrap"
                    aria-live={this.state.calibInstructions}>
                    <div
                      ref="calibInstructions"
                      className="calibInstructions subHeadLight">
                      {this.state.greenOverlayVisible ? (
                        <span className="calib-process-visual-cue-img mr-6">
                          <SuccessTick />
                        </span>
                      ) : null}

                      {this.state.analyzingAnim ? (
                        <span className="calib-process-visual-cue-img mr-6">
                          <AnalyzeAnim />
                        </span>
                      ) : null}

                      {this.state.redOverlayVisible ? (
                        <span className="calib-process-visual-cue-img mr-6">
                          <ErrorExclam />
                        </span>
                      ) : null}

                      {ReactHtmlParser(this.state.calibInstructions)}
                    </div>

                    {calibStatusVisible ? (
                      <div className="calib-status">
                        <div
                          className="status-bar"
                          style={{ background: stage1Color }}
                        />
                        <div
                          className="status-bar"
                          style={{ background: stage2Color }}
                        />
                        <div
                          className="status-bar"
                          style={{ background: stage3Color }}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="relative" style={{ minHeight: 368 }}>
                    <video
                      preload="none"
                      className="calibration-video"
                      ref="calibrationVideo"
                      muted
                      type="video/mp4"
                    />
                    <div
                      ref="leftGuide"
                      id="leftGuide"
                      className={classNames(
                        'calib-guide guide-left-offset',
                        {}
                      )}>
                      <img src={calibPostureGuide} alt="calibration posture" />{' '}
                      <div className="mt-4 text-white subHead">
                        Maintain Upright Posture
                      </div>
                    </div>
                    <div
                      ref="rightGuide"
                      id="rightGuide"
                      className={classNames(
                        'calib-guide guide-right-offset',
                        {}
                      )}>
                      <img
                        src={calibPositionGuide}
                        alt="calibration position"
                      />
                      <div className="mt-4 text-white subHead">
                        Ensure Upper-body Visibility
                      </div>
                    </div>
                    {startCalibrationVisible ? (
                      <button
                        tabIndex={tabIndex}
                        aria-label="start calibration button. it starts the process of calibration."
                        onClick={this.startCalibration}
                        className="button blueButton startCalib">
                        Start Calibration
                      </button>
                    ) : null}
                    {continueVisble ? (
                      <button
                        tabIndex={tabIndex}
                        aria-label="continue button it lets you sit straight and align your face in the highlighted region"
                        onClick={this.onContinue}
                        className="button blueButton startCalib">
                        Continue
                      </button>
                    ) : null}
                    {this.state.fullOverlayVisible ? (
                      <div
                        className="absolute pin"
                        style={{ background: 'rgba(0,0,0,0.7)', bottom: 5 }}
                      />
                    ) : null}
                    {this.state.whiteOverlayVisible ? (
                      <OverlayMask className="calibTransparent" />
                    ) : null}
                    {this.state.redOverlayVisible ? (
                      <OverlayMaskRed className="calibTransparent" />
                    ) : null}
                    {this.state.greenOverlayVisible ? (
                      <OverlayMaskGreen className="calibTransparent" />
                    ) : null}
                  </div>
                  <div
                    className="text-center"
                    style={{ width: '100%', bottom: 10 }}>
                    <div className="basicDetailsButt">
                      <div style={{ color: '#444444' }}>
                        {mutuals.multipleQuesEnabled(this.props)
                          ? 'Change your question and basic details'
                          : 'Check your hardware or modify your details'}
                      </div>
                      <button
                        className="mt-3 bold bluePrimaryTxt font-semibold"
                        onClick={this.openPopup}
                        tabIndex={tabIndex}
                        aria-label={
                          mutuals.multipleQuesEnabled(this.props)
                            ? 'Change your question and basic details'
                            : 'Check your hardware or modify your details'
                        }>
                        Setup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    } else if (showIntSetup) {
      this.focusFullScreenCenterText()
      this.calibSetupAnimation()
      return (
        <div className="w-full full-height-without-navbar flex justify-center">
          {this.state.instructionAnimDone ? null : (
            <div
              id="instructionOne"
              className="flex items-center"
              style={{ opacity: 0 }}>
              <h1 className="mainHead">
                Please read the instructions before proceeding
              </h1>
            </div>
          )}

          <div
            id="start-of-content"
            className="clearfix"
            style={{
              marginTop: 40,
              display: this.state.instructionAnimDone ? 'block' : 'none',
            }}
            tabIndex={tabIndex}
            role="main">
            <div className="text-center mb-8">
              <h1 className="mainHead">Important Instructions</h1>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridColumnGap: 25,
              }}>
              <div className="float-left w-1/2" style={{ width: 450 }}>
                <div
                  className="text-center rounded-t-lg "
                  style={{
                    height: 150,
                    backgroundColor: '#233659',
                    paddingTop: 25,
                  }}>
                  <div style={{ height: 72 }}>
                    <img src={webcam} alt="webcam" />
                  </div>
                  <div
                    className="subHead text-white mt-2"
                    style={{ fontSize: 21 }}>
                    Camera Requirements
                  </div>
                </div>

                <div
                  className="rounded-b-lg"
                  style={{ padding: 30, background: 'white' }}>
                  <div className="clearfix">
                    <div className="float-left" style={{ width: '20%' }}>
                      <img alt="maintain distance" src={maintainDistance} />
                    </div>
                    <div className="float-left" style={{ width: '80%' }}>
                      <div className="subHead">Sit at an arm's length</div>
                      <div className="mt-3">
                        Ensure your head and torso are properly visible in the
                        camera during the calibration.
                      </div>
                    </div>
                  </div>

                  <div className="clearfix mt-8">
                    <div className="float-left" style={{ width: '20%' }}>
                      <img alt="person" src={person} />
                    </div>
                    <div className="float-left" style={{ width: '80%' }}>
                      <div className="subHead">No other participant</div>
                      <div className="mt-3">
                        Make sure that only <span className="italic">your</span>{' '}
                        face is in the camera focus, and no one else is around
                        during the interview.
                      </div>
                    </div>
                  </div>

                  <div className="clearfix mt-8">
                    <div className="float-left" style={{ width: '20%' }}>
                      <img alt="Surrounding Illumination" src={lamp} />
                    </div>
                    <div className="float-left" style={{ width: '80%' }}>
                      <div className="subHead">Illumination</div>
                      <div className="mt-3">
                        Ensure room is properly lit for the interview.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="float-left w-1/2" style={{ width: 450 }}>
                <div
                  className="text-center rounded-t-lg "
                  style={{
                    height: 150,
                    backgroundColor: '#233659',
                    paddingTop: 25,
                  }}>
                  <div style={{ height: 72 }}>
                    <img src={microphone} alt="microphone" />
                  </div>
                  <div
                    className="subHead text-white mt-2"
                    style={{ fontSize: 21 }}>
                    Microphone Requirements
                  </div>
                </div>

                <div
                  className="rounded-b-lg"
                  style={{ padding: 30, background: 'white', height: 345 }}>
                  <div className="clearfix">
                    <div className="float-left" style={{ width: '20%' }}>
                      <img alt="headphones" src={headphones} />
                    </div>
                    <div className="float-left" style={{ width: '80%' }}>
                      <div className="subHead">
                        Earphones with mic (Recommended)
                      </div>
                      <div className="mt-3">
                        Please consider using earphones for better speech
                        recognition. Specifically essential for noisy
                        surroundings.
                      </div>
                    </div>
                  </div>

                  <div className="clearfix mt-8">
                    <div className="float-left" style={{ width: '20%' }}>
                      <img
                        alt="minimize background noise"
                        src={backgorundNoise}
                      />
                    </div>
                    <div className="float-left" style={{ width: '80%' }}>
                      <div className="subHead">Minimise background noise</div>
                      <div className="mt-3">
                        Try sitting in a quiet place. Even though minor
                        background noise does not interfere with the feedback,
                        it can decrease the accuracy of the speech recognition
                        systems.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center my-12">
              <button
                onClick={this.showCalibModule}
                className="button blueButton"
                style={{ padding: '10px 100px' }}
                tabIndex={tabIndex}
                aria-label={'next button click to goto calibration page'}>
                Next
              </button>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="fullscreen-loader">
          <CenterLoading />
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    gender: state.userInfoEP['gender'],
    langCode: state.userInfoEP['langCode'],
    latestQuestion: state.userInfoEP['questionData'],
    anotherIntReady: state.anotherIntReady,
    userInfo: state.user.data,
    customizations: state.epCustomizations,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAppIntKey: key => {
      dispatch(appIntKey(key))
    },
    setFinalCalibrationId: id => {
      dispatch(setFinalCalibId(id))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calibration)
