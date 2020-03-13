import React, { Component } from 'react'
import { connect } from 'react-redux'
import Comparison from './../summary/Comparison.js'
import _ from 'underscore'
import ContentLoader from 'react-content-loader'
import { common, log, mutuals } from './../../actions/commonActions'
import { toggleVideoFloating } from './../../actions/actions'
import CenterLoading from './../CenterLoading/index'
import { basicMsgs } from './../../components/messages/messages'

var classNames = require('classnames')
const getWidth = ['90%', '50%', '30%']
const MyLoader = props => {
  return (
    <ContentLoader
      height={props.height}
      width={520 * props.size}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#a7a9b3"
      {...props}>
      <rect
        x={98 * props.offset}
        y="134.05"
        rx="4"
        ry="4"
        width={320 * props.size}
        height="7"
      />
      <rect
        x={98 * props.offset}
        y="165"
        rx="4"
        ry="4"
        width={320 * props.size}
        height="7"
      />
      <rect
        x={98 * props.offset}
        y="195"
        rx="4"
        ry="4"
        width={320 * props.size}
        height="7"
      />
      <circle cx={250 * props.offset} cy="69" r="30" />
    </ContentLoader>
  )
}

const Card = props => {
  return (
    <div
      className={
        props.type === 'vertical' ? 'summaryCard flex-1' : 'smallSummaryCard'
      }
      tabIndex={props.tabIndex}
      aria-label={`${props.name} ${
        common.sectionStatus[props.val]
      } Click to go to the detailed page of ${props.name}`}>
      {props.val === null ? (
        <MyLoader height="243" width="250" size="0.49" offset="0.49" />
      ) : (
        <div
          className=""
          onClick={() => {
            props.gotoDetailed(props.appUrls[props.keys[0]], props.keys[1])
          }}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              props.gotoDetailed(props.appUrls[props.keys[0]], props.keys[1])
            }
          }}>
          <div
            className={
              props.type === 'vertical' ? '' : 'float-left smallSummaryCardIcon'
            }>
            <div className="cardIconWrap">
              <div className="flex items-center justify-center">
                <img
                  className=""
                  src={`${process.env.APP_BASE_URL}/dist/images/new/icons-big/${props.img}-big.svg`}
                  alt={props.name}
                />
              </div>
            </div>
          </div>
          <div
            className={
              props.type === 'vertical' ? '' : 'float-left smallSummaryCardInfo'
            }>
            <div className="cardFeature">{props.name}</div>
            <div className="progressbar-underlay">
              <div
                className="progressbar"
                style={{
                  width: getWidth[props.val],
                  background: common.sectionColor[props.val],
                }}
              />
            </div>
            <div className="para hintColor mt-6">{basicMsgs[props.val]}</div>
          </div>
        </div>
      )}
    </div>
  )
}

class Summary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nonVerbalsTabIndex: -1,
      speechTabIndex: -1,
      contentTabIndex: -1,
      nonVerbalsOutline: true,
      isLoaded: false,
      contentDisable: false,
      deliveryConfig: null,
      contentConfig: null,
      nonVerbals: null,
    }
    this.gotoDetailed = this.gotoDetailed.bind(this)
  }

  gotoDetailed(path, comp) {
    mutuals.socketTracking({
      event_type: 'click',
      event_description: comp + '_clicked',
    })

    this.props.history.push(path)
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['summary'],
      event_type: 'mount',
    })
    this.configSetup()
  }

  configSetup() {
    let commonConfig = {
      appUrls: this.props.appUrls,
      gotoDetailed: this.gotoDetailed,
    }

    this.setState(
      {
        deliveryConfig: {
          ...commonConfig,
          type: 'horizontal',
          tabIndex: this.state.speechTabIndex,
        },

        contentConfig: {
          ...commonConfig,
          type: 'vertical',
          tabIndex: this.state.contentTabIndex,
        },

        nonVerbals: {
          ...commonConfig,
          type: 'vertical',
          tabIndex: this.state.nonVerbalsTabIndex,
        },
      },
      () => {
        if (mutuals.isContentEnabled(this.props) === false)
          this.contentDisable()
      }
    )
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.intQuestionId !== nextProps.intQuestionId ||
      this.props.customizations !== nextProps.customizations
    ) {
      if (mutuals.isContentEnabled(nextProps) === false) this.contentDisable()
    }
  }

  contentDisable() {
    let temp = { ...this.state.deliveryConfig, type: 'vertical' }
    this.setState({ deliveryConfig: temp, contentDisable: true })
  }

  toggleComp(comp) {
    this.setState({ [comp]: !this.state[comp] })
  }

  disableOpacity = _.once(() => {
    setTimeout(() => {
      this.setState({ isLoaded: true })
    }, 1000)
  })

  render() {
    let { appUrls } = this.props
    let {
      nonVerbalsTabIndex,
      speechTabIndex,
      contentTabIndex,
      isLoaded,
      deliveryConfig,
      contentConfig,
      nonVerbals,
      contentDisable,
    } = this.state

    if (mutuals.isContentEnabled(this.props) === null) {
      return (
        <div className="fullscreen-loader">
          <CenterLoading />
        </div>
      )
    }

    return (
      <React.Fragment>
        {isLoaded ? null : (
          <div className="fullscreen-loader">
            <CenterLoading />
          </div>
        )}
        {this.disableOpacity()}
        <div className="summ-main-wrap" style={{ opacity: isLoaded ? 1 : 0 }}>
          <Comparison customClasses="leftBar" tabIndex={this.props.tabIndex} />

          <div className="px-2">
            <div
              id="start-of-content"
              className="cardStyle summ-card-wrap non-verbals"
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  this.setState({
                    nonVerbalsTabIndex: common.tabIndexes.summary,
                  })
                  document.querySelector('.non-verbals .summaryCard').focus()
                }
              }}
              tabIndex={common.tabIndexes.summary}
              role="navigation"
              aria-label={`Non verbal section provides feedback on the body language when communicating with others. Select to see all the components.`}>
              <div className="clearfix">
                <h1 className="mainHead pb-10">Non Verbals</h1>
              </div>

              <div className="summ-card-grid non-verbals">
                <Card
                  {...nonVerbals}
                  keys={['eyeGaze', 'eye_gaze']}
                  img="eye-contact"
                  name={'Eye Contact'}
                  val={this.props.eyeCombinedVal}
                  status={this.props.eyeCombinedMsg}
                />

                <Card
                  {...nonVerbals}
                  keys={['smile', 'facial_expressions']}
                  img={'facial-expression'}
                  name={'Facial Expressions'}
                  val={this.props.faceCombinedVal}
                  status={this.props.faceCombinedMsg}
                />

                <Card
                  {...nonVerbals}
                  keys={['gesture', 'hand_gestures']}
                  img={'hand-gestures'}
                  name={'Hand Gestures'}
                  val={this.props.gestCombinedVal}
                  status={this.props.gestCombinedMsg}
                />

                <Card
                  {...nonVerbals}
                  keys={['body', 'body_posture']}
                  img={'body-posture'}
                  name={'Body Posture'}
                  val={this.props.bodyCombinedVal}
                  status={this.props.bodyCombinedMsg}
                />

                {this.props.customizations.appearance_enabled ? (
                  <Card
                    {...nonVerbals}
                    keys={['appearance', 'appearance']}
                    img={'appearance'}
                    name={'Appearance'}
                    val={this.props.appearCombinedVal}
                    status={this.props.appearCombinedMsg}
                  />
                ) : null}
              </div>
            </div>

            <div
              className="mt-2 summ-grid-2"
              style={{
                gridTemplateColumns: contentDisable ? '1fr' : null,
              }}>
              {contentDisable ? null : (
                <div
                  className="clearfix cardStyle summ-card-wrap content-strength"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      this.setState({
                        contentTabIndex: common.tabIndexes.summary + 1,
                      })
                      document
                        .querySelector('.content-strength .summaryCard')
                        .focus()
                    }
                  }}
                  tabIndex={common.tabIndexes.summary + 1}
                  role="navigation"
                  aria-label={`Content Strength section focuses on the language a person uses while communicating with the other person. Select to see all the components`}>
                  <div className="">
                    <h1 className="mainHead pb-10">Content Strength</h1>
                  </div>

                  <div className="summ-card-grid grid-cols-2">
                    <Card
                      {...contentConfig}
                      keys={['word', 'word_usage']}
                      img={'word-usage'}
                      name={'Word Usage'}
                      val={this.props.wordCombinedVal}
                      status={this.props.wordCombinedMsg}
                    />

                    <Card
                      {...contentConfig}
                      keys={['sentence', 'sentence_analysis']}
                      img={'sentence-analysis'}
                      name={'Sentence Analysis'}
                      val={this.props.sentenceCombinedVal}
                      status={this.props.sentenceCombinedMsg}
                    />
                  </div>
                </div>
              )}

              <div
                className="clearfix cardStyle summ-card-wrap delivery-of-speech"
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    this.setState({
                      speechTabIndex: common.tabIndexes.summary + 2,
                    })
                    document
                      .querySelector('.delivery-of-speech .smallSummaryCard')
                      .focus()
                  }
                }}
                tabIndex={common.tabIndexes.summary + 2}
                role="navigation"
                aria-label={`Delivery of speech section focuses on how confident the person is while communicating with the other person. Select to see all the components.`}>
                <div className="">
                  <h1 className="mainHead pb-10">Delivery of Speech</h1>
                </div>

                <div className="">
                  <div
                    className="summ-card-grid grid-cols-2"
                    style={{
                      gridTemplateColumns: contentDisable
                        ? 'repeat(4, 208px)'
                        : null,
                    }}>
                    <Card
                      {...deliveryConfig}
                      keys={['vocal', 'vocal_features']}
                      img={'vocal-features'}
                      name={'Vocal Features'}
                      val={this.props.vocalCombinedVal}
                      status={this.props.vocalCombinedMsg}
                    />
                    <Card
                      {...deliveryConfig}
                      keys={['pauses', 'appropriate_pauses']}
                      img={'appropriate-pauses'}
                      name={'Appropriate Pauses'}
                      val={this.props.pauseCombinedVal}
                      status={this.props.pauseCombinedMsg}
                    />

                    {contentDisable ? (
                      <React.Fragment>
                        <Card
                          {...deliveryConfig}
                          keys={['disfluencies', 'disfluencies']}
                          img={'disfluencies'}
                          name={'Speech Fluency'}
                          val={this.props.disfluencyCombinedVal}
                          status={this.props.modulationCombinedMsg}
                        />
                        <Card
                          {...deliveryConfig}
                          keys={['modulation', 'speech_modulation']}
                          img={'speech-modulation'}
                          name={'Speech Modulation'}
                          val={this.props.modulationCombinedVal}
                          status={this.props.disfluencyCombinedMsg}
                        />
                      </React.Fragment>
                    ) : null}
                  </div>
                </div>

                {contentDisable ? null : (
                  <div className="summ-card-grid grid-cols-2 mt-6">
                    <Card
                      {...deliveryConfig}
                      keys={['disfluencies', 'disfluencies']}
                      img={'disfluencies'}
                      name={'Speech Fluency'}
                      val={this.props.disfluencyCombinedVal}
                      status={this.props.modulationCombinedMsg}
                    />
                    <Card
                      {...deliveryConfig}
                      keys={['modulation', 'speech_modulation']}
                      img={'speech-modulation'}
                      name={'Speech Modulation'}
                      val={this.props.modulationCombinedVal}
                      status={this.props.disfluencyCombinedMsg}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    eyeCombinedVal: state.results.eyeResults
      ? state.results.eyeResults.eyeCombinedVal
      : null,
    eyeCombinedMsg: state.results.eyeResults
      ? state.results.eyeResults.eyeCombinedMsg
      : null,

    faceCombinedVal: state.results.faceResults
      ? state.results.faceResults.faceCombinedVal
      : null,
    faceCombinedMsg: state.results.faceResults
      ? state.results.faceResults.faceCombinedMsg
      : null,

    gestCombinedVal: state.results.handResults
      ? state.results.handResults.gestCombinedVal
      : null,
    gestCombinedMsg: state.results.handResults
      ? state.results.handResults.gestCombinedMsg
      : null,

    bodyCombinedVal: state.results.bodyResults
      ? state.results.bodyResults.bodyCombinedVal
      : null,
    bodyCombinedMsg: state.results.bodyResults
      ? state.results.bodyResults.bodyCombinedMsg
      : null,

    appearCombinedVal: state.results.appearanceResults
      ? state.results.appearanceResults.appearCombinedVal
      : null,
    appearCombinedMsg: state.results.appearanceResults
      ? state.results.appearanceResults.appearCombinedMsg
      : null,

    wordCombinedVal: state.results.wordResults
      ? state.results.wordResults.wordCombinedVal
      : null,
    wordCombinedMsg: state.results.wordResults
      ? state.results.wordResults.wordCombinedMsg
      : null,

    sentenceCombinedVal: state.results.sentenceResults
      ? state.results.sentenceResults.sentenceCombinedVal
      : null,
    sentenceCombinedMsg: state.results.sentenceResults
      ? state.results.sentenceResults.sentenceCombinedMsg
      : null,

    vocalCombinedVal: state.results.vocalResults
      ? state.results.vocalResults.vocalCombinedVal
      : null,
    vocalCombinedMsg: state.results.vocalResults
      ? state.results.vocalResults.vocalCombinedMsg
      : null,

    pauseCombinedVal: state.results.pauseResults
      ? state.results.pauseResults.pauseCombinedVal
      : null,
    pauseCombinedMsg: state.results.pauseResults
      ? state.results.pauseResults.pauseCombinedMsg
      : null,
    disfluencyCombinedVal: state.results.disfluencyResults
      ? state.results.disfluencyResults.disfluencyCombinedVal
      : null,
    disfluencyCombinedMsg: state.results.disfluencyResults
      ? state.results.disfluencyResults.disfluencyCombinedMsg
      : null,

    modulationCombinedVal: state.results.modulationResults
      ? state.results.modulationResults.modulationCombinedVal
      : null,
    modulationCombinedMsg: state.results.modulationResults
      ? state.results.modulationResults.modulationCombinedMsg
      : null,
    throughInt: state.throughInt,
    appUrls: state.appUrls,
    statuses: state.statuses,
    customizations: _.isEmpty(state.epCustomizations)
      ? null
      : state.epCustomizations,
    intQuestionId: state.interviewEP.intQuestionId,
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
)(Summary)
