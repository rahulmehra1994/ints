import React from 'react'
import $ from 'jquery'
import { highContrast, log, mutuals } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'
import { toggleVideoFloating } from './../../actions/actions'
import TimelineAudioChart from './TimelineAudioChart'
import Tabs from './Tabs'

var Loader = require('react-loaders').Loader

class TimelineAudios extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      toggleVideo: true,
      toggleActive: false,
      audios: [],
      tabsData: [],
      display: false,
    }

    this.switchTab = this.switchTab.bind(this)
  }

  componentDidMount() {
    this.changeDataForTabs()
  }

  changeDataForTabs() {
    let temp = []
    let index = 0
    for (let key in this.props.data) {
      temp.push({
        label: this.props.extras[index]['label'],
        arr: this.props.data[key],
      })
      index++
    }

    this.setState({ tabsData: temp, audios: temp[0].arr }, () => {
      this.checkForAllEmptyArrays()
    })
  }

  switchTab(item) {
    this.setState({ audios: item.arr })
  }

  checkForAllEmptyArrays() {
    let isEmpty = true
    for (let i = 0; i < this.state.tabsData.length; i++) {
      if (this.state.tabsData[i].arr.length > 0) {
        isEmpty = false
        break
      }
    }

    if (isEmpty) {
      this.setState({
        display: false,
      })
    } else {
      this.setState({
        display: true,
      })
    }
  }

  render() {
    let { compLoader } = this.props.common
    if (this.state.display === false) return null
    if (this.props.intInfo.intDuration === null)
      return (
        <div className="mt-12 loaderWrap border-gray" style={{ height: 100 }}>
          {' '}
          <Loader
            type={compLoader.type}
            active
            style={{ transform: compLoader.scale, fill: 'black' }}
          />
        </div>
      )
    return (
      <div className="mt-8">
        <Tabs
          tabIndex={this.props.tabIndex}
          tabsData={this.state.tabsData}
          showOptions={true}
          parentMethod={this.switchTab}
        />

        <TimelineAudioChart
          data={this.state.audios}
          intDuration={this.props.intInfo.intDuration}
          tabIndex={21}
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
    compVideoChunks: state.videoInfo.compVideoChunks,
    videoChunksState: state.videoInfo.videoChunksState,
    emoji: state.videoInfo.emoji,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
    currentTabIndex: state.tabIndex.currentTabIndex,
    intInfo: state.interviewEP,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleVideoFloating: val => {
      dispatch(toggleVideoFloating(val))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineAudios)
