import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Panel, Accordion } from 'react-bootstrap'
import classNames from 'classnames'
import _ from 'underscore'
import GuidancePanel from './GuidancePanel'

export default class SubModule extends Component {
  constructor(props) {
    super(props)
    this.colorToIconMapping = {
      green: <span className="fa fa-check" aria-hidden="true" />,
      yellow: <span className="fa fa-exclamation" aria-hidden="true" />,
      red: <span className="fa fa-times" aria-hidden="true" />,
    }
    this.colorToFeedbackHeadingMapping = {
      green: 'Looks Good!',
      yellow: 'On Track!',
      red: 'Needs Work!',
    }
    this.subModuleMapping = {
      buzzwords: ['Avoided words ', 'words'],
      verb_overusage: ['Overused words ', 'words'],
      specifics: ['Specifics ', 'number'],
      action_oriented: ['Action oriented sentences ', 'sentences'],
      narrative_voice: ['Narrative voice ', 'sentences'],
      tense: ['Tense consistency ', 'sentences'],
    }
    this.iconsMappingForSubModuleHeading = {
      buzzwords: `${process.env.APP_BASE_URL}dist/images/edit-screens/avoided.svg`,
      verb_overusage: `${process.env.APP_BASE_URL}dist/images/edit-screens/overusage.svg`,
      specifics: `${process.env.APP_BASE_URL}dist/images/edit-screens/specifics.svg`,
      action_oriented: `${process.env.APP_BASE_URL}dist/images/edit-screens/action.svg`,
      narrative_voice: `${process.env.APP_BASE_URL}dist/images/edit-screens/voice.svg`,
      tense: `${process.env.APP_BASE_URL}dist/images/edit-screens/tense.svg`,
    }
    this.getWordsBlockIfModuleBuzzwordsOrOverusage = this.getWordsBlockIfModuleBuzzwordsOrOverusage.bind(
      this
    )
  }

  getWordsBlockIfModuleBuzzwordsOrOverusage() {
    const {
      subModule,
      overusageWordsList,
      suggestionsList,
      buzzwordsList,
    } = this.props
    if (subModule == 'buzzwords') {
      if (_.size(buzzwordsList) > 0) {
        return (
          <div className="as-buzzwords-list-wrapper">
            <div className="as-buzzwords-suggestions-heading">
              <span
                tabIndex={0}
                aria-label={'Below are the words that could be avoided'}>
                Words that could be avoided :
              </span>
            </div>
            <div
              className="as-buzzwords-list"
              tabIndex={0}
              aria-label={buzzwordsList.join(', ')}>
              {buzzwordsList.join(', ')}
            </div>
          </div>
        )
      }
    } else if (subModule == 'verb_overusage') {
      let suggestions = null
      // if(_.size(suggestionsList) > 0){
      //   suggestions = (
      //     <div>
      //       <div className="as-overusage-suggestions-heading">Possible suggestions :</div>
      //       <div className="as-overusage-suggestions-list">{suggestionsList.join(", ")}</div>
      //     </div>
      //   )
      // }

      if (_.size(overusageWordsList) > 0) {
        return (
          <div className="as-overusage-list-wrapper">
            <div className="as-overusage-suggestions-heading">
              <span tabIndex={0} aria-label="Below are the Over used words">
                Over used words :
              </span>
            </div>
            <div
              className="as-overusage-list"
              tabIndex={0}
              aria-label={overusageWordsList.join(', ')}>
              {overusageWordsList.join(', ')}
            </div>
            {suggestions}
          </div>
        )
      }
    }

    return null
  }

  getDynamicFeedbackText() {
    const { subModule, feedbackText, color } = this.props
    if (subModule == 'buzzwords' || subModule == 'verb_overusage') {
      if (color != 'green') {
        return null
      }
    }

    return (
      <div className="as-guide-submodule-feedback-text">
        <span tabIndex={0} aria-label={feedbackText}>
          {feedbackText}
        </span>
      </div>
    )
  }

  getAriaLabel() {
    const {
      currentIndex,
      module,
      subModule,
      checkboxState,
      type,
      color,
      sectionsEntitiesToHighlight,
      dynamicEntitiesToHighlight,
    } = this.props

    let ariaLabel = []
    let highlightingValues = []
    if (type == 'dynamic') {
      highlightingValues =
        dynamicEntitiesToHighlight[subModule]['highlightValues']
    } else {
      highlightingValues =
        sectionsEntitiesToHighlight[module][subModule][currentIndex]['text']
    }

    if (!checkboxState) {
      let label = this.colorToFeedbackHeadingMapping[color]
      let text = `${
        this.subModuleMapping[subModule][0]
      } ${label} Click to know more.`
      return text
    }

    _.map(highlightingValues, (value, key) => {
      if (ariaLabel.indexOf(value['text']) == -1) {
        if (key == 0) {
          ariaLabel.push(
            `${this.subModuleMapping[subModule][0]} Detected from following ${
              this.subModuleMapping[subModule][1]
            }. First `
          )
        } else {
          ariaLabel.push('next ')
        }
        ariaLabel.push(value['text'])
      }
    })

    return ariaLabel.join(', ')
  }

  render() {
    const {
      module,
      subModule,
      heading,
      staticText,
      feedbackText,
      color,
      checkboxDisabled,
      checkboxState,
      handleClick,
      type,
      handleGuidanceToggle,
      isGuidanceOpen,
      guidanceCorrectWayText,
      guidanceIncorrectWayText,
      guidanceCorrectWayAriaLabel,
      guidanceIncorrectWayAriaLabel,
    } = this.props
    let switchBlock = null
    let switchSupportTextBlock = null
    let switchBlockOld = null
    if (!checkboxDisabled) {
      let label = this.getAriaLabel()
      switchBlock = (
        <div
          className={classNames(
            'as-guide-submodule-feedback-switch-wrapper switch',
            {
              'add-opacity': checkboxDisabled,
            }
          )}>
          <button
            tabIndex={0}
            aria-label={label}
            disabled={checkboxDisabled}
            checked={checkboxState}
            onClick={() => handleClick(module, subModule, type)}
            className={classNames({ 'edit-toggle-checked': checkboxState })}>
            <span
              className={classNames('slider round', {
                'as-checkbox-not-checked': !checkboxState,
              })}
            />
          </button>
        </div>
      )

      switchSupportTextBlock = (
        <div
          className={classNames('as-guide-submodule-show-text', {
            'as-guide-submodule-show-text-disabled': checkboxDisabled,
          })}>
          {checkboxState == true ? <span>Hide</span> : <span>Show</span>}
        </div>
      )
    }
    return (
      <div className="as-guide-submodule-container">
        <div className="as-all-lists-heading-wrapper">
          <div className="as-all-lists-heading-img-wrapper">
            <img
              alt=""
              src={this.iconsMappingForSubModuleHeading[subModule]}
              className="as-all-lists-heading-img"
            />{' '}
          </div>
          <div className="as-all-lists-heading-text">
            <span tabIndex={0} aria-label={`about ${heading}`}>
              {heading}
            </span>
          </div>
        </div>
        <div className="as-guide-submodule-subtext">{staticText}</div>
        <div className="as-guide-submodule-feedback-box">
          <div className="as-guide-submodule-feedback-top-wrapper">
            <div
              className={classNames(
                'as-guide-submodule-feedback-icon',
                'as-checked-' + color
              )}>
              {this.colorToIconMapping[color]}
            </div>
            <div
              className={classNames(
                'as-guide-submodule-feedback-heading',
                'text-' + color
              )}>
              {this.colorToFeedbackHeadingMapping[color]}
            </div>
            {switchBlock}
            {switchSupportTextBlock}
          </div>
          {this.getDynamicFeedbackText()}
          {this.getWordsBlockIfModuleBuzzwordsOrOverusage()}
        </div>
        <div className="as-guidance-border" />
        <GuidancePanel
          subModule={subModule}
          heading="Guidance"
          isOpen={isGuidanceOpen}
          handleGuidanceToggle={handleGuidanceToggle}
          correctWayText={guidanceCorrectWayText}
          incorrectWayText={guidanceIncorrectWayText}
          correctWayAriaLabel={guidanceCorrectWayAriaLabel}
          incorrectWayAriaLabel={guidanceIncorrectWayAriaLabel}
          type={type}
        />
      </div>
    )
  }
}
