import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateText } from '../../actions/DetailedFeedback'
import { processEditedData } from '../../actions/Edit'
import { fetchNewSamples } from '../../actions/AspireSamples'
import { markSectionVisited } from '../../actions/AspireFeedback'
import $ from 'jquery'
import classNames from 'classnames'
import _ from 'underscore'
import 'jquery-highlight'
import { notification, checkLinkedinUrlSanity } from '../../services/helpers'
import moment from 'moment'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import PersonalInformation from './PersonalInformation'
import ProfilePicture from './ProfilePicture'
import Headline from './Headline'
import Summary from './Summary'
import Experience from './Experience'
import Education from './Education'
import {
  fetchEditDynamicData,
  updateEditDynamicDataState,
} from '../../actions/AspireEditDynamicData'
import { Modal, ModalBody } from '@vmockinc/dashboard/Common/commonComps/Modal'
import FocusLock, { MoveFocusInside } from 'react-focus-lock'

const timeOutMilliseconds = 2000

const sectionComponents = {
  'Personal Information': PersonalInformation,
  'Profile Picture': ProfilePicture,
  Headline: Headline,
  Summary: Summary,
  Experience: Experience,
  Education: Education,
}

const sectionUnderscore = {
  'Personal Information': 'personal_information',
  'Profile Picture': 'profile_picture',
  Headline: 'headline',
  Summary: 'summary',
  Experience: 'experience',
  Education: 'education',
}

const sectioNameToBackendVisitedSectioNameMapping = {
  'Personal Information': 'detailed_personal_info',
  'Profile Picture': 'detailed_profile_picture',
  Headline: 'detailed_headline',
  Summary: 'detailed_summary',
  Experience: 'detailed_experience',
  Education: 'detailed_education',
  'Summary Screen': 'summary',
  'Edit Personal Information': 'edit_personal_info',
  'Edit Profile Picture': 'edit_profile_picture',
  'Edit Headline': 'edit_headline',
  'Edit Summary': 'edit_summary',
  'Edit Experience': 'edit_experience',
  'Edit Education': 'edit_education',
}

const sectionEntities = {
  'Personal Information': ['name', 'profile_url'],
  'Profile Picture': [],
  Headline: ['text'],
  Summary: ['text'],
  Experience: ['title', 'company', 'from', 'to', 'text'],
  Education: [
    'school',
    'from',
    'to',
    'degree',
    'field_of_study',
    'grade',
    'activities_and_societies',
  ],
}

const sectionUnderscoreEntities = {
  personal_information: ['name', 'profile_url'],
  profile_picture: [],
  headline: ['text'],
  summary: ['text'],
  experience: ['title', 'company', 'from', 'to', 'text'],
  education: [
    'school',
    'from',
    'to',
    'degree',
    'field_of_study',
    'grade',
    'activities_and_societies',
  ],
}

export const charCountLimit = {
  personal_information: {
    name: 71,
  },
  headline: {
    text: 120,
  },
  summary: {
    text: 2000,
  },
  experience: {
    company: 100,
    title: 100,
    text: 2000,
  },
  education: {
    school: 200,
    degree: 100,
    field_of_study: 100,
    activities_and_societies: 500,
  },
  volunteer_experience: {
    title: 100,
    text: 2000,
  },
  projects: {
    title: 255,
    text: 2000,
  },
  publications: {
    title: 255,
    text: 2000,
  },
}

class EditSection extends Component {
  constructor() {
    super()
    this.state = {
      resetLanguageHelp: false,
      sectionWiseTextEditable: {},
      sectionsEntitiesToHighlight: {},
      highlightableDivWords: [],
      keyboardEscape: true,
    }

    this.handleOnChangeData = this.handleOnChangeData.bind(this)
    this.handleOnChangePicture = this.handleOnChangePicture.bind(this)
    this.handleUndoData = this.handleUndoData.bind(this)
    this.unhighlightAll = this.unhighlightAll.bind(this)
    this.highlightEntityText = this.highlightEntityText.bind(this)
    this.underlineEntitySpellError = this.underlineEntitySpellError.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
    this.getDynamicEditFeedbackForModule = this.getDynamicEditFeedbackForModule.bind(
      this
    )
    this.languageHelpReset = this.languageHelpReset.bind(this)

    this.sectionWiseTextEditable = {}
    this.sectionsEntitiesToHighlight = {}
    this.highlightableDivWords = []
    this.timeScreenStart = 0
    this.timeEditingStart = 0
    this.toggleKeyboardFunctionality = this.toggleKeyboardFunctionality.bind(
      this
    )

    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 3000, true)
    this.sendTrackingDataDebounceSave = _.debounce(sendTrackingData, 2000, true)
    this.checkVisitedSection = this.checkVisitedSection.bind(this)
    this.checkVisitedSectionDebounce = _.debounce(
      this.checkVisitedSection,
      1000,
      true
    )
  }

  UNSAFE_componentWillMount() {
    this.addEditDataToState(this.props)
    const { sectionName, currentIndex } = this.props

    if (_.isString(currentIndex) && currentIndex.substr(-4) === '_new') return
    this.handleUndoData(sectionUnderscore[sectionName], currentIndex)
  }

  componentDidMount() {
    let timeScreenStart = new Date()
    this.timeScreenStart = timeScreenStart.getTime()
    this.timeEditingStart = timeScreenStart.getTime()

    let currentSectionName = 'Edit ' + this.props.sectionName
    this.checkVisitedSectionDebounce(currentSectionName)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      updateEditSection,
      editSectionUpdated,
      detailedFeedbackUi,
      fetchId,
      fetchNewSamples,
      sectionWiseText,
      newSubSection,
      updateText,
    } = nextProps
    let sectionName = detailedFeedbackUi.section
    if (updateEditSection == true) {
      let currentIndex = detailedFeedbackUi[sectionName].currentIndex
      if (
        sectionName == 'Summary' ||
        sectionName == 'Education' ||
        sectionName === 'Experience'
      ) {
        fetchNewSamples(fetchId, sectionName, currentIndex)
      }

      if (_.isEmpty(sectionWiseText[sectionUnderscore[sectionName]])) {
        currentIndex = this.props.currentSection + '_new'
      }
      updateText({
        updateKeys: [
          ['isEditOpen'],
          ['currentEditSection'],
          ['currentEditSectionIndex'],
        ],
        data: {
          isEditOpen: true,
          currentEditSection: sectionName,
          currentEditSectionIndex: currentIndex,
        },
      })

      let timeEditingStart = new Date()
      this.timeEditingStart = timeEditingStart.getTime()

      editSectionUpdated()
      this.addEditDataToState(nextProps)
    }

    if (
      updateEditSection === true &&
      !_.isEmpty(sectionWiseText[sectionUnderscore[sectionName]])
    ) {
      this.props.changeNewSubSectionValue(false)
    }
  }

  componentDidUpdate() {
    for (let i in this.state.highlightableDivWords) {
      $(this.state.highlightableDivWords[i][0]).highlight(
        this.state.highlightableDivWords[i][1],
        {
          wordsOnly: true,
          wordsBoundaryStart: '(?:[\\b\\W]|^)',
          wordsBoundaryEnd: '(?:[\\b\\W]|$)',
        }
      )
    }
  }

  checkVisitedSection(currentSectionName) {
    let visitedSectionModuleName =
      sectioNameToBackendVisitedSectioNameMapping[currentSectionName]
    if (this.props.visited_sections[visitedSectionModuleName] == 0) {
      this.props.markSectionVisited(visitedSectionModuleName)
    }
  }

  componentWillUnmount() {
    const { updateText, sectionName, currentIndex } = this.props
    let timeScreenEnd = new Date()
    let timeScreenSpent =
      (timeScreenEnd.getTime() - this.timeScreenStart) / 1000
    if (timeScreenSpent > 1) {
      let jsonObjectForTracking = {
        eventLabel: 'screen_time',
        time: timeScreenSpent,
      }
      sendTrackingData(
        'event',
        'aspire_edit_screen',
        'time',
        JSON.stringify(jsonObjectForTracking)
      )
    }

    if (_.isString(currentIndex) && currentIndex.substr(-4) === '_new') {
      if (
        this.sectionWiseTextEditable.hasOwnProperty(
          sectionUnderscore[sectionName]
        ) &&
        this.sectionWiseTextEditable[
          sectionUnderscore[sectionName]
        ].hasOwnProperty(currentIndex)
      ) {
        this.sectionWiseTextEditable[sectionUnderscore[sectionName]] = _.omit(
          this.sectionWiseTextEditable[sectionUnderscore[sectionName]],
          currentIndex
        )
      }
    }

    updateText({
      updateKeys: [
        ['sectionWiseTextEditable'],
        ['sectionsEntitiesToHighlight'],
      ],
      data: {
        sectionWiseTextEditable: this.sectionWiseTextEditable,
        sectionsEntitiesToHighlight: this.sectionsEntitiesToHighlight,
      },
    })
  }

  addEditDataToState(props) {
    let {
      sectionWiseTextEditable,
      sectionName,
      currentIndex,
      updateEditSection,
    } = props
    if (updateEditSection == true && sectionName.substr(-4) == '_new') {
      return
    }

    let sectionUnderscoreName = sectionUnderscore[sectionName]
    if (
      !sectionWiseTextEditable[sectionUnderscoreName].hasOwnProperty(
        currentIndex
      )
    ) {
      sectionWiseTextEditable[sectionUnderscoreName][currentIndex] = {}
      for (let i in sectionEntities[sectionName]) {
        sectionWiseTextEditable[sectionUnderscoreName][currentIndex][
          sectionEntities[sectionName][i]
        ] = ''
      }
    }
    this.sectionWiseTextEditable = sectionWiseTextEditable
    this.sectionsEntitiesToHighlight = props.sectionsEntitiesToHighlight
    this.setState({
      resetLanguageHelp: true,
      sectionWiseTextEditable: sectionWiseTextEditable,
      sectionsEntitiesToHighlight: props.sectionsEntitiesToHighlight,
    })
  }

  handleUndoData(sectionUnderscoreName, currentIndex) {
    let sectionWiseTextEditable = $.extend(
      true,
      {},
      this.sectionWiseTextEditable
    )
    const { sectionWiseTextStatic } = this.props

    if (
      !sectionWiseTextStatic[sectionUnderscoreName].hasOwnProperty(currentIndex)
    ) {
      sectionWiseTextEditable[sectionUnderscoreName][currentIndex] = {}
      for (let i in sectionUnderscoreEntities[sectionUnderscoreName]) {
        sectionWiseTextEditable[sectionUnderscoreName][currentIndex][
          sectionUnderscoreEntities[sectionUnderscoreName][i]
        ] = ''
      }
    } else {
      sectionWiseTextEditable[sectionUnderscoreName][currentIndex] =
        sectionWiseTextStatic[sectionUnderscoreName][currentIndex]
    }

    this.sectionWiseTextEditable = sectionWiseTextEditable
    this.setState({ sectionWiseTextEditable: sectionWiseTextEditable })
  }

  languageHelpReset() {
    this.setState({ resetLanguageHelp: false })
  }

  unhighlightAll() {
    for (let i in this.state.highlightableDivWords) {
      $(this.state.highlightableDivWords[i][0]).unhighlight()
    }
    this.setState({ highlightableDivWords: [] })
    this.highlightableDivWords = []
  }

  underlineEntitySpellError() {
    if (
      this.sectionsEntitiesToHighlight[this.props.sectionName].hasOwnProperty(
        'language'
      ) &&
      this.sectionsEntitiesToHighlight[this.props.sectionName][
        'language'
      ].hasOwnProperty('spell_check') &&
      this.sectionsEntitiesToHighlight[this.props.sectionName]['language'][
        'spell_check'
      ].hasOwnProperty(this.props.currentIndex) &&
      this.sectionsEntitiesToHighlight[this.props.sectionName]['language'][
        'spell_check'
      ][this.props.currentIndex].hasOwnProperty('text')
    ) {
      for (let i in this.sectionsEntitiesToHighlight[this.props.sectionName][
        'language'
      ]['spell_check'][this.props.currentIndex]['text']) {
        let entity = this.sectionsEntitiesToHighlight[this.props.sectionName][
          'language'
        ]['spell_check'][this.props.currentIndex]['text'][i]['entity']
        let text = this.sectionsEntitiesToHighlight[this.props.sectionName][
          'language'
        ]['spell_check'][this.props.currentIndex]['text'][i]['text']
        $(
          '.' + sectionUnderscore[this.props.sectionName] + '-entity-' + entity
        ).highlight(text, {
          className: 'underline-spell-error',
          wordsOnly: true,
        })
      }
    }
  }

  cleanWord(word) {
    if (_.isUndefined(word)) {
      return ''
    }
    let map = {
      por: 'Position of Responsibility',
      job_industry: 'Industry',
      degree_category: 'Degree',
      'fp&a': 'FP&A',
      job_role: 'Job Role',
      job_function: 'Job Function',
      projects: 'Projects',
      concentration: 'Concentration',
      schools: 'School/University',
      clubs: 'Club/Society',
      awards: 'Awards',
      competitions: 'Competitions',
      certifications: 'Certifications',
      goals: 'Goal Based Keyword',
      company_name: 'Company/Organisation',
      contact_information: 'Contact Information',
      coursework: 'Coursework',
      competitive_exams: 'Competitive Exam',
      volunteer_experience: 'Volunteer Experience',
    }

    if (map.hasOwnProperty(word)) {
      return map[word]
    }
    let frags = word.split(/[ _]+/)
    for (let i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
    }
    return frags.join(' ')
  }

  highlightEntityText(submodule, buttonLabel, type, finalHighlightTexts = []) {
    const {
      dataSkills,
      dataContent,
      dataLanguage,
      dataImpact,
      dataRephraseWords,
    } = this.props
    let texts = {}
    let highlightableDivWords = []
    if (type == 'static') {
      if (submodule == 'categories') {
        texts = this.sectionsEntitiesToHighlight[this.props.sectionName][
          submodule
        ][this.props.currentIndex][buttonLabel].text
      } else if (submodule == 'skills') {
        if (this.props.sectionName == 'Headline') {
          texts = [{ entity: 'text', text: buttonLabel }]
        } else {
          texts = this.sectionsEntitiesToHighlight[this.props.sectionName][
            submodule
          ]['relevant_skills_present'][this.props.currentIndex][buttonLabel]
        }
      } else if (submodule == 'language') {
        texts = this.sectionsEntitiesToHighlight[this.props.sectionName][
          submodule
        ][buttonLabel][this.props.currentIndex].text
      } else if (submodule == 'impact') {
        texts = this.sectionsEntitiesToHighlight[this.props.sectionName][
          submodule
        ][buttonLabel][this.props.currentIndex].text
      }
    } else {
      if (submodule == 'categories') {
        texts = finalHighlightTexts
      } else if (submodule == 'skills') {
        texts = finalHighlightTexts
      } else if (submodule == 'language') {
        texts = dataLanguage[buttonLabel]['highlightValues']
      } else if (submodule == 'impact') {
        texts = dataImpact[buttonLabel]['highlightValues']
      } else if (submodule == 'rephrase_words') {
        texts = dataRephraseWords[buttonLabel]['highlightValues']
      }
    }
    let textArray = []
    for (let i in texts) {
      highlightableDivWords.push([
        '.' +
          sectionUnderscore[this.props.sectionName] +
          '-entity-' +
          texts[i]['entity'],
        texts[i]['text'],
        submodule,
      ])
      let escapedText = texts[i]['text'].replace(/\.$/, '')
      escapedText = escapedText
        .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      // escapedText = '([\\b\\W]|^)' + escapedText + '([\\b\\W]|$)'
      // escapedText = '(?!\\n[\\b\\W]|^)*' + escapedText + '(?=[\\b\\W]|$)'  anmol
      // escapedText = '(?!\\n[\\W]|^)*\\b' + escapedText + '(?=[\\b\\W]|$)'
      escapedText =
        '(?!\\n[\\W]|^)*(\\b(?=[\\w])|)' + escapedText + '(?=[\\b\\W]|$)'
      textArray.push(escapedText)
    }
    let regexString = ''
    if (!_.isEmpty(texts)) {
      regexString = new RegExp(textArray.join('|'), 'ig')
    }

    this.highlightableDivWords = [regexString, submodule]

    this.setState({ highlightableDivWords: highlightableDivWords })

    if (!_.isUndefined(this.interval)) {
      clearInterval(this.interval)
    }

    this.interval = setInterval(() => this.checkIfHighlighDone(), 500)

    setTimeout(() => {
      clearInterval(this.interval)
    }, 2000)
  }

  checkIfHighlighDone() {
    let ele = $('.hwt-container textarea')
    let ele1 = $('.hwt-highlights mark:first')

    if (!_.isUndefined(ele[0]) && !_.isUndefined(ele1[0])) {
      $('.hwt-container textarea').animate(
        {
          scrollTop:
            $('.hwt-container textarea').scrollTop() +
            $('.hwt-highlights mark:first').offset().top -
            $('.hwt-container textarea').offset().top,
        },
        {
          specialEasing: {
            width: 'linear',
            height: 'easeOutBounce',
          },
        }
      )

      clearInterval(this.interval)
    }
  }

  handleOnChangeData(sectionUnderscoreName, currentIndex, entity, data) {
    if (sectionUnderscoreName === 'personal_information') {
      if (entity === 'profile_url') {
        if (data.length > 58) {
          let errorMessage = 'Maximum limit of 30 characters reached'
          notification(errorMessage, 'error', timeOutMilliseconds)
        }

        let testStr = data
        let param = testStr.slice(28)
        let valid = checkLinkedinUrlSanity(param)

        if (!valid) {
          let errorMessage = 'Entered character not allowed in this field.'
          notification(errorMessage, 'error', timeOutMilliseconds)
          return false
        }
      }
    }

    if (
      charCountLimit.hasOwnProperty(sectionUnderscoreName) &&
      charCountLimit[sectionUnderscoreName].hasOwnProperty(entity) &&
      charCountLimit[sectionUnderscoreName][entity] < data.length
    ) {
      let errorMessage =
        'Maximum limit of ' +
        charCountLimit[sectionUnderscoreName][entity] +
        ' characters reached'
      notification(errorMessage, 'error', timeOutMilliseconds)
    }
    let sectionWiseTextEditable = $.extend(
      true,
      {},
      this.state.sectionWiseTextEditable
    )
    //sectionWiseTextEditable[sectionUnderscoreName][currentIndex][entity] = data.substr(0,charCountLimit[sectionUnderscoreName][entity])
    sectionWiseTextEditable[sectionUnderscoreName][currentIndex][entity] = data
    this.sectionWiseTextEditable = sectionWiseTextEditable
    this.setState({ sectionWiseTextEditable: sectionWiseTextEditable })
    return true
  }

  handleOnChangePicture(currentIndex, imageData) {
    let sectionWiseTextEditable = $.extend(
      true,
      {},
      this.state.sectionWiseTextEditable
    )
    sectionWiseTextEditable['profile_picture'][currentIndex]['picture_url'] =
      imageData.url
    sectionWiseTextEditable['profile_picture'][currentIndex]['picture_string'] =
      imageData.string
    sectionWiseTextEditable['profile_picture'][currentIndex][
      'original_string'
    ] = imageData.original_image_string
    const parameters = [
      'face_frame_ratio',
      'background',
      'foreground',
      'resolution',
      'symmetry',
      'face_body_ratio',
      'professional_clothes',
      'pupil',
      'smile',
    ]
    for (let i in parameters) {
      if (
        imageData.hasOwnProperty(parameters[i]) &&
        !_.isNull(imageData[parameters[i]])
      ) {
        sectionWiseTextEditable['profile_picture'][currentIndex][
          parameters[i]
        ] = imageData[parameters[i]]
      }
    }
    this.sectionWiseTextEditable = sectionWiseTextEditable
    this.setState({ sectionWiseTextEditable: sectionWiseTextEditable })
  }

  getDynamicEditFeedbackForModule(module) {
    const {
      fetchId,
      sectionName,
      currentIndex,
      newSubSection,
      feedback,
      sectionWiseTextStatic,
      fetchEditDynamicData,
    } = this.props
    let data = this.sectionWiseTextEditable[sectionUnderscore[sectionName]][
      currentIndex
    ]
    let prevData = {}
    if (newSubSection == false) {
      prevData =
        sectionWiseTextStatic[sectionUnderscore[sectionName]][currentIndex]
    }
    let countSections = _.size(
      sectionWiseTextStatic[sectionUnderscore[sectionName]]
    )
    let score = 0
    if (feedback['section_score'].hasOwnProperty(currentIndex)) {
      score = feedback['section_score'][currentIndex]['score']
    }

    fetchEditDynamicData(
      fetchId,
      sectionName,
      currentIndex,
      countSections,
      newSubSection,
      data,
      '',
      prevData,
      score,
      false,
      module,
      this.sectionWiseTextEditable[sectionUnderscore[sectionName]]
    )
  }

  handleSaveChanges() {
    const {
      fetchId,
      sectionName,
      currentIndex,
      newSubSection,
      feedback,
      sectionWiseTextStatic,
      processEditedData,
    } = this.props

    let data = this.sectionWiseTextEditable[sectionUnderscore[sectionName]][
      currentIndex
    ]

    let sectionUnderscoreName = sectionUnderscore[sectionName]

    let sectionEntities = []
    _.mapObject(charCountLimit, function(val, key) {
      if (key == sectionUnderscoreName) {
        sectionEntities = _.keys(val)
      }
    })

    if (sectionUnderscoreName === 'personal_information') {
      let entity = 'name'

      if (entity == 'name') {
        if (
          charCountLimit.hasOwnProperty(sectionUnderscoreName) &&
          charCountLimit[sectionUnderscoreName].hasOwnProperty(entity) &&
          charCountLimit[sectionUnderscoreName][entity] < data[entity].length
        ) {
          let errorMessage =
            'Maximum limit of ' +
            charCountLimit[sectionUnderscoreName][entity] +
            ' characters reached for ' +
            'Name' +
            ' field'
          notification(errorMessage, 'error', timeOutMilliseconds)
          return false
        }
        if (data[entity].length < 3) {
          let errorMessage = 'Profile name should have atleast 3 characters'
          notification(errorMessage, 'error', timeOutMilliseconds)
          return false
        }
      }

      entity = 'profile_url'

      if (entity == 'profile_url') {
        if (data[entity].length < 31) {
          let errorMessage = 'Profile url should have atleast 3 characters'
          notification(errorMessage, 'error', timeOutMilliseconds)
          return false
        }

        if (data[entity].length > 58) {
          let errorMessage =
            'Maximum limit of 30 characters reached for Profile Url'
          notification(errorMessage, 'error', timeOutMilliseconds)
          return false
        }

        let testStr = data[entity]
        let param = testStr.slice(28)
        let valid = checkLinkedinUrlSanity(param)

        if (!valid) {
          let errorMessage = 'There are some invalid characters in URL'
          notification(errorMessage, 'error', timeOutMilliseconds)
          return false
        }
      }
    } else if (
      sectionUnderscoreName == 'headline' ||
      sectionUnderscoreName == 'summary'
    ) {
      for (let i = 0; i < sectionEntities.length; i++) {
        let entity = sectionEntities[i]
        if (
          charCountLimit.hasOwnProperty(sectionUnderscoreName) &&
          charCountLimit[sectionUnderscoreName].hasOwnProperty(entity) &&
          charCountLimit[sectionUnderscoreName][entity] < data[entity].length
        ) {
          let errorMessage =
            'Maximum limit of ' +
            charCountLimit[sectionUnderscoreName][entity] +
            ' characters reached for ' +
            sectionName +
            ' field'
          notification(errorMessage, 'error', timeOutMilliseconds)
          return false
        }
      }
    } else if (
      sectionUnderscoreName == 'experience' ||
      sectionUnderscoreName == 'education'
    ) {
      for (let i = 0; i < sectionEntities.length; i++) {
        let entity = sectionEntities[i]
        let showField = entity
        if (entity == 'text') {
          showField = 'description'
        }
        if (
          charCountLimit.hasOwnProperty(sectionUnderscoreName) &&
          charCountLimit[sectionUnderscoreName].hasOwnProperty(entity) &&
          charCountLimit[sectionUnderscoreName][entity] < data[entity].length
        ) {
          let errorMessage =
            'Maximum limit of ' +
            charCountLimit[sectionUnderscoreName][entity] +
            ' characters reached for ' +
            showField +
            ' field'
          notification(errorMessage, 'error', timeOutMilliseconds)
          return false
        }
      }
    }

    let prevData = {}
    if (newSubSection == false) {
      prevData =
        sectionWiseTextStatic[sectionUnderscore[sectionName]][currentIndex]
    }
    let countSections = _.size(
      sectionWiseTextStatic[sectionUnderscore[sectionName]]
    )
    let score = 0
    if (feedback['section_score'].hasOwnProperty(currentIndex)) {
      score = feedback['section_score'][currentIndex]['score']
    }

    if (sectionName == 'Profile Picture') {
      if (_.isObject(prevData['picture_string'])) {
        prevData['picture_string'] =
          prevData['picture_string']['profile_picture_string']
      }
      if (_.isObject(data['picture_string'])) {
        data['picture_string'] =
          data['picture_string']['profile_picture_string']
      }
    }

    let jsonObjectForTracking = {
      eventLabel: 'save_changes_btn',
      currentSection: sectionName,
      currentIndex: currentIndex,
    }
    this.sendTrackingDataDebounceSave(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )

    let timeEditingEnd = new Date()
    let timeEditingSpent =
      (timeEditingEnd.getTime() - this.timeEditingStart) / 1000
    // this.timeEditingStart = timeEditingEnd.getTime()

    if (timeEditingSpent > 1) {
      let jsonObjectForTracking = {
        eventLabel: 'editing_time',
        time: timeEditingSpent,
      }
      this.sendTrackingDataDebounce(
        'event',
        'aspire_edit_screen',
        'time',
        JSON.stringify(jsonObjectForTracking)
      )
    }
    // Edit action to api
    processEditedData(
      fetchId,
      sectionName,
      currentIndex,
      countSections,
      newSubSection,
      data,
      '',
      prevData,
      score,
      false,
      this.emptyMessage(sectionName, data)
    )
  }

  emptyMessage(sectionName, data) {
    if (
      sectionName == 'Headline' &&
      _.isEmpty(data['text']) &&
      _.isEmpty(data['text'].trim())
    ) {
      return 'Headline field must not be empty.'
    }
    if (
      sectionName == 'Summary' &&
      _.isEmpty(data['text']) &&
      _.isEmpty(data['text'].trim())
    ) {
      return 'Summary field must not be empty.'
    }

    if (
      sectionName == 'Experience' &&
      (_.isEmpty(data['title']) ||
        _.isEmpty(data['title'].trim()) ||
        _.isEmpty(data['company']) ||
        _.isEmpty(data['company'].trim()) ||
        _.isNull(data['from']) ||
        _.isNull(data['to']))
    ) {
      return 'Title, Company and Duration fields are compulsory for Experience section.'
    }

    if (sectionName == 'Experience') {
      let dateFormat = 'MMM YYYY'
      let fromDate = data['from']
      let tempFromDate = moment(fromDate, dateFormat, true)
      let fromCheck = tempFromDate.isValid()
      if (!fromCheck) {
        return "Invalid date format of 'From' field"
      }

      if (!tempFromDate.isBefore(moment())) {
        return "Start date cannot be past today's date"
      }
      data['from'] = tempFromDate.format(dateFormat)

      let toDate = data['to']
      let tempToDate = moment(toDate, dateFormat, true)
      if (toDate !== 'Present') {
        let toCheck = tempToDate.isValid()
        if (!toCheck) {
          return "Invalid date format of 'To' field"
        }

        if (!tempToDate.isBefore(moment())) {
          return "End date cannot be past today's date"
        }

        if (
          !tempFromDate.isBefore(tempToDate, 'month') &&
          !tempFromDate.isSame(tempToDate, 'month')
        ) {
          return 'End date cannot be earlier than Start date'
        }
        data['to'] = tempToDate.format(dateFormat)
      }
    }

    if (
      sectionName == 'Education' &&
      _.isEmpty(data['school']) &&
      _.isEmpty(data['school'].trim())
    ) {
      return 'School field is compulsory for Education section.'
    }

    if (
      sectionName == 'Education' &&
      _.isEmpty(data['from']) &&
      !_.isEmpty(data['to'])
    ) {
      return 'From field is required.'
    }
    if (
      sectionName == 'Education' &&
      !_.isEmpty(data['from']) &&
      _.isEmpty(data['to'])
    ) {
      return 'To field is required.'
    }

    if (
      sectionName == 'Volunteer Experience' &&
      _.isEmpty(data['title']) &&
      _.isEmpty(data['title'].trim())
    ) {
      return 'Title field is compulsory in Volunteer Experience section.'
    }
    if (
      sectionName == 'Projects' &&
      _.isEmpty(data['title']) &&
      _.isEmpty(data['title'].trim())
    ) {
      return 'Title field is compulsory in Projects section.'
    }
    if (
      sectionName == 'Publications' &&
      _.isEmpty(data['title']) &&
      _.isEmpty(data['title'].trim())
    ) {
      return 'Title field is compulsory in Publications section.'
    }

    if (
      sectionName == 'Personal Information' &&
      _.isEmpty(data['profile_url']) &&
      data['profile_url'].length < 33
    ) {
      return 'Profile URL is invalid. Your custom URL may be outside range of 5-30 characters or uses characters that LinkedIn doesn’t allow.'
    }
    if (
      sectionName == 'Personal Information' &&
      _.isEmpty(data['name']) &&
      _.isEmpty(data['name'].trim())
    ) {
      return 'Profile name must not be empty.'
    }

    return false
  }

  toggleKeyboardFunctionality(boolValue) {
    this.setState({ keyboardEscape: boolValue })
  }

  render() {
    const {
      has_pdf,
      fetchId,
      show,
      sectionName,
      currentIndex,
      newSubSection,
      derivedSkills,
      sectionWiseText,
      sectionsPerSkill,
      resumeSkillsInLinkedin,
      feedback,
      sectionWiseTextStatic,
      showEditModal,
      hideEditModal,
      updateEditSection,
      allCapsResume,
      allSmallResume,
      normalResume,
      has_resume,
      focusDisable,
    } = this.props
    const CurrentEditComponent = sectionComponents[sectionName]

    let dialogClassName = 'modal-width-small'
    let className = 'as-edit-modal-scrollable'

    if (sectionName == 'Personal Information') {
      dialogClassName = 'personal-information-modal'
      className = 'as-edit-modal-scrollable'
    } else if (sectionName == 'Profile Picture') {
      dialogClassName = 'profile-picture-modal'
      className = 'as-edit-modal-scrollable'
    } else if (sectionName == 'Headline') {
      dialogClassName = 'headline-modal'
      className = 'as-edit-modal-scrollable'
    } else if (sectionName == 'Education') {
      dialogClassName = 'education-modal'
      className = 'as-edit-modal-scrollable'
    } else if (sectionName == 'Experience') {
      dialogClassName = 'experience-modal'
      className = 'as-edit-modal-scrollable'
    } else if (sectionName == 'Summary') {
      dialogClassName = 'summary-modal'
      className = 'as-edit-modal-scrollable'
    }

    let sectionUnderscoreName = sectionUnderscore[sectionName]
    let keyboardEscape = this.state.keyboardEscape
    return (
      <div>
        <FocusLock disabled={!show || focusDisable}>
          <Modal
            keyboard={keyboardEscape}
            className={`${className} ${dialogClassName}`}
            isOpen={show}
            onRequestHide={() =>
              hideEditModal(
                sectionUnderscoreName,
                currentIndex,
                this.state.sectionWiseTextEditable[sectionUnderscoreName],
                sectionWiseTextStatic[sectionUnderscoreName]
              )
            }
            dialogClassName={dialogClassName}>
            <ModalBody tabIndex={-1}>
              <CurrentEditComponent
                tabIndex={1}
                has_pdf={has_pdf}
                fetchId={fetchId}
                currentIndex={currentIndex}
                newSubSection={newSubSection}
                derivedSkills={derivedSkills}
                sectionWiseText={sectionWiseText}
                sectionWiseTextEditable={
                  this.state.sectionWiseTextEditable[
                    sectionUnderscore[sectionName]
                  ]
                }
                sectionWiseTextStatic={
                  sectionWiseTextStatic[sectionUnderscore[sectionName]]
                }
                resumeSkillsInLinkedin={resumeSkillsInLinkedin}
                resetLanguageHelp={this.state.resetLanguageHelp}
                languageHelpReset={this.languageHelpReset}
                underlineEntitySpellError={this.underlineEntitySpellError}
                highlightEntityText={this.highlightEntityText}
                sectionsEntitiesToHighlight={this.sectionsEntitiesToHighlight}
                unhighlightAll={this.unhighlightAll}
                sectionsPerSkill={sectionsPerSkill}
                feedback={feedback}
                hideEditModal={hideEditModal}
                handleOnChangeData={this.handleOnChangeData}
                handleOnChangePicture={this.handleOnChangePicture}
                handleUndoData={this.handleUndoData}
                handleSaveChanges={this.handleSaveChanges}
                updateEditSection={updateEditSection}
                allCapsResume={allCapsResume}
                allSmallResume={allSmallResume}
                normalResume={normalResume}
                highlightableDivWords={this.highlightableDivWords}
                has_resume={has_resume}
                getDynamicEditFeedbackForModule={
                  this.getDynamicEditFeedbackForModule
                }
                toggleKeyboardFunctionality={this.toggleKeyboardFunctionality}
                focusDisable={focusDisable}
              />
            </ModalBody>
          </Modal>
        </FocusLock>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    edited_section_mapping:
      state.aspireFeedbackData.data.edited_section_mapping,
    sectionWiseTextStatic: state.detailedFeedbackUi.sectionWiseTextStatic,
    has_pdf: state.aspireFeedbackData.has_pdf,
    allCapsResume: state.aspireFeedbackData.allCapsResume,
    allSmallResume: state.aspireFeedbackData.allSmallResume,
    normalResume: state.aspireFeedbackData.normalResume,
    detailedFeedbackUi: state.detailedFeedbackUi,
    visited_sections: state.aspireFeedbackData.visited_sections,
    hasResume: state.aspireFeedbackData.has_resume,
    dataSkills: state.aspireEditDynamicData.dataSkills,
    dataContent: state.aspireEditDynamicData.dataContent,
    dataLanguage: state.aspireEditDynamicData.dataLanguage,
    dataImpact: state.aspireEditDynamicData.dataImpact,
    dataRephraseWords: state.aspireEditDynamicData.dataRephraseWords,
  }
}

export default connect(mapStateToProps, {
  updateText,
  processEditedData,
  fetchNewSamples,
  markSectionVisited,
  fetchEditDynamicData,
})(EditSection)
