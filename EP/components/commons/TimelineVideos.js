import React from 'react'
import $ from 'jquery'
import { highContrast, log, mutuals } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Player, BigPlayButton } from 'video-react'
import { setVideoChunksState } from './../../actions/actions'
import VideoReplay from './../utilities/VideoReplay'
import TimelineChart from './TimelineVideoChart'
import Tabs from './Tabs'

var classNames = require('classnames')
class TimelineVideos extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      toggleVideo: true,
      toggleActive: false,
      isCursorIn: false,
      width: 400,
      height: 300,
      partsCounter: 0,
      videoChunks: [],
      chunkPlaying: false,
      allChunksEnded: false,
      countdown: 3,
      emoji: false,
      position: 0,
      tabsData: [],
      currentKey: null,
    }

    this.handleStateChange = this.handleStateChange.bind(this)
    this.modifyVideoDataEndTime = this.modifyVideoDataEndTime.bind(this)
    this.changeByAnyVal = this.changeByAnyVal.bind(this)
    this.switchTab = this.switchTab.bind(this)
    this.onVideoReplay = this.onVideoReplay.bind(this)
    this.pause = this.pause.bind(this)
  }

  componentDidMount() {
    this.state.controlBar = $('.timeline-video .video-react-control-bar').css({
      display: 'none',
    })

    this.changeDataForTabs()
    this.startSettingState()
  }

  changeDataForTabs() {
    let temp = []
    for (let key in this.props.data) {
      temp.push({ label: key, arr: this.props.data[key] })
    }

    // let all = []
    // temp.forEach((item, index) => {
    //   all.push(...item.arr)
    // })

    // temp.splice(0, 1, { label: 'All', arr: all })

    this.setState({ tabsData: temp })
  }

  modifyVideoDataEndTime = videoState => {
    this.state.videoChunks.map(item => {
      if (item.end_time >= videoState.duration) {
        item.end_time = videoState.duration
        item.end_time_emoji = videoState.duration
        return item
      } else {
        return item
      }
    })
  }

  changeByOne(val) {
    this.hideReplay()
    if (
      (this.state.position === 0 && val === -1) ||
      (this.state.position === this.state.videoChunks.length - 1 && val === 1)
    ) {
      return
    }

    this.setState({ position: this.state.position + val }, () => {
      this.playVideoParts()
    })
  }

  changeByAnyVal(val) {
    this.hideReplay()
    this.setState({ position: val }, () => {
      this.playVideoParts()
    })
  }

  autoPlay() {
    // if (this.rightSideDisablity() === false) {
    //   this.changeByOne(1)
    // }

    this.setState({ showReplay: true })
  }

  mute() {
    this.refs.chunksPlayer.muted = true
  }

  unmute() {
    this.refs.chunksPlayer.muted = false
  }

  play() {
    if (this.refs.chunksPlayer) this.refs.chunksPlayer.play()
  }

  pause() {
    if (this.refs.chunksPlayer) this.refs.chunksPlayer.pause()
  }

  startSettingState = _.once(() => {
    setTimeout(() => {
      if (this.refs.chunksPlayer) {
        this.refs.chunksPlayer.subscribeToStateChange(this.handleStateChange)
        this.reset()
      }
    }, 1000)
  })

  reset() {
    this.setState(
      {
        allChunksEnded: false,
        chunkPlaying: false,
        emoji: false,
      },
      () => {
        this.state.partsCounter = 0
        for (let i = 0; i < this.state.videoChunks.length; i++)
          this.state.videoChunks[i]['played'] = false

        // this.playVideoParts(this.state.partsCounter)
        this.swtichToFirstVideo()
      }
    )
  }

  swtichToFirstVideo() {
    this.pause()
    if (this.state.videoChunks.length > 0)
      this.refs.chunksPlayer.seek(this.state.videoChunks[0].start_time)
  }

  handleStateChange(state, prevState) {
    this.props.setVideoChunksState(state)
  }

  componentWillReceiveProps(nextProps) {
    this.checkPlayerStateChangedForTracking(nextProps.videoChunksState)
  }

  checkPlayerStateChangedForTracking(videoChunksState) {
    let currState = this.props.videoChunksState
    let nextState = videoChunksState

    log('video time ', nextState.currentTime, '')

    if (JSON.stringify(nextState) !== JSON.stringify(currState)) {
      if (nextState.currentTime !== currState.currentTime) {
        for (let i = 0; i < this.state.videoChunks.length; i++) {
          if (
            this.nearTarget(
              nextState.currentTime,
              this.state.videoChunks[i]['end_time'],
              0.2
            )
          ) {
            this.state.videoChunks[i]['played'] = true

            // pause it and show replay screen
            this.pause()

            this.autoPlay()
          }
        }
      } else if (
        nextState.ended !== currState.ended &&
        nextState.ended === true
      ) {
        // pause it and show replay screen
        this.pause()
        this.autoPlay()
      }

      if (
        _.has(this.props.emoji, 'category') &&
        this.props.emoji.category === 'Hand Gesture'
      ) {
        this.showEmojiLogicGesture(nextState)
      } else {
        this.showEmoji(nextState)
      }

      this.continouslyCheckForFullScreen(nextState)
    }
  }

  displayEmoji(nextState, i) {
    this.setState({ emoji: true })
    log(
      'emoji show time => ',
      nextState.currentTime,
      'start_time ' + this.state.videoChunks[i]['start_time_emoji']
    )
  }

  hideEmoji(nextState, i) {
    this.setState({ emoji: false })
    log(
      'emoji hide time => ',
      nextState.currentTime,
      'end_time ' + this.state.videoChunks[i]['end_time_emoji']
    )
  }

  showEmoji(nextState) {
    log('video player time => ', nextState.currentTime, '')
    for (let i = 0; i < this.state.videoChunks.length; i++) {
      if (
        this.nearTarget(
          nextState.currentTime,
          this.state.videoChunks[i]['start_time_emoji'],
          0.2
        )
      ) {
        this.displayEmoji(nextState, i)
        break
      }

      if (
        this.nearTarget(
          nextState.currentTime,
          this.state.videoChunks[i]['end_time_emoji'],
          0.2
        )
      ) {
        this.hideEmoji(nextState, i)
        break
      }
    }
  }

  showEmojiLogicGesture(nextState) {
    let vicinityLimit = 0.2
    let emojiStartEndTimeGap = 0.3
    for (let i = 0; i < this.state.videoChunks.length; i++) {
      if (
        this.nearTarget(
          nextState.currentTime,
          this.state.videoChunks[i]['start_time_emoji'],
          vicinityLimit
        ) &&
        this.nearTarget(
          this.state.videoChunks[i]['start_time_emoji'],
          this.state.videoChunks[i]['end_time_emoji'],
          emojiStartEndTimeGap
        )
      ) {
        this.displayEmoji(nextState, i)
        setTimeout(() => {
          this.hideEmoji(nextState, i)
        }, 500)
        break
      }

      if (
        this.nearTarget(
          nextState.currentTime,
          this.state.videoChunks[i]['start_time_emoji'],
          vicinityLimit
        ) &&
        !this.nearTarget(
          this.state.videoChunks[i]['start_time_emoji'],
          this.state.videoChunks[i]['end_time_emoji'],
          emojiStartEndTimeGap
        )
      ) {
        this.displayEmoji(nextState, i)
        break
      }

      if (
        this.nearTarget(
          nextState.currentTime,
          this.state.videoChunks[i]['end_time_emoji'],
          vicinityLimit
        ) &&
        !this.nearTarget(
          this.state.videoChunks[i]['start_time_emoji'],
          this.state.videoChunks[i]['end_time_emoji'],
          emojiStartEndTimeGap
        )
      ) {
        this.hideEmoji(nextState, i)
        break
      }
    }
  }

  continouslyCheckForFullScreen(nextState) {
    if (nextState.isFullscreen === true) {
      try {
        this.refs.chunksPlayer.toggleFullscreen()
      } catch (e) {
        console.error(e)
      }
    }
  }

  playVideoParts() {
    let item = this.state.videoChunks[this.state.position]
    let currState = this.props.videoChunksState
    if (this.state.position < this.state.videoChunks.length) {
      this.state.chunkPlaying = false
      // this.countdown('start')
      this.pause()

      setTimeout(() => {
        if (this.refs.chunksPlayer) {
          log('start_time_check', item.start_time)
          this.refs.chunksPlayer.seek(item.start_time)
          this.play()
        }
      }, 100)

      setTimeout(() => {
        // this.countdown('stop')
      }, 100) // this is to hide give us time to play video before countdown stops
    } else {
      log('allChunksEnded hit', '', '')
      this.setState(
        {
          allChunksEnded: true,
        },
        () => {
          this.pause()
        }
      )
    }
  }

  nearTarget(val, target, range) {
    return val < target + range && val > target - range
  }

  switchTab(data, key) {
    this.setState(
      {
        videoChunks: data.arr,
        currentKey: data.label,
        position: 0,
        showReplay: false,
      },
      () => {
        if (this.refs.chunksPlayer) {
          this.pause()
          this.refs.chunksPlayer.seek(this.state.videoChunks[0].start_time)
          this.modifyVideoDataEndTime(this.props.videoChunksState)
        }
      }
    )
  }

  timelineVideoShowLogic = _.once(data => {
    let arr = Object.values(data)
    let lengthIsZero = true
    let temp = null

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length > 0) {
        lengthIsZero = false
        break
      }
    }

    if (lengthIsZero) temp = false
    else temp = true

    return temp
  })

  leftSideDisablity() {
    if (this.state.position === 0) {
      return true
    } else {
      return false
    }
  }

  rightSideDisablity() {
    if (this.state.position === this.state.videoChunks.length - 1) {
      return true
    } else {
      return false
    }
  }

  onVideoReplay() {
    this.hideReplay()
    this.playVideoParts(this.state.position)
  }

  hideReplay() {
    this.setState({ showReplay: false })
  }

  goPrevious = () => {
    let currPosition = JSON.parse(JSON.stringify(this.state.position)) + 1

    mutuals.socketTracking({
      event_type: 'click',
      event_description: `Previous clicked from position ${currPosition}`,
    })

    this.changeByOne(-1)
  }

  goForward = () => {
    let currPosition = JSON.parse(JSON.stringify(this.state.position)) + 1

    mutuals.socketTracking({
      event_type: 'click',
      event_description: `Forward clicked from position ${currPosition}`,
    })

    this.changeByOne(1)
  }

  render() {
    let disableStyle = { opacity: 0.3 }
    let nonDisableStyle = { opacity: 1 }
    if (this.timelineVideoShowLogic(this.props.data) === false) return null

    let stl = {
      top: 18,
      left: 18,
      borderRadius: 16,
      color: 'white',
      padding: '8px 10px',
      position: 'absolute',
      fontWeight: 600,
      textTransform: 'capitalize',
    }

    return (
      <div>
        {_.has(this.props, 'heading') ? (
          <div className="subHead mt-12 mb-8">{this.props.heading}</div>
        ) : null}

        <Tabs
          tabIndex={this.props.tabIndex}
          tabsData={this.state.tabsData}
          showOptions={true}
          parentMethod={this.switchTab}
          unit={this.props.unit}
        />

        <TimelineChart
          tabIndex={this.props.tabIndex}
          data={this.state.videoChunks}
          currentKey={this.state.currentKey}
          intDuration={this.props.concatData['interview_duration']}
          changeVideo={this.changeByAnyVal}
          currPosition={this.state.position}
          pause={this.pause}
        />

        <div className="timeline-controls">
          <span>
            <div className="float-left">
              {' '}
              <button
                className="paraHead bluePrimaryTxt"
                style={
                  this.leftSideDisablity() ? disableStyle : nonDisableStyle
                }
                disabled={this.leftSideDisablity()}
                tabIndex={this.props.tabIndex}
                aria-label={`play previous ${this.state.currentKey} video clip`}
                onClick={this.goPrevious}>
                <span className="">{'<'}</span>
                <span className="ml-6">Prev</span>
              </button>
            </div>

            <div className="float-left ml-6 grey-color capitalize">
              {this.state.currentKey} {this.state.position + 1}/
              {this.state.videoChunks.length}
            </div>

            <div className="float-left ml-6">
              <button
                className="paraHead bluePrimaryTxt"
                style={
                  this.rightSideDisablity() ? disableStyle : nonDisableStyle
                }
                disabled={this.rightSideDisablity()}
                tabIndex={this.props.tabIndex}
                aria-label={`play next ${this.state.currentKey} video clip`}
                onClick={this.goForward}>
                <span className="">Next</span>
                <span className="ml-6">{'>'}</span>
              </button>
            </div>
          </span>
        </div>

        <div className="timeline-video cursor-pointer">
          <Player
            tabIndex={this.props.tabIndex}
            aspectRatio={'4:3'}
            ref="chunksPlayer"
            src={this.props.userVideoPath}>
            <BigPlayButton position="center" />
          </Player>

          <VideoReplay
            ariaLabel={`Replay ${this.state.position + 1} out of ${
              this.state.videoChunks.length
            } ${this.state.currentKey} video clip`}
            tabIndex={this.props.tabIndex}
            togglingState={this.state.showReplay}
            onVideoReplay={this.onVideoReplay}
            showUnprocessed
          />

          {this.props.videoChunksState &&
          this.props.videoChunksState.paused &&
          this.props.videoChunksState.waiting === false &&
          this.props.videoChunksState.seeking === false ? (
            <button
              className="absolute player-play-copy"
              onClick={() => {
                this.play()
              }}
              tabIndex={this.props.tabIndex}>
              <div className="play-triangle relative" style={{ top: -10 }} />
            </button>
          ) : null}

          {this.props.videoChunksState &&
          (this.props.videoChunksState.waiting ||
            this.props.videoChunksState.seeking)
            ? null
            : null}

          {this.state.emoji ? (
            this.props.emoji && this.props.emoji.type === 'bad' ? (
              <div
                className={classNames({
                  accessiblityRedBg: highContrast,
                  redBg: !highContrast,
                })}
                style={stl}>
                <span>{this.state.currentKey}</span>
              </div>
            ) : (
              <div
                className={classNames({
                  accessiblityGreenBg: highContrast,
                  greenBg: !highContrast,
                })}
                style={stl}>
                <span>{this.state.currentKey}</span>
              </div>
            )
          ) : null}
        </div>
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
    videoChunksState: state.videoInfo.videoChunksState,
    emoji: state.videoInfo.emoji,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
    currentTabIndex: state.tabIndex.currentTabIndex,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setVideoChunksState: val => {
      dispatch(setVideoChunksState(val))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineVideos)
