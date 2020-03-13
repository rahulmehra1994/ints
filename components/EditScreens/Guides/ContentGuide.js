import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateEditDynamicDataState } from '../../../actions/AspireEditDynamicData'
import { checkIfEmpty } from '../../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { sectionUnderscore } from '../../Constants/UniversalMapping'
import { editModalAriaLabel } from '../../Constants/AriaLabelText'

class ContentGuide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      callApi: false,
      showDynamic: false,
      selectedExampleCategoryIndex: 0,
    }
    this.sectionSamples = 0
    this.len = 0
    this.getPresentCategories = this.getPresentCategories.bind(this)
    this.getMissingCategories = this.getMissingCategories.bind(this)
    this.handlePresentCategoryClick = this.handlePresentCategoryClick.bind(this)
    this.handleExampleCategoryClick = this.handleExampleCategoryClick.bind(this)
    this.presentCategories = []
    this.missingCategories = []
    this.resumeCategories = []
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
      Summary: [
        'Job Role',
        'Company/Organisation',
        'Degree',
        'Concentration',
        'School/University',
        'Job Function',
        'Industry',
        'Certifications',
        'Competitions',
        'Awards',
        'Goal Based Keyword',
        'Position of Responsibility',
        'Club/Society',
      ],
      Experience: [
        'Job Role',
        'Job Function',
        'Company/Organisation',
        'Industry',
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
    this.missingCategoriesExamplesStatic = {
      Summary: [
        {
          categories: [
            'Job Role',
            'Company/Organisation',
            'Job Function',
            'Certifications',
          ],
          example:
            'With 8 years of experience as a <span class="category_job_role">Human Resources Manager</span> at  <span class="category_company">Goldman Sachs</span> including 2 years of experience in <span class="category_job_function">talent development</span> and <span class="category_job_function">recruiting</span>, I have recently obtained a <span class="category_certifications">Professional Certificate in Human Resources</span> and am aiming to open my own HR Consultancy for providing HR solutions to a diverse and wide set of companies.',
        },
        {
          categories: [
            'Position of Responsibility',
            'Club/Society',
            'Competitions',
            'Awards',
          ],
          example:
            'At College, I was the <span class="category_por">Chairman</span> of the <span class="category_club">Toastmasters Club</span>. As Chairman, I organized various training sessions and workshops for students. I had also participated in various international <span class="category_competitions">competitions</span> and had <span class="category_awards">won</span> the <span class="category_awards">1st prize</span> in the KPMG International Case <span class="category_competitions">Competition</span> twice in a row.',
        },
        {
          categories: ['Degree', 'Concentration', 'School/University'],
          example:
            'I am an <span class="category_degree">MBA</span> candidate focusing on <span class="category_concentration">Finance</span> and <span class="category_concentration">Strategy</span> at <span class="category_school">Harvard Business School</span> and have prior experience of 3 years in the same field. I have always been academically inclined and graduated Summa Cum Laude from <span class="category_school">Cornell University</span>.',
        },
        {
          categories: ['Goal Based Keyword', 'Industry', 'Contact Information'],
          example:
            'I am presently <span class="category_goal">looking for</span> opportunities in the <span class="category_industry">Education</span> Industry as I always felt that working for student development and enhancing students’ careers was my calling in life. I can be reached at <span class="category_contact">abc.jkl@gmail.com</span>.',
        },
      ],
      Experience: [
        {
          categories: [
            'Job Role',
            'Job Function',
            'Company/Organisation',
            'Industry',
          ],
          example:
            '<span class="category_job_role">Accounting Intern</span> - <span class="category_job_function">Accounts payable</span> | Accounts receivables | Auditing at <span class="category_company">Deloitte</span><br/>Mar 2016 - May 2016<br/>As part of summer internship at <span class="category_company">Deloitte</span>, I undertook the following task:<br/>- Performed meticulous <span class="category_job_function">accounting</span> for companies across <span class="category_industry">Healthcare</span> and <span class="category_industry">Technology</span> industries; processed and consolidated 100+ customer and vendor invoices, saving company close to $10,000 in interest payments',
        },
        {
          categories: [
            'Position of Responsibility',
            'Club/Society',
            'School/University',
            'Awards',
            'Competitions',
            'Goal Based Keyword',
          ],
          example:
            '<span class="category_por">President</span> - <span class="category_club">Marketing Club</span> at <span class="category_school">Harvard Business School</span><br/>Jan 1993 - Jan 1995<br/>While pursuing my MBA, I was President of Marketing Club and had <span class="category_awards">won</span> "Student of the Year D Award" as well as various international <span class="category_competitions">competitions</span>. I was majorly responsible for:<br/>- Organising 10+ competitions and seminars every year, <span class="category_goal">looking for</span> and inviting industry professionals to speak at events and getting maximum student turnout',
        },
        {
          categories: [
            'Degree',
            'Concentration',
            'School/University',
            'Certifications',
          ],
          example:
            '<span class="category_degree">MBA</span> <span class="category_concentration">Finance</span> Student at <span class="category_school">Harvard Business School</span><br/>Jan 2016 - Present<br/>Presently, I am pursuing <span class="category_degree">MBA</span> in <span class="category_concentration">Finance</span> and <span class="category_concentration">Strategy</span> at <span class="category_school">Harvard Business School</span>, graduating in 2017. Over the last 1 year, I have built skills in financial analysis and modeling, along with investment analysis and investment strategies.<br/>- Received <span class="category_certifications">CFA Certification</span> 2 months earlier; tutored batch of 100+ students in basic financial management concepts securing top of class results',
        },
      ],
    }
    this.missingCategoriesExamples = {}
    this.emptySection = false
    this.sendTrackingDataDebouncePresent = _.debounce(
      sendTrackingData,
      1000,
      true
    )
    this.sendTrackingDataDebounceMissing = _.debounce(
      sendTrackingData,
      1000,
      true
    )
    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 1000, true)
  }

  UNSAFE_componentWillMount() {
    const {
      fetchEditDynamicData,
      currentSection,
      currentIndex,
      fetchId,
      newSubSection,
      getDynamicEditFeedbackForModule,
      fetchingContent,
      fetchedContent,
      errorContent,
      dataContent,
      loaderInput,
      sectionWiseTextIntermediateContent,
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
      if (sectionWiseTextIntermediateContent == null) {
        // first call to dynamic data
        callApi = true
        showDynamic = true
      } else if (
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
        JSON.stringify(sectionWiseTextIntermediateContent[currentIndex])
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
        if (sectionWiseTextIntermediateContent == null) {
          // first call to dynamic data
          callApi = true
          showDynamic = true
        } else if (
          JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
          JSON.stringify(sectionWiseTextIntermediateContent[currentIndex])
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
      currentSection == 'Education' ||
      currentSection == 'Headline'
    ) {
      if (
        !(fetchingContent && !fetchedContent) &&
        callApi &&
        _.isEmpty(loaderInput)
      ) {
        getDynamicEditFeedbackForModule('content')
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

  prevSample() {
    const { currentSection, currentIndex } = this.props
    if (this.state.index > 0) {
      let jsonObjectForTracking = {
        eventLabel: 'prev_categories_btn',
        currentSection: currentSection,
        currentIndex: currentIndex,
        currentSampleIndex: this.state.index,
      }
      this.sendTrackingDataDebounce(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState(prevState => ({ index: prevState.index - 1 }))
      this.setState({ selectedExampleCategoryIndex: 0 })
    }
  }

  nextSample(len) {
    const { currentSection, currentIndex } = this.props
    if (this.state.index < len - 1) {
      let jsonObjectForTracking = {
        eventLabel: 'next_categories_btn',
        currentSection: currentSection,
        currentIndex: currentIndex,
        currentSampleIndex: this.state.index,
      }
      this.sendTrackingDataDebounce(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      this.setState(prevState => ({ index: prevState.index + 1 }))
      this.setState({ selectedExampleCategoryIndex: 0 })
    }
  }

  handleDotClick(index) {
    const { currentSection, currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'sample_dot_clicked',
      currentSection: currentSection,
      currentIndex: currentIndex,
      clickedSampleIndex: index,
    }
    this.sendTrackingDataDebounce(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.setState({ index: index })
  }

  getIndicatorDots(index, len) {
    let dots = []
    for (let i = 0; i < len; i++) {
      if (i == index) {
        dots.push(
          <div
            key={i}
            className="as-headline-suggestions-indicator-dots as-headline-suggestions-indicator-dots-light"
          />
        )
      } else {
        dots.push(
          <div
            key={i}
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
        <div className="as-headline-suggestions-btn as-headline-suggestions-btn-prev">
          <button
            aria-label={editModalAriaLabel['previous_sample']}
            onClick={() => this.prevSample()}>
            <span className="glyphicon glyphicon-chevron-left as-sample-arrow" />
          </button>
        </div>
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
        <div className="as-headline-suggestions-btn as-headline-suggestions-btn-next">
          <button
            onClick={() => this.nextSample(len)}
            aria-label={editModalAriaLabel['next_sample']}>
            <span className="glyphicon glyphicon-chevron-right as-sample-arrow" />
          </button>
        </div>
      )
    } else {
      return (
        <div className="as-headline-suggestions-btn as-headline-suggestions-btn-next disabled">
          <span className="glyphicon glyphicon-chevron-right as-sample-arrow" />
        </div>
      )
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

  getAriaLabelForPresentCategories() {
    const {
      sectionsEntitiesToHighlight,
      currentIndex,
      currentSection,
      dataContent,
    } = this.props
    let ariaLabel = []
    let categoryHighlightTextMapping = []

    if (
      !this.state.showDynamic &&
      sectionsEntitiesToHighlight[currentSection].hasOwnProperty('categories')
    ) {
      categoryHighlightTextMapping =
        sectionsEntitiesToHighlight[currentSection]['categories'][currentIndex]
    } else if (dataContent.hasOwnProperty('present_categories')) {
      categoryHighlightTextMapping = dataContent['present_categories']
    }

    _.map(categoryHighlightTextMapping, (value, key) => {
      let category = this.state.showDynamic
        ? this.cleanWord(value['name'])
        : key
      let highlightValue = this.state.showDynamic
        ? value['highlightValues']
        : value['text']
      let textArray = []
      let sentenceDetected = false
      textArray.push(` Detected ${category} category from`)
      _.map(highlightValue, (object, index) => {
        if (textArray.indexOf(object['text']) == -1) {
          if (object['entity'] != 'text') {
            textArray.push(object['entity'])
          } else if (!sentenceDetected) {
            sentenceDetected = true
            textArray.push('following keywords. First ')
          } else {
            textArray.push('next')
          }
          textArray.push(object['text'])
        }
      })
      ariaLabel[category] = textArray.join(', ')
    })

    return ariaLabel
  }

  getPresentCategories() {
    const {
      dataContent,
      selectedPresentCategory,
      currentSection,
      data,
      currentIndex,
    } = this.props
    this.presentCategories = []

    if (!this.state.showDynamic) {
      if (this.emptySection) {
        this.presentCategories = []
      } else {
        if (
          data.hasOwnProperty('categories') &&
          data['categories'].hasOwnProperty(currentIndex)
        ) {
          for (let category in data['categories'][currentIndex]) {
            this.presentCategories.push(category)
          }
        }
      }
    } else {
      if (this.emptySection) {
        this.presentCategories = []
      } else {
        if (dataContent.hasOwnProperty('present_categories')) {
          this.presentCategories = _.map(
            dataContent['present_categories'],
            function(presentCategoryObj) {
              return this.cleanWord(presentCategoryObj.name)
            },
            this
          )
        }
      }
    }
    let ariaLabelForCategories = this.getAriaLabelForPresentCategories()
    let noOfPresentCategories = _.size(this.presentCategories)
    if (noOfPresentCategories > 0) {
      let categoriesList = _.map(
        this.presentCategories,
        function(category) {
          let isSelected = false

          if (selectedPresentCategory == category) {
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
              key={category}
              onClick={() => this.handlePresentCategoryClick(category, type)}
              className={classNames('as-edit-screen-list-item-green', {
                active: isSelected,
              })}
              tabIndex={0}
              aria-label={
                isSelected
                  ? ariaLabelForCategories[category]
                  : `Click to know where you have mentioned ${category}`
              }>
              <span>{category}</span>
            </button>
          )
        },
        this
      )
      return (
        <div className="as-categories-container">
          <div className="as-categories-list">
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
                  editModalAriaLabel[currentSection]['mentioned_category']
                }>
                Click to see where you have mentioned these categories in your{' '}
                {currentSection}
              </div>
            </div>
            {categoriesList}
          </div>
        </div>
      )
    }

    return null
  }

  getMissingCategories() {
    const {
      dataContent,
      currentSection,
      data,
      newSubSection,
      categoriesMissing,
      currentIndex,
    } = this.props

    this.missingCategories = []

    // get present categories first
    this.getPresentCategories()

    if (!this.state.showDynamic) {
      if (this.emptySection) {
        this.missingCategories = this.newSectionCategoriesMissing[
          currentSection
        ]
      } else {
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
      }
    } else {
      if (this.emptySection) {
        this.missingCategories = this.newSectionCategoriesMissing[
          currentSection
        ]
      } else {
        if (dataContent.hasOwnProperty('missing_categories')) {
          this.missingCategories = dataContent['missing_categories']
          this.missingCategories = _.map(
            dataContent['missing_categories'],
            function(category) {
              return this.cleanWord(category)
            },
            this
          )
        }
      }
    }

    this.len = 0
    this.sectionSamples = []
    this.missingCategoriesExamples = _.extend(
      {},
      this.missingCategoriesExamplesStatic
    )
    this.missingCategoriesExamples[currentSection] = _.map(
      this.missingCategoriesExamples[currentSection],
      function(missingCategoriesExample) {
        let categories = missingCategoriesExample['categories']
        categories = _.filter(
          categories,
          function(category) {
            if (
              _.indexOf(this.presentCategories, category) == -1 &&
              !(_.indexOf(this.missingCategories, category) == -1)
            ) {
              return true
            }
            return false
          },
          this
        )

        return _.extend(
          {},
          {
            categories: categories,
            example: missingCategoriesExample['example'],
          }
        )
      },
      this
    )

    this.missingCategoriesExamples[currentSection] = _.filter(
      this.missingCategoriesExamples[currentSection],
      function(missingCategoriesExample) {
        if (_.size(missingCategoriesExample['categories']) > 0) {
          return true
        }
        return false
      },
      this
    )

    if (_.size(this.missingCategoriesExamples[currentSection]) > 0) {
      let sample = null

      this.sectionSamples = this.missingCategoriesExamples[currentSection]
      this.len = this.sectionSamples.length
      let example = null
      example = (
        <div
          tabIndex={0}
          aria-label={
            editModalAriaLabel[currentSection]['example'][this.state.index][
              'example'
            ]
          }
          className="as-category-example-fixed-text"
          dangerouslySetInnerHTML={{
            __html: this.sectionSamples[this.state.index]['example'],
          }}
        />
      )

      let i = 0
      let currentSelectedExampleCategoryIndex = this.state
        .selectedExampleCategoryIndex
      let categoryNamesList = _.map(
        this.sectionSamples[this.state.index]['categories'],
        function(category) {
          let isActive = false
          let currentCategoryIndex = i
          if (currentSelectedExampleCategoryIndex == currentCategoryIndex) {
            isActive = true
          }
          i++

          let type = null
          if (!this.state.showDynamic) {
            type = 'static'
          } else {
            type = 'dynamic'
          }

          return (
            <button
              key={category}
              className={classNames('as-example-categories-list-item', {
                active: isActive,
              })}
              tabIndex={0}
              aria-label={category}
              onClick={() =>
                this.handleExampleCategoryClick(
                  category,
                  currentCategoryIndex,
                  type
                )
              }>
              {category}
            </button>
          )
        },
        this
      )

      sample = (
        <div className="as-categories-example-outer-wrapper">
          {categoryNamesList}
          <div className="as-skills-example-heading">
            {' '}
            <span
              tabIndex={0}
              aria-label={`look for the above categories in the example`}>
              Example(s)
            </span>
          </div>
          <div className="as-sample-wrapper as-categories-example-wrapper">
            <div className="as-sample-example as-categories-example">
              <div className="as-categories-example-text" id="scrollItToTop">
                {example}
              </div>
              <div className="as-categories-example-bottom">
                <div className="as-sample-bottom-buttons-headline">
                  {this.getPreviousButton(this.state.index, this.len)}
                  {this.getIndicatorDots(this.state.index, this.len)}
                  {this.getNextButton(this.state.index, this.len)}
                </div>
                <div className="clearfix" />
              </div>
            </div>
          </div>
        </div>
      )

      return (
        <div className="as-categories-container">
          <div className="as-categories-list">
            <div className="as-all-lists-heading-wrapper">
              <div className="as-all-lists-heading-img-wrapper">
                <img
                  src={`${process.env.APP_BASE_URL}dist/images/edit-screens/icon-missing.svg`}
                  alt=""
                  className="as-all-lists-heading-img"
                />{' '}
              </div>
              <div
                className="as-all-lists-heading-text"
                tabIndex={0}
                aria-label={
                  editModalAriaLabel[currentSection]['include_category']
                }>
                Similar users are writing about these categories
              </div>
            </div>
          </div>
          {sample}
        </div>
      )
    }

    return null
  }

  handlePresentCategoryClick(category, type) {
    const {
      highlightEntityText,
      unhighlightAll,
      setSelectedPresentCategory,
      sectionWiseTextEditable,
      dataContent,
      currentIndex,
      currentSection,
    } = this.props
    unhighlightAll()

    let jsonObjectForTracking = {
      eventLabel: 'content_guide_present_category_click',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: 'content',
      skill: category,
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
      let categoryObj = _.find(
        dataContent['present_categories'],
        function(presentCategoryObj) {
          return this.cleanWord(presentCategoryObj.name) == category
        },
        this
      )

      let texts = categoryObj.highlightValues

      for (let entity in sectionWiseTextEditable[currentIndex]) {
        let val = sectionWiseTextEditable[currentIndex][entity]
        for (let i = 0; i < texts.length; i++) {
          if (val != '') {
            let substring = texts[i]['text']
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

    highlightEntityText('categories', category, type, finalTexts)
    setSelectedPresentCategory(category)
  }

  handleExampleCategoryClick(category, categoryIndex, type) {
    const { currentIndex, currentSection } = this.props
    this.setState({ selectedExampleCategoryIndex: categoryIndex })

    let jsonObjectForTracking = {
      eventLabel: 'content_guide_missing_category_click',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: 'content',
      skill: category,
      type: type,
    }

    this.sendTrackingDataDebounceMissing(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  renderLoading() {
    const { currentSection } = this.props

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
          <div className="text">Loading content feedback</div>
        </div>
      </div>
    )
  }

  renderLoadingError() {
    const { currentSection } = this.props

    return (
      <div className="as-samples-loader-wrapper">
        <div className="mikepad-loading">
          <div className="as-api-error-img">
            <img
              alt=""
              src={`${process.env.APP_BASE_URL}dist/images/edit-screens/alert-icon.svg`}
              width="70px"
            />
          </div>
          <div
            className="text"
            tabIndex={0}
            aria-label={editModalAriaLabel['loading_sample_error']}>
            Some error occurred. Please try again later!
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      currentSection,
      fetchingContent,
      fetchedContent,
      errorContent,
      dataContent,
    } = this.props

    let data = null

    if (!this.state.showDynamic) {
      data = (
        <div>
          <div className="as-guide-heading">Content Guide</div>
          <div
            className="as-guide-subtext"
            tabIndex={0}
            aria-label={editModalAriaLabel[currentSection]['content_try']}>
            Try to include{' '}
            <strong>{this.sectionWiseCount[currentSection]}</strong> relevant
            categories in this section
          </div>
          <div className="as-sample-wrapper">
            {this.getPresentCategories()}
            {this.getMissingCategories()}
          </div>
        </div>
      )
    } else if (fetchedContent && !fetchingContent && !errorContent) {
      data = (
        <div>
          <div className="as-guide-heading">Content Guide</div>
          <div
            className="as-guide-subtext"
            tabIndex={0}
            aria-label={editModalAriaLabel[currentSection]['content_try']}>
            Try to include{' '}
            <strong>{this.sectionWiseCount[currentSection]}</strong> relevant
            categories in this section
          </div>
          <div className="as-sample-wrapper">
            {this.getPresentCategories()}
            {this.getMissingCategories()}
          </div>
        </div>
      )
    } else if (fetchedContent && !fetchingContent && errorContent) {
      data = this.renderLoadingError()
    } else {
      data = this.renderLoading()
    }

    return <div className="as-guide-container">{data}</div>
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      currentSection,
      setSelectedPresentCategory,
      selectedPresentCategory,
    } = this.props
    if (
      _.size(this.missingCategoriesExamples[currentSection]) > 0 &&
      _.size(this.missingCategories) > 0
    ) {
      let category = this.missingCategoriesExamples[currentSection][
        this.state.index
      ]['categories'][this.state.selectedExampleCategoryIndex]
      let categorySelectorClass = this.categoryToIdMappingForExamples[category]
      $('.as-category-example-fixed-text span').removeClass('as-category-fixed')
      $('.as-category-example-fixed-text .' + categorySelectorClass).addClass(
        'as-category-fixed'
      )
    }
  }

  componentDidMount() {
    const {
      currentSection,
      setSelectedPresentCategory,
      selectedPresentCategory,
    } = this.props
    if (
      _.size(this.missingCategoriesExamples[currentSection]) > 0 &&
      _.size(this.missingCategories) > 0
    ) {
      let category = this.missingCategoriesExamples[currentSection][
        this.state.index
      ]['categories'][this.state.selectedExampleCategoryIndex]
      let categorySelectorClass = this.categoryToIdMappingForExamples[category]
      $('.as-category-example-fixed-text span').removeClass('as-category-fixed')
      $('.as-category-example-fixed-text .' + categorySelectorClass).addClass(
        'as-category-fixed'
      )
    }
  }

  componentWillUnmount() {
    const {
      unhighlightAll,
      setSelectedPresentCategory,
      updateEditDynamicDataState,
    } = this.props
    unhighlightAll()
    setSelectedPresentCategory('')
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fetchingContent: state.aspireEditDynamicData.fetchingContent,
    fetchedContent: state.aspireEditDynamicData.fetchedContent,
    errorContent: state.aspireEditDynamicData.errorContent,
    dataContent: state.aspireEditDynamicData.dataContent,
    sectionWiseTextIntermediateContent:
      state.aspireEditDynamicData.sectionWiseTextIntermediateContent,
    loaderInput: state.aspireFeedbackData.mini_loader_text,
  }
}

export default connect(
  mapStateToProps,
  { updateEditDynamicDataState }
)(ContentGuide)
