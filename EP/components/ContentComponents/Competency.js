import React, { Component } from 'react'
import WordComponent from './WordComponent'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  mutuals,
  common,
  showCompetencyRevaluationModal,
} from '../../actions/commonActions'
import { mutualLogics } from '../../actions/mutualLogics'
import { competencyMsgs } from '../messages/messages'
import RevaluateContent from '../Revaluation/RevaluateContent'
import ContentRevaluation from '../Revaluation/ContentRevaluation'

import NoDetectionAlert from '../popups/NoDetectionAlert'
import { DetailInfoHeader } from '../commons/DetailHeader'
import MultiInfoLine from './MultiInfoLine'
import CompetencySamples from '../popups/CompetencySamples'

const infoHeaderBigImg =
  process.env.APP_PRODUCT_BASE_URL +
  '/dist/images/new/icons-big/competency-big.svg'

var Loader = require('react-loaders').Loader
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
  constructor() {
    super()
    this.state = {
      categories: {
        filler: false,
        specific: false,
        action: false,
        repetitive: false,
        negative: false,
        SentenceSamples: false,
        tabIndex: -1,
        type: 'Analytical',
      },
      firstItemShowCount: 0,
      tabIndex: -1,
    }
    this.toggleAll = this.toggleAll.bind(this)
    this.openFirstFilled = this.openFirstFilled.bind(this)
    this.sentenceSamplesToggle = this.sentenceSamplesToggle.bind(this)
  }

  trackFromRender = _.once(res => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['competency'],
      event_type: 'render',
      event_description: 'competency_combined',
    })
  })

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['competency'],
      event_type: 'mount',
    })
  }

  toggleAll(category) {
    let { categories } = this.state
    categories = mutuals.deepCopy(categories)
    for (let item in categories) {
      if (item === category) {
        continue
      }
      categories[item] = false
    }

    categories[category] = !categories[category]
    this.setState({ categories: categories })
  }

  openFirstFilled = _.once(category => {
    let { categories } = this.state
    categories = mutuals.deepCopy(categories)
    for (let item in categories) categories[item] = false
    categories[category] = true
    this.setState({ categories: categories })
  })

  sentenceSamplesToggle(type) {
    this.setState({
      sentenceSamplesToggle: !this.state.sentenceSamplesToggle,
      type: type,
    })
  }

  RevaluationBlock() {
    return (
      <div
        style={{
          position: 'absolute',
          left: 294,
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          background: 'rgba(0,0,0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}>
        <div
          className="mt-20 mx-auto bg-white rounded-sm p-10"
          style={{ width: 473 }}>
          <div className="text-24-bold text-center">
            In order to view feedback for soft skill section
          </div>
          <div className="mt-10 text-center">
            <ContentRevaluation />
          </div>
        </div>
      </div>
    )
  }

  render() {
    let { tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { punctData } = this.props
    let safeToRender = false,
      competencies = {},
      resultCombined = 0

    if (!_.isEmpty(punctData)) {
      competencies = punctData.competency.competency_results_individual
      resultCombined =
        punctData.competency.competency_results_overall.competency_combined_val
      safeToRender = true
    }

    return safeToRender ? (
      <div>
        {showCompetencyRevaluationModal() ? this.RevaluationBlock() : null}

        <NoDetectionAlert
          info={'No speech was detected in the interview.'}
          section={'verbals'}
          tabIndex={tabIndex}
        />

        <div
          id="start-of-content"
          role="main"
          ref="competencyContentWrap"
          className="clearfix information-content"
          aria-label={`Information section. This section provides details to your performance. ${
            tabIndex === -1 ? 'Select to continue further' : ''
          }`}
          tabIndex={common.tabIndexes.competency}
          onKeyPress={e => {
            if (e.key === 'Enter' && tabIndex === -1) {
              this.setState({ tabIndex: common.tabIndexes.competency }, () => {
                try {
                  document
                    .querySelector('.information-content .onEnterFocusAda')
                    .focus()
                } catch (e) {
                  console.error(e)
                }
              })
            }
          }}>
          <DetailInfoHeader
            tabIndex={tabIndex}
            label={'Soft Skills'}
            img={infoHeaderBigImg}
            alt={'Competency info'}
            color={sectionColor[resultCombined]}
            ariaLabel={`${sectionStatus[resultCombined]} in competency.`}
            status={sectionStatus[resultCombined]}
            underMsg={competencyMsgs[resultCombined]}
          />

          <div className="mt-6 text-18-demi">Essential Skils</div>
          <div className="text-14-normal hintColor pb-3 border-b">
            These soft skills are mandatory
          </div>

          {_.has(competencies, 'Analytical') ? (
            <MultiInfoLine
              data={{
                type: 'Analytical',
                label: 'Analytical',
                categories: competencies['Analytical']['categories'],
                content: competencies['Analytical']['content'],
              }}
              sentenceSamplesToggle={this.sentenceSamplesToggle}
            />
          ) : null}

          {_.has(competencies, 'Communication') ? (
            <MultiInfoLine
              data={{
                type: 'Communication',
                label: 'Communication',
                categories: competencies['Communication']['categories'],
                content: competencies['Communication']['content'],
              }}
              sentenceSamplesToggle={this.sentenceSamplesToggle}
            />
          ) : null}

          <div className="text-18-demi mt-10">Additional Skills</div>

          <div className="text-14-normal hintColor pb-3 border-b">
            Minimum 1 soft skill is mandatory
          </div>

          {_.has(competencies, 'Initiative') ? (
            <MultiInfoLine
              data={{
                type: 'Initiative',
                label: 'Initiative',
                categories: competencies['Initiative']['categories'],
                content: competencies['Initiative']['content'],
              }}
              sentenceSamplesToggle={this.sentenceSamplesToggle}
              additional
            />
          ) : null}

          {_.has(competencies, 'Leadership') ? (
            <MultiInfoLine
              data={{
                type: 'Leadership',
                label: 'Leadership',
                categories: competencies['Leadership']['categories'],
                content: competencies['Leadership']['content'],
              }}
              sentenceSamplesToggle={this.sentenceSamplesToggle}
              additional
            />
          ) : null}

          {_.has(competencies, 'Teamwork') ? (
            <MultiInfoLine
              data={{
                type: 'Teamwork',
                label: 'Teamwork',
                categories: competencies['Teamwork']['categories'],
                content: competencies['Teamwork']['content'],
              }}
              sentenceSamplesToggle={this.sentenceSamplesToggle}
              additional
            />
          ) : null}

          {this.state.sentenceSamplesToggle ? (
            <CompetencySamples
              sentenceSamplesToggle={this.sentenceSamplesToggle}
              epCustomizations={this.props.metaData}
              type={this.state.type}
              tabIndex={tabIndex}
            />
          ) : null}

          <div className="grid-2-cols mt-12" style={{ gridGap: 6 }}>
            <div className="border-gray p-8 text-center">
              <RevaluateContent tabIndex={tabIndex} />
            </div>

            <div className="border-gray p-8 text-center">
              <p className="hintColor">
                View sample sentence within each category to improve your
                performance
              </p>

              <div className="mt-6">
                <ViewSampleButton
                  tabIndex={tabIndex}
                  sentenceSamplesToggle={this.sentenceSamplesToggle}
                />
              </div>
            </div>
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
    )
  }
}

const mapStateToProps = state => {
  return {
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
    isCompetencyProcessed: state.interviewEP.basicData.is_competency_processed,
    customizationsEP: state.epCustomizations,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Competency)
