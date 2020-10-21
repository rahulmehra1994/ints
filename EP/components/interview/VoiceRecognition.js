import React, { Component } from 'react'
import { log, mutuals } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'

class VoiceRecognition extends Component {
  constructor(props) {
    super(props)

    this.bindResult = this.bindResult.bind(this)
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

    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition object created with langcode => ${langCodeArr[0]}`,
    })

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

  startRecog() {
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition started`,
    })
  }

  stop() {
    this.recognition.stop()
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition stopped`,
    })
  }

  abort() {
    this.recognition.abort()
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition aborted`,
    })
  }

  UNSAFE_componentWillReceiveProps({ stop }) {
    if (stop) {
      this.stop()
    }
  }

  componentDidMount() {
    this.initialise()
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition component mounted`,
    })
  }

  nomatch() {
    log('%c nomatch', 'background: orange; color: white', '')
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition no match function called`,
    })
  }

  audioend() {
    log('%c audioend', 'background: orange; color: white', '')
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition audio end function called`,
    })
  }

  soundend() {
    log('%c soundend', 'background: orange; color: white', '')
  }

  speechend() {
    log('%c speechend', 'background: orange; color: white', '')
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition speechend function called`,
    })
  }

  speechstart() {
    log('%c speechstart', 'background: orange; color: white', '')
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition speech start function called`,
    })
  }

  soundstart() {
    log('%c soundstart', 'background: orange; color: white', '')
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition sound start function called`,
    })
  }

  audioStart() {
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition audio start function called`,
    })
  }

  initialise() {
    const events = [
      { name: 'start', action: this.startRecog },
      { name: 'end', action: this.props.onEnd },
      { name: 'error', action: this.props.onError },
      { name: 'nomatch', action: this.nomatch },
      { name: 'audioend', action: this.audioend },
      { name: 'soundend', action: this.soundend },
      { name: 'speechend', action: this.speechend },
      { name: 'speechstart', action: this.speechstart },
      { name: 'soundstart', action: this.soundstart },
      { name: 'audiostart', action: this.audioStart },
    ]

    events.forEach(event => {
      this.recognition.addEventListener(event.name, event.action)
    })

    this.recognition.addEventListener('result', this.bindResult)

    this.recognition.start()
  }

  componentWillUnmount() {
    this.abort()
    mutuals.socketTracking({
      event_type: 'app flow',
      local_date_time: new Date().getTime(),
      event_description: `voice recognition component unmounted`,
    })
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

export default connect(mapStateToProps, mapDispatchToProps)(VoiceRecognition)
