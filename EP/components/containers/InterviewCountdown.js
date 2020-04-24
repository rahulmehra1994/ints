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

class CountdownTimer extends Component {
  constructor(props) {
    super(props)
    this.fullStream = null
    this.state = {
      jazzCount: highContrast ? 20 : 5,
      isCountdownVisible: false,
      tabIndex: common.tabIndexes.interview,
    }
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
          this.jazzCounter()
        }
      )
    }, 300)
  })

  focusFullScreenCenterText = _.once(() => {
    setTimeout(() => {
      this.refs.intStartCounter.focus()
    }, 500)
  })

  jazzCounter() {
    setTimeout(() => {
      if (this.state.jazzCount > 1) {
        this.setState({ jazzCount: --this.state.jazzCount }, () => {
          this.jazzCounter()
        })
      } else {
        this.setState({ isCountdownVisible: false }, () => {
          //show interview component
          this.props.hideDisplayCounter()
        })
      }
    }, 1000)
  }

  render() {
    let { tabIndex, jazzCount, isCountdownVisible } = this.state
    return (
      <React.Fragment>
        <div className="fullscreen-loader">
          <CenterLoading />
        </div>
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
                    aria-label={'Please be ready with your pitch'}>
                    Please be ready with your pitch
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
