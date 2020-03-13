import React, { Component } from 'react'
import { withMediaProps } from 'react-media-player'
const mute = process.env.APP_BASE_URL + '/dist/images/custom-audio-mute.svg'
const unmute = process.env.APP_BASE_URL + '/dist/images/custom-audio-unmute.svg'

class CustomMuteUnmute extends Component {
  shouldComponentUpdate({ media, tabIndex }) {
    return (
      this.props.media.isMuted !== media.isMuted ||
      this.props.tabIndex !== tabIndex
    )
  }

  _handlePlayPause = () => {
    this.props.media.muteUnmute()
  }

  render() {
    const { className, style, media } = this.props
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={this._handlePlayPause}
        tabIndex={this.props.tabIndex}
        aria-label={`${media.isMuted ? 'mute' : 'unmute'}`}>
        {media.isMuted ? (
          <img className="play-pause-wrap" alt={'audio mute'} src={mute} />
        ) : (
          <img className="play-pause-wrap" alt={'audio unmute'} src={unmute} />
        )}
      </button>
    )
  }
}

export default withMediaProps(CustomMuteUnmute)
