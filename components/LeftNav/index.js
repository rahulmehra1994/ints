import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { updatePdfState } from '../../actions/Login'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { sections, sectionsSequence } from '../Constants/UniversalMapping'

const leftNavIconsMap = {
  'Personal Information': `${process.env.APP_BASE_URL}dist/images/left-nav/icon-personal-info.svg`,
  'Profile Picture': `${process.env.APP_BASE_URL}dist/images/left-nav/icon-profile-picture.svg`,
  Headline: `${process.env.APP_BASE_URL}dist/images/left-nav/icon-headline.svg`,
  Summary: `${process.env.APP_BASE_URL}dist/images/left-nav/icon-summary.svg`,
  Experience: `${process.env.APP_BASE_URL}dist/images/left-nav/icon-experience.svg`,
  Education: `${process.env.APP_BASE_URL}dist/images/left-nav/icon-education.svg`,
}

const zoneToAriaLabelMapping = {
  picture_empty:
    'You have not uploaded your profile picture! Upload profile picture in the edit mode.',
  empty: 'You have not written this section!, start writing in the edit mode.',
  red: 'Needs Work, Consider the feedback to improve this section.',
  yellow: 'is on Track, Consider the feedback to improve this section.',
  green: 'Looks Good, You have done a good job with this section!',
}

class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 2000, true)
  }

  sectionsLoop(sectionNames) {
    let liElements = []
    let len = sectionNames.length

    for (let i = 0; i < len; i++) {
      liElements.push(this.activeSection(sectionNames[i]))
    }

    return liElements
  }

  activeSection(sectionName) {
    let warningIcon = []
    let sectionsequence = {
      'Personal Information': 1,
      'Profile Picture': 2,
      Headline: 3,
      Summary: 4,
      Experience: 5,
      Education: 6,
    }

    let flag =
      _.contains(this.props.emptySections, sectionName) &&
      (has_pdf !== 1 || status == 'wrong_pdf' || status == 'size_exceeded')
    const { summaryEmpty, has_pdf, status, tabIndex } = this.props

    let i = 0
    let currentTabIndex =
      sectionsSequence[sectionName] <=
      sectionsSequence[this.props.currentSectionName]
        ? 11
        : 30

    if (flag || (sectionName == 'Summary' && summaryEmpty == true)) {
      warningIcon.push(
        <img
          key={i}
          src={`${process.env.APP_BASE_URL}dist/images/left-nav/warning-icon.svg`}
          alt=""
          width="25px"
          height="25px"
        />
      )
      i++
    } else if (sectionName === this.props.currentSectionName) {
      warningIcon.push(
        <img
          key={i}
          src={`${process.env.APP_BASE_URL}dist/images/left-nav/nav-arrow.svg`}
          alt=""
          width="15px"
          height="15px"
        />
      )
      i++
    }

    if (
      sectionName === 'Experience' &&
      _.isEmpty(this.props.sectionWiseText['experience']) &&
      (has_pdf !== 1 || status == 'wrong_pdf' || status == 'size_exceeded')
    ) {
      return (
        <div className="left-nav-li left-nav-li-no-experience-no-pdf">
          <div className="left-nav-li-icon">
            <img
              key={i}
              src={leftNavIconsMap[sectionName]}
              alt=""
              width="30px"
              height="30px"
            />
          </div>
          <div className="left-nav-li-item-col">
            <div className="left-nav-li-heading">{sectionName}</div>
            <div className="left-nav-li-arrow-warning">{warningIcon}</div>
          </div>
        </div>
      )
    }

    if (
      sectionName === 'Education' &&
      (has_pdf !== 1 || status == 'wrong_pdf' || status == 'size_exceeded')
    ) {
      let seeHow = (
        <a
          className="btn5 btn btn-see-how"
          tabIndex={navActiveClass ? tabIndex : tabIndex + 20}
          href="javascript:void(0);"
          onClick={() => this.displayModal()}
          aria-label={
            'Unlock the full feedback for all sections by uploading your profile'
          }>
          See how
        </a>
      )

      if (
        this.props.processingStatus == 'processing' ||
        _.isNull(this.props.processingStatus)
      ) {
        seeHow = (
          <a
            className="btn5 btn btn-see-how"
            href="javascript:void(0);"
            aria-label={'your profile is being processed, please wait'}
            disabled>
            See how
          </a>
        )
      }

      return (
        <div className="left-nav-li left-nav-li-overlay-item">
          <div className="left-nav-li-icon">
            <img
              src={leftNavIconsMap[sectionName]}
              alt=""
              width="30px"
              height="30px"
            />
          </div>
          <div className="left-nav-li-item-col">
            <div className="left-nav-li-heading">{sectionName}</div>
            <div className="left-nav-li-arrow-warning">{warningIcon}</div>
          </div>
          <div className="left-nav-black-overlay js-detailed-upload-pdf">
            <span className="lock-container">
              <div className="icon-lock-outline" />
            </span>
            <p> Upload LinkedIn PDF to unlock feedback on all sections</p>
            {seeHow}
          </div>
        </div>
      )
    }

    let navActiveClass = false
    if (sectionName === this.props.currentSectionName) {
      navActiveClass = true
    }
    return (
      <a
        key={sectionName}
        tabIndex={currentTabIndex}
        aria-label={`Click to view ${sectionName} detailed feedback`}
        className={classNames('left-nav-li', {
          'left-nav-li-active': navActiveClass,
        })}
        href="javascript:void(0);"
        onClick={e => {
          e.preventDefault()
          this.props.onSelectSection(e, 'left_nav')
        }}
        data-key={sectionName}>
        <div className="left-nav-li-icon">
          <img
            src={leftNavIconsMap[sectionName]}
            alt=""
            width="30px"
            height="30px"
          />
        </div>
        <div className="left-nav-li-item-col">
          <div className="left-nav-li-heading">{sectionName}</div>
          <div className="left-nav-li-arrow-warning">{warningIcon}</div>
        </div>
      </a>
    )
  }

  displayModal() {
    this.sendTrackingDataDebounce(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      'see_how_btn'
    )
    const { updatePdfState } = this.props
    updatePdfState({
      updateKeys: [['showPdfModal']],
      data: { showPdfModal: true },
    })
  }

  fetchImageUrl(url) {
    if (_.isEmpty(url)) {
      return `${process.env.APP_BASE_URL}dist/images/profile-avatar.png`
    }

    return url
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
    this.replaceImageWithAvatarIfNotPresent('left-nav-profile-img')
  }

  render() {
    const { sectionWiseText, tabIndex } = this.props

    let list = []
    for (let i = 0; i < sections.length; i++) {
      list.push(this.activeSection(sections[i]))
    }

    return (
      <div className="js-detailed-left-nav">
        <div className="left-nav-top-container">
          <div className="left-nav-img-container">
            <img
              src={this.fetchImageUrl(sectionWiseText['imageUrl'])}
              alt="Your profile Picture"
              id="left-nav-profile-img"
              width="100%"
              height="100%"
              className="img-circle"
            />
          </div>
          <div className="left-nav-name-heading" role="heading" aria-level="1">
            Hi {this.getFirstName(sectionWiseText['name'])}
          </div>
          <div className="js-detailed-profile-strength">
            <div
              className="left-nav-main-progress-heading"
              tabIndex={tabIndex}
              aria-label={
                'Your overall profile ' +
                zoneToAriaLabelMapping[this.props.totalScoreColor]
              }>
              Your profile strength
            </div>
            <div className="left-nav-main-progress">
              <div
                className={
                  'progress-bar progress-bar-' + this.props.totalScoreColor
                }
                role="progressbar"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: this.props.totalScore + '%' }}>
                <span className="sr-only">40% Complete (success)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="left-nav-bottom-container">
          <div className="left-nav-ul">{list}</div>
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
  }
}

export default connect(mapStateToProps, { updatePdfState })(LeftNav)
