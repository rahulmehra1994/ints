import React, { Component } from 'react'
import { connect } from 'react-redux'
import InfoScreens from '../InfoScreens'
import $ from 'jquery'
import _ from 'underscore'
import classNames from 'classnames'
import { Pie } from 'react-chartjs-2'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import {
  infoScreenConnectLabel,
  feedbackAriaLabel,
  contentSectionAriaLabel,
} from '../Constants/AriaLabelText'
import { sectionUnderscore } from '../Constants/UniversalMapping'
import {
  divisionSubHeadlineText,
  languageContent,
  impactContent,
  feedbackContent,
} from '../Constants/DetailedFeedbackText'
import { InfoComponent } from '../HelperComponent/FeedbackBlock'

const minRelevantCategories = {
  Headline: 4,
  Summary: 8,
  Experience: 4,
  Education: 5,
}

const sectionNavs = {
  Headline: ['content', 'skills', 'visibility'],
  Summary: ['content', 'skills', 'visibility'],
  Experience: ['content', 'skills', 'visibility'],
  Education: ['content', 'visibility'],
}

const modsMap = {
  content: 'Content',
  skills: 'Skills',
  visibility: 'Profile Visibility',
}

const moduleToNavMapping = {
  skills: 'skills',
  seo: 'visibility',
  categories: 'content',
  impact: 'content',
  language: 'content',
}

const symbolMap = {
  green: <span className="fa fa-check" aria-hidden="true" />,
  yellow: <span className="fa fa-exclamation" aria-hidden="true" />,
  red: <span className="fa fa-times" aria-hidden="true" />,
}

const wordCountFeedback = {
  Headline: [
    '100+',
    'Optimise your 120 characters by including keywords that highlight your skills for the selected functional area.',
  ],
  Summary: [
    '100+',
    'Keep the length of your summary section between 100-300 words. Give people a 360º view of yourself as a person as well as a professional.',
  ],
  Experience: [
    '50+',
    'Utilize description section of experience to highlight achievements and relevant expertise in at least 50 words.',
  ],
}

const minWordCounts = {
  Summary: 100,
  Experience: 50,
}

class Sections extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedModule: '',
      selectedValue: '',
      hoveredModule: '',
      hoveredValue: '',
      selectedLanguageImpact: '',
      showInfoScreen: false,
      activeInfoScreen: '',
    }
    this.sectionEmpty = false
    this.emptyDescription = false
    this.renderModuleFeedback = {
      categories: true,
      impact: true,
      language: true,
      skills: true,
      seo: true,
    }
    this.idsObj = null
    this.prevSelectedValue = ''
    this.prevSelectedModule = ''
    this.firstKeywordButton = {
      categories: '',
      skills: '',
      seo: '',
    }
    this.tabIndexLanguageImpact = {
      action_oriented: 11,
      specifics: 11,
      buzzwords: 11,
      verb_overusage: 11,
      tense: 11,
      narrative_voice: 11,
    }
    this.dynamicTabIndexing = 11
    this.showInfoModal = this.showInfoModal.bind(this)
    this.hideInfoModal = this.hideInfoModal.bind(this)
    this.handleGraySkillsSeoTracking = this.handleGraySkillsSeoTracking.bind(
      this
    )
    this.handleResumeSkillsTracking = this.handleResumeSkillsTracking.bind(this)
    this.handleOtherSkillsTracking = this.handleOtherSkillsTracking.bind(this)
    this.handleGrayCategoriesTracking = this.handleGrayCategoriesTracking.bind(
      this
    )
    this.handleResumeCategoriesTracking = this.handleResumeCategoriesTracking.bind(
      this
    )
    this.sendTrackingDataDebounceInfoModal = _.debounce(
      sendTrackingData,
      5000,
      true
    )
    this.sendTrackingDataDebounceOtherClicks = _.debounce(
      sendTrackingData,
      5000,
      true
    )
    this.sendTrackingDataDebounceResumeClicks = _.debounce(
      sendTrackingData,
      5000,
      true
    )
    this.sendTrackingDataDebounceGraySkillsSeo = _.debounce(
      sendTrackingData,
      5000,
      true
    )
    this.sendTrackingDataDebounceGrayCategories = _.debounce(
      sendTrackingData,
      5000,
      true
    )
  }

  UNSAFE_componentWillMount() {
    const {
      ui,
      sectionWiseTextStatic,
      sectionWiseText,
      currentSection,
    } = this.props
    const currentIndex = ui.currentIndex
    this.sectionEmpty = this.isSectionEmpty(
      currentSection,
      sectionWiseText[sectionUnderscore[currentSection]]
    )
    this.emptyDescription = this.checkEmptyDescription(
      sectionWiseTextStatic,
      currentIndex
    )
    this.toRenderModuleFeedback(this.props)
    this.getFirstModuleKeywords(this.props)
    let defaultSelectedValue = this.getDefaultSelectedValue(
      sectionNavs[currentSection][0],
      this.props
    )
    this.idsObj = defaultSelectedValue['idsObj']
    let selectedLanguageImpact =
      defaultSelectedValue['module'] == 'language' ||
      defaultSelectedValue['module'] == 'impact'
        ? defaultSelectedValue['value']
        : ''

    let sectionNav = moduleToNavMapping[defaultSelectedValue['module']]
    let countOfAvailableClick = this.getNoOfModules(sectionNav)

    this.setState({
      hoveredValue: '',
      hoveredModule: '',
      selectedValue: defaultSelectedValue['value'],
      selectedModule: defaultSelectedValue['module'],
      selectedLanguageImpact: selectedLanguageImpact,
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      ui,
      sectionWiseTextStatic,
      sectionWiseText,
      currentSection,
      currentIndex,
      activeNavIndex,
      update_detailed_state,
    } = nextProps

    if (
      currentSection != this.props.currentSection ||
      currentIndex != this.props.currentIndex ||
      update_detailed_state !== this.props.update_detailed_state
    ) {
      this.sectionEmpty = this.isSectionEmpty(
        currentSection,
        sectionWiseText[sectionUnderscore[currentSection]]
      )
      this.emptyDescription = this.checkEmptyDescription(
        sectionWiseTextStatic,
        currentIndex
      )
      this.toRenderModuleFeedback(nextProps)
      this.getFirstModuleKeywords(nextProps)
      let defaultSelectedValue = this.getDefaultSelectedValue(
        sectionNavs[currentSection][activeNavIndex],
        nextProps
      )
      this.prevSelectedValue = ''
      this.prevSelectedModule = ''
      this.idsObj = defaultSelectedValue['idsObj']
      let selectedLanguageImpact =
        defaultSelectedValue['module'] == 'language' ||
        defaultSelectedValue['module'] == 'impact'
          ? defaultSelectedValue['value']
          : ''

      this.setState({
        hoveredValue: '',
        hoveredModule: '',
        selectedValue: defaultSelectedValue['value'],
        selectedModule: defaultSelectedValue['module'],
        selectedLanguageImpact: selectedLanguageImpact,
      })
    }
  }

  componentDidUpdate() {
    this.handleSelection()
    this.getLanguageImpactTabIndex()
  }

  componentDidMount() {
    this.handleSelection()
    this.getLanguageImpactTabIndex()
  }

  toRenderModuleFeedback(props) {
    const { currentIndex, currentSection, feedback } = props
    let renderHeadLineLanguage = true

    if (currentSection == 'Headline') {
      let params = ['buzzwords', 'verb_overusage', 'tense', 'narrative_voice']
      params = _.filter(params, function(value) {
        return (
          feedback['language'].hasOwnProperty(value) &&
          !_.isEmpty(feedback['language'][value]) &&
          feedback['language'][value].hasOwnProperty(currentIndex)
        )
      })

      renderHeadLineLanguage = false

      for (let key in params) {
        if (
          feedback['language'][params[key]][currentIndex]['color'] != 'green'
        ) {
          renderHeadLineLanguage = true
          break
        }
      }
    }

    this.renderModuleFeedback = {
      categories: !(
        this.sectionEmpty === true ||
        _.isUndefined(feedback['categories']) ||
        _.isUndefined(feedback['categories']['score']) ||
        !feedback['categories']['score'].hasOwnProperty(currentIndex) ||
        !feedback['categories']['score'][currentIndex].hasOwnProperty(
          'color'
        ) ||
        _.isNull(feedback['categories']['score'][currentIndex]['color'])
      ),
      impact: !(
        this.sectionEmpty === true ||
        this.emptyDescription == true ||
        _.isUndefined(feedback['impact']) ||
        _.isUndefined(feedback['impact']['score']) ||
        !feedback['impact']['score'].hasOwnProperty(currentIndex) ||
        !feedback['impact']['score'][currentIndex].hasOwnProperty('color') ||
        _.isNull(feedback['impact']['score'][currentIndex]['color'])
      ),
      language:
        !(
          this.sectionEmpty === true ||
          this.emptyDescription === true ||
          _.isUndefined(feedback['language']) ||
          _.isUndefined(feedback['language']['score']) ||
          _.isUndefined(feedback['language']['score'][currentIndex]) ||
          !feedback['language']['score'][currentIndex].hasOwnProperty(
            'color'
          ) ||
          _.isNull(feedback['language']['score'][currentIndex]['color'])
        ) && renderHeadLineLanguage,
      skills: !(
        this.sectionEmpty === true ||
        _.isUndefined(feedback['skills']) ||
        _.isUndefined(feedback['skills']['score']) ||
        !feedback['skills']['score'].hasOwnProperty(currentIndex) ||
        !feedback['skills']['score'][currentIndex].hasOwnProperty('color') ||
        _.isNull(feedback['skills']['score'][currentIndex]['color'])
      ),
      seo: !(
        this.sectionEmpty === true ||
        _.isUndefined(feedback['seo']) ||
        _.isUndefined(feedback['seo']['score']) ||
        !feedback['seo']['score'].hasOwnProperty(currentIndex) ||
        !feedback['seo']['score'][currentIndex].hasOwnProperty('color') ||
        _.isNull(feedback['seo']['score'][currentIndex]['color'])
      ),
    }
  }

  requireWordCountFeedback(feedback, currentIndex) {
    return (
      !_.isUndefined(feedback['word_count_class']) &&
      !_.isUndefined(feedback['word_count_class'][currentIndex]) &&
      feedback['word_count_class'][currentIndex]['color'] == 'red'
    )
  }

  checkWordCountLow(feedback, currentSection, currentIndex) {
    return (
      !_.isUndefined(feedback['word_count_class']) &&
      !_.isUndefined(feedback['word_count_class'][currentIndex]) &&
      feedback['word_count_class'][currentIndex]['color'] == 'red' &&
      feedback['word_count_class'][currentIndex]['count'] <
        minWordCounts[currentSection]
    )
  }

  checkEmptyDescription(sectionWiseTextEditable, currentIndex) {
    return (
      sectionWiseTextEditable.hasOwnProperty(currentIndex) &&
      sectionWiseTextEditable[currentIndex].hasOwnProperty('text') &&
      _.isEmpty(sectionWiseTextEditable[currentIndex]['text'])
    )
  }

  renderCountFeedback(
    feedback,
    currentSection,
    currentIndex,
    has_api,
    has_pdf,
    tabIndex
  ) {
    if (
      this.requireWordCountFeedback(feedback, currentIndex) === true &&
      this.sectionEmpty === false
    ) {
      let style = {}

      if (wordCountFeedback[currentSection][0].length > 3) {
        style = { width: '87px', fontSize: '29px' }
      } else {
        style = { width: '87px' }
      }

      if (
        currentSection == 'Summary' &&
        feedback['word_count_class'][currentIndex]['count'] > 300
      ) {
        return (
          <div className="ps-detail-num">
            <div
              className="ps-num"
              style={style}
              tabIndex={tabIndex}
              aria-label={
                'Keep the length of your summary section between 100-300 words. Give people a 360º view of yourself as a person as well as a professional. '
              }>
              {' '}
              300-{' '}
            </div>
            <div className="ps-content">
              <p>
                {' '}
                Keep the length of your summary section between 100-300 words.
                Give people a 360º view of yourself as a person as well as a
                professional.{' '}
              </p>
            </div>
          </div>
        )
      }

      return (
        <div className="ps-detail-num">
          <div
            className="ps-num"
            style={style}
            tabIndex={tabIndex}
            aria-label={wordCountFeedback[currentSection][1]}>
            {' '}
            {wordCountFeedback[currentSection][0]}{' '}
          </div>
          <div className="ps-content">
            <p> {wordCountFeedback[currentSection][1]} </p>
          </div>
        </div>
      )
    } else if (
      !_.isUndefined(feedback['experience_count']) &&
      feedback['experience_count'] == 'red'
    ) {
      if (has_api === 1 && has_pdf !== 1) {
        return (
          <div className="ps-detail-num">
            <div
              className="ps-content"
              tabIndex={tabIndex}
              aria-label={
                'You have not mentioned your current experience. Consider including experience, school or positions of responsibility as a current experience.'
              }>
              <p>
                {' '}
                You have not mentioned your current experience. Consider
                including experience, school or positions of responsibility as a
                current experience.{' '}
              </p>
            </div>
          </div>
        )
      } else {
        return (
          <div className="ps-detail-num">
            <div
              className="ps-num"
              tabIndex={tabIndex}
              aria-label={
                'Make sure that you include at least 3 experiences in this section, one current experience and two past experiences.'
              }>
              {' '}
              2+{' '}
            </div>
            <div className="ps-content">
              <p>
                {' '}
                Make sure that you include at least 3 experiences in this
                section, one current experience and two past experiences.{' '}
              </p>
            </div>
          </div>
        )
      }
    } else {
      return null
    }
  }

  renderSectionBulletFeedback(feedback, currentSection, currentIndex) {
    const { communityCustomisations } = this.props
    let northWesternCustomisation = !_.isNull(communityCustomisations)
      ? _.contains(communityCustomisations, 'remove_bullet_point_suggestion')
      : false
    if (
      !northWesternCustomisation &&
      !_.isUndefined(feedback['sub_section_bullet_feedback']) &&
      !_.isUndefined(feedback['sub_section_bullet_feedback'][currentIndex]) &&
      feedback['sub_section_bullet_feedback'][currentIndex]['color_feedback'] ==
        'red'
    ) {
      return (
        <div className="ps-detail-orange">
          <div className="ps-content-2">
            <p>
              {' '}
              <strong> BULLET FORM :</strong> The {currentSection} section is
              better written in form of bullets.{' '}
            </p>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  getLanguageImpactAriaLabel(
    feedback,
    params,
    currentIndex,
    currentSection,
    moduleSelected
  ) {
    let ariaLabel = {}
    _.mapObject(params, (value, key) => {
      let label = []
      if (feedback[moduleSelected][value][currentIndex]['color'] != 'green') {
        label.push(
          contentSectionAriaLabel[moduleSelected][currentSection]['red'][value]
        )
        _.map(
          feedback[moduleSelected][value][currentIndex]['ids'],
          (value, key) => {
            for (let id = 0; id < value.length; id++) {
              if (label.indexOf(value[id].word) === -1) {
                label.push(`Keyword highlighted ${value[id].word}`)
                if (!_.isEmpty(value[id].suggestions)) {
                  label.push('Suggestions you can incorporate are ')
                  value[id].suggestions.forEach(element => {
                    label.push(element)
                  })
                }
              }
            }
          }
        )
      } else {
        label.push(
          contentSectionAriaLabel[moduleSelected][currentSection]['green'][
            value
          ]
        )
      }
      ariaLabel[value] = label.join(', ')
    })
    return ariaLabel
  }

  getLanguageImpactTabIndex() {
    let selectedMatched = false
    let selectedValue = this.state.selectedLanguageImpact
    for (var selected in this.tabIndexLanguageImpact) {
      if (selected == selectedValue) {
        selectedMatched = true
        this.tabIndexLanguageImpact[selected] = this.dynamicTabIndexing
      } else if (selectedMatched) {
        this.tabIndexLanguageImpact[selected] = this.dynamicTabIndexing + 1
      } else {
        this.tabIndexLanguageImpact[selected] = this.dynamicTabIndexing
      }
    }
  }

  renderLanguageFeedback(feedback, currentSection, currentIndex) {
    if (!this.renderModuleFeedback['language']) {
      return null
    }

    let params = ['buzzwords', 'verb_overusage', 'tense', 'narrative_voice']
    params = _.filter(params, function(value) {
      return (
        feedback['language'].hasOwnProperty(value) &&
        !_.isEmpty(feedback['language'][value]) &&
        feedback['language'][value].hasOwnProperty(currentIndex)
      )
    })
    let languageTabIndex = this.tabIndexLanguageImpact[params[0]]
    let ariaLabel = this.getLanguageImpactAriaLabel(
      feedback,
      params,
      currentIndex,
      currentSection,
      'language'
    )
    let borderclass = []

    if (params.length == 1) {
      borderclass.push('border-r-tl border-r-bl')
    } else {
      borderclass.push('border-r-tl')
      for (let i = 1; i < params.length - 1; i++) {
        borderclass.push('')
      }
      borderclass.push('border-r-bl')
    }
    let display = 'none'
    if (params.indexOf(this.state.selectedLanguageImpact) == -1) {
      display = 'block'
    }
    params = _.map(params, (value, key) => (
      <div key={'tab-' + key} className="tab section-language-tab">
        <button
          tabIndex={this.tabIndexLanguageImpact[value]}
          aria-label={
            value == this.state.selectedLanguageImpact
              ? ariaLabel[value]
              : `Click to know about ${value}`
          }
          className={classNames(
            borderclass[key],
            {
              active: value == this.state.selectedLanguageImpact,
            },
            { 'arrow_box-left': value == this.state.selectedLanguageImpact }
          )}
          id={'tab-' + key}
          name="tab-group-1"
          data-value={value}
          data-module="language"
          onMouseOver={e => this.handleMouseOver(e)}
          onMouseOut={e => this.handleMouseOut(e)}
          onClick={() =>
            this.handleUpdateText(
              value,
              'language',
              feedback['language'][value][currentIndex],
              currentSection
            )
          }>
          <span
            className={
              'profile-status-icon circel-' +
              feedback['language'][value][currentIndex]['color']
            }>
            {symbolMap[feedback['language'][value][currentIndex]['color']]}{' '}
          </span>{' '}
          {languageContent['title'][value]}
        </button>
        <div
          className="content"
          style={{
            display:
              value == this.state.selectedLanguageImpact ? 'block' : display,
          }}>
          <p>
            <strong>
              {
                languageContent['content_section_score'][currentSection][
                  feedback['language'][value][currentIndex]['color']
                ][value]['title']
              }
            </strong>
          </p>
          <p>
            {
              languageContent['content_section_score'][currentSection][
                feedback['language'][value][currentIndex]['color']
              ][value]['text']
            }
          </p>
        </div>
      </div>
    ))

    if (_.isEmpty(params)) {
      return null
    }

    let pieScore = this.getModifiedScoreForPie(
      feedback,
      'language',
      currentIndex
    )
    let bodyText =
      feedbackContent[feedback['language']['score'][currentIndex]['color']][
        'body'
      ]['language']
    let bodyLabel =
      feedbackAriaLabel[feedback['language']['score'][currentIndex]['color']][
        'body'
      ]['language']

    if (feedback['language']['score'][currentIndex]['score'] > 99) {
      bodyText = <p>You have no language gaps in this section.</p>
      bodyLabel = 'You have no language gaps in this section.'
    }

    let remainingPieScore = 100 - parseFloat(pieScore)
    let greenColorCode = '#46a74d'
    let yellowColorCode = '#f89d2f'
    let redColorCode = '#ef4f3e'
    let selectedColorCode = null

    if (feedback['language']['score'][currentIndex]['color'] === 'red') {
      selectedColorCode = redColorCode
    } else if (
      feedback['language']['score'][currentIndex]['color'] === 'yellow'
    ) {
      selectedColorCode = yellowColorCode
    } else if (
      feedback['language']['score'][currentIndex]['color'] === 'green'
    ) {
      selectedColorCode = greenColorCode
    }

    let dataOptions = {
      datasets: [
        {
          data: [pieScore, remainingPieScore],
          backgroundColor: [selectedColorCode, '#E8E8E8'],
          borderColor: [selectedColorCode, '#E8E8E8'],
          borderWidth: 1,
        },
      ],
      labels: [],
    }

    let options = {
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
      },
      tooltips: {
        enabled: false,
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      responsive: false,
    }

    return (
      <div key="language">
        <div className="graphandtext">
          <div className="graph-box pull-left">
            <Pie data={dataOptions} options={options} width={35} height={35} />
          </div>
          <div className="g-text">
            <span
              tabIndex={languageTabIndex}
              aria-label={
                'LANGUAGE ' +
                feedbackAriaLabel[
                  feedback['language']['score'][currentIndex]['color']
                ]['title'] +
                ' ' +
                bodyLabel
              }>
              {' '}
              LANGUAGE{' '}
            </span>
          </div>
          <div className="as-info-icon">
            <a
              role="button"
              tabIndex={languageTabIndex}
              aria-label={infoScreenConnectLabel['language']}
              onClick={() => this.showInfoModal('language')}>
              <img
                className="as-info-icon-img"
                alt=""
                src={`${process.env.APP_BASE_URL}dist/images/as-info-icon.svg`}
              />
              <span className="as-info-text"> Info</span>
            </a>
          </div>
        </div>
        <div className="padding-l-40">
          {
            feedbackContent[
              feedback['language']['score'][currentIndex]['color']
            ]['title']
          }
          <div className="tabs">{params}</div>
        </div>
        <div className="clearfix" />
      </div>
    )
  }

  renderImpactFeedback(feedback, currentSection, currentIndex) {
    if (!this.renderModuleFeedback['impact']) {
      return null
    }

    let params = ['action_oriented', 'specifics']
    let tabIndex = this.dynamicTabIndexing

    params = _.filter(params, function(value) {
      return feedback['impact'].hasOwnProperty(value)
    })

    let ariaLabel = this.getLanguageImpactAriaLabel(
      feedback,
      params,
      currentIndex,
      currentSection,
      'impact'
    )

    let borderclass = []

    if (params.length == 1) {
      borderclass.push('border-r-tl border-r-bl')
    } else {
      borderclass.push('border-r-tl')
      for (let i = 1; i < params.length - 1; i++) {
        borderclass.push('')
      }
      borderclass.push('border-r-bl')
    }
    let display = 'none'
    if (params.indexOf(this.state.selectedLanguageImpact) == -1) {
      display = 'block'
    }

    params = _.map(params, (value, key) => (
      <div key={'tab-impact-' + key} className="tab section-impact-tab">
        <button
          className={classNames(
            borderclass[key],
            {
              active: value == this.state.selectedLanguageImpact,
            },
            { 'arrow_box-left': value == this.state.selectedLanguageImpact }
          )}
          id={'tab-impact-' + key}
          tabIndex={this.tabIndexLanguageImpact[value]}
          aria-label={
            value == this.state.selectedLanguageImpact
              ? ariaLabel[value]
              : `Click to know about ${value}`
          }
          name="tab-impact-group-1"
          data-value={value}
          data-module="impact"
          onMouseOver={e => this.handleMouseOver(e)}
          onMouseOut={e => this.handleMouseOut(e)}
          onClick={() =>
            this.handleUpdateText(
              value,
              'impact',
              feedback['impact'][value][currentIndex],
              currentSection
            )
          }>
          <span
            className={
              'profile-status-icon circel-' +
              feedback['impact'][value + '_color'][currentIndex]['color']
            }>
            {
              symbolMap[
                feedback['impact'][value + '_color'][currentIndex]['color']
              ]
            }{' '}
          </span>{' '}
          {impactContent['title'][value]}
        </button>
        <div
          className="content feedback-impact-content"
          style={{
            display:
              value == this.state.selectedLanguageImpact ? 'block' : display,
          }}>
          <p>
            <strong>
              {' '}
              {
                impactContent['content_section_score'][currentSection][
                  feedback['impact'][value + '_color'][currentIndex]['color']
                ][value]['title']
              }{' '}
            </strong>
          </p>
          <p>
            {
              impactContent['content_section_score'][currentSection][
                feedback['impact'][value + '_color'][currentIndex]['color']
              ][value]['text']
            }
          </p>
        </div>
      </div>
    ))

    let pieScore = this.getModifiedScoreForPie(feedback, 'impact', currentIndex)
    let remainingPieScore = 100 - parseFloat(pieScore)
    let greenColorCode = '#46a74d'
    let yellowColorCode = '#f89d2f'
    let redColorCode = '#ef4f3e'
    let selectedColorCode = null

    if (feedback['impact']['score'][currentIndex]['color'] === 'red') {
      selectedColorCode = redColorCode
    } else if (
      feedback['impact']['score'][currentIndex]['color'] === 'yellow'
    ) {
      selectedColorCode = yellowColorCode
    } else if (feedback['impact']['score'][currentIndex]['color'] === 'green') {
      selectedColorCode = greenColorCode
    }

    let dataOptions = {
      datasets: [
        {
          data: [pieScore, remainingPieScore],
          backgroundColor: [selectedColorCode, '#E8E8E8'],
          borderColor: [selectedColorCode, '#E8E8E8'],
          borderWidth: 1,
        },
      ],
    }

    let options = {
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
      },
      tooltips: {
        enabled: false,
      },
      responsive: false,
    }

    return (
      <div key="impact">
        <div className="graphandtext">
          <div className="graph-box pull-left">
            <Pie data={dataOptions} options={options} width={35} height={35} />
          </div>
          <div className="g-text">
            <span
              tabIndex={tabIndex}
              aria-label={
                'IMPACT ' +
                feedbackAriaLabel[
                  feedback['impact']['score'][currentIndex]['color']
                ]['title'] +
                ' ' +
                feedbackAriaLabel[
                  feedback['impact']['score'][currentIndex]['color']
                ]['body']['impact']
              }>
              {' '}
              IMPACT{' '}
            </span>
          </div>
          <div className="as-info-icon">
            <a
              role="button"
              tabIndex={tabIndex}
              aria-label={infoScreenConnectLabel['impact']}
              onClick={() => this.showInfoModal('impact')}>
              <img
                className="as-info-icon-img"
                alt=""
                src={`${process.env.APP_BASE_URL}dist/images/as-info-icon.svg`}
              />
              <span className="as-info-text"> Info</span>
            </a>
          </div>
        </div>
        <div className="padding-l-40">
          {
            feedbackContent[feedback['impact']['score'][currentIndex]['color']][
              'title'
            ]
          }

          <div className="tabs">{params}</div>
        </div>
        <div className="clearfix" />
      </div>
    )
  }

  getCategoryAriaLabel(categoriesFeedback) {
    var categoryLabelMap = {}
    _.mapObject(categoriesFeedback, (value, key) => {
      let label = []
      let endText = ` are detected as ${key}`
      _.map(value['ids'], (value, key) => {
        for (let id = 0; id < value.length; id++) {
          if (label.indexOf(value[id].word) === -1) {
            label.push(value[id].word)
          }
        }
      })
      label.push(endText)
      categoryLabelMap[key] = label.join(', ')
    })
    return categoryLabelMap
  }

  renderCategoriesFeedback(feedback, currentSection, currentIndex, tabIndex) {
    if (!this.renderModuleFeedback['categories']) {
      return null
    }
    let firstActiveKey = this.state.selectedValue
    let green = null
    let categoriesPresent = []

    if (
      feedback['categories'].hasOwnProperty('categories') &&
      !_.isEmpty(feedback['categories']['categories'][currentIndex])
    ) {
      let keyTabIndex = {}
      let selectedMatched = false
      _.map(
        feedback['categories']['categories'][currentIndex],
        (value, key) => {
          if (key == this.state.selectedValue) {
            keyTabIndex[key] = tabIndex
            selectedMatched = true
            this.dynamicTabIndexing = 12
          } else if (!selectedMatched) {
            keyTabIndex[key] = tabIndex
          } else {
            keyTabIndex[key] = 12
          }
        }
      )
      if (!selectedMatched) {
        this.dynamicTabIndexing = 11
      }
      categoriesPresent = _.map(
        feedback['categories']['categories'][currentIndex],
        (value, key) => (
          <li
            key={key}
            className={this.state.selectedValue === key ? 'active' : ''}>
            <a
              tabIndex={keyTabIndex[key]}
              aria-label={
                this.state.selectedValue === key
                  ? ` ${key}. tab to know where you have used`
                  : ` ${key}. Click to know where you have used`
              }
              data-value={key}
              data-module="categories"
              role="button"
              onClick={() =>
                this.handleUpdateText(key, 'categories', value, currentSection)
              }>
              {key}
            </a>
          </li>
        )
      )

      if (!_.isEmpty(categoriesPresent)) {
        green = (
          <div>
            <div
              className="keyword-heading"
              tabIndex={tabIndex}
              aria-label={divisionSubHeadlineText['categories']['present']}>
              <span>{divisionSubHeadlineText['categories']['present']}</span>
            </div>
            <ul className="tab-keywords keywords-green">{categoriesPresent}</ul>
          </div>
        )
      }
    }

    let categoriesMissing = []
    if (feedback.hasOwnProperty('categories_missing')) {
      categoriesMissing = feedback['categories_missing']
    }

    let categoriesAbsent = []
    let categoriesAbsentBlock = null
    let catMissing = categoriesMissing[currentIndex]

    if (
      minRelevantCategories.hasOwnProperty(currentSection) &&
      _.size(categoriesPresent) >= minRelevantCategories[currentSection]
    ) {
      catMissing = []
    }

    if (!_.isUndefined(catMissing)) {
      for (let i in catMissing) {
        categoriesAbsent.push(
          <li key={i}>
            <a
              tabIndex={tabIndex + 1}
              aria-label={catMissing[i]}
              onClick={() =>
                this.handleGrayCategoriesTracking(
                  'content',
                  'categories',
                  catMissing[i]
                )
              }
              role="button">
              {' '}
              {catMissing[i]}{' '}
            </a>
          </li>
        )
      }

      if (!_.isEmpty(categoriesAbsent)) {
        categoriesAbsentBlock = (
          <div>
            <div className="keyword-heading">
              <span
                tabIndex={tabIndex + 1}
                aria-label={divisionSubHeadlineText['categories']['missing']}>
                <span>{divisionSubHeadlineText['categories']['missing']}</span>
              </span>
            </div>
            <ul className="tab-keywords keywords-gray">{categoriesAbsent}</ul>
          </div>
        )
      }
    }

    let resumeCategories = []
    if (feedback.hasOwnProperty('categories_in_resume_not_in_linkedin')) {
      resumeCategories = feedback['categories_in_resume_not_in_linkedin']
    }

    let categoriesInResumeNotInLinkedin = []
    let categoriesInResumeNotInLinkedinBlock = null
    if (
      !_.isUndefined(resumeCategories) ||
      !_.isEmpty(resumeCategories) ||
      !_.isUndefined(resumeCategories[currentIndex])
    ) {
      for (let i in resumeCategories[currentIndex]) {
        categoriesInResumeNotInLinkedin.push(
          <li key={i}>
            <a
              role="button"
              tabIndex={tabIndex + 1}
              aria-label={resumeCategories[currentIndex][i]}
              onClick={() =>
                this.handleResumeCategoriesTracking(
                  'content',
                  'categories',
                  resumeCategories[currentIndex][i]
                )
              }>
              {resumeCategories[currentIndex][i]}
            </a>
          </li>
        )
      }

      if (!_.isEmpty(categoriesInResumeNotInLinkedin)) {
        categoriesInResumeNotInLinkedinBlock = (
          <div>
            <div className="keyword-heading">
              <span
                tabIndex={tabIndex + 1}
                aria-label={divisionSubHeadlineText['categories']['resume']}>
                <span>{divisionSubHeadlineText['categories']['resume']} </span>
              </span>
            </div>
            <ul className="tab-keywords keywords-blue">
              {categoriesInResumeNotInLinkedin}
            </ul>
          </div>
        )
      }
    }

    let pieScore = this.getModifiedScoreForPie(
      feedback,
      'categories',
      currentIndex
    )
    let remainingPieScore = 100 - parseFloat(pieScore)
    let greenColorCode = '#46a74d'
    let yellowColorCode = '#f89d2f'
    let redColorCode = '#ef4f3e'
    let selectedColorCode = null

    if (feedback['categories']['score'][currentIndex]['color'] === 'red') {
      selectedColorCode = redColorCode
    } else if (
      feedback['categories']['score'][currentIndex]['color'] === 'yellow'
    ) {
      selectedColorCode = yellowColorCode
    } else if (
      feedback['categories']['score'][currentIndex]['color'] === 'green'
    ) {
      selectedColorCode = greenColorCode
    }

    let dataOptions = {
      datasets: [
        {
          data: [pieScore, remainingPieScore],
          backgroundColor: [selectedColorCode, '#E8E8E8'],
          borderColor: [selectedColorCode, '#E8E8E8'],
          borderWidth: 1,
        },
      ],
    }

    let options = {
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
      },
      tooltips: {
        enabled: false,
      },
      responsive: false,
    }

    if (feedback['categories']['score'][currentIndex]['color'] == 'green') {
      categoriesInResumeNotInLinkedinBlock = null
      categoriesAbsentBlock = null
    }

    return (
      <div>
        <div className="graphandtext">
          <div className="graph-box pull-left">
            <Pie data={dataOptions} options={options} width={35} height={35} />
          </div>
          <div className="g-text">
            <span
              tabIndex={tabIndex}
              aria-label={
                'INFORMATION CATEGORIES ' +
                feedbackAriaLabel[
                  feedback['categories']['score'][currentIndex]['color']
                ]['title'] +
                ' ' +
                feedbackAriaLabel[
                  feedback['categories']['score'][currentIndex]['color']
                ]['body']['categories']
              }>
              {' '}
              INFORMATION CATEGORIES{' '}
            </span>
          </div>
          <div className="as-info-icon">
            <a
              role="button"
              tabIndex={tabIndex}
              aria-label={infoScreenConnectLabel['information_category']}
              onClick={() => this.showInfoModal('categories')}>
              <img
                className="as-info-icon-img"
                alt=""
                src={`${process.env.APP_BASE_URL}dist/images/as-info-icon.svg`}
              />
              <span className="as-info-text"> Info</span>
            </a>
          </div>
        </div>
        <div className="padding-l-40">
          {
            feedbackContent[
              feedback['categories']['score'][currentIndex]['color']
            ]['title']
          }
          {green}
          {categoriesInResumeNotInLinkedinBlock}
          {categoriesAbsentBlock}
        </div>
      </div>
    )
  }

  renderSkillsFeedback(
    feedback,
    sectionsPerSkill,
    currentSection,
    currentIndex,
    resumeSkillsInLinkedin,
    resumeSkillsNotInLinkedin,
    derivedSkills,
    tabIndex
  ) {
    if (!this.renderModuleFeedback['skills']) {
      return null
    }

    let data = feedback['skills']
    let skillsPresentBlock = []
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
        for (var k in data['relevant_skills_present'][currentIndex][skill]) {
          if (
            prioritizeSkills[
              data['relevant_skills_present'][currentIndex][skill][k]['type']
            ].hasOwnProperty(
              data['relevant_skills_present'][currentIndex][skill][k]['score']
            )
          ) {
            prioritizeSkills[
              data['relevant_skills_present'][currentIndex][skill][k]['type']
            ][
              data['relevant_skills_present'][currentIndex][skill][k]['score']
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
        var skill = greenKeywords[skillIndex]['skill']
        let skillType = greenKeywords[skillIndex]['type']
        let flag = true
        if (currentSection == 'Headline') {
          flag = false
          for (let k in data['relevant_skills_present'][currentIndex][skill]) {
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

        let isResumeSkill = _.contains(
          resumeSkillsInLinkedin,
          skill.toLowerCase()
        )

        if (isResumeSkill == true) {
          skillsPresent.push(skill)
        } else {
          skillsPresent.push(skill)
        }
      }
      let selectedSkillKey = 0
      for (let index = 0; index < skillsPresent.length; index++) {
        if (skillsPresent[index] === this.state.selectedValue) {
          selectedSkillKey = index
        }
      }

      if (!_.isEmpty(skillsPresent)) {
        skillsPresent = _.map(skillsPresent, (value, key) => (
          <li
            key={key}
            className={this.state.selectedValue === value ? 'active' : ''}>
            {' '}
            <a
              data-value={value}
              data-module="skills"
              tabIndex={key <= selectedSkillKey ? tabIndex : 12}
              aria-label={value}
              role="button"
              onClick={() =>
                this.handleUpdateText(
                  value,
                  'skills',
                  feedback['skills']['relevant_skills_present'][currentIndex][
                    value
                  ],
                  currentSection
                )
              }>
              {' '}
              {value}{' '}
            </a>
          </li>
        ))
        skillsPresentBlock = (
          <div>
            <div className="keyword-heading">
              <span
                tabIndex={tabIndex}
                aria-label={divisionSubHeadlineText['skills']['present']}>
                <span>{divisionSubHeadlineText['skills']['present']}</span>
              </span>
            </div>
            <ul className="tab-keywords keywords-green">{skillsPresent}</ul>
          </div>
        )
      }
    }

    let skillsMissingResumeBlock = null
    let skillsMissingOtherBlock = null
    let skillsMissingResume = []
    let skillsMissingOther = []
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
          resumeSkillsNotInLinkedin,
          skill.toLowerCase()
        )

        if (isResumeSkill) {
          skillsMissingResume.push(
            <li key={skill}>
              <a
                role="button"
                tabIndex={12}
                aria-label={skill}
                onClick={() =>
                  this.handleResumeSkillsTracking('skills', 'skills', skill)
                }>
                {skill}
              </a>
            </li>
          )
        } else {
          skillsMissingOther.push(
            <li key={skill}>
              <a
                role="button"
                tabIndex={12}
                aria-label={skill}
                onClick={() =>
                  this.handleOtherSkillsTracking('skills', 'skills', skill)
                }>
                {' '}
                {skill}{' '}
              </a>
            </li>
          )
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
              resumeSkillsNotInLinkedin,
              skill.toLowerCase()
            )
            if (isResumeSkill) {
              skillsMissingResume.push(
                <li key={typeVar + score + k + ''}>
                  <a
                    role="button"
                    tabIndex={12}
                    aria-label={skill}
                    onClick={() =>
                      this.handleResumeSkillsTracking('skills', 'skills', skill)
                    }>
                    {skill}
                  </a>
                </li>
              )
            } else {
              skillsMissingOther.push(
                <li key={typeVar + score + k + ''}>
                  <a
                    role="button"
                    tabIndex={12}
                    aria-label={skill}
                    onClick={() =>
                      this.handleOtherSkillsTracking('skills', 'skills', skill)
                    }>
                    {' '}
                    {skill}{' '}
                  </a>
                </li>
              )
            }
            count += 1
          }
        }
      }
    }

    if (!_.isEmpty(skillsMissingResume)) {
      skillsMissingResumeBlock = (
        <div>
          <div className="keyword-heading">
            <span
              tabIndex={12}
              aria-label={divisionSubHeadlineText['skills']['resume']}>
              <span>{divisionSubHeadlineText['skills']['resume']}</span>
            </span>
          </div>
          <ul className="tab-keywords keywords-blue">{skillsMissingResume}</ul>
        </div>
      )
    }

    if (!_.isEmpty(skillsMissingOther)) {
      skillsMissingOtherBlock = (
        <div>
          <div className="keyword-heading">
            <span
              tabIndex={12}
              aria-label={divisionSubHeadlineText['skills']['missing']}>
              <span>{divisionSubHeadlineText['skills']['missing']}</span>
            </span>
          </div>
          <ul className="tab-keywords keywords-gray">{skillsMissingOther}</ul>
        </div>
      )
    }

    let bodyText = (
      <p>Try to include skill-set relevant to your desired Job Function</p>
    )
    let bodyLabel = `Try to include skill-set relevant to your desired Job Function`
    let pieScore = this.getModifiedScoreForPie(feedback, 'skills', currentIndex)
    let remainingPieScore = 100 - parseFloat(pieScore)
    let greenColorCode = '#46a74d'
    let yellowColorCode = '#f89d2f'
    let redColorCode = '#ef4f3e'
    let selectedColorCode = null

    if (feedback['skills']['score'][currentIndex]['color'] === 'red') {
      selectedColorCode = redColorCode
    } else if (
      feedback['skills']['score'][currentIndex]['color'] === 'yellow'
    ) {
      selectedColorCode = yellowColorCode
    } else if (feedback['skills']['score'][currentIndex]['color'] === 'green') {
      selectedColorCode = greenColorCode
    }

    let dataOptions = {
      datasets: [
        {
          data: [pieScore, remainingPieScore],
          backgroundColor: [selectedColorCode, '#E8E8E8'],
          borderColor: [selectedColorCode, '#E8E8E8'],
          borderWidth: 1,
        },
      ],
    }

    let options = {
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
      },
      tooltips: {
        enabled: false,
      },
      responsive: false,
    }

    return (
      <div>
        <div className="graphandtext">
          <div className="graph-box pull-left">
            <Pie data={dataOptions} options={options} width={35} height={35} />
          </div>
          <div className="g-text">
            <span
              tabIndex={tabIndex}
              aria-label={`SKILL INCLUSION ${
                feedbackAriaLabel[
                  feedback['skills']['score'][currentIndex]['color']
                ]['title']
              } ${bodyLabel}`}>
              {' '}
              SKILL INCLUSION{' '}
            </span>
          </div>
          <div className="as-info-icon">
            <a
              role="button"
              tabIndex={tabIndex}
              aria-label={infoScreenConnectLabel['skills']}
              onClick={() => this.showInfoModal('skills')}>
              <img
                className="as-info-icon-img"
                alt=""
                src={`${process.env.APP_BASE_URL}dist/images/as-info-icon.svg`}
              />
              <span className="as-info-text"> Info</span>
            </a>
          </div>
        </div>
        <div className="padding-l-40">
          {
            feedbackContent[feedback['skills']['score'][currentIndex]['color']][
              'title'
            ]
          }
          {skillsPresentBlock}
          {skillsMissingResumeBlock}
          {skillsMissingOtherBlock}
        </div>
      </div>
    )
  }

  renderSeoFeedback(feedback, currentSection, currentIndex, tabIndex) {
    if (!this.renderModuleFeedback['seo']) {
      return null
    }
    let keywordsRelevant = []

    if (
      feedback['seo'].hasOwnProperty('keywords') &&
      !_.isEmpty(feedback['seo']['keywords'][currentIndex]['relevant'])
    ) {
      let selectedSeoKey = {}
      let selectedSeoMatch = false

      for (var value in feedback['seo']['keywords'][currentIndex]['relevant']) {
        if (
          feedback['seo']['keywords'][currentIndex]['relevant'].hasOwnProperty(
            this.state.selectedValue
          )
        ) {
          if (value == this.state.selectedValue || !selectedSeoMatch) {
            selectedSeoMatch = true
            selectedSeoKey[value] = 11
          } else {
            selectedSeoKey[value] = 12
          }
        } else {
          selectedSeoKey[value] = 11
        }
      }

      keywordsRelevant = _.map(
        feedback['seo']['keywords'][currentIndex]['relevant'],
        (value, key) =>
          _.isEmpty(key) ? null : (
            <li
              key={key}
              className={this.state.selectedValue === key ? 'active' : ''}>
              <a
                data-value={key}
                data-module="seo"
                tabIndex={selectedSeoKey[key]}
                aria-label={key}
                role="button"
                onClick={() =>
                  this.handleUpdateText(
                    key,
                    'seo',
                    feedback['seo']['keywords'][currentIndex]['relevant'][key],
                    currentSection
                  )
                }>
                {' '}
                {key}{' '}
              </a>
            </li>
          )
      )
    }

    let relevant = null

    if (!_.isEmpty(keywordsRelevant)) {
      relevant = (
        <div>
          <div className="keyword-heading">
            <span
              tabIndex={tabIndex}
              aria-label={divisionSubHeadlineText['visibility']['present']}>
              {divisionSubHeadlineText['visibility']['present']}
            </span>
          </div>
          <ul className="tab-keywords keywords-green">{keywordsRelevant}</ul>
        </div>
      )
    }

    let keywordsIrrelevant = []

    if (feedback['seo'].hasOwnProperty('keywords')) {
      keywordsIrrelevant = _.map(
        feedback['seo']['keywords'][currentIndex]['irrelevant'],
        (value, key) => (
          <li key={key}>
            <a
              tabIndex={12}
              aria-label={key}
              role="button"
              onClick={() =>
                this.handleGraySkillsSeoTracking('visibility', 'seo', key)
              }>
              {' '}
              {key}{' '}
            </a>
          </li>
        )
      )
    }

    let irrelevant = null

    if (!_.isEmpty(keywordsIrrelevant)) {
      irrelevant = (
        <div>
          <div className="keyword-heading">
            <span
              tabIndex={12}
              aria-label={divisionSubHeadlineText['visibility']['missing']}>
              {divisionSubHeadlineText['visibility']['missing']}
            </span>
          </div>
          <ul className="tab-keywords keywords-gray">{keywordsIrrelevant}</ul>
        </div>
      )
    }

    let bodyText =
      feedbackContent[feedback['seo']['score'][currentIndex]['color']]['body'][
        'seo'
      ]

    let bodyLabel =
      feedbackAriaLabel[feedback['seo']['score'][currentIndex]['color']][
        'body'
      ]['seo']
    if (
      _.isEmpty(irrelevant) &&
      feedback['seo']['score'][currentIndex]['color'] == 'red'
    ) {
      bodyText = (
        <p>
          Try to include more relevant keywords. Check the edit mode to see
          which skills and categories you can add.
        </p>
      )
      bodyLabel = `Try to include more relevant keywords. Check the edit mode to see which skills and categories you can add`
    }

    let pieScore = this.getModifiedScoreForPie(feedback, 'seo', currentIndex)
    let remainingPieScore = 100 - parseFloat(pieScore)
    let greenColorCode = '#46a74d'
    let yellowColorCode = '#f89d2f'
    let redColorCode = '#ef4f3e'
    let selectedColorCode = null

    if (feedback['seo']['score'][currentIndex]['color'] === 'red') {
      selectedColorCode = redColorCode
    } else if (feedback['seo']['score'][currentIndex]['color'] === 'yellow') {
      selectedColorCode = yellowColorCode
    } else if (feedback['seo']['score'][currentIndex]['color'] === 'green') {
      selectedColorCode = greenColorCode
    }

    let dataOptions = {
      datasets: [
        {
          data: [pieScore, remainingPieScore],
          backgroundColor: [selectedColorCode, '#E8E8E8'],
          borderColor: [selectedColorCode, '#E8E8E8'],
          borderWidth: 1,
        },
      ],
    }

    let options = {
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
      },
      tooltips: {
        enabled: false,
      },
      responsive: false,
    }

    return (
      <div>
        <div className="graphandtext">
          <div className="graph-box pull-left">
            <Pie data={dataOptions} options={options} width={35} height={35} />
          </div>
          <div className="g-text">
            <span
              tabIndex={tabIndex}
              aria-label={`SEO KEYWORDS ${
                feedbackAriaLabel[
                  feedback['seo']['score'][currentIndex]['color']
                ]['title']
              } ${bodyLabel}`}>
              {' '}
              SEO KEYWORDS{' '}
            </span>
          </div>
          <div className="as-info-icon">
            <a
              role="button"
              tabIndex={tabIndex}
              aria-label={infoScreenConnectLabel['seo']}
              onClick={() => this.showInfoModal('seo')}>
              <img
                className="as-info-icon-img"
                alt=""
                src={`${process.env.APP_BASE_URL}dist/images/as-info-icon.svg`}
              />
              <span className="as-info-text"> Info</span>
            </a>
          </div>
        </div>
        <div className="padding-l-40">
          {
            feedbackContent[feedback['seo']['score'][currentIndex]['color']][
              'title'
            ]
          }
          {relevant}
          {irrelevant}
        </div>
      </div>
    )
  }

  showInfoModal(module) {
    this.sendTrackingDataDebounceInfoModal(
      'event',
      'aspire_info_screen_open',
      'click',
      module
    )
    this.setState({ showInfoScreen: true, activeInfoScreen: module })
  }

  hideInfoModal() {
    sendTrackingData(
      'event',
      'aspire_info_screen_close',
      'click',
      this.state.activeInfoScreen
    )
    this.setState({ showInfoScreen: false, activeInfoScreen: '' })
  }

  getModifiedScoreForPie(feedback, subsection, currentIndex) {
    let sectionScore = feedback[subsection]['score'][currentIndex]['score']

    if (feedback[subsection]['score'][currentIndex]['score'] <= 7) {
      sectionScore = 7
    } else if (feedback[subsection]['score'][currentIndex]['score'] >= 93) {
      sectionScore = 93
    }

    return sectionScore
  }

  handleResumeSkillsTracking(sectionNav, module, value) {
    let countOfAvailableClick = this.getNoOfModules(sectionNav)
    let jsonObjectForTracking = {
      eventLabel: 'feedback_panel_nav_resume_skills_info',
      currentSection: this.props.currentSection,
      currentIndex: this.props.currentIndex,
      sectionNav: sectionNav,
      selectedModule: module,
      selectedValue: value,
      countOfAvailableClick: countOfAvailableClick,
    }
    this.sendTrackingDataDebounceResumeClicks(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  handleOtherSkillsTracking(sectionNav, module, value) {
    let countOfAvailableClick = this.getNoOfModules(sectionNav)
    let jsonObjectForTracking = {
      eventLabel: 'feedback_panel_nav_other_skills_info',
      currentSection: this.props.currentSection,
      currentIndex: this.props.currentIndex,
      sectionNav: sectionNav,
      selectedModule: module,
      selectedValue: value,
      countOfAvailableClick: countOfAvailableClick,
    }
    this.sendTrackingDataDebounceOtherClicks(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  handleGraySkillsSeoTracking(sectionNav, module, value) {
    let countOfAvailableClick = this.getNoOfModules(sectionNav)
    let jsonObjectForTracking = {
      eventLabel: 'feedback_panel_nav_gray_skills_seo_info',
      currentSection: this.props.currentSection,
      currentIndex: this.props.currentIndex,
      sectionNav: sectionNav,
      selectedModule: module,
      selectedValue: value,
      countOfAvailableClick: countOfAvailableClick,
    }
    this.sendTrackingDataDebounceGraySkillsSeo(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  handleGrayCategoriesTracking(sectionNav, module, value) {
    let countOfAvailableClick = this.getNoOfModules(sectionNav)
    let jsonObjectForTracking = {
      eventLabel: 'feedback_panel_nav_gray_categories_info',
      currentSection: this.props.currentSection,
      currentIndex: this.props.currentIndex,
      sectionNav: sectionNav,
      selectedModule: module,
      selectedValue: value,
      countOfAvailableClick: countOfAvailableClick,
    }
    this.sendTrackingDataDebounceGrayCategories(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  handleResumeCategoriesTracking(sectionNav, module, value) {
    let countOfAvailableClick = this.getNoOfModules(sectionNav)
    let jsonObjectForTracking = {
      eventLabel: 'feedback_panel_nav_resume_categories_info',
      currentSection: this.props.currentSection,
      currentIndex: this.props.currentIndex,
      sectionNav: sectionNav,
      selectedModule: module,
      selectedValue: value,
      countOfAvailableClick: countOfAvailableClick,
    }
    this.sendTrackingDataDebounceGrayCategories(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  handleUpdateText(value, module, idsObj, currentSection) {
    let sectionNav = moduleToNavMapping[module]
    let countOfAvailableClick = this.getNoOfModules(sectionNav)

    if (module == 'language' || module == 'impact') {
      this.setState({ selectedLanguageImpact: value })
    } else {
      this.setState({ selectedLanguageImpact: '' })
    }

    if (!_.isUndefined(idsObj) && !_.isNull(idsObj)) {
      this.idsObj = idsObj
      this.setState({ selectedValue: value, selectedModule: module })
    } else {
      this.props.onUpdateText(value, -1)
    }
  }

  handleSelection() {
    const { currentSection } = this.props
    let value = this.state.selectedValue
    let module = this.state.selectedModule
    let idsObj = this.idsObj

    if (
      !_.isUndefined(idsObj) &&
      !_.isNull(idsObj) &&
      !(this.prevSelectedValue == value && this.prevSelectedModule == module)
    ) {
      this.prevSelectedModule = module
      this.prevSelectedValue = value

      if (module == 'language') {
        let selector = 'div.tab div.' + value + ' a'
        let obj = $(selector)

        if (obj.hasOwnProperty(0)) {
          obj[0].click()
        }

        if (value == 'buzzwords') {
          if (
            _.isUndefined(idsObj['pos_present']) ||
            idsObj['pos_present'] == false
          ) {
            this.props.onUpdateText(
              idsObj['ids'],
              1,
              currentSection,
              'highlight-red'
            )
          } else {
            this.props.onUpdateText(
              idsObj['ids'],
              2,
              currentSection,
              'highlight-red'
            )
          }
        } else if (value == 'verb_overusage') {
          if (
            _.isUndefined(idsObj['pos_present']) ||
            idsObj['pos_present'] == false
          ) {
            this.props.onUpdateText(
              idsObj['ids'],
              1,
              currentSection,
              'highlight-red'
            )
          } else {
            this.props.onUpdateText(
              idsObj['ids'],
              2,
              currentSection,
              'highlight-red'
            )
          }
        } else if (value == 'narrative_voice' || value == 'tense') {
          this.props.onUpdateText(
            idsObj['ids'],
            3,
            currentSection,
            'highlight-red'
          )
        }
      } else if (module == 'impact') {
        let selector = 'div.tab div.' + value + ' a'
        let obj = $(selector)

        if (obj.hasOwnProperty(0)) {
          obj[0].click()
        }

        if (value == 'specifics') {
          if (
            _.isUndefined(idsObj['pos_present']) ||
            idsObj['pos_present'] == false
          ) {
            this.props.onUpdateText(idsObj['ids'], 1, currentSection)
          } else {
            this.props.onUpdateText(idsObj['ids'], 2, currentSection)
          }
        } else if (value == 'action_oriented') {
          let divIds = []
          let weakObj = {}

          for (let divId in idsObj['ids']) {
            if (!_.isEmpty(idsObj['ids'][divId])) {
              divIds.push(divId)
              weakObj[divId] = []
              for (let i in idsObj['ids'][divId]) {
                if (idsObj['ids'][divId][i]['weak'] === true) {
                  weakObj[divId].push(idsObj['ids'][divId][i])
                }
              }
            }
          }

          if (
            _.isUndefined(idsObj['pos_present']) ||
            idsObj['pos_present'] == false
          ) {
            this.props.onUpdateText(
              { weak_obj: weakObj, div_ids: divIds },
              6,
              currentSection
            )
          } else {
            this.props.onUpdateText(
              { weak_obj: weakObj, div_ids: divIds },
              7,
              currentSection
            )
          }
        }
      } else if (module == 'categories') {
        if (
          _.isUndefined(idsObj['pos_present']) ||
          idsObj['pos_present'] === false
        ) {
          this.props.onUpdateText(idsObj['ids'], 1, currentSection)
        } else {
          this.props.onUpdateText(idsObj['ids'], 2, currentSection)
        }
      } else if (module == 'seo') {
        let idsObj2 = {}

        for (let index in idsObj) {
          if (!idsObj2.hasOwnProperty(idsObj[index]['id'])) {
            idsObj2[idsObj[index]['id']] = []
          }
          idsObj2[idsObj[index]['id']].push({
            pos: idsObj[index]['pos'],
            word: value,
          })
        }
        this.props.onUpdateText(idsObj2, 2, currentSection)
      } else if (module == 'skills') {
        if (currentSection == 'Skills') {
          this.props.onUpdateText(
            _.map(idsObj, (value, key) => value['id']),
            5,
            currentSection
          )
        } else if (currentSection == 'Headline') {
          let statedIds = []

          for (let i in idsObj) {
            if (idsObj[i]['state'] == 'stated') {
              statedIds.push(idsObj[i]['id'])
            }
          }
          // this.props.onUpdateText({ 'word': value, 'ids': statedIds }, 4, currentSection)
          // new code for handling headline highlighting for stated skills
          let word = value
          if (
            idsObj.hasOwnProperty(0) &&
            idsObj[0].hasOwnProperty('stated_actual_keyword') &&
            idsObj[0]['stated_actual_keyword'] != ''
          ) {
            word = idsObj[0]['stated_actual_keyword']
          }
          this.props.onUpdateText(
            { word: word, ids: statedIds },
            4,
            currentSection
          )
        } else {
          this.props.onUpdateText(
            _.map(idsObj, (value, key) => value['id']),
            3,
            currentSection
          )
        }
      }
    }
  }

  handleMouseOver(e) {
    let value = $(e.target)
      .closest('[data-value]')
      .data('value')
    let module = $(e.target)
      .closest('[data-module]')
      .data('module')
    this.setState({ hoveredValue: value, hoveredModule: module })
  }

  handleMouseOut(e) {
    this.setState({ hoveredValue: '', hoveredModule: '' })
  }

  getFirstDivId(value, module, idsObj, currentSection, firstDivId) {
    return '#' + sectionUnderscore[currentSection]

    /* ignore this for now - under testing as on 05-10-2017 */
    if (module == 'language') {
      if (value == 'buzzwords' || value == 'verb_overusage') {
        if (!_.isUndefined(idsObj['ids']) && !_.isEmpty(idsObj['ids'])) {
          let keys = _.keys(idsObj['ids'])
          let minKey = parseInt(_.min(keys))
          if (minKey > firstDivId + 20) {
            minKey = Math.ceil((minKey - firstDivId) / 20) * 20 + firstDivId
            return '#profile-data-' + minKey
          }
        }
      } else if (value == 'tense' || value == 'narrative_voice') {
        if (!_.isUndefined(idsObj['ids']) && !_.isEmpty(idsObj['ids'])) {
          let minKey = parseInt(_.min(idsObj['ids']))
          if (minKey > firstDivId + 20) {
            minKey = Math.ceil((minKey - firstDivId) / 20) * 20 + firstDivId
            return '#profile-data-' + minKey
          }
        }
      }
    } else if (module == 'impact') {
      if (value == 'action_oriented' || value == 'specifics') {
        if (!_.isUndefined(idsObj['ids']) && !_.isEmpty(idsObj['ids'])) {
          let keys = _.keys(idsObj['ids'])
          let minKey = parseInt(_.min(keys))
          if (minKey > firstDivId + 20) {
            minKey = Math.ceil((minKey - firstDivId) / 20) * 20 + firstDivId
            return '#profile-data-' + minKey
          }
        }
      }
    } else if (module == 'categories') {
      if (!_.isUndefined(idsObj['ids']) && !_.isEmpty(idsObj['ids'])) {
        let keys = _.keys(idsObj['ids'])
        let minKey = parseInt(_.min(keys))
        if (minKey > firstDivId + 20) {
          minKey = Math.ceil((minKey - firstDivId) / 20) * 20 + firstDivId
          return '#profile-data-' + minKey
        }
      }
    } else if (module == 'seo') {
      if (!_.isEmpty(idsObj)) {
        let minKey = parseInt(
          _.min(
            _.map(idsObj, function(v) {
              return v['id']
            })
          )
        )
        if (minKey > firstDivId + 20) {
          minKey = Math.ceil((minKey - firstDivId) / 20) * 20 + firstDivId
          return '#profile-data-' + minKey
        }
      }
    } else if (module == 'skills') {
      if (currentSection == 'Headline') {
        let keys = []
        for (let i in idsObj) {
          if (idsObj[i]['state'] == 'stated') {
            keys.push(idsObj[i]['id'])
          }
        }
        if (!_.isEmpty(keys)) {
          let minKey = parseInt(_.min(keys))
          if (minKey > firstDivId + 20) {
            minKey = Math.ceil((minKey - firstDivId) / 20) * 20 + firstDivId
            return '#profile-data-' + minKey
          }
        }
      } else {
        let keys = []
        if (!_.isEmpty(idsObj)) {
          for (let i in idsObj) {
            keys.push(idsObj[i]['id'])
          }
        }
        let minKey = parseInt(_.min(keys))
        if (minKey > firstDivId + 20) {
          minKey = Math.ceil((minKey - firstDivId) / 20) * 20 + firstDivId
          return '#profile-data-' + minKey
        }
      }
    }

    return '#' + sectionUnderscore[currentSection]
  }

  getNoOfModules(sectionNav) {
    let count = 0
    if (sectionNav == 'content') {
      if (this.renderModuleFeedback['language'] == true) {
        count = count + 4
      }
      if (this.renderModuleFeedback['impact'] == true) {
        count = count + 2
      }
      if (this.renderModuleFeedback['categories'] == true) {
        count = count + 1
      }
    }

    if (sectionNav == 'skills') {
      if (this.renderModuleFeedback['skills'] == true) {
        count = count + 1
      }
    }
    if (sectionNav == 'visibility') {
      if (this.renderModuleFeedback['seo'] == true) {
        count = count + 1
      }
    }

    return count
  }

  handleClick(e) {
    const { currentSection } = this.props
    this.prevSelectedModule = ''
    this.prevSelectedValue = ''
    this.props.unhighlightAll()
    let i = $(e.target)
      .closest('[data-navindex]')
      .data('navindex')
    let sectionNav = sectionNavs[currentSection][i]
    let countOfAvailableClick = this.getNoOfModules(sectionNav)
    let sectionNavName = modsMap[sectionNav]
    let defaultSelectedValue = this.getDefaultSelectedValue(
      sectionNav,
      this.props
    )
    this.idsObj = defaultSelectedValue['idsObj']
    let selectedLanguageImpact =
      defaultSelectedValue['module'] == 'language' ||
      defaultSelectedValue['module'] == 'impact'
        ? defaultSelectedValue['value']
        : ''

    let jsonObjectForTracking = {
      eventLabel: 'feedback_panel_nav_click_info',
      currentSection: currentSection,
      sectionNav: sectionNav,
      selectedModule: defaultSelectedValue['module'],
      selectedValue: defaultSelectedValue['value'],
      countOfAvailableClick: countOfAvailableClick,
    }

    this.sendTrackingDataDebounceOtherClicks(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )

    this.setState({
      hoveredValue: '',
      hoveredModule: '',
      selectedValue: defaultSelectedValue['value'],
      selectedModule: defaultSelectedValue['module'],
      selectedLanguageImpact: selectedLanguageImpact,
    })
    this.props.resetSectionNavs(i)
  }

  getFirstModuleKeywords(props) {
    const { feedback, ui, currentSection } = props
    const currentIndex = ui.currentIndex

    if (
      feedback.hasOwnProperty('categories') &&
      feedback['categories'].hasOwnProperty('categories') &&
      feedback['categories']['categories'].hasOwnProperty(currentIndex) &&
      !_.isEmpty(feedback['categories']['categories'][currentIndex])
    ) {
      this.firstKeywordButton['categories'] = _.keys(
        feedback['categories']['categories'][currentIndex]
      )[0]
    }

    if (
      feedback.hasOwnProperty('seo') &&
      feedback['seo'].hasOwnProperty('keywords') &&
      feedback['seo']['keywords'].hasOwnProperty(currentIndex) &&
      feedback['seo']['keywords'][currentIndex].hasOwnProperty('relevant') &&
      !_.isEmpty(feedback['seo']['keywords'][currentIndex]['relevant'])
    ) {
      this.firstKeywordButton['seo'] = _.keys(
        feedback['seo']['keywords'][currentIndex]['relevant']
      )[0]
    }

    if (
      feedback.hasOwnProperty('skills') &&
      feedback['skills'].hasOwnProperty('relevant_skills_present') &&
      feedback['skills']['relevant_skills_present'].hasOwnProperty(currentIndex)
    ) {
      let flag = false
      let prioritizeSkills = {
        hard_skills: { '1': [], '0.9': [], '0.8': [], '0.7': [], '0.6': [] },
        soft_skills: { '1': [], '0.9': [], '0.8': [], '0.7': [], '0.6': [] },
      }

      for (let skill in feedback['skills']['relevant_skills_present'][
        currentIndex
      ]) {
        for (let k in feedback['skills']['relevant_skills_present'][
          currentIndex
        ][skill]) {
          if (currentSection == 'Skills' || currentSection == 'Headline') {
            if (
              feedback['skills']['relevant_skills_present'][currentIndex][
                skill
              ][k]['state'] == 'stated'
            ) {
              if (
                prioritizeSkills[
                  feedback['skills']['relevant_skills_present'][currentIndex][
                    skill
                  ][k]['type']
                ].hasOwnProperty(
                  feedback['skills']['relevant_skills_present'][currentIndex][
                    skill
                  ][k]['score']
                )
              ) {
                this.firstKeywordButton['skills'] = skill
                flag = true
                break
              }
            }
          } else {
            if (
              prioritizeSkills[
                feedback['skills']['relevant_skills_present'][currentIndex][
                  skill
                ][k]['type']
              ].hasOwnProperty(
                feedback['skills']['relevant_skills_present'][currentIndex][
                  skill
                ][k]['score']
              )
            ) {
              this.firstKeywordButton['skills'] = skill
              flag = true
              break
            }
          }
        }
        if (flag == true) {
          break
        }
      }
    }
  }

  getDefaultSelectedValue(sectionNav, props) {
    let module = ''

    if (sectionNav == 'content') {
      if (this.renderModuleFeedback['categories'] == true) {
        module = 'categories'
      } else if (this.renderModuleFeedback['impact'] == true) {
        module = 'impact'
      } else if (this.renderModuleFeedback['language'] == true) {
        module = 'language'
      }
    } else if (sectionNav == 'skills') {
      if (this.renderModuleFeedback['skills'] == true) {
        module = 'skills'
      }
    } else if (sectionNav == 'visibility') {
      if (this.renderModuleFeedback['seo'] == true) {
        module = 'seo'
      }
    }

    let value = ''
    let idsObj = null
    const { feedback, currentIndex } = props

    if (module == 'language') {
      value = 'buzzwords'
      if (
        feedback.hasOwnProperty('language') &&
        feedback['language'].hasOwnProperty(value) &&
        feedback['language'][value].hasOwnProperty(currentIndex)
      ) {
        idsObj = feedback['language'][value][currentIndex]
      }
    } else if (module == 'impact') {
      value = 'action_oriented'
      if (
        feedback.hasOwnProperty('impact') &&
        feedback['impact'].hasOwnProperty(value) &&
        feedback['impact'][value].hasOwnProperty(currentIndex)
      ) {
        idsObj = feedback['impact'][value][currentIndex]
      }
    } else if (module == 'categories') {
      value = this.firstKeywordButton['categories']
      if (
        feedback.hasOwnProperty('categories') &&
        feedback['categories'].hasOwnProperty('categories') &&
        feedback['categories']['categories'].hasOwnProperty(currentIndex) &&
        feedback['categories']['categories'][currentIndex].hasOwnProperty(value)
      ) {
        idsObj = feedback['categories']['categories'][currentIndex][value]
      }
    } else if (module == 'skills') {
      value = this.firstKeywordButton['skills']
      if (
        feedback.hasOwnProperty('skills') &&
        feedback['skills'].hasOwnProperty('relevant_skills_present') &&
        feedback['skills']['relevant_skills_present'].hasOwnProperty(
          currentIndex
        ) &&
        feedback['skills']['relevant_skills_present'][
          currentIndex
        ].hasOwnProperty(value)
      ) {
        idsObj =
          feedback['skills']['relevant_skills_present'][currentIndex][value]
      }
    } else if (module == 'seo') {
      value = this.firstKeywordButton['seo']
      if (
        feedback.hasOwnProperty('seo') &&
        feedback['seo'].hasOwnProperty('keywords') &&
        feedback['seo']['keywords'].hasOwnProperty(currentIndex) &&
        feedback['seo']['keywords'][currentIndex].hasOwnProperty('relevant') &&
        feedback['seo']['keywords'][currentIndex]['relevant'].hasOwnProperty(
          value
        )
      ) {
        idsObj = feedback['seo']['keywords'][currentIndex]['relevant'][value]
      }
    }

    return { value: value, module: module, idsObj: idsObj }
  }

  renderTop(sectionColor, currentIndex, currentSection) {
    const { tabIndex } = this.props
    if (this.sectionEmpty == true) {
      return (
        <div>
          <h2 className="text-red">
            <span
              tabIndex={tabIndex}
              aria-label={
                feedbackAriaLabel['empty']['title_text'] +
                ' ' +
                feedbackAriaLabel['empty']['body']['section_score'][
                  currentSection
                ]
              }>
              {' '}
              {feedbackContent['empty']['title_text']}{' '}
            </span>
          </h2>
          {feedbackContent['empty']['body']['section_score'][currentSection]}
        </div>
      )
    }
    if (!_.isEmpty(sectionColor)) {
      sectionColor = sectionColor[currentIndex]['color']
      return (
        <div>
          <h2 className={'text-' + sectionColor}>
            <span
              tabIndex={tabIndex}
              aria-label={
                currentSection +
                ' ' +
                feedbackAriaLabel[sectionColor]['title_text'] +
                feedbackAriaLabel[sectionColor]['body']['section_score'][
                  currentSection
                ]
              }>
              {' '}
              {feedbackContent[sectionColor]['title_text']}{' '}
            </span>
          </h2>
          {
            feedbackContent[sectionColor]['body']['section_score'][
              currentSection
            ]
          }
        </div>
      )
    }
    return null
  }

  isSectionEmpty(section, sectionData) {
    if (section == 'Summary') {
      if (
        _.isEmpty(sectionData) ||
        (sectionData.hasOwnProperty('text') &&
          sectionData['text'].length == 1 &&
          sectionData['text'][0]['text'][0] == 'N/A')
      ) {
        return true
      }
      return false
    } else {
      if (_.isEmpty(sectionData)) {
        return true
      }
      return false
    }
  }

  renderCommunityNameCheck() {
    const { communityCustomisations, currentSection, feedback } = this.props
    const { community_name_match, community_name } = feedback
    if (currentSection !== 'Education') {
      return null
    }
    if (!_.contains(communityCustomisations, 'community_name_check')) {
      return null
    }
    if (_.isNull(community_name_match)) {
      return null
    }
    let params = {
      icon: 'alert',
      backgroundClass: 'error',
      componentClass: 'community-notification',
      showBorderBottom: false,
      iconClass: 'col-sm-1',
      content: [
        `Your community recommends the school name to be written as `,
        <b>“{community_name}”</b>,
      ],
    }
    if (community_name_match) {
      params.icon = 'tick-2'
      params.backgroundClass = 'success'
    }

    return <InfoComponent {...params} />
  }

  render() {
    const {
      ui,
      derivedSkills,
      resumeSkillsInLinkedin,
      resumeSkillsNotInLinkedin,
      sectionWiseTextEditable,
      sectionWiseText,
      sectionsPerSkill,
      currentSection,
      has_api,
      has_pdf,
      feedback,
      staticFeedback,
      unhighlightAll,
      activeNavIndex,
      tabIndex,
    } = this.props
    let currentTab = tabIndex
    const currentIndex = ui.currentIndex
    let contentOutput = []
    let liNavs = []
    let liDivs = []

    for (let i in sectionNavs[currentSection]) {
      liNavs.push(
        <li
          key={i}
          role="tab"
          className={classNames({ active: i == activeNavIndex })}
          aria-selected={i == activeNavIndex}>
          <a
            role="button"
            tabIndex={i <= activeNavIndex ? currentTab : 20}
            aria-label={
              i == activeNavIndex
                ? `Know about the ${sectionNavs[currentSection][i]} of your profile`
                : `Click to know about ${sectionNavs[currentSection][i]} of your profile`
            }
            aria-controls={sectionNavs[currentSection][i]}
            onClick={e => this.handleClick(e)}
            data-navindex={i}
            data-toggle="tab">
            {modsMap[sectionNavs[currentSection][i]]}
          </a>
        </li>
      )

      if (this.sectionEmpty == true) {
        liDivs.push(
          <div
            role="tabpanel"
            className={classNames(
              'tab-pane',
              'fade',
              { in: i == activeNavIndex },
              { active: i == activeNavIndex }
            )}
            id={`empty${i}`}
            tabIndex={currentTab}
            aria-label={
              'Write content to unlock the feedback for this section'
            }>
            Write content to unlock the feedback for this section!
          </div>
        )
      } else if (sectionNavs[currentSection][i] == 'content') {
        let k = 0

        t = this.renderCategoriesFeedback(
          feedback,
          currentSection,
          currentIndex,
          currentTab
        )

        if (!_.isNull(t)) {
          contentOutput.push(<div key={k++}>{t}</div>)
          contentOutput.push(<div key={k++} className="border-margin-top-25" />)
        }

        t = this.renderImpactFeedback(feedback, currentSection, currentIndex)

        if (!_.isNull(t)) {
          contentOutput.push(<div key={k++}>{t}</div>)
          contentOutput.push(<div key={k++} className="border-margin-top-25" />)
        }

        let t = this.renderLanguageFeedback(
          feedback,
          currentSection,
          currentIndex
        )
        if (!_.isNull(t)) {
          contentOutput.push(<div key={k++}>{t}</div>)
          contentOutput.push(<div key={k++} className="border-margin-top-25" />)
        }

        contentOutput.splice(contentOutput.length, 1)
        liDivs.push(
          <div
            key={i}
            role="tabpanel"
            className={classNames(
              'tab-pane',
              'fade',
              { in: i == activeNavIndex },
              { active: i == activeNavIndex }
            )}
            id="content">
            {contentOutput}
          </div>
        )
      } else if (sectionNavs[currentSection][i] == 'skills') {
        liDivs.push(
          <div
            key={i}
            role="tabpanel"
            className={classNames(
              'tab-pane',
              'fade',
              { in: i == activeNavIndex },
              { active: i == activeNavIndex }
            )}
            id="skills">
            {this.renderSkillsFeedback(
              feedback,
              sectionsPerSkill,
              currentSection,
              currentIndex,
              resumeSkillsInLinkedin,
              resumeSkillsNotInLinkedin,
              derivedSkills,
              currentTab
            )}
          </div>
        )
      } else if (sectionNavs[currentSection][i] == 'visibility') {
        liDivs.push(
          <div
            key={i}
            role="tabpanel"
            className={classNames(
              'tab-pane',
              'fade',
              { in: i == activeNavIndex },
              { active: i == activeNavIndex }
            )}
            id="visibility">
            {this.renderSeoFeedback(
              feedback,
              currentSection,
              currentIndex,
              currentTab
            )}
          </div>
        )
      }
    }

    let infoComponent = null

    if (this.state.showInfoScreen == true) {
      infoComponent = (
        <InfoScreens
          tabIndex={currentTab}
          show={this.state.showInfoScreen}
          module={this.state.activeInfoScreen}
          currentSection={currentSection}
          hideModal={this.hideInfoModal}
        />
      )
    }
    return (
      <div>
        {infoComponent}
        <div className="feedback-panel">
          <div>
            {this.renderTop(
              feedback['section_score'],
              currentIndex,
              currentSection
            )}
          </div>
          {this.renderSectionBulletFeedback(
            feedback,
            currentSection,
            currentIndex
          )}
          {this.renderCommunityNameCheck()}
          {this.renderCountFeedback(
            feedback,
            currentSection,
            currentIndex,
            has_api,
            has_pdf,
            currentTab
          )}
          <div>
            <ul
              className="nav nav-tabs"
              id="parameters-navigation-tab"
              role="tablist">
              {liNavs}
            </ul>
            <div className="tab-content" id="parameters-navigation-content">
              {liDivs}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    communityCustomisations: state.AspireCommunityCustomisation.customisations,
    communityName: state.user.data.communityName,
  }
}

export default connect(mapStateToProps, {})(Sections)
