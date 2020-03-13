import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Panel, PanelGroup } from 'react-bootstrap'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import InfoScreens from '../InfoScreens'
import {
  feedbackContentProfilePicture,
  feedbackMap,
} from '../Constants/DetailedFeedbackText'
import {
  profilePictureFeedbackAriaLabel,
  infoScreenConnectLabel,
} from '../Constants/AriaLabelText'
import { InfoComponent } from '../HelperComponent/FeedbackBlock'
import { northwesternCustom } from '../Constants/CommunityCustomisationText'

const colorMap = {
  green: 'color-green',
  yellow: 'color-orange',
  red: 'color-red',
  gray: 'color-gray',
}

const symbolMap = {
  green: <span className="fa fa-check" aria-hidden="true" />,
  yellow: <span className="fa fa-exclamation" aria-hidden="true" />,
  red: <span className="fa fa-times" aria-hidden="true" />,
}

class ProfilePicture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showInfoScreen: false,
      activeInfoScreen: '',
    }
    this.showInfoModal = this.showInfoModal.bind(this)
    this.hideInfoModal = this.hideInfoModal.bind(this)
    this.sendTrackingDataDebounceInfoModal = _.debounce(
      sendTrackingData,
      3000,
      true
    )
    this.handleTracking = this.handleTracking.bind(this)
    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 1500, true)
    this.countOfAvailableClick = 0
  }

  renderTop(sectionColor, sectionEmpty) {
    const { tabIndex } = this.props
    if (sectionEmpty == true) {
      return (
        <div>
          <h2
            className="text-red"
            tabIndex={tabIndex}
            aria-label={
              profilePictureFeedbackAriaLabel['empty']['title_text'] +
              ' ' +
              profilePictureFeedbackAriaLabel['empty']['body']
            }>
            {' '}
            {feedbackContentProfilePicture['empty']['title_text']}
          </h2>
          {feedbackContentProfilePicture['empty']['body']}
        </div>
      )
    }

    if (!_.isEmpty(sectionColor)) {
      sectionColor = sectionColor[0]['color']
      return (
        <div>
          <h2
            className={'text-' + sectionColor}
            tabIndex={tabIndex}
            aria-label={
              profilePictureFeedbackAriaLabel[sectionColor]['title_text'] +
              ' ' +
              profilePictureFeedbackAriaLabel[sectionColor]['body']
            }>
            {' '}
            {feedbackContentProfilePicture[sectionColor]['title_text']}
          </h2>
          {feedbackContentProfilePicture[sectionColor]['body']}
        </div>
      )
    }
    return null
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

  renderFeedback(parameter, title, feedback) {
    const { tabIndex } = this.props
    if (_.isUndefined(feedback['color_feedback'])) {
      let content = feedbackMap[parameter]['gray']
      let eventKey = feedbackMap[parameter]['key']

      let header = (
        <Panel.Title className="ps-personal">
          <Panel.Toggle
            componentClass="button"
            className="ps-panel-toggle-btn"
            tabIndex={tabIndex}
            aria-label={content}>
            <div className="ps-icon">
              <div className={'info-icon ' + colorMap['gray']}>
                <span> </span>
              </div>
            </div>
            <div className="ps-body">
              <p>
                {' '}
                <strong> {title} </strong>{' '}
              </p>
            </div>
          </Panel.Toggle>
        </Panel.Title>
      )

      return [
        <Panel key={eventKey} eventKey={eventKey}>
          <Panel.Heading>{header}</Panel.Heading>
          <Panel.Body collapsible>{content}</Panel.Body>
        </Panel>,
        'not_detected',
      ]
    } else {
      let content = feedbackMap[parameter][feedback['color_feedback']]
      let eventKey = feedbackMap[parameter]['key']

      let header = (
        <Panel.Title className="ps-personal">
          <Panel.Toggle
            componentClass="button"
            className="ps-panel-toggle-btn"
            tabIndex={tabIndex}
            aria-label={content}>
            <div className="ps-icon">
              <div
                className={'info-icon ' + colorMap[feedback['color_feedback']]}>
                <span> {symbolMap[feedback['color_feedback']]} </span>
              </div>
            </div>
            <div className="ps-body">
              <p>
                <strong>{title}</strong>
              </p>
            </div>
          </Panel.Toggle>
        </Panel.Title>
      )

      return [
        <Panel key={eventKey} eventKey={eventKey}>
          <Panel.Heading>{header}</Panel.Heading>
          <Panel.Body collapsible>{content}</Panel.Body>
        </Panel>,
        'detected',
      ]
    }
  }

  handleTracking(module) {
    let countOfAvailableClick = this.countOfAvailableClick

    let jsonObjectForTracking = {
      eventLabel: 'feedback_panel_nav_profile_picture_click_info',
      currentSection: 'Profile Picture',
      selectedModule: module,
      countOfAvailableClick: countOfAvailableClick,
    }
    this.sendTrackingDataDebounce(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  render() {
    const {
      currentSection,
      feedback,
      sectionWiseText,
      tabIndex,
      customisations,
      customisationError,
    } = this.props
    let currentTab = tabIndex
    let sectionEmpty = _.isEmpty(sectionWiseText['imageUrl'])
    let output = { detected: [], not_detected: [] }
    let showNorthwesternComponent = false
    if (sectionEmpty != true) {
      let params = [
        ['face_frame_ratio', 'Face/Frame Ratio'],
        ['background', 'Background Illumination'],
        ['foreground', 'Foreground Illumination'],
        ['face_body_ratio', 'Face/Body Ratio'],
        ['pupil', 'Eye Contact'],
        ['smile', 'Smile Detection'],
      ]
      if (!_.isNull(customisations)) {
        if (_.contains(customisations, 'hide_smile_&_face_to_body_feedback')) {
          params = [
            ['face_frame_ratio', 'Face/Frame Ratio'],
            ['background', 'Background Illumination'],
            ['foreground', 'Foreground Illumination'],
            ['pupil', 'Eye Contact'],
          ]
          showNorthwesternComponent = true
        }
      }

      for (let i = 0; i < params.length; i++) {
        let t = this.renderFeedback(
          params[i][0],
          params[i][1],
          feedback[params[i][0]]
        )
        if (!_.isNull(t)) {
          output[t[1]].push(t[0])
        }
      }
    }

    this.countOfAvailableClick = _.size(output['detected'])

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
          {this.renderTop(feedback['section_score'], sectionEmpty)}
          <PanelGroup id="personal-info-panel" accordion defaultActiveKey="1">
            {showNorthwesternComponent ? (
              <InfoComponent
                tabIndex={currentTab}
                icon="insight"
                bullet={northwesternCustom.bullet}
              />
            ) : null}
            {output['detected']}
          </PanelGroup>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    customisations: state.AspireCommunityCustomisation.customisations,
  }
}

export default connect(
  mapStateToProps,
  {}
)(ProfilePicture)
