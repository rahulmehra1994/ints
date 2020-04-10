import React, { Component } from 'react'
import { withMediaProps } from 'react-media-player'

class CustomPlayPause extends Component {
  shouldComponentUpdate({ media, tabIndex, pause, toggleAudio }) {
    if (this.props.pause !== pause && pause === true) {
      this.props.media.playPause()
    }
    if (this.props.toggleAudio !== toggleAudio) {
      this.props.media.playPause()
    }
    return (
      this.props.media.isPlaying !== media.isPlaying ||
      this.props.tabIndex !== tabIndex
    )
  }

  _handlePlayPause = () => {
    this.props.media.playPause()
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
        aria-label={`${media.isPlaying ? 'pause' : 'play'}`}>
        {media.isPlaying ? (
          <div className="ep-icon-pause" />
        ) : (
          <div className="ep-icon-play" />
        )}
      </button>
    )
  }
}

export default withMediaProps(CustomPlayPause)
