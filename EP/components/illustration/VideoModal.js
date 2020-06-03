import React, { Component } from 'react'
import ModalHOC from './../hoc/ModalHOC'
import { Player, BigPlayButton } from 'video-react'
import CenterLoading from './../CenterLoading'
import { mutuals, log } from './../../actions/commonActions'
import _ from 'underscore'

var classNames = require('classnames')

class VideoModal extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      subtitleActivated: true,
      subtitleToolTipText: 'Subtitles:ON',
      illusPlayerState: null,
      hideSkipIntro: false,
    }
    this.skipToTime = 20
    this.modalToggler = this.modalToggler.bind(this)
    this.pauseOnBlur = this.pauseOnBlur.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.playPauseOnSpace = this.playPauseOnSpace.bind(this)
    this.attachEscEvent()
  }

  modalToggler() {
    this.props.videoModalClose()
  }

  attachEscEvent() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  onKeyDown(e) {
    if (e.key === 'Escape') this.modalToggler()
  }

  componentDidMount() {
    window.addEventListener('blur', this.pauseOnBlur)
    setTimeout(() => {
      if (this.refs.illusPlayer)
        this.setState({
          subtitleActivated: false,
          subtitleToolTipText: 'Subtitles:OFF',
        })
    }, 5000)

    this.refs.illusPlayer.subscribeToStateChange(
      this.handleStateChange.bind(this)
    )

    window.addEventListener('keydown', this.playPauseOnSpace)
  }

  playPauseOnSpace(e) {
    if (e.keyCode === 32 && this.state.illusPlayerState.play) {
      this.refs.illusPlayer.pause()
    } else if (e.keyCode === 32 && this.state.illusPlayerState.play === false) {
      this.refs.illusPlayer.play()
    }
  }

  skipIntroHandle = () => {
    this.refs.illusPlayer.seek(20)
    this.hideSkipButtonOnce()
  }

  hideSkipButtonOnce = _.once(() => {
    this.setState({ hideSkipIntro: true })
  })

  checkVideoTimeToHideSkipButton() {
    if (this.state.illusPlayerState.currentTime > this.skipToTime) {
      this.hideSkipButtonOnce()
    }
  }

  handleStateChange(state, prevState) {
    // copy player state to this component's state
    this.setState(
      {
        illusPlayerState: state,
      },
      () => {
        this.checkVideoTimeToHideSkipButton()
      }
    )

    if (prevState.ended !== state.ended && state.ended && state.isFullscreen)
      this.refs.illusPlayer.toggleFullscreen()

    this.videoTracking(state, prevState)
  }

  videoTracking(nextState, currState) {
    if (nextState.paused !== currState.paused) {
      mutuals.socketTracking({
        event_type: 'click',
        event_description: nextState.paused
          ? 'illustration video paused'
          : 'illustration video played',
      })
    }

    if (nextState.isFullscreen !== currState.isFullscreen) {
      mutuals.socketTracking({
        event_type: 'click',
        event_description: nextState.isFullscreen
          ? 'illustration video fullscreen'
          : 'illustration video not fullscreen',
      })
    }

    if (nextState.muted !== currState.muted) {
      mutuals.socketTracking({
        event_type: 'click',
        event_description: nextState.muted
          ? 'illustration video muted'
          : 'illustration video not muted',
      })
    }
  }

  pauseOnBlur() {
    if (this.refs.illusPlayer) this.refs.illusPlayer.pause()
  }

  pause() {
    this.refs.illusPlayer.pause()
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keydown', this.playPauseOnSpace)
    window.removeEventListener('blur', this.pauseOnBlur)
  }

  render() {
    let { videoSrc, videoSubtitlesSrc, tabIndex } = this.props
    let {
      subtitleActivated,
      subtitleToolTipText,
      illusPlayerState,
    } = this.state

    return (
      <div className="epModalCover flex items-center">
        <div className="epModal" style={{ background: 'transparent' }}>
          <div style={{ margin: '0 auto', width: 500 }}>
            <div
              className="relative video-player-wrap"
              tabIndex={tabIndex}
              onKeyDown={e => {
                if (e.keyCode === 32 || e.keyCode === 13) {
                  if (illusPlayerState.paused) this.refs.illusPlayer.play()
                  else this.refs.illusPlayer.pause()
                }
              }}>
              <Player
                playsInline
                aspectratio={'4:3'}
                ref="illusPlayer"
                src={videoSrc}
                autoPlay={true}>
                <BigPlayButton
                  position="center"
                  aria-label={'video play button'}
                />

                {this.state.subtitleActivated ? (
                  <track kind="subtitles" default src={videoSubtitlesSrc} />
                ) : null}

                <div
                  className="extra-video-controls flex items-center"
                  style={{
                    transform:
                      illusPlayerState && illusPlayerState.isFullscreen
                        ? 'scale(1.25)'
                        : 'scale(1)',
                  }}>
                  <div className="subtitle-icon border-r border-white pr-4 opacity-50">
                    {subtitleActivated ? (
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          this.setState({
                            subtitleActivated: false,
                            subtitleToolTipText: 'Subtitles:OFF',
                          })
                        }}
                        onKeyPress={e => {
                          if (e.key === 'Enter')
                            this.setState({
                              subtitleActivated: false,
                              subtitleToolTipText: 'Subtitles:OFF',
                            })
                        }}
                        alt={'subtitles icon'}
                        tabIndex={tabIndex}>
                        <span className="ep-icon-caption-on text-22-normal" />
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          this.setState({
                            subtitleActivated: true,
                            subtitleToolTipText: 'Subtitles:ON',
                          })
                        }}
                        onKeyPress={e => {
                          if (e.key === 'Enter')
                            this.setState({
                              subtitleActivated: true,
                              subtitleToolTipText: 'Subtitles:ON',
                            })
                        }}
                        alt={'subtitles icon'}
                        tabIndex={tabIndex}>
                        <span className="ep-icon-caption-off text-22-normal" />
                      </div>
                    )}

                    <div
                      className="tooltip-basic-left"
                      style={{
                        width: 100,
                        marginTop: 8,
                        marginLeft: 6,
                      }}>
                      {subtitleToolTipText}
                    </div>
                  </div>

                  <button
                    className="text-white text-24-demi pl-4"
                    onClick={this.modalToggler}
                    aria-label={'illustration video popup close button'}
                    tabIndex={tabIndex}>
                    <span className="ep-icon-close"></span>
                  </button>
                </div>

                {this.state.hideSkipIntro ? null : (
                  <div
                    className="text-white border-white border button cursor-pointer text-14-normal absolute"
                    style={{
                      right: 16,
                      bottom: 40,
                      background: 'rgba(0, 0, 0, 0.6)',
                      zIndex: 10,
                    }}
                    onClick={this.skipIntroHandle}>
                    Skip Intro
                  </div>
                )}
              </Player>

              {this.state.illusPlayerState !== null &&
              this.state.illusPlayerState.hasStarted ? null : (
                <div
                  className="hideCover z-50"
                  style={{ bottom: 30, background: 'black' }}>
                  <CenterLoading />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ModalHOC(VideoModal)
