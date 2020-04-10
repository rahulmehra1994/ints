import React, { Component } from 'react'
import WordComponent from './WordComponent'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals, common } from '../../actions/commonActions'
import { mutualLogics } from '../../actions/mutualLogics'
import { wordMsgs } from '../messages/messages'
import RevaluateContent from '../Revaluation/RevaluateContent'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import { DetailInfoHeader } from '../commons/DetailHeader'

const wordUsageBig =
  process.env.APP_BASE_URL + '/dist/images/new/icons-big/word-usage-big.svg'

var Loader = require('react-loaders').Loader

class WordUsage extends Component {
  constructor() {
    super()
    this.state = {
      categories: {
        filler: false,
        specific: false,
        action: false,
        repetitive: false,
        negative: false,
      },
      firstItemShowCount: 0,
      tabIndex: -1,
    }
    this.toggleAll = this.toggleAll.bind(this)
    this.openFirstFilled = this.openFirstFilled.bind(this)
  }

  trackFromRender = _.once(res => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['word'],
      event_type: 'render',
      event_description: 'word_usage_combined_' + res,
    })
  })

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['word'],
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

  render() {
    let { tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, punctData } = this.props

    let repetitive_words = [],
      discourse_markers = [],
      specific_words = [],
      negative_words = [],
      action_words = []

    let color_repetitive_words
    let color_discourse_markers
    let color_specific_words
    let color_negative_words
    let color_action_words
    let safeToRender = false

    if (!_.isEmpty(punctData)) {
      if (!_.isEmpty(punctData.content)) {
        repetitive_words = mutualLogics.wordUsageCal(
          punctData.content.content_results_individual
        ).repetitive_words
        discourse_markers = mutualLogics.wordUsageCal(
          punctData.content.content_results_individual
        ).discourse_markers
        specific_words = mutualLogics.wordUsageCal(
          punctData.content.content_results_individual
        ).specific_words
        action_words = mutualLogics.wordUsageCal(
          punctData.content.content_results_individual
        ).action_words
        negative_words = mutualLogics.wordUsageCal(
          punctData.content.content_results_individual
        ).negative_words

        color_repetitive_words = mutuals.validKey(
          punctData.content,
          'repetitive_words_result'
        )
        color_discourse_markers = mutuals.validKey(
          punctData.content,
          'discourse_markers_result'
        )
        color_specific_words = mutuals.validKey(
          punctData.content,
          'specific_words_result'
        )
        color_negative_words = mutuals.validKey(
          punctData.content,
          'negative_words_result'
        )
        color_action_words = mutuals.validKey(
          punctData.content,
          'action_words_result'
        )
        safeToRender = true
      }
    }

    return combinedRes !== null && safeToRender ? (
      <div>
        <NoDetectionAlert
          info={'No speech was detected in the interview.'}
          section={'verbals'}
          tabIndex={tabIndex}
        />

        <div
          id="start-of-content"
          role="main"
          ref="wordContentWrap"
          className="clearfix information-content"
          aria-label={`Information section. This section provides details to your performance. ${
            tabIndex === -1 ? 'Select to continue further' : ''
          }`}
          tabIndex={common.tabIndexes.word}
          onKeyPress={e => {
            if (e.key === 'Enter' && tabIndex === -1) {
              this.setState({ tabIndex: common.tabIndexes.word }, () => {
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
            label={'Word Usage'}
            img={wordUsageBig}
            alt={'word usage info'}
            color={sectionColor[combinedRes.wordCombinedVal]}
            ariaLabel={`${
              sectionStatus[combinedRes.wordCombinedVal]
            } in word usage.`}
            status={sectionStatus[combinedRes.wordCombinedVal]}
            underMsg={wordMsgs[combinedRes.wordCombinedVal]}
          />

          <WordComponent
            type="Filler words"
            results={discourse_markers}
            status={color_discourse_markers}
            goodrange={'<3'}
            categories={this.state.categories}
            category={'filler'}
            toggleAll={this.toggleAll}
            openFirstFilled={this.openFirstFilled}
            tabIndex={tabIndex}
          />
          <WordComponent
            type="Specifics"
            results={specific_words}
            status={color_specific_words}
            goodrange={'3+'}
            categories={this.state.categories}
            category={'specific'}
            toggleAll={this.toggleAll}
            openFirstFilled={this.openFirstFilled}
            tabIndex={tabIndex}
          />
          <WordComponent
            type="Action oriented terms"
            results={action_words}
            status={color_action_words}
            goodrange={'3+'}
            categories={this.state.categories}
            category={'action'}
            toggleAll={this.toggleAll}
            openFirstFilled={this.openFirstFilled}
            tabIndex={tabIndex}
          />
          <WordComponent
            type="Repetitive terms"
            results={repetitive_words}
            status={color_repetitive_words}
            goodrange={'0'}
            categories={this.state.categories}
            category={'repetitive'}
            toggleAll={this.toggleAll}
            openFirstFilled={this.openFirstFilled}
            tabIndex={tabIndex}
          />
          <WordComponent
            type="Negative terms"
            results={negative_words}
            status={color_negative_words}
            goodrange={'0'}
            categories={this.state.categories}
            category={'negative'}
            toggleAll={this.toggleAll}
            openFirstFilled={this.openFirstFilled}
            tabIndex={tabIndex}
          />

          <div className="mt-10 clearfix text-center">
            <RevaluateContent tabIndex={tabIndex} />
          </div>

          <div className="mt-6 para clearfix">
            Read more about which words to use and which ones to avoid in your
            pitch from the Improvement Section.
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
  let combinedRes = null

  if (!_.isEmpty(state.results)) {
    if (state.results.wordResults) {
      combinedRes = state.results.wordResults
    }
  }

  return {
    combinedRes: combinedRes,
    common: state.commonStuff,
    punctData: !_.isEmpty(state.punctuatorResults)
      ? state.punctuatorResults
      : null,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordUsage)
