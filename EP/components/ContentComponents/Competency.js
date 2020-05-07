import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  mutuals,
  getStatusIcon,
  common,
  log,
} from '../../actions/commonActions'
import { mutualLogics } from '../../actions/mutualLogics'
import { sentenceMsgs } from '../messages/messages'
import CompetencySamples from '../popups/CompetencySamples'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import { highContrast } from '../../actions/commonActions'
import { DetailInfoHeader } from '../commons/DetailHeader'
import CapsulesSystem from './../commons/CapsulesSystem'

const sentenceAnalysisBig =
  process.env.APP_BASE_URL +
  '/dist/images/new/icons-big/sentence-analysis-big.svg'

var classNames = require('classnames')
var Loader = require('react-loaders').Loader

const breakLine = text => {
  var br = React.createElement('br')
  var regex = /(<br \/>)/g
  return text.split(regex).map(function (line, index) {
    return line.match(regex) ? (
      <React.Fragment key={index}>
        <br />
        <div className="line-height-content" />
      </React.Fragment>
    ) : (
      line
    )
  })
}

const HeaderRow = props => {
  return (
    <div className="mt-6">
      <div className="category-column single-column heading-column">
        {props.type}
      </div>
      <div className="information-column single-column heading-column">
        Information
      </div>
    </div>
  )
}

function isEssentialItem(props) {
  if (props.group === 'essential') return true
  else return false
}

const DataRow = props => {
  let samplesAvailable = () => {
    if (
      props.type === 'Greeting' ||
      props.type === 'Gratitude' ||
      props.type === 'Name'
    ) {
      return false
    } else {
      return true
    }
  }

  return (
    <div
      className="single-row"
      aria-label={`${
        isEssentialItem(props) ? 'essential parameter' : 'additional parameter'
      } ${props.type} ${
        isEssentialItem(props) ? common.sectionStatus[props.color] : ''
      } ${
        isEssentialItem(props)
          ? '. Essential information'
          : '. Additional information'
      } ${props.type} ${
        props.data.length > 0
          ? props.data.join(' ')
          : isEssentialItem(props)
          ? 'Not detected'
          : 'Can be added'
      }`}>
      <div className="category-column single-column data-col-label">
        {isEssentialItem(props) ? (
          <span className="mr-4">{getStatusIcon[props.color]}</span>
        ) : null}
        {props.type}
      </div>

      <div className="information-column single-column data-col-info text-14-normal">
        {props.data.length > 0 ? (
          <React.Fragment>
            <div style={{ width: 'calc(100% - 100px)' }}>
              {breakLine(props.data.join('<br />'))}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {isEssentialItem(props) ? (
              <React.Fragment>
                <span
                  className={classNames({
                    'grey-color': !highContrast,
                  })}>
                  Not detected!
                </span>

                {samplesAvailable() ? (
                  <div className="float-right">
                    <ViewSampleButton
                      tabIndex={props.tabIndex}
                      sentenceSamplesToggle={() => {
                        props.sentenceSamplesToggle(props.type)
                      }}
                    />
                  </div>
                ) : null}
              </React.Fragment>
            ) : (
              <span
                className={classNames({
                  'grey-color': !highContrast,
                })}>
                Can be added
              </span>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

var ViewSampleButton = props => {
  return (
    <button
      className="bluePrimaryTxt font-semibold"
      onClick={props.sentenceSamplesToggle}
      tabIndex={props.tabIndex}
      aria-label={`view samples`}>
      View Samples
    </button>
  )
}

class Competency extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      SentenceSamples: false,
      tabIndex: -1,
      type: 'Education',
    }
    this.sentenceSamplesToggle = this.sentenceSamplesToggle.bind(this)
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['sentence'],
      event_type: 'mount',
    })
  }

  trackFromRender = _.once(res => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['sentence'],
      event_type: 'render',
      event_description: 'sentence_analysis_combined_' + res,
    })
  })

  sentenceSamplesToggle(type) {
    this.setState({
      sentenceSamplesToggle: !this.state.sentenceSamplesToggle,
      type: type,
    })
  }

  displayAdditionalHeader(additionalArr) {
    if (additionalArr.length > 0) return true
    else return false
  }

  checker = () => {
    let { punctData } = this.props

    let greetingColor = null,
      nameColor = null,
      personalColor = null,
      educationColor = null,
      workexpColor = null,
      acheivementColor = null,
      interestColor = null,
      hobbyColor = null,
      gratitudeColor = null,
      porColor = null,
      punctVals = null,
      results = null

    let additionalArr = [],
      essentialArr = [],
      commonArr = []

    greetingColor = mutuals.validKey(punctData.category, 'greeting_result')
    nameColor = mutuals.validKey(punctData.category, 'name_result')
    personalColor = mutuals.validKey(punctData.category, 'personal_result')
    educationColor = mutuals.validKey(punctData.category, 'education_result')
    workexpColor = mutuals.validKey(punctData.category, 'workexp_result')
    acheivementColor = mutuals.validKey(
      punctData.category,
      'acheivement_result'
    )
    interestColor = mutuals.validKey(punctData.category, 'interest_result')
    hobbyColor = mutuals.validKey(punctData.category, 'hobby_result')
    gratitudeColor = mutuals.validKey(punctData.category, 'gratitude_result')
    porColor = mutuals.validKey(punctData.category, 'por_result')

    punctVals = mutuals.validKey(
      punctData.category,
      'category_results_individual'
    )
    results = mutualLogics.sentCal(punctVals)
    commonArr = [
      {
        id: 'greeting',
        type: 'Greeting',
        color: greetingColor,
        data: results.greetingArray,
      },
      {
        id: 'education',
        type: 'Education',
        color: educationColor,
        data: results.educationArray,
      },
      {
        id: 'work_experience',
        type: 'Experience',
        color: workexpColor,
        data: results.workexpArray,
      },
      {
        id: 'achievements',
        type: 'Achievements',
        color: acheivementColor,
        data: results.acheivementArray,
      },
      {
        id: 'professional_interests',
        type: 'Career Interests',
        color: interestColor,
        data: results.interestArray,
      },
      {
        id: 'gratitude',
        type: 'Gratitude',
        color: gratitudeColor,
        data: results.gratitudeArray,
      },
      {
        id: 'name',
        type: 'Name',
        color: nameColor,
        data: results.nameArray,
      },
      {
        id: 'personal_details',
        type: 'Personal Details',
        color: personalColor,
        data: results.personalArray,
      },
      {
        id: 'hobbies',
        type: 'Hobbies',
        color: hobbyColor,
        data: results.hobbyArray,
      },
      {
        id: 'por',
        type: 'POR',
        color: porColor,
        data: results.porArray,
      },
    ]

    let additionalMetaData = this.props.metaData.additional_section
    let essentialMetaData = this.props.metaData.essential_section

    commonArr.forEach((item, index) => {
      if (
        _.has(additionalMetaData, item.id) &&
        additionalMetaData[item.id]['is_enabled']
      ) {
        item.isEnabled = additionalMetaData[item.id]['is_enabled']
        item.order = additionalMetaData[item.id]['order_id']
        item.group = 'additional'
        additionalArr.push(item)
      }
      if (
        _.has(essentialMetaData, item.id) &&
        essentialMetaData[item.id]['is_enabled']
      ) {
        item.isEnabled = essentialMetaData[item.id]['is_enabled']
        item.order = essentialMetaData[item.id]['order_id']
        item.group = 'essential'
        essentialArr.push(item)
      }
    })

    function compare(a, b) {
      if (a.order < b.order) {
        return -1
      }
      if (a.order > b.order) {
        return 1
      }
      return 0
    }

    essentialArr = essentialArr.sort(compare)
    additionalArr = additionalArr.sort(compare)
    return { safeToRender: true, essentialArr, additionalArr }
  }

  render() {
    let { sentenceSamplesToggle, tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, punctData } = this.props
    let safeToRender = false
    let additionalArr = [],
      essentialArr = []
    let res

    if (!_.isEmpty(punctData)) {
      if (!_.isEmpty(punctData.category) && this.props.metaData) {
        res = this.checker()
        additionalArr = res.additionalArr
        essentialArr = res.essentialArr
        safeToRender = res.safeToRender
      }
    }

    return (
      <div>
        {combinedRes !== null && safeToRender ? (
          <div>
            <CapsulesSystem
              expandOrCollapse={this.state.capsulesExpandOrCollapse}
            />

            <button
              className="brand-blue-color"
              onClick={() => {
                this.setState({
                  capsulesExpandOrCollapse: !this.state
                    .capsulesExpandOrCollapse,
                })
              }}>
              click me
            </button>

            <NoDetectionAlert
              info={'No speech was detected in the interview.'}
              section={'verbals'}
              tabIndex={tabIndex}
            />

            <div
              id="start-of-content"
              role="main"
              className="clearfix information-content"
              tabIndex={common.tabIndexes.sentence}
              onKeyPress={e => {
                if (e.key === 'Enter' && tabIndex === -1) {
                  this.setState(
                    { tabIndex: common.tabIndexes.sentence },
                    () => {
                      try {
                        document
                          .querySelector(
                            '.information-content .onEnterFocusAda'
                          )
                          .focus()
                      } catch (e) {
                        console.error(e)
                      }
                    }
                  )
                }
              }}
              aria-label={`Information section. This section provides details to your performance. ${
                tabIndex === -1 ? 'Select to continue further' : ''
              }`}>
              <DetailInfoHeader
                label={'Competency'}
                img={sentenceAnalysisBig}
                alt={'competency info'}
                color={sectionColor[combinedRes.sentenceCombinedVal]}
                ariaLabel={`${
                  sectionStatus[combinedRes.sentenceCombinedVal]
                } in competency.`}
                status={sectionStatus[combinedRes.sentenceCombinedVal]}
                underMsg={sentenceMsgs[combinedRes.sentenceCombinedVal]}
              />

              <HeaderRow type={'Essential Section'} />

              {essentialArr.map((item, index) => {
                if (item.isEnabled) {
                  return (
                    <div key={index}>
                      <DataRow
                        tabIndex={tabIndex}
                        type={item.type}
                        color={item.color}
                        data={item.data}
                        group={item.group}
                        sentenceSamplesToggle={this.sentenceSamplesToggle}
                      />
                    </div>
                  )
                } else {
                  return null
                }
              })}

              {this.displayAdditionalHeader(additionalArr) ? (
                <div className="mt-12">
                  <HeaderRow type={'Additional Section*'} />
                </div>
              ) : null}

              {additionalArr.map((item, index) => {
                if (item.isEnabled) {
                  return (
                    <div key={index}>
                      <DataRow
                        tabIndex={tabIndex}
                        type={item.type}
                        color={item.color}
                        data={item.data}
                        group={item.group}
                        sentenceSamplesToggle={this.sentenceSamplesToggle}
                      />
                    </div>
                  )
                } else {
                  return null
                }
              })}

              {this.displayAdditionalHeader(additionalArr) ? (
                <div className="hintColor mt-6">
                  *Additional Section doesn’t contribute to scoring
                </div>
              ) : null}

              {sentenceSamplesToggle ? (
                <CompetencySamples
                  sentenceSamplesToggle={this.sentenceSamplesToggle}
                  epCustomizations={this.props.metaData}
                  type={this.state.type}
                  tabIndex={tabIndex}
                />
              ) : null}

              <div className="mt-6 para">
                Read more about which sentence to use and which ones to avoid
                from the Improvement Section.
              </div>
            </div>
          </div>
        ) : (
          <div className="clearfix loaderWrap">
            <Loader
              type={compLoader.type}
              active
              style={{ transform: compLoader.scale }}
            />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  let combinedRes = null

  if (!_.isEmpty(state.results)) {
    if (state.results.sentenceResults) {
      combinedRes = state.results.sentenceResults
    }
  }

  return {
    combinedRes: combinedRes,
    common: state.commonStuff,
    punctData: !_.isEmpty(state.punctuatorResults)
      ? state.punctuatorResults
      : null,
    epCustomizations: _.has(state.epCustomizations, 'sentence_analysis')
      ? state.epCustomizations.sentence_analysis
      : null,
    metaData: _.has(state.epCustomizations, 'sentence_analysis_details')
      ? state.epCustomizations.sentence_analysis_details
      : null,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Competency)
