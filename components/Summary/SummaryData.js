import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { updatePdfState } from '../../actions/Login'
import Loader from '../Loader'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import classNames from 'classnames'
import { selectSection } from '../../actions/DetailedFeedback'
import {
  updateFeedbackState,
  markSectionVisited,
} from '../../actions/AspireFeedback'
import {
  zoneToAriaLabelMapping,
  summaryScreenAriaLabel,
} from '../Constants/AriaLabelText'
import {
  sectionUnderscore,
  sectionUnderscoreFeedbackMapping,
  sectioNameToBackendVisitedSectioNameMapping,
} from '../Constants/UniversalMapping'
import { generateUrl } from '../../services/helpers'

const feedbackContent = {
  picture_empty: {
    title_text: 'You have not uploaded your profile picture!',
    body: <p>Upload profile picture in the edit mode. </p>,
  },
  empty: {
    title_text: 'You have not written this section!',
    body: <p>Start writing in the edit mode. </p>,
  },
  red: {
    title_text: 'Needs Work!',
    body: <p>Consider the feedback to improve this section. </p>,
  },
  yellow: {
    title_text: 'On Track!',
    body: <p>Consider the feedback to improve this section. </p>,
  },
  green: {
    title_text: 'Looks Good!',
    body: <p>You have done a good job with this section! </p>,
  },
}

class SummaryMainData extends Component {
  constructor(props) {
    super(props)
    this.timeScreenStart = 0
    this.renderOverlay = this.renderOverlay.bind(this)
    this.onSelectSection = this.onSelectSection.bind(this)
    this.sendTrackingDataDebounceShowDetails = _.debounce(
      sendTrackingData,
      2000,
      true
    )
    this.sendTrackingDataDebounceSeeHow = _.debounce(
      sendTrackingData,
      2000,
      true
    )
    this.sendTrackingDataDebounceSeeDetailedFeedback = _.debounce(
      sendTrackingData,
      2000,
      true
    )
    this.checkVisitedSection = this.checkVisitedSection.bind(this)
    this.checkVisitedSectionDebounce = _.debounce(
      this.checkVisitedSection,
      1000,
      true
    )
    this.sendTrackingDataDebouncePageLoad = _.debounce(
      sendTrackingData,
      2000,
      true
    )
    this.getAriaLabelText = this.getAriaLabelText.bind(this)
  }

  getFirstName(name) {
    let fullName = name.split(' ')
    return fullName[0]
  }

  replaceImageWithAvatarIfNotPresent(id) {
    $('#' + id).on('error', function() {
      $(this).attr(
        'src',
        `${process.env.APP_BASE_URL}dist/images/profile-avatar.png`
      )
      $(this).attr('alt', '')
    })
  }

  UNSAFE_componentWillUpdate() {
    this.replaceImageWithAvatarIfNotPresent('summary-profile-img')
  }

  componentDidMount() {
    let timeScreenStart = new Date()
    this.timeScreenStart = timeScreenStart.getTime()
    this.progressBarAnimation()
    let url = this.props.imageUrl
    $('.summary-left-panel-bg-profile-pic').css(
      'background-image',
      'url(' + url + ')'
    )
    this.checkVisitedSectionDebounce('Summary Screen')
    this.sendTrackingDataDebouncePageLoad(
      'page_level',
      'aspire_summary_screen',
      'load',
      'page_loaded'
    )
    this.replaceImageWithAvatarIfNotPresent('summary-profile-img')
  }

  checkVisitedSection(currentSectionName) {
    let visitedSectionModuleName =
      sectioNameToBackendVisitedSectioNameMapping[currentSectionName]
    if (this.props.visited_sections[visitedSectionModuleName] == 0) {
      this.props.markSectionVisited(visitedSectionModuleName)
    }
  }

  componentWillUnmount() {
    let timeScreenEnd = new Date()
    let timeScreenSpent =
      (timeScreenEnd.getTime() - this.timeScreenStart) / 1000
    if (timeScreenSpent > 2) {
      let jsonObjectForTracking = {
        eventLabel: 'screen_time',
        time: timeScreenSpent,
      }
      sendTrackingData(
        'event',
        'aspire_summary_screen',
        'time',
        JSON.stringify(jsonObjectForTracking)
      )
    }
  }

  renderProgrees(obj, mod, section) {
    if (obj['class'] == 'cross-circle') {
      return <div className="cross-circle">X</div>
    } else if (obj['class'] == 'question-circle') {
      return <div className="question-circle">?</div>
    } else {
      return (
        <div>
          <div className="progress-summary-text">
            {obj['color'] == 'green'
              ? 'High'
              : obj['color'] == 'yellow'
              ? 'Medium'
              : 'Low'}
          </div>
          <div className="progress-summary">
            <div
              className={`${obj['class']}`}
              role="progressbar"
              aria-valuenow="40"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: +obj['score'] + '%' }}>
              <span className="sr-only">40% Complete (success)</span>
            </div>
          </div>
        </div>
      )
    }
  }

  renderPersonalInfoProgress(obj) {
    let score = 0
    let color = 'red'
    if (
      obj.hasOwnProperty('personal_information_feedback') &&
      obj['personal_information_feedback'].hasOwnProperty(
        'overall_section_score_class'
      )
    ) {
      score =
        obj['personal_information_feedback']['overall_section_score_class'][
          'overall_section_score'
        ]
      color =
        obj['personal_information_feedback']['overall_section_score_class'][
          'color_feedback'
        ]
      let progressColorClass = 'progress-bar-' + color

      return (
        <div>
          <div className="progress-summary-text">
            {color == 'green' ? 'High' : color == 'yellow' ? 'Medium' : 'Low'}
          </div>
          <div className="progress-summary">
            <div
              className={classNames('progress-bar', progressColorClass)}
              role="progressbar"
              aria-valuenow="40"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: +score + '%' }}>
              <span className="sr-only">40% Complete (success)</span>
            </div>
          </div>
        </div>
      )
    } else {
      return <div className="question-circle">?</div>
    }
  }

  renderProfilePictureProgress(obj) {
    let score = 0
    let color = 'red'
    if (
      obj.hasOwnProperty('profile_picture_feedback') &&
      obj['profile_picture_feedback'].hasOwnProperty(
        'overall_section_score_class'
      )
    ) {
      score =
        obj['profile_picture_feedback']['overall_section_score_class'][
          'overall_section_score'
        ]
      color =
        obj['profile_picture_feedback']['overall_section_score_class'][
          'color_feedback'
        ]
      let progressColorClass = 'progress-bar-' + color

      return (
        <div>
          <div className="progress-summary-text">
            {color == 'green' ? 'High' : color == 'yellow' ? 'Medium' : 'Low'}
          </div>
          <div className="progress-summary">
            <div
              className={classNames('progress-bar', progressColorClass)}
              role="progressbar"
              aria-valuenow="40"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: +score + '%' }}>
              <span className="sr-only">40% Complete (success)</span>
            </div>
          </div>
        </div>
      )
    } else {
      return <div className="question-circle">?</div>
    }
  }

  progressBarAnimation() {
    $('.progress-bar-main .progress-bar, .progress .progress-bar').css(
      'width',
      function() {
        return $(this).attr('aria-valuenow') + '%'
      }
    )
  }

  displayModal() {
    const { updatePdfState } = this.props
    this.sendTrackingDataDebounceSeeHow(
      'event',
      'aspire_summary_screen',
      'click',
      'see_how_btn'
    )
    updatePdfState({
      updateKeys: [['showPdfModal']],
      data: { showPdfModal: true },
    })
  }

  onSelectSection(e) {
    const { ui } = this.props
    var key = e.currentTarget.dataset['key']
    let jsonObjectForTracking = {
      eventLabel: 'show_details_btn',
      sectionName: key,
      currentIndex: ui[key]['currentIndex'],
    }
    this.sendTrackingDataDebounceShowDetails(
      'event',
      'aspire_summary_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.props.updateFeedbackState({
      updateKeys: [
        ['callOnSelectSectionDependenciesInDetailedFeedback'],
        ['keyForSelectSection'],
      ],
      data: {
        callOnSelectSectionDependenciesInDetailedFeedback: true,
        keyForSelectSection: key,
      },
    })
  }

  getAriaLabelText(sectionName) {
    const { noImageUploaded, feedback } = this.props
    let obj = feedback['section_wise_feedback']
    if (sectionName == 'Profile Picture' && noImageUploaded) {
      ariaLabel = zoneToAriaLabelMapping['picture_empty']
      return ariaLabel
    }
    let color = 'red'
    let ariaLabel = 'You have not written this section'

    let sectionUnderScoreFeedbackName =
      sectionUnderscoreFeedbackMapping[sectionName]
    if (
      obj.hasOwnProperty(sectionUnderScoreFeedbackName) &&
      obj[sectionUnderScoreFeedbackName].hasOwnProperty(
        'overall_section_score_class'
      )
    ) {
      color =
        obj[sectionUnderScoreFeedbackName]['overall_section_score_class'][
          'color_feedback'
        ]
    } else {
      color = 'empty'
    }
    ariaLabel = zoneToAriaLabelMapping[color]

    return ariaLabel
  }

  onTileFocus(overlayId) {
    $(`#${overlayId}`).addClass('as-overlay-visible')
  }

  onTileFocusOut(overlayId) {
    $(`#${overlayId}`).removeClass('as-overlay-visible')
  }

  renderOverlay(sectionName, obj, overlayId) {
    const { noImageUploaded, tabIndex, fetchId } = this.props
    let color = 'red'
    let colorClassName = 'text-red'
    let feedbackHeading = null
    let feedbackBody = null

    let sectionUnderScoreFeedbackName =
      sectionUnderscoreFeedbackMapping[sectionName]

    if (
      obj.hasOwnProperty(sectionUnderScoreFeedbackName) &&
      obj[sectionUnderScoreFeedbackName].hasOwnProperty(
        'overall_section_score_class'
      )
    ) {
      color =
        obj[sectionUnderScoreFeedbackName]['overall_section_score_class'][
          'color_feedback'
        ]
      colorClassName = 'text-' + color
    } else {
      color = 'empty'
      colorClassName = color
    }

    let titleText = ''
    let bodyText = ''
    if (sectionName == 'Profile Picture' && noImageUploaded) {
      titleText = feedbackContent['picture_empty']['title_text']
      bodyText = feedbackContent['picture_empty']['body']
    } else {
      titleText = feedbackContent[color]['title_text']
      bodyText = feedbackContent[color]['body']
    }

    let url = generateUrl(fetchId, 'detailed', sectionName)
    return (
      <div className="wrapper-for-overlay" id={overlayId}>
        <div className="summary-b-row-fixed-height summary-row-overlay">
          <div className="summary-feedback-text-div">
            <div
              className={classNames('summary-l-feedback-text', colorClassName)}>
              {titleText}
            </div>
            <div className="summary-r-feedback-text">{bodyText}</div>
          </div>
          <div className="summary-show-details-div">
            <Link
              className="summary-show-details-btn"
              to={url}
              onFocus={() => this.onTileFocus(overlayId)}
              onBlur={() => this.onTileFocusOut(overlayId)}
              onClick={this.onSelectSection}
              tabIndex={tabIndex}
              aria-label={`Click to see detailed feedback of ${sectionName}`}
              data-key={sectionName}>
              Show Details
            </Link>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      fetchId,
      educationData,
      has_api,
      has_pdf,
      has_resume,
      status,
      scores,
      name,
      imageUrl,
      processingStatus,
      sectionWiseText,
      feedback,
      tabIndex,
    } = this.props
    let currentTab = tabIndex
    let seeHow = (
      <a
        className="btn5 btn btn-see-how"
        href="javascript:void(0);"
        tabIndex={currentTab}
        aria-label={summaryScreenAriaLabel['see_how']}
        onClick={() => this.displayModal()}>
        See how
      </a>
    )

    if (processingStatus == 'processing' || _.isNull(processingStatus)) {
      seeHow = (
        <a
          className="btn5 btn btn-see-how"
          href="javascript:void(0);"
          tabIndex={currentTab}
          aria-label={summaryScreenAriaLabel['see_how_clicked']}
          disabled>
          See how
        </a>
      )
    }

    let showEducation = (
      <div className="summary-education-div">
        <div
          className="summary-table-row border-top summary-b-row-fixed-height"
          id="education-summary-row"
          tabIndex={currentTab}
          aria-label={`Education, Outline of your educational qualifications along with extra-curricular activities and ${this.getAriaLabelText(
            'Education'
          )}`}>
          <div className="summary-row-icon">
            <img
              src={`${process.env.APP_BASE_URL}dist/images/left-nav/icon-education.svg`}
              alt=""
              width="35"
            />
          </div>
          <div className="summary-support-text-2">
            <strong className="th-heading-2">Education</strong>
            <br />
            Outline of your educational qualifications along with
            extra-curricular activities
            <br />
          </div>
          <div className="summary-progress-div-2">
            {this.renderProgrees(
              scores['Content']['Education'],
              'Content',
              'Education'
            )}
          </div>
          <div className="summary-progress-div-2">
            <div className="cross-circle">N/A</div>
          </div>
          <div className="summary-progress-div-2">
            {this.renderProgrees(
              scores['Visibility']['Education'],
              'Visibility',
              'Education'
            )}
          </div>
          {this.renderOverlay(
            'Education',
            feedback['section_wise_feedback'],
            'education-summary-overlay'
          )}
        </div>
      </div>
    )

    if (has_pdf !== 1 || status == 'wrong_pdf' || status == 'size_exceeded') {
      if (!this.props.showPdfModal) {
        showEducation = (
          <div className="summary-education-div">
            <div className="white-box">
              <div className="container-experience">
                <div className="lock-container">
                  <div className="icon-lock-outline" />
                </div>
                <div className="white-overlay">
                  Upload LinkedIn PDF to unlock feedback on Education and past
                  Experience
                </div>
                <div>{seeHow}</div>
              </div>
            </div>
          </div>
        )
      }
    }

    let showExperience = (
      <div
        className="summary-table-row border-top summary-b-row-fixed-height"
        id="experience-summary-row"
        tabIndex={currentTab}
        aria-label={`Experience, Outline of your professional background, knowledge areas and accomplishments ${this.getAriaLabelText(
          'Experience'
        )}`}>
        <div className="summary-row-icon">
          <img
            src={`${process.env.APP_BASE_URL}dist/images/left-nav/icon-experience.svg`}
            alt=""
            width="35"
          />
        </div>
        <div className="summary-support-text-2">
          <strong className="th-heading-2">Experience</strong>
          <br />
          Outline of your professional background, knowledge areas and
          accomplishments
          <br />
        </div>
        <div className="summary-progress-div-2">
          {this.renderProgrees(
            scores['Content']['Experience'],
            'Content',
            'Experience'
          )}
        </div>
        <div className="summary-progress-div-2">
          {this.renderProgrees(
            scores['Skills']['Experience'],
            'Skills',
            'Experience'
          )}
        </div>
        <div className="summary-progress-div-2">
          {this.renderProgrees(
            scores['Visibility']['Experience'],
            'Visibility',
            'Experience'
          )}
        </div>
        {this.renderOverlay(
          'Experience',
          feedback['section_wise_feedback'],
          'experience-summary-overlay'
        )}
      </div>
    )

    if (
      !scores.Content['Experience'].hasOwnProperty('score') &&
      !scores.Skills['Experience'].hasOwnProperty('score') &&
      !scores.Visibility['Experience'].hasOwnProperty('score') &&
      has_pdf !== 1
    ) {
      // show overlay over experince also
      if (!this.props.showPdfModal) {
        showExperience = null
      }
    }

    let ariaLabelSummaryLeftSide = `Your overall profile ${
      zoneToAriaLabelMapping[scores['Total']['class']]
    }, Segment wise, Content section ${
      zoneToAriaLabelMapping[scores['Content']['Total']['color']]
    }, Skills section ${
      zoneToAriaLabelMapping[scores['Skills']['Total']['color']]
    } and profile Visibility ${
      zoneToAriaLabelMapping[scores['Visibility']['Total']['color']]
    }`

    return (
      <div id="summary-feedback">
        <div className="body-container">
          <div className="container-fluid tall">
            <Loader padding={10} />
            <div className="row row-container tall">
              <div className="col-summary-width-left col-container padding-right0-2 tall">
                <div
                  className="summary-left-panel tall scroll-col-auto position-re outer-border vertical-scroll"
                  tabIndex={currentTab}
                  aria-label={ariaLabelSummaryLeftSide}>
                  <div className="summary-left-panel-heading">
                    <div className="progressBarLable">Profile Strength:</div>
                    <div className="progressBarGraph">
                      <h3 className={`${scores['Total']['class']}-text`}>
                        {' '}
                        {scores['Total']['text'] + ' ZONE'}
                      </h3>
                      <div className="progress-bar-main">
                        <div
                          className={
                            'progress-bar progress-bar-' +
                            scores['Total']['class']
                          }
                          role="progressbar"
                          aria-valuenow={scores['Total']['score']}
                          aria-valuemin="0"
                          aria-valuemax="100">
                          <span className="sr-only">
                            40% Complete (success)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="summary-left-panel-profile-pic-container">
                    <div className="summary-left-panel-bg-color" />
                    <div className="summary-left-panel-bg-profile-pic" />
                    <div className="summary-left-panel-profile-pic">
                      <img
                        src={imageUrl}
                        alt="your profile picture"
                        width="100%"
                        height="100%"
                        id="summary-profile-img"
                        className="img-circle"
                      />
                    </div>
                    <div className="summary-left-panel-profile-pic-text">
                      “Hi <strong>{this.getFirstName(name)} </strong>, we have
                      analysed your profile and here is a brief feedback.”
                    </div>
                  </div>
                  <div className="summary-left-panel-text bg-white">
                    <div className="evaluation">
                      <div className="eva-body pull-left">
                        <div className="content-skill-pro">
                          <div className="eva-heading">Content</div>
                          <div className="progress">
                            <div
                              className={scores['Content']['Total']['class']}
                              role="progressbar"
                              aria-valuenow={
                                scores['Content']['Total']['score']
                              }
                              aria-valuemin="0"
                              aria-valuemax="100">
                              <span className="sr-only">
                                40% Complete (success)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="eva-text">
                          Provides feedback on information and language
                          contained in your profile
                        </div>
                      </div>
                    </div>
                    <div className="border-top" />
                    <div className="evaluation">
                      <div className="eva-body pull-left">
                        <div className="content-skill-pro">
                          <div className="eva-heading">Skills</div>
                          <div className="progress">
                            <div
                              className={scores['Skills']['Total']['class']}
                              role="progressbar"
                              aria-valuenow={scores['Skills']['Total']['score']}
                              aria-valuemin="0"
                              aria-valuemax="100">
                              <span className="sr-only">
                                40% Complete (success)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="eva-text">
                          Guidance on skills you can cultivate-mined from
                          millions of job descriptions
                        </div>
                      </div>
                    </div>
                    <div className="border-top" />
                    <div className="evaluation">
                      <div className="eva-body pull-left">
                        <div className="content-skill-pro">
                          <div className="eva-heading">Profile Visibility</div>
                          <div className="progress">
                            <div
                              className={scores['Visibility']['Total']['class']}
                              role="progressbar"
                              aria-valuenow={
                                scores['Visibility']['Total']['score']
                              }
                              aria-valuemin="0"
                              aria-valuemax="100">
                              <span className="sr-only">
                                40% Complete (success)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="eva-text">
                          Measures the ranking of your profile based on SEO
                          keywords
                        </div>
                      </div>
                    </div>
                    <div className="clearfix" />
                  </div>
                  <div className="summary-detailed-feedback-btn">
                    <Link
                      className="btn2 btn btn-primary"
                      tabIndex={tabIndex}
                      aria-label={
                        'Click to see detailed feedback of linkedin section'
                      }
                      onClick={() => {
                        this.sendTrackingDataDebounceSeeDetailedFeedback(
                          'event',
                          'aspire_summary_screen',
                          'click',
                          'see_detailed_feedback_btn'
                        )
                      }}
                      to={`/aspire/${fetchId}/feedback/detailed`}>
                      See Detailed Feedback
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-summary-width-right col-container tall">
                <div className="summary-right-panel tall scroll-col-auto outer-border vertical-scroll">
                  <h1>Profile Snapshot</h1>
                  <div className="summary-table-container">
                    <div
                      className="summary-table-row border-top summary-b-row-fixed-height"
                      id="personal-info-summary-row"
                      tabIndex={currentTab}
                      aria-label={`Personal Information Entails basic details - your name, profile URL and no. of connections, and ${this.getAriaLabelText(
                        'Personal Information'
                      )}`}>
                      <div className="summary-row-icon">
                        <img
                          src={`${process.env.APP_BASE_URL}dist/images/left-nav/icon-personal-info.svg`}
                          alt=""
                          width="35"
                        />
                      </div>
                      <div className="summary-support-text">
                        <strong className="th-heading-2">
                          Personal Information
                        </strong>{' '}
                        <br />
                        Entails basic details - your name, profile URL and no.
                        of connections
                        <br />
                      </div>
                      <div className="summary-progress-div">
                        {this.renderPersonalInfoProgress(
                          feedback['section_wise_feedback']
                        )}
                      </div>
                      {this.renderOverlay(
                        'Personal Information',
                        feedback['section_wise_feedback'],
                        'personal-info-summary-overlay'
                      )}
                    </div>
                    <div
                      className="summary-table-row border-top summary-b-row-fixed-height"
                      id="profile-picture-summary-row"
                      tabIndex={currentTab}
                      aria-label={
                        'Profile Picture, A professional profile picture is a vital driver to cast a strong first impression and ' +
                        this.getAriaLabelText('Profile Picture')
                      }>
                      <div className="summary-row-icon">
                        <img
                          src={`${process.env.APP_BASE_URL}dist/images/left-nav/icon-profile-picture.svg`}
                          alt=""
                          width="35"
                        />
                      </div>
                      <div className="summary-support-text">
                        <strong className="th-heading-2">
                          Profile Picture
                        </strong>{' '}
                        <br />A professional profile picture is a vital driver
                        to cast a strong first impression
                        <br />
                      </div>
                      <div className="summary-progress-div">
                        {this.renderProfilePictureProgress(
                          feedback['section_wise_feedback']
                        )}
                      </div>
                      {this.renderOverlay(
                        'Profile Picture',
                        feedback['section_wise_feedback'],
                        'profile-picture-summary-overlay'
                      )}
                    </div>
                    <div className="summary-table-row bg-table-heading">
                      <div className="summary-table-empty-col" />
                      <div className="summary-table-heading">CONTENT</div>
                      <div className="summary-table-heading">SKILLS</div>
                      <div className="summary-table-heading">
                        PROFILE VISIBILITY
                      </div>
                    </div>
                    <div
                      className="summary-table-row summary-b-row-fixed-height"
                      id="headline-summary-row"
                      tabIndex={currentTab}
                      aria-label={
                        'Headline, Most vital section of your profile that needs to be leveraged to promote an area of expertise and ' +
                        this.getAriaLabelText('Headline')
                      }>
                      <div className="summary-row-icon">
                        <img
                          src={`${process.env.APP_BASE_URL}dist/images/left-nav/icon-headline.svg`}
                          alt=""
                          width="35"
                        />
                      </div>
                      <div className="summary-support-text-2">
                        <strong className="th-heading-2">Headline</strong>{' '}
                        <br /> Most vital section of your profile that needs to
                        be leveraged to promote an area of expertise
                        <br />
                      </div>
                      <div className="summary-progress-div-2">
                        {this.renderProgrees(
                          scores['Content']['Headline'],
                          'Content',
                          'Headline'
                        )}
                      </div>
                      <div className="summary-progress-div-2">
                        {this.renderProgrees(
                          scores['Skills']['Headline'],
                          'Skills',
                          'Headline'
                        )}
                      </div>
                      <div className="summary-progress-div-2">
                        {this.renderProgrees(
                          scores['Visibility']['Headline'],
                          'Visibility',
                          'Headline'
                        )}
                      </div>
                      {this.renderOverlay(
                        'Headline',
                        feedback['section_wise_feedback'],
                        'headline-summary-overlay'
                      )}
                    </div>

                    <div
                      className="summary-table-row border-top summary-b-row-fixed-height"
                      id="summary-summary-row"
                      tabIndex={currentTab}
                      aria-label={
                        'Summary, A holistic description to highlight your background and knowledge areas and ' +
                        this.getAriaLabelText('Summary')
                      }>
                      <div className="summary-row-icon">
                        <img
                          src={`${process.env.APP_BASE_URL}dist/images/left-nav/icon-summary.svg`}
                          alt=""
                          width="35"
                        />
                      </div>
                      <div className="summary-support-text-2">
                        <strong className="th-heading-2">Summary</strong> <br />
                        A holistic description to highlight your background and
                        knowledge areas
                        <br />
                      </div>
                      <div className="summary-progress-div-2">
                        {this.renderProgrees(
                          scores['Content']['Summary'],
                          'Content',
                          'Summary'
                        )}
                      </div>
                      <div className="summary-progress-div-2">
                        {this.renderProgrees(
                          scores['Skills']['Summary'],
                          'Skills',
                          'Summary'
                        )}
                      </div>
                      <div className="summary-progress-div-2">
                        {this.renderProgrees(
                          scores['Visibility']['Summary'],
                          'Visibility',
                          'Summary'
                        )}
                      </div>
                      {this.renderOverlay(
                        'Summary',
                        feedback['section_wise_feedback'],
                        'summary-summary-overlay'
                      )}
                    </div>
                    {showExperience}
                    {showEducation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    showPdfModal: state.uploadPdf.showPdfModal,
    processingStatus: state.aspireFeedbackData.status,
    educationData: state.detailedFeedbackUi.sections.Education,
    ui: state.detailedFeedbackUi,
    visited_sections: state.aspireFeedbackData.visited_sections,
  }
}

export default connect(
  mapStateToProps,
  {
    updatePdfState,
    selectSection,
    updateFeedbackState,
    markSectionVisited,
  }
)(SummaryMainData)
