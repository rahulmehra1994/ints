import React, { Component } from 'react'
import { log } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'

var classNames = require('classnames')

class VideoReplay extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let {
      togglingState,
      onVideoReplay,
      videoProcessedThumb,
      videoProcessThumb,
      isVideoNormal,
    } = this.props

    return togglingState ? (
      <button
        className={classNames('hideCover z-50 w-full', {})}
        onClick={onVideoReplay}>
        {this.props.hasOwnProperty(
          'chunkPlayer'
        ) ? null : this.props.hasOwnProperty('showUnprocessed') ? (
          <img
            alt="user video thumbnail"
            src={videoProcessedThumb}
            onLoad={this.loaderFalse}
            className="absolute pin"
          />
        ) : (
          <img
            alt="user video thumbnail"
            src={isVideoNormal ? videoProcessThumb : videoProcessedThumb}
            onLoad={this.loaderFalse}
            className="absolute pin"
          />
        )}

        <button
          className="button blueButton"
          tabIndex={this.props.tabIndex}
          aria-label={
            _.has(this.props, 'ariaLabel')
              ? this.props.ariaLabel
              : 'replay the video clip'
          }
          style={{ zIndex: 100 }}
          onClick={onVideoReplay}>
          <span className="replayVideo subHead fadein">
            <span className="ep-icon-replay-icon	text-3xl" />
            <span className="ml-2">Replay</span>
          </span>
        </button>
      </button>
    ) : null
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isVideoNormal: state.videoInfo.isVideoNormal,
    videoProcessThumb: state.epPaths.userVideoProcessThumb,
    videoProcessedThumb: state.epPaths.userVideoProcessedThumb,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoReplay)
