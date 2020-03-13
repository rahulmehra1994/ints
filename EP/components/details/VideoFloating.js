import React, { Component } from 'react'
import { log, mutuals, common } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Player, BigPlayButton } from 'video-react'

import {
  setVideoType,
  toggleVideoFloating,
  setFloatingVideoState,
} from './../../actions/actions'
import Resizable from 're-resizable'
import Draggable from 'react-draggable'
import VideoReplay from './../utilities/VideoReplay'

var Loader = require('react-loaders').Loader
var classNames = require('classnames')
const FocusTrap = require('focus-trap-react')

class VideoFloating extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toggleVideo: true,
      toggleActive: false,

      width: 400,
      height: 301,
      innerHeight: window.innerHeight - 90, //40 is the height of top navbar
    }
    this.handleStateChange = this.handleStateChange.bind(this)
    this.pauseOnBlur = this.pauseOnBlur.bind(this)
    this.onVideoReplay = this.onVideoReplay.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  attachEscEvent() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  onKeyDown(e) {
    if (e.key === 'Escape') this.props.toggleVideoFloating(false)
  }

  componentDidMount() {
    window.addEventListener('blur', this.pauseOnBlur)

    mutuals.socketTracking({
      event_type: 'app flow',
      event_description: 'Smart video visible',
    })
    document.querySelector('#videofloatingId').focus()
    this.attachEscEvent()
  }

  pauseOnBlur() {
    if (this.refs.floatingPlayer) this.refs.floatingPlayer.pause()
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.pauseOnBlur)
    document.removeEventListener('keydown', this.onKeyDown)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.videoFloatingPlaying !== this.props.videoFloatingPlaying) {
      if (nextProps.videoFloatingPlaying === false) {
        this.pause()
      }
    }

    if (
      JSON.stringify(nextProps.videoChunksState) !==
      JSON.stringify(this.props.videoChunksState)
    ) {
      if (nextProps.videoChunksState.paused === false) {
        this.pause()
      }
    }
  }

  startSettingState = _.once(() => {
    setTimeout(() => {
      if (this.refs.floatingPlayer) {
        this.refs.floatingPlayer.subscribeToStateChange(this.handleStateChange)
        this.playFromRegularVideoState()
      }
    }, 1000)
  })

  playFromRegularVideoState() {
    let regularVideoState = this.props.regularVideoState
    if (regularVideoState !== -1) {
      this.refs.floatingPlayer.seek(regularVideoState.currentTime)
      if (regularVideoState.paused) {
        this.pause()
      } else {
        this.play()
      }
    }
  }

  handleStateChange(state, prevState) {
    this.props.setFloatingVideoState(state)
    try {
      if (
        (prevState.ended !== state.ended &&
          state.ended &&
          state.isFullscreen) ||
        (prevState.isFullscreen !== state.isFullscreen && state.isFullscreen)
      )
        this.refs.floatingPlayer.toggleFullscreen()
    } catch (e) {
      console.error(e)
    }

    this.videoTracking(state, prevState)
  }

  videoTracking(nextState, currState) {
    if (nextState.paused !== currState.paused) {
      mutuals.socketTracking({
        event_type: 'auto',
        event_description: nextState.paused
          ? 'video floating paused'
          : 'video floating played',
      })
    }

    if (nextState.isFullscreen !== currState.isFullscreen) {
      mutuals.socketTracking({
        event_type: 'auto',
        event_description: nextState.isFullscreen
          ? 'video floating fullscreen'
          : 'video floating not fullscreen',
      })
    }

    if (nextState.muted !== currState.muted) {
      mutuals.socketTracking({
        event_type: 'click',
        event_description: nextState.muted
          ? 'video floating muted'
          : 'video floating muted',
      })
    }
  }

  play() {
    this.refs.floatingPlayer.play()
  }

  pause() {
    this.refs.floatingPlayer.pause()
  }

  onVideoReplay() {
    this.play()

    mutuals.socketTracking({
      event_type: 'click',
      event_description: 'video replayed',
    })
  }

  videoPositionX() {
    if (window.innerWidth > 1440) {
      return window.innerWidth - (this.state.width + (window.innerWidth - 1440))
    } else return window.innerWidth - this.state.width
  }

  render() {
    let compLoader = this.props.common.compLoader
    let { width, height, innerHeight } = this.state

    return this.props.userVideoPath !== null &&
      this.props.userVideoProcessedPath !== null &&
      this.props.videoRes ? (
      <Draggable
        handle=".handle"
        defaultPosition={{
          x: this.videoPositionX(),
          y: innerHeight - (height + 40),
        }}
        bounds={{
          left: 0,
          top: 0,
          right: this.videoPositionX(),
          bottom: innerHeight - (height + 40),
        }}
        grid={[1, 1]}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}>
        <Resizable
          className="resizeable"
          style={{
            transform: `translateX(${-this.state.width}px, ${-this.state
              .height}px)`,
          }}
          enable={{
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          defaultSize={{
            width: width,
            height: height,
          }}
          minWidth={300}
          maxWidth={600}
          lockAspectRatio={true}
          size={{ width: this.state.width, height: this.state.height }}
          onResizeStop={(e, direction, ref, d) => {
            this.setState({
              width: this.state.width + d.width,
              height: this.state.height + d.height,
            })
          }}>
          <div className="handle floatingVideoWrap video-player-wrap">
            <Player
              aspectRatio="4:3"
              ref="floatingPlayer"
              src={
                this.props.isVideoNormal
                  ? this.props.userVideoProcessedPath
                  : this.props.userVideoPath
              }>
              <BigPlayButton position="center" />
            </Player>
            {this.startSettingState()}

            <VideoReplay
              togglingState={this.props.floatingVideoState.ended}
              onVideoReplay={this.onVideoReplay}
            />

            <div
              className="absolute pin-t pin-l pin-r underlay-floating-video-close"
              style={{ height: 55, background: 'rgba(0,0,0, 0.4)' }}>
              <button
                id="videofloatingId"
                className="epModalClose"
                style={{ zIndex: 1000 }}
                onClick={() => {
                  this.props.toggleVideoFloating(!this.props.videoFloating)

                  mutuals.socketTracking({
                    event_type: 'click',
                    event_description: 'smart video close',
                  })
                }}
                tabIndex={common.tabIndexes.videosummary}
                aria-label={'smart video player close button'}>
                <span className="ep-icon-close text-white" />
              </button>
            </div>
          </div>
        </Resizable>
      </Draggable>
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
    videoRes: state.convertVideoRes.status,
    isVideoNormal: state.videoInfo.isVideoNormal,
    videoFloating: state.videoInfo.videoFloating,
    videoFloatingPlaying: state.videoInfo.videoFloatingPlaying,
    regularVideoState: state.videoInfo.regularVideoState,
    floatingVideoState: state.videoInfo.floatingVideoState,
    videoChunksState: state.videoInfo.videoChunksState,
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
    setFloatingVideoState: val => {
      dispatch(setFloatingVideoState(val))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoFloating)
