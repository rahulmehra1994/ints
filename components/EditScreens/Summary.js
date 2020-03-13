import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import classNames from 'classnames'
import HighlightedTextarea from './HighlightedTextarea'
import { charCountLimit } from './index'
import SkillsGuide from './Guides/SkillsGuide'
import ContentGuide from './Guides/ContentGuide'
import LanguageGuide from './Guides/LanguageGuide'
import ImpactGuide from './Guides/ImpactGuide'
import SamplesGuide from './Guides/SamplesGuide'
import RephraseWordsGuide from './Guides/RephraseWordsGuide'
import { checkIfEmpty } from '../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { updateEditDynamicDataState } from '../../actions/AspireEditDynamicData'
import { updateNewSamplesState } from '../../actions/AspireSamples'
import Loader from '../Loader'
import {
  fetchResumeGap,
  updateResumeGapState,
} from '../../actions/AspireResumeGap'
import { editModalAriaLabel } from '../Constants/AriaLabelText'

const placeholders = {
  text: 'Enter summary',
}

class Summary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedModule: 'samples',
      selectedSkill: '',
      selectedPresentCategory: '',
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
    }
    this.moduleIconsMapping = {
      skills: 'dist/images/edit-screens/skills-icon.svg',
      content: 'dist/images/edit-screens/content-icon.svg',
      language: 'dist/images/edit-screens/language-icon.svg',
      impact: 'dist/images/edit-screens/impact-icon.svg',
      samples: 'dist/images/edit-screens/samples-icon.svg',
      rephrase_words: 'dist/images/edit-screens/rephrase-words-icon.svg',
    }
    this.displayNameMapping = {
      skills: 'Skills',
      content: 'Content',
      language: 'Language',
      impact: 'Impact',
      samples: 'Samples',
      rephrase_words: 'Word Usage',
    }
    this.modulesPresent = []
    this.getFeedbackNav = this.getFeedbackNav.bind(this)
    this.getFeedbackContentForModule = this.getFeedbackContentForModule.bind(
      this
    )
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.updateCheckboxState = this.updateCheckboxState.bind(this)
    this.handleUndoClick = this.handleUndoClick.bind(this)
    this.sendTrackingDebounce = _.debounce(sendTrackingData, 1000, true)
    this.sendTrackingDataDebounceUndo = _.debounce(sendTrackingData, 3000, true)
    this.summaryCharsRemaining = charCountLimit['summary']['text']
    this.highlightValues = this.highlightValues.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCloseButton = this.handleCloseButton.bind(this)
    this.setSelectedSkill = this.setSelectedSkill.bind(this)
    this.setSelectedPresentCategory = this.setSelectedPresentCategory.bind(this)
    this.loadLeftNavBar = this.loadLeftNavBar.bind(this)
    this.handleModuleClick = this.handleModuleClick.bind(this)
  }

  UNSAFE_componentWillMount() {
    const {
      sectionWiseTextEditable,
      currentIndex,
      fetchResumeGap,
      fetchId,
      hasResume,
      newSubSection,
      feedback,
    } = this.props

    let text = ''
    if (sectionWiseTextEditable[currentIndex]['text'] !== 'N/A') {
      text = sectionWiseTextEditable[currentIndex]['text']
    }
    this.summaryCharsRemaining = charCountLimit['summary']['text'] - text.length

    if (hasResume == 1) {
      if (newSubSection == true) {
        fetchResumeGap(fetchId, 'Summary', -1)
      } else {
        fetchResumeGap(fetchId, 'Summary', currentIndex)
      }
    }
    this.loadLeftNavBar(newSubSection, feedback)
  }

  loadLeftNavBar(newSubSection, feedback) {
    if (newSubSection) {
      this.modulesPresentList = [
        'samples',
        'content',
        'skills',
        'language',
        'impact',
        'rephrase_words',
      ]
    } else {
      this.modulesPresentList = ['samples']
      if (
        !_.isUndefined(feedback['categories']) &&
        !_.isEmpty(feedback['categories']) &&
        feedback['categories'].hasOwnProperty('categories')
      ) {
        this.modulesPresentList.push('content')
      }
      if (
        !_.isUndefined(feedback['skills']) &&
        !_.isEmpty(feedback['skills'])
      ) {
        this.modulesPresentList.push('skills')
      }
      if (
        !_.isUndefined(feedback['language']) &&
        !_.isEmpty(feedback['language']) &&
        (feedback['language'].hasOwnProperty('tense') ||
          feedback['language'].hasOwnProperty('narrative_voice'))
      ) {
        this.modulesPresentList.push('language')
      }
      if (
        !_.isUndefined(feedback['impact']) &&
        !_.isEmpty(feedback['impact'])
      ) {
        this.modulesPresentList.push('impact')
      }
      if (
        !_.isUndefined(feedback['language']) &&
        !_.isEmpty(feedback['language']) &&
        (feedback['language'].hasOwnProperty('verb_overusage') ||
          feedback['language'].hasOwnProperty('buzzwords'))
      ) {
        this.modulesPresentList.push('rephrase_words')
      }
    }

    let isCurrentSelectedModulePresentInNewFeedback = _.indexOf(
      this.modulesPresentList,
      this.state.selectedModule
    )

    if (isCurrentSelectedModulePresentInNewFeedback == -1) {
      this.setState({ selectedModule: 'samples' })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedback, newSubSection } = nextProps

    this.loadLeftNavBar(newSubSection, feedback)
  }

  setSelectedSkill(skill) {
    this.setState({ selectedSkill: skill })
  }

  setSelectedPresentCategory(category) {
    this.setState({ selectedPresentCategory: category })
  }

  handleModuleClick(module) {
    const { currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'module_click',
      currentSection: 'Summary',
      currentIndex: currentIndex,
      module: module,
    }
    sendTrackingData(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.setState({ selectedModule: module })
  }

  getFeedbackNav() {
    let links = _.map(
      this.modulesPresentList,
      function(module) {
        let isActive = false
        if (this.state.selectedModule == module) {
          isActive = true
        }
        let moduleDisplayName = this.displayNameMapping[module]
        let moduleIcon = this.moduleIconsMapping[module]

        return (
          <div key={module}>
            <a
              tabIndex={0}
              aria-label={editModalAriaLabel[module]}
              href="javascript:void(0);"
              aria-selected={isActive}
              className={classNames('as-nav-list-item', { active: isActive })}
              onClick={() => this.handleModuleClick(module)}>
              <div className="as-nav-list-item-icon">
                <img src={`${process.env.APP_BASE_URL + moduleIcon}`} alt="" />
              </div>
              <div className="as-nav-list-item-text">{moduleDisplayName}</div>
            </a>
          </div>
        )
      },
      this
    )

    return <div className="as-edit-feedback-nav as-shadow">{links}</div>
  }

  handleChange(e) {
    const value = e.target.value
    this.props.handleOnChangeData(
      'summary',
      this.props.currentIndex,
      'text',
      value
    )
    let charsRemainingCount = -1
    if (
      charCountLimit.hasOwnProperty('summary') &&
      charCountLimit['summary'].hasOwnProperty('text')
    ) {
      charsRemainingCount = charCountLimit['summary']['text'] - value.length
    }
    // if(charsRemainingCount < 0){
    //   charsRemainingCount = 0
    // }
    this.summaryCharsRemaining = charsRemainingCount
  }

  handleUndoClick() {
    const { currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'undo_changes_btn',
      currentSection: 'Summary',
      currentIndex: currentIndex,
    }
    this.sendTrackingDataDebounceUndo(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )

    this.props.handleUndoData('summary', currentIndex)
  }

  handleFocus(field, e) {
    e.preventDefault()
    const { unhighlightAll } = this.props
    unhighlightAll()
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
      selectedSkill: '',
      selectedPresentCategory: '',
    })
  }

  handleBlur(field) {
    let focused = this.state.focused
    focused[field] = false
    this.setState({ focused: focused })
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

    let text = ''
    if (
      this.props.sectionWiseTextEditable[this.props.currentIndex]['text'] !==
      'N/A'
    ) {
      text = this.props.sectionWiseTextEditable[this.props.currentIndex]['text']
    }

    return (
      <div className="edit-summary max-tall">
        <HighlightedTextarea
          autoFocus={true}
          name={'text'}
          highlight={this.highlightValues}
          value={text}
          placeholder={placeholders['text']}
          onFocus={e => this.handleFocus('text', e)}
          onBlur={() => this.handleBlur('text')}
          onChange={this.handleChange}
          disabled={fieldDisabled}
        />
        <span className="summary-chars-remain">
          {this.summaryCharsRemaining}
        </span>
      </div>
    )
  }

  renderPlaceholder(text, field) {
    if (!_.isEmpty(text)) {
      return text.split('\n').map(function(v) {
        if (!v.match(/[a-z0-9]/i)) {
          return <br />
        }
        return <div>{v}</div>
      })
    }
    return <span className="placeholder-color">{placeholders[field]}</span>
  }

  updateCheckboxState(checkbox) {
    this.setState({ checkbox: checkbox })
  }

  handleClick() {
    const { handleSaveChanges } = this.props
    handleSaveChanges()
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
      currentSection: 'Summary',
      currentIndex: currentIndex,
    }
    sendTrackingData(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    hideEditModal(
      'summary',
      currentIndex,
      sectionWiseTextEditable,
      sectionWiseTextStatic
    )
  }

  getFeedbackContentForModule(module) {
    const {
      currentSection,
      loaderInput,
      currentIndex,
      newSubSection,
      hideEditModal,
      sectionWiseText,
      sectionWiseTextStatic,
      sectionWiseTextEditable,
      highlightEntityText,
      sectionsEntitiesToHighlight,
      unhighlightAll,
      feedback,
      handleSaveChanges,
      getDynamicEditFeedbackForModule,
      handleUndoData,
      fetchId,
      allCapsResume,
      allSmallResume,
      normalResume,
      updateEditSection,
    } = this.props
    let years = '0'
    if (feedback['is_professional'] === false) {
      if (feedback['experience_months'] > 0) {
        years = '0+'
      } else {
        years = '0'
      }
    } else {
      if (
        feedback['experience_months'] > 0 &&
        feedback['experience_months'] <= 60
      ) {
        years = '0-5'
      } else {
        years = '5+'
      }
    }

    if (module == 'samples') {
      return (
        <SamplesGuide
          fetchId={fetchId}
          currentSection="Summary"
          currentIndex={currentIndex}
          newSubSection={newSubSection}
          isProfessional={feedback['is_professional']}
          years={years}
          showHeading={true}
          showSubHeading={true}
          sectionWiseTextEditable={sectionWiseTextEditable}
          sectionWiseTextStatic={sectionWiseTextStatic}
        />
      )
    } else if (module == 'skills') {
      return (
        <SkillsGuide
          fetchId={fetchId}
          currentSection="Summary"
          currentIndex={currentIndex}
          newSubSection={newSubSection}
          data={this.props.feedback['skills']}
          derivedSkills={this.props.derivedSkills}
          sectionsPerSkill={this.props.sectionsPerSkill}
          resumeSkillsInLinkedin={this.props.resumeSkillsInLinkedin}
          selectedSkill={this.state.selectedSkill}
          setSelectedSkill={this.setSelectedSkill}
          highlightEntityText={this.props.highlightEntityText}
          unhighlightAll={this.props.unhighlightAll}
          allCapsResume={allCapsResume}
          allSmallResume={allSmallResume}
          normalResume={normalResume}
          getDynamicEditFeedbackForModule={getDynamicEditFeedbackForModule}
          updateEditSection={updateEditSection}
          sectionWiseTextEditable={sectionWiseTextEditable}
          sectionWiseTextStatic={sectionWiseTextStatic}
          sectionsEntitiesToHighlight={sectionsEntitiesToHighlight}
        />
      )
    } else if (module == 'content') {
      return (
        <ContentGuide
          fetchId={fetchId}
          currentSection="Summary"
          currentIndex={currentIndex}
          newSubSection={newSubSection}
          resumeCategories={feedback['categories_in_resume_not_in_linkedin']}
          data={feedback['categories']}
          categoriesMissing={feedback['categories_missing']}
          selectedPresentCategory={this.state.selectedPresentCategory}
          setSelectedPresentCategory={this.setSelectedPresentCategory}
          highlightEntityText={highlightEntityText}
          unhighlightAll={unhighlightAll}
          getDynamicEditFeedbackForModule={getDynamicEditFeedbackForModule}
          updateEditSection={updateEditSection}
          sectionWiseTextEditable={sectionWiseTextEditable}
          sectionWiseTextStatic={sectionWiseTextStatic}
          sectionsEntitiesToHighlight={sectionsEntitiesToHighlight}
        />
      )
    } else if (module == 'language') {
      return (
        <LanguageGuide
          fetchId={fetchId}
          currentSection="Summary"
          currentIndex={currentIndex}
          newSubSection={newSubSection}
          data={{
            language: feedback['language'],
            sub_section_bullet_feedback:
              feedback['sub_section_bullet_feedback'],
          }}
          checkbox={this.state.checkbox}
          updateCheckboxState={this.updateCheckboxState}
          highlightEntityText={highlightEntityText}
          unhighlightAll={unhighlightAll}
          getDynamicEditFeedbackForModule={getDynamicEditFeedbackForModule}
          updateEditSection={updateEditSection}
          sectionWiseTextEditable={sectionWiseTextEditable}
          sectionWiseTextStatic={sectionWiseTextStatic}
          sectionsEntitiesToHighlight={sectionsEntitiesToHighlight}
        />
      )
    } else if (module == 'impact') {
      return (
        <ImpactGuide
          fetchId={fetchId}
          currentSection="Summary"
          currentIndex={currentIndex}
          newSubSection={newSubSection}
          data={{
            impact: feedback['impact'],
            sub_section_bullet_feedback:
              feedback['sub_section_bullet_feedback'],
          }}
          checkbox={this.state.checkbox}
          updateCheckboxState={this.updateCheckboxState}
          highlightEntityText={highlightEntityText}
          unhighlightAll={unhighlightAll}
          getDynamicEditFeedbackForModule={getDynamicEditFeedbackForModule}
          updateEditSection={updateEditSection}
          sectionWiseTextEditable={sectionWiseTextEditable}
          sectionWiseTextStatic={sectionWiseTextStatic}
          sectionsEntitiesToHighlight={sectionsEntitiesToHighlight}
        />
      )
    } else if (module == 'rephrase_words') {
      return (
        <RephraseWordsGuide
          fetchId={fetchId}
          currentSection="Summary"
          currentIndex={currentIndex}
          newSubSection={newSubSection}
          data={{
            language: feedback['language'],
            sub_section_bullet_feedback:
              feedback['sub_section_bullet_feedback'],
          }}
          checkbox={this.state.checkbox}
          updateCheckboxState={this.updateCheckboxState}
          highlightEntityText={highlightEntityText}
          unhighlightAll={unhighlightAll}
          getDynamicEditFeedbackForModule={getDynamicEditFeedbackForModule}
          updateEditSection={updateEditSection}
          sectionWiseTextEditable={sectionWiseTextEditable}
          sectionWiseTextStatic={sectionWiseTextStatic}
          sectionsEntitiesToHighlight={sectionsEntitiesToHighlight}
        />
      )
    }
    return null
  }

  getLabel(field, heading, emptyCondition) {
    const { loaderInput } = this.props
    let colorClass = null
    if (_.isEmpty(emptyCondition)) {
      colorClass = 'as-edit-input-field-label text-red'
    } else if (!_.isEmpty(loaderInput)) {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    } else if (this.state.focused[field]) {
      colorClass = 'as-edit-input-field-label as-focused-label-text-color'
    } else {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    }

    return (
      <label htmlFor={field} className={colorClass}>
        {heading} <span className="text-red">*</span>
      </label>
    )
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
          onClick={this.handleUndoClick}
          onMouseDown={this.handleUndoClick}>
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

    // calculation for focused state and black overlay
    let text = ''
    if (
      this.props.sectionWiseTextEditable[this.props.currentIndex]['text'] !==
      'N/A'
    ) {
      text = this.props.sectionWiseTextEditable[this.props.currentIndex]['text']
    }

    let summaryLength = 0
    if (text != '') {
      summaryLength = text.length
    }

    let blackOverlayClass = ''
    let editFocusedClass = ''

    if (!_.isEmpty(this.props.loaderInput)) {
      blackOverlayClass = 'as-edit-overlay-none'
      editFocusedClass = 'as-edit-focused-none'
      $('.edit-summary .hwt-content').css('font-size', '16px')
      $('.edit-summary .hwt-content').css('line-height', '24px')
    } else if (this.state.focused.text) {
      blackOverlayClass = 'as-edit-overlay-none as-edit-overlay-black'
      if (summaryLength >= 300) {
        editFocusedClass = 'as-edit-focused-none as-edit-focused-black'
        $('.edit-summary .hwt-content').css('font-size', '16px')
        $('.edit-summary .hwt-content').css('line-height', '24px')
      } else {
        editFocusedClass = 'as-edit-focused-none as-edit-focused-black'
        $('.edit-summary .hwt-content').css('font-size', '20px')
        $('.edit-summary .hwt-content').css('line-height', '30px')
      }
    } else {
      blackOverlayClass = 'as-edit-overlay-none'
      editFocusedClass = 'as-edit-focused-none'
      $('.edit-summary .hwt-content').css('font-size', '16px')
      $('.edit-summary .hwt-content').css('line-height', '24px')
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
        <Loader sectionName="Summary" />
        <div className="as-edit-heading-wrapper">
          <a
            href="javascript:void(0);"
            aria-label={editModalAriaLabel['close']}
            className="icon-cross as-edit-close-btn modal-close-button"
            onClick={this.handleCloseButton}
          />
          <div className="as-edit-heading">{editOrAdd} Summary</div>
        </div>
        <div className="as-eq-height-row">
          <div className="as-edit-feedback-wrapper as-eq-height-col">
            <div className="as-edit-feedback-inner-wrapper">
              <div
                className="as-edit-nav-wrapper"
                role="navigation"
                id="hide-scrollbar"
                aria-label="internal navigation">
                {this.getFeedbackNav()}
              </div>
              <div className="as-edit-feedback-container vertical-scroll">
                {this.getFeedbackContentForModule(this.state.selectedModule)}
              </div>
            </div>
          </div>
          <div className="as-edit-container as-eq-height-col as-summary-container vertical-scroll">
            <div className={editFocusedClass}>
              <div className="as-section-heading">Summary</div>
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
                <div className="as-edit-buttons-group-summary">
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

  componentDidUpdate(prevProps, prevState) {
    const { underlineEntitySpellError } = this.props
    underlineEntitySpellError()
  }

  componentDidMount() {}

  componentWillUnmount() {
    const {
      updateEditDynamicDataState,
      updateNewSamplesState,
      updateResumeGapState,
    } = this.props
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
        ['sectionWiseTextIntermediateContent'],
        ['sectionWiseTextIntermediateSkills'],
        ['sectionWiseTextIntermediateImpact'],
        ['sectionWiseTextIntermediateRephraseWords'],
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
        sectionWiseTextIntermediateContent: null,
        sectionWiseTextIntermediateSkills: null,
        sectionWiseTextIntermediateImpact: null,
        sectionWiseTextIntermediateRephraseWords: null,
      },
    })
    updateNewSamplesState({
      updateKeys: [['fetched'], ['fetching'], ['samples'], ['error']],
      data: { fetched: false, fetching: false, samples: null, error: false },
    })
    updateResumeGapState({
      updateKeys: [['fetched'], ['fetching'], ['data'], ['error']],
      data: { fetched: false, fetching: false, data: null, error: null },
    })
  }
}

function mapStateToProps(state, ownProps) {
  return {
    loaderInput: state.aspireFeedbackData.mini_loader_text,
    hasResume: state.aspireFeedbackData.has_resume,
  }
}

export default connect(
  mapStateToProps,
  {
    updateEditDynamicDataState,
    updateNewSamplesState,
    updateResumeGapState,
    fetchResumeGap,
  }
)(Summary)
