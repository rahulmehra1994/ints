import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'underscore'
import $ from 'jquery'
import {
  highContrast,
  common,
  mutuals,
  log,
} from './../../actions/commonActions'

var classNames = require('classnames')
const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

const block = process.env.APP_BASE_URL + '/dist/images/new/icons/block.svg'
const LOADER_IMG_PATH = process.env.APP_BASE_URL + '/dist/images/loader.gif'

const data = {
  eyeGaze: {
    label: 'Eye Contact',
    resultKey: 'eyeCombinedVal',
    index: 1,
    type: 'eye_contact',
    route: 'eyeGaze',
    icon: 'ep-icon-eye',
    sectionHeading: 'Non Verbals',
  },
  smile: {
    label: 'Facial Expressions',
    resultKey: 'faceCombinedVal',
    index: 2,
    type: 'facial_expressions',
    route: 'smile',
    icon: 'ep-icon-smiley',
  },
  gesture: {
    label: 'Hand Gestures',
    resultKey: 'gestCombinedVal',
    index: 3,
    type: 'hand_gesture',
    route: 'gesture',
    icon: 'ep-icon-hand',
  },
  body: {
    label: 'Body Posture',
    resultKey: 'bodyCombinedVal',
    index: 4,
    type: 'body_posture',
    route: 'body',
    icon: 'ep-icon-posture',
  },
  appearance: {
    label: 'Appearance',
    resultKey: 'appearCombinedVal',
    index: 5,
    type: 'appearance',
    route: 'appearance',
    icon: 'ep-icon-appearance',
  },
  word: {
    label: 'Word Usage',
    resultKey: 'wordCombinedVal',
    index: 6,
    type: 'word_usage',
    route: 'word',
    icon: 'ep-icon-word-usage',
    sectionHeading: 'Content Strength',
  },
  sentence: {
    label: 'Sentence Analysis',
    resultKey: 'sentenceCombinedVal',
    index: 8,
    type: 'sentence_analysis',
    route: 'sentence',
    icon: 'ep-icon-sentence-analysis',
  },
  vocal: {
    label: 'Vocal Features',
    resultKey: 'vocalCombinedVal',
    index: 100,
    type: 'vocal_features',
    route: 'vocal',
    icon: 'ep-icon-vocal-features',
    sectionHeading: 'Delivery of Speech',
  },
  pauses: {
    label: 'Appropriate Pauses',
    resultKey: 'pauseCombinedVal',
    index: 101,
    type: 'appropriate_pauses',
    route: 'pauses',
    icon: 'ep-icon-appropriate-pauses',
  },
  disfluencies: {
    label: 'Speech Fluency',
    resultKey: 'disfluencyCombinedVal',
    index: 102,
    type: 'disfluencies',
    route: 'disfluencies',
    icon: 'ep-icon-disfulencies',
  },
  modulation: {
    label: 'Speech Modulation',
    resultKey: 'modulationCombinedVal',
    index: 103,
    type: 'speech_modulation',
    route: 'modulation',
    icon: 'ep-icon-speech-modulation',
  },
}

class Leftbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subindex: 0,
      delDetails: true,
      eye_contact: false,
      faceDetails: false,
      gestDetails: false,
      bodyDetails: false,
      appearDetails: false,
      contentDetails: false,
      wordDetails: false,
      sentenceDetails: false,
      contentBlockActive: false,
    }
    this.handleEnter = this.handleEnter.bind(this)
  }

  UNSAFE_componentWillMount() {
    this.modifyDataIfAppearanceDisabled()
    this.modifyDataIfContentDisabled()
  }

  modifyDataIfAppearanceDisabled() {
    if (this.props.customizations.appearance_enabled === false) {
      delete data['appearance']
    }
  }

  modifyDataIfContentDisabled() {
    if (mutuals.isContentEnabled(this.props) === false) {
      delete data['word']
      delete data['sentence']
    }
  }

  componentDidMount() {
    this.activeEyeContact()
    this.activeVideoSumm()
    this.setFocusForAccessiblity()
  }

  setFocusForAccessiblity() {
    let path = this.props.location.pathname
    _.map(this.props.appUrls, (val, key) => {
      if (val === path && key !== 'videosummary')
        this.setElementFocus(data[key].route)

      if (val === path && key === 'videosummary')
        this.setElementFocus('videosummary')
    })
  }

  setElementFocus(el) {
    try {
      document.getElementById(el).focus()
    } catch (e) {
      console.error(
        'cannot find element id in setFocusForAccessiblity error=> ',
        e
      )
    }
  }

  activeEyeContact() {
    if (this.props.location.pathname === this.props.appUrls.eyeGaze) {
      //order of below two lines matter
      this.selectNavComponent(1, 'eye_contact')
      this.setState({ subindex: 0 })
    }
  }

  activeVideoSumm() {
    if (this.props.location.pathname === this.props.appUrls.videosummary) {
      this.selectNavComponent(7)
    }
  }

  scrollCompToTop() {
    $('.contentbar').scrollTop(0)
  }

  trackingLogic(comp) {
    trackingDebounceSmall({
      event_type: 'click',
      event_description: 'EP detailed leftbar ' + comp + ' clicked',
    })
  }

  selectNavComponent = (index, comp, e) => {
    this.trackingLogic(comp)
    this.scrollCompToTop()
    this.setState(
      {
        eye_contact: false,
        index: index,
        subindex: 0,
      },
      () => {
        this.setState({ [comp]: !this.state[comp] })
      }
    )

    this.props.updateActiveTab(index)
  }

  checkOpacity(val) {
    if (val === 3) {
      return { opacity: 0.3 }
    } else {
      return { opacity: 1 }
    }
  }

  isLoaded(val) {
    if (val === 3) {
      return false
    } else {
      return true
    }
  }

  handleEnter(...args) {
    let event = args[args.length - 1]
    let id = args[0]
    let label = args[1]

    if (event.key === 'Enter') {
      this.selectNavComponent(id, label)
      try {
        document.querySelector('.information-content').focus()
      } catch (e) {
        console.error(e)
      }
    }
  }

  handlerContentBlockEnter(event) {
    if (event.key === 'Enter') {
      try {
        document.querySelector('.information-content').focus()
      } catch (e) {
        console.error(e)
      }
    }
  }

  handlerContentProcess() {
    if (this.props.location.pathname === this.props.appUrls.noContent)
      this.setState({ contentBlockActive: true })
  }

  TemplateBlock = customProps => {
    let path = this.props.location.pathname
    let sectionColor = this.props.common.sectionColor
    let appUrls = this.props.appUrls

    return (
      <div className="relative clearfix">
        {this.isLoaded(this.props[customProps.resultKey]) ? null : (
          <div className="deactivate" />
        )}

        <Link
          id={customProps.route}
          className="captureLeftBarComp"
          to={appUrls[customProps.route]}
          onClick={e => {
            this.selectNavComponent(customProps.index, customProps.type, e)
          }}
          onKeyDown={e => {
            this.handleEnter(customProps.index, customProps.type, e)
          }}
          tabIndex={common.tabIndexes[customProps.route] - 1}
          aria-label={`${customProps.label} ${
            common.sectionStatus[this.props[customProps.resultKey]]
          }. click on this to view detailed feedback.`}>
          <div
            className={classNames({
              ['contrast-leftbar-component-' +
              (path === appUrls[customProps.route]).toString()]: highContrast,
              ['leftbar-component-' +
              (path === appUrls[customProps.route]).toString()]: !highContrast,
            })}>
            {this.isLoaded(this.props[customProps.resultKey]) ? (
              <div
                className="leftbar-status"
                style={{
                  backgroundColor:
                    sectionColor[this.props[customProps.resultKey]],
                }}
              />
            ) : (
              <img
                className="loader-image"
                src={LOADER_IMG_PATH}
                alt="loading"
              />
            )}

            <span
              className={classNames(`leftbar-logo ${customProps.icon}`, {
                blueColor: path === appUrls[customProps.route],
                blackColor: path !== appUrls[customProps.route],
              })}
            />

            <div
              className={classNames('leftbar-text', {
                leftBarTxtHighlight: path === appUrls[customProps.route],
              })}>
              {customProps.label}
            </div>
          </div>
        </Link>
      </div>
    )
  }

  render() {
    let path = this.props.location.pathname
    let { appUrls } = this.props

    let dataValues = Object.values(data)

    return (
      <div
        className="leftbar-detailed ep-scroll"
        role="navigation"
        aria-label="User menu">
        <div id="primary-bar">
          {dataValues.map((item, index) => {
            return (
              <React.Fragment>
                {_.has(item, 'sectionHeading') ? (
                  <div className="paraHead mt-8 mb-2">
                    <span className="ml-6">{item.sectionHeading}</span>
                  </div>
                ) : null}
                <this.TemplateBlock
                  key={index}
                  resultKey={item.resultKey}
                  index={item.index}
                  type={item.type}
                  route={item.route}
                  icon={item.icon}
                  label={item.label}
                />
              </React.Fragment>
            )
          })}

          {mutuals.isContentEnabled(this.props) ? null : (
            <div className="px-6 py-8 no-content-leftbar">
              <div className={classNames('')}>
                <div className="w-full">
                  <span className="float-left para">Content Strength</span>
                  <span>
                    <img className="float-right" src={block} alt="block" />
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="hr mt-6 mb-6" />

          <div className="relative clearfix">
            {this.props.userVideoPath !== null &&
            this.props.userVideoProcessedPath !== null &&
            this.props.videoRes ? null : (
              <div className="deactivate" />
            )}
            <Link
              id="videosummary"
              tabIndex={common.tabIndexes.videosummary - 1}
              to={appUrls.videosummary}
              onClick={() => {
                this.selectNavComponent(7, 'video_summary')
              }}
              aria-label={`video summary. click on this to see normal and processed interview videos.`}>
              <div
                className={classNames({
                  ['contrast-leftbar-component-' +
                  (path === appUrls.videosummary).toString()]: highContrast,
                  ['leftbar-component-' +
                  (path === appUrls.videosummary).toString()]: !highContrast,
                })}
                aria-hidden={true}>
                <span
                  className={classNames('leftbar-logo ep-icon-videocam', {
                    blueColor: path === appUrls.videosummary,
                    blackColor: path !== appUrls.videosummary,
                  })}
                  style={{ fontSize: 16 }}
                />

                {this.props.userVideoPath !== null &&
                this.props.userVideoProcessedPath !== null &&
                this.props.videoRes ? null : (
                  <img
                    src={LOADER_IMG_PATH}
                    alt="loading"
                    className="loader-image"
                  />
                )}

                <div
                  className={classNames('leftbar-text', {
                    leftBarTxtHighlight: path === appUrls.videosummary,
                  })}>
                  Video Feedback
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    common: state.commonStuff,
    eyeCombinedVal: state.results.eyeResults
      ? state.results.eyeResults.eyeCombinedVal
      : 3,
    faceCombinedVal: state.results.faceResults
      ? state.results.faceResults.faceCombinedVal
      : 3,
    gestCombinedVal: state.results.handResults
      ? state.results.handResults.gestCombinedVal
      : 3,
    bodyCombinedVal: state.results.bodyResults
      ? state.results.bodyResults.bodyCombinedVal
      : 3,
    appearCombinedVal: state.results.appearanceResults
      ? state.results.appearanceResults.appearCombinedVal
      : 3,
    wordCombinedVal: state.results.wordResults
      ? state.results.wordResults.wordCombinedVal
      : 3,
    sentenceCombinedVal: state.results.sentenceResults
      ? state.results.sentenceResults.sentenceCombinedVal
      : 3,
    vocalCombinedVal: state.results.vocalResults
      ? state.results.vocalResults.vocalCombinedVal
      : 3,
    pauseCombinedVal: state.results.pauseResults
      ? state.results.pauseResults.pauseCombinedVal
      : 3,
    disfluencyCombinedVal: state.results.disfluencyResults
      ? state.results.disfluencyResults.disfluencyCombinedVal
      : 3,
    modulationCombinedVal: state.results.modulationResults
      ? state.results.modulationResults.modulationCombinedVal
      : 3,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
    appUrls: state.appUrls,
    videoRes: state.convertVideoRes.status,
    userVideoPath: _.has(state.epPaths, 'userVideoPath')
      ? state.epPaths.userVideoPath
      : null,
    userVideoProcessedPath: _.has(state.epPaths, 'userVideoProcessedPath')
      ? state.epPaths.userVideoProcessedPath
      : null,
    customizations: _.isEmpty(state.epCustomizations)
      ? null
      : state.epCustomizations,
    intQuestionId: state.interviewEP.intQuestionId,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Leftbar)
