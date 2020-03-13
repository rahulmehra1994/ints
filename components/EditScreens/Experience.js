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
import Loader from '../Loader'
import { updateEditDynamicDataState } from '../../actions/AspireEditDynamicData'
import { updateNewSamplesState } from '../../actions/AspireSamples'
import {
  fetchResumeGap,
  updateResumeGapState,
} from '../../actions/AspireResumeGap'
import { editModalAriaLabel } from '../Constants/AriaLabelText'
import SelectPlus from 'react-select-plus'

const placeholders = {
  title: 'Enter job title',
  company: 'Enter company',
  from: 'Enter start date',
  to: 'Enter end date',
  text: 'Enter description',
}

const months = {
  Jan: 'January',
  Feb: 'February',
  Mar: 'March',
  Apr: 'April',
  May: 'May',
  Jun: 'June',
  Jul: 'July',
  Aug: 'August',
  Sep: 'September',
  Oct: 'October',
  Nov: 'November',
  Dec: 'December',
}

class Experience extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedModule: 'samples',
      selectedSkill: '',
      selectedPresentCategory: '',
      focused: {
        title: false,
        company: false,
        from: false,
        to: false,
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
      checkCurrent: false,
      data: {
        fromMonth: '',
        fromYear: '',
        toMonth: '',
        toYear: '',
      },
    }
    this.allowedModulesList = [
      'skills',
      'content',
      'language',
      'impact',
      'samples',
      'rephrase_words',
    ]
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
    this.handleClick = this.handleClick.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.updateCheckboxState = this.updateCheckboxState.bind(this)
    this.handleUndoClick = this.handleUndoClick.bind(this)
    this.checkValidDate = this.checkValidDate.bind(this)
    this.highlightValues = this.highlightValues.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.sendTrackingDataDebounceUndo = _.debounce(sendTrackingData, 3000, true)
    this.descriptionCharsRemaining = charCountLimit['experience']['text']
    this.handleCloseButton = this.handleCloseButton.bind(this)
    this.setSelectedSkill = this.setSelectedSkill.bind(this)
    this.setSelectedPresentCategory = this.setSelectedPresentCategory.bind(this)
    this.loadLeftNav = this.loadLeftNav.bind(this)
  }

  UNSAFE_componentWillMount() {
    const {
      sectionWiseTextEditable,
      fetchResumeGap,
      currentIndex,
      fetchId,
      hasResume,
      newSubSection,
      feedback,
    } = this.props
    this.descriptionCharsRemaining =
      charCountLimit['experience']['text'] -
      sectionWiseTextEditable[currentIndex]['text'].length

    if (
      !_.isEmpty(sectionWiseTextEditable[currentIndex]['to']) &&
      sectionWiseTextEditable[currentIndex]['to'] == 'Present'
    ) {
      this.setState({ checkCurrent: true })
    }

    this.setInitialState()

    if (hasResume == 1) {
      if (newSubSection == true) {
        fetchResumeGap(fetchId, 'Experience', -1)
      } else {
        fetchResumeGap(fetchId, 'Experience', currentIndex)
      }
    }
    this.loadLeftNav(newSubSection, feedback)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedback, newSubSection } = nextProps

    this.loadLeftNav(newSubSection, feedback)
  }

  loadLeftNav(newSubSection, feedback) {
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
      currentSection: 'Experience',
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
    const { feedback } = this.props

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
              className={classNames('as-nav-list-item', { active: isActive })}
              tabIndex={0}
              href="javascript:void(0);"
              aria-label={editModalAriaLabel[module]}
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
          currentSection="Experience"
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
          currentSection="Experience"
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
          currentSection="Experience"
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
          currentSection="Experience"
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
          currentSection="Experience"
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
          currentSection="Experience"
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

  setInitialState() {
    let data = $.extend({}, this.state.data, this.getMonthAndYear())
    this.setState({ data: data })
  }

  handleDateChange(option) {
    let value = option.value
    let name = option.name
    if (!_.isUndefined(this.state.data[name])) {
      if (name.indexOf('from') !== -1) {
        name = 'from'
        value = `${
          option.name === 'fromMonth' ? value : this.state.data['fromMonth']
        } ${option.name === 'fromYear' ? value : this.state.data['fromYear']}`
      } else if (name.indexOf('to') !== -1) {
        name = 'to'
        value = `${
          option.name === 'toMonth' ? value : this.state.data['toMonth']
        } ${option.name === 'toYear' ? value : this.state.data['toYear']}`
      }
    }

    this.props.handleOnChangeData(
      'experience',
      this.props.currentIndex,
      name,
      value
    )
  }

  handleChange(e) {
    let value = e.target.value
    let name = e.target.name
    if (!_.isUndefined(this.state.data[name])) {
      if (name.indexOf('from') !== -1) {
        name = 'from'
        value = `${
          e.target.name === 'fromMonth' ? value : this.state.data['fromMonth']
        } ${e.target.name === 'fromYear' ? value : this.state.data['fromYear']}`
      } else if (name.indexOf('to') !== -1) {
        name = 'to'
        value = `${
          e.target.name === 'toMonth' ? value : this.state.data['toMonth']
        } ${e.target.name === 'toYear' ? value : this.state.data['toYear']}`
      }
    }

    this.props.handleOnChangeData(
      'experience',
      this.props.currentIndex,
      name,
      value
    )

    if (name == 'text') {
      let charsRemainingCount = -1
      if (
        charCountLimit.hasOwnProperty('experience') &&
        charCountLimit['experience'].hasOwnProperty('text')
      ) {
        charsRemainingCount =
          charCountLimit['experience']['text'] - value.length
      }
      this.descriptionCharsRemaining = charsRemainingCount
    }
  }

  handleUndoClick() {
    if (
      !_.isEmpty(
        this.props.sectionWiseTextEditable[this.props.currentIndex]['to']
      ) &&
      this.props.sectionWiseTextEditable[this.props.currentIndex]['to'] ==
        'Present'
    ) {
      this.setState({ checkCurrent: true })
    }

    const { currentIndex } = this.props

    let jsonObjectForTracking = {
      eventLabel: 'undo_changes_btn',
      currentSection: 'Experience',
      currentIndex: currentIndex,
    }

    this.sendTrackingDataDebounceUndo(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.props.handleUndoData('experience', this.props.currentIndex)
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
      currentSection: 'Experience',
      currentIndex: currentIndex,
    }
    sendTrackingData(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    hideEditModal(
      'experience',
      currentIndex,
      sectionWiseTextEditable,
      sectionWiseTextStatic
    )
  }

  checkValidDate(current) {
    return current.isBefore(moment()) && current.isAfter(moment('DEC 1949'))
  }

  getMonthAndYear() {
    let fromArray = this.props.sectionWiseTextEditable[this.props.currentIndex][
      'from'
    ].split(' ')
    let toArray = this.props.sectionWiseTextEditable[this.props.currentIndex][
      'to'
    ].split(' ')

    // For present case
    if (
      !_.isEmpty(
        this.props.sectionWiseTextEditable[this.props.currentIndex]['to']
      ) &&
      this.props.sectionWiseTextEditable[this.props.currentIndex]['to'] ==
        'Present'
    ) {
      toArray[0] = ''
      toArray[1] = ''
    }

    return {
      fromMonth: _.isUndefined(fromArray[0]) ? '' : fromArray[0].trim(),
      fromYear: _.isUndefined(fromArray[1]) ? '' : fromArray[1].trim(),
      toMonth: _.isUndefined(toArray[0]) ? '' : toArray[0].trim(),
      toYear: _.isUndefined(toArray[1]) ? '' : toArray[1].trim(),
    }
  }

  getSelectOptionsMonth(name) {
    return _.map(months, (fullName, idx) => {
      return { value: idx, label: fullName, name: name }
    })
  }

  getSelectOptionsYear(name) {
    let options = []
    let startYear = new Date().getFullYear() - 59

    for (let i = 59; i >= 0; i--) {
      let year = startYear + i
      options.push({ value: year.toString(), label: year, name: name })
    }
    return options
  }

  handleFromDateChange(date) {
    if (this.hasOwnProperty('handleOnChangeData')) {
      this.handleOnChangeData('experience', this.currentIndex, 'from', date)
    } else {
      this.props.handleOnChangeData(
        'experience',
        this.props.currentIndex,
        'from',
        date
      )
    }
  }

  handleToDateChange(date) {
    if (this.hasOwnProperty('handleOnChangeData')) {
      this.handleOnChangeData('experience', this.currentIndex, 'to', date)
    } else {
      this.props.handleOnChangeData(
        'experience',
        this.props.currentIndex,
        'to',
        date
      )
    }
  }

  handleCheckClick() {
    if (this.state.checkCurrent == false) {
      this.props.handleOnChangeData(
        'experience',
        this.props.currentIndex,
        'to',
        'Present'
      )
    } else {
      this.props.handleOnChangeData(
        'experience',
        this.props.currentIndex,
        'to',
        ''
      )
    }
    this.setState(prevState => ({ checkCurrent: !prevState.checkCurrent }))
  }

  handleClick(e) {
    const { handleSaveChanges } = this.props
    handleSaveChanges()
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
    setTimeout(() => {
      if ($('.as-edit-input-field-wrapper').find('input').length != 0) {
        $('.as-edit-input-field-wrapper')
          .find('input')[0]
          .focus()
      }
    }, 100)
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

    if (this.state.focused[entity] == true) {
      // When the input field is in focus
      if (entity == 'title') {
        return (
          <input
            type="text"
            className=""
            tabIndex={0}
            name="title"
            value={
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'title'
              ]
            }
            aria-label={editModalAriaLabel['Experience']['input_title']}
            placeholder={placeholders['title']}
            onChange={e => this.handleChange(e)}
            onBlur={() => this.handleBlur('title')}
            disabled={fieldDisabled}
          />
        )
      } else if (entity == 'company') {
        return (
          <input
            type="text"
            className=""
            tabIndex={0}
            name="company"
            value={
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'company'
              ]
            }
            aria-label={editModalAriaLabel['Experience']['input_company']}
            placeholder={placeholders['company']}
            onChange={e => this.handleChange(e)}
            onBlur={() => this.handleBlur('company')}
            disabled={fieldDisabled}
          />
        )
      }
    } else {
      // When the input field is in static state
      if (entity == 'title') {
        return (
          <div
            className="experience-entity-title entity-text as-input-div"
            id="hide-scrollbar"
            onMouseDown={e => this.handleFocus('title', e)}
            tabIndex={0}
            aria-label={''}
            onFocus={e => this.handleFocus('title', e)}
            disabled={fieldDisabled}>
            {this.renderPlaceholder(
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'title'
              ],
              'title'
            )}
          </div>
        )
      } else if (entity == 'company') {
        return (
          <div
            className="experience-entity-company entity-text as-input-div"
            id="hide-scrollbar"
            onMouseDown={e => this.handleFocus('company', e)}
            onFocus={e => this.handleFocus('company', e)}
            disabled={fieldDisabled}
            aria-label={''}
            tabIndex={0}>
            {this.renderPlaceholder(
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'company'
              ],
              'company'
            )}
          </div>
        )
      }
    }

    if (entity == 'text') {
      return (
        <div className="edit-experience-description">
          <HighlightedTextarea
            label="Description"
            name="text"
            highlight={this.highlightValues}
            value={
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'text'
              ]
            }
            placeholder={placeholders['text']}
            onFocus={e => this.handleFocus('text', e)}
            onBlur={() => this.handleBlur('text')}
            onChange={this.handleChange}
            disabled={fieldDisabled}
          />
          <span
            className="experience-chars-remain"
            tabIndex={0}
            aria-label={`character remaining ${this.descriptionCharsRemaining}`}>
            {this.descriptionCharsRemaining}
          </span>
        </div>
      )
    } else if (entity == 'to') {
      if (this.state.checkCurrent == true) {
        return (
          <div
            key={entity}
            className="experience-entity-to entity-text as-input-div">
            {this.renderPlaceholder(
              this.props.sectionWiseTextEditable[this.props.currentIndex]['to'],
              'to'
            )}
          </div>
        )
      } else {
        return (
          <div className="row">
            <SelectPlus
              className="as-edit-select-field-right experience-to-month-select col-sm-6"
              closeOnSelect={true}
              name="toMonth"
              value={this.state.data.toMonth}
              searchable={false}
              valueKey="value"
              arrowRenderer={() => {
                return null
              }}
              clearable={false}
              tabSelectsValue={false}
              placeholder="Month"
              aria-label={editModalAriaLabel['Experience']['to_month']}
              options={this.getSelectOptionsMonth('toMonth')}
              onFocus={e => this.handleFocus('to', e)}
              onBlur={() => this.handleBlur('to')}
              onChange={this.handleDateChange}
            />
            <SelectPlus
              className="as-edit-select-field-right experience-to-year-select col-sm-6"
              closeOnSelect={true}
              name="toYear"
              value={this.state.data.toYear}
              searchable={false}
              valueKey="value"
              arrowRenderer={() => {
                return null
              }}
              clearable={false}
              tabSelectsValue={false}
              placeholder="Year"
              aria-label={editModalAriaLabel['Experience']['to_year']}
              options={this.getSelectOptionsYear('toYear')}
              onFocus={e => this.handleFocus('to', e)}
              onBlur={() => this.handleBlur('to')}
              onChange={this.handleDateChange}
            />
            <div className="clearfix" />
          </div>
        )
      }
    } else if (entity == 'from') {
      return (
        <div className="row">
          <SelectPlus
            className="as-edit-select-field-left col-sm-6"
            closeOnSelect={true}
            name="fromMonth"
            value={this.state.data.fromMonth}
            searchable={false}
            valueKey="value"
            arrowRenderer={() => {
              return null
            }}
            clearable={false}
            tabSelectsValue={false}
            placeholder="Month"
            aria-label={editModalAriaLabel['Experience']['from_month']}
            disabled={fieldDisabled}
            options={this.getSelectOptionsMonth('fromMonth')}
            onFocus={e => this.handleFocus('to', e)}
            onBlur={() => this.handleBlur('to')}
            onChange={this.handleDateChange}
          />
          <SelectPlus
            className="as-edit-select-field-right experience-from-year-select col-sm-6"
            closeOnSelect={true}
            name="fromYear"
            value={this.state.data.fromYear}
            searchable={false}
            valueKey="value"
            arrowRenderer={() => {
              return null
            }}
            clearable={false}
            tabSelectsValue={false}
            placeholder="Year"
            aria-label={editModalAriaLabel['Experience']['from_year']}
            disabled={fieldDisabled}
            options={this.getSelectOptionsYear('fromYear')}
            onFocus={e => this.handleFocus('from', e)}
            onBlur={() => this.handleBlur('from')}
            onChange={this.handleDateChange}
          />
          <div className="clearfix" />
        </div>
      )
    }
  }

  todayDate() {
    let a = new Date().toString().split(' ')
    return a[1] + ' ' + a[3]
  }

  renderPlaceholder(text, field) {
    if (!_.isEmpty(text)) {
      let text2 = text.split('\n'),
        text3 = []
      for (let i in text2) {
        if (!text2[i].match(/[a-z0-9]/i)) {
          text3.push(<br />)
        } else {
          text3.push(<div key={field + '-' + i}>{text2[i]}</div>)
        }
      }
      return text3
    }
    return (
      <span key={field} className="placeholder-color">
        {placeholders[field]}
      </span>
    )
  }

  updateCheckboxState(checkbox) {
    this.setState({ checkbox: checkbox })
  }

  getLabel(field, heading, emptyCondition) {
    const { loaderInput } = this.props
    let colorClass = null
    let fieldDisabled = false
    if (_.isEmpty(emptyCondition)) {
      colorClass = 'as-edit-input-field-label text-red'
    } else if (!_.isEmpty(loaderInput)) {
      colorClass = 'as-edit-input-field-label as-label-text-color'
      fieldDisabled = false
    } else if (this.state.focused[field]) {
      colorClass = 'as-edit-input-field-label as-focused-label-text-color'
    } else {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    }

    if (field == 'to') {
      return (
        <span tabIndex={0} aria-label={editModalAriaLabel['Experience']['to']}>
          <label className={colorClass}>
            {heading} <span className="text-red">*</span>
          </label>
          <span className="is-current-checkbox-wrapper">
            <input
              aria-checked={this.state.checkCurrent}
              aria-label={
                editModalAriaLabel['Experience']['is_current'][
                  this.state.checkCurrent
                ]
              }
              className="is-current-checkbox"
              onChange={() => this.handleCheckClick()}
              onFocus={e => this.handleFocus('to', e)}
              onBlur={() => this.handleBlur('to')}
              type="checkbox"
              checked={this.state.checkCurrent}
              disabled={fieldDisabled}
            />
            <span className="is-current-checkbox-text">IS CURRENT</span>
          </span>
        </span>
      )
    } else if (field == 'from') {
      return (
        <span
          tabIndex={0}
          aria-label={editModalAriaLabel['Experience']['from']}>
          <label className={colorClass}>
            {heading} <span className="text-red">*</span>
          </label>
        </span>
      )
    }
    return (
      <label className={colorClass}>
        {heading} <span className="text-red">*</span>
      </label>
    )
  }

  getSimpleLabel(field, heading) {
    const { loaderInput } = this.props
    let colorClass = null
    if (!_.isEmpty(loaderInput)) {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    } else if (this.state.focused[field]) {
      colorClass = 'as-edit-input-field-label as-focused-label-text-color'
    } else {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    }

    return <label className={colorClass}>{heading} </label>
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
        aria-label={editModalAriaLabel['save']}
        className="btn btn-primary btn-save-changes"
        onClick={() => this.handleClick()}>
        Save Changes
      </button>
    )
    if (!_.isEmpty(loaderInput)) {
      saveButton = (
        <button
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
    let blackOverlayClass = ''
    let editFocusedClass = ''

    let isAnyFieldFocused = false
    for (let index in this.state.focused) {
      if (this.state.focused[index]) {
        isAnyFieldFocused = true
        break
      }
    }

    if (!_.isEmpty(this.props.loaderInput)) {
      blackOverlayClass = 'as-edit-overlay-none'
      editFocusedClass = 'as-edit-focused-none'
    } else if (isAnyFieldFocused) {
      blackOverlayClass = 'as-edit-overlay-none as-edit-overlay-black'
      editFocusedClass = 'as-edit-focused-none as-edit-focused-black'
    } else {
      blackOverlayClass = 'as-edit-overlay-none'
      editFocusedClass = 'as-edit-focused-none'
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
        <Loader sectionName="Experience" />
        <div className="as-edit-heading-wrapper">
          <a
            href="javascript:void(0);"
            aria-label={editModalAriaLabel['close']}
            className="icon-cross as-edit-close-btn modal-close-button"
            onClick={this.handleCloseButton}
          />
          <div className="as-edit-heading">{editOrAdd} Experience</div>
        </div>
        <div className="as-eq-height-row">
          <div className="as-edit-feedback-wrapper as-eq-height-col">
            <div className="as-edit-feedback-inner-wrapper">
              <div className="as-edit-nav-wrapper" id="hide-scrollbar">
                {this.getFeedbackNav()}
              </div>
              <div className="as-edit-feedback-container vertical-scroll">
                {this.getFeedbackContentForModule(this.state.selectedModule)}
              </div>
            </div>
          </div>
          <div className="as-edit-container-right as-eq-height-col as-experience-container vertical-scroll">
            <div className={editFocusedClass}>
              <div className="as-section-heading">Experience</div>
              <div className="row as-edit-inputs-row">
                <div className="col-sm-12 as-edit-inputs-col">
                  {this.getLabel(
                    'title',
                    'Job Title',
                    sectionWiseTextEditable[currentIndex]['title']
                  )}
                  <div className="as-edit-input-field-wrapper">
                    {this.renderEntityText('title')}
                  </div>
                </div>
                <div className="col-sm-12 as-edit-inputs-col">
                  {this.getLabel(
                    'company',
                    'Company',
                    sectionWiseTextEditable[currentIndex]['company']
                  )}
                  <div className="as-edit-input-field-wrapper">
                    {this.renderEntityText('company')}
                  </div>
                </div>
                <div className="col-sm-6 as-edit-inputs-col">
                  {this.getLabel(
                    'from',
                    'From',
                    sectionWiseTextEditable[currentIndex]['from']
                  )}
                  <div className="as-edit-select-field">
                    {this.renderEntityText('from')}
                  </div>
                </div>
                <div className="col-sm-6 as-edit-inputs-col">
                  {this.getLabel(
                    'to',
                    'To',
                    sectionWiseTextEditable[currentIndex]['to']
                  )}
                  <div className="as-edit-select-field">
                    {this.renderEntityText('to')}
                  </div>
                </div>
                <div className="col-sm-12 as-edit-inputs-col">
                  {this.getSimpleLabel('text', 'Description')}
                  {this.renderEntityText('text')}
                </div>
              </div>
              <div
                className={classNames('editing-warning-text', {
                  'display-none': hideWarningText,
                })}>
                {warningText}{' '}
              </div>
              <div className="as-edit-buttons-group-experience">
                {undoButton}
                {saveButton}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      sectionWiseTextEditable,
      currentIndex,
      underlineEntitySpellError,
    } = this.props
    underlineEntitySpellError()

    if (
      prevProps.currentIndex !== this.props.currentIndex ||
      JSON.stringify(
        prevProps.sectionWiseTextEditable[prevProps.currentIndex]
      ) !==
        JSON.stringify(
          this.props.sectionWiseTextEditable[this.props.currentIndex]
        )
    ) {
      if (
        !_.isEmpty(
          this.props.sectionWiseTextEditable[this.props.currentIndex]['to']
        ) &&
        this.props.sectionWiseTextEditable[this.props.currentIndex]['to'] ==
          'Present'
      ) {
        this.setState({ checkCurrent: true })
      } else {
        this.setState({ checkCurrent: false })
      }
      this.setInitialState()
    }
  }

  componentDidMount() {}

  componentWillUnmount() {
    const { updateEditDynamicDataState, updateNewSamplesState } = this.props
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
)(Experience)
