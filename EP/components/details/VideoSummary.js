import React, { Component } from 'react'
import { log, mutuals, common } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  setVideoType,
  toggleVideoFloating,
  setRegularVideoState,
} from './../../actions/actions'
import { Player, BigPlayButton } from 'video-react'
import VideoReplay from './../utilities/VideoReplay'
import Feedback from './../feedback/Feedback'

var classNames = require('classnames')
var Loader = require('react-loaders').Loader
const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

class VideoSummary extends Component {
  constructor(props) {
    super(props)
    const subtitleActivated = false
    this.state = {
      toggleVideo: true,
      toggleActive: false,
      tabIndex: -1,
      smartVideoHover: true,
      smartPlayerHover: true,
      loader: true,
      thumbHidden: false,
      videoWasPlaying: false,
      subtitleActivated: true,
      subtitleToolTipText: 'Subtitles:ON',
      subtitleActivated: subtitleActivated,
      subtitleToolTipText: subtitleActivated ? 'Subtitles:ON' : 'Subtitles:OFF',
    }

    this.handleStateChange = this.handleStateChange.bind(this)
    this.pauseOnBlur = this.pauseOnBlur.bind(this)
    this.onVideoReplay = this.onVideoReplay.bind(this)
    this.pause = this.pause.bind(this)
    this.play = this.play.bind(this)
    this.loaderFalse = this.loaderFalse.bind(this)
    this.thumbClick = this.thumbClick.bind(this)
    this.playOnFocus = this.playOnFocus.bind(this)
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['videosummary'],
      event_type: 'mount',
    })
    window.addEventListener('blur', this.pauseOnBlur)
    window.addEventListener('focus', this.playOnFocus)
  }

  pauseOnBlur() {
    if (this.refs.normalPlayer) {
      if (this.props.regularVideoState.paused === false) {
        this.setState({ videoWasPlaying: true })
      } else {
        this.setState({ videoWasPlaying: false })
      }
      this.refs.normalPlayer.pause()
    }
  }

  playOnFocus() {
    if (this.refs.normalPlayer && this.state.videoWasPlaying)
      this.refs.normalPlayer.play()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.videoFloating !== this.props.videoFloating) {
      if (nextProps.videoFloating === false && this.refs.normalPlayer) {
        this.playFromFloatingVideoState()
        this.props.toggleVideoFloating(!this.props.videoFloating)
      }
    }

    if (nextProps.videoFloating === true) {
      this.props.toggleVideoFloating(!this.props.videoFloating)
      this.playFromFloatingVideoState()
    }

    this.checkPlayerStateChangedForTracking(nextProps.regularVideoState)
  }

  checkPlayerStateChangedForTracking(regularVideoState) {
    let currState = this.props.regularVideoState
    let nextState = regularVideoState

    if (JSON.stringify(nextState) !== JSON.stringify(currState)) {
      if (nextState.paused !== currState.paused) {
        trackingDebounceSmall({
          event_type: 'click',
          event_description: nextState.paused
            ? 'normal video paused'
            : 'normal video played',
        })
      }

      if (nextState.isFullscreen !== currState.isFullscreen) {
        trackingDebounceSmall({
          event_type: 'click',
          event_description: nextState.isFullscreen
            ? 'normal video fullscreen'
            : 'normal video not fullscreen',
        })
      }

      if (nextState.muted !== currState.muted) {
        trackingDebounceSmall({
          event_type: 'click',
          event_description: nextState.muted
            ? 'video_muted'
            : 'video_not_muted',
        })
      }
    }
  }

  startSettingState = _.once(() => {
    setTimeout(() => {
      if (this.refs.normalPlayer) {
        this.refs.normalPlayer.subscribeToStateChange(this.handleStateChange)
        this.playFromFloatingVideoState()
      }
      mutuals.changeInactivityTime(mutuals.largeInactivityTime)
    }, 1000)
  })

  playFromFloatingVideoState() {
    let floatingVideoState = this.props.floatingVideoState
    if (
      floatingVideoState !== -1 &&
      this.props.regularVideoState.ended === false &&
      this.props.regularVideoState.paused !== true
    ) {
      this.refs.normalPlayer.seek(floatingVideoState.currentTime)
      if (floatingVideoState.paused) {
        this.pause()
        this.setState({ thumbHidden: false })
      } else {
        this.play()
        this.setState({ thumbHidden: true })
      }
    }
  }

  handleStateChange(state, prevState) {
    this.props.setRegularVideoState(state)
    if (prevState.ended !== state.ended && state.ended && state.isFullscreen)
      this.refs.normalPlayer.toggleFullscreen()
  }

  componentWillUnmount() {
    if (this.props.regularVideoState !== -1) {
      if (this.props.regularVideoState.paused === false) {
        this.props.toggleVideoFloating(!this.props.videoFloating)
      }
    }
    mutuals.changeInactivityTime(mutuals.defaultInactivityTime)
    window.removeEventListener('blur', this.pauseOnBlur)
  }

  videoToggler() {
    this.props.setVideoType(!this.props.isVideoNormal)
    if (this.refs.normalPlayer) this.play()

    trackingDebounceSmall({
      event_type: 'click',
      event_description: `informative_video${
        this.props.isVideoNormal ? '_closed' : '_opened'
      }`,
    })
  }

  enableFloatingVideo() {
    this.pause()
    let videoFloating = this.props.videoFloating
    this.props.toggleVideoFloating(!videoFloating)
    if (!videoFloating) {
      this.props.history.push(this.props.appUrls.eyeGaze)
    }

    trackingDebounceSmall({
      event_type: 'click',
      event_description: 'smart player opened',
    })
  }

  play() {
    this.refs.normalPlayer.play()
    this.setState({ thumbHidden: true })
  }

  pause() {
    this.refs.normalPlayer.pause()
  }

  onVideoReplay() {
    this.play()

    trackingDebounceSmall({
      event_type: 'click',
      event_description: 'video replayed',
    })
  }

  loaderFalse() {
    this.setState({ loader: false })
  }

  thumbClick() {
    this.setState({ thumbHidden: true })
    this.play()
  }

  player() {
    let {
      regularVideoState,
      videoSubtitlesSrc,
      subtitlesEnabled,
      userVideoProcessedPath,
      userVideoPath,
      isVideoNormal,
      videoFloating,
    } = this.props
    let { tabIndex, subtitleActivated } = this.state

    let extraVideoControlsStyle = {}
    if (regularVideoState && regularVideoState.isFullscreen) {
      extraVideoControlsStyle = {
        transform: 'scale(1.25)',
        background: 'rgba(255, 255, 255, 0.5)',
        right: 20,
        top: 15,
      }
    }
    return (
      <Player
        aspectRatio={'4:3'}
        ref="normalPlayer"
        src={isVideoNormal ? userVideoProcessedPath : userVideoPath}
        crossOrigin="anonymous">
        {subtitlesEnabled && subtitleActivated && videoSubtitlesSrc !== null ? (
          <track kind="subtitles" default src={videoSubtitlesSrc} />
        ) : null}

        <BigPlayButton position="center" />

        <div className="extra-video-controls" style={extraVideoControlsStyle}>
          <div
            className="float-left relative cursor-pointer"
            tabIndex={tabIndex}
            aria-label={`This is a toggle button. Click here to ${
              videoFloating ? 'open' : 'close'
            } the smart player. Using this you can see the interview while reviewing the detailed feedback`}
            onClick={() => {
              this.enableFloatingVideo()
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') this.enableFloatingVideo()
            }}
            onMouseEnter={() => {
              this.setState({ smartPlayerHover: false })
            }}
            onMouseLeave={() => {
              this.setState({ smartPlayerHover: true })
            }}>
            <div className="p-2 bg-black-transcluent rounded-lg">
              <span className="ep-icon-miniplayer align-text-bottom text-22-normal" />
            </div>
            <div
              className={classNames('tooltip-info-right', {
                hidden: this.state.smartPlayerHover,
              })}
              style={{
                right: 0,
                width: 184,
                zIndex: 10000,
              }}>
              Smart player allows you to watch your interview simultaneously
              while reviewing your detailed feedback.
            </div>
          </div>

          <a
            download
            href={isVideoNormal ? userVideoProcessedPath : userVideoPath}
            className="ml-3 download-video "
            onClick={() => {
              trackingDebounceSmall({
                event_type: 'click',
                event_description: 'video download initiated',
              })
            }}
            onKeyPress={e => {
              if (e.key === 'Enter')
                trackingDebounceSmall({
                  event_type: 'click',
                  event_description: 'video download initiated',
                })
            }}
            tabIndex={this.state.tabIndex}
            aria-label={`download video`}>
            <div className="p-2 bg-black-transcluent rounded-lg">
              <span className="ep-icon-download text-22-normal text-white" />
            </div>
            <div
              className="tooltip-basic-left"
              style={{ marginTop: 8, marginLeft: 6, width: 120 }}>
              Download Video
            </div>
          </a>

          {subtitlesEnabled ? this.subtitlesDiv() : null}
        </div>
      </Player>
    )
  }

  subtitlesDiv() {
    let { videoSubtitlesSrc } = this.props
    let { tabIndex, subtitleActivated, subtitleToolTipText } = this.state
    return (
      <div className="subtitle-icon ml-3">
        {subtitleActivated ? (
          <button
            style={{
              width: 35,
              cursor: videoSubtitlesSrc === null ? 'default' : 'pointer',
            }}
            onClick={() => {
              if (videoSubtitlesSrc === null) return
              this.setState({
                subtitleActivated: false,
                subtitleToolTipText: 'Subtitles:OFF',
              })
            }}
            onKeyPress={e => {
              if (videoSubtitlesSrc === null) return
              if (e.key === 'Enter')
                this.setState({
                  subtitleActivated: false,
                  subtitleToolTipText: 'Subtitles:OFF',
                })
            }}
            tabIndex={tabIndex}
            aria-label={'subtitles icon'}>
            <div className="p-2 bg-black-transcluent rounded-lg">
              <span className="ep-icon-caption-off text-22-normal" />
            </div>
          </button>
        ) : (
          <button
            style={{
              width: 35,
              cursor: videoSubtitlesSrc === null ? 'default' : 'pointer',
            }}
            onClick={() => {
              if (videoSubtitlesSrc === null) return
              this.setState({
                subtitleActivated: true,
                subtitleToolTipText: 'Subtitles:ON',
              })
            }}
            onKeyPress={e => {
              if (videoSubtitlesSrc === null) return
              if (e.key === 'Enter')
                this.setState({
                  subtitleActivated: true,
                  subtitleToolTipText: 'Subtitles:ON',
                })
            }}
            tabIndex={tabIndex}
            aria-label={'subtitles off icon'}>
            <div className="p-2 bg-black-transcluent rounded-lg">
              <span className="ep-icon-caption-on text-22-normal" />
            </div>
          </button>
        )}

        <div
          className="tooltip-basic-left"
          style={{
            width: 120,
            marginTop: 8,
            marginLeft: 6,
          }}>
          {videoSubtitlesSrc === null
            ? 'Preparing subtitles'
            : subtitleToolTipText}
        </div>
      </div>
    )
  }

  render() {
    let {
      videoFloating,
      isVideoNormal,
      userVideoPath,
      userVideoProcessedPath,
      videoProcessThumb,
      videoProcessedThumb,
      videoRes,
      regularVideoState,
      videoSubtitlesSrc,
      subtitlesEnabled,
    } = this.props
    let { tabIndex, subtitleActivated, subtitleToolTipText } = this.state
    let compLoader = this.props.common.compLoader

    return userVideoPath !== null &&
      userVideoProcessedPath !== null &&
      videoRes ? (
      <div
        id="start-of-content"
        role="main"
        className="videosummary clearfix information-content"
        tabIndex={common.tabIndexes.videosummary}
        onKeyPress={e => {
          if (e.key === 'Enter' && tabIndex === -1) {
            this.setState({ tabIndex: common.tabIndexes.videosummary }, () => {
              try {
                document
                  .querySelector('.information-content .onEnterFocusAda')
                  .focus()

                document
                  .getElementsByClassName('video-react-video')[0]
                  .setAttribute('tabindex', 131)
                document
                  .getElementsByClassName('video-react-big-play-button')[0]
                  .setAttribute('tabindex', 131)
              } catch (e) {
                console.error(e)
              }
            })
          }
        }}
        aria-label={`Information section. This section provides details to your performance. ${
          tabIndex === -1 ? 'Select to continue further' : ''
        }`}>
        <div className="clearfix">
          <div className="clearfix float-left">
            <div className="inline-block relative">
              <span className="text-14-600"> Smart Video</span>
              <div
                className={classNames('tooltipInfo', {
                  hidden: this.state.smartVideoHover,
                })}
                style={{ top: 35, width: 182 }}>
                Smart video shows the feedback in line with your interview just
                like it would create impression on your interviewer in
                real-time.
              </div>
            </div>

            <label className="switch ml-6">
              <input ref="check_me" type="checkbox" defaultChecked />
              <span
                className="slider round"
                id="firstFocusComp"
                tabIndex={tabIndex}
                aria-label={`This is a toggle button. Click here to ${
                  isVideoNormal ? 'see' : 'hide'
                } the smart video`}
                onClick={() => {
                  this.videoToggler()
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    this.refs.check_me.checked = !this.refs.check_me.checked
                    this.videoToggler()
                  }
                }}
                onMouseEnter={() => {
                  this.setState({ smartVideoHover: false })
                }}
                onMouseLeave={() => {
                  this.setState({ smartVideoHover: true })
                }}></span>
            </label>
          </div>

          <div className="clearfix float-right"></div>
        </div>

        <div
          className="vs-video-container video-player-wrap mt-6"
          tabIndex={this.state.tabIndex}>
          {this.player()}

          <VideoReplay
            togglingState={regularVideoState.ended}
            onVideoReplay={this.onVideoReplay}
            tabIndex={this.state.tabIndex}
          />

          <div
            className={classNames('absolute pin', {
              hidden: this.state.thumbHidden,
            })}>
            <img
              alt="user video thumbnail"
              src={isVideoNormal ? videoProcessThumb : videoProcessedThumb}
              onLoad={this.loaderFalse}
              className="absolute pin"
            />
            {this.state.loader ? (
              <div className="flex justify-center items-center w-full h-full bg-grey-lighter">
                <Loader
                  type={compLoader.type}
                  active
                  style={{ transform: compLoader.scale }}
                />
              </div>
            ) : (
              <button
                className="absolute player-play-copy"
                onClick={this.thumbClick}
                tabIndex={this.state.tabIndex}>
                <div className="play-triangle relative" style={{ top: -10 }} />
              </button>
            )}
          </div>

          <Feedback tabIndex={tabIndex} pauseVideo={this.pause} />

          {this.startSettingState()}
        </div>
      </div>
    ) : (
      <div className="clearfix loaderWrap">
        <Loader
          type={compLoader.type}
          active
          style={{ transform: compLoader.scale }}
        />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    common: state.commonStuff,
    appIntKey: state.appIntKey.key,
    userVideoPath: _.has(state.epPaths, 'userVideoPath')
      ? state.epPaths.userVideoPath
      : null,
    userVideoProcessedPath: _.has(state.epPaths, 'userVideoProcessedPath')
      ? state.epPaths.userVideoProcessedPath
      : null,

    videoProcessThumb: state.epPaths.userVideoProcessThumb,
    videoProcessedThumb: state.epPaths.userVideoProcessedThumb,
    videoRes: state.convertVideoRes.status,
    isVideoNormal: state.videoInfo.isVideoNormal,
    videoFloating: state.videoInfo.videoFloating,
    regularVideoState: state.videoInfo.regularVideoState,
    floatingVideoState: state.videoInfo.floatingVideoState,
    appUrls: state.appUrls,
    videoSubtitlesSrc: _.has(state.epPaths, 'videoSubtitlesPath')
      ? state.epPaths.videoSubtitlesPath
      : null,
    subtitlesEnabled: _.has(state.epCustomizations, 'user_subtitles_enabled')
      ? state.epCustomizations.user_subtitles_enabled
      : null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setVideoType: val => {
      dispatch(setVideoType(val))
    },
    toggleVideoFloating: val => {
      dispatch(toggleVideoFloating(val))
    },
    setRegularVideoState: val => {
      dispatch(setRegularVideoState(val))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoSummary)
