import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  selectSection,
  selectIndex,
  updateText,
} from '../actions/DetailedFeedback'
import {
  detailedFeedbackUpdated,
  redirectSelect,
  updateFeedbackState,
} from '../actions/AspireFeedback'
import { updateImageData } from '../actions/ImageUpload'
import DetailedFeedbackComponent from '../components/DetailedFeedback'
import sections from '../config/sections'
import $ from 'jquery'
import _ from 'underscore'
import 'jquery-highlight'
import { updateEditedDataState } from '../actions/Edit'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { sectionUnderscore } from '../components/Constants/UniversalMapping'

const reverseSectionCamelCase = {
  '#personal_information': 'Personal Information',
  '#profile_picture': 'Profile Picture',
  '#headline': 'Headline',
  '#summary': 'Summary',
  '#experience': 'Experience',
  '#education': 'Education',
}

const bulletReplacements = {
  '149': '45', // 8226 for • , 45 for -
  '226': '45',
  '150': '45',
  '239': '45',
  '238': '45',
  '33': '45',
  '167': '45',
  '8226': '45',
}

class DetailedFeedback extends Component {
  constructor(props) {
    super(props)
    this.onSelectSection = this.onSelectSection.bind(this)
    this.onSelectPrev = this.onSelectPrev.bind(this)
    this.onSelectNext = this.onSelectNext.bind(this)
    this.onUpdateText = this.onUpdateText.bind(this)
    this.unhighlightAll = this.unhighlightAll.bind(this)
    this.resetSectionNavs = this.resetSectionNavs.bind(this)
    this.underlineSpellError = this.underlineSpellError.bind(this)
    this.editSectionUpdated = this.editSectionUpdated.bind(this)
    this.changeNewSubSectionValue = this.changeNewSubSectionValue.bind(this)
    this.changeModalState = this.changeModalState.bind(this)
    this.setSelectedPanelPersonalInfo = this.setSelectedPanelPersonalInfo.bind(
      this
    )

    this.spellErrors = []
    this.derivedSkills = {}
    this.targetFunctionBackToFrontEndMapping = this.props.functions['mapping']
    this.profileData = this.fetchProfileData(this.props.feedback)
    this.logModalMounted = false
    this.editModalMounted = false

    this.state = {
      highlightableDivWords: [],
      highlightableDivIds: [],
      highlightedSection: '',
      activeNavIndex: 0,
      newSubSection: false,
      selectedPanelPersonalInfo: 'name',
    }
    this.updateEditSection = false
    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 2000, true)
    this.sendTrackingDataDebouncePrevBtn = _.debounce(
      sendTrackingData,
      500,
      true
    )
    this.sendTrackingDataDebounceNextBtn = _.debounce(
      sendTrackingData,
      500,
      true
    )
  }

  setSelectedPanelPersonalInfo(panelName) {
    this.setState({ selectedPanelPersonalInfo: panelName })
  }

  UNSAFE_componentWillMount() {
    const {
      updateText,
      redirectSelect,
      selectSection,
      match: { params },
    } = this.props

    updateText({
      updateKeys: [
        ['totalScore'],
        ['totalScoreColor'],
        ['resumeSkillsInLinkedin'],
        ['resumeSkillsNotInLinkedin'],
        ['derivedSkills'],
        ['sections'],
        ['sectionsPerSkill'],
        ['sectionWiseText'],
        ['sectionWiseTextPdf'],
        ['sectionWiseTextEditable'],
        ['sectionWiseTextStatic'],
        ['sectionsEntitiesToHighlight'],
        ['logs'],
      ],
      data: this.profileData,
    })

    if (!_.isEmpty(this.props.location.hash)) {
      let key = reverseSectionCamelCase[this.props.location.hash]
      if (!_.isUndefined(key)) {
        selectSection(key)
        redirectSelect(
          params.fetchId,
          'detailed',
          this.props.location.hash,
          true
        )
      } else {
        selectSection('Personal Information')
        redirectSelect(params.fetchId, 'detailed', 'Personal Information')
      }
    } else {
      selectSection('Personal Information')
      redirectSelect(params.fetchId, 'detailed', 'Personal Information')
    }

    if (this.props.callOnSelectSectionDependenciesInDetailedFeedback == true) {
      this.unhighlightAll()
      this.resetSectionNavs(0)
      this.props.selectSection(this.props.keyForSelectSection)
      this.props.updateFeedbackState({
        updateKeys: [
          ['callOnSelectSectionDependenciesInDetailedFeedback'],
          ['keyForSelectSection'],
        ],
        data: {
          callOnSelectSectionDependenciesInDetailedFeedback: false,
          keyForSelectSection: '',
        },
      })

      const {
        update_detailed_state,
        ui,
        feedback,
        editedSection,
        editedSubSectionId,
        editedIsNewSubSection,
        editedSectionDeleted,
      } = this.props

      if (update_detailed_state == true) {
        const { detailedFeedbackUpdated, updateText } = this.props
        this.profileData = this.fetchProfileData(this.props.feedback)
        let { section, sectionWiseText } = ui
        let { edited_section_mapping } = feedback
        let currentIndex = ui[section]['currentIndex']
        this.profileData[section] = {}
        this.profileData['section'] = section
        this.profileData[section]['currentIndex'] = ui[section]['currentIndex']
        if (
          !_.isEmpty(edited_section_mapping) &&
          !_.isEmpty(editedSection) &&
          _.size(edited_section_mapping) > 1 &&
          section == editedSection
        ) {
          if (editedIsNewSubSection == true) {
            // size > 1, so other sub_sections already exist
            if (this.state.newSubSection == true) {
              // Edit Modal is open to new section (section name_new)
              for (var i in edited_section_mapping) {
                if (edited_section_mapping[i]['is_new_sub_section'] == true) {
                  this.profileData[section]['currentIndex'] =
                    edited_section_mapping[i]['new_sub_section_id']
                  break
                }
              }
            } else {
              for (var i in edited_section_mapping) {
                if (
                  currentIndex ==
                  edited_section_mapping[i]['old_sub_section_id']
                ) {
                  this.profileData[section]['currentIndex'] =
                    edited_section_mapping[i]['new_sub_section_id']
                  break
                }
              }
            }
          } else if (
            editedSectionDeleted != true &&
            !_.isString(editedSubSectionId)
          ) {
            for (var i in edited_section_mapping) {
              if (
                edited_section_mapping[i]['new_sub_section_id'] !== -1 &&
                currentIndex == edited_section_mapping[i]['old_sub_section_id']
              ) {
                this.profileData[section]['currentIndex'] =
                  edited_section_mapping[i]['new_sub_section_id']
                break
              }
            }
          }
        }

        // re-assign currentIndex for deleted section
        if (
          !_.isEmpty(edited_section_mapping) &&
          !_.isEmpty(editedSection) &&
          editedSectionDeleted == true &&
          section == editedSection
        ) {
          if (
            edited_section_mapping.length === 1 &&
            currentIndex === edited_section_mapping[0]['old_sub_section_id']
          ) {
            this.profileData['section'] = section
          }
          this.profileData[section]['currentIndex'] = 0
        }

        updateText({
          updateKeys: [
            ['section'],
            [section, 'currentIndex'],
            ['totalScore'],
            ['totalScoreColor'],
            ['resumeSkillsInLinkedin'],
            ['resumeSkillsNotInLinkedin'],
            ['derivedSkills'],
            ['sections'],
            ['sectionsPerSkill'],
            ['sectionWiseText'],
            ['sectionWiseTextPdf'],
            ['sectionWiseTextEditable'],
            ['sectionWiseTextStatic'],
            ['sectionsEntitiesToHighlight'],
            ['logs'],
          ],
          data: this.profileData,
        })

        this.props.updateEditedDataState({
          updateKeys: [['new_sub_section'], ['delete_sub_section']],
          data: { new_sub_section: false, delete_sub_section: false },
        })
        detailedFeedbackUpdated()

        this.props.selectSection(section)
        redirectSelect(params.fetchId, 'detailed', section)
        this.updateEditSection = true
      }
    }
  }

  componentDidMount() {
    this.unhighlightAll()
    this.hashLinkScroll()
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      update_detailed_state,
      ui,
      feedback,
      editedSection,
      editedSubSectionId,
      editedIsNewSubSection,
      editedSectionDeleted,
      imageData,
      redirectSelect,
      match: { params },
    } = this.props
    if (imageData.update_store == true) {
      const { updateImageData, updateText } = this.props
      // Update store
      this.profileData = this.fetchProfileData(this.props.feedback)
      updateText({
        updateKeys: [['sectionWiseTextEditable']],
        data: this.profileData,
      })
      if (imageData.edit_picture_mounted == false) {
        updateImageData({
          updateKeys: [['uploaded_image'], ['update_store']],
          data: { uploaded_image: false, update_store: false },
        })
      } else {
        updateImageData({
          updateKeys: [['update_store']],
          data: { update_store: false },
        })
      }
    }

    if (imageData.refresh_url == true) {
      const { updateImageData, updateText } = this.props

      // Update store
      this.profileData = this.fetchProfileData(this.props.feedback)
      if (
        this.profileData['sectionWiseTextStatic'][
          'profile_picture'
        ].hasOwnProperty('0')
      ) {
        let tmp = {
          sectionWiseTextEditable: {
            profile_picture: { '0': { picture_url: imageData.url } },
          },
          sectionWiseTextStatic: {
            profile_picture: { '0': { picture_url: imageData.url } },
          },
        }
        updateText({
          updateKeys: [
            ['sectionWiseTextEditable', 'profile_picture', '0', 'picture_url'],
            ['sectionWiseTextStatic', 'profile_picture', '0', 'picture_url'],
          ],
          data: tmp,
        })
      }

      if (imageData.edit_picture_mounted == false) {
        updateImageData({
          updateKeys: [['uploaded_image'], ['refresh_url']],
          data: { uploaded_image: false, refresh_url: false },
        })
      } else {
        updateImageData({
          updateKeys: [['refresh_url']],
          data: { refresh_url: false },
        })
      }
    }

    if (update_detailed_state == true) {
      const { detailedFeedbackUpdated, updateText } = this.props
      this.profileData = this.fetchProfileData(this.props.feedback)
      let { section, sectionWiseText } = ui
      let { edited_section_mapping } = feedback
      let currentIndex = ui[section]['currentIndex']
      this.profileData[section] = {}
      this.profileData['section'] = section
      this.profileData[section]['currentIndex'] = ui[section]['currentIndex']
      if (
        !_.isEmpty(edited_section_mapping) &&
        !_.isEmpty(editedSection) &&
        _.size(edited_section_mapping) > 1 &&
        section == editedSection
      ) {
        if (editedIsNewSubSection == true) {
          // size > 1, so other sub_sections already exist
          if (this.state.newSubSection == true) {
            // Edit Modal is open to new section (section name_new)
            for (var i in edited_section_mapping) {
              if (edited_section_mapping[i]['is_new_sub_section'] == true) {
                this.profileData[section]['currentIndex'] =
                  edited_section_mapping[i]['new_sub_section_id']
                break
              }
            }
          } else {
            for (var i in edited_section_mapping) {
              if (
                currentIndex == edited_section_mapping[i]['old_sub_section_id']
              ) {
                this.profileData[section]['currentIndex'] =
                  edited_section_mapping[i]['new_sub_section_id']
                break
              }
            }
          }
        } else if (
          editedSectionDeleted != true &&
          !_.isString(editedSubSectionId)
        ) {
          for (var i in edited_section_mapping) {
            if (
              edited_section_mapping[i]['new_sub_section_id'] !== -1 &&
              currentIndex == edited_section_mapping[i]['old_sub_section_id']
            ) {
              this.profileData[section]['currentIndex'] =
                edited_section_mapping[i]['new_sub_section_id']
              break
            }
          }
        }
      }

      // re-assign currentIndex for deleted section
      if (
        !_.isEmpty(edited_section_mapping) &&
        !_.isEmpty(editedSection) &&
        editedSectionDeleted == true &&
        section == editedSection
      ) {
        if (
          edited_section_mapping.length === 1 &&
          currentIndex === edited_section_mapping[0]['old_sub_section_id']
        ) {
          this.profileData['section'] = section
        }
        this.profileData[section]['currentIndex'] = 0
      }

      updateText({
        updateKeys: [
          ['section'],
          [section, 'currentIndex'],
          ['totalScore'],
          ['totalScoreColor'],
          ['resumeSkillsInLinkedin'],
          ['resumeSkillsNotInLinkedin'],
          ['derivedSkills'],
          ['sections'],
          ['sectionsPerSkill'],
          ['sectionWiseText'],
          ['sectionWiseTextPdf'],
          ['sectionWiseTextEditable'],
          ['sectionWiseTextStatic'],
          ['sectionsEntitiesToHighlight'],
          ['logs'],
        ],
        data: this.profileData,
      })

      this.props.updateEditedDataState({
        updateKeys: [['new_sub_section'], ['delete_sub_section']],
        data: { new_sub_section: false, delete_sub_section: false },
      })
      detailedFeedbackUpdated()

      this.props.selectSection(section)

      redirectSelect(params.fetchId, 'detailed', section)

      this.updateEditSection = true
    } else {
      for (var i in this.state.highlightableDivWords) {
        if (this.state.highlightableDivWords[i][2] == 'highlight') {
          $(this.state.highlightableDivWords[i][0]).highlight(
            this.state.highlightableDivWords[i][1],
            { wordsOnly: true }
          )
          $(this.state.highlightableDivWords[i][0]).attr('tabindex', 11)
        } else if (this.state.highlightableDivWords[i][2] == 'highlight-red') {
          $(this.state.highlightableDivWords[i][0]).highlight(
            this.state.highlightableDivWords[i][1],
            { className: 'highlight-red', wordsOnly: true }
          )
          $(this.state.highlightableDivWords[i][0]).attr('tabindex', 11)
        } else if (this.state.highlightableDivWords[i][2] == 'addClass') {
          $(this.state.highlightableDivWords[i][0]).addClass('highlight')
          $(this.state.highlightableDivWords[i][0]).attr('tabindex', 11)
        } else if (this.state.highlightableDivWords[i][2] == 'addClass-red') {
          $(this.state.highlightableDivWords[i][0]).addClass('highlight-red')
          $(this.state.highlightableDivWords[i][0]).attr('tabindex', 11)
        }
      }

      for (var i in this.state.highlightableDivIds) {
        $(this.state.highlightableDivIds[i][0]).addClass(
          this.state.highlightableDivIds[i][1]
        )
        $(this.state.highlightableDivIds[i][0]).attr('tabindex', 11)
      }
    }
    if (this.props.location.hash !== prevProps.location.hash) {
      this.hashLinkScroll()
    }
  }

  hashLinkScroll() {
    const { hash } = window.location
    if (hash !== '') {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(() => {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) element.scrollIntoView()
      }, 0)
    }
  }

  onSelectSection(e, type) {
    const {
      selectSection,
      redirectSelect,
      ui,
      markSectionVisited,
      match: { params },
    } = this.props
    var key = _.isUndefined(e.currentTarget.dataset['key'])
      ? 'Personal Information'
      : e.currentTarget.dataset['key']
    this.unhighlightAll()
    this.resetSectionNavs(0)
    selectSection(key)
    let jsonObjectForTracking = {
      eventLabel: 'section_select',
      sectionName: key,
      currentIndex: ui[key]['currentIndex'],
      type: type,
    }

    this.sendTrackingDataDebounce(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    redirectSelect(params.fetchId, 'detailed', key)
  }

  resetSectionNavs(i = 0) {
    this.setState({ activeNavIndex: i })
  }

  onSelectPrev(index, sectionName, currentSection) {
    if (sectionName !== currentSection) {
      return
    }

    const { selectIndex } = this.props

    if (index > 0) {
      let jsonObjectForTracking = {
        eventLabel: 'prev_section_btn',
        sectionName: sectionName,
        subSectionId: index,
      }
      this.sendTrackingDataDebouncePrevBtn(
        'event',
        'aspire_detailed_feedback_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )

      index = index - 1
    } else {
      let jsonObjectForTracking = {
        eventLabel: 'disabled_prev_section_btn',
        sectionName: sectionName,
        subSectionId: index,
      }
      this.sendTrackingDataDebouncePrevBtn(
        'event',
        'aspire_detailed_feedback_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
    }

    this.unhighlightAll()
    selectIndex(index)
  }

  onSelectNext(index, len, sectionName, currentSection) {
    if (sectionName !== currentSection) {
      return
    }

    const { selectIndex } = this.props

    if (index < len - 1) {
      let jsonObjectForTracking = {
        eventLabel: 'next_section_btn',
        sectionName: sectionName,
        subSectionId: index,
      }
      this.sendTrackingDataDebounceNextBtn(
        'event',
        'aspire_detailed_feedback_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )

      index = index + 1
    } else {
      let jsonObjectForTracking = {
        eventLabel: 'disabled_next_section_btn',
        sectionName: sectionName,
        subSectionId: index,
      }
      this.sendTrackingDataDebounceNextBtn(
        'event',
        'aspire_detailed_feedback_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
    }

    this.unhighlightAll()
    selectIndex(index)
  }

  underlineSpellError() {
    for (let i in this.spellErrors) {
      $(this.spellErrors[i][0]).highlight(this.spellErrors[i][1], {
        className: 'underline-spell-error',
        wordsOnly: true,
      })
    }
  }

  changeNewSubSectionValue(value) {
    this.setState({ newSubSection: value })
  }

  editSectionUpdated() {
    this.updateEditSection = false
  }

  changeModalState(component, bool) {
    if (component == 'edit') {
      this.editModalMounted = bool
    } else if (component == 'log') {
      this.logModalMounted = bool
    }
  }

  unhighlightAll() {
    $('.highlightable .highlight-red').unhighlight({
      className: 'highlight-red',
    })
    $('.highlightable .highlight').unhighlight()
    $('.highlightable.highlight-red').unhighlight({
      className: 'highlight-red',
    })
    $('.highlightable.highlight').unhighlight()
    $('.highlight').attr('tabindex', -1)
    $('.highlight-div').attr('tabindex', -1)
    $('.highlight-red').attr('tabindex', -1)
    $('.highlight').removeClass('highlight')
    $('.highlight-red').removeClass('highlight-red')
    $('.highlight-div').removeClass('highlight-div')
    this.setState({ highlightableDivWords: [], highlightableDivIds: [] })

    const { updateText } = this.props
    let tempData = Object.assign({}, this.profileData)
    let prevSection = this.state.highlightedSection
    if (prevSection == 'Headline') {
      tempData['sectionWiseText'][
        sectionUnderscore[prevSection]
      ] = this.wrapHeadline(
        this.props.feedback['section_wise_feedback']['headline_feedback'][
          'text_array'
        ],
        {}
      )
      updateText({
        updateKeys: [['sectionWiseText', sectionUnderscore[prevSection]]],
        data: tempData,
      })
    } else if (
      prevSection == 'Summary' ||
      prevSection == 'Experience' ||
      prevSection == 'Education' ||
      prevSection == 'Volunteer Experience' ||
      prevSection == 'Projects' ||
      prevSection == 'Publications'
    ) {
      tempData['sectionWiseText'][
        sectionUnderscore[prevSection]
      ] = this.wrapText(
        this.props.feedback['section_wise_feedback'],
        sectionUnderscore[prevSection] + '_feedback',
        {}
      )
      updateText({
        updateKeys: [['sectionWiseText', sectionUnderscore[prevSection]]],
        data: tempData,
      })
    }
  }

  onUpdateText(obj, flag, currentSection, highlightClass = '') {
    this.unhighlightAll()
    const { updateText } = this.props
    this.setState({ highlightableDivWords: [], highlightableDivIds: [] })
    if (flag == 1) {
      // word
      var highlightableDivWords = []
      for (var divId in obj) {
        for (var i in obj[divId]) {
          if (highlightClass == '') {
            highlightableDivWords.push([`.div-id-${divId}`,
              obj[divId][i]['word'],
              'highlight',
            ])
          } else {
            highlightableDivWords.push([
              `.div-id-${divId}`,
              obj[divId][i]['word'],
              highlightClass,
            ])
          }
        }
      }
      this.setState({ highlightableDivWords: highlightableDivWords })
    } else if (flag == 2) {
      // word, pos
      var tempData = Object.assign({}, this.profileData)
      if (currentSection == 'Headline') {
        tempData['sectionWiseText'][
          sectionUnderscore[currentSection]
        ] = this.wrapHeadline(
          this.props.feedback['section_wise_feedback']['headline_feedback'][
            'text_array'
          ],
          obj
        )
      } else if (
        currentSection == 'Summary' ||
        currentSection == 'Experience' ||
        currentSection == 'Education' ||
        currentSection == 'Volunteer Experience' ||
        currentSection == 'Projects' ||
        currentSection == 'Publications'
      ) {
        tempData['sectionWiseText'][
          sectionUnderscore[currentSection]
        ] = this.wrapText(
          this.props.feedback['section_wise_feedback'],
          sectionUnderscore[currentSection] + '_feedback',
          obj
        )
      }

      const { updateText } = this.props
      updateText({
        updateKeys: [['sectionWiseText', sectionUnderscore[currentSection]]],
        data: tempData,
      })
      var highlightableDivWords = []
      for (var divId in obj) {
        for (var i in obj[divId]) {
          if (highlightClass == '') {
            highlightableDivWords.push([
							`.div-id-${divId}.word-pos.highlightable`,
              obj[divId][i]['word'],
              'addClass',
            ])
          } else {
            highlightableDivWords.push([
              `.div-id-${divId}.word-pos.highlightable`,
              obj[divId][i]['word'],
              highlightClass,
            ])
          }
        }
      }
      this.setState({ highlightableDivWords: highlightableDivWords })
    } else if (flag == 3) {
      var highlightableDivIds = []
      for (var i in obj) {
        if (highlightClass == '') {
          highlightableDivIds.push([`.div-id-${obj[i]}`, 'highlight-div'])
        } else {
          highlightableDivIds.push([`.div-id-${obj[i]}`, highlightClass])
        }
      }
      this.setState({ highlightableDivIds: highlightableDivIds })
    } else if (flag == 4) {
      var highlightableDivWords = []
      for (var i in obj['ids']) {
        highlightableDivWords.push([
          `.div-id-${obj['ids'][i]}`,
          obj['word'],
          'highlight',
        ])
      }
      this.setState({ highlightableDivWords: highlightableDivWords })
    } else if (flag == 5) {
      var highlightableDivIds = []
      for (var i in obj) {
        highlightableDivIds.push([`'.div-id-${obj[i]} a`, 'highlight-div'])
      }
      this.setState({ highlightableDivIds: highlightableDivIds })
    } else if (flag == 6) {
      var highlightableDivIds = []
      for (var i in obj['div_ids']) {
        highlightableDivIds.push([
          `.div-id-${obj['div_ids'][i]}`,
          'highlight-div',
        ])
      }

      // word
      var highlightableDivWords = []
      for (var divId in obj['weak_obj']) {
        for (var i in obj['weak_obj'][divId]) {
          highlightableDivWords.push([
            `.div-id-${divId}`,
            obj['weak_obj'][divId][i]['word'],
            'highlight-red',
          ])
        }
      }

      this.setState({
        highlightableDivIds: highlightableDivIds,
        highlightableDivWords: highlightableDivWords,
      })
    } else if (flag == 7) {
      var highlightableDivIds = []
      for (var i in obj['div_ids']) {
        highlightableDivIds.push([
          `.div-id-${obj['div_ids'][i]}`,
          'highlight-div',
        ])
      }

      // word, pos
      var tempData = Object.assign({}, this.profileData)
      if (currentSection == 'Headline') {
        tempData['sectionWiseText'][
          sectionUnderscore[currentSection]
        ] = this.wrapHeadline(
          this.props.feedback['section_wise_feedback']['headline_feedback'][
            'text_array'
          ],
          obj['weak_obj']
        )
      } else if (
        currentSection == 'Summary' ||
        currentSection == 'Experience' ||
        currentSection == 'Education' ||
        currentSection == 'Volunteer Experience' ||
        currentSection == 'Projects' ||
        currentSection == 'Publications'
      ) {
        tempData['sectionWiseText'][
          sectionUnderscore[currentSection]
        ] = this.wrapText(
          this.props.feedback['section_wise_feedback'],
          sectionUnderscore[currentSection] + '_feedback',
          obj['weak_obj']
        )
      }

      const { updateText } = this.props
      updateText({
        updateKeys: [['sectionWiseText', sectionUnderscore[currentSection]]],
        data: tempData,
      })
      var highlightableDivWords = []
      for (var divId in obj['weak_obj']) {
        for (var i in obj['weak_obj'][divId]) {
          highlightableDivWords.push([
            `.div-id-${divId}.word-pos.highlightable`,
            obj['weak_obj'][divId][i]['word'],
            'addClass-red',
          ])
        }
      }
      this.setState({
        highlightableDivIds: highlightableDivIds,
        highlightableDivWords: highlightableDivWords,
      })
    }
    this.setState({ highlightedSection: currentSection })
  }

  checkAlreadyParsed() {
    const {
      totalScore,
      totalScoreColor,
      resumeSkillsInLinkedin,
      resumeSkillsNotInLinkedin,
      derivedSkills,
      sectionWiseText,
      sectionWiseTextPdf,
      sections,
      sectionsPerSkill,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
      sectionsEntitiesToHighlight,
      logs,
    } = this.props.ui
    if (!_.isEmpty(totalScoreColor)) {
      return {
        totalScore: totalScore,
        totalScoreColor: totalScoreColor,
        resumeSkillsInLinkedin: resumeSkillsInLinkedin,
        resumeSkillsNotInLinkedin: resumeSkillsNotInLinkedin,
        sectionWiseText: sectionWiseText,
        sectionWiseTextPdf: sectionWiseTextPdf,
        derivedSkills: derivedSkills,
        sections: sections,
        sectionsPerSkill: sectionsPerSkill,
        sectionWiseTextEditable: sectionWiseTextEditable,
        sectionWiseTextStatic: sectionWiseTextStatic,
        sectionsEntitiesToHighlight: sectionsEntitiesToHighlight,
        logs: logs,
      }
    } else {
      return {}
    }
  }

  fetchProfileData(feedback) {
    const { update_detailed_state, uploaded_picture, imageData } = this.props

    if (update_detailed_state == false && imageData.update_store == false) {
      let checkOutput = this.checkAlreadyParsed()
      if (!_.isEmpty(checkOutput)) {
        return checkOutput
      }
    }

    let totalScore =
      feedback['summary_screen']['overall_total_score_class']['overall_score']
    let totalScoreColor =
      feedback['summary_screen']['overall_total_score_class']['color_feedback']
    let resumeSkillsInLinkedin = [].concat(
      _.keys(feedback['skills_in_resume_in_linkedin']['hard_skills']),
      _.keys(feedback['skills_in_resume_in_linkedin']['soft_skills'])
    )
    let resumeSkillsNotInLinkedin = [].concat(
      _.keys(feedback['skills_in_resume_not_in_linkedin']['hard_skills']),
      _.keys(feedback['skills_in_resume_not_in_linkedin']['soft_skills'])
    )

    let sectionFeedback = feedback['section_wise_feedback']
    if (
      _.isNull(
        sectionFeedback['personal_information_feedback'][
          'connections_score_class'
        ]['connections']
      )
    ) {
      sectionFeedback['personal_information_feedback'][
        'connections_score_class'
      ]['connections'] = 0
    }
    if (
      !sectionFeedback['personal_information_feedback'][
        'connections_score_class'
      ].hasOwnProperty('connections_threshold')
    ) {
      sectionFeedback['personal_information_feedback'][
        'connections_score_class'
      ]['connections_threshold'] = 500
    }
    let personal_info = [
      sectionFeedback['personal_information_feedback']['current_company'],
      sectionFeedback['personal_information_feedback']['latest_school'],
      sectionFeedback['personal_information_feedback']['user_location'],
    ]
    personal_info = personal_info.filter(
      item => !_.isEmpty(item) && !_.isUndefined(item)
    )
    personal_info = personal_info.join(' . ')

    let sectionWiseText = {
      imageUrl:
        uploaded_picture != '' &&
        !_.isUndefined(uploaded_picture) &&
        uploaded_picture['url'] != ''
          ? uploaded_picture['url']
          : sectionFeedback.hasOwnProperty('profile_picture_feedback') &&
            sectionFeedback['profile_picture_feedback'].hasOwnProperty(
              'profile_picture_url'
            )
          ? sectionFeedback['profile_picture_feedback']['profile_picture_url']
          : '',
      imageString:
        uploaded_picture != '' && !_.isUndefined(uploaded_picture)
          ? uploaded_picture['string']
          : '',
      name:
        sectionFeedback['personal_information_feedback'][
          'profile_name_score_class'
        ]['name'],
      personal_information: personal_info,
      profile_url:
        sectionFeedback['personal_information_feedback']['url_score_class'][
          'url'
        ],
      suggested_urls:
        sectionFeedback['personal_information_feedback']['suggested_urls'],
      headline: this.wrapHeadline(
        sectionFeedback['headline_feedback']['text_array']
      ),
      summary: this.wrapText(sectionFeedback, 'summary_feedback'),
      experience: this.wrapText(sectionFeedback, 'experience_feedback'),
      education: this.wrapText(sectionFeedback, 'education_feedback'),
      volunteer_experience: this.wrapText(
        sectionFeedback,
        'volunteer_experience_feedback'
      ),
      skills: this.wrapSkills(
        sectionFeedback['skills_and_expertise_feedback']['text_array']
      ),
      projects: this.wrapText(sectionFeedback, 'projects_feedback'),
      publications: this.wrapText(sectionFeedback, 'publications_feedback'),
    }
    this.derivedSkills = {}
    let sections = {
      'Personal Information': !_.isEmpty(
        sectionFeedback['personal_information_feedback']
      )
        ? {
            section: 'yellow',
            name:
              sectionFeedback['personal_information_feedback'][
                'profile_name_score_class'
              ]['color_feedback'],
            url:
              sectionFeedback['personal_information_feedback'][
                'url_score_class'
              ]['color_feedback'],
            connections:
              sectionFeedback['personal_information_feedback'][
                'connections_score_class'
              ]['color_feedback'],
            connections_threshold:
              sectionFeedback['personal_information_feedback'][
                'connections_score_class'
              ]['connections_threshold'],
            section_score: this.getSectionScore(
              sectionFeedback['personal_information_feedback'],
              false,
              'personal_information_feedback'
            ),
          }
        : {
            section: 'yellow',
            name: '',
            url: '',
            connections: 0,
            section_score: [],
          },
      'Profile Picture':
        sectionFeedback.hasOwnProperty('profile_picture_feedback') &&
        !_.isEmpty(sectionFeedback['profile_picture_feedback'])
          ? {
              section:
                sectionFeedback['profile_picture_feedback'][
                  'image_score_class'
                ]['color_feedback'],
              face_frame_ratio:
                sectionFeedback['profile_picture_feedback'][
                  'face_frame_ratio_feedback'
                ],
              background:
                sectionFeedback['profile_picture_feedback'][
                  'background_illumination_feedback'
                ],
              foreground:
                sectionFeedback['profile_picture_feedback'][
                  'foreground_illumination_feedback'
                ],
              resolution:
                sectionFeedback['profile_picture_feedback'][
                  'image_resolution_feedback'
                ],
              symmetry:
                sectionFeedback['profile_picture_feedback'][
                  'shoulder_symmetry_feedback'
                ],
              face_body_ratio:
                sectionFeedback['profile_picture_feedback'][
                  'face_body_ratio_feedback'
                ],
              professional_clothes:
                sectionFeedback['profile_picture_feedback'][
                  'professional_clothes_feedback'
                ],
              pupil:
                sectionFeedback['profile_picture_feedback']['pupil_feedback'],
              smile:
                sectionFeedback['profile_picture_feedback']['smile_feedback'],
              section_score: this.getSectionScore(
                sectionFeedback['profile_picture_feedback'],
                false,
                'profile_picture_feedback'
              ),
            }
          : {
              section: 'red',
              face_frame_ratio: { feedback: 'Not Detected' },
              background: { feedback: 'Not Detected' },
              foreground: { feedback: 'Not Detected' },
              resolution: { feedback: 'Not Detected' },
              symmetry: { feedback: 'Not Detected' },
              face_body_ratio: { feedback: 'Not Detected' },
              professional_clothes: { feedback: 'Not Detected' },
              pupil: { feedback: 'Not Detected' },
              smile: { feedback: 'Not Detected' },
              section_score: this.getSectionScore(
                { color_feedback: 'red', overall_section_score: 0 },
                false,
                'profile_picture_feedback'
              ),
            },
      Headline: !_.isEmpty(sectionFeedback['headline_feedback'])
        ? {
            word_count_class: sectionFeedback[
              'headline_feedback'
            ].hasOwnProperty('char_count_score_class')
              ? [
                  {
                    color:
                      sectionFeedback['headline_feedback'][
                        'char_count_score_class'
                      ]['color_feedback'],
                    count:
                      sectionFeedback['headline_feedback'][
                        'char_count_score_class'
                      ]['char_count'],
                  },
                ]
              : [{ color: 'red', count: 0 }],
            first_div_id: this.getFirstDivId(
              sectionFeedback['headline_feedback'],
              false
            ),
            suggestions: this.getHeadlineSuggestions(
              sectionFeedback['headline_feedback']
            ),
            language: this.getLanguage(sectionFeedback['headline_feedback']),
            categories: this.getCategories(
              sectionFeedback['headline_feedback'],
              false
            ),
            categories_missing: this.getCategoriesMissing(
              sectionFeedback['headline_feedback']['categories_missing']
            ),
            categories_in_resume_not_in_linkedin: this.getCategoriesInResumeNotInLinkedin(
              sectionFeedback['summary_feedback'],
              'Headline'
            ),
            skills: this.getSkills(sectionFeedback['headline_feedback'], [
              'hard_skills',
            ]),
            seo: this.getSeo(sectionFeedback['headline_feedback'], false),
            experience_months: feedback.hasOwnProperty('experience_months')
              ? feedback['experience_months']
              : 0,
            is_professional: feedback.hasOwnProperty('is_professional')
              ? feedback['is_professional']
              : true,
            section_score: this.getSectionScore(
              sectionFeedback['headline_feedback'],
              false,
              'headine_feedback'
            ),
          }
        : {
            word_count_class: [{ color: 'red', count: 0 }],
            first_div_id: [],
            suggestions: [],
            language: {
              buzzwords: [],
              narrative_voice: [],
              spell_check: [],
              tense: [],
              verb_overusage: [],
              score: [],
            },
            categories: { categories: [], score: [] },
            categories_missing: [],
            categories_in_resume_not_in_linkedin: [],
            skills: {
              relevant_skills_missing: [],
              relevant_skills_present: [],
              score: [],
            },
            seo: { keywords: [], score: [] },
            experience_months: 0,
            is_professional: true,
            section_score: [],
          },
      Summary: !_.isEmpty(sectionFeedback['summary_feedback'])
        ? {
            word_count_class: sectionFeedback[
              'summary_feedback'
            ].hasOwnProperty('word_count_score_class')
              ? [
                  {
                    color:
                      sectionFeedback['summary_feedback'][
                        'word_count_score_class'
                      ]['color_feedback'],
                    count:
                      sectionFeedback['summary_feedback'][
                        'word_count_score_class'
                      ]['word_count'],
                  },
                ]
              : [{ color: 'red', count: 0 }],
            first_div_id: this.getFirstDivId(
              sectionFeedback['summary_feedback'],
              false
            ),
            language: this.getLanguage(sectionFeedback['summary_feedback']),
            impact: this.getImpact(sectionFeedback['summary_feedback'], false),
            categories: this.getCategories(
              sectionFeedback['summary_feedback'],
              false
            ),
            categories_missing: this.getCategoriesMissing(
              sectionFeedback['summary_feedback']['categories_missing']
            ),
            categories_in_resume_not_in_linkedin: this.getCategoriesInResumeNotInLinkedin(
              sectionFeedback['summary_feedback'],
              'Summary'
            ),
            skills: this.getSkills(sectionFeedback['summary_feedback']),
            seo: this.getSeo(sectionFeedback['summary_feedback'], false),
            experience_months: feedback.hasOwnProperty('experience_months')
              ? feedback['experience_months']
              : 0,
            is_professional: feedback.hasOwnProperty('is_professional')
              ? feedback['is_professional']
              : true,
            section_score: this.getSectionScore(
              sectionFeedback['summary_feedback'],
              false,
              'summary_feedback'
            ),
          }
        : {
            word_count_class: [{ color: 'red', count: 0 }],
            first_div_id: [],
            language: {
              buzzwords: [{ color: 'green', ids: {} }],
              narrative_voice: [{ color: 'green', ids: {} }],
              spell_check: [{ color: 'green', ids: {} }],
              tense: [{ color: 'green', ids: {} }],
              verb_overusage: [{ color: 'green', ids: {} }],
              score: [{ color: 'green', score: 99.99 }],
            },
            categories: {
              categories: [{}],
              score: [{ color: 'green', score: 99.99 }],
            },
            categories_missing: [[]],
            categories_in_resume_not_in_linkedin: [],
            skills: {
              relevant_skills_missing: [[]],
              relevant_skills_present: [{}],
              score: [{ color: 'red', score: 0.01 }],
            },
            seo: {
              keywords: [{ irrelevant: {}, relevant: {} }],
              score: [{ color: 'red', score: 0.01 }],
            },
            experience_months: 0,
            is_professional: true,
            section_score: [],
          },
      Experience: !_.isEmpty(sectionFeedback['experience_feedback'])
        ? {
            experience_count:
              sectionFeedback['experience_feedback'].hasOwnProperty(
                'number_of_experiences'
              ) &&
              sectionFeedback['experience_feedback'][
                'number_of_experiences'
              ].hasOwnProperty('color_feedback')
                ? sectionFeedback['experience_feedback'][
                    'number_of_experiences'
                  ]['color_feedback']
                : 'red',
            first_div_id: this.getFirstDivId(
              sectionFeedback['experience_feedback'],
              true
            ),
            word_count_class: sectionFeedback[
              'experience_feedback'
            ].hasOwnProperty('word_count_score_class')
              ? this.getWordCountClass(
                  sectionFeedback['experience_feedback'][
                    'word_count_score_class'
                  ]
                )
              : [],
            sub_section_bullet_feedback: sectionFeedback[
              'experience_feedback'
            ].hasOwnProperty('sub_section_bullet_feedback')
              ? sectionFeedback['experience_feedback'][
                  'sub_section_bullet_feedback'
                ]
              : [],
            language: this.getLanguage(sectionFeedback['experience_feedback']),
            impact: this.getImpact(
              sectionFeedback['experience_feedback'],
              true
            ),
            categories: this.getCategories(
              sectionFeedback['experience_feedback'],
              true
            ),
            categories_missing: this.getCategoriesMissing(
              sectionFeedback['experience_feedback']['categories_missing']
            ),
            categories_in_resume_not_in_linkedin: this.getCategoriesInResumeNotInLinkedin(
              sectionFeedback['experience_feedback'],
              'Experience'
            ),
            skills: this.getSkills(sectionFeedback['experience_feedback']),
            title_hard_skills: this.getExperienceTitleHardSkills(
              sectionFeedback['experience_feedback']
            ),
            seo: this.getSeo(sectionFeedback['experience_feedback'], true),
            recommended_title: this.getRecommendedTitle(
              sectionFeedback['experience_feedback']
            ),
            experience_months: this.getExperienceDuration(
              sectionFeedback['experience_feedback'][
                'cumulative_experience_per_subsection'
              ],
              sectionFeedback['experience_feedback']['number_of_experiences']
            ),
            experience_case: sectionFeedback[
              'experience_feedback'
            ].hasOwnProperty('sample_tags')
              ? sectionFeedback['experience_feedback']['sample_tags']
              : [],
            job_function_mapping: sectionFeedback[
              'experience_feedback'
            ].hasOwnProperty('job_function_mapping_per_sub_section')
              ? this.mapToFrontEndName(
                  sectionFeedback['experience_feedback'][
                    'job_function_mapping_per_sub_section'
                  ]
                )
              : [],
            section_score: this.getSectionScore(
              sectionFeedback['experience_feedback'],
              true,
              'experience_feedback'
            ),
          }
        : {
            experience_count: 'red',
            first_div_id: [],
            word_count_class: [],
            sub_section_bullet_feedback: [],
            language: {
              buzzwords: [],
              narrative_voice: [],
              spell_check: [],
              tense: [],
              verb_overusage: [],
              score: [],
            },
            impact: {
              action_oriented: [],
              action_oriented_color: [],
              specifics: [],
              specifics_color: [],
              score: [],
            },
            categories: { categories: [], score: [] },
            categories_missing: [],
            categories_in_resume_not_in_linkedin: [],
            skills: {
              relevant_skills_missing: [],
              relevant_skills_present: [],
              score: [],
            },
            seo: { keywords: [], score: [] },
            experience_months: [],
            experience_case: [],
            job_function_mapping: [],
            section_score: [],
          },
      Education: !_.isEmpty(sectionFeedback['education_feedback'])
        ? {
            first_div_id: this.getFirstDivId(
              sectionFeedback['education_feedback'],
              true
            ),
            categories: this.getCategories(
              sectionFeedback['education_feedback'],
              true
            ),
            categories_missing: this.getCategoriesMissing(
              sectionFeedback['education_feedback']['categories_missing']
            ),
            categories_in_resume_not_in_linkedin: this.getCategoriesInResumeNotInLinkedin(
              sectionFeedback['experience_feedback'],
              'Education'
            ),
            seo: this.getSeo(sectionFeedback['education_feedback'], true),
            section_score: this.getSectionScore(
              sectionFeedback['education_feedback'],
              true,
              'education_feedback'
            ),
            community_name_match: this.getFeedbackKey(
              sectionFeedback['education_feedback'],
              'community_name_match'
            ),
            community_name: this.getFeedbackKey(
              sectionFeedback['education_feedback'],
              'community_name'
            ),
          }
        : {
            first_div_id: [],
            categories: { categories: [], score: [] },
            categories_missing: [],
            categories_in_resume_not_in_linkedin: [],
            seo: { keywords: [], score: [] },
            section_score: [],
            community_name_match: null,
            community_name: null,
          },
      'Volunteer Experience': !_.isEmpty(
        sectionFeedback['volunteer_experience_feedback']
      )
        ? {
            word_count_class: sectionFeedback[
              'volunteer_experience_feedback'
            ].hasOwnProperty('word_count_score_class')
              ? this.getWordCountClass(
                  sectionFeedback['volunteer_experience_feedback'][
                    'word_count_score_class'
                  ]
                )
              : [],
            first_div_id: this.getFirstDivId(
              sectionFeedback['volunteer_experience_feedback'],
              true
            ),
            sub_section_bullet_feedback: sectionFeedback[
              'volunteer_experience_feedback'
            ].hasOwnProperty('sub_section_bullet_feedback')
              ? sectionFeedback['volunteer_experience_feedback'][
                  'sub_section_bullet_feedback'
                ]
              : [],
            language: this.getLanguage(
              sectionFeedback['volunteer_experience_feedback']
            ),
            impact: this.getImpact(
              sectionFeedback['volunteer_experience_feedback'],
              true
            ),
            skills: this.getSkills(
              sectionFeedback['volunteer_experience_feedback']
            ),
            section_score: this.getSectionScore(
              sectionFeedback['volunteer_experience_feedback'],
              true,
              'volunteer_experience_feedback'
            ),
          }
        : {
            word_count_class: [],
            first_div_id: [],
            sub_section_bullet_feedback: [],
            language: {
              buzzwords: [],
              narrative_voice: [],
              spell_check: [],
              tense: [],
              verb_overusage: [],
              score: [],
            },
            impact: {
              action_oriented: [],
              action_oriented_color: [],
              specifics: [],
              specifics_color: [],
              score: [],
            },
            skills: {
              relevant_skills_missing: [],
              relevant_skills_present: [],
              score: [],
            },
            section_score: [],
          },
      Skills: !_.isEmpty(sectionFeedback['skills_and_expertise_feedback'])
        ? {
            skills: this.getSkills(
              sectionFeedback['skills_and_expertise_feedback']
            ),
            section_score: this.getSectionScore(
              sectionFeedback['skills_and_expertise_feedback'],
              false,
              'skills_and_expertise_feedback'
            ),
          }
        : {
            skills: {
              relevant_skills_missing: [[]],
              relevant_skills_present: [[]],
              score: [{ color: null, score: 0.01 }],
            },
            section_score: [],
          },
      Projects: !_.isEmpty(sectionFeedback['projects_feedback'])
        ? {
            word_count_class: sectionFeedback[
              'projects_feedback'
            ].hasOwnProperty('word_count_score_class')
              ? this.getWordCountClass(
                  sectionFeedback['projects_feedback']['word_count_score_class']
                )
              : [],
            first_div_id: this.getFirstDivId(
              sectionFeedback['projects_feedback'],
              true
            ),
            sub_section_bullet_feedback: sectionFeedback[
              'projects_feedback'
            ].hasOwnProperty('sub_section_bullet_feedback')
              ? sectionFeedback['projects_feedback'][
                  'sub_section_bullet_feedback'
                ]
              : [],
            language: this.getLanguage(sectionFeedback['projects_feedback']),
            impact: this.getImpact(sectionFeedback['projects_feedback'], true),
            skills: this.getSkills(sectionFeedback['projects_feedback']),
            section_score: this.getSectionScore(
              sectionFeedback['projects_feedback'],
              true,
              'projects_feedback'
            ),
          }
        : {
            word_count_class: [],
            first_div_id: [],
            sub_section_bullet_feedback: [],
            language: {
              buzzwords: [],
              narrative_voice: [],
              spell_check: [],
              tense: [],
              verb_overusage: [],
              score: [],
            },
            impact: {
              action_oriented: [],
              action_oriented_color: [],
              specifics: [],
              specifics_color: [],
              score: [],
            },
            skills: {
              relevant_skills_missing: [],
              relevant_skills_present: [],
              score: [],
            },
            section_score: [],
          },
      Publications: !_.isEmpty(sectionFeedback['publications_feedback'])
        ? {
            word_count_class: sectionFeedback[
              'publications_feedback'
            ].hasOwnProperty('word_count_score_class')
              ? this.getWordCountClass(
                  sectionFeedback['publications_feedback'][
                    'word_count_score_class'
                  ]
                )
              : [],
            first_div_id: this.getFirstDivId(
              sectionFeedback['publications_feedback'],
              true
            ),
            language: this.getLanguage(
              sectionFeedback['publications_feedback']
            ),
            section_score: this.getSectionScore(
              sectionFeedback['publications_feedback'],
              true,
              'publications_feedback'
            ),
          }
        : {
            word_count_class: [],
            first_div_id: [],
            language: {
              buzzwords: [],
              narrative_voice: [],
              spell_check: [],
              tense: [],
              verb_overusage: [],
              score: [],
            },
            section_score: [],
          },
    }
    let sectionWiseTextPdf = $.extend(true, {}, sectionWiseText)
    let sectionWiseTextEditable = this.getSectionWiseTextEditable(
      sectionWiseText,
      sections['Profile Picture']
    )
    let entityMapEditable = this.getEditableEntitiesForHighlighting(
      sectionWiseTextEditable
    )
    let sectionsPerSkill = this.getSectionsPerSkill(sections)
    let sectionsEntitiesToHighlight = {
      'Personal Information': {},
      'Profile Picture': {},
      Headline: {
        language: this.getLanguageEntities(
          sections['Headline']['language'],
          entityMapEditable
        ),
        categories: this.getCategoriesEntities(
          sections['Headline']['categories'],
          entityMapEditable
        ),
        skills: this.getSkillsEntities(
          sections['Headline']['skills'],
          entityMapEditable
        ),
        seo: this.getSeoEntities(
          sections['Headline']['seo'],
          entityMapEditable
        ),
      },
      Summary: {
        language: this.getLanguageEntities(
          sections['Summary']['language'],
          entityMapEditable
        ),
        impact: this.getImpactEntities(
          sections['Summary']['impact'],
          entityMapEditable
        ),
        categories: this.getCategoriesEntities(
          sections['Summary']['categories'],
          entityMapEditable
        ),
        skills: this.getSkillsEntities(
          sections['Summary']['skills'],
          entityMapEditable
        ),
        seo: this.getSeoEntities(sections['Summary']['seo'], entityMapEditable),
      },
      Experience: {
        language: this.getLanguageEntities(
          sections['Experience']['language'],
          entityMapEditable
        ),
        impact: this.getImpactEntities(
          sections['Experience']['impact'],
          entityMapEditable
        ),
        categories: this.getCategoriesEntities(
          sections['Experience']['categories'],
          entityMapEditable
        ),
        skills: this.getSkillsEntities(
          sections['Experience']['skills'],
          entityMapEditable
        ),
        seo: this.getSeoEntities(
          sections['Experience']['seo'],
          entityMapEditable
        ),
      },
      Education: {
        categories: this.getCategoriesEntities(
          sections['Education']['categories'],
          entityMapEditable
        ),
        seo: this.getSeoEntities(
          sections['Education']['seo'],
          entityMapEditable
        ),
      },
      'Volunteer Experience': {
        language: this.getLanguageEntities(
          sections['Volunteer Experience']['language'],
          entityMapEditable
        ),
        impact: this.getImpactEntities(
          sections['Volunteer Experience']['impact'],
          entityMapEditable
        ),
        skills: this.getSkillsEntities(
          sections['Volunteer Experience']['skills'],
          entityMapEditable
        ),
      },
      Skills: {
        // Get only stated skills
      },
      Projects: {
        language: this.getLanguageEntities(
          sections['Projects']['language'],
          entityMapEditable
        ),
        impact: this.getImpactEntities(
          sections['Projects']['impact'],
          entityMapEditable
        ),
        skills: this.getSkillsEntities(
          sections['Projects']['skills'],
          entityMapEditable
        ),
      },
      Publications: {
        language: this.getLanguageEntities(
          sections['Publications']['language'],
          entityMapEditable
        ),
      },
    }

    if (_.isNull(sections['Summary']['impact'])) {
      delete sections['Summary']['impact']
      delete sectionsEntitiesToHighlight['Summary']['impact']
    }
    sectionWiseTextEditable = this.entityTextKeys(sectionWiseTextEditable)
    let sectionWiseTextStatic = $.extend(true, {}, sectionWiseTextEditable)
    let logs = this.getLogs()

    return {
      totalScore: totalScore,
      totalScoreColor: totalScoreColor,
      resumeSkillsInLinkedin: resumeSkillsInLinkedin,
      resumeSkillsNotInLinkedin: resumeSkillsNotInLinkedin,
      sectionWiseText: sectionWiseText,
      sectionWiseTextPdf: sectionWiseTextPdf,
      derivedSkills: this.derivedSkills,
      sections: sections,
      sectionsPerSkill: sectionsPerSkill,
      sectionWiseTextEditable: sectionWiseTextEditable,
      sectionWiseTextStatic: sectionWiseTextStatic,
      sectionsEntitiesToHighlight: sectionsEntitiesToHighlight,
      logs: logs,
    }
  }

  wrapHeadline(textArray, divWordPosObj = {}) {
    for (let divId in textArray) {
      return {
        type: 'div',
        div_id: divId,
        class: { highlight_class: 'highlightable div-id-' + divId, others: '' },
        text: this.splitWordPos(textArray[divId]['text'], divId, divWordPosObj),
      }
    }
  }

  wrapSkills(textArray) {
    return _.map(textArray, (value, key) => {
      return (
        <li className={'highlightable div-id-' + key} key={key}>
          <a href="#">{value['text']}</a>
        </li>
      )
    })
  }

  getFeedbackKey(sectionFeedback, key) {
    if (_.isUndefined(sectionFeedback[key])) {
      return null
    }
    return sectionFeedback[key]
  }

  wrapText(feedback, key, divWordPosObj = {}) {
    let output = {}
    if (
      _.isUndefined(feedback[key]) ||
      _.isUndefined(feedback[key]['text_array']) ||
      _.isEmpty(feedback[key]['text_array'])
    ) {
      return {}
    }
    let data = feedback[key]['text_array']
    if (key === 'summary_feedback') {
      output = {
        title: [],
        sub_title: [],
        time_duration: [],
        text: [],
      }
      var k = -1
      for (var i in data) {
        if (data[i]['is_title'] === true) {
          output['title'].push({
            type: 'title_span',
            key: i,
            div_id: i,
            class: {
              highlight_class: 'highlightable div-id-' + i,
              others: 'p-heading-1',
            },
            text: this.splitWordPos(data[i]['text'], i, divWordPosObj),
          })
        } else if (data[i]['is_sub_title'] === true) {
          output['sub_title'].push({
            type: 'div',
            key: i,
            div_id: i,
            class: {
              highlight_class: 'highlightable div-id-' + i,
              others: 'p-heading-2',
            },
            text: this.splitWordPos(data[i]['text'], i, divWordPosObj),
          })
        } else if (data[i]['is_time_duration'] === true) {
          output['time_duration'].push({
            type: 'div',
            key: i,
            div_id: i,
            class: {
              highlight_class: 'highlightable div-id-' + i,
              others: 'p-date',
            },
            text: this.splitWordPos(data[i]['text'], i, divWordPosObj),
          })
        } else {
          var newLine = false
          if (
            (k != -1 &&
              data[k].hasOwnProperty('new_line_id') &&
              data[i].hasOwnProperty('new_line_id') &&
              data[k]['new_line_id'] != data[i]['new_line_id']) ||
            (k == -1 && data[i].hasOwnProperty('new_line_id'))
          ) {
            newLine = true
          }
          var newParagraph = false
          if (
            k != -1 &&
            data[k].hasOwnProperty('paragraph_id') &&
            data[i].hasOwnProperty('paragraph_id') &&
            data[k]['paragraph_id'] != data[i]['paragraph_id']
          ) {
            newParagraph = true
          }
          var endPeriod = data[i]['text'].endsWith('.')
          output['text'].push({
            type: 'span',
            key: i,
            div_id: i,
            class: { highlight_class: 'highlightable div-id-' + i, others: '' },
            bullet: this.renderBullet(data[i], newLine),
            text: this.splitWordPos(data[i]['text'], i, divWordPosObj),
            new_line: newLine,
            new_paragraph: newParagraph,
            end_period: endPeriod,
          })
          k = i
        }
      }
    } else {
      for (let j in data) {
        let obj = data[j]
        output[j] = {
          title: [],
          sub_title: [],
          time_duration: [],
          text: [],
        }
        var k = -1
        for (var i in obj) {
          if (obj[i]['is_title'] === true) {
            output[j]['title'].push({
              type: 'title_span',
              key: i,
              div_id: i,
              class: {
                highlight_class: 'highlightable div-id-' + i,
                others: 'p-heading-1',
              },
              text: this.splitWordPos(obj[i]['text'], i, divWordPosObj),
            })
          } else if (obj[i]['is_sub_title'] === true) {
            output[j]['sub_title'].push({
              type: 'div',
              key: i,
              div_id: i,
              class: {
                highlight_class: 'highlightable div-id-' + i,
                others: 'p-heading-2',
              },
              text: this.splitWordPos(obj[i]['text'], i, divWordPosObj),
            })
          } else if (obj[i]['is_time_duration'] === true) {
            output[j]['time_duration'].push({
              type: 'div',
              key: i,
              div_id: i,
              class: {
                highlight_class: 'highlightable div-id-' + i,
                others: 'p-date',
              },
              text: this.splitWordPos(obj[i]['text'], i, divWordPosObj),
            })
          } else {
            if (key === 'education_feedback' && obj[i]['text'] === 'Grade:') {
              continue
            }
            var newLine = false
            if (
              k != -1 &&
              obj[i].hasOwnProperty('new_line_id') &&
              obj[k].hasOwnProperty('new_line_id') &&
              obj[i]['new_line_id'] != obj[k]['new_line_id']
            ) {
              newLine = true
            }
            var newParagraph = false
            if (
              k != -1 &&
              obj[i].hasOwnProperty('paragraph_id') &&
              obj[k].hasOwnProperty('paragraph_id') &&
              obj[i]['paragraph_id'] != obj[k]['paragraph_id']
            ) {
              newParagraph = true
            }
            if (
              obj[i - 1].hasOwnProperty('new_line_id') === false &&
              obj[i].hasOwnProperty('new_line_id')
            ) {
              newLine = true
            }
            var endPeriod = obj[i]['text'].endsWith('.')
            output[j]['text'].push({
              type: 'span',
              key: i,
              div_id: i,
              class: {
                highlight_class: 'highlightable div-id-' + i,
                others: '',
              },
              bullet: this.renderBullet(obj[i], newLine),
              text: this.splitWordPos(obj[i]['text'], i, divWordPosObj),
              new_line: newLine,
              new_paragraph: newParagraph,
              end_period: endPeriod,
            })
            k = i
          }
        }
      }
    }

    return output
  }

  renderBullet(textObj, newLine = true) {
    if (textObj['has_real_bullet_symbol'] == false || newLine == false) {
      return null
    }
    if (textObj.hasOwnProperty('bullet_ascii_value')) {
      if (bulletReplacements.hasOwnProperty(textObj['bullet_ascii_value'])) {
        return (
          String.fromCharCode(
            bulletReplacements[textObj['bullet_ascii_value']]
          ).trim() + ' '
        )
      }
      return String.fromCharCode(textObj['bullet_ascii_value']).trim() + ' '
    }
    if (textObj.hasOwnProperty('bullet_numeric_value')) {
      return textObj['bullet_numeric_value'].trim() + ' '
    }
  }
  splitWordPos(text, divId, divWordPosObj) {
    if (!divWordPosObj.hasOwnProperty(divId)) {
      return [text]
    }
    return this.splitTextPos(text, divId, divWordPosObj[divId])
  }
  splitTextPos(text, divId, wordPos) {
    if (_.isEmpty(wordPos)) {
      return [text]
    }
    wordPos = _.sortBy(wordPos, 'pos')
    wordPos = _.map(wordPos, (value, key) => ({
      pos: value['pos'],
      pos2: value['pos'] + value['word'].length - 1,
      suggestions: value.hasOwnProperty('suggestions')
        ? value['suggestions']
        : [],
      module_type: value.hasOwnProperty('module_type')
        ? value['module_type']
        : '',
    }))
    let wp = [
      {
        pos: wordPos[0]['pos'],
        pos2: wordPos[0]['pos2'],
        suggestions: wordPos[0]['suggestions'],
        module_type: wordPos[0]['module_type'],
      },
    ]
    let currInd = 0
    for (var i = 1; i < wordPos.length; i++) {
      if (wordPos[i]['pos'] <= wp[currInd]['pos2']) {
        if (wordPos[i]['pos2'] <= wp[currInd]['pos2']) {
          continue
        }
        wp[currInd]['pos2'] = wordPos[i]['pos2']
        continue
      }
      wp.push({
        pos: wordPos[i]['pos'],
        pos2: wordPos[i]['pos2'],
        suggestions: wordPos[i]['suggestions'],
        module_type: wordPos[i]['module_type'],
      })
      currInd++
    }

    let str = ''
    let output = [text.substr(0, wp[0]['pos'])]
    output.push({
      type: 'span',
      key: '0-' + divId,
      div_id: divId,
      class: {
        highlight_class: 'div-id-' + divId + ' word-pos highlightable',
        others: '',
      },
      text: text.substr(wp[0]['pos'], wp[0]['pos2'] - wp[0]['pos'] + 1),
      suggestions: wp[0]['suggestions'],
      module_type: wp[0]['module_type'],
    })
    for (var i = 1; i < wp.length; i++) {
      str = text.substr(
        wp[i - 1]['pos2'] + 1,
        wp[i]['pos'] - wp[i - 1]['pos2'] - 1
      )
      output.push(str)
      str = text.substr(wp[i]['pos'], wp[i]['pos2'] - wp[i]['pos'] + 1)
      output.push({
        type: 'span',
        key: i + '-' + divId,
        div_id: divId,
        class: {
          highlight_class: 'div-id-' + divId + ' word-pos highlightable',
          others: '',
        },
        text: str,
        suggestions: wp[i]['suggestions'],
        module_type: wp[i]['module_type'],
      })
    }
    str = text.substr(wp[currInd]['pos2'] + 1)
    output.push(str)
    return output
  }

  getSectionWiseTextEditable(sectionWiseText, profilePictureSections) {
    let sectionWiseTextEditable = {
      personal_information: [
        {
          name: sectionWiseText['name'],
          profile_url: sectionWiseText['profile_url'],
        },
      ],
      headline: [
        {
          text: {
            text: _.isUndefined(sectionWiseText['headline'])
              ? ''
              : sectionWiseText['headline']['text'][0],
            div_ids: [
              {
                div_id: _.isUndefined(sectionWiseText['headline'])
                  ? ''
                  : sectionWiseText['headline']['div_id'],
              },
            ], // empty is just for filling case
          },
        },
      ],
      summary: [
        { text: this.convertDomToString(sectionWiseText['summary']['text']) },
      ],
    }

    const { imageData } = this.props
    const imageParameters = [
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
    let profilePicture = {}
    profilePicture['picture_url'] = _.isNull(imageData['url'])
      ? sectionWiseText['imageUrl']
      : imageData['url']
    profilePicture['picture_string'] = _.isEmpty(imageData['string'])
      ? sectionWiseText['imageString']
      : imageData['string']
    profilePicture['original_string'] = imageData['original_image_string']
    for (var i in imageParameters) {
      if (!_.isNull(imageData[imageParameters[i]])) {
        profilePicture[imageParameters[i]] = imageData[imageParameters[i]]
      } else if (profilePictureSections.hasOwnProperty(imageParameters[i])) {
        profilePicture[imageParameters[i]] =
          profilePictureSections[imageParameters[i]]
      }
    }
    sectionWiseTextEditable['profile_picture'] = [profilePicture]
    let experience = []
    for (var i in sectionWiseText['experience']) {
      let temp = this.convertDomToString(
        sectionWiseText['experience'][i]['title']
      )
      temp['text'] = temp['text'].split(/[\s]+(at)[\s]+/)
      let tempExp = {}
      let size = _.size(temp['text'])
      if (size >= 3 && temp['text'][1] == 'at') {
        tempExp['title'] = {
          text: temp['text'].slice(0, 1).join(' '),
          div_ids: temp['div_ids'],
        }
        tempExp['company'] = {
          text: temp['text'].slice(2).join(' '),
          div_ids: temp['div_ids'],
        }
      } else {
        tempExp['title'] = {
          text: temp['text'].join(' '),
          div_ids: temp['div_ids'],
        }
        tempExp['company'] = { text: '', div_ids: [] }
      }

      let duration = this.convertDomToString(
        sectionWiseText['experience'][i]['sub_title']
      )
      duration['text'] = duration['text'].split(/[\s]+(-)[\s]+/)
      tempExp['from'] = $.extend(true, {}, duration)
      tempExp['from']['text'] = tempExp['from']['text'][0]
      tempExp['to'] = $.extend(true, {}, duration)
      tempExp['to']['text'] = tempExp['to']['text'].pop().split(' (')[0]
      tempExp['text'] = this.convertDomToString(
        sectionWiseText['experience'][i]['text']
      )
      experience.push(tempExp)
    }
    sectionWiseTextEditable['experience'] = experience
    let education = []
    var entities = this.props.feedback['section_wise_feedback'][
      'education_feedback'
    ]['education_entities']
    for (var i in sectionWiseText['education']) {
      let tempEdu = {}
      tempEdu['school'] = {
        text: entities[i].hasOwnProperty('name') ? entities[i]['name'] : '',
        div_ids: [
          { div_id: sectionWiseText['education'][i]['title'][0]['div_id'] },
        ],
      }
      tempEdu['from'] = { text: '', div_ids: [] }
      tempEdu['to'] = { text: '', div_ids: [] }
      tempEdu['degree'] = { text: '', div_ids: [] }
      tempEdu['field_of_study'] = { text: '', div_ids: [] }

      if (!_.isEmpty(sectionWiseText['education'][i]['sub_title'])) {
        let divId = sectionWiseText['education'][i]['sub_title'][0]['div_id']
        // var timeDuration = entities[i].hasOwnProperty('time_duration') ? entities[i]['time_duration'].split(' - ') : []
        if (
          entities[i].hasOwnProperty('time_duration') &&
          entities[i]['time_duration'].hasOwnProperty('start_date') &&
          entities[i]['time_duration']['start_date'].hasOwnProperty('year')
        ) {
          tempEdu['from'] = {
            text: entities[i]['time_duration']['start_date']['year'].toString(),
            div_ids: [{ div_id: divId }],
          }
        }
        if (
          entities[i].hasOwnProperty('time_duration') &&
          entities[i]['time_duration'].hasOwnProperty('end_date') &&
          entities[i]['time_duration']['end_date'].hasOwnProperty('year')
        ) {
          tempEdu['to'] = {
            text: entities[i]['time_duration']['end_date']['year'].toString(),
            div_ids: [{ div_id: divId }],
          }
        }
        if (entities[i].hasOwnProperty('degree')) {
          tempEdu['degree'] = {
            text: entities[i]['degree'],
            div_ids: [{ div_id: divId }],
          }
        }
        if (entities[i].hasOwnProperty('field_of_study')) {
          tempEdu['field_of_study'] = {
            text: entities[i]['field_of_study'].trim(),
            div_ids: [{ div_id: divId }],
          }
        }
      }

      tempEdu['activities_and_societies'] = this.getEducationTextContent(
        sectionWiseText['education'][i]['text']
      )

      education.push(tempEdu)
    }
    sectionWiseTextEditable['education'] = education
    let volunteerExperience = []
    for (var i in sectionWiseText['volunteer_experience']) {
      let tempVol = {}
      tempVol['title'] = this.convertDomToString(
        sectionWiseText['volunteer_experience'][i]['title']
      )
      tempVol['duration'] = this.convertDomToString(
        sectionWiseText['volunteer_experience'][i]['sub_title']
      )
      tempVol['text'] = this.convertDomToString(
        sectionWiseText['volunteer_experience'][i]['text']
      )
      volunteerExperience.push(tempVol)
    }
    sectionWiseTextEditable['volunteer_experience'] = volunteerExperience
    let skills = [],
      textArray = this.props.feedback['section_wise_feedback'][
        'skills_and_expertise_feedback'
      ]['text_array']
    for (var i in textArray) {
      skills.push({
        skill: { text: textArray[i]['text'], div_ids: [{ div_id: i }] },
      })
    }
    sectionWiseTextEditable['skills'] = skills
    let projects = []
    var entities = this.props.feedback['section_wise_feedback'][
      'projects_feedback'
    ]['project_entities']
    for (var i in sectionWiseText['projects']) {
      let tempProj = {}
      tempProj['title'] = this.convertDomToString(
        sectionWiseText['projects'][i]['title']
      )
      tempProj['members'] = { text: '', div_ids: [] }
      tempProj['duration'] = { text: '', div_ids: [] }
      for (var j in sectionWiseText['projects'][i]['sub_title']) {
        if (
          sectionWiseText['projects'][i]['sub_title'][j]['text'][0].substr(
            0,
            8
          ) == 'Members:'
        ) {
          tempProj['members'] = {
            text: entities[i]['members'].join(', '),
            div_ids: [
              {
                div_id:
                  sectionWiseText['projects'][i]['sub_title'][j]['div_id'],
              },
            ],
          }
        } else {
          tempProj['duration'] = {
            text: entities[i]['time_duration']['text'],
            div_ids: [
              {
                div_id:
                  sectionWiseText['projects'][i]['sub_title'][j]['div_id'],
              },
            ],
          }
        }
      }
      tempProj['text'] = this.convertDomToString(
        sectionWiseText['projects'][i]['text']
      )
      projects.push(tempProj)
    }
    sectionWiseTextEditable['projects'] = projects
    let publications = []
    var entities = this.props.feedback['section_wise_feedback'][
      'publications_feedback'
    ]['publications_entities']
    for (var i in sectionWiseText['publications']) {
      let tempPub = {}
      tempPub['title'] = this.convertDomToString(
        sectionWiseText['publications'][i]['title']
      )
      tempPub['publisher'] = { text: '', div_ids: [] }
      tempPub['publication_date'] = { text: '', div_ids: [] }
      tempPub['authors'] = { text: '', div_ids: [] }
      for (var j in sectionWiseText['publications'][i]['sub_title']) {
        if (
          sectionWiseText['publications'][i]['sub_title'][j]['text'][0].substr(
            0,
            8
          ) == 'Authors:'
        ) {
          tempPub['authors'] = {
            text: entities[i]['authors'].join(', '),
            div_ids: [
              {
                div_id:
                  sectionWiseText['publications'][i]['sub_title'][j]['div_id'],
              },
            ],
          }
        } else {
          if (entities[i].hasOwnProperty('publisher')) {
            tempPub['publisher'] = {
              text: entities[i]['publisher'],
              div_ids: [
                {
                  div_id:
                    sectionWiseText['publications'][i]['sub_title'][j][
                      'div_id'
                    ],
                },
              ],
            }
          }
          if (entities[i].hasOwnProperty('date')) {
            tempPub['publication_date'] = {
              text: entities[i]['date'],
              div_ids: [
                {
                  div_id:
                    sectionWiseText['publications'][i]['sub_title'][j][
                      'div_id'
                    ],
                },
              ],
            }
          }
        }
      }
      tempPub['text'] = this.convertDomToString(
        sectionWiseText['publications'][i]['text']
      )
      publications.push(tempPub)
    }
    sectionWiseTextEditable['publications'] = publications

    return sectionWiseTextEditable
  }
  convertDomToString(array) {
    let str = ''
    let divIds = []

    for (let i in array) {
      if (
        i !== '0' &&
        array[i].hasOwnProperty('new_line') &&
        array[i]['new_line'] == true
      ) {
        str += '\n'
      } else if (
        i !== '0' &&
        array[i].hasOwnProperty('new_paragraph') &&
        array[i]['new_paragraph'] == true
      ) {
        str += '\n'
      }

      if (array[i].hasOwnProperty('bullet') && !_.isNull(array[i]['bullet'])) {
        str += array[i]['bullet']
      }
      str += array[i]['text'][0]

      if (
        array[i].hasOwnProperty('end_period') &&
        array[i]['end_period'] == true
      ) {
        str += ' '
      }
      divIds.push({ div_id: array[i]['div_id'], text: array[i]['text'][0] })
    }
    return { text: str.trim(), div_ids: divIds }
  }

  getEducationTextContent(textArray) {
    let text = ''
    let divIds = []
    for (let divId in textArray) {
      if (
        textArray[divId]['is_title'] ||
        textArray[divId]['is_sub_title'] ||
        textArray[divId]['is_time_duration']
      ) {
        continue
      }

      text += textArray[divId]['text']
      text += '\n'
      divIds.push({ div_id: textArray[divId]['div_id'] })
    }
    //Replace only first occurance of activities and societies
    text = text.replace('Activities and Societies:', '')

    return { text: text.trim(), div_ids: divIds }
  }

  getEditableEntitiesForHighlighting(sectionWiseTextEditable) {
    let divMap = {}
    let secKeys = [
      'headline',
      'summary',
      'experience',
      'education',
      'volunteer_experience',
      'projects',
      'publications',
    ]
    for (let i in secKeys) {
      for (let sectionIndex in sectionWiseTextEditable[secKeys[i]]) {
        for (let entity in sectionWiseTextEditable[secKeys[i]][sectionIndex]) {
          for (let j in sectionWiseTextEditable[secKeys[i]][sectionIndex][
            entity
          ]['div_ids']) {
            if (
              !divMap.hasOwnProperty(
                sectionWiseTextEditable[secKeys[i]][sectionIndex][entity][
                  'div_ids'
                ][j]['div_id']
              )
            ) {
              divMap[
                sectionWiseTextEditable[secKeys[i]][sectionIndex][entity][
                  'div_ids'
                ][j]['div_id']
              ] = []
            }
            let text =
              sectionWiseTextEditable[secKeys[i]][sectionIndex][entity][
                'div_ids'
              ][j]['text']
            if (secKeys[i] == 'experience') {
              if (entity == 'title') {
                let title = text.split(/[\s]+(at)[\s]+/)
                let size = _.size(title)
                if (size >= 3 && title[1] == 'at') {
                  title = title.slice(0, 1).join(' ')
                } else {
                  title = title.join(' ')
                }
                text = title
              } else if (entity == 'company') {
                let company = text.split(/[\s]+(at)[\s]+/)
                let size = _.size(company)
                if (size >= 3 && company[1] == 'at') {
                  company = company.slice(2).join(' ')
                } else {
                  company = ''
                }

                text = company
              }
            }
            divMap[
              sectionWiseTextEditable[secKeys[i]][sectionIndex][entity][
                'div_ids'
              ][j]['div_id']
            ].push([secKeys[i], sectionIndex, entity, text])
          }
        }
      }
    }

    return divMap
  }
  entityTextKeys(sectionWiseTextEditable) {
    let secKeys = [
      'headline',
      'summary',
      'experience',
      'education',
      'volunteer_experience',
      'skills',
      'projects',
      'publications',
    ]
    for (let i in secKeys) {
      for (let sectionIndex in sectionWiseTextEditable[secKeys[i]]) {
        for (let entity in sectionWiseTextEditable[secKeys[i]][sectionIndex]) {
          sectionWiseTextEditable[secKeys[i]][sectionIndex][entity] =
            sectionWiseTextEditable[secKeys[i]][sectionIndex][entity]['text']
        }
      }
    }

    return sectionWiseTextEditable
  }

  getWordCountClass(wordCounts) {
    return _.map(wordCounts, function(val) {
      return { color: val['color_feedback'], count: val['word_count'] }
    })
  }

  getHeadlineSuggestions(sectionFeedback) {
    if (
      !(
        sectionFeedback.hasOwnProperty('headline_suggestion') &&
        sectionFeedback['headline_suggestion'].hasOwnProperty('headlineSamples')
      )
    ) {
      return []
    }

    let keywords = {}
    let legend = []
    let suggestions = []
    let suggestionsText = []

    for (let i in sectionFeedback['headline_suggestion']['headlineSamples']) {
      let chunks =
        sectionFeedback['headline_suggestion']['headlineSamples'][i][
          'chunked_form'
        ]
      let suggestion = []
      let suggestionText = []
      let legendLocal = {}
      for (let j in chunks) {
        if (j != 0) {
          suggestion.push(' ')
        }
        if (chunks[j]['chunk_label'] == 'delimiter') {
          suggestion.push(chunks[j]['chunk_text'].trim())
        } else {
          suggestion.push(<span key={j}>{chunks[j]['chunk_text'].trim()}</span>)
          suggestionText.push(chunks[j]['chunk_text'].trim())
          legendLocal[chunks[j]['chunk_label']] = 1
        }
      }
      suggestion = (
        <p className="highlightable headline-suggestion">{suggestion}</p>
      )
      suggestionsText.push(suggestionText.join())
      suggestions.push(suggestion)
      legend.push(_.keys(legendLocal))
    }

    return {
      suggestions: suggestions,
      legend: legend,
      suggestions_text: suggestionsText,
    }
  }

  getFirstDivId(sectionFeedback, isExperience) {
    let firstDivId = []
    if (!_.isUndefined(sectionFeedback['text_array'])) {
      if (!isExperience) {
        firstDivId.push(_.min(_.keys(sectionFeedback['text_array'])))
      } else {
        for (let i in sectionFeedback['text_array']) {
          firstDivId.push(_.min(_.keys(sectionFeedback['text_array'][i])))
        }
      }
    }

    return parseInt(firstDivId)
  }

  getLanguage(sectionFeedback) {
    let language = {}
    if (!_.isUndefined(sectionFeedback['overall_language_score_class'])) {
      language['score'] = []
      if (
        _.isUndefined(
          sectionFeedback['overall_language_score_class']['sub_section']
        )
      ) {
        language['score'].push({
          color:
            sectionFeedback['overall_language_score_class']['color_feedback'],
          score: this.lowerScore(
            sectionFeedback['overall_language_score_class'][
              'overall_language_score'
            ]
          ),
        })
      } else {
        for (var i in sectionFeedback['overall_language_score_class'][
          'sub_section'
        ]) {
          if (
            !sectionFeedback['overall_language_score_class']['sub_section'][
              i
            ].hasOwnProperty('sub_section_mapping') ||
            _.isNull(
              sectionFeedback['overall_language_score_class']['sub_section'][i][
                'sub_section_mapping'
              ]
            )
          ) {
            language['score'].push({
              color:
                sectionFeedback['overall_language_score_class']['sub_section'][
                  i
                ]['color_feedback'],
              score: this.lowerScore(
                sectionFeedback['overall_language_score_class']['sub_section'][
                  i
                ]['sample_score']
              ),
            })
          } else {
            language['score'][
              sectionFeedback['overall_language_score_class']['sub_section'][i][
                'sub_section_mapping'
              ]
            ] = {
              color:
                sectionFeedback['overall_language_score_class']['sub_section'][
                  i
                ]['color_feedback'],
              score: this.lowerScore(
                sectionFeedback['overall_language_score_class']['sub_section'][
                  i
                ]['sample_score']
              ),
            }
          }
        }
      }
    } else {
      language['score'] = [{ color: 'red', score: 0 }]
    }
    if (!_.isUndefined(sectionFeedback['buzzwords_score_class'])) {
      language['buzzwords'] = []
      for (var i in sectionFeedback['buzzwords_score_class']) {
        var ids = {}
        for (var j in sectionFeedback['buzzwords_score_class'][i][
          'buzzwords'
        ]) {
          var value =
            sectionFeedback['buzzwords_score_class'][i]['buzzwords'][j]
          if (!ids.hasOwnProperty(value['sentence_id'])) {
            ids[value['sentence_id']] = []
          }
          ids[value['sentence_id']].push({
            word: value['value'],
            pos: value['start_pos'],
          })
        }
        if (
          !sectionFeedback['buzzwords_score_class'][i].hasOwnProperty(
            'sub_section_mapping'
          ) ||
          _.isNull(
            sectionFeedback['buzzwords_score_class'][i]['sub_section_mapping']
          )
        ) {
          language['buzzwords'].push({
            color:
              sectionFeedback['buzzwords_score_class'][i][
                'buzzwords_color_feedback'
              ],
            ids: ids,
            pos_present: true,
          })
        } else {
          language['buzzwords'][
            sectionFeedback['buzzwords_score_class'][i]['sub_section_mapping']
          ] = {
            color:
              sectionFeedback['buzzwords_score_class'][i][
                'buzzwords_color_feedback'
              ],
            ids: ids,
            pos_present: true,
          }
        }
      }
    }
    if (!_.isUndefined(sectionFeedback['narrative_voice_score_class'])) {
      language['narrative_voice'] = []
      for (var i in sectionFeedback['narrative_voice_score_class']) {
        var ids = []
        for (var j in sectionFeedback['narrative_voice_score_class'][i][
          'narrative_voice_inconsistency'
        ]) {
          if (
            sectionFeedback['narrative_voice_score_class'][i][
              'narrative_voice_inconsistency'
            ][j]['previous_narrative_voice'] == 'first person' ||
            sectionFeedback['narrative_voice_score_class'][i][
              'narrative_voice_inconsistency'
            ][j]['previous_narrative_voice'] == 'third person'
          ) {
            ids.push(
              sectionFeedback['narrative_voice_score_class'][i][
                'narrative_voice_inconsistency'
              ][j]['prev_sentence_id']
            )
          }
          if (
            sectionFeedback['narrative_voice_score_class'][i][
              'narrative_voice_inconsistency'
            ][j]['current_narrative_voice'] == 'first person' ||
            sectionFeedback['narrative_voice_score_class'][i][
              'narrative_voice_inconsistency'
            ][j]['current_narrative_voice'] == 'third person'
          ) {
            ids.push(
              sectionFeedback['narrative_voice_score_class'][i][
                'narrative_voice_inconsistency'
              ][j]['current_sentence_id']
            )
          }
        }
        if (
          !sectionFeedback['narrative_voice_score_class'][i].hasOwnProperty(
            'sub_section_mapping'
          ) ||
          _.isNull(
            sectionFeedback['narrative_voice_score_class'][i][
              'sub_section_mapping'
            ]
          )
        ) {
          language['narrative_voice'].push({
            color:
              sectionFeedback['narrative_voice_score_class'][i][
                'narrative_voice_color_feedback'
              ],
            ids: _.uniq(ids),
          })
        } else {
          language['narrative_voice'][
            sectionFeedback['narrative_voice_score_class'][i][
              'sub_section_mapping'
            ]
          ] = {
            color:
              sectionFeedback['narrative_voice_score_class'][i][
                'narrative_voice_color_feedback'
              ],
            ids: _.uniq(ids),
          }
        }
      }
    }
    if (!_.isUndefined(sectionFeedback['spell_check_score_class'])) {
      language['spell_check'] = []
      for (var i in sectionFeedback['spell_check_score_class']) {
        var ids = {}
        for (var j in sectionFeedback['spell_check_score_class'][i][
          'spell_check'
        ]) {
          var value =
            sectionFeedback['spell_check_score_class'][i]['spell_check'][j]
          if (!ids.hasOwnProperty(value['sentence_id'])) {
            ids[value['sentence_id']] = []
          }
          ids[value['sentence_id']].push({ word: value['wrong_word'] })
          this.spellErrors.push([
            '.div-id-' + value['sentence_id'],
            value['wrong_word'],
          ])
        }
        if (
          !sectionFeedback['spell_check_score_class'][i].hasOwnProperty(
            'sub_section_mapping'
          ) ||
          _.isNull(
            sectionFeedback['spell_check_score_class'][i]['sub_section_mapping']
          )
        ) {
          language['spell_check'].push({
            color:
              sectionFeedback['spell_check_score_class'][i][
                'spell_check_color_feedback'
              ],
            ids: ids,
            pos_present: false,
          })
        } else {
          language['spell_check'][
            sectionFeedback['spell_check_score_class'][i]['sub_section_mapping']
          ] = {
            color:
              sectionFeedback['spell_check_score_class'][i][
                'spell_check_color_feedback'
              ],
            ids: ids,
            pos_present: false,
          }
        }
      }
    }
    if (!_.isUndefined(sectionFeedback['tense_score_class'])) {
      language['tense'] = []
      for (var i in sectionFeedback['tense_score_class']) {
        var ids = []
        for (var j in sectionFeedback['tense_score_class'][i][
          'tense_inconsistency'
        ]) {
          ids.push(
            sectionFeedback['tense_score_class'][i]['tense_inconsistency'][j][
              'prev_sentence_id'
            ]
          )
          ids.push(
            sectionFeedback['tense_score_class'][i]['tense_inconsistency'][j][
              'current_sentence_id'
            ]
          )
        }
        if (
          !sectionFeedback['tense_score_class'][i].hasOwnProperty(
            'sub_section_mapping'
          ) ||
          _.isNull(
            sectionFeedback['tense_score_class'][i]['sub_section_mapping']
          )
        ) {
          language['tense'].push({
            color:
              sectionFeedback['tense_score_class'][i]['tense_color_feedback'],
            ids: _.uniq(ids),
          })
        } else {
          language['tense'][
            sectionFeedback['tense_score_class'][i]['sub_section_mapping']
          ] = {
            color:
              sectionFeedback['tense_score_class'][i]['tense_color_feedback'],
            ids: _.uniq(ids),
          }
        }
      }
    }
    if (!_.isUndefined(sectionFeedback['verb_overusage_score_class'])) {
      language['verb_overusage'] = []
      for (var i in sectionFeedback['verb_overusage_score_class']) {
        var ids = {}
        for (var j in sectionFeedback['verb_overusage_score_class'][i][
          'verb_overusage'
        ]) {
          var value =
            sectionFeedback['verb_overusage_score_class'][i]['verb_overusage'][
              j
            ]
          if (!ids.hasOwnProperty(value['sentence_id'])) {
            ids[value['sentence_id']] = []
          }
          ids[value['sentence_id']].push({
            word: value['verb'],
            pos: value['positions'][0],
            suggestions: value['verb_suggestions'],
            module_type: 'verb_overusage',
          })
        }
        if (
          !sectionFeedback['verb_overusage_score_class'][i].hasOwnProperty(
            'sub_section_mapping'
          ) ||
          _.isNull(
            sectionFeedback['verb_overusage_score_class'][i][
              'sub_section_mapping'
            ]
          )
        ) {
          language['verb_overusage'].push({
            color:
              sectionFeedback['verb_overusage_score_class'][i][
                'verb_overusage_color_feedback'
              ],
            ids: ids,
            pos_present: true,
          })
        } else {
          language['verb_overusage'][
            sectionFeedback['verb_overusage_score_class'][i][
              'sub_section_mapping'
            ]
          ] = {
            color:
              sectionFeedback['verb_overusage_score_class'][i][
                'verb_overusage_color_feedback'
              ],
            ids: ids,
            pos_present: true,
          }
        }
      }
    }
    return language
  }

  getLanguageEntities(sectionLanguage, entityMapEditable) {
    let languageEntities = {}
    var subModules = ['buzzwords', 'spell_check', 'verb_overusage']
    for (var i in subModules) {
      if (sectionLanguage.hasOwnProperty(subModules[i])) {
        languageEntities[subModules[i]] = {}
        for (var sectionIndex in sectionLanguage[subModules[i]]) {
          var obj = {
            color: sectionLanguage[subModules[i]][sectionIndex]['color'],
            text: [],
          }
          for (let divId in sectionLanguage[subModules[i]][sectionIndex][
            'ids'
          ]) {
            var entities = entityMapEditable[divId]
            for (var j in sectionLanguage[subModules[i]][sectionIndex]['ids'][
              divId
            ]) {
              for (var k in entities) {
                obj['text'].push({
                  entity: entities[k][2],
                  text:
                    sectionLanguage[subModules[i]][sectionIndex]['ids'][divId][
                      j
                    ]['word'],
                })
              }
            }
          }
          languageEntities[subModules[i]][sectionIndex] = obj
        }
      }
    }
    var subModules = ['narrative_voice', 'tense']
    for (var i in subModules) {
      if (sectionLanguage.hasOwnProperty(subModules[i])) {
        languageEntities[subModules[i]] = {}
        for (var sectionIndex in sectionLanguage[subModules[i]]) {
          var obj = {
            color: sectionLanguage[subModules[i]][sectionIndex]['color'],
            text: [],
          }
          for (var j in sectionLanguage[subModules[i]][sectionIndex]['ids']) {
            var entities =
              entityMapEditable[
                sectionLanguage[subModules[i]][sectionIndex]['ids'][j]
              ]
            for (var k in entities) {
              obj['text'].push({ entity: entities[k][2], text: entities[k][3] })
            }
          }
          languageEntities[subModules[i]][sectionIndex] = obj
        }
      }
    }

    return languageEntities
  }

  getImpact(sectionFeedback, isExperience) {
    let impact = {}
    if (!_.isUndefined(sectionFeedback['overall_impact_score_class'])) {
      impact['score'] = []
      if (
        _.isUndefined(
          sectionFeedback['overall_impact_score_class']['sub_section']
        )
      ) {
        impact['score'].push({
          color:
            sectionFeedback['overall_impact_score_class']['color_feedback'],
          score: this.lowerScore(
            sectionFeedback['overall_impact_score_class'][
              'overall_impact_score'
            ]
          ),
        })
      } else {
        for (var i in sectionFeedback['overall_impact_score_class'][
          'sub_section'
        ]) {
          impact['score'].push({
            color:
              sectionFeedback['overall_impact_score_class']['sub_section'][i][
                'color_feedback'
              ],
            score: this.lowerScore(
              sectionFeedback['overall_impact_score_class']['sub_section'][i][
                'overall_impact_score'
              ]
            ),
          })
        }
      }
    }
    if (!_.isUndefined(sectionFeedback['impact_divs'])) {
      impact['action_oriented'] = []
      impact['action_oriented_color'] = []
      impact['specifics'] = []
      impact['specifics_color'] = []
      if (!isExperience) {
        var mods = { action_oriented: {}, specifics: {} }
        let bulletDivs = []
        for (var divId in sectionFeedback['impact_divs']['bullet_divs']) {
          bulletDivs.push(divId)
        }
        if (_.isEmpty(bulletDivs)) {
          return null
        }
        for (var divId in sectionFeedback['impactResultsArray']) {
          if (!_.contains(bulletDivs, divId)) {
            continue
          }
          if (
            sectionFeedback['impactResultsArray'][divId].hasOwnProperty(
              'active'
            )
          ) {
            if (!mods['action_oriented'].hasOwnProperty(divId)) {
              mods['action_oriented'][divId] = []
            }
            for (var k in sectionFeedback['impactResultsArray'][divId][
              'active'
            ]) {
              for (var j in sectionFeedback['impactResultsArray'][divId][
                'active'
              ][k]) {
                var weak =
                  sectionFeedback['impactResultsArray'][divId]['active'][k][j][
                    'weakVerb'
                  ]
                var suggestions = []
                var moduleType = ''
                if (weak == true) {
                  suggestions = ['Led', 'Managed', 'Analyzed', 'Created']
                  moduleType = 'action_oriented'
                }
                mods['action_oriented'][divId].push({
                  word:
                    sectionFeedback['impactResultsArray'][divId]['active'][k][
                      j
                    ]['originalKeyword'],
                  pos:
                    sectionFeedback['impactResultsArray'][divId]['active'][k][
                      j
                    ]['wordPos'],
                  weak: weak,
                  suggestions: suggestions,
                  module_type: moduleType,
                })
              }
            }
          }
          if (
            sectionFeedback['impactResultsArray'][divId].hasOwnProperty(
              'specifics'
            )
          ) {
            if (!mods['specifics'].hasOwnProperty(divId)) {
              mods['specifics'][divId] = []
            }
            for (var k in sectionFeedback['impactResultsArray'][divId][
              'specifics'
            ]) {
              for (var j in sectionFeedback['impactResultsArray'][divId][
                'specifics'
              ][k]) {
                mods['specifics'][divId].push({
                  word:
                    sectionFeedback['impactResultsArray'][divId]['specifics'][
                      k
                    ][j]['originalKeyword'],
                  pos:
                    sectionFeedback['impactResultsArray'][divId]['specifics'][
                      k
                    ][j]['wordPos'],
                })
              }
            }
          }
        }
        impact['action_oriented'].push({
          ids: mods['action_oriented'],
          pos_present: true,
          color:
            sectionFeedback['overall_impact_score_class'][
              'active_score_color_feedback'
            ],
          score: this.lowerScore(
            sectionFeedback['overall_impact_score_class'][
              'overall_active_score'
            ]
          ),
        })
        impact['action_oriented_color'].push({
          color:
            sectionFeedback['overall_impact_score_class'][
              'active_score_color_feedback'
            ],
          score: this.lowerScore(
            sectionFeedback['overall_impact_score_class'][
              'overall_active_score'
            ]
          ),
        })
        impact['specifics'].push({
          ids: mods['specifics'],
          pos_present: true,
          color:
            sectionFeedback['overall_impact_score_class'][
              'specifics_score_color_feedback'
            ],
          score: this.lowerScore(
            sectionFeedback['overall_impact_score_class'][
              'overall_specifics_score'
            ]
          ),
        })
        impact['specifics_color'].push({
          color:
            sectionFeedback['overall_impact_score_class'][
              'specifics_score_color_feedback'
            ],
          score: this.lowerScore(
            sectionFeedback['overall_impact_score_class'][
              'overall_specifics_score'
            ]
          ),
        })
      } else {
        let impactDivsKeys = _.keys(sectionFeedback['impact_divs'])
        let impactResultsArrayKeys = _.keys(
          sectionFeedback['impactResultsArray']
        )
        for (let ii in impactDivsKeys) {
          var i = impactDivsKeys[ii]
          let impactResultsArrayKey = impactResultsArrayKeys[ii]
          var mods = { action_oriented: {}, specifics: {} }
          for (var divId in sectionFeedback['impactResultsArray'][
            impactResultsArrayKey
          ]) {
            if (
              sectionFeedback['impactResultsArray'][impactResultsArrayKey][
                divId
              ].hasOwnProperty('active')
            ) {
              if (!mods['action_oriented'].hasOwnProperty(divId)) {
                mods['action_oriented'][divId] = []
              }
              for (var k in sectionFeedback['impactResultsArray'][
                impactResultsArrayKey
              ][divId]['active']) {
                for (var j in sectionFeedback['impactResultsArray'][
                  impactResultsArrayKey
                ][divId]['active'][k]) {
                  var weak =
                    sectionFeedback['impactResultsArray'][
                      impactResultsArrayKey
                    ][divId]['active'][k][j]['weakVerb']
                  var suggestions = []
                  var moduleType = ''
                  if (weak == true) {
                    suggestions = ['Led', 'Managed', 'Analyzed', 'Created']
                    moduleType = 'action_oriented'
                  }
                  mods['action_oriented'][divId].push({
                    word:
                      sectionFeedback['impactResultsArray'][
                        impactResultsArrayKey
                      ][divId]['active'][k][j]['originalKeyword'],
                    pos:
                      sectionFeedback['impactResultsArray'][
                        impactResultsArrayKey
                      ][divId]['active'][k][j]['wordPos'],
                    weak: weak,
                    suggestions: suggestions,
                    module_type: moduleType,
                  })
                }
              }
            }
            if (
              sectionFeedback['impactResultsArray'][impactResultsArrayKey][
                divId
              ].hasOwnProperty('specifics')
            ) {
              if (!mods['specifics'].hasOwnProperty(divId)) {
                mods['specifics'][divId] = []
              }
              for (var k in sectionFeedback['impactResultsArray'][
                impactResultsArrayKey
              ][divId]['specifics']) {
                for (var j in sectionFeedback['impactResultsArray'][
                  impactResultsArrayKey
                ][divId]['specifics'][k]) {
                  mods['specifics'][divId].push({
                    word:
                      sectionFeedback['impactResultsArray'][
                        impactResultsArrayKey
                      ][divId]['specifics'][k][j]['originalKeyword'],
                    pos:
                      sectionFeedback['impactResultsArray'][
                        impactResultsArrayKey
                      ][divId]['specifics'][k][j]['wordPos'],
                  })
                }
              }
            }
          }
          impact['action_oriented'].push({
            ids: mods['action_oriented'],
            pos_present: true,
            color:
              sectionFeedback['impact_divs'][i]['active_score_color_feedback'],
            score: this.lowerScore(
              sectionFeedback['impact_divs'][i]['active_score']
            ),
          })
          impact['action_oriented_color'].push({
            color:
              sectionFeedback['impact_divs'][i]['active_score_color_feedback'],
            score: this.lowerScore(
              sectionFeedback['impact_divs'][i]['active_score']
            ),
          })
          impact['specifics'].push({
            ids: mods['specifics'],
            pos_present: true,
            color:
              sectionFeedback['impact_divs'][i][
                'specifics_score_color_feedback'
              ],
            score: this.lowerScore(
              sectionFeedback['impact_divs'][i]['specifics_score']
            ),
          })
          impact['specifics_color'].push({
            color:
              sectionFeedback['impact_divs'][i][
                'specifics_score_color_feedback'
              ],
            score: this.lowerScore(
              sectionFeedback['impact_divs'][i]['specifics_score']
            ),
          })
        }
      }
    }

    return impact
  }

  getImpactEntities(sectionImpact, entityMapEditable) {
    if (_.isNull(sectionImpact)) {
      return null
    }
    let impactEntities = {}
    let subModules = ['action_oriented', 'specifics']
    if (sectionImpact.hasOwnProperty('action_oriented')) {
      impactEntities['action_oriented'] = {}
      for (var sectionIndex in sectionImpact['action_oriented']) {
        var obj = {
          color:
            sectionImpact['action_oriented' + '_color'][sectionIndex]['color'],
          text: [],
        }
        for (var divId in sectionImpact['action_oriented'][sectionIndex][
          'ids'
        ]) {
          var entities = entityMapEditable[divId]
          for (var j in sectionImpact['action_oriented'][sectionIndex]['ids'][
            divId
          ]) {
            for (var k in entities) {
              obj['text'].push({
                entity: entities[k][2],
                text: entities[k][3],
                word:
                  sectionImpact['action_oriented'][sectionIndex]['ids'][divId][
                    j
                  ]['word'],
              })
            }
          }
        }
        impactEntities['action_oriented'][sectionIndex] = obj
      }
    }
    if (sectionImpact.hasOwnProperty('specifics')) {
      impactEntities['specifics'] = {}
      for (var sectionIndex in sectionImpact['specifics']) {
        var obj = {
          color: sectionImpact['specifics' + '_color'][sectionIndex]['color'],
          text: [],
        }
        for (var divId in sectionImpact['specifics'][sectionIndex]['ids']) {
          var entities = entityMapEditable[divId]
          for (var j in sectionImpact['specifics'][sectionIndex]['ids'][
            divId
          ]) {
            for (var k in entities) {
              obj['text'].push({
                entity: entities[k][2],
                text:
                  sectionImpact['specifics'][sectionIndex]['ids'][divId][j][
                    'word'
                  ],
              })
            }
          }
        }
        impactEntities['specifics'][sectionIndex] = obj
      }
    }

    return impactEntities
  }

  getCategories(sectionFeedback, isExperience) {
    let categories = {}
    if (!_.isUndefined(sectionFeedback['overall_category_score_class'])) {
      categories['score'] = []
      if (
        _.isUndefined(
          sectionFeedback['overall_category_score_class']['sub_section']
        )
      ) {
        categories['score'].push({
          color:
            sectionFeedback['overall_category_score_class']['color_feedback'],
          score: this.lowerScore(
            sectionFeedback['overall_category_score_class'][
              'overall_category_score'
            ]
          ),
        })
      } else {
        for (var i in sectionFeedback['overall_category_score_class'][
          'sub_section'
        ]) {
          categories['score'].push({
            color:
              sectionFeedback['overall_category_score_class']['sub_section'][i][
                'color_feedback'
              ],
            score: this.lowerScore(
              sectionFeedback['overall_category_score_class']['sub_section'][i][
                'overall_category_score'
              ]
            ),
          })
        }
      }
    }
    if (!_.isUndefined(sectionFeedback['categories_present'])) {
      categories['categories'] = []
      let cleanCategory = ''
      if (!isExperience) {
        var temp = {}
        for (var divId in sectionFeedback['categories_present']) {
          for (var category in sectionFeedback['categories_present'][divId]) {
            cleanCategory = this.cleanWord(category)
            if (!temp.hasOwnProperty(cleanCategory)) {
              temp[cleanCategory] = { ids: {}, pos_present: false }
            }
            if (!temp[cleanCategory].hasOwnProperty(divId)) {
              temp[cleanCategory]['ids'][divId] = []
            }
            for (var index in sectionFeedback['categories_present'][divId][
              category
            ]) {
              if (
                _.isObject(
                  sectionFeedback['categories_present'][divId][category][index]
                ) ||
                _.isArray(
                  sectionFeedback['categories_present'][divId][category][index]
                )
              ) {
                if (
                  !_.isNull(
                    sectionFeedback['categories_present'][divId][category][
                      index
                    ]['positions']
                  )
                ) {
                  for (var posIndex in sectionFeedback['categories_present'][
                    divId
                  ][category][index]['positions']) {
                    temp[cleanCategory]['ids'][divId].push({
                      word:
                        sectionFeedback['categories_present'][divId][category][
                          index
                        ]['keyword'],
                      pos:
                        sectionFeedback['categories_present'][divId][category][
                          index
                        ]['positions'][posIndex],
                    })
                  }
                  temp[cleanCategory]['pos_present'] = true
                } else {
                  temp[cleanCategory]['ids'][divId].push({
                    word:
                      sectionFeedback['categories_present'][divId][category][
                        index
                      ]['keyword'],
                  })
                }
              } else {
                temp[cleanCategory]['ids'][divId].push({
                  word:
                    sectionFeedback['categories_present'][divId][category][
                      index
                    ],
                })
              }
            }
          }
        }
        categories['categories'].push(temp)
      } else {
        for (var i in sectionFeedback['categories_present']) {
          var temp = {}
          for (var divId in sectionFeedback['categories_present'][i]) {
            for (var category in sectionFeedback['categories_present'][i][
              divId
            ]) {
              cleanCategory = this.cleanWord(category)
              if (!temp.hasOwnProperty(cleanCategory)) {
                temp[cleanCategory] = { ids: {}, pos_present: false }
              }
              if (!temp[cleanCategory].hasOwnProperty(divId)) {
                temp[cleanCategory]['ids'][divId] = []
              }
              for (var index in sectionFeedback['categories_present'][i][divId][
                category
              ]) {
                if (
                  _.isObject(
                    sectionFeedback['categories_present'][i][divId][category][
                      index
                    ]
                  ) ||
                  _.isArray(
                    sectionFeedback['categories_present'][i][divId][category][
                      index
                    ]
                  )
                ) {
                  if (
                    !_.isNull(
                      sectionFeedback['categories_present'][i][divId][category][
                        index
                      ]['positions']
                    )
                  ) {
                    for (var posIndex in sectionFeedback['categories_present'][
                      i
                    ][divId][category][index]['positions']) {
                      temp[cleanCategory]['ids'][divId].push({
                        word:
                          sectionFeedback['categories_present'][i][divId][
                            category
                          ][index]['keyword'],
                        pos:
                          sectionFeedback['categories_present'][i][divId][
                            category
                          ][index]['positions'][posIndex],
                      })
                    }
                    temp[cleanCategory]['pos_present'] = true
                  } else {
                    temp[cleanCategory]['ids'][divId].push({
                      word:
                        sectionFeedback['categories_present'][i][divId][
                          category
                        ][index]['keyword'],
                    })
                  }
                } else {
                  temp[cleanCategory]['ids'][divId].push({
                    word:
                      sectionFeedback['categories_present'][i][divId][category][
                        index
                      ],
                  })
                }
              }
            }
          }
          categories['categories'].push(temp)
        }
      }
    }

    return categories
  }

  getCategoriesMissing(sectionCategories2) {
    let sectionCategories = [].concat(sectionCategories2)
    let temp = []
    for (let i in sectionCategories) {
      temp[i] = []
      for (let j in sectionCategories[i]) {
        temp[i].push(this.cleanWord(j))
      }
    }
    return temp
  }

  getCategoriesInResumeNotInLinkedin(sectionFeedback, sectionName) {
    let temp = []

    if (sectionName == 'Summary' || sectionName == 'Headline') {
      if (
        !_.isUndefined(sectionFeedback) &&
        sectionFeedback.hasOwnProperty(
          'categories_in_resume_not_in_linkedin'
        ) &&
        !_.isEmpty(sectionFeedback['categories_in_resume_not_in_linkedin'])
      ) {
        temp[0] = []
        for (let i in sectionFeedback['categories_in_resume_not_in_linkedin']) {
          temp[0].push(
            this.cleanWord(
              sectionFeedback['categories_in_resume_not_in_linkedin'][i]
            )
          )
        }
        return temp
      }
    }

    if (sectionName == 'Experience' || sectionName == 'Education') {
      if (
        !_.isUndefined(sectionFeedback) &&
        sectionFeedback.hasOwnProperty(
          'categories_in_resume_not_in_linkedin'
        ) &&
        !_.isEmpty(sectionFeedback['categories_in_resume_not_in_linkedin'])
      ) {
        for (
          let j = 0;
          j < sectionFeedback['categories_in_resume_not_in_linkedin'].length;
          j++
        ) {
          temp[j] = []
          for (let i in sectionFeedback['categories_in_resume_not_in_linkedin'][
            j
          ]) {
            temp[j].push(
              this.cleanWord(
                sectionFeedback['categories_in_resume_not_in_linkedin'][j][i]
              )
            )
          }
        }
        return temp
      }
    }
    return temp
  }

  getCategoriesEntities(sectionCategories, entityMapEditable) {
    let categoriesEntities = {}
    for (let sectionIndex in sectionCategories['categories']) {
      categoriesEntities[sectionIndex] = {}
      for (let subModule in sectionCategories['categories'][sectionIndex]) {
        let obj = { color: 'green', text: [] }
        for (let divId in sectionCategories['categories'][sectionIndex][
          subModule
        ]['ids']) {
          let entities = entityMapEditable[divId]
          for (let j in sectionCategories['categories'][sectionIndex][
            subModule
          ]['ids'][divId]) {
            for (let k in entities) {
              obj['text'].push({
                entity: entities[k][2],
                text:
                  sectionCategories['categories'][sectionIndex][subModule][
                    'ids'
                  ][divId][j]['word'],
              })
            }
          }
        }
        categoriesEntities[sectionIndex][subModule] = obj
      }
    }

    return categoriesEntities
  }

  getSkills(sectionFeedback, skillTypes = []) {
    let skills = {}
    if (!_.isUndefined(sectionFeedback['overall_skills_score_class'])) {
      skills['score'] = []
      if (
        _.isUndefined(
          sectionFeedback['overall_skills_score_class']['overall_score_class'][
            'sub_section'
          ]
        )
      ) {
        skills['score'].push({
          color:
            sectionFeedback['overall_skills_score_class'][
              'overall_score_class'
            ]['color_feedback'],
          score: this.lowerScore(
            sectionFeedback['overall_skills_score_class'][
              'overall_score_class'
            ]['overall_score']
          ),
        })
      } else {
        for (var i in sectionFeedback['overall_skills_score_class'][
          'overall_score_class'
        ]['sub_section']) {
          skills['score'].push({
            color:
              sectionFeedback['overall_skills_score_class'][
                'overall_score_class'
              ]['sub_section'][i]['overall_score_class']['color_feedback'],
            score: this.lowerScore(
              sectionFeedback['overall_skills_score_class'][
                'overall_score_class'
              ]['sub_section'][i]['overall_score_class']['overall_score']
            ),
          })
        }
      }
    }
    if (!_.isUndefined(sectionFeedback['relevant_skills_present'])) {
      skills['relevant_skills_present'] = []
      const types = ['hard_skills', 'soft_skills']
      let cleanSkill = ''
      if (
        sectionFeedback['relevant_skills_present'].hasOwnProperty('hard_skills')
      ) {
        var temp = {}
        for (var j in types) {
          var type = types[j]
          if (!_.isEmpty(skillTypes) && !_.contains(skillTypes, type)) {
            continue
          }
          for (var skill in sectionFeedback['relevant_skills_present'][type]) {
            cleanSkill = this.cleanWordWithFlag(
              sectionFeedback['relevant_skills_present'][type][skill][
                'display_name'
              ],
              sectionFeedback['relevant_skills_present'][type][skill][
                'is_display_name_set'
              ]
            )
            if (!temp.hasOwnProperty(cleanSkill)) {
              temp[cleanSkill] = []
            }
            if (!this.derivedSkills.hasOwnProperty(cleanSkill)) {
              this.derivedSkills[cleanSkill] = false
            }
            for (var divId in sectionFeedback['relevant_skills_present'][type][
              skill
            ]['keyword']) {
              var phrases = []
              var text = sectionFeedback['text_array'][divId][
                'text'
              ].toLowerCase()
              for (var verb in sectionFeedback['relevant_skills_present'][type][
                skill
              ]['keyword'][divId]) {
                var vp = text.indexOf(verb)
                if (vp === -1) {
                  continue
                }
                for (var nounIndex in sectionFeedback[
                  'relevant_skills_present'
                ][type][skill]['keyword'][divId][verb]) {
                  var noun =
                    sectionFeedback['relevant_skills_present'][type][skill][
                      'keyword'
                    ][divId][verb][nounIndex]
                  var np = text.indexOf(noun)
                  if (np === -1 || np <= vp) {
                    continue
                  }
                  np += noun.length
                  phrases.push(text.substr(vp, np - vp))
                }
              }

              temp[cleanSkill].push({
                id: divId,
                type: type,
                state: 'derived',
                frequency:
                  sectionFeedback['relevant_skills_present'][type][skill][
                    'frequency'
                  ],
                score:
                  sectionFeedback['relevant_skills_present'][type][skill][
                    'score'
                  ],
                phrases: _.uniq(phrases),
              })
              this.derivedSkills[cleanSkill] = true
            }
            if (
              sectionFeedback['relevant_skills_present'][type][
                skill
              ].hasOwnProperty('stated_div_ids')
            ) {
              for (var index in sectionFeedback['relevant_skills_present'][
                type
              ][skill]['stated_div_ids']) {
                //temp[cleanSkill].push({ 'id': sectionFeedback['relevant_skills_present'][type][skill]['stated_div_ids'][index], 'type': type, 'state': 'stated', 'frequency': sectionFeedback['relevant_skills_present'][type][skill]['frequency'], 'score': sectionFeedback['relevant_skills_present'][type][skill]['score'] })

                // new code to handle headline skills not highlighting issue
                let stated_actual_keyword = ''
                if (
                  sectionFeedback['relevant_skills_present'][type][
                    skill
                  ].hasOwnProperty('stated_actual_keyword')
                ) {
                  stated_actual_keyword =
                    sectionFeedback['relevant_skills_present'][type][skill][
                      'stated_actual_keyword'
                    ]
                }
                temp[cleanSkill].push({
                  id:
                    sectionFeedback['relevant_skills_present'][type][skill][
                      'stated_div_ids'
                    ][index],
                  type: type,
                  state: 'stated',
                  frequency:
                    sectionFeedback['relevant_skills_present'][type][skill][
                      'frequency'
                    ],
                  score:
                    sectionFeedback['relevant_skills_present'][type][skill][
                      'score'
                    ],
                  stated_actual_keyword: stated_actual_keyword,
                })
              }
            }
          }
        }
        skills['relevant_skills_present'].push(temp)
      } else {
        let skillsPresentKeys = _.keys(
          sectionFeedback['relevant_skills_present']
        )
        let textKeys = _.keys(sectionFeedback['text_array'])
        for (let ii in skillsPresentKeys) {
          var i = skillsPresentKeys[ii]
          let textKey = textKeys[ii]
          var temp = []
          for (var j in types) {
            var type = types[j]
            if (!_.isEmpty(skillTypes) && !_.contains(skillTypes, type)) {
              continue
            }
            for (var skill in sectionFeedback['relevant_skills_present'][i][
              type
            ]) {
              cleanSkill = this.cleanWordWithFlag(
                sectionFeedback['relevant_skills_present'][i][type][skill][
                  'display_name'
                ],
                sectionFeedback['relevant_skills_present'][i][type][skill][
                  'is_display_name_set'
                ]
              )
              if (!temp.hasOwnProperty(cleanSkill)) {
                temp[cleanSkill] = []
              }
              if (!this.derivedSkills.hasOwnProperty(cleanSkill)) {
                this.derivedSkills[cleanSkill] = false
              }
              for (var divId in sectionFeedback['relevant_skills_present'][i][
                type
              ][skill]['keyword']) {
                var phrases = []
                if (
                  _.isUndefined(sectionFeedback['text_array'][textKey][divId])
                ) {
                  continue
                }
                var text = sectionFeedback['text_array'][textKey][divId][
                  'text'
                ].toLowerCase()
                for (var verb in sectionFeedback['relevant_skills_present'][i][
                  type
                ][skill]['keyword'][divId]) {
                  var vp = text.indexOf(verb)
                  if (vp === -1) {
                    continue
                  }
                  for (var nounIndex in sectionFeedback[
                    'relevant_skills_present'
                  ][i][type][skill]['keyword'][divId][verb]) {
                    var noun =
                      sectionFeedback['relevant_skills_present'][i][type][
                        skill
                      ]['keyword'][divId][verb][nounIndex]
                    var np = text.indexOf(noun)
                    if (np === -1 || np <= vp) {
                      continue
                    }
                    np += noun.length
                    phrases.push(text.substr(vp, np - vp))
                  }
                }

                temp[cleanSkill].push({
                  id: divId,
                  type: type,
                  state: 'derived',
                  frequency:
                    sectionFeedback['relevant_skills_present'][i][type][skill][
                      'frequency'
                    ],
                  score:
                    sectionFeedback['relevant_skills_present'][i][type][skill][
                      'score'
                    ],
                  phrases: _.uniq(phrases),
                })
                this.derivedSkills[cleanSkill] = true
              }
              if (
                sectionFeedback['relevant_skills_present'][i][type][
                  skill
                ].hasOwnProperty('stated_div_ids')
              ) {
                for (var index in sectionFeedback['relevant_skills_present'][i][
                  type
                ][skill]['stated_div_ids']) {
                  temp[cleanSkill].push({
                    id:
                      sectionFeedback['relevant_skills_present'][i][type][
                        skill
                      ]['stated_div_ids'][index],
                    type: type,
                    state: 'stated',
                    frequency:
                      sectionFeedback['relevant_skills_present'][i][type][
                        skill
                      ]['frequency'],
                    score:
                      sectionFeedback['relevant_skills_present'][i][type][
                        skill
                      ]['score'],
                  })
                }
              }
            }
          }
          skills['relevant_skills_present'].push(temp)
        }
      }
    }
    if (!_.isUndefined(sectionFeedback['relevant_skills_missing'])) {
      skills['relevant_skills_missing'] = []
      const types = ['hard_skills', 'soft_skills']
      if (
        sectionFeedback['relevant_skills_missing'].hasOwnProperty('hard_skills')
      ) {
        var temp = []
        for (var j in types) {
          var type = types[j]
          if (!_.isEmpty(skillTypes) && !_.contains(skillTypes, type)) {
            continue
          }
          for (var skill in sectionFeedback['relevant_skills_missing'][type]) {
            if (
              sectionFeedback['relevant_skills_missing'][type][skill][
                'score'
              ] != 0
            ) {
              temp.push({
                word: this.cleanWordWithFlag(
                  sectionFeedback['relevant_skills_missing'][type][skill][
                    'display_name'
                  ],
                  sectionFeedback['relevant_skills_missing'][type][skill][
                    'is_display_name_set'
                  ]
                ),
                type: type,
                score:
                  sectionFeedback['relevant_skills_missing'][type][skill][
                    'score'
                  ],
                frequency:
                  sectionFeedback['relevant_skills_missing'][type][skill][
                    'frequency'
                  ],
              })
            }
          }
        }
        skills['relevant_skills_missing'].push(temp)
      } else {
        for (var i in sectionFeedback['relevant_skills_missing']) {
          var temp = []
          for (var j in types) {
            var type = types[j]
            if (!_.isEmpty(skillTypes) && !_.contains(skillTypes, type)) {
              continue
            }
            for (var skill in sectionFeedback['relevant_skills_missing'][i][
              type
            ]) {
              if (
                sectionFeedback['relevant_skills_missing'][i][type][skill][
                  'score'
                ] != 0
              ) {
                temp.push({
                  word: this.cleanWordWithFlag(
                    sectionFeedback['relevant_skills_missing'][i][type][skill][
                      'display_name'
                    ],
                    sectionFeedback['relevant_skills_missing'][i][type][skill][
                      'is_display_name_set'
                    ]
                  ),
                  type: type,
                  score:
                    sectionFeedback['relevant_skills_missing'][i][type][skill][
                      'score'
                    ],
                  frequency:
                    sectionFeedback['relevant_skills_missing'][i][type][skill][
                      'frequency'
                    ],
                })
              }
            }
          }
          skills['relevant_skills_missing'].push(temp)
        }
      }
    }

    if (!_.isUndefined(sectionFeedback['recommended_skills'])) {
      skills['recommended_skills'] = []
      const types = ['hard_skills', 'soft_skills']
      let temp = []
      for (let j in types) {
        let type = types[j]
        for (let skill in sectionFeedback['recommended_skills'][type]) {
          if (
            sectionFeedback['recommended_skills'][type][skill]['score'] !== 0
          ) {
            temp.push({
              word: this.cleanWordWithFlag(
                sectionFeedback['recommended_skills'][type][skill][
                  'display_name'
                ],
                sectionFeedback['recommended_skills'][type][skill][
                  'is_display_name_set'
                ]
              ),
              type: type,
              score:
                sectionFeedback['recommended_skills'][type][skill]['score'],
              frequency:
                sectionFeedback['recommended_skills'][type][skill]['frequency'],
            })
          }
        }
      }
      skills['recommended_skills'].push(temp)
    }

    return skills
  }

  getExperienceTitleHardSkills(sectionFeedback) {
    if (!sectionFeedback.hasOwnProperty('text_array')) {
      return []
    }

    let titleHardSkills = {}
    let topSkills = {}
    for (let subSectionId in sectionFeedback['text_array']) {
      titleHardSkills[subSectionId] = {}
      for (let divId in sectionFeedback['text_array'][subSectionId]) {
        if (
          sectionFeedback['text_array'][subSectionId][divId]['is_title'] == true
        ) {
          if (
            sectionFeedback.hasOwnProperty('relevant_skills_present') &&
            sectionFeedback['relevant_skills_present'].hasOwnProperty(
              subSectionId
            ) &&
            sectionFeedback['relevant_skills_present'][
              subSectionId
            ].hasOwnProperty('hard_skills')
          ) {
            for (var skill in sectionFeedback['relevant_skills_present'][
              subSectionId
            ]['hard_skills']) {
              if (
                sectionFeedback['relevant_skills_present'][subSectionId][
                  'hard_skills'
                ][skill].hasOwnProperty('keyword')
              ) {
                for (let id in sectionFeedback['relevant_skills_present'][
                  subSectionId
                ]['hard_skills'][skill]['keyword']) {
                  if (id == divId) {
                    titleHardSkills[subSectionId][skill] = 'derived'
                    break
                  }
                }
              }
              if (
                sectionFeedback['relevant_skills_present'][subSectionId][
                  'hard_skills'
                ][skill].hasOwnProperty('stated_div_ids')
              ) {
                for (var i in sectionFeedback['relevant_skills_present'][
                  subSectionId
                ]['hard_skills'][skill]['stated_div_ids']) {
                  if (
                    sectionFeedback['relevant_skills_present'][subSectionId][
                      'hard_skills'
                    ][skill]['stated_div_ids'][i] == divId
                  ) {
                    titleHardSkills[subSectionId][skill] = 'stated'
                    break
                  }
                }
              }
            }
          }

          // Only 1 divId is title
          break
        }
      }

      let allSkillsList = []
      if (
        sectionFeedback.hasOwnProperty('relevant_skills_present') &&
        sectionFeedback['relevant_skills_present'].hasOwnProperty(
          subSectionId
        ) &&
        sectionFeedback['relevant_skills_present'][subSectionId].hasOwnProperty(
          'hard_skills'
        )
      ) {
        for (var skill in sectionFeedback['relevant_skills_present'][
          subSectionId
        ]['hard_skills']) {
          var freq =
            -1 *
            parseInt(
              sectionFeedback['relevant_skills_present'][subSectionId][
                'hard_skills'
              ][skill]['frequency']
            )
          allSkillsList.push({ skill: skill, tag: 'present', frequency: freq })
        }
      }
      if (
        sectionFeedback.hasOwnProperty('relevant_skills_missing') &&
        sectionFeedback['relevant_skills_missing'].hasOwnProperty(
          subSectionId
        ) &&
        sectionFeedback['relevant_skills_missing'][subSectionId].hasOwnProperty(
          'hard_skills'
        )
      ) {
        for (var skill in sectionFeedback['relevant_skills_missing'][
          subSectionId
        ]['hard_skills']) {
          var freq =
            -1 *
            parseInt(
              sectionFeedback['relevant_skills_missing'][subSectionId][
                'hard_skills'
              ][skill]['frequency']
            )
          allSkillsList.push({ skill: skill, tag: 'missing', frequency: freq })
        }
      }
      _.sortBy(allSkillsList, 'frequency')
      topSkills[subSectionId] = {}
      let count = {
        count: { present: 0, missing: 0 },
        min_wanted: { present: 3, missing: 2 },
      }
      for (var i in allSkillsList) {
        if (
          count['min_wanted'][allSkillsList[i]['tag']] ==
          count['count'][allSkillsList[i]['tag']]
        ) {
          continue
        }
        topSkills[subSectionId][allSkillsList[i]['skill']] =
          allSkillsList[i]['frequency']
        count['count'][allSkillsList[i]['tag']]++
        if (count['count']['present'] + count['count']['missing'] == 5) {
          break
        }
      }
      if (count['count']['present'] + count['count']['missing'] < 5) {
        for (var i in allSkillsList) {
          if (
            topSkills[subSectionId].hasOwnProperty(allSkillsList[i]['skill'])
          ) {
            continue
          }
          topSkills[subSectionId][allSkillsList[i]['skill']] =
            allSkillsList[i]['frequency']
          count['count'][allSkillsList[i]['tag']]++
          if (count['count']['present'] + count['count']['missing'] == 5) {
            break
          }
        }
      }
      // Sort by frequency
      let sortable = []
      for (var skill in topSkills[subSectionId]) {
        sortable.push([skill, topSkills[subSectionId][skill]])
      }
      sortable.sort(function(a, b) {
        return a[1] - b[1]
      })
      topSkills[subSectionId] = _.map(sortable, function(v) {
        return v[0]
      })
    }

    return { present_skills: titleHardSkills, top_skills: topSkills }
  }

  getSkillsEntities(sectionSkills, entityMapEditable) {
    let skillsEntities = {
      relevant_skills_present: {},
      relevant_skills_missing: {},
    }
    for (var sectionIndex in sectionSkills['relevant_skills_present']) {
      skillsEntities['relevant_skills_present'][sectionIndex] = {}
      for (let skill in sectionSkills['relevant_skills_present'][
        sectionIndex
      ]) {
        let obj = []
        for (var j in sectionSkills['relevant_skills_present'][sectionIndex][
          skill
        ]) {
          let entities =
            entityMapEditable[
              sectionSkills['relevant_skills_present'][sectionIndex][skill][j][
                'id'
              ]
            ]
          for (let k in entities) {
            obj.push({ entity: entities[k][2], text: entities[k][3] })
          }
        }
        skillsEntities['relevant_skills_present'][sectionIndex][skill] = obj
      }
    }
    for (var sectionIndex in sectionSkills['relevant_skills_missing']) {
      skillsEntities['relevant_skills_missing'][sectionIndex] = []
      for (var j in sectionSkills['relevant_skills_missing'][sectionIndex]) {
        skillsEntities['relevant_skills_missing'][sectionIndex].push(
          sectionSkills['relevant_skills_missing'][sectionIndex][j]['word']
        )
      }
    }

    return skillsEntities
  }

  getSeo(sectionFeedback, isExperience) {
    let seo = {}
    if (
      !_.isUndefined(sectionFeedback['overall_profile_visibility_score_class'])
    ) {
      seo['score'] = []
      if (
        _.isUndefined(
          sectionFeedback['overall_profile_visibility_score_class'][
            'sub_section'
          ]
        )
      ) {
        seo['score'].push({
          color:
            sectionFeedback['overall_profile_visibility_score_class'][
              'color_feedback'
            ],
          score: this.lowerScore(
            sectionFeedback['overall_profile_visibility_score_class'][
              'overall_profile_visibility_score'
            ]
          ),
        })
      } else {
        for (var i in sectionFeedback['overall_profile_visibility_score_class'][
          'sub_section'
        ]) {
          seo['score'].push({
            color:
              sectionFeedback['overall_profile_visibility_score_class'][
                'sub_section'
              ][i]['color_feedback'],
            score: this.lowerScore(
              sectionFeedback['overall_profile_visibility_score_class'][
                'sub_section'
              ][i]['overall_profile_visibility_score']
            ),
          })
        }
      }
    }

    seo['keywords'] = []
    let seoWord = ''
    if (!isExperience) {
      var temp = { relevant: {}, irrelevant: {} }
      if (!_.isUndefined(sectionFeedback['seo_relevant_keywords'])) {
        for (var index in sectionFeedback['seo_relevant_keywords'][
          'hard_skills'
        ]) {
          for (var divId in sectionFeedback['seo_relevant_keywords'][
            'hard_skills'
          ][index]['derived_noun_positions']) {
            for (var verb in sectionFeedback['seo_relevant_keywords'][
              'hard_skills'
            ][index]['derived_noun_positions'][divId]) {
              for (var rid in sectionFeedback['seo_relevant_keywords'][
                'hard_skills'
              ][index]['derived_noun_positions'][divId][verb]) {
                var nounWord = this.cleanWordWithFlag(
                  sectionFeedback['seo_relevant_keywords']['hard_skills'][
                    index
                  ]['derived_noun_positions'][divId][verb][rid]['noun'],
                  sectionFeedback['seo_relevant_keywords']['hard_skills'][
                    index
                  ]['derived_noun_positions'][divId][verb][rid][
                    'is_display_name_set'
                  ]
                )
                if (!temp['relevant'].hasOwnProperty(nounWord)) {
                  temp['relevant'][nounWord] = []
                }
                for (var posIndex in sectionFeedback['seo_relevant_keywords'][
                  'hard_skills'
                ][index]['derived_noun_positions'][divId][verb][rid][
                  'positions'
                ]) {
                  temp['relevant'][nounWord].push({
                    id: divId,
                    pos:
                      sectionFeedback['seo_relevant_keywords']['hard_skills'][
                        index
                      ]['derived_noun_positions'][divId][verb][rid][
                        'positions'
                      ][posIndex],
                  })
                }
              }
            }
          }
          if (
            _.size(
              sectionFeedback['seo_relevant_keywords']['hard_skills'][index][
                'stated_skills_positions'
              ]
            ) > 0
          ) {
            var nounWord = this.cleanWordWithFlag(
              sectionFeedback['seo_relevant_keywords']['hard_skills'][index][
                'display_name'
              ],
              sectionFeedback['seo_relevant_keywords']['hard_skills'][index][
                'is_display_name_set'
              ]
            )
            if (!temp['relevant'].hasOwnProperty(nounWord)) {
              temp['relevant'][nounWord] = []
            }
            for (var divId in sectionFeedback['seo_relevant_keywords'][
              'hard_skills'
            ][index]['stated_skills_positions']) {
              for (var posIndex in sectionFeedback['seo_relevant_keywords'][
                'hard_skills'
              ][index]['stated_skills_positions'][divId]) {
                temp['relevant'][nounWord].push({
                  id: divId,
                  pos:
                    sectionFeedback['seo_relevant_keywords']['hard_skills'][
                      index
                    ]['stated_skills_positions'][divId][posIndex],
                })
              }
            }
          }
        }
        for (var divId in sectionFeedback['seo_relevant_keywords'][
          'category_keywords'
        ]) {
          for (var index in sectionFeedback['seo_relevant_keywords'][
            'category_keywords'
          ][divId]) {
            var nounWord = this.cleanWordWithFlag(
              sectionFeedback['seo_relevant_keywords']['category_keywords'][
                divId
              ][index]['display_name'],
              sectionFeedback['seo_relevant_keywords']['category_keywords'][
                divId
              ][index]['is_display_name_set']
            )
            if (!temp['relevant'].hasOwnProperty(nounWord)) {
              temp['relevant'][nounWord] = []
            }
            for (var posIndex in sectionFeedback['seo_relevant_keywords'][
              'category_keywords'
            ][divId][index]['positions']) {
              temp['relevant'][nounWord].push({
                id: divId,
                pos:
                  sectionFeedback['seo_relevant_keywords']['category_keywords'][
                    divId
                  ][index]['positions'][posIndex],
              })
            }
          }
        }
      }

      if (!_.isUndefined(sectionFeedback['seo_irrelevant_keywords'])) {
        for (var index in sectionFeedback['seo_irrelevant_keywords'][
          'hard_skills'
        ]) {
          var skillWord = this.cleanWordWithFlag(
            sectionFeedback['seo_irrelevant_keywords']['hard_skills'][index][
              'display_name'
            ],
            sectionFeedback['seo_irrelevant_keywords']['hard_skills'][index][
              'is_display_name_set'
            ]
          )
          if (!temp['irrelevant'].hasOwnProperty(skillWord)) {
            temp['irrelevant'][skillWord] = []
          }
          for (var divId in sectionFeedback['seo_irrelevant_keywords'][
            'hard_skills'
          ][index]['derived_keywords']) {
            temp['irrelevant'][skillWord].push(divId)
          }
          if (
            _.size(
              sectionFeedback['seo_irrelevant_keywords']['hard_skills'][index][
                'stated_div_ids'
              ]
            ) > 0
          ) {
            for (var divIndex in sectionFeedback['seo_irrelevant_keywords'][
              'hard_skills'
            ][index]['stated_div_ids']) {
              temp['irrelevant'][skillWord].push(
                sectionFeedback['seo_irrelevant_keywords']['hard_skills'][
                  index
                ]['stated_div_ids'][divIndex]
              )
            }
          }
        }
        for (var divId in sectionFeedback['seo_irrelevant_keywords'][
          'category_keywords'
        ]) {
          for (var index in sectionFeedback['seo_irrelevant_keywords'][
            'category_keywords'
          ][divId]) {
            var nounWord = this.cleanWordWithFlag(
              sectionFeedback['seo_irrelevant_keywords']['category_keywords'][
                divId
              ][index]['display_name'],
              sectionFeedback['seo_irrelevant_keywords']['category_keywords'][
                divId
              ][index]['is_display_name_set']
            )
            if (!temp['irrelevant'].hasOwnProperty(nounWord)) {
              temp['irrelevant'][nounWord] = []
            }
            temp['irrelevant'][nounWord].push(divId)
          }
        }
      }
      seo['keywords'].push(temp)
    } else {
      for (var i in sectionFeedback['seo_relevant_keywords']) {
        var temp = { relevant: {}, irrelevant: {} }
        for (var index in sectionFeedback['seo_relevant_keywords'][i][
          'hard_skills'
        ]) {
          for (var divId in sectionFeedback['seo_relevant_keywords'][i][
            'hard_skills'
          ][index]['derived_noun_positions']) {
            for (var verb in sectionFeedback['seo_relevant_keywords'][i][
              'hard_skills'
            ][index]['derived_noun_positions'][divId]) {
              for (var rid in sectionFeedback['seo_relevant_keywords'][i][
                'hard_skills'
              ][index]['derived_noun_positions'][divId][verb]) {
                var nounWord = this.cleanWordWithFlag(
                  sectionFeedback['seo_relevant_keywords'][i]['hard_skills'][
                    index
                  ]['derived_noun_positions'][divId][verb][rid]['display_name'],
                  sectionFeedback['seo_relevant_keywords'][i]['hard_skills'][
                    index
                  ]['derived_noun_positions'][divId][verb][rid][
                    'is_display_name_set'
                  ]
                )
                if (!temp['relevant'].hasOwnProperty(nounWord)) {
                  temp['relevant'][nounWord] = []
                }
                for (var posIndex in sectionFeedback['seo_relevant_keywords'][
                  i
                ]['hard_skills'][index]['derived_noun_positions'][divId][verb][
                  rid
                ]['positions']) {
                  temp['relevant'][nounWord].push({
                    id: divId,
                    pos:
                      sectionFeedback['seo_relevant_keywords'][i][
                        'hard_skills'
                      ][index]['derived_noun_positions'][divId][verb][rid][
                        'positions'
                      ][posIndex],
                  })
                }
              }
            }
          }
          if (
            _.size(
              sectionFeedback['seo_relevant_keywords'][i]['hard_skills'][index][
                'stated_skills_positions'
              ]
            ) > 0
          ) {
            var nounWord = this.cleanWordWithFlag(
              sectionFeedback['seo_relevant_keywords'][i]['hard_skills'][index][
                'display_name'
              ],
              sectionFeedback['seo_relevant_keywords'][i]['hard_skills'][index][
                'is_display_name_set'
              ]
            )
            if (!temp['relevant'].hasOwnProperty(nounWord)) {
              temp['relevant'][nounWord] = []
            }
            for (var divId in sectionFeedback['seo_relevant_keywords'][i][
              'hard_skills'
            ][index]['stated_skills_positions']) {
              for (var posIndex in sectionFeedback['seo_relevant_keywords'][i][
                'hard_skills'
              ][index]['stated_skills_positions'][divId]) {
                temp['relevant'][nounWord].push({
                  id: divId,
                  pos:
                    sectionFeedback['seo_relevant_keywords'][i]['hard_skills'][
                      index
                    ]['stated_skills_positions'][divId][posIndex],
                })
              }
            }
          }
        }
        for (var divId in sectionFeedback['seo_relevant_keywords'][i][
          'category_keywords'
        ]) {
          for (var index in sectionFeedback['seo_relevant_keywords'][i][
            'category_keywords'
          ][divId]) {
            var nounWord = this.cleanWordWithFlag(
              sectionFeedback['seo_relevant_keywords'][i]['category_keywords'][
                divId
              ][index]['display_name'],
              sectionFeedback['seo_relevant_keywords'][i]['category_keywords'][
                divId
              ][index]['is_display_name_set']
            )
            if (!temp['relevant'].hasOwnProperty(nounWord)) {
              temp['relevant'][nounWord] = []
            }
            for (var posIndex in sectionFeedback['seo_relevant_keywords'][i][
              'category_keywords'
            ][divId][index]['positions']) {
              temp['relevant'][nounWord].push({
                id: divId,
                pos:
                  sectionFeedback['seo_relevant_keywords'][i][
                    'category_keywords'
                  ][divId][index]['positions'][posIndex],
              })
            }
          }
        }
        if (!_.isUndefined(sectionFeedback['seo_irrelevant_keywords'])) {
          for (var index in sectionFeedback['seo_irrelevant_keywords'][i][
            'hard_skills'
          ]) {
            var skillWord = this.cleanWordWithFlag(
              sectionFeedback['seo_irrelevant_keywords'][i]['hard_skills'][
                index
              ]['display_name'],
              sectionFeedback['seo_irrelevant_keywords'][i]['hard_skills'][
                index
              ]['is_display_name_set']
            )
            if (!temp['irrelevant'].hasOwnProperty(skillWord)) {
              temp['irrelevant'][skillWord] = []
            }
            for (var divId in sectionFeedback['seo_irrelevant_keywords'][i][
              'hard_skills'
            ][index]['derived_keywords']) {
              temp['irrelevant'][skillWord].push(divId)
            }
            if (
              _.size(
                sectionFeedback['seo_irrelevant_keywords'][i]['hard_skills'][
                  index
                ]['stated_div_ids']
              ) > 0
            ) {
              for (var divIndex in sectionFeedback['seo_irrelevant_keywords'][
                i
              ]['hard_skills'][index]['stated_div_ids']) {
                temp['irrelevant'][skillWord].push(
                  sectionFeedback['seo_irrelevant_keywords'][i]['hard_skills'][
                    index
                  ]['stated_div_ids'][divIndex]
                )
              }
            }
          }
          for (var divId in sectionFeedback['seo_irrelevant_keywords'][i][
            'category_keywords'
          ]) {
            for (var index in sectionFeedback['seo_irrelevant_keywords'][i][
              'category_keywords'
            ][divId]) {
              var nounWord = this.cleanWordWithFlag(
                sectionFeedback['seo_irrelevant_keywords'][i][
                  'category_keywords'
                ][divId][index]['display_name'],
                sectionFeedback['seo_irrelevant_keywords'][i][
                  'category_keywords'
                ][divId][index]['is_display_name_set']
              )
              if (!temp['irrelevant'].hasOwnProperty(nounWord)) {
                temp['irrelevant'][nounWord] = []
              }
              temp['irrelevant'][nounWord].push(divId)
            }
          }
        }
        seo['keywords'].push(temp)
      }
    }

    return seo
  }

  getSeoEntities(sectionSeo, entityMapEditable) {
    let seoEntities = { relevant: {}, irrelevant: {} }
    let types = ['relevant', 'irrelevant']
    for (let sectionIndex in sectionSeo['keywords']) {
      seoEntities['relevant'][sectionIndex] = {}
      for (var keyword in sectionSeo['keywords'][sectionIndex]['relevant']) {
        seoEntities['relevant'][sectionIndex][keyword] = []
        for (var j in sectionSeo['keywords'][sectionIndex]['relevant'][
          keyword
        ]) {
          var entities =
            entityMapEditable[
              sectionSeo['keywords'][sectionIndex]['relevant'][keyword][j]['id']
            ]
          for (var k in entities) {
            seoEntities['relevant'][sectionIndex][keyword].push({
              entity: entities[k][2],
              text: keyword,
            })
          }
        }
      }
      seoEntities['irrelevant'][sectionIndex] = {}
      for (var keyword in sectionSeo['keywords'][sectionIndex]['irrelevant']) {
        seoEntities['irrelevant'][sectionIndex][keyword] = []
        for (var j in sectionSeo['keywords'][sectionIndex]['irrelevant'][
          keyword
        ]) {
          var entities =
            entityMapEditable[
              sectionSeo['keywords'][sectionIndex]['irrelevant'][keyword][j]
            ]
          for (var k in entities) {
            seoEntities['irrelevant'][sectionIndex][keyword].push({
              entity: entities[k][2],
              text: keyword,
            })
          }
        }
      }
    }

    return seoEntities
  }

  mapToFrontEndName(targetJobFunctions) {
    for (let i in targetJobFunctions) {
      if (
        this.targetFunctionBackToFrontEndMapping.hasOwnProperty(
          targetJobFunctions[i]
        )
      ) {
        targetJobFunctions[i] = this.targetFunctionBackToFrontEndMapping[
          targetJobFunctions[i]
        ]
      }
    }

    return targetJobFunctions
  }

  getRecommendedTitle(sectionFeedback) {
    let output = []
    if (
      !sectionFeedback.hasOwnProperty('seo_recommended_keywords') ||
      _.isEmpty(sectionFeedback['seo_recommended_keywords'])
    ) {
      return output
    }
    let recomendedKeys = _.keys(sectionFeedback['seo_recommended_keywords'])
    let textKeys = _.keys(sectionFeedback['text_array'])
    for (let ki in recomendedKeys) {
      let i = recomendedKeys[ki]
      let j = textKeys[ki]

      let recommended = []
      for (let divId in sectionFeedback['seo_recommended_keywords'][i]) {
        let text = sectionFeedback['text_array'][j][divId]['text']
        let positionHash = []
        for (var index in sectionFeedback['seo_recommended_keywords'][i][
          divId
        ]) {
          let len =
            sectionFeedback['seo_recommended_keywords'][i][divId][index][
              'keyword'
            ].length
          for (let posIndex in sectionFeedback['seo_recommended_keywords'][i][
            divId
          ][index]['positions']) {
            positionHash.push({
              len: len,
              pos:
                sectionFeedback['seo_recommended_keywords'][i][divId][index][
                  'positions'
                ][posIndex],
              replace:
                sectionFeedback['seo_recommended_keywords'][i][divId][index][
                  'recommended_keyword'
                ],
            })
          }
        }
        if (_.isEmpty(positionHash)) {
          continue
        }

        _.sortBy(positionHash, 'pos')
        positionHash = positionHash.reverse()

        for (var index in positionHash) {
          text =
            text.substr(0, positionHash[index]['pos']) +
            positionHash[index]['replace'] +
            text.substr(positionHash[index]['pos'] + positionHash[index]['len'])
        }

        let expr = new RegExp(' at ')

        if (expr.test(text)) {
          text = text.split(' at ')
          text.pop()
          text = text.join(' at ')
        }

        text = this.cleanRecommendedTitle(text)

        recommended.push(text)
      }
      output.push(recommended)
    }
    return output
  }

  getExperienceDuration(cumulative, exp_count) {
    let output = []
    for (let i in cumulative) {
      output[cumulative[i]['sub_section_mapping']] =
        cumulative[i]['cumulative_experience_months']
    }

    if (_.isUndefined(exp_count)) return output

    for (let i = 0; i < exp_count['count']; i++) {
      if (_.isUndefined(output[i])) output[i] = 0
    }

    return output
  }

  getSectionScore(sectionScoreClass, isExperience, section) {
    let score = []
    if (
      _.isNull(sectionScoreClass) ||
      _.isUndefined(sectionScoreClass) ||
      !sectionScoreClass.hasOwnProperty('overall_section_score_class')
    ) {
      return score
    }
    let scoreClass = $.extend(
      true,
      {},
      sectionScoreClass['overall_section_score_class']
    )
    if (!isExperience) {
      score.push({
        color: scoreClass['color_feedback'],
        score: this.lowerScore(scoreClass['overall_section_score']),
      })
    } else {
      for (let i in scoreClass['sub_section']) {
        score.push({
          color: scoreClass['sub_section'][i]['color_feedback'],
          score: this.lowerScore(
            scoreClass['sub_section'][i]['overall_section_score']
          ),
        })
      }
    }

    return score
  }

  getSectionsPerSkill(sections) {
    let sectionsPerSkill = {}
    for (let section in sections) {
      if (
        sections[section].hasOwnProperty('skills') &&
        sections[section]['skills'].hasOwnProperty('relevant_skills_present')
      ) {
        for (let sectionIndex in sections[section]['skills'][
          'relevant_skills_present'
        ]) {
          for (let skill in sections[section]['skills'][
            'relevant_skills_present'
          ][sectionIndex]) {
            if (!sectionsPerSkill.hasOwnProperty(skill)) {
              sectionsPerSkill[skill] = {
                sections: {},
                phrases: [],
                frequency: 0,
              }
            }
            if (!sectionsPerSkill[skill]['sections'].hasOwnProperty(section)) {
              sectionsPerSkill[skill]['sections'][section] = {}
            }
            sectionsPerSkill[skill]['sections'][section][sectionIndex] = []

            for (let i in sections[section]['skills'][
              'relevant_skills_present'
            ][sectionIndex][skill]) {
              let value =
                sections[section]['skills']['relevant_skills_present'][
                  sectionIndex
                ][skill][i]
              sectionsPerSkill[skill]['sections'][section][sectionIndex].push({
                id: value['id'],
                state: value['state'],
                type: value['type'],
              })
              sectionsPerSkill[skill]['frequency'] = value['frequency']

              for (let j in value['phrases']) {
                let phrase = value['phrases'][j]
                if (!_.isEmpty(phrase)) {
                  sectionsPerSkill[skill]['phrases'].push(phrase)
                }
              }
            }
          }
        }
      }
    }

    return sectionsPerSkill
  }

  cleanRecommendedTitle(word) {
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
    let newWord = frags.join(' ')
    newWord = newWord.replace(
      / of | and | for | in |-in-| to | the /gi,
      function myFunction(x) {
        return x.toLowerCase()
      }
    )
    return newWord
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

  cleanWordWithFlag(word, isDisplayNameSetFlag) {
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

    if (!isDisplayNameSetFlag) {
      let frags = word.split(/[ _]+/)
      for (let i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
      }
      return frags.join(' ')
    }
    return word
  }

  lowerScore(score) {
    return Math.abs(score - 0.01)
  }

  getLogs() {
    const {
      logData,
      match: { params },
    } = this.props
    if (_.isEmpty(logData)) {
      return {}
    }
    let logs = {}
    const { fetchId } = params
    for (let section in logData) {
      logs[section] = {}
      for (let subSectionId in logData[section]) {
        logs[section][subSectionId] = []
        for (let i in logData[section][subSectionId]['logs']) {
          let data = logData[section][subSectionId]['logs'][i]['data']
          let uploadedAt =
            logData[section][subSectionId]['logs'][i]['uploaded_at']['date']
          let change = 2
          if (
            logData[section][subSectionId]['logs'][i]['fetch_id'] == fetchId &&
            logData[section][subSectionId]['logs'][i].hasOwnProperty(
              'score_diff'
            )
          ) {
            let diff = parseFloat(
              logData[section][subSectionId]['logs'][i]['score_diff']
            )
            if (diff != 0) {
              change = diff < 0 ? -1 : 1
            } else {
              change = 0
            }
          }
          let renderText = this.getLogTextToRender(section, data)
          logs[section][subSectionId].push({
            data: data,
            date: uploadedAt,
            render_text: renderText,
            score_change: change,
            sub_section_uid: logData[section][subSectionId]['sub_section_uid'],
          })
        }
      }
    }
    return logs
  }

  getLogTextToRender(section, data) {
    if (section == 'Personal Information') {
      return data
    } else if (section == 'Profile Picture') {
      return data
    } else if (section == 'Headline') {
      return data['text']
    } else if (section == 'Summary') {
      return data['text']
    } else if (section == 'Experience') {
      let output = null
      if (!_.isEmpty(data['company'])) {
        output = {
          title: data['title'] + ' at ' + data['company'],
          sub_title: [''],
          text: '',
        }
      } else {
        output = { title: data['title'], sub_title: [''], text: '' }
      }

      if (!_.isEmpty(data['from'])) {
        output['sub_title'][0] += data['from']
        if (!_.isEmpty(data['to'])) {
          output['sub_title'][0] += ' - ' + data['to']
        }
      }
      if (!_.isEmpty(data['text'])) {
        output['text'] += data['text']
      }

      return output
    } else if (section == 'Education') {
      var output = { title: data['school'], sub_title: [], text: '' }
      if (!_.isEmpty(data['degree'])) {
        output['sub_title'].push(data['degree'])
      }
      if (!_.isEmpty(data['field_of_study'])) {
        output['sub_title'].push(data['field_of_study'])
      }
      let duration = ''
      if (!_.isEmpty(data['from'])) {
        duration += data['from'].toString()
        if (!_.isEmpty(data['to'])) {
          duration += ' - ' + data['to'].toString()
        }
      }
      if (!_.isEmpty(duration)) {
        output['sub_title'].push(duration)
      }
      if (!_.isEmpty(output['sub_title'])) {
        output['sub_title'] = [output['sub_title'].join(', ')]
      }
      if (!_.isEmpty(data['activities_and_societies'])) {
        output['text'] += data['activities_and_societies']
      }

      return output
    } else if (section == 'Volunteer Experience') {
      var output = { title: data['title'], sub_title: [], text: '' }
      if (!_.isEmpty(data['duration'])) {
        output['sub_title'].push(data['duration'])
      }
      if (!_.isEmpty(data['text'])) {
        output['text'] += data['text']
      }

      return output
    } else if (section == 'Projects') {
      var output = { title: data['title'], sub_title: [], text: '' }
      if (!_.isEmpty(data['duration'])) {
        output['sub_title'].push(data['duration'])
      }
      if (!_.isEmpty(data['members'])) {
        output['sub_title'].push(data['members'])
      }
      if (!_.isEmpty(data['text'])) {
        output['text'] += data['text']
      }

      return output
    } else if (section == 'Publications') {
      var output = { title: data['title'], sub_title: [], text: '' }
      if (!_.isEmpty(data['publisher'])) {
        output['sub_title'].push(data['publisher'])
      }
      if (!_.isEmpty(data['publication_date'])) {
        output['sub_title'].push(data['publication_date'])
      }
      if (!_.isEmpty(output['sub_title'])) {
        output['sub_title'] = [output['sub_title'].join('  ')]
      }
      if (!_.isEmpty(data['authors'])) {
        output['sub_title'].push(data['authors'])
      }
      if (!_.isEmpty(data['text'])) {
        output['text'] += data['text']
      }

      return output
    }
  }

  render() {
    const {
      location,
      ui,
      has_api,
      has_pdf,
      has_resume,
      status,
      resumeSkillsInLinkedin,
      resumeSkillsNotInLinkedin,
      match: { params },
      update_detailed_state,
      tourStatus,
      samples,
      allCapsResume,
      allSmallResume,
      normalResume,
    } = this.props // info, definitions, selectHighlightMessage
    const { fetchId } = params

    return (
      <div role="region" aria-labelledby="detailed-feedback">
        <DetailedFeedbackComponent
          tabIndex={10}
          location={location}
          fetchId={fetchId}
          ui={ui}
          has_api={has_api}
          has_pdf={has_pdf}
          has_resume={has_resume}
          status={status}
          resumeSkillsInLinkedin={resumeSkillsInLinkedin}
          resumeSkillsNotInLinkedin={resumeSkillsNotInLinkedin}
          update_detailed_state={update_detailed_state}
          onSelectSection={this.onSelectSection}
          onSelectPrev={this.onSelectPrev}
          onSelectNext={this.onSelectNext}
          underlineSpellError={this.underlineSpellError}
          onUpdateText={this.onUpdateText}
          unhighlightAll={this.unhighlightAll}
          activeNavIndex={this.state.activeNavIndex}
          resetSectionNavs={this.resetSectionNavs}
          updateEditSection={this.updateEditSection}
          editSectionUpdated={this.editSectionUpdated}
          newSubSection={this.state.newSubSection}
          changeNewSubSectionValue={this.changeNewSubSectionValue}
          logModalMounted={this.logModalMounted}
          editModalMounted={this.editModalMounted}
          changeModalState={this.changeModalState}
          tourStatus={tourStatus}
          selectedPanelPersonalInfo={this.state.selectedPanelPersonalInfo}
          setSelectedPanelPersonalInfo={this.setSelectedPanelPersonalInfo}
          allCapsResume={allCapsResume}
          allSmallResume={allSmallResume}
          normalResume={normalResume}
        />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ui: state.detailedFeedbackUi, // ui state
    feedback: state.aspireFeedbackData.data, // aspire feedback data
    logData: state.aspireFeedbackData.logs,
    uploaded_picture: state.aspireFeedbackData.uploaded_picture,
    has_api: state.aspireFeedbackData.has_api,
    has_pdf: state.aspireFeedbackData.has_pdf,
    has_resume: state.aspireFeedbackData.has_resume,
    status: state.aspireFeedbackData.status,
    imageData: state.imageData,
    resumeSkillsInLinkedin: state.detailedFeedbackUi.resumeSkillsInLinkedin,
    resumeSkillsNotInLinkedin:
      state.detailedFeedbackUi.resumeSkillsNotInLinkedin,
    update_detailed_state: state.aspireFeedbackData.update_detailed_state,
    editedSection: state.editData.section_name,
    editedSubSectionId: state.editData.sub_section_id,
    editedIsNewSubSection: state.editData.new_sub_section,
    editedSectionDeleted: state.editData.delete_sub_section,
    tourStatus: state.tour.tourStatus,
    samples: state.aspireFeedbackData.samples,
    allCapsResume: state.aspireFeedbackData.allCapsResume,
    allSmallResume: state.aspireFeedbackData.allSmallResume,
    normalResume: state.aspireFeedbackData.normalResume,
    callOnSelectSectionDependenciesInDetailedFeedback:
      state.aspireFeedbackData
        .callOnSelectSectionDependenciesInDetailedFeedback,
    keyForSelectSection: state.aspireFeedbackData.keyForSelectSection,
    functions: state.aspireFunctionMappings.function_mappings,
  }
}

function mapDispatchToProps(state, ownProps) {
  return {}
}

export default connect(
  mapStateToProps,
  {
    selectSection,
    selectIndex,
    updateText,
    detailedFeedbackUpdated,
    updateImageData,
    updateEditedDataState,
    redirectSelect,
    updateFeedbackState,
  }
)(DetailedFeedback)
