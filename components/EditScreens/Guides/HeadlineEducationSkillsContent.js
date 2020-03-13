import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateEditDynamicDataState } from '../../../actions/AspireEditDynamicData'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { editModalAriaLabel } from '../../Constants/AriaLabelText'

class HeadlineEducationSkillsContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      isEdited: false,
    }
    this.missingCategories = []
    this.sectionWiseCount = {
      Headline: '2-4',
      Summary: '5-8',
      Experience: '2-4',
      Education: '3-5',
      'Volunteer Experience': '2-3',
      Skills: '1-2',
      Projects: '1-2',
      Publications: '1-2',
    }
    this.minRelevantCategories = {
      Headline: 4,
      Summary: 8,
      Experience: 4,
      Education: 5,
    }
    this.newSectionCategoriesMissing = {
      Headline: ['School/University', 'Degree', 'Job Function', 'Job Role'],
      Education: [
        'School/University',
        'Concentration',
        'Degree',
        'Club/Society',
        'Position of Responsibility',
      ],
    }
    this.categoryToIdMappingForExamples = {
      'Job Role': 'category_job_role',
      'Company/Organisation': 'category_company',
      Degree: 'category_degree',
      Concentration: 'category_concentration',
      'School/University': 'category_school',
      'Job Function': 'category_job_function',
      Industry: 'category_industry',
      Certifications: 'category_certifications',
      Competitions: 'category_competitions',
      Awards: 'category_awards',
      'Goal Based Keyword': 'category_goal',
      'Position of Responsibility': 'category_por',
      'Club/Society': 'category_club',
      'Contact Information': 'category_contact',
      Coursework: 'category_coursework',
      Hobbies: 'category_hobbies',
      Languages: 'category_languages',
      Scholarships: 'category_scholarships',
      'Volunteer Experiences': 'category_volunteer',
    }
    this.missingSkills = []
    this.getMissingSkillsHelper = this.getMissingSkillsHelper.bind(this)
    this.getMissingSkills = this.getMissingSkills.bind(this)
    this.getMissingCategoriesHelper = this.getMissingCategoriesHelper.bind(this)
    this.getMissingCategories = this.getMissingCategories.bind(this)
    this.sendTrackingDataDebounceMissingCategory = _.debounce(
      sendTrackingData,
      1000,
      true
    )
    this.sendTrackingDataDebounceMissingSkill = _.debounce(
      sendTrackingData,
      1000,
      true
    )
  }

  UNSAFE_componentWillMount() {
    const { isEdited } = this.props
    this.setState({ isEdited: isEdited })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { updateEditSection } = nextProps
    if (updateEditSection == true) {
      this.setState({ isEdited: false })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
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

  getPresentCategories() {
    const { data, currentIndex } = this.props
    this.presentCategories = []
    if (
      data.hasOwnProperty('categories') &&
      data['categories'].hasOwnProperty(currentIndex)
    ) {
      for (let category in data['categories'][currentIndex]) {
        this.presentCategories.push(category)
      }
    }

    return null
  }

  getMissingCategoriesHelper() {
    const {
      currentSection,
      data,
      newSubSection,
      categoriesMissing,
      currentIndex,
    } = this.props
    this.missingCategories = []
    // get present categories first
    this.getPresentCategories()

    let catMissing = categoriesMissing[currentIndex]
    if (
      this.minRelevantCategories.hasOwnProperty(currentSection) &&
      _.size(this.presentCategories) >=
        this.minRelevantCategories[currentSection]
    ) {
      catMissing = []
    }

    if (newSubSection == true) {
      if (this.newSectionCategoriesMissing.hasOwnProperty(currentSection)) {
        catMissing = this.newSectionCategoriesMissing[currentSection]
      } else {
        catMissing = categoriesMissing[0]
      }
    }

    if (!_.isUndefined(catMissing)) {
      for (let i in catMissing) {
        this.missingCategories.push(catMissing[i])
      }
    }

    let noOfAbsentCategories = _.size(this.missingCategories)
    if (noOfAbsentCategories > 0) {
      let categoriesList = _.map(
        this.missingCategories,
        function(category) {
          let actualCategoryName = category

          return (
            <div
              key={actualCategoryName}
              onClick={() =>
                this.handleMissingCategoryClick(actualCategoryName, 'static')
              }
              tabIndex={0}
              aria-label={actualCategoryName}
              className="as-edit-screen-list-item-gray">
              {actualCategoryName}
            </div>
          )
        },
        this
      )

      return categoriesList
    }

    return []
  }

  getMissingSkillsHelper() {
    const {
      selectedSkill,
      currentSection,
      staticSkillsData,
      currentIndex,
      sectionsPerSkill,
      derivedSkills,
    } = this.props
    this.missingSkills = []
    this.len = 0
    this.sectionSamples = []
    let data = staticSkillsData
    let skillsLimit = 10

    let relMissSkills = []
    if (
      data.hasOwnProperty('relevant_skills_missing') &&
      data['relevant_skills_missing'].hasOwnProperty(currentIndex)
    ) {
      relMissSkills = [].concat(data['relevant_skills_missing'][currentIndex])
    }

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
      for (var i in relMissSkills) {
        let otherSections = {}
        let phrases = []
        var skill = relMissSkills[i]['word']
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
                for (var k in sectionsPerSkill[skill]['sections'][sec][
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

      for (var skill in possessedSkills) {
        this.missingSkills.push(skill)
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
          for (var k in otherSkills[typeVar][score]) {
            if (count == skillsLimit) {
              break
            }
            var skill = otherSkills[typeVar][score][k]
            this.missingSkills.push(skill)
            count += 1
          }
        }
      }
    }

    this.len = _.size(this.missingSkills)

    if (this.len > 0) {
      let skillsList = _.map(
        this.missingSkills,
        function(skill) {
          return (
            <div
              key={skill}
              onClick={() => this.handleMissingSkillClick(skill, 'static')}
              tabIndex={0}
              aria-label={skill}
              className="as-edit-screen-list-item-gray">
              {skill}
            </div>
          )
        },
        this
      )

      return skillsList
    }

    return []
  }

  getMissingSkills() {
    const { currentSection } = this.props
    if (currentSection == 'Headline') {
      let missingSkills = this.getMissingSkillsHelper()
      let headingText = null
      if (_.size(this.missingSkills) > 0) {
        return (
          <div className="as-edit-card-1-headline-education">
            <div className="as-headline-categories-skills-wrapper">
              <div className="as-all-lists-heading-wrapper">
                <div className="as-all-lists-heading-img-wrapper">
                  <img
                    src={`${process.env.APP_BASE_URL}dist/images/edit-screens/skills-icon-blue.svg`}
                    alt=""
                    className="as-all-lists-heading-img"
                  />{' '}
                </div>
                <div className="as-all-lists-heading-text">
                  <span
                    tabIndex={0}
                    aria-label={editModalAriaLabel[currentSection]['skill']}>
                    Similar users are writing about these skills
                  </span>
                </div>
              </div>
              {missingSkills}
            </div>
          </div>
        )
      }
    }
    return null
  }

  getMissingCategories() {
    const { currentSection } = this.props
    if (currentSection == 'Headline') {
      let missingCategories = this.getMissingCategoriesHelper()
      let headingText = null
      if (_.size(this.missingCategories) > 0) {
        return (
          <div className="as-edit-card-1-headline-education">
            <div className="as-all-lists-heading-wrapper">
              <div className="as-all-lists-heading-img-wrapper">
                <img
                  src={`${process.env.APP_BASE_URL}dist/images/edit-screens/content-icon-blue.svg`}
                  alt=""
                  className="as-all-lists-heading-img"
                />{' '}
              </div>
              <div className="as-all-lists-heading-text">
                <span
                  tabIndex={0}
                  aria-label={editModalAriaLabel[currentSection]['category']}>
                  Similar users are writing about these categories
                </span>
              </div>
            </div>
            {missingCategories}
          </div>
        )
      }
    } else if (currentSection == 'Education') {
      let missingCategories = this.getMissingCategoriesHelper()
      if (_.size(this.missingCategories) > 0) {
        return (
          <div className="as-edit-card-1-headline-education">
            <div className="as-headline-categories-skills-wrapper">
              <div className="as-all-lists-heading-wrapper">
                <div className="as-all-lists-heading-img-wrapper">
                  <img
                    src={`${process.env.APP_BASE_URL}dist/images/edit-screens/content-icon-blue.svg`}
                    alt=""
                    className="as-all-lists-heading-img"
                  />{' '}
                </div>
                <div
                  className="as-all-lists-heading-text"
                  tabIndex={0}
                  aria-label={editModalAriaLabel[currentSection]['category']}>
                  Similar users are writing about these categories
                </div>
              </div>
              {missingCategories}
            </div>
          </div>
        )
      }
    }
    return null
  }

  renderLoading() {
    return (
      <div className="as-samples-loader-wrapper as-small-samples-loader-wrapper">
        <div className="as-samples-loader-inner-wrapper">
          <div className="as-samples-loader-text">
            Loading skills and content feedback
          </div>
          <div className="as-samples-loader">
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
          </div>
        </div>
      </div>
    )
  }

  renderLoadingError() {
    return (
      <div className="as-samples-loader-wrapper as-small-samples-loader-wrapper">
        <div className="mikepad-loading">
          <div className="as-api-error-img">
            <img
              src={`${process.env.APP_BASE_URL}dist/images/edit-screens/alert-icon.svg`}
              width="70px"
            />
          </div>
          <div className="text">
            Some error occurred. Please try again later!
          </div>
        </div>
      </div>
    )
  }

  handleMissingCategoryClick(category, type) {
    const { currentIndex, currentSection } = this.props

    let jsonObjectForTracking = {
      eventLabel: 'content_guide_missing_category_click',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: 'content',
      skill: category,
      type: type,
    }

    this.sendTrackingDataDebounceMissingCategory(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
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
    this.sendTrackingDataDebounceMissingSkill(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  render() {
    const { module } = this.props

    let data = null

    if (module == 'content') {
      data = this.getMissingCategories()
    } else if (module == 'skills') {
      data = this.getMissingSkills()
    }

    return <div>{data}</div>
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
)(HeadlineEducationSkillsContent)
