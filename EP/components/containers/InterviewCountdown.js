import React, { Component } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { appIntKey } from './../../actions/resultsActions'
import {
  highContrast,
  log,
  mutuals,
  common,
} from './../../actions/commonActions'
import CenterLoading from './../CenterLoading/index'
import { OverlayMask } from './../../images/svg-files/CalibOverlayMask'
import {
  captureUserMediaWithAudio,
  captureUserMedia,
  captureUserMediaAudio,
  pad,
} from './../utilities/AppUtils'
;('')
// const COUNTDOWN_TIME = highContrast ? 20 : 5
const COUNTDOWN_TIME = 10

class CountdownTimer extends Component {
  constructor(props) {
    super(props)
    this.fullStream = null
    this.state = {
      jazzCount: COUNTDOWN_TIME,
      isCountdownVisible: false,
      tabIndex: common.tabIndexes.interview,
    }
    this.countdownSetInterval = null
  }

  componentDidMount() {
    this.getAllStreams()
  }

  getAllStreams() {
    captureUserMediaWithAudio(stream => {
      this.fullStream = stream
      this.refs.videoTrailer.srcObject = this.fullStream
      this.refs.videoTrailer.play()
      this.showCountdown()
    })
  }

  componentWillUnmount() {
    this.releaseCameraAndAudioStream()
    this.clearCountdownSetInterval()
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.resetCountdown !== newProps.resetCountdown &&
      newProps.resetCountdown
    ) {
      this.setState({ jazzCount: COUNTDOWN_TIME }, () => {
        this.startCounter()
      })
    }

    if (
      this.props.pauseCountdown !== newProps.pauseCountdown &&
      newProps.pauseCountdown
    ) {
      this.clearCountdownSetInterval()
    }
  }

  clearCountdownSetInterval() {
    clearInterval(this.countdownSetInterval)
  }

  releaseCameraAndAudioStream() {
    this.fullStream.getTracks().forEach(track => track.stop())
  }

  showCountdown = _.once(() => {
    setTimeout(() => {
      this.setState(
        {
          isCountdownVisible: true,
        },
        () => {
          this.focusFullScreenCenterText()
          this.startCounter()
        }
      )
    }, 300)
  })

  focusFullScreenCenterText = _.once(() => {
    setTimeout(() => {
      this.refs.intStartCounter.focus()
    }, 500)
  })

  startCounter() {
    this.countdownSetInterval = setInterval(() => {
      if (this.state.jazzCount > 1) {
        this.setState({ jazzCount: --this.state.jazzCount })
      } else {
        this.setState({ isCountdownVisible: false }, () => {
          //show interview component
          // this.props.hideDisplayCounter()
        })
      }
      log('countdown timer still running')
    }, 1000)
  }

  render() {
    let { tabIndex, jazzCount, isCountdownVisible } = this.state
    return (
      <div
        className="video-trail-wrap"
        style={{ opacity: isCountdownVisible ? 1 : 0 }}>
        <video ref="videoTrailer" muted />
        <div className="overlay-mask">
          <OverlayMask className="calibTransparent" />
          <div
            ref="intStartCounter"
            className="intStartCounter"
            tabIndex={tabIndex}>
            <h1
              className="text-18-demi"
              style={{ marginTop: 200 }}
              aria-label={'Please be ready with your pitch'}>
              Recording starts in
            </h1>

            <h1 className="counter" aria-live={jazzCount}>
              <span>{jazzCount}</span>
            </h1>
          </div>
          {this.props.children()}
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CountdownTimer)
