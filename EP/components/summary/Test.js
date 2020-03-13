import React, { Component } from 'react'
import { log } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'

import VoiceRecognition from './../interview/VoiceRecognition.js'

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      voiceStop: false,
      voiceStart: false,
      transcript: null,
      finalRecognitionStop: false,
    }
    this.onVoiceEnd = this.onVoiceEnd.bind(this)
    this.onVoiceResult = this.onVoiceResult.bind(this)
    this.stopVoice = this.stopVoice.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.onError = this.onError.bind(this)
  }

  onVoiceEnd() {
    this.setState({ voiceStart: false, voiceStop: false })
  }

  onVoiceResult(args) {
    const finalTranscript = args.finalTranscript
    if (finalTranscript !== ' ') {
      log(
        '%c Transcript ' + finalTranscript,
        'background: orange; color: white',
        ''
      )

      if (this.state.transcript) {
        this.setState(
          { transcript: this.state.transcript + finalTranscript },
          () => {
            //this.call(args.finalTranscript)
          }
        )
      } else {
        this.setState({ transcript: finalTranscript }, () => {
          // this.call(args.finalTranscript)
        })
      }

      log(
        '%c Transcript from onVoiceResult: ' + this.state.transcript,
        'background: yellow; color: black',
        ''
      )
    }
  }

  stopVoice() {
    this.setState({ voiceStop: true, finalRecognitionStop: true })
  }

  onError(error) {
    log('%c VOICE RECOGINTION ERROR: ', 'background: cyan; color: black', error)
    //below code to restart voice recogintion
  }

  onEnd() {
    log('%c ON VOICE RECOGINTION END: ', 'background: cyan; color: black', '')
    if (this.state.finalRecognitionStop === false) {
      this.setState({ voiceStart: false }, () => {
        this.setState({ voiceStart: true })
      })
    }
  }

  componentDidMount() {
    this.setState({ voiceStart: true })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.voiceStart && (
          <VoiceRecognition
            onStart={this.start}
            onEnd={this.onEnd}
            onResult={this.onVoiceResult}
            stop={this.state.voiceStop}
            onError={this.onError}
          />
        )}

        <button
          className="button blueButton"
          onClick={() => {
            this.stopVoice()
          }}>
          Stop Voice Recog.
        </button>
      </React.Fragment>
    )
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
)(Test)
