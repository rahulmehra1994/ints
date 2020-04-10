import React, { Component } from 'react'
import { log } from './../../actions/commonActions'
import { connect } from 'react-redux'

import _ from 'underscore'

class VideoPreloader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let { userVideoPath, userVideoProcessedPath, videoRes } = this.props

    let stl = {
      height: 100,
      width: 100,
      opacity: 0,
    }

    return userVideoPath !== null &&
      userVideoProcessedPath !== null &&
      videoRes ? (
      <div
        className="fixed"
        style={{ height: 100, width: 300, zIndex: -100, opacity: 0 }}>
        <video
          ref="normalVideo"
          src={userVideoPath}
          style={stl}
          crossOrigin="anonymous"
        />
        <video
          ref="processedVideo"
          src={userVideoProcessedPath}
          style={stl}
          crossOrigin="anonymous"
        />
        <div className="absolute pin" style={{ opacity: 0 }} />
      </div>
    ) : null
  }
}

function mapStateToProps(state, ownProps) {
  return {
    userVideoPath: _.has(state.epPaths, 'userVideoPath')
      ? state.epPaths.userVideoPath
      : null,
    userVideoProcessedPath: _.has(state.epPaths, 'userVideoProcessedPath')
      ? state.epPaths.userVideoProcessedPath
      : null,
    videoRes: state.convertVideoRes.status,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoPreloader)
