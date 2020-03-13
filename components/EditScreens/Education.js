import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import classNames from 'classnames'
import HighlightedTextarea from './HighlightedTextarea'
import { charCountLimit } from './index'
import HeadlineEducationSkillsContent from './Guides/HeadlineEducationSkillsContent'
import SamplesGuide from './Guides/SamplesGuide'
import { checkIfEmpty } from '../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import Loader from '../Loader'
import { updateEditDynamicDataState } from '../../actions/AspireEditDynamicData'
import { updateNewSamplesState } from '../../actions/AspireSamples'
import { editModalAriaLabel } from '../Constants/AriaLabelText'
import SelectPlus from 'react-select-plus'

const placeholders = {
  school: 'Enter school',
  to: 'End year',
  from: 'Start year',
  degree: 'Enter degree',
  field_of_study: 'Enter field of study',
  grade: 'Enter grade',
  activities_and_societies: 'Enter activities and societies',
}

class Education extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPresentCategory: '',
      focused: {
        school: false,
        to: false,
        from: false,
        degree: false,
        field_of_study: false,
        grade: false,
        activities_and_societies: false,
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

    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.updateCheckboxState = this.updateCheckboxState.bind(this)
    this.handleUndoClick = this.handleUndoClick.bind(this)
    this.highlightValues = this.highlightValues.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.sendTrackingDataDebounceUndo = _.debounce(sendTrackingData, 3000, true)
    this.sendTrackingDataDebounceInfoModal = _.debounce(
      sendTrackingData,
      3000,
      true
    )
    this.activitiesAndSocietiesCharsRemaining =
      charCountLimit['education']['activities_and_societies']
    this.handleCloseButton = this.handleCloseButton.bind(this)
    this.setSelectedPresentCategory = this.setSelectedPresentCategory.bind(this)
  }

  UNSAFE_componentWillMount() {
    let textValue =
      this.props.sectionWiseTextEditable[this.props.currentIndex][
        'activities_and_societies'
      ] === false
        ? ''
        : this.props.sectionWiseTextEditable[this.props.currentIndex][
            'activities_and_societies'
          ]
    this.activitiesAndSocietiesCharsRemaining =
      charCountLimit['education']['activities_and_societies'] - textValue.length
  }

  handleDateChange(option) {
    let value = option.value
    let name = option.name
    this.props.handleOnChangeData(
      'education',
      this.props.currentIndex,
      name,
      value
    )
    let fromYear = parseInt(
      this.props.sectionWiseTextEditable[this.props.currentIndex]['from']
    )
    if (
      name === 'to' &&
      !_.isEmpty(value) &&
      (isNaN(fromYear) || parseInt(value) < parseInt(fromYear))
    )
      this.props.handleOnChangeData(
        'education',
        this.props.currentIndex,
        'from',
        ''
      )
  }

  handleChange(e) {
    const value = e.target.value
    const name = e.target.name
    this.props.handleOnChangeData(
      'education',
      this.props.currentIndex,
      name,
      value
    )

    if (name == 'activities_and_societies') {
      let charsRemainingCount = -1
      if (
        charCountLimit.hasOwnProperty('education') &&
        charCountLimit['education'].hasOwnProperty('activities_and_societies')
      ) {
        charsRemainingCount =
          charCountLimit['education']['activities_and_societies'] - value.length
      }
      // if(charsRemainingCount < 0){
      //   charsRemainingCount = 0
      // }
      this.activitiesAndSocietiesCharsRemaining = charsRemainingCount
    }

    let fromYear = parseInt(
      this.props.sectionWiseTextEditable[this.props.currentIndex]['from']
    )

    if (
      name === 'to' &&
      !_.isEmpty(value) &&
      (isNaN(fromYear) || parseInt(value) < parseInt(fromYear))
    )
      this.props.handleOnChangeData(
        'education',
        this.props.currentIndex,
        'from',
        ''
      )
  }

  setSelectedPresentCategory(category) {
    this.setState({ selectedPresentCategory: category })
  }

  handleUndoClick() {
    const { currentIndex } = this.props

    let jsonObjectForTracking = {
      eventLabel: 'undo_changes_btn',
      currentSection: 'Education',
      currentIndex: currentIndex,
    }

    this.sendTrackingDataDebounceUndo(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.props.handleUndoData('education', this.props.currentIndex)
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
      currentSection: 'Education',
      currentIndex: currentIndex,
    }
    sendTrackingData(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    hideEditModal(
      'education',
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

    if (this.state.focused[entity] == true) {
      if (entity == 'school') {
        return (
          <input
            type="text"
            className=""
            tabIndex={0}
            name="school"
            value={
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'school'
              ]
            }
            aria-label={editModalAriaLabel['Education']['input_school']}
            placeholder={placeholders['school']}
            onChange={e => this.handleChange(e)}
            onBlur={() => this.handleBlur('school')}
            disabled={fieldDisabled}
          />
        )
      } else if (entity == 'degree') {
        return (
          <input
            type="text"
            className=""
            tabIndex={0}
            name="degree"
            value={
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'degree'
              ]
            }
            aria-label={editModalAriaLabel['Education']['input_degree']}
            placeholder={placeholders['degree']}
            onChange={e => this.handleChange(e)}
            onBlur={() => this.handleBlur('degree')}
            disabled={fieldDisabled}
          />
        )
      } else if (entity == 'field_of_study') {
        return (
          <input
            type="text"
            className=""
            tabIndex={0}
            name="field_of_study"
            value={
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'field_of_study'
              ]
            }
            aria-label={editModalAriaLabel['Education']['input_field']}
            placeholder={placeholders['field_of_study']}
            onChange={e => this.handleChange(e)}
            onBlur={() => this.handleBlur('field_of_study')}
            disabled={fieldDisabled}
          />
        )
      }
    } else {
      if (entity == 'school') {
        return (
          <div
            className="experience-entity-title entity-text as-input-div"
            id="hide-scrollbar"
            tabIndex={0}
            aria-label=""
            onMouseDown={e => this.handleFocus('school', e)}
            onFocus={e => this.handleFocus('school', e)}>
            {this.renderPlaceholder(
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'school'
              ],
              'school'
            )}
          </div>
        )
      } else if (entity == 'degree') {
        return (
          <div
            className="education-entity-degree entity-text as-input-div "
            id="hide-scrollbar"
            tabIndex={0}
            aria-label={''}
            onMouseDown={e => this.handleFocus('degree', e)}
            onFocus={e => this.handleFocus('degree', e)}>
            {this.renderPlaceholder(
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'degree'
              ],
              'degree'
            )}
          </div>
        )
      } else if (entity == 'field_of_study') {
        return (
          <div
            className="education-entity-field_of_study entity-text as-input-div "
            id="hide-scrollbar"
            tabIndex={0}
            aria-label={''}
            onMouseDown={e => this.handleFocus('field_of_study', e)}
            onFocus={e => this.handleFocus('field_of_study', e)}>
            {this.renderPlaceholder(
              this.props.sectionWiseTextEditable[this.props.currentIndex][
                'field_of_study'
              ],
              'field_of_study'
            )}
          </div>
        )
      }
    }

    if (entity == 'to') {
      let fromYear = this.props.sectionWiseTextEditable[
        this.props.currentIndex
      ]['from']
      var startYear =
        fromYear === '' ? new Date().getFullYear() : parseInt(fromYear)
      var options = []
      for (var i = startYear + 10; i >= startYear; i--) {
        options.push({ value: '' + i, label: i, name: 'to' })
      }
      return (
        <SelectPlus
          className="as-edit-select-field"
          closeOnSelect={true}
          name="to"
          value={
            this.props.sectionWiseTextEditable[this.props.currentIndex]['to']
          }
          searchable={false}
          valueKey="value"
          arrowRenderer={() => {
            return null
          }}
          disabled={fromYear === ''}
          clearable={false}
          tabSelectsValue={false}
          placeholder="End Year"
          aria-label={editModalAriaLabel['Education']['to_year']}
          options={options}
          onChange={this.handleDateChange}
        />
      )
    } else if (entity == 'from') {
      var startYear = new Date().getFullYear()
      var options = []
      for (var i = startYear; i >= startYear - 59; i--) {
        var year = i
        if (
          !_.isEmpty(
            this.props.sectionWiseTextEditable[this.props.currentIndex]['to']
          ) &&
          this.props.sectionWiseTextEditable[this.props.currentIndex]['to'] !=
            -1 &&
          year >
            this.props.sectionWiseTextEditable[this.props.currentIndex]['to']
        ) {
          continue
        }
        options.push({ value: '' + year, label: i, name: 'from' })
      }

      return (
        <SelectPlus
          className="as-edit-select-field education-entity-from"
          closeOnSelect={true}
          name="from"
          value={
            this.props.sectionWiseTextEditable[this.props.currentIndex]['from']
          }
          searchable={false}
          valueKey="value"
          arrowRenderer={() => {
            return null
          }}
          clearable={false}
          tabSelectsValue={false}
          placeholder="Start Year"
          aria-label={editModalAriaLabel['Education']['from_year']}
          options={options}
          onChange={this.handleDateChange}
        />
      )
    }

    if (entity == 'activities_and_societies') {
      let textAreaValue =
        this.props.sectionWiseTextEditable[this.props.currentIndex][
          'activities_and_societies'
        ] === false
          ? ''
          : this.props.sectionWiseTextEditable[this.props.currentIndex][
              'activities_and_societies'
            ]
      return (
        <div className="edit-education-description">
          <HighlightedTextarea
            name="activities_and_societies"
            label="Activities and Societies"
            highlight={this.highlightValues}
            value={textAreaValue}
            placeholder={placeholders['activities_and_societies']}
            onFocus={e => this.handleFocus('activities_and_societies', e)}
            onBlur={() => this.handleBlur('activities_and_societies')}
            onChange={this.handleChange}
            disabled={fieldDisabled}
          />
          <span
            className="education-chars-remain"
            tabIndex={0}
            aria-label={this.activitiesAndSocietiesCharsRemaining}>
            {this.activitiesAndSocietiesCharsRemaining}
          </span>
        </div>
      )
    }
  }

  getSamples() {
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
      unhighlightAll,
      feedback,
      handleSaveChanges,
      handleUndoData,
      fetchId,
      allCapsResume,
      allSmallResume,
      normalResume,
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

    let isEdited = true
    if (_.isString(currentIndex) && currentIndex.substr(-4) === '_new') {
      if (!checkIfEmpty(sectionWiseTextEditable[currentIndex], 'education')) {
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
      <div className="as-small-sample-outer-wrapper">
        <SamplesGuide
          fetchId={fetchId}
          isEdited={isEdited}
          currentSection="Education"
          currentIndex={currentIndex}
          newSubSection={this.props.newSubSection}
          isProfessional={feedback['is_professional']}
          years={years}
          showHeading={false}
          showSubHeading={false}
        />
      </div>
    )
  }

  getModule(module) {
    const {
      currentIndex,
      newSubSection,
      highlightEntityText,
      unhighlightAll,
      fetchId,
      getDynamicEditFeedbackForModule,
      feedback,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
    } = this.props

    let isEdited = true
    if (_.isString(currentIndex) && currentIndex.substr(-4) === '_new') {
      if (!checkIfEmpty(sectionWiseTextEditable[currentIndex], 'education')) {
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
        categoriesMissing={feedback['categories_missing']}
        selectedPresentCategory={this.state.selectedPresentCategory}
        setSelectedPresentCategory={this.setSelectedPresentCategory}
        fetchId={fetchId}
        newSubSection={newSubSection}
        currentSection="Education"
        currentIndex={currentIndex}
        highlightEntityText={highlightEntityText}
        unhighlightAll={unhighlightAll}
        getDynamicEditFeedbackForModule={getDynamicEditFeedbackForModule}
      />
    )
  }

  getLabel(field, heading, emptyCondition) {
    const { loaderInput } = this.props
    let colorClass = null
    let fieldDisabled = false
    if (_.isEmpty(emptyCondition)) {
      colorClass = 'as-edit-input-field-label text-red'
    } else if (!_.isEmpty(loaderInput)) {
      colorClass = 'as-edit-input-field-label as-label-text-color'
      fieldDisabled = true
    } else if (this.state.focused[field]) {
      colorClass = 'as-edit-input-field-label as-focused-label-text-color'
    } else {
      colorClass = 'as-edit-input-field-label as-label-text-color'
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

  getFromLabel() {
    const { sectionWiseTextEditable, currentIndex, loaderInput } = this.props
    let colorClass = null
    if (
      _.isEmpty(sectionWiseTextEditable[currentIndex]['from']) &&
      !_.isEmpty(sectionWiseTextEditable[currentIndex]['to'])
    ) {
      colorClass = 'as-edit-input-field-label text-red'
    } else if (!_.isEmpty(loaderInput)) {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    } else if (this.state.focused['from']) {
      colorClass = 'as-edit-input-field-label as-focused-label-text-color'
    } else {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    }

    return (
      <label
        className={colorClass}
        tabIndex={0}
        aria-label={editModalAriaLabel['Education']['from']}>
        From{' '}
        <span
          className={classNames(
            'text-red',
            _.isEmpty(sectionWiseTextEditable[currentIndex]['from']) &&
              !_.isEmpty(sectionWiseTextEditable[currentIndex]['to'])
              ? ''
              : 'hidden'
          )}>
          *
        </span>
      </label>
    )
  }

  getToLabel() {
    const { sectionWiseTextEditable, currentIndex, loaderInput } = this.props
    let colorClass = null
    if (
      !_.isEmpty(sectionWiseTextEditable[currentIndex]['from']) &&
      _.isEmpty(sectionWiseTextEditable[currentIndex]['to'])
    ) {
      colorClass = 'as-edit-input-field-label text-red'
    } else if (!_.isEmpty(loaderInput)) {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    } else if (this.state.focused['to']) {
      colorClass = 'as-edit-input-field-label as-focused-label-text-color'
    } else {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    }

    return (
      <label
        className={colorClass}
        tabIndex={0}
        aria-label={editModalAriaLabel['Education']['to']}>
        To{' '}
        <span
          className={classNames(
            'text-red',
            !_.isEmpty(sectionWiseTextEditable[currentIndex]['from']) &&
              _.isEmpty(sectionWiseTextEditable[currentIndex]['to'])
              ? ''
              : 'hidden'
          )}>
          *
        </span>
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
        <Loader sectionName="Education" />
        <div className="as-edit-heading-wrapper">
          <a
            href="javascript:void(0);"
            tabIndex={0}
            aria-label={editModalAriaLabel['close']}
            className="icon-cross as-edit-close-btn modal-close-button"
            onClick={this.handleCloseButton}
          />
          <div className="as-edit-heading">{editOrAdd} Education</div>
        </div>
        <div className="as-eq-height-row">
          <div className="as-edit-container-left as-eq-height-col">
            <div className="as-edit-suggestions-heading">
              Suggestions for editing
            </div>
            <div className="as-edit-card-2-headline-education">
              {this.getSamples()}
            </div>
            {this.getModule('content')}
          </div>
          <div
            className="as-edit-container-right as-eq-height-col as-education-container"
            id="vertical-scroll">
            <div className={editFocusedClass}>
              <div className="as-section-heading">Education</div>
              <div className="as-edit-inputs-row row">
                <div className="as-edit-inputs-col as-education-text-col-left-6">
                  {this.getLabel(
                    'school',
                    'School',
                    sectionWiseTextEditable[currentIndex]['school']
                  )}
                  <div className="as-edit-input-field-wrapper">
                    {this.renderEntityText('school')}
                  </div>
                </div>
                <div className="as-edit-inputs-col as-education-text-col-left-3">
                  {this.getFromLabel()}
                  <div
                    className="as-edit-select-field"
                    onFocus={e => this.handleFocus('from', e)}
                    onBlur={() => this.handleBlur('from')}>
                    {this.renderEntityText('from')}
                  </div>
                </div>
                <div className="as-edit-inputs-col as-education-text-col-right-3">
                  {this.getToLabel()}
                  <div
                    className="as-edit-select-field"
                    onFocus={e => this.handleFocus('to', e)}
                    onBlur={() => this.handleBlur('to')}>
                    {this.renderEntityText('to')}
                  </div>
                </div>
              </div>
              <div className="as-edit-inputs-row">
                <div className="as-edit-inputs-col as-education-text-col-left-6">
                  {this.getSimpleLabel('degree', 'Degree')}
                  <div className="as-edit-input-field-wrapper">
                    {this.renderEntityText('degree')}
                  </div>
                </div>
                <div className="as-edit-inputs-col as-education-text-col-right-6">
                  {this.getSimpleLabel('field_of_study', 'Field of study')}
                  <div className="as-edit-input-field-wrapper">
                    {this.renderEntityText('field_of_study')}
                  </div>
                </div>
              </div>
              <div className="as-edit-inputs-row">
                <div className="as-edit-inputs-col">
                  {this.getSimpleLabel(
                    'activities_and_societies',
                    'Activities and societies'
                  )}
                  {this.renderEntityText('activities_and_societies')}
                </div>
              </div>
              <div
                className={classNames('editing-warning-text', {
                  'display-none': hideWarningText,
                })}>
                {warningText}{' '}
              </div>
              <div className="as-edit-buttons-group-education">
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
    this.props.underlineEntitySpellError()
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
    updateNewSamplesState({
      updateKeys: [['fetched'], ['fetching'], ['samples'], ['error']],
      data: { fetched: false, fetching: false, samples: null, error: false },
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
  { updateEditDynamicDataState, updateNewSamplesState }
)(Education)
