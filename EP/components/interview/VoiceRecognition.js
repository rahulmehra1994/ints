import React, { Component } from 'react'
import { log } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'

class VoiceRecognition extends Component {
  constructor(props) {
    super(props)

    this.bindResult = this.bindResult.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.abort = this.abort.bind(this)
    this.createRecognition = this.createRecognition.bind(this)
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition ||
      window.oSpeechRecognition

    // const SpeechRecognition = window.SpeechRecognition

    var SpeechGrammarList =
      window.SpeechGrammarList ||
      window.webkitSpeechGrammarList ||
      window.mozSpeechGrammarList ||
      window.msSpeechGrammarList ||
      window.oSpeechGrammarList

    if (SpeechRecognition != null) {
      this.recognition = this.createRecognition(
        SpeechRecognition,
        SpeechGrammarList,
        props
      )
    } else {
      console.warn('The current does not support the SpeechRecognition API.')
    }
  }

  createRecognition(SpeechRecognition, SpeechGrammarList, props) {
    let { userInfo, langCode } = props

    let langCodeArr = langCode.split('*')
    log('langCodeArr', langCodeArr[0])

    const defaults = {
      // continuous: false,
      interimResults: true,
      lang: langCodeArr[0],
    }

    const options = Object.assign({}, defaults, this.props)

    log('createRecognition', defaults)

    var grammar =
      '#JSGF V1.0; grammar names; public <name> = ' + !_.isEmpty(userInfo)
        ? userInfo.firstName + ' ' + userInfo.lastName
        : '' + ';'
    var recognition = new SpeechRecognition()
    var speechRecognitionList = new SpeechGrammarList()
    speechRecognitionList.addFromString(grammar, 1)
    recognition.grammars = speechRecognitionList

    recognition.continuous = options.continuous
    recognition.interimResults = options.interimResults
    recognition.lang = options.lang

    return recognition
  }

  bindResult(event) {
    let interimTranscript = ' '
    let finalTranscript = ' '

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      } else {
        interimTranscript += event.results[i][0].transcript
      }
    }
    this.props.onResult({ interimTranscript, finalTranscript })
  }

  start() {
    this.recognition.start()
  }

  stop() {
    this.recognition.stop()
  }

  abort() {
    this.recognition.abort()
  }

  componentWillReceiveProps({ stop }) {
    if (stop) {
      this.stop()
    }
  }

  componentDidMount() {
    this.initialise()
  }

  nomatch() {
    log('%c nomatch', 'background: orange; color: white', '')
  }

  audioend() {
    log('%c audioend', 'background: orange; color: white', '')
  }

  soundend() {
    log('%c soundend', 'background: orange; color: white', '')
  }

  speechend() {
    log('%c speechend', 'background: orange; color: white', '')
  }

  speechstart() {
    log('%c speechstart', 'background: orange; color: white', '')
  }
  soundstart() {
    log('%c soundstart', 'background: orange; color: white', '')
  }

  audiostartr() {}

  initialise() {
    const events = [
      { name: 'start', action: this.props.onStart },
      { name: 'end', action: this.props.onEnd },
      { name: 'error', action: this.props.onError },
      { name: 'nomatch', action: this.nomatch },
      { name: 'audioend', action: this.audioend },
      { name: 'soundend', action: this.soundend },
      { name: 'speechend', action: this.speechend },
      { name: 'speechstart', action: this.speechstart },
      { name: 'soundstart', action: this.soundstart },
      { name: 'audiostart', action: this.audiostartr },
    ]

    events.forEach(event => {
      this.recognition.addEventListener(event.name, event.action)
    })

    this.recognition.addEventListener('result', this.bindResult)

    this.start()
  }

  componentWillUnmount() {
    this.abort()
  }

  render() {
    return null
  }
}

const mapStateToProps = state => {
  return {
    langCode: state.userInfoEP.langCode,
    userInfo: state.user.data,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VoiceRecognition)
