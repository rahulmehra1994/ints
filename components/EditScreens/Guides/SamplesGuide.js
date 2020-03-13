import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchNewSamples,
  updateNewSamplesState,
} from '../../../actions/AspireSamples'
import _ from 'underscore'
import classNames from 'classnames'
import $ from 'jquery'
import Parser from 'html-react-parser'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { editModalAriaLabel } from '../../Constants/AriaLabelText'

const imgColorMap = {
  green: 'circel-green',
  yellow: 'circel-yellow',
  red: 'circel-red',
}

const imgSymbolMap = {
  green: <span className="fa fa-check" aria-hidden="true" />,
  yellow: <span className="fa fa-exclamation" aria-hidden="true" />,
  red: <span className="fa fa-times" aria-hidden="true" />,
}

const imgSamples = [
  {
    url: `${process.env.APP_BASE_URL}dist/images/img-suggestion-1.jpg`,
    face_frame_ratio: 'green',
    photo_size: 'green',
    foreground_detection: 'green',
    background_detection: 'green',
    smile: 'green',
    eye_contact: 'green',
    face_body_ratio: 'green',
  },
  {
    url: `${process.env.APP_BASE_URL}dist/images/img-suggestion-2.jpg`,
    face_frame_ratio: 'green',
    photo_size: 'green',
    foreground_detection: 'green',
    background_detection: 'green',
    smile: 'green',
    eye_contact: 'green',
    face_body_ratio: 'green',
  },
  {
    url: `${process.env.APP_BASE_URL}dist/images/img-suggestion-6.jpg`,
    face_frame_ratio: 'green',
    photo_size: 'green',
    foreground_detection: 'green',
    background_detection: 'green',
    smile: 'green',
    eye_contact: 'green',
    face_body_ratio: 'green',
  },
]

class SamplesGuide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      isEdited: false,
    }
    this.sectionSamples = 0
    this.len = 0
    this.hasSampleScrolled = false
    this.handleSampleScroll = this.handleSampleScroll.bind(this)
    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 5000, true)
    this.sendTrackingDataDebounceSampleScrolled = _.debounce(
      sendTrackingData,
      5000,
      true
    )
    this.handleNextSampleClick = this.handleNextSampleClick.bind(this)
    this.handlePrevSampleClick = this.handlePrevSampleClick.bind(this)
    this.getNextButton = this.getNextButton.bind(this)
    this.getPreviousButton = this.getPreviousButton.bind(this)
    this.getSample = this.getSample.bind(this)
  }

  UNSAFE_componentWillMount() {
    const {
      fetchNewSamples,
      currentSection,
      currentIndex,
      fetchId,
      newSubSection,
      isEdited,
      fetchedSamples,
      fetchingSamples,
      errorSamples,
    } = this.props

    this.setState({ isEdited: isEdited })
    if (
      currentSection == 'Summary' ||
      currentSection == 'Education' ||
      currentSection == 'Experience'
    ) {
      if (!(fetchedSamples && !fetchingSamples && !errorSamples)) {
        if (newSubSection == true) {
          fetchNewSamples(fetchId, currentSection, -1)
        } else {
          fetchNewSamples(fetchId, currentSection, currentIndex)
        }
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { updateEditSection } = nextProps
    if (updateEditSection == true) {
      this.setState({ isEdited: false })
    }
  }

  wrapWithPara(string2, tag = 'p') {
    if (!_.isNull(string2) && _.isString(string2)) {
      let output = []
      let string = string2.trim().split(/[\n\r]+/)
      if (tag == 'p') {
        for (var i in string) {
          output.push(<p key={'p' + i}>{Parser(string[i].trim())}</p>)
        }
      } else if (tag == 'li') {
        for (var i in string) {
          output.push(<li>{Parser(string[i].trim())}</li>)
        }
      }
      return output
    }

    return string2
  }

  replaceNextLinesWithBrTag(string2) {
    let string = ''
    if (!_.isNull(string2) && _.isString(string2)) {
      string = string2.split('\n').join('<br/>')
    }
    return Parser(string)
  }

  handlePrevSampleClick() {
    const { currentSection, currentIndex } = this.props
    if (this.state.index > 0) {
      let jsonObjectForTracking = {
        eventLabel: 'previous_sample_btn',
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

      $('#scrollItToTop').scrollTop(0)
      this.setState(prevState => ({ index: prevState.index - 1 }))
    }
  }

  handleNextSampleClick(len) {
    const { currentSection, currentIndex } = this.props
    if (this.state.index < len - 1) {
      let jsonObjectForTracking = {
        eventLabel: 'next_sample_btn',
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

      $('#scrollItToTop').scrollTop(0)
      this.setState(prevState => ({ index: prevState.index + 1 }))
    }
  }

  renderLoading() {
    const { currentSection, tabIndex } = this.props

    let showSmallSampleAdjustments = false
    if (currentSection == 'Education' || currentSection == 'Headline') {
      showSmallSampleAdjustments = true
    }

    return (
      <div
        className={classNames('as-samples-loader-wrapper', {
          'as-small-samples-loader-wrapper': showSmallSampleAdjustments,
        })}>
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
              tabIndex={tabIndex}
              aria-label={editModalAriaLabel['loading_sample']}>
              Loading sample suggestions
            </span>
          </div>
        </div>
      </div>
    )
  }

  renderLoadingError() {
    const { currentSection, tabIndex } = this.props

    let showSmallSampleAdjustments = false
    if (currentSection == 'Education' || currentSection == 'Headline') {
      showSmallSampleAdjustments = true
    }

    return (
      <div
        className={classNames('as-samples-loader-wrapper', {
          'as-small-samples-loader-wrapper': showSmallSampleAdjustments,
        })}>
        <div className="mikepad-loading">
          <div className="as-api-error-img">
            <img
              src={`${process.env.APP_BASE_URL}dist/images/edit-screens/alert-icon.svg`}
              width="70px"
              alt="processing failed icon"
            />
          </div>
          <div className="text">
            <span
              tabIndex={tabIndex}
              aria-label={editModalAriaLabel['loading_sample_error']}>
              Some error occurred. Please try again later!
            </span>
          </div>
        </div>
      </div>
    )
  }

  getUniqueTemplates(templatesArray) {
    const { currentSection } = this.props
    let arrayOfTemplateIds = []
    let uniquetemplatesArray = _.filter(templatesArray, function(template) {
      if (template.hasOwnProperty('template_id')) {
        let checkIfAlreadyPresent = _.contains(
          arrayOfTemplateIds,
          template.template_id
        )
        if (!checkIfAlreadyPresent) {
          arrayOfTemplateIds.push(template.template_id)
          return true
        } else {
          return false
        }
      }
      return true
    })

    if (currentSection !== 'Education') {
      // swap 1st and 2nd templates
      if (uniquetemplatesArray.length > 1) {
        let temp = uniquetemplatesArray[0]
        uniquetemplatesArray[0] = uniquetemplatesArray[1]
        uniquetemplatesArray[1] = temp
      }
    }

    uniquetemplatesArray = _.map(uniquetemplatesArray, function(template) {
      let sampleHeading = ''
      if (template['template_id'] == 1) {
        sampleHeading = 'First Person'
      } else if (template['template_id'] == 2) {
        sampleHeading = 'Competency Focused'
      } else if (template['template_id'] == 3) {
        sampleHeading = 'Section Focused'
      }
      return _.extend({}, template, { heading: sampleHeading })
    })

    return uniquetemplatesArray
  }

  handleSampleScroll() {
    const { currentSection, currentIndex } = this.props
    if (!this.hasSampleScrolled) {
      this.hasSampleScrolled = true
      let jsonObjectForTracking = {
        eventLabel: 'sample_scrolled',
        currentSection: currentSection,
        currentIndex: currentIndex,
        currentSampleIndex: this.state.index,
      }
      this.sendTrackingDataDebounceSampleScrolled(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
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
            className="as-sample-indicator-dots as-sample-indicator-dots-light"
          />
        )
      } else {
        dots.push(
          <div
            key={i}
            className="as-sample-indicator-dots as-sample-indicator-dots-dark"
            onClick={() => this.handleDotClick(i)}
          />
        )
      }
    }

    return <div className="as-headline-suggestions-indicator">{dots}</div>
  }

  getPreviousButton(index, len) {
    if (index !== 0) {
      return (
        <button
          className="as-sample-btn as-sample-btn-prev"
          onClick={() => this.handlePrevSampleClick()}
          tabIndex={0}
          aria-label={editModalAriaLabel['previous_sample']}>
          <span className="glyphicon glyphicon-chevron-left as-sample-arrow" />
        </button>
      )
    } else {
      return (
        <button
          tabIndex={-1}
          className="as-sample-btn as-sample-btn-prev disabled">
          <span className="glyphicon glyphicon-chevron-left as-sample-arrow" />
        </button>
      )
    }
  }

  getNextButton(index, len) {
    if (index !== len - 1) {
      return (
        <button
          tabIndex={0}
          aria-label={editModalAriaLabel['next_sample']}
          className="as-sample-btn as-sample-btn-next"
          onClick={() => this.handleNextSampleClick(len)}>
          <span className="glyphicon glyphicon-chevron-right as-sample-arrow" />
        </button>
      )
    } else {
      return (
        <button
          tabIndex={-1}
          className="as-sample-btn as-sample-btn-next disabled">
          <span className="glyphicon glyphicon-chevron-right as-sample-arrow" />
        </button>
      )
    }
  }

  getPreviousButtonForProfilePicture(index, len) {
    if (index !== 0) {
      return (
        <button
          tabIndex={0}
          aria-label={'click to view previous sample'}
          className="as-profile-picture-sample-btn as-profile-picture-sample-btn-prev"
          type="button"
          onClick={() => this.handlePrevSampleClick()}>
          <span className="glyphicon glyphicon-chevron-left as-sample-arrow" />
        </button>
      )
    } else {
      return (
        <button
          tabIndex={-1}
          className="as-profile-picture-sample-btn as-profile-picture-sample-btn-prev disabled">
          <span className="glyphicon glyphicon-chevron-left as-sample-arrow" />
        </button>
      )
    }
  }

  getIndicatorForProfilePicture(index, len) {
    let dots = []
    for (let i = 0; i < len; i++) {
      if (i == index) {
        dots.push(
          <div className="as-profile-picture-indicator-dots as-profile-picture-indicator-dots-light" />
        )
      } else {
        dots.push(
          <div
            className="as-profile-picture-indicator-dots as-profile-picture-indicator-dots-dark"
            onClick={() => this.handleDotClick(i)}
          />
        )
      }
    }

    return <div className="as-profile-picture-indicator">{dots}</div>
  }

  getNextButtonForProfilePicture(index, len) {
    if (index !== len - 1) {
      return (
        <button
          tabIndex={0}
          type="button"
          aria-label={'Click to see the next sample'}
          className="as-profile-picture-sample-btn as-profile-picture-sample-btn-next"
          onClick={() => this.handleNextSampleClick(len)}>
          <span className="glyphicon glyphicon-chevron-right as-sample-arrow" />
        </button>
      )
    } else {
      return (
        <button
          tabIndex={-1}
          className="as-profile-picture-sample-btn as-profile-picture-sample-btn-next disabled">
          <span className="glyphicon glyphicon-chevron-right as-sample-arrow" />
        </button>
      )
    }
  }

  getSample(currentSection, index, sectionSamples) {
    if (currentSection == 'Experience') {
      if (_.isObject(sectionSamples[index]['template'])) {
        return (
          <div
            className="as-sample-example-text vertical-scroll"
            id="scrollItToTop"
            onScroll={this.handleSampleScroll}>
            <h3>{sectionSamples[index]['template']['title']}</h3>
            <p>{sectionSamples[index]['template']['sub_title']}</p>
            <p> {sectionSamples[index]['template']['duration']}</p>
            {this.wrapWithPara(sectionSamples[index]['template']['body'])}
          </div>
        )
      } else {
        return (
          <div
            className="as-sample-example-text vertical-scroll"
            id="scrollItToTop"
            onScroll={this.handleSampleScroll}>
            <p>
              {this.replaceNextLinesWithBrTag(
                sectionSamples[index]['template']
              )}
            </p>
          </div>
        )
      }
    } else if (currentSection == 'Summary') {
      return (
        <div
          className="as-sample-example-text as-sample-example-text-summary vertical-scroll"
          id="scrollItToTop"
          onScroll={this.handleSampleScroll}>
          <p>
            {this.replaceNextLinesWithBrTag(sectionSamples[index]['template'])}
          </p>
        </div>
      )
    } else if (currentSection == 'Education') {
      return (
        <div
          className="as-sample-example-text-education as-small-sample-example-text vertical-scroll"
          id="scrollItToTop"
          onScroll={this.handleSampleScroll}>
          <h3>{this.sectionSamples[this.state.index]['template']['title']}</h3>
          <p>
            {this.sectionSamples[this.state.index]['template']['sub_title']}
          </p>
          <p>
            {' '}
            {this.sectionSamples[this.state.index]['template']['duration']}
          </p>
          {this.wrapWithPara(
            this.sectionSamples[this.state.index]['template']['body']
          )}
        </div>
      )
    }

    return null
  }

  getProfilePictureSamples() {
    const { communityCustomisations } = this.props
    let northWesternCustomisation = !_.isNull(communityCustomisations)
      ? _.contains(
          communityCustomisations,
          'hide_smile_&_face_to_body_feedback'
        )
      : false
    this.len = imgSamples.length
    return (
      <div className="as-guide-container-picture">
        <div className="as-edit-heading-picture">
          <span
            tabIndex={0}
            aria-label={editModalAriaLabel['profile_picture']['sample']}>
            Sample Suggestions
          </span>
        </div>
        <div className="as-picture-sample-wrapper">
          <div className="as-picture-sample-img-container">
            <div className="as-picture-bg-color" />
            <div className="as-picture-bg-profile-pic"> </div>
            {this.getPreviousButtonForProfilePicture(
              this.state.index,
              this.len
            )}
            <div className="as-picture-sample-pic">
              {' '}
              <img
                alt=""
                src={imgSamples[this.state.index]['url']}
                className="suggestion-profile-img"
                height="175"
              />{' '}
            </div>
            {this.getNextButtonForProfilePicture(this.state.index, this.len)}
            {this.getIndicatorForProfilePicture(this.state.index, this.len)}
          </div>
          <div className="as-picture-sample-feedback-container">
            <div className="col-sm-6 as-picture-col">
              <ul className="profile-statu-pic">
                <li>
                  {' '}
                  <span
                    className={
                      'profile-status-icon ' +
                      imgColorMap[
                        imgSamples[this.state.index]['face_frame_ratio']
                      ]
                    }>
                    {
                      imgSymbolMap[
                        imgSamples[this.state.index]['face_frame_ratio']
                      ]
                    }{' '}
                  </span>{' '}
                  Face/Frame Ratio{' '}
                </li>
                <li>
                  {' '}
                  <span
                    className={
                      'profile-status-icon ' +
                      imgColorMap[
                        imgSamples[this.state.index]['background_detection']
                      ]
                    }>
                    {
                      imgSymbolMap[
                        imgSamples[this.state.index]['background_detection']
                      ]
                    }{' '}
                  </span>{' '}
                  Background Illumination{' '}
                </li>
                {northWesternCustomisation ? null : (
                  <li>
                    {' '}
                    <span
                      className={
                        'profile-status-icon ' +
                        imgColorMap[
                          imgSamples[this.state.index]['face_body_ratio']
                        ]
                      }>
                      {
                        imgSymbolMap[
                          imgSamples[this.state.index]['face_body_ratio']
                        ]
                      }{' '}
                    </span>{' '}
                    Face/Body Ratio{' '}
                  </li>
                )}
              </ul>
            </div>
            <div className="col-sm-6 as-picture-col">
              <ul className="profile-statu-pic">
                <li>
                  {' '}
                  <span
                    className={
                      'profile-status-icon ' +
                      imgColorMap[
                        imgSamples[this.state.index]['foreground_detection']
                      ]
                    }>
                    {
                      imgSymbolMap[
                        imgSamples[this.state.index]['foreground_detection']
                      ]
                    }{' '}
                  </span>{' '}
                  Foreground Illumination{' '}
                </li>
                <li>
                  {' '}
                  <span
                    className={
                      'profile-status-icon ' +
                      imgColorMap[imgSamples[this.state.index]['eye_contact']]
                    }>
                    {imgSymbolMap[imgSamples[this.state.index]['eye_contact']]}{' '}
                  </span>{' '}
                  Eye Contact{' '}
                </li>
                {northWesternCustomisation ? null : (
                  <li>
                    {' '}
                    <span
                      className={
                        'profile-status-icon ' +
                        imgColorMap[imgSamples[this.state.index]['smile']]
                      }>
                      {imgSymbolMap[imgSamples[this.state.index]['smile']]}{' '}
                    </span>{' '}
                    Smile Detection{' '}
                  </li>
                )}
                <br />
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      showHeading,
      showSubHeading,
      currentSection,
      fetchingSamples,
      fetchedSamples,
      errorSamples,
      samples,
    } = this.props

    let sample = null
    let heading = null
    let showSmallSampleAdjustments = false

    if (currentSection == 'Profile Picture') {
      return this.getProfilePictureSamples()
    }

    if (currentSection == 'Education' || currentSection == 'Headline') {
      showSmallSampleAdjustments = true
    }

    let headingText = 'Sample Illustrations'
    if (currentSection == 'Summary') {
      headingText = 'Summary generated for you'
    } else if (currentSection == 'Experience') {
      headingText = 'Suggestion for you'
    }

    if (showHeading == true) {
      heading = (
        <div className="as-guide-heading-wrapper">
          <div className="as-guide-heading-img-wrapper">
            <img
              src={`${process.env.APP_BASE_URL}dist/images/edit-screens/sample-heading-icon.svg`}
              alt=""
              className="as-guide-heading-img"
            />{' '}
          </div>
          <div className="as-guide-heading-text">{headingText}</div>
        </div>
      )
    }

    if (currentSection == 'Education') {
      heading = (
        <div className="as-all-lists-heading-wrapper">
          <div className="as-all-lists-heading-img-wrapper">
            <img
              src={`${process.env.APP_BASE_URL}dist/images/edit-screens/headline-sample-heading-icon.svg`}
              alt=""
              className="as-all-lists-heading-img"
            />{' '}
          </div>
          <div className="as-all-lists-heading-text">
            <span
              tabIndex={0}
              aria-label={'Here are few sample suggestions for you'}>
              Here are few sample suggestions for you
            </span>
          </div>
        </div>
      )
    }

    if (fetchedSamples && !fetchingSamples && !errorSamples) {
      this.sectionSamples = this.getUniqueTemplates(samples)
      this.len = this.sectionSamples.length

      let template = this.getSample(
        currentSection,
        this.state.index,
        this.sectionSamples
      )
      let subHeading = null

      if (showSubHeading == true) {
        subHeading = (
          <div className="as-sample-heading">
            {this.sectionSamples[this.state.index]['heading']}
          </div>
        )
      }

      sample = (
        <div
          className={classNames('as-sample-wrapper', {
            'as-small-sample-wrapper': showSmallSampleAdjustments,
          })}>
          {heading}
          <div
            className={classNames('as-sample-example', {
              'as-small-sample-example': showSmallSampleAdjustments,
            })}>
            {subHeading}
            {template}
            <div
              className={classNames('as-sample-bottom', {
                'as-small-sample-bottom': showSmallSampleAdjustments,
              })}>
              <div
                className={classNames('as-sample-bottom-buttons', {
                  'as-small-sample-bottom-buttons': showSmallSampleAdjustments,
                })}>
                {this.getPreviousButton(this.state.index, this.len)}
                {this.getIndicatorDots(this.state.index, this.len)}
                {this.getNextButton(this.state.index, this.len)}
              </div>
              <div className="clearfix" />
            </div>
          </div>
        </div>
      )
    } else if (fetchedSamples && !fetchingSamples && errorSamples) {
      sample = this.renderLoadingError()
    } else {
      sample = this.renderLoading()
    }

    return (
      <div
        className={classNames('as-guide-container', {
          'as-small-guide-container': showSmallSampleAdjustments,
        })}>
        {sample}
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentSection } = this.props
    if (currentSection == 'Profile Picture') {
      let url = imgSamples[this.state.index]['url']
      $('.as-picture-bg-profile-pic').css(
        'background-image',
        'url(' + url + ')'
      )
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleSampleScroll)
    const { currentSection } = this.props
    if (currentSection == 'Profile Picture') {
      let url = imgSamples[this.state.index]['url']
      $('.as-picture-bg-profile-pic').css(
        'background-image',
        'url(' + url + ')'
      )
    }
  }

  componentWillUnmount() {
    const { updateNewSamplesState } = this.props
    window.removeEventListener('scroll', this.handleSampleScroll)
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fetchingSamples: state.aspireSamplesData.fetching,
    fetchedSamples: state.aspireSamplesData.fetched,
    errorSamples: state.aspireSamplesData.error,
    samples: state.aspireSamplesData.samples,
    communityCustomisations: state.AspireCommunityCustomisation.customisations,
  }
}

export default connect(
  mapStateToProps,
  { fetchNewSamples, updateNewSamplesState }
)(SamplesGuide)
