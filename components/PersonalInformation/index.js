import React, { Component } from 'react'
import _ from 'underscore'
import { Panel, PanelGroup } from 'react-bootstrap'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import {
  colorMap,
  symbolMap,
  feedbackContent,
  connectionBullet,
} from '../Constants/PersonalInformationFeedback'
import { personalInformationFeedbackAriaLabel } from '../Constants/AriaLabelText'
import { InfoComponent } from '../HelperComponent/FeedbackBlock'
import InfoScreens from '../InfoScreens'

export default class PersonalInformation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showInfoScreen: false,
      lastFocusedElement: null,
    }
    this.handleTracking = this.handleTracking.bind(this)
    this.handlePanelCollapse = this.handlePanelCollapse.bind(this)
    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 1500, true)
    this.toggleInfoScreen = this.toggleInfoScreen.bind(this)
  }

  UNSAFE_componentWillMount() {
    this.props.setSelectedPanelPersonalInfo('name')
  }

  toggleInfoScreen() {
    this.setState({
      showInfoScreen: !this.state.showInfoScreen,
    })
  }

  setFocusOnActiveElement() {
    this.setState({ lastFocusedElement: document.activeElement })
  }

  getElementFocusedOnModalClose() {
    if (this.state.lastFocusedElement) {
      setTimeout(() => {
        this.state.lastFocusedElement.focus()
      }, 1)
    }
  }

  handleTracking(module) {
    let countOfAvailableClick = 3
    let jsonObjectForTracking = {
      eventLabel: 'feedback_panel_nav_personal_information_click_info',
      currentSection: 'Personal Information',
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

  renderTop(sectionColor) {
    const { tabIndex } = this.props
    if (!_.isEmpty(sectionColor)) {
      sectionColor = sectionColor[0]['color']
      return (
        <div>
          <h2
            tabIndex={tabIndex}
            aria-label={personalInformationFeedbackAriaLabel[sectionColor]}
            className={'text-' + sectionColor}>
            {' '}
            {feedbackContent[sectionColor]['title_text']}{' '}
          </h2>
          {feedbackContent[sectionColor]['body']}
        </div>
      )
    }

    return null
  }

  renderFeedbackMapText(section, color, feedback) {
    let connections_threshold = 500
    if (feedback.hasOwnProperty('connections_threshold')) {
      connections_threshold = feedback['connections_threshold']
    }
    let feedbackMap = personalInformationFeedbackAriaLabel['feedbackMap']
    if (!_.isEmpty(section) && !_.isEmpty(color)) {
      return feedbackMap[section][color]
    }
    return null
  }

  handlePanelCollapse(activeKey) {
    let selected = 'name'
    if (activeKey == 1) {
      selected = 'name'
    } else if (activeKey == 2) {
      selected = 'profile_url'
    } else if (activeKey == 3) {
      selected = 'connections'
    }

    this.props.setSelectedPanelPersonalInfo(selected)
    this.handleTracking(selected)
  }

  render() {
    const { currentSection, feedback, sectionWiseText, tabIndex } = this.props
    let currentTab = tabIndex
    return (
      <div>
        <div className="feedback-panel">
          {this.renderTop(feedback['section_score'])}
          <InfoComponent
            tabIndex={currentTab}
            icon="connections"
            bullet={connectionBullet}
            showInfoBtn={true}
            infoFunction={this.toggleInfoScreen}
          />
          <PanelGroup
            accordion
            id="profile-picture-panel"
            defaultActiveKey="1"
            onSelect={this.handlePanelCollapse}>
            <Panel eventKey="1">
              <Panel.Heading>
                <Panel.Title className="ps-personal">
                  <Panel.Toggle
                    className="ps-panel-toggle-btn"
                    componentClass="button"
                    tabIndex={currentTab}
                    aria-label={`${
                      personalInformationFeedbackAriaLabel['feedbackMap'][
                        'name'
                      ][feedback['name']]
                    } Click to know more`}>
                    <div className="ps-icon">
                      <div
                        className={'info-icon ' + colorMap[feedback['name']]}>
                        <span> {symbolMap[feedback['name']]} </span>
                      </div>
                    </div>
                    <div className="ps-body">
                      <p>
                        {' '}
                        <strong>Profile Name</strong>{' '}
                      </p>
                    </div>
                  </Panel.Toggle>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                {this.renderFeedbackMapText('name', feedback['name'], feedback)}
              </Panel.Body>
            </Panel>
            <Panel eventKey="2">
              <Panel.Heading>
                <Panel.Title className="ps-personal">
                  <Panel.Toggle
                    className="ps-panel-toggle-btn"
                    componentClass="button"
                    tabIndex={currentTab + 2}
                    aria-label={`${
                      personalInformationFeedbackAriaLabel['feedbackMap'][
                        'url'
                      ][feedback['url']]
                    } Click to know more`}>
                    <div className="ps-icon">
                      <div className={'info-icon ' + colorMap[feedback['url']]}>
                        <span> {symbolMap[feedback['url']]} </span>
                      </div>
                    </div>
                    <div className="ps-body">
                      <p>
                        {' '}
                        <strong>Profile URL</strong>{' '}
                      </p>
                    </div>
                  </Panel.Toggle>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                {this.renderFeedbackMapText('url', feedback['url'], feedback)}
              </Panel.Body>
            </Panel>
          </PanelGroup>
        </div>
        <InfoScreens
          show={this.state.showInfoScreen}
          module="connection"
          hideModal={this.toggleInfoScreen}
          extendModalClass="info-connection-modal"
        />
      </div>
    )
  }
}
