import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchEditDynamicData,
  updateEditDynamicDataState,
} from '../../../actions/AspireEditDynamicData'
import { checkIfEmpty } from '../../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { sectionUnderscore } from '../../Constants/UniversalMapping'
import { editModalAriaLabel } from '../../Constants/AriaLabelText'

class SkillsGuide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      callApi: false,
      showDynamic: false,
      presentSkillsState: 'collapsed',
      missingSkillsState: 'collapsed',
      resumeSkillsState: 'collapsed',
    }
    this.showMorePresentSkills = false
    this.showMoreMissingSkills = false
    this.showMoreResumeSkills = false
    this.presentSkills = []
    this.missingSkills = []
    this.resumeSkills = []
    this.sectionSamples = 0
    this.len = 0
    this.sectionWiseCount = {
      Headline: ['3-5', '3-5'],
      Summary: ['10+', '10+'],
      Experience: ['8+', '8+'],
      Education: ['2-4', '2-4'],
      'Volunteer Experience': ['3-5', '3-5'],
      Skills: ['10+', '10+'],
      Projects: ['3-5', '3-5'],
      Publications: ['1-2', '1-2'],
    }
    this.emptySection = false
    this.sendTrackingDataDebouncePresent = _.debounce(
      sendTrackingData,
      1000,
      true
    )
    this.sendTrackingDataDebounceResume = _.debounce(
      sendTrackingData,
      1000,
      true
    )
    this.sendTrackingDataDebounceGray = _.debounce(sendTrackingData, 1000, true)
    this.getPresentSkills = this.getPresentSkills.bind(this)
    this.getMissingSkills = this.getMissingSkills.bind(this)
    this.handlePresentSkillClick = this.handlePresentSkillClick.bind(this)
    this.handleResumeSkillClick = this.handleResumeSkillClick.bind(this)
  }

  UNSAFE_componentWillMount() {
    const {
      fetchEditDynamicData,
      currentSection,
      currentIndex,
      fetchId,
      newSubSection,
      getDynamicEditFeedbackForModule,
      fetchingSkills,
      fetchedSkills,
      errorSkills,
      dataSkills,
      loaderInput,
      sectionWiseTextIntermediateSkills,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
      updateEditDynamicDataState,
    } = this.props

    let callApi = false
    let showDynamic = false
    let emptySection = false

    if (
      checkIfEmpty(
        sectionWiseTextEditable[currentIndex],
        sectionUnderscore[currentSection]
      )
    ) {
      // if empty section then show static data
      callApi = false
      showDynamic = false
      emptySection = true
    } else if (_.isString(currentIndex) && currentIndex.substr(-4) === '_new') {
      // if new section
      // some data is present in new section feedback for which is yet to be decided
      if (sectionWiseTextIntermediateSkills == null) {
        // first call to dynamic data
        callApi = true
        showDynamic = true
      } else if (
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
        JSON.stringify(sectionWiseTextIntermediateSkills[currentIndex])
      ) {
        // dynamic called earlier for same value
        callApi = false
        showDynamic = true
      } else {
        // call dynamic
        callApi = true
        showDynamic = true
      }
    } else {
      // edit section
      if (
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
        JSON.stringify(sectionWiseTextStatic[currentIndex])
      ) {
        // it is as it is .. show static content
        callApi = false
        showDynamic = false
      } else {
        if (sectionWiseTextIntermediateSkills == null) {
          // first call to dynamic data
          callApi = true
          showDynamic = true
        } else if (
          JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
          JSON.stringify(sectionWiseTextIntermediateSkills[currentIndex])
        ) {
          // dynamic called earlier for same value
          callApi = false
          showDynamic = true
        } else {
          // call dynamic
          callApi = true
          showDynamic = true
        }
      }
    }

    this.emptySection = emptySection
    this.setState({ callApi: callApi })
    this.setState({ showDynamic: showDynamic })

    if (
      currentSection == 'Summary' ||
      currentSection == 'Experience' ||
      currentSection == 'Headline'
    ) {
      if (
        !(fetchingSkills && !fetchedSkills) &&
        callApi &&
        _.isEmpty(loaderInput)
      ) {
        getDynamicEditFeedbackForModule('skills')
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      updateEditSection,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
      currentIndex,
      currentSection,
    } = nextProps
    if (updateEditSection == true) {
      this.setState({ showDynamic: false })
      this.emptySection = false
    } else if (
      JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
      JSON.stringify(sectionWiseTextStatic[currentIndex])
    ) {
      this.setState({ showDynamic: false })
      if (
        checkIfEmpty(
          sectionWiseTextEditable[currentIndex],
          sectionUnderscore[currentSection]
        )
      ) {
        this.emptySection = true
      } else {
        this.emptySection = false
      }
    } else if (
      _.isString(currentIndex) &&
      currentIndex.substr(-4) === '_new' &&
      checkIfEmpty(
        sectionWiseTextEditable[currentIndex],
        sectionUnderscore[currentSection]
      )
    ) {
      this.setState({ showDynamic: false })
      this.emptySection = true
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  staticSkillsImage(currentSection) {
    if (currentSection == 'Experience') {
      return (
        <img
          alt="image depecting how to keep skill balanced between target function and skill included in your profile"
          src={`${process.env.APP_BASE_URL}dist/images/skills-write-experience.png`}
          className="img-responsive as-no-skills-img"
        />
      )
    }
    if (currentSection == 'Headline' || currentSection == 'Summary') {
      return (
        <img
          alt="image depecting how to keep skill balanced between target function and skill included in your profile"
          src={`${process.env.APP_BASE_URL}dist/images/skills-write-summary-headline.png`}
          className="img-responsive as-no-skills-img"
        />
      )
    }
    return (
      <img
        alt="image depecting how to keep skill balanced between target function and skill included in your profile"
        src={`${process.env.APP_BASE_URL}dist/images/skills-write.jpg`}
        className="img-responsive as-no-skills-img"
      />
    )
  }

  missingAndResumeSkillsProcessingLogic(relMissSkills = []) {
    const {
      currentSection,
      data,
      newSubSection,
      sectionsPerSkill,
      currentIndex,
      resumeSkillsInLinkedin,
    } = this.props

    this.resumeSkills = []
    this.missingSkills = []

    if (!_.isEmpty(relMissSkills)) {
      let possessedSkills = {}
      // First prioritize hard skills by score, then soft skills by score
      let otherSkills = {
        hard_skills: {
          '1': [],
          '0.9': [],
          '0.8': [],
          '0.7': [],
          '0.6': [],
          '0.5': [],
        },
        soft_skills: {
          '1': [],
          '0.9': [],
          '0.8': [],
          '0.7': [],
          '0.6': [],
          '0.5': [],
        },
      }
      for (let i in relMissSkills) {
        let otherSections = {}
        let phrases = []
        let skill = relMissSkills[i]['word']
        if (sectionsPerSkill.hasOwnProperty(skill)) {
          phrases = sectionsPerSkill[skill]['phrases']
          for (let sec in sectionsPerSkill[skill]['sections']) {
            for (let secIndex in sectionsPerSkill[skill]['sections'][sec]) {
              if (sec != currentSection || secIndex != currentIndex) {
                let ind = parseInt(secIndex)
                let otherSectionName = ''
                if ((ind == 0) & (sec != currentSection)) {
                  otherSectionName = sec
                } else {
                  ind += 1
                  otherSectionName = sec + ' ' + ind
                }

                let states = { stated: false, derived: false }
                for (let k in sectionsPerSkill[skill]['sections'][sec][
                  secIndex
                ]) {
                  states[
                    sectionsPerSkill[skill]['sections'][sec][secIndex][k][
                      'state'
                    ]
                  ] = true
                }
                otherSections[otherSectionName] = states
              }
            }
          }
        }
        if (!_.isEmpty(phrases) || !_.isEmpty(otherSections)) {
          possessedSkills[skill] = {
            phrases: phrases,
            other_sections: otherSections,
            type: relMissSkills[i]['type'],
          }
        } else if (
          otherSkills[relMissSkills[i]['type']].hasOwnProperty(
            relMissSkills[i]['score']
          )
        ) {
          otherSkills[relMissSkills[i]['type']][relMissSkills[i]['score']].push(
            skill
          )
        }
      }

      let count = 0
      let skillsLimit = 10
      if (currentSection == 'Headline') {
        skillsLimit = 5
      }

      for (let skill in possessedSkills) {
        let isResumeSkill = _.contains(
          resumeSkillsInLinkedin,
          skill.toLowerCase()
        )
        if (isResumeSkill) {
          this.resumeSkills.push(skill)
        } else {
          this.missingSkills.push(skill)
        }
        count += 1
        if (count == skillsLimit) {
          break
        }
      }

      for (let typeVar in otherSkills) {
        if (count == skillsLimit) {
          break
        }
        for (let score in otherSkills[typeVar]) {
          if (count == skillsLimit) {
            break
          }
          for (let k in otherSkills[typeVar][score]) {
            if (count == skillsLimit) {
              break
            }
            let skill = otherSkills[typeVar][score][k]
            let isResumeSkill = _.contains(
              resumeSkillsInLinkedin,
              skill.toLowerCase()
            )

            if (isResumeSkill) {
              this.resumeSkills.push(skill)
            } else {
              this.missingSkills.push(skill)
            }
            count += 1
          }
        }
      }
    }
  }

  handlePresentSkillClick(skill, type) {
    const {
      highlightEntityText,
      unhighlightAll,
      setSelectedSkill,
      sectionWiseTextEditable,
      dataSkills,
      currentIndex,
      currentSection,
    } = this.props
    unhighlightAll()
    let jsonObjectForTracking = {
      eventLabel: 'skills_guide_present_skill_click',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: 'skills',
      skill: skill,
      type: type,
    }
    this.sendTrackingDataDebouncePresent(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    let finalTexts = []
    if (type == 'dynamic') {
      let skillObj = _.find(
        dataSkills['present_skills'],
        function(presentSkillObj) {
          return presentSkillObj.name == skill
        },
        this
      )

      let texts = skillObj.highlightValues

      for (let entity in sectionWiseTextEditable[currentIndex]) {
        let val = sectionWiseTextEditable[currentIndex][entity]

        for (let i = 0; i < texts.length; i++) {
          if (val != '') {
            let substring = texts[i]['text']

            if (currentSection == 'Experience') {
              let expr = new RegExp(' at ')
              if (expr.test(substring)) {
                if (entity == 'title') {
                  substring = substring.split(' at ')
                  substring = substring[0]
                } else if (entity == 'company') {
                  substring = substring.split(' at ')
                  substring = substring[1]
                }
              }
            }

            if (substring != '') {
              if (
                val
                  .toString()
                  .toLowerCase()
                  .indexOf(substring.toString().toLowerCase()) != -1
              ) {
                finalTexts.push({ entity: entity, text: substring })
              }
            }
          }
        }
      }
    }
    highlightEntityText('skills', skill, type, finalTexts)
    setSelectedSkill(skill)
  }

  handleResumeSkillClick(index, skill, type) {
    const {
      unhighlightAll,
      setSelectedSkill,
      currentSection,
      currentIndex,
    } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'skills_guide_resume_skill_click',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: 'skills',
      skill: skill,
      type: type,
    }
    this.sendTrackingDataDebounceResume(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.setState({ index: index })
  }

  handleMissingSkillClick(skill, type) {
    const { currentSection, currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'skills_guide_missing_skill_click',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: 'skills',
      skill: skill,
      type: type,
    }
    this.sendTrackingDataDebounceGray(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  handleShowMorePresentSkillsToggle() {
    const { currentSection, currentIndex } = this.props
    if (this.state.presentSkillsState == 'collapsed') {
      let jsonObjectForTracking = {
        eventLabel: 'skills_guide_present_skill_show_more_btn_click',
        currentSection: currentSection,
        currentIndex: currentIndex,
        module: 'skills',
      }

      this.sendTrackingDataDebouncePresent(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState({ presentSkillsState: 'expanded' })
    } else {
      let jsonObjectForTracking = {
        eventLabel: 'skills_guide_present_skill_show_less_btn_click',
        currentSection: currentSection,
        currentIndex: currentIndex,
        module: 'skills',
      }

      this.sendTrackingDataDebouncePresent(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState({ presentSkillsState: 'collapsed' })
    }
  }

  handleShowMoreResumeSkillsToggle() {
    const { currentSection, currentIndex } = this.props
    if (this.state.resumeSkillsState == 'collapsed') {
      let jsonObjectForTracking = {
        eventLabel: 'skills_guide_resume_skill_show_more_btn_click',
        currentSection: currentSection,
        currentIndex: currentIndex,
        module: 'skills',
      }

      this.sendTrackingDataDebouncePresent(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState({ resumeSkillsState: 'expanded' })
    } else {
      let jsonObjectForTracking = {
        eventLabel: 'skills_guide_resume_skill_show_less_btn_click',
        currentSection: currentSection,
        currentIndex: currentIndex,
        module: 'skills',
      }

      this.sendTrackingDataDebouncePresent(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState({ resumeSkillsState: 'collapsed' })
    }
  }

  handleShowMoreMissingSkillsToggle() {
    const { currentSection, currentIndex } = this.props
    if (this.state.missingSkillsState == 'collapsed') {
      let jsonObjectForTracking = {
        eventLabel: 'skills_guide_missing_skill_show_more_btn_click',
        currentSection: currentSection,
        currentIndex: currentIndex,
        module: 'skills',
      }

      this.sendTrackingDataDebouncePresent(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState({ missingSkillsState: 'expanded' })
    } else {
      let jsonObjectForTracking = {
        eventLabel: 'skills_guide_missing_skill_show_less_btn_click',
        currentSection: currentSection,
        currentIndex: currentIndex,
        module: 'skills',
      }

      this.sendTrackingDataDebouncePresent(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState({ missingSkillsState: 'collapsed' })
    }
  }

  getAriaLabelForPresentSkills() {
    const {
      sectionsEntitiesToHighlight,
      currentIndex,
      currentSection,
      dataSkills,
    } = this.props
    let ariaLabel = []
    let skillHighlightTextMapping = []
    if (
      !this.state.showDynamic &&
      sectionsEntitiesToHighlight[currentSection]['skills'].hasOwnProperty(
        'relevant_skills_present'
      )
    ) {
      skillHighlightTextMapping =
        sectionsEntitiesToHighlight[currentSection]['skills'][
          'relevant_skills_present'
        ][currentIndex]
    } else if (dataSkills.hasOwnProperty('present_skills')) {
      skillHighlightTextMapping = dataSkills['present_skills']
    }

    _.map(skillHighlightTextMapping, (value, key) => {
      let skill = this.state.showDynamic ? value['name'] : key
      let highlightValue = this.state.showDynamic
        ? value['highlightValues']
        : value
      let textArray = []
      let sentenceDetected = false
      textArray.push(` Detected ${skill} skill from`)
      _.map(highlightValue, (object, index) => {
        if (textArray.indexOf(object['text']) == -1) {
          if (object['entity'] != 'text') {
            textArray.push(object['entity'])
          } else if (!sentenceDetected) {
            sentenceDetected = true
            textArray.push('following sentences. First ')
          } else {
            textArray.push('next')
          }
          textArray.push(object['text'])
        }
      })
      ariaLabel[skill] = textArray.join(', ')
    })

    return ariaLabel
  }

  getPresentSkills() {
    const {
      dataSkills,
      selectedSkill,
      currentSection,
      data,
      newSubSection,
      sectionsPerSkill,
      currentIndex,
      titleHardSkills,
      derivedSkills,
      sectionsEntitiesToHighlight,
    } = this.props
    this.presentSkills = []

    if (!this.state.showDynamic) {
      if (this.emptySection) {
        this.presentSkills = []
      } else {
        let skillsPresent = []
        let skillsLimit = 10
        if (
          data.hasOwnProperty('relevant_skills_present') &&
          data['relevant_skills_present'].hasOwnProperty(currentIndex)
        ) {
          let prioritizeSkills = {
            hard_skills: {
              '1': [],
              '0.9': [],
              '0.8': [],
              '0.7': [],
              '0.6': [],
              '0.5': [],
            },
            soft_skills: {
              '1': [],
              '0.9': [],
              '0.8': [],
              '0.7': [],
              '0.6': [],
              '0.5': [],
            },
          }
          for (var skill in data['relevant_skills_present'][currentIndex]) {
            for (var k in data['relevant_skills_present'][currentIndex][
              skill
            ]) {
              if (
                prioritizeSkills[
                  data['relevant_skills_present'][currentIndex][skill][k][
                    'type'
                  ]
                ].hasOwnProperty(
                  data['relevant_skills_present'][currentIndex][skill][k][
                    'score'
                  ]
                )
              ) {
                prioritizeSkills[
                  data['relevant_skills_present'][currentIndex][skill][k][
                    'type'
                  ]
                ][
                  data['relevant_skills_present'][currentIndex][skill][k][
                    'score'
                  ]
                ].push(skill)
              }
            }
          }
          let greenKeywords = []
          let count = 0
          for (let typeVar in prioritizeSkills) {
            if (count == skillsLimit) {
              break
            }
            for (let score in prioritizeSkills[typeVar]) {
              if (count == skillsLimit) {
                break
              }
              let uniq = _.uniq(prioritizeSkills[typeVar][score])
              for (let k in uniq) {
                if (count == skillsLimit) {
                  break
                }
                let skill = uniq[k]
                greenKeywords.push({ type: typeVar, skill: skill })
                count += 1
              }
            }
          }

          for (let skillIndex in greenKeywords) {
            let skill = greenKeywords[skillIndex]['skill']
            let skillType = greenKeywords[skillIndex]['type']
            let flag = true
            if (currentSection == 'Headline') {
              flag = false
              for (let k in data['relevant_skills_present'][currentIndex][
                skill
              ]) {
                if (
                  data['relevant_skills_present'][currentIndex][skill][k][
                    'state'
                  ] == 'stated'
                ) {
                  flag = true
                  break
                }
              }
            }

            if (flag === false) {
              continue
            }

            let otherSections = {}
            let phrases = []
            let sectionStates = { stated: false, derived: false }
            if (sectionsPerSkill.hasOwnProperty(skill)) {
              phrases = sectionsPerSkill[skill]['phrases']
              for (let sec in sectionsPerSkill[skill]['sections']) {
                for (let secIndex in sectionsPerSkill[skill]['sections'][sec]) {
                  if (sec != currentSection || secIndex != currentIndex) {
                    let ind = parseInt(secIndex)
                    let otherSectionName = ''
                    if (ind == 0 && sec != currentSection) {
                      otherSectionName = sec
                    } else {
                      ind += 1
                      otherSectionName = sec + ' ' + ind
                    }

                    let states = { stated: false, derived: false }
                    for (let k in sectionsPerSkill[skill]['sections'][sec][
                      secIndex
                    ]) {
                      states[
                        sectionsPerSkill[skill]['sections'][sec][secIndex][k][
                          'state'
                        ]
                      ] = true
                    }
                    otherSections[otherSectionName] = states
                  } else {
                    for (let k in sectionsPerSkill[skill]['sections'][sec][
                      secIndex
                    ]) {
                      sectionStates[
                        sectionsPerSkill[skill]['sections'][sec][secIndex][k][
                          'state'
                        ]
                      ] = true
                    }
                  }
                }
              }
            }

            let topFiveSkill = 'false'
            if (
              currentSection == 'Experience' &&
              !_.isEmpty(titleHardSkills) &&
              _.contains(
                titleHardSkills['top_skills'][currentIndex],
                skill.toLowerCase()
              )
            ) {
              if (
                titleHardSkills['present_skills'][currentIndex].hasOwnProperty(
                  skill.toLowerCase()
                )
              ) {
                topFiveSkill = 'in_title'
              } else {
                topFiveSkill = 'not_in_title'
              }
            }
            this.presentSkills.push(skill)
          }
        }
      }
    } else {
      if (this.emptySection) {
        this.presentSkills = []
      } else {
        if (dataSkills.hasOwnProperty('present_skills')) {
          this.presentSkills = _.map(dataSkills['present_skills'], function(
            presentSkillObj
          ) {
            return presentSkillObj.name
          })
        }
      }
    }
    let ariaLabelForSkills = this.getAriaLabelForPresentSkills()
    let noOfPresentSkills = _.size(this.presentSkills)

    if (noOfPresentSkills > 0) {
      let skillsLimit = 5
      if (noOfPresentSkills > skillsLimit) {
        this.showMorePresentSkills = true
        if (this.state.presentSkillsState == 'collapsed') {
          let i = 0
          this.presentSkills = _.filter(this.presentSkills, function(skill) {
            i++
            if (i <= skillsLimit) {
              return true
            } else {
              return false
            }
          })
        }
      }

      let skillsList = _.map(
        this.presentSkills,
        function(skill) {
          let isSelected = false
          if (selectedSkill == skill) {
            isSelected = true
          }

          let type = null
          if (!this.state.showDynamic) {
            type = 'static'
          } else {
            type = 'dynamic'
          }

          return (
            <button
              key={skill}
              onClick={() => this.handlePresentSkillClick(skill, type)}
              className={classNames('as-edit-screen-list-item-green', {
                active: isSelected,
              })}
              tabIndex={
                !this.showMorePresentSkills
                  ? 0
                  : this.state.presentSkillsState == 'collapsed'
                  ? -1
                  : 0
              }
              aria-label={
                isSelected
                  ? ariaLabelForSkills[skill]
                  : `Click to know where you have mentioned ${skill}`
              }>
              <div className="as-present-skill-name">{skill}</div>
            </button>
          )
        },
        this
      )

      let showMorePresentSkillsBtn = null
      if (this.showMorePresentSkills == true) {
        if (this.state.presentSkillsState == 'collapsed') {
          showMorePresentSkillsBtn = (
            <div className="as-show-more-btn-container">
              <a
                className="as-show-more-btn"
                href="javascript:void(0);"
                aria-label={'Click to read mentioned skills'}
                onClick={() => this.handleShowMorePresentSkillsToggle()}>
                Show More
              </a>
            </div>
          )
        } else {
          showMorePresentSkillsBtn = (
            <div className="as-show-more-btn-container">
              <a
                aria-label={'press shift tab to read skills '}
                className="as-show-more-btn"
                href="javascript:void(0);"
                onClick={() => this.handleShowMorePresentSkillsToggle()}>
                Show Less
              </a>
            </div>
          )
        }
      }

      return (
        <div className="as-skills-container">
          <div className="as-skills-list">
            <div className="as-all-lists-heading-wrapper">
              <div className="as-all-lists-heading-img-wrapper">
                <img
                  alt=""
                  src={`${process.env.APP_BASE_URL}dist/images/edit-screens/icon-present.svg`}
                  className="as-all-lists-heading-img"
                />{' '}
              </div>
              <div
                className="as-all-lists-heading-text"
                tabIndex={0}
                aria-label={
                  editModalAriaLabel[currentSection]['mentioned_skill']
                }>
                Click to see where you have mentioned these skills in your{' '}
                {currentSection}
              </div>
            </div>
            {showMorePresentSkillsBtn}
            {skillsList}
          </div>
          <div className="clearfix" />
        </div>
      )
    }

    return null
  }

  getResumeSkills() {
    const {
      dataSkills,
      dataResumeGaps,
      selectedSkill,
      currentSection,
      data,
      newSubSection,
      sectionsPerSkill,
      currentIndex,
      resumeSkillsInLinkedin,
    } = this.props

    let relMissSkills = []
    if (!this.state.showDynamic) {
      if (
        newSubSection === false &&
        data.hasOwnProperty('relevant_skills_missing') &&
        data['relevant_skills_missing'].hasOwnProperty(currentIndex)
      ) {
        relMissSkills = [].concat(data['relevant_skills_missing'][currentIndex])
      } else if (
        newSubSection === true &&
        currentSection == 'Experience' &&
        data.hasOwnProperty('recommended_skills') &&
        data['recommended_skills'].hasOwnProperty(0)
      ) {
        relMissSkills = [].concat(data['recommended_skills'][0])
      } else if (
        currentSection == 'Summary' &&
        data.hasOwnProperty('relevant_skills_missing') &&
        data['relevant_skills_missing'].hasOwnProperty(0)
      ) {
        relMissSkills = [].concat(data['relevant_skills_missing'][0])
      }
      this.missingAndResumeSkillsProcessingLogic(relMissSkills)
    } else {
      if (this.emptySection) {
        if (
          newSubSection === false &&
          data.hasOwnProperty('relevant_skills_missing') &&
          data['relevant_skills_missing'].hasOwnProperty(currentIndex)
        ) {
          relMissSkills = [].concat(
            data['relevant_skills_missing'][currentIndex]
          )
        } else if (
          newSubSection === true &&
          currentSection == 'Experience' &&
          data.hasOwnProperty('recommended_skills') &&
          data['recommended_skills'].hasOwnProperty(0)
        ) {
          relMissSkills = [].concat(data['recommended_skills'][0])
        } else if (
          currentSection == 'Summary' &&
          data.hasOwnProperty('relevant_skills_missing') &&
          data['relevant_skills_missing'].hasOwnProperty(0)
        ) {
          relMissSkills = [].concat(data['relevant_skills_missing'][0])
        }
        this.missingAndResumeSkillsProcessingLogic(relMissSkills)
      } else {
        if (dataSkills.hasOwnProperty('missing_skills')) {
          let relMissSkills = dataSkills['missing_skills']
          this.missingAndResumeSkillsProcessingLogic(relMissSkills)
        }
      }
    }

    this.resumeSkills = _.filter(this.resumeSkills, function(resumeSkill) {
      if (
        dataResumeGaps.hasOwnProperty('skills') &&
        dataResumeGaps['skills'].hasOwnProperty('hard_skills') &&
        dataResumeGaps['skills']['hard_skills'].hasOwnProperty(resumeSkill)
      ) {
        return true
      } else if (
        dataResumeGaps.hasOwnProperty('skills') &&
        dataResumeGaps['skills'].hasOwnProperty('soft_skills') &&
        dataResumeGaps['skills']['soft_skills'].hasOwnProperty(resumeSkill)
      ) {
        return true
      }
      return false
    })

    this.len = 0
    this.sectionSamples = []

    let noOfResumeSkills = _.size(this.resumeSkills)

    if (noOfResumeSkills > 0) {
      let skillsLimit = 5
      if (noOfResumeSkills > skillsLimit) {
        this.showMoreResumeSkills = true
        if (this.state.resumeSkillsState == 'collapsed') {
          let i = 0
          this.resumeSkills = _.filter(this.resumeSkills, function(skill) {
            i++
            if (i <= skillsLimit) {
              return true
            } else {
              return false
            }
          })
        }
      }

      this.sectionSamples = _.map(this.resumeSkills, function(resumeSkill) {
        if (
          dataResumeGaps.hasOwnProperty('skills') &&
          dataResumeGaps['skills'].hasOwnProperty('hard_skills') &&
          dataResumeGaps['skills']['hard_skills'].hasOwnProperty(resumeSkill)
        ) {
          return {
            name: resumeSkill,
            example: dataResumeGaps['skills']['hard_skills'][resumeSkill],
          }
        } else if (
          dataResumeGaps.hasOwnProperty('skills') &&
          dataResumeGaps['skills'].hasOwnProperty('soft_skills') &&
          dataResumeGaps['skills']['soft_skills'].hasOwnProperty(resumeSkill)
        ) {
          return {
            name: resumeSkill,
            example: dataResumeGaps['skills']['soft_skills'][resumeSkill],
          }
        }
      })

      this.len = _.size(this.sectionSamples)

      let skillsList = []
      for (let i = 0; i < this.len; i++) {
        let isSelected = false
        if (this.state.index == i) {
          isSelected = true
        }

        let skill = this.sectionSamples[i]['name']

        let type = null
        if (!this.state.showDynamic) {
          type = 'static'
        } else {
          type = 'dynamic'
        }

        skillsList.push(
          <button
            key={skill}
            onClick={() => this.handleResumeSkillClick(i, skill, type)}
            tabIndex={
              !this.showMoreResumeSkills
                ? 0
                : this.state.resumeSkillsState == 'collapsed'
                ? -1
                : 0
            }
            aria-label={skill}
            className={classNames('as-edit-screen-list-item-blue', {
              active: isSelected,
            })}>
            {skill}
          </button>
        )
      }

      let showMoreResumeSkillsBtn = null
      if (this.showMoreResumeSkills == true) {
        if (this.state.resumeSkillsState == 'collapsed') {
          showMoreResumeSkillsBtn = (
            <div className="as-show-more-btn-container">
              <a
                aria-label={'click to read skill mentioned resume'}
                className="as-show-more-btn"
                href="javascript:void(0);"
                onClick={() => this.handleShowMoreResumeSkillsToggle()}>
                Show More
              </a>
            </div>
          )
        } else {
          showMoreResumeSkillsBtn = (
            <div className="as-show-more-btn-container">
              <a
                tabIndex={0}
                aria-label={'press to skip listening to mentioned skill'}
                className="as-show-more-btn"
                href="javascript:void(0);"
                onClick={() => this.handleShowMoreResumeSkillsToggle()}>
                Show Less
              </a>
            </div>
          )
        }
      }

      let exampleBullets = []
      exampleBullets = _.map(
        this.sectionSamples[this.state.index]['example'],
        function(example, key) {
          return (
            <div key={key} tabIndex={0} aria-label={example}>
              {example}
            </div>
          )
        }
      )

      return (
        <div className="as-skills-container">
          <div className="as-skills-list">
            <div className="as-all-lists-heading-wrapper">
              {showMoreResumeSkillsBtn}
              <div className="as-all-lists-heading-img-wrapper">
                <img
                  alt=""
                  src={`${process.env.APP_BASE_URL}dist/images/edit-screens/icon-resume.svg`}
                  className="as-all-lists-heading-img"
                />{' '}
              </div>
              <div
                className="as-all-lists-heading-text"
                tabIndex={0}
                aria-label={
                  editModalAriaLabel[currentSection]['mentioned_skill_resume']
                }>
                Click to see where you have mentioned these skills in your
                Resume
              </div>
            </div>
            {skillsList}
          </div>
          <div className="clearfix" />
          <div className="as-skills-example-outer-wrapper">
            <div className="as-sample-wrapper as-skills-example-wrapper">
              <div className="as-sample-example as-skills-example">
                <div className="as-skills-example-text" id="scrollItToTop">
                  {exampleBullets}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  getMissingSkills() {
    const { currentSection, currentIndex } = this.props

    let noOfMissingSkills = _.size(this.missingSkills)

    if (noOfMissingSkills > 0) {
      let skillsLimit = 5
      if (noOfMissingSkills > skillsLimit) {
        this.showMoreMissingSkills = true
        if (this.state.missingSkillsState == 'collapsed') {
          let i = 0
          this.missingSkills = _.filter(this.missingSkills, function(skill) {
            i++
            if (i <= skillsLimit) {
              return true
            } else {
              return false
            }
          })
        }
      }

      let skillsList = _.map(
        this.missingSkills,
        function(skill) {
          let type = null
          if (!this.state.showDynamic) {
            type = 'static'
          } else {
            type = 'dynamic'
          }

          return (
            <div
              key={skill}
              onClick={() => this.handleMissingSkillClick(skill, type)}
              className="as-edit-screen-list-item-gray">
              <span
                tabIndex={
                  this.showMoreMissingSkills
                    ? 0
                    : this.state.missingSkillsState == 'collapsed'
                    ? -1
                    : 1
                }
                tabIndex={0}
                aria-label={skill}>
                {skill}
              </span>
            </div>
          )
        },
        this
      )

      let showMoreMissingSkillsBtn = null
      if (this.showMoreMissingSkills == true) {
        if (this.state.missingSkillsState == 'collapsed') {
          showMoreMissingSkillsBtn = (
            <div className="as-show-more-btn-container">
              <a
                aria-label="Click to know mentioned skill"
                className="as-show-more-btn"
                href="javascript:void(0);"
                onClick={() => this.handleShowMoreMissingSkillsToggle()}>
                Show More
              </a>
            </div>
          )
        } else {
          showMoreMissingSkillsBtn = (
            <div className="as-show-more-btn-container">
              <a
                aria-label="press tab to read mentioned skills"
                className="as-show-more-btn"
                href="javascript:void(0);"
                onClick={() => this.handleShowMoreMissingSkillsToggle()}>
                Show Less
              </a>
            </div>
          )
        }
      }

      return (
        <div className="as-skills-container">
          <div className="as-skills-list">
            <div className="as-all-lists-heading-wrapper">
              <div className="as-all-lists-heading-img-wrapper">
                <img
                  alt=""
                  src={`${process.env.APP_BASE_URL}dist/images/edit-screens/icon-missing.svg`}
                  className="as-all-lists-heading-img"
                />{' '}
              </div>
              <div className="as-all-lists-heading-text">
                <span
                  tabIndex={0}
                  aria-label={editModalAriaLabel['similar_skill']}>
                  Similar users are writing about these skills
                </span>
              </div>
            </div>
            {skillsList}
          </div>
          {showMoreMissingSkillsBtn}
          <div className="clearfix" />
        </div>
      )
    }
    return null
  }

  handleEmptyEverything() {
    const { currentSection } = this.props
    if (
      _.isEmpty(this.presentSkills) &&
      _.isEmpty(this.missingSkills) &&
      _.isEmpty(this.resumeSkills)
    ) {
      let noSkillsText = null
      if (currentSection == 'Summary') {
        noSkillsText = (
          <div className="as-no-skills-red-text">
            {' '}
            <span className="quotes">&quot; </span> You have not mentioned
            skills effectively in your {currentSection} section. Please refer to
            the following guidance for specialised tips on how to highlight
            skills in this section.
            <span className="quotes">&quot; </span>
          </div>
        )
      } else if (currentSection == 'Experience') {
        noSkillsText = (
          <div className="as-no-skills-red-text">
            {' '}
            <span className="quotes">&quot; </span> You have not mentioned
            skills effectively in this {currentSection}. Please refer to the
            following guidance for specialised tips on how to highlight skills
            in this section.
            <span className="quotes">&quot; </span>
          </div>
        )
      }

      return (
        <div className="as-skills-container">
          <span tabIndex={editModalAriaLabel['no_skill']}>{noSkillsText}</span>
          <div className="as-guidance-border" />
          <div className="as-no-skills-heading">
            <span tabIndex={0} aria-label={editModalAriaLabel['write_skill']}>
              How to write about skills?
            </span>
          </div>
          <div className="as-no-skills-text">
            <span
              tabIndex={0}
              aria-label={editModalAriaLabel['write_skill_ans']}>
              Writing about skills can be done in two ways, they can be stated
              directly or as phrases from which the reader can derive skills.
              For higher visibility, try using direct forms of skills so that
              recruiters can easily find you.
            </span>
          </div>
          <div className="as-guidance-border" />
          <div className="as-no-skills-heading">
            <span tabIndex={0} aria-label={editModalAriaLabel['what_skill']}>
              What skills to write about?
            </span>
          </div>
          {this.staticSkillsImage(currentSection)}
        </div>
      )
    }
  }

  renderLoading() {
    return (
      <div className="as-samples-loader-wrapper">
        <div className="mikepad-loading">
          <div className="binding" />
          <div className="pad">
            <div className="line line1" />
            <div className="line line2" />
            <div className="line line3" />
            <div className="line line4" />
            <div className="line line5" />
          </div>
          <div className="text">
            <span
              tabIndex={0}
              aria-label={editModalAriaLabel['loading_sample']}>
              Loading skills feedback
            </span>
          </div>
        </div>
      </div>
    )
  }

  renderLoadingError() {
    return (
      <div className="as-samples-loader-wrapper">
        <div className="mikepad-loading">
          <div className="as-api-error-img">
            <img
              alt=" error icon "
              src={`${process.env.APP_BASE_URL}dist/images/edit-screens/alert-icon.svg`}
              width="70px"
            />
          </div>
          <div className="text">
            <span
              tabIndex={0}
              aria-label={editModalAriaLabel['loading_sample_error']}>
              Some error occurred. Please try again later!
            </span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      currentSection,
      fetchingSkills,
      fetchedSkills,
      errorSkills,
      dataSkills,
      fetchingResumeGaps,
      fetchedResumeGaps,
      errorResumeGaps,
      hasResume,
    } = this.props

    let data = null
    let showHeading = true
    let showSubHeading = true
    let heading = null
    let subHeading = null

    if (currentSection == 'Headline') {
      showHeading = false
      showSubHeading = false
    }

    if (showHeading == true) {
      heading = <div className="as-guide-heading">Skills Guide</div>
    }

    if (showSubHeading == true) {
      subHeading = (
        <div
          className="as-guide-subtext"
          tabIndex={0}
          aria-label={editModalAriaLabel[currentSection]['skill_try']}>
          Try to include{' '}
          <strong>{this.sectionWiseCount[currentSection][0]}</strong> relevant
          skills to improve score
        </div>
      )
    }

    if (!this.state.showDynamic) {
      if (hasResume == 1) {
        if (fetchedResumeGaps && !fetchingResumeGaps && !errorResumeGaps) {
          data = (
            <div>
              {heading}
              <div className="as-sample-wrapper">
                {subHeading}
                {this.getPresentSkills()}
                {this.getResumeSkills()}
                {this.getMissingSkills()}
                {this.handleEmptyEverything()}
              </div>
            </div>
          )
        } else if (
          fetchedResumeGaps &&
          !fetchingResumeGaps &&
          errorResumeGaps
        ) {
          data = this.renderLoadingError()
        } else {
          data = this.renderLoading()
        }
      } else {
        data = (
          <div>
            {heading}
            <div className="as-sample-wrapper">
              {subHeading}
              {this.getPresentSkills()}
              {this.getResumeSkills()}
              {this.getMissingSkills()}
              {this.handleEmptyEverything()}
            </div>
          </div>
        )
      }
    } else if (fetchedSkills && !fetchingSkills && !errorSkills) {
      data = (
        <div>
          {heading}
          <div className="as-sample-wrapper">
            {subHeading}
            {this.getPresentSkills()}
            {this.getResumeSkills()}
            {this.getMissingSkills()}
            {this.handleEmptyEverything()}
          </div>
        </div>
      )
    } else if (fetchedSkills && !fetchingSkills && errorSkills) {
      data = this.renderLoadingError()
    } else {
      data = this.renderLoading()
    }

    return <div className="as-guide-container">{data}</div>
  }

  componentDidUpdate(prevProps, prevState) {}

  componentDidMount() {}

  componentWillUnmount() {
    const { unhighlightAll, setSelectedSkill } = this.props
    unhighlightAll()
    setSelectedSkill('')
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fetchingSkills: state.aspireEditDynamicData.fetchingSkills,
    fetchedSkills: state.aspireEditDynamicData.fetchedSkills,
    errorSkills: state.aspireEditDynamicData.errorSkills,
    dataSkills: state.aspireEditDynamicData.dataSkills,
    sectionWiseTextIntermediateSkills:
      state.aspireEditDynamicData.sectionWiseTextIntermediateSkills,
    fetchingResumeGaps: state.aspireResumeGapData.fetching,
    fetchedResumeGaps: state.aspireResumeGapData.fetched,
    errorResumeGaps: state.aspireResumeGapData.error,
    dataResumeGaps: state.aspireResumeGapData.data,
    hasResume: state.aspireFeedbackData.has_resume,
    loaderInput: state.aspireFeedbackData.mini_loader_text,
  }
}

export default connect(
  mapStateToProps,
  { updateEditDynamicDataState }
)(SkillsGuide)
