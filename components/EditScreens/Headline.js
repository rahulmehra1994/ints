import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import classNames from 'classnames'
import HighlightedTextarea from './HighlightedTextarea'
import { charCountLimit } from './index'
import HeadlineEducationSkillsContent from './Guides/HeadlineEducationSkillsContent'
import { checkIfEmpty } from '../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import Loader from '../Loader'
import { updateEditDynamicDataState } from '../../actions/AspireEditDynamicData'
import { editModalAriaLabel } from '../Constants/AriaLabelText'

const placeholders = {
  text: 'Enter headline',
}

const categoryLabels = {
  certifications: 'Certifications',
  education_current: 'Current education',
  education_opportunity: 'Seeking opportunity',
  education_prev_current: 'Education',
  experience: 'Current experience',
  latest_experience_club: 'Club',
  latest_experience_degree: 'Degree',
  opportunity: 'Seeking opportunity',
  past_relevant_job_role: 'Job role',
  skills: 'Top relevant skills',
}

class Headline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPresentCategory: '',
      selectedSkill: '',
      focused: {
        text: false,
      },
      checkbox: {
        tense: false,
        narrative_voice: false,
        buzzwords: false,
        verb_overusage: false,
        action_oriented: false,
        specifics: false,
      },
      textValue: '',
      headlineSuggestionsIndex: 0,
    }
    this.suggestionsLength = 0
    this.suggestions = []
    this.headlineSuggestionText = []
    this.pdfModal = null
    this.legendArr = []
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.updateCheckboxState = this.updateCheckboxState.bind(this)
    this.handleUndoClick = this.handleUndoClick.bind(this)
    this.highlightValues = this.highlightValues.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCloseButton = this.handleCloseButton.bind(this)
    this.setSelectedSkill = this.setSelectedSkill.bind(this)
    this.setSelectedPresentCategory = this.setSelectedPresentCategory.bind(this)
    this.headlineCharsRemaining = charCountLimit['headline']['text']
    this.sendTrackingDataDebounceSample = _.debounce(
      sendTrackingData,
      3000,
      true
    )
    this.sendTrackingDataDebounceUndo = _.debounce(sendTrackingData, 3000, true)
  }

  UNSAFE_componentWillMount() {
    this.headlineSuggestions(this.props.feedback['suggestions'])
    this.getTextFromSuggestion(this.props.feedback['suggestions'])
    let text = ''
    if (
      this.props.sectionWiseTextEditable[this.props.currentIndex]['text'] !==
      'N/A'
    ) {
      text = this.props.sectionWiseTextEditable[this.props.currentIndex]['text']
    }
    this.headlineCharsRemaining =
      charCountLimit['headline']['text'] - text.length
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.updateEditSection === true) {
      this.setState({
        textValue:
          nextProps.sectionWiseTextEditable[nextProps.currentIndex]['text'],
      })
    }
    if (
      nextProps['feedback'].hasOwnProperty('suggestions') &&
      nextProps['feedback']['suggestions'].hasOwnProperty('headlineSamples')
    ) {
      if (
        JSON.stringify(nextProps.feedback['suggestions']['headlineSamples']) !==
        JSON.stringify(this.props.feedback['suggestions']['headlineSamples'])
      ) {
        this.headlineSuggestions(nextProps.feedback['suggestions'])
        this.getTextFromSuggestion(nextProps.feedback['suggestions'])
      }
    }
    this.props.underlineEntitySpellError()
  }

  setSelectedSkill(skill) {
    this.setState({ selectedSkill: skill })
  }

  setSelectedPresentCategory(category) {
    this.setState({ selectedPresentCategory: category })
  }

  handleChange(e) {
    const value = e.target.value
    this.props.handleOnChangeData(
      'headline',
      this.props.currentIndex,
      'text',
      value
    )
    this.setState({
      textValue: this.props.sectionWiseTextEditable[this.props.currentIndex][
        'text'
      ],
    })
    let charsRemainingCount = -1
    if (
      charCountLimit.hasOwnProperty('headline') &&
      charCountLimit['headline'].hasOwnProperty('text')
    ) {
      charsRemainingCount = charCountLimit['headline']['text'] - value.length
    }

    this.headlineCharsRemaining = charsRemainingCount
  }

  handleUndoClick() {
    const { currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'undo_changes_btn',
      currentSection: 'Headline',
      currentIndex: currentIndex,
    }

    this.sendTrackingDataDebounceUndo(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.props.handleUndoData('headline', this.props.currentIndex)
  }

  handleFocus(field, e) {
    e.preventDefault()
    let focused = this.state.focused

    for (let i in focused) {
      if (i == field) {
        focused[i] = true
      } else {
        focused[i] = false
      }
    }

    let checkbox = {
      tense: false,
      narrative_voice: false,
      buzzwords: false,
      verb_overusage: false,
      action_oriented: false,
      specifics: false,
    }

    this.setState({
      focused: focused,
      checkbox: checkbox,
      selectedPresentCategory: '',
    })
  }

  handleBlur(field) {
    let focused = this.state.focused
    focused[field] = false
    this.setState({ focused: focused })
  }

  handleCloseButton() {
    const {
      handleUndoData,
      currentIndex,
      hideEditModal,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
    } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'close_btn',
      currentSection: 'Headline',
      currentIndex: currentIndex,
    }
    sendTrackingData(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    hideEditModal(
      'headline',
      currentIndex,
      sectionWiseTextEditable,
      sectionWiseTextStatic
    )
  }

  renderPlaceholder(text, field) {
    if (!_.isEmpty(text)) {
      return text
    }

    return <span className="placeholder-color">{placeholders[field]}</span>
  }

  updateCheckboxState(checkbox) {
    this.setState({ checkbox: checkbox })
  }

  handleClick(e) {
    const { handleSaveChanges } = this.props
    handleSaveChanges()
  }

  highlightValues(input) {
    return this.props.highlightableDivWords
  }

  renderEntityText(entity) {
    const { loaderInput } = this.props

    let fieldDisabled = false
    if (!_.isEmpty(loaderInput)) {
      fieldDisabled = true
    }

    if (entity == 'text') {
      let { sectionWiseTextEditable, currentIndex } = this.props
      let text = ''
      if (
        this.props.sectionWiseTextEditable[this.props.currentIndex]['text'] !==
        'N/A'
      ) {
        text = this.props.sectionWiseTextEditable[this.props.currentIndex][
          'text'
        ]
      }

      return (
        <div className="edit-headline">
          <HighlightedTextarea
            name="text"
            label="Headline"
            highlight={this.highlightValues}
            value={text}
            placeholder={placeholders['text']}
            onFocus={e => this.handleFocus('text', e)}
            onBlur={() => this.handleBlur('text')}
            onChange={this.handleChange}
            disabled={fieldDisabled}
          />
          <span className="education-chars-remain">
            {this.headlineCharsRemaining}
          </span>
        </div>
      )
    }
  }

  prevSample() {
    const { currentIndex } = this.props
    if (this.state.headlineSuggestionsIndex > 0) {
      let jsonObjectForTracking = {
        eventLabel: 'previous_sample_btn',
        currentSection: 'Headline',
        currentIndex: currentIndex,
        currentSampleIndex: this.state.index,
      }
      this.sendTrackingDataDebounceSample(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState(prevState => ({
        headlineSuggestionsIndex: prevState.headlineSuggestionsIndex - 1,
      }))
    }
  }

  nextSample(len) {
    const { currentIndex } = this.props
    if (this.state.headlineSuggestionsIndex < len - 1) {
      let jsonObjectForTracking = {
        eventLabel: 'next_sample_btn',
        currentSection: 'Headline',
        currentIndex: currentIndex,
        currentSampleIndex: this.state.index,
      }
      this.sendTrackingDataDebounceSample(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState(prevState => ({
        headlineSuggestionsIndex: prevState.headlineSuggestionsIndex + 1,
      }))
    }
  }

  getTextFromSuggestion(suggestions2) {
    if (_.isEmpty(suggestions2)) {
      return
    }

    let maxCount = 4
    let suggestions = [].concat(suggestions2['suggestions_text'])
    suggestions = suggestions.slice(0, maxCount)

    this.headlineSuggestionText = suggestions
  }

  headlineSuggestions(suggestions2) {
    if (_.isEmpty(suggestions2)) {
      return
    }

    let maxCount = 4
    let suggestions = [].concat(suggestions2['suggestions'])
    suggestions = suggestions.slice(0, maxCount)
    let legend = [].concat(suggestions2['legend'])
    legend = legend.slice(0, maxCount)
    this.suggestionsLength = suggestions.length
    let pdfModal = []
    const { processingStatus, has_pdf } = this.props

    let legendArr = {}
    let temp = []
    for (let index in legend) {
      legendArr[index] = []

      for (let i in legend[index]) {
        temp.push(
          <span
            className={classNames(
              'margin-r-3',
              { 'pull-left': i % 2 == 0 },
              { 'pull-left': i % 2 == 1 }
            )}>
            <span className={'headline-suggestion'}>&nbsp; &nbsp;</span>
            {'  ' + categoryLabels[legend[index][i]]}
          </span>
        )
        if (i % 3 == 2) {
          legendArr[index].push(<div>{temp}</div>)
          legendArr[index].push(<br />)
          temp = []
        }
      }

      if (!_.isEmpty(temp)) {
        legendArr[index].push(<div>{temp}</div>)
        legendArr[index].push(<br />)
        temp = []
      }
    }

    if (has_pdf != '1') {
      if (processingStatus == 'processing' || _.isNull(processingStatus)) {
        pdfModal.push(
          <div className="headline-pdf-modal-msg">
            <b>Upload full profile for better headline suggestions</b>
          </div>
        )
      } else {
        pdfModal.push(
          <div className="headline-pdf-modal-msg">
            <b>Upload full profile for better headline suggestions</b>
          </div>
        )
      }
    }

    this.suggestions = suggestions
    this.pdfModal = pdfModal
    this.legendArr = legendArr
  }

  getModule(module) {
    const {
      currentIndex,
      newSubSection,
      highlightEntityText,
      unhighlightAll,
      fetchId,
      allCapsResume,
      allSmallResume,
      normalResume,
      getDynamicEditFeedbackForModule,
      feedback,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
      derivedSkills,
      sectionsPerSkill,
      resumeSkillsInLinkedin,
    } = this.props

    let isEdited = true
    if (_.isString(currentIndex) && currentIndex.substr(-4) === '_new') {
      if (!checkIfEmpty(sectionWiseTextEditable[currentIndex], 'headline')) {
        isEdited = true
      } else {
        isEdited = false
      }
    } else if (
      JSON.stringify(sectionWiseTextEditable[currentIndex]) ===
      JSON.stringify(sectionWiseTextStatic[currentIndex])
    ) {
      isEdited = false
    }

    return (
      <HeadlineEducationSkillsContent
        module={module}
        isEdited={isEdited}
        resumeCategories={feedback['categories_in_resume_not_in_linkedin']}
        data={feedback['categories']}
        staticSkillsData={feedback['skills']}
        derivedSkills={derivedSkills}
        sectionsPerSkill={sectionsPerSkill}
        resumeSkillsInLinkedin={resumeSkillsInLinkedin}
        categoriesMissing={feedback['categories_missing']}
        selectedPresentCategory={this.state.selectedPresentCategory}
        setSelectedPresentCategory={this.setSelectedPresentCategory}
        fetchId={fetchId}
        newSubSection={newSubSection}
        currentSection="Headline"
        currentIndex={currentIndex}
        highlightEntityText={highlightEntityText}
        unhighlightAll={unhighlightAll}
        getDynamicEditFeedbackForModule={getDynamicEditFeedbackForModule}
      />
    )
  }

  handleDotClick(index) {
    const { currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'sample_dot_clicked',
      currentSection: 'Headline',
      currentIndex: currentIndex,
      clickedSampleIndex: index,
    }
    this.sendTrackingDataDebounceSample(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.setState({ headlineSuggestionsIndex: index })
  }

  getIndicatorDots(index, len) {
    let dots = []
    for (let i = 0; i < len; i++) {
      if (i == index) {
        dots.push(
          <div className="as-headline-suggestions-indicator-dots as-headline-suggestions-indicator-dots-light" />
        )
      } else {
        dots.push(
          <div
            className="as-headline-suggestions-indicator-dots as-headline-suggestions-indicator-dots-dark"
            onClick={() => this.handleDotClick(i)}
          />
        )
      }
    }

    return <div className="as-sample-indicator">{dots}</div>
  }

  getPreviousButton(index, len) {
    if (index !== 0) {
      return (
        <button
          tabIndex={0}
          aria-label={editModalAriaLabel['previous_sample']}
          className="as-headline-suggestions-btn as-headline-suggestions-btn-prev"
          onClick={() => this.prevSample()}>
          <span className="glyphicon glyphicon-chevron-left as-sample-arrow" />
        </button>
      )
    } else {
      return (
        <div className="as-headline-suggestions-btn as-headline-suggestions-btn-prev disabled">
          <span className="glyphicon glyphicon-chevron-left as-sample-arrow" />
        </div>
      )
    }
  }

  getNextButton(index, len) {
    if (index !== len - 1) {
      return (
        <button
          tabIndex={0}
          aria-label={editModalAriaLabel['next_sample']}
          className="as-headline-suggestions-btn as-headline-suggestions-btn-next"
          onClick={() => this.nextSample(len)}>
          <span className="glyphicon glyphicon-chevron-right as-sample-arrow" />
        </button>
      )
    } else {
      return (
        <div className="as-headline-suggestions-btn as-headline-suggestions-btn-next disabled">
          <span className="glyphicon glyphicon-chevron-right as-sample-arrow" />
        </div>
      )
    }
  }

  render() {
    const {
      loaderInput,
      currentIndex,
      newSubSection,
      hideEditModal,
      sectionWiseText,
      sectionWiseTextStatic,
      sectionWiseTextEditable,
      highlightEntityText,
      unhighlightAll,
      feedback,
      handleSaveChanges,
      handleUndoData,
      fetchId,
    } = this.props

    let saveButton = (
      <button
        tabIndex={0}
        aria-label={editModalAriaLabel['save']}
        className="btn btn-primary btn-save-changes"
        onClick={() => this.handleClick()}>
        Save Changes
      </button>
    )
    if (!_.isEmpty(loaderInput)) {
      saveButton = (
        <button
          tabIndex={0}
          aria-label={editModalAriaLabel['saving']}
          className="btn btn-primary btn-save-changes cusrsor-not-allowed"
          disabled>
          Saving ...
        </button>
      )
    }

    let undoButton = null
    if (
      !(
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ===
          JSON.stringify(sectionWiseTextStatic[currentIndex]) ||
        !_.isEmpty(loaderInput)
      )
    ) {
      undoButton = (
        <button
          tabIndex={0}
          aria-label={editModalAriaLabel['reset']}
          className="btn btn-undo-changes"
          onClick={this.handleUndoClick}>
          Reset
        </button>
      )
    }

    let editOrAdd =
      !_.isUndefined(currentIndex) &&
      _.isString(currentIndex) &&
      currentIndex.substr(-4) === '_new'
        ? 'Add'
        : 'Edit'

    let headlineSuggestions = null
    if (this.suggestionsLength > 0) {
      headlineSuggestions = (
        <div className="as-headline-sample-outer-wrapper">
          <div className="as-all-lists-heading-wrapper">
            <div className="as-all-lists-heading-img-wrapper">
              <img
                alt=""
                src={`${process.env.APP_BASE_URL}dist/images/edit-screens/headline-sample-heading-icon.svg`}
                className="as-all-lists-heading-img"
              />{' '}
            </div>
            <div
              className="as-all-lists-heading-text"
              tabIndex={0}
              aria-label={editModalAriaLabel['Headline']['headline']}>
              Headline suggestions basis your profile
            </div>
          </div>
          <div className="as-sample-wrapper as-sample-wrapper-headline">
            <div className="as-sample-example as-sample-example-headline">
              <div
                tabIndex={0}
                aria-label={
                  this.headlineSuggestionText[
                    this.state.headlineSuggestionsIndex
                  ]
                }
                className="as-sample-example-text-headline"
                id="scrollItToTop">
                {this.suggestions[this.state.headlineSuggestionsIndex]}
              </div>
              <div className="as-sample-bottom-headline">
                <div className="as-sample-bottom-buttons-headline">
                  {this.getPreviousButton(
                    this.state.headlineSuggestionsIndex,
                    this.suggestionsLength
                  )}
                  {this.getIndicatorDots(
                    this.state.headlineSuggestionsIndex,
                    this.suggestionsLength
                  )}
                  {this.getNextButton(
                    this.state.headlineSuggestionsIndex,
                    this.suggestionsLength
                  )}
                </div>
                <div className="clearfix" />
              </div>
            </div>
          </div>
        </div>
      )
    }

    // calculation for focused state and black overlay
    let blackOverlayClass = ''
    let editFocusedClass = ''

    if (!_.isEmpty(this.props.loaderInput)) {
      blackOverlayClass = 'as-edit-overlay-none'
      editFocusedClass = 'as-edit-focused-none'
      $('.edit-headline .hwt-content').css('font-size', '16px')
      $('.edit-headline .hwt-content').css('line-height', '24px')
    } else if (this.state.focused.text) {
      blackOverlayClass = 'as-edit-overlay-none as-edit-overlay-black'
      editFocusedClass = 'as-edit-focused-none as-edit-focused-black'
      $('.edit-headline .hwt-content').css('font-size', '20px')
      $('.edit-headline .hwt-content').css('line-height', '30px')
    } else {
      blackOverlayClass = 'as-edit-overlay-none'
      editFocusedClass = 'as-edit-focused-none'
      $('.edit-headline .hwt-content').css('font-size', '16px')
      $('.edit-headline .hwt-content').css('line-height', '24px')
    }

    let warningText =
      '* The changes you perform will not be reflected to LinkedIn'
    let hideWarningText =
      JSON.stringify(sectionWiseTextEditable[currentIndex]) ===
      JSON.stringify(sectionWiseTextStatic[currentIndex])
        ? true
        : false

    return (
      <div className="as-edit-wrapper as-shadow">
        <div className={blackOverlayClass} />
        <Loader sectionName="Headline" />
        <div className="as-edit-heading-wrapper">
          <a
            href="javascript:void(0);"
            aria-label={editModalAriaLabel['close']}
            className="icon-cross as-edit-close-btn modal-close-button"
            onClick={this.handleCloseButton}
          />
          <div className="as-edit-heading">{editOrAdd} Headline</div>
        </div>
        <div className="as-eq-height-row">
          <div className="as-edit-container-left as-eq-height-col">
            <div className="as-edit-suggestions-heading">
              <span
                tabIndex={0}
                aria-label={editModalAriaLabel['Headline']['suggestion_edit']}>
                Suggestions for editing
              </span>
            </div>
            <div className="as-edit-card-headline-education">
              {headlineSuggestions}
            </div>
            {this.getModule('content')}
            {this.getModule('skills')}
          </div>
          <div
            className="as-edit-container-right as-eq-height-col as-headline-container"
            id="vertical-scroll">
            <div className={editFocusedClass}>
              <div className="as-section-heading">Headline</div>
              <div className="as-edit-inputs-row-headline">
                <div className="as-edit-inputs-col-headline max-tall">
                  {this.renderEntityText('text')}
                </div>
                <div
                  className={classNames('editing-warning-text', {
                    'display-none': hideWarningText,
                  })}>
                  {warningText}{' '}
                </div>
                <div className="as-edit-buttons-group-headline">
                  {undoButton}
                  {saveButton}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentWillUnmount() {
    const { updateEditDynamicDataState } = this.props
    updateEditDynamicDataState({
      updateKeys: [
        ['fetchedContent'],
        ['fetchingContent'],
        ['dataContent'],
        ['errorContent'],
        ['fetchedSkills'],
        ['fetchingSkills'],
        ['dataSkills'],
        ['errorSkills'],
        ['fetchedLanguage'],
        ['fetchingLanguage'],
        ['dataLanguage'],
        ['errorLanguage'],
        ['fetchedImpact'],
        ['fetchingImpact'],
        ['dataImpact'],
        ['errorImpact'],
        ['fetchedRephraseWords'],
        ['fetchingRephraseWords'],
        ['dataRephraseWords'],
        ['errorRephraseWords'],
      ],
      data: {
        fetchedContent: false,
        fetchingContent: false,
        dataContent: null,
        errorContent: false,
        fetchedSkills: false,
        fetchingSkills: false,
        dataSkills: null,
        errorSkills: false,
        fetchedLanguage: false,
        fetchingLanguage: false,
        dataLanguage: null,
        errorLanguage: false,
        fetchedImpact: false,
        fetchingImpact: false,
        dataImpact: null,
        errorImpact: false,
        fetchedRephraseWords: false,
        fetchingRephraseWords: false,
        dataRephraseWords: null,
        errorRephraseWords: false,
      },
    })
  }
}

function mapStateToProps(state, ownProps) {
  return {
    loaderInput: state.aspireFeedbackData.mini_loader_text,
  }
}

export default connect(
  mapStateToProps,
  { updateEditDynamicDataState }
)(Headline)
