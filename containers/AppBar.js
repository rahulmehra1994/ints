import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Overlay from 'react-bootstrap/lib/Overlay'
import Popover from 'react-bootstrap/lib/Popover'
import { Dropdown, MenuItem } from 'react-bootstrap'
import UploadResume from '../components/LoginScreens/UploadResume'
import UploadPdf from '../components/LoginScreens/UploadPdf'
import ChangeFunction from '../components/LoginScreens/ChangeFunction'
import IntegrateToLinkedIn from '../components/LoginScreens/IntegrateToLinkedIn'
import { notification } from '../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import {
  updateResumeState,
  updatePdfState,
  updateFunctionState,
} from '../actions/Login'
import { generatePdf } from '../actions/GeneratePdf'
import { updateEditedDataState } from '../actions/Edit'
import {
  checkForRendering,
  showFeedbackModal,
} from '../actions/CustomerFeedback'
import { downloadImage } from '../actions/ImageUpload'
import CustomerFeedback from '../components/CustomerFeedback/CustomerFeedback'
import constants from '../config/constants'
import _ from 'underscore'
import { startTour } from '../tour/Action'
import { Modal, ModalBody } from '@vmockinc/dashboard/Common/commonComps/Modal'
import FocusLock from 'react-focus-lock'
import { Link, NavLink } from 'react-router-dom'

const timeOutMilliseconds = 2000
let isCalled = false

class AppBar extends Component {
  constructor() {
    super()
    this.state = {
      showResumeModal: false,
      showTargetFuncModal: false,
      show: true,
      lastFocusedElement: null,
      showDirectIntegrationModal: false,
      integratePopOver: true,
    }
    this.tabIndex = 10
    this.targetFunctionBackToFrontEndMapping = {}
    this.newResumeFetchId = 0 // Don't need re-rendering on change of this value. Hence not in state
    this.newPdfFetchId = 0 // Don't need re-rendering on change of this value. Hence not in state
    this.newFunctionFetchId = 0 // Don't need re-rendering on change of this.
    this.newUploadedAtEdit = 0 // Don't need re-rendering on change of this.
    this.displayPdfModal = this.displayPdfModal.bind(this)
    this.displayResumeModal = this.displayResumeModal.bind(this)
    this.displayTargetFuncModal = this.displayTargetFuncModal.bind(this)
    this.displayDirectIntegrationModal = this.displayDirectIntegrationModal.bind(
      this
    )
    this.hideResumeModal = this.hideResumeModal.bind(this)
    this.hidePdfModal = this.hidePdfModal.bind(this)
    this.hideTargetFuncModal = this.hideTargetFuncModal.bind(this)
    this.hideDirectIntegrationModal = this.hideDirectIntegrationModal.bind(this)
    this.handleTourClick = this.handleTourClick.bind(this)
    this.downloadPdf = this.downloadPdf.bind(this)
    this.downloadImage = this.downloadImage.bind(this)
    this.giveFeedback = this.giveFeedback.bind(this)
    this.handleOnMouseOverAddResume = this.handleOnMouseOverAddResume.bind(this)
    this.handleOnMouseOutAddResume = this.handleOnMouseOutAddResume.bind(this)
    this.handleThreeDotsClickTracking = this.handleThreeDotsClickTracking.bind(
      this
    )
    this.giveFeedbackDebounce = _.debounce(this.giveFeedback, 5000, true)
    this.downloadPdfDebounce = _.debounce(this.downloadPdf, 5000, true)
    this.downloadImageDebounce = _.debounce(this.downloadImage, 5000, true)
    this.debounceTime = 5000
    this.sendTrackingDataDebounce = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebounceResume = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebouncePdf = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebounceTf = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebounceTour = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebounceSummaryBtn = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebounceDetailedBtn = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebounceDownloadPdf = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebounceGiveFeedbackBtn = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebounceThreeDotsBtn = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
  }

  UNSAFE_componentWillMount() {
    const { functions } = this.props
    this.targetFunctionBackToFrontEndMapping = functions['mapping']
  }

  componentDidMount() {
    const { status } = this.props
    if (status == 'wrong_resume') {
      notification('Wrong resume file uploaded !', 'error', timeOutMilliseconds)
    } else if (status == 'wrong_pdf') {
      notification('Wrong pdf file uploaded !', 'error', timeOutMilliseconds)
    } else if (status == 'invalid_pdf') {
      notification('Invalid pdf file uploaded !', 'error', timeOutMilliseconds)
    } else if (status == 'unsupported_language') {
      notification(
        "Currently, we don't support this language in LinkedIn pdf. We have notified our tech team and will reach back to you soon.",
        'error',
        4000
      )
    }

    setTimeout(() => {
      this.setState({ show: false, integratePopOver: false })
    }, 3000)
  }

  // For any logId, if same resume/pdf is being re-uplaoded, need not reprocess
  componentDidUpdate() {
    const {
      uploaded_resume,
      uploaded_pdf,
      uploaded_edited_data,
      changed_function,
      visited_sections,
      customerFeedback,
    } = this.props
    // let isOpenAlready = customerFeedback.isOpen
    let detailed_personal_info = 0
    let detailed_profile_picture = 0
    let detailed_headline = 0
    let detailed_summary = 0
    let detailed_experience = 0
    let detailed_education = 0

    if (visited_sections.hasOwnProperty('detailed_personal_info')) {
      detailed_personal_info = visited_sections['detailed_personal_info']
    }

    if (visited_sections.hasOwnProperty('detailed_profile_picture')) {
      detailed_profile_picture = visited_sections['detailed_profile_picture']
    }

    if (visited_sections.hasOwnProperty('detailed_headline')) {
      detailed_headline = visited_sections['detailed_headline']
    }

    if (visited_sections.hasOwnProperty('detailed_summary')) {
      detailed_summary = visited_sections['detailed_summary']
    }

    if (visited_sections.hasOwnProperty('detailed_experience')) {
      detailed_experience = visited_sections['detailed_experience']
    }

    if (visited_sections.hasOwnProperty('detailed_education')) {
      detailed_education = visited_sections['detailed_education']
    }

    if (
      detailed_personal_info &&
      detailed_profile_picture &&
      detailed_headline &&
      detailed_summary &&
      detailed_experience &&
      detailed_education &&
      !isCalled
    ) {
      isCalled = true
      let interval = constants.interval
      interval = interval * 60 * 1000
      const { checkForRendering } = this.props
      setTimeout(function() {
        checkForRendering()
      }, interval)
    }

    if (uploaded_resume == true) {
      const { fetchId, idResume, feedback_fetching, fetchResume } = this.props
      if (idResume == fetchId || idResume == this.newResumeFetchId) {
        if (feedback_fetching == false) {
          const { updateResumeState } = this.props
          updateResumeState({
            updateKeys: [['uploading_resume'], ['uploaded_resume']],
            data: { uploading_resume: false, uploaded_resume: false },
          })
          this.newResumeFetchId = 0
        }
      } else {
        this.newResumeFetchId = idResume
        fetchResume(idResume)
      }
    }

    if (uploaded_pdf == true) {
      const { fetchId, idPdf, feedback_fetching, fetchPdf } = this.props
      if (idPdf == fetchId || idPdf == this.newPdfFetchId) {
        if (feedback_fetching == false) {
          const { updatePdfState } = this.props
          updatePdfState({
            updateKeys: [['uploading_pdf'], ['uploaded_pdf']],
            data: { uploading_pdf: false, uploaded_pdf: false },
          })
          this.newPdfFetchId = 0
        }
      } else {
        this.newPdfFetchId = idPdf
        fetchPdf(idPdf)
      }
    }

    if (changed_function == true) {
      const {
        fetchId,
        idFunction,
        feedback_fetching,
        fetchChangedFunction,
      } = this.props
      if (idFunction == fetchId || idFunction == this.newFunctionFetchId) {
        if (feedback_fetching == false) {
          const { updateFunctionState } = this.props
          updateFunctionState({
            updateKeys: [['changing_function'], ['changed_function']],
            data: { changing_function: false, changed_function: false },
          })
        }
      } else {
        this.newFunctionFetchId = idFunction
        fetchChangedFunction(idFunction)
      }
    }

    if (uploaded_edited_data == true) {
      const {
        idEdit,
        uploadedAtEdit,
        feedback_fetching,
        fetchEditedData,
      } = this.props
      // Previous log id may be same as current one, if same section,subsection is being edited
      if (uploadedAtEdit == this.newUploadedAtEdit) {
        if (feedback_fetching == false) {
          const { updateEditedDataState } = this.props
          updateEditedDataState({
            updateKeys: [['uploading_edited_data'], ['uploaded_edited_data']],
            data: { uploading_edited_data: false, uploaded_edited_data: false },
          })
        }
      } else {
        this.newUploadedAtEdit = uploadedAtEdit
        fetchEditedData(idEdit)
      }
    }
  }

  handleThreeDotsClickTracking(buttonDisabled) {
    if (!buttonDisabled) {
      this.sendTrackingDataDebounceThreeDotsBtn(
        'event',
        'aspire_appbar',
        'click',
        'three_dots_btn'
      )
    } else {
      this.sendTrackingDataDebounceThreeDotsBtn(
        'event',
        'aspire_appbar',
        'click',
        'disabled_three_dots_btn'
      )
    }
  }

  handleTourClick() {
    this.sendTrackingDataDebounceTour(
      'event',
      'aspire_appbar',
      'click',
      'tour_btn'
    )
    this.props.startTour()
  }

  displayResumeModal() {
    this.sendTrackingDataDebounceResume(
      'event',
      'aspire_appbar',
      'click',
      'resume_modal_open'
    )
    this.setState({ lastFocusedElement: document.activeElement })
    this.setState({ showResumeModal: true })
  }

  hideResumeModal(type = 'outside') {
    if (type == 'close_btn') {
      sendTrackingData(
        'event',
        'aspire_appbar',
        'click',
        'resume_modal_close_btn'
      )
    } else {
      sendTrackingData('event', 'aspire_appbar', 'click', 'resume_modal_close')
    }
    this.setState({ showResumeModal: false })
    if (this.state.lastFocusedElement) {
      setTimeout(() => {
        this.state.lastFocusedElement.focus()
      }, 1)
    }
  }

  displayPdfModal() {
    this.sendTrackingDataDebouncePdf(
      'event',
      'aspire_appbar',
      'click',
      'pdf_modal_open'
    )
    const { updatePdfState } = this.props

    updatePdfState({
      updateKeys: [['showPdfModal']],
      data: { showPdfModal: true },
    })
  }

  hidePdfModal(type = 'outside') {
    if (type == 'close_btn') {
      sendTrackingData('event', 'aspire_appbar', 'click', 'pdf_modal_close_btn')
    } else {
      sendTrackingData('event', 'aspire_appbar', 'click', 'pdf_modal_close')
    }
    const { updatePdfState } = this.props
    updatePdfState({
      updateKeys: [['showPdfModal']],
      data: { showPdfModal: false },
    })
  }

  displayTargetFuncModal() {
    const { processingStatus } = this.props
    if (!(processingStatus == 'processing' || _.isNull(processingStatus))) {
      this.sendTrackingDataDebounceTf(
        'event',
        'aspire_appbar',
        'click',
        'target_functions_modal_open'
      )
      this.setState({ lastFocusedElement: document.activeElement })

      this.setState({ showTargetFuncModal: true })
    }
  }

  hideTargetFuncModal(type = 'outside') {
    if (type == 'close_btn') {
      sendTrackingData(
        'event',
        'aspire_appbar',
        'click',
        'target_functions_modal_close_btn'
      )
    } else {
      sendTrackingData(
        'event',
        'aspire_appbar',
        'click',
        'target_functions_modal_close'
      )
    }
    this.setState({ showTargetFuncModal: false })
    if (this.state.lastFocusedElement) {
      setTimeout(() => {
        this.state.lastFocusedElement.focus()
      }, 1)
    }
  }

  displayDirectIntegrationModal() {
    this.setState({ lastFocusedElement: document.activeElement })
    this.setState({
      showDirectIntegrationModal: true,
    })
    if (this.props.sectionToSuggestCopy.firstUpdate) {
      this.setState({
        integratePopOver: false,
      })
    }
    this.sendTrackingDataDebounce(
      'event',
      'aspire_appbar',
      'click',
      'integration_modal_open'
    )
  }

  hideDirectIntegrationModal() {
    this.setState({
      showDirectIntegrationModal: false,
    })
    if (this.state.lastFocusedElement) {
      setTimeout(() => {
        this.state.lastFocusedElement.focus()
      }, 1)
    }
    this.sendTrackingDataDebounce(
      'event',
      'aspire_integration_modal',
      'click',
      'integration_modal_close'
    )
  }

  downloadPdf() {
    this.sendTrackingDataDebounceDownloadPdf(
      'event',
      'aspire_appbar',
      'click',
      'download_pdf_btn'
    )

    if (!_.isEmpty(this.props.loaderInput)) {
      this.sendTrackingDataDebounce(
        'process',
        'aspire_appbar',
        'notify_error',
        'cannot_download_pdf_until_processing_complete'
      )
      notification(
        'Cannot download PDF until current processing is complete.',
        'error',
        timeOutMilliseconds
      )
      return
    }

    const { generatePdf } = this.props
    let data = $.extend(true, {}, this.props.ui.sectionWiseTextStatic)
    data['personal_information'][0][
      'info'
    ] = this.props.ui.sectionWiseTextPdf.personal_information
    generatePdf(data)
  }

  downloadImage(url) {
    this.sendTrackingDataDebounceDownloadPdf(
      'event',
      'aspire_integration_modal',
      'click',
      'download_image_btn'
    )

    const { downloadImage } = this.props
    downloadImage(url)
  }

  giveFeedback() {
    this.props.showFeedbackModal()
    this.sendTrackingDataDebounceGiveFeedbackBtn(
      'event',
      'aspire_appbar',
      'click',
      'give_feedback_btn'
    )
  }

  handleOnMouseOverAddResume() {
    this.setState({ show: true })
  }

  handleOnMouseOutAddResume() {
    this.setState({ show: false })
  }

  render() {
    const {
      fetchId,
      targetJobFunctions,
      resumeFiles,
      loaderInput,
      status,
      processingStatus,
      tourStatus,
      allCapsResume,
      allSmallResume,
      normalResume,
      logId,
      sectionToSuggestCopy,
      feedbackData,
      linkedInUrl,
      isEditOpen,
      page,
    } = this.props
    let tabIndex = this.tabIndex

    let resumeFullFileName = 'No ' + allSmallResume

    if (!_.isEmpty(resumeFiles['current'])) {
      resumeFullFileName = resumeFiles['current']
    }

    let resumeFileNamePopOver = (
      <Popover id="popover-resume-filename">
        <strong>{resumeFullFileName}</strong>
      </Popover>
    )

    let addResumeText = !_.isEmpty(resumeFiles['current'])
      ? 'Change ' + allSmallResume
      : 'Add ' + allSmallResume
    let addResume = (
      <a
        href="javascript:void(0);"
        className="appbar-add-resume-btn js-detailed-add-resume cursor-pointer"
        tabIndex={tabIndex}
        aria-label={`Click to ${addResumeText}, Resume will be processed automatically once uploaded`}
        onClick={() => this.displayResumeModal()}>
        {' '}
        {addResumeText}{' '}
      </a>
    )
    if (processingStatus == 'processing' || _.isNull(processingStatus)) {
      addResume = (
        <a
          href="javascript:void(0);"
          className="appbar-add-resume-btn js-detailed-add-resume cursor-not-allowed"
          tabIndex={tabIndex}
          aria-label="Please wait processing is going on"
          disabled>
          {' '}
          {addResumeText}{' '}
        </a>
      )
    }

    let addResumeBtn = (
      <OverlayTrigger
        trigger={['hover']}
        rootClose
        placement="bottom"
        overlay={resumeFileNamePopOver}>
        <li>{addResume}</li>
      </OverlayTrigger>
    )

    if (_.isEmpty(resumeFiles['current'])) {
      addResumeBtn = (
        <span>
          <li
            className="add-resume-btn-margin"
            ref={button => {
              this.target = button
            }}
            onMouseOver={this.handleOnMouseOverAddResume}
            onMouseOut={this.handleOnMouseOutAddResume}>
            {addResume}
          </li>
          <Overlay
            rootClose
            show={this.state.show}
            target={() => ReactDOM.findDOMNode(this.target)}
            placement="bottom">
            <Popover id="popover-resume-filename">
              <strong>Add your resume for personalised feedback</strong>
            </Popover>
          </Overlay>
        </span>
      )
    }
    let seeTargetFunctions = []
    let noOfTargetFunctions = null
    let targetFunctionsModalButton = null
    if (processingStatus == 'processing' || _.isNull(processingStatus)) {
      noOfTargetFunctions = targetJobFunctions.length + ' target function(s)'
      seeTargetFunctions.push(
        targetJobFunctions.map((value, key) => (
          <div>{this.targetFunctionBackToFrontEndMapping[value]}</div>
        ))
      )
      targetFunctionsModalButton = (
        <a
          id="target_functions_modal_btn"
          role="button"
          className="appbar-btn-tf cursor-not-allowed js-detailed-target-functions"
          tabIndex={tabIndex}
          aria-label="Your profile is being processed, please wait"
          href="javascript:void(0);">
          {' '}
          <img
            src={`${process.env.APP_BASE_URL}dist/images/target-icon.svg`}
            alt=""
            className="tf-modal-btn-img"
            height="18px"
          />
          {noOfTargetFunctions}{' '}
        </a>
      )
    } else {
      noOfTargetFunctions = targetJobFunctions.length + ' target function(s)'
      seeTargetFunctions.push(
        targetJobFunctions.map((value, key) => (
          <div>{this.targetFunctionBackToFrontEndMapping[value]}</div>
        ))
      )
      targetFunctionsModalButton = (
        <a
          role="button"
          className="appbar-btn-tf js-detailed-target-functions"
          href="javascript:void(0);"
          data-toggle="modal"
          data-target="#select-target-function"
          tabIndex={tabIndex}
          aria-label="Click to change target functions, Profile will be processed automatically after you update target functions"
          onClick={() => this.displayTargetFuncModal()}>
          {' '}
          <img
            src={`${process.env.APP_BASE_URL}dist/images/target-icon.svg`}
            alt=""
            className="tf-modal-btn-img"
            height="18px"
          />{' '}
          {noOfTargetFunctions}{' '}
        </a>
      )
    }

    let popOverTargetFunctions = (
      <Popover id="popover-target-functions">{seeTargetFunctions}</Popover>
    )
    let disabledTourButton =
      page === 'summary' ||
      processingStatus == 'processing' ||
      _.isNull(processingStatus)
    let threeDotsBtn = (
      <Dropdown
        disabled={disabledTourButton}
        onClick={() => this.handleThreeDotsClickTracking(disabledTourButton)}
        id="three-dots-dropdown"
        className="three-dots-dropdown">
        <Dropdown.Toggle
          tabIndex={tabIndex}
          noCaret
          className="three-dots-toggle-btn text-btn">
          <img
            src={`${process.env.APP_BASE_URL}dist/images/appbar-three-dots.svg`}
            alt="menu btn"
            width="25px"
            height="25px"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu className="three-dots-menu">
          <MenuItem
            className="three-dots-menu-item"
            onSelect={this.downloadPdfDebounce}
            eventKey="1">
            Download PDF
          </MenuItem>
          <MenuItem
            className="three-dots-menu-item"
            onSelect={this.giveFeedbackDebounce}
            eventKey="2">
            Give Feedback
          </MenuItem>
          <MenuItem
            className="three-dots-menu-item"
            onSelect={this.handleTourClick}
            eventKey="3">
            Tour
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    )

    let popOverIntegrateToLinkedIn = (
      <Popover id="popover-contained-integration">
        <strong>Click to start integrating your changes with LinkedIn</strong>
      </Popover>
    )

    let linkedinIntegrationButton = (
      <button
        id="integrate-button"
        className="btn btn-primary integrate-to-linkedin-appbar-btn"
        ref={button => {
          this.integrateButton = button
        }}
        onClick={this.displayDirectIntegrationModal}
        tabIndex={tabIndex}
        aria-label={
          'Click to ingrate changes into your linkedin profile button'
        }>
        Integrate with LinkedIn
      </button>
    )

    if (processingStatus == 'processing' || _.isNull(processingStatus)) {
      linkedinIntegrationButton = (
        <button
          id="integrate-button"
          className="btn btn-primary integrate-to-linkedin-appbar-btn cursor-not-allowed"
          ref={button => {
            this.integrateButton = button
          }}
          tabIndex={tabIndex}
          aria-label={
            'Click to ingrate changes into your linkedin profile button disabled'
          }
          disabled>
          Integrate with LinkedIn
        </button>
      )
    }
    let linkedinIntegrationButtonWithOverlay = (
      <OverlayTrigger
        trigger={['hover']}
        placement="bottom"
        rootClose
        overlay={popOverIntegrateToLinkedIn}>
        {linkedinIntegrationButton}
      </OverlayTrigger>
    )
    if (
      sectionToSuggestCopy.firstUpdate &&
      this.state.integratePopOver &&
      !isEditOpen
    ) {
      linkedinIntegrationButtonWithOverlay = []
      linkedinIntegrationButtonWithOverlay.push([
        linkedinIntegrationButton,
        <Overlay
          show={true}
          target={() => ReactDOM.findDOMNode(this.integrateButton)}
          placement="bottom"
          containerPadding={20}>
          {popOverIntegrateToLinkedIn}
        </Overlay>,
      ])
    }
    return (
      <div
        role="main"
        aria-labelledby="start-of-content"
        tabIndex={10}
        id="start-of-content">
        <div className="container-fluid aspire-nav outer-border">
          <div className="row">
            <div className={'col-sm-4'}>
              <div className="text-left">
                <ul
                  className="nav-bar-nav"
                  role="navigation"
                  aria-label="profile feedback navigation">
                  <li>
                    {' '}
                    <NavLink
                      to={`${process.env.APP_BASE_URL}${fetchId}/feedback/summary`}
                      tabIndex={tabIndex}
                      aria-label="Click to know overview of your linkedin profile"
                      activeClassName="active"
                      data-key="summary"
                      onClick={() => {
                        this.sendTrackingDataDebounceSummaryBtn(
                          'event',
                          'aspire_appbar',
                          'click',
                          'summary_btn'
                        )
                      }}>
                      Summary
                    </NavLink>{' '}
                  </li>
                  <li> | </li>
                  <li>
                    {' '}
                    <NavLink
                      to={`${process.env.APP_BASE_URL}${fetchId}/feedback/detailed`}
                      tabIndex={tabIndex}
                      aria-label="Click to know detailed feedback of your linkedin profile"
                      activeClassName="active"
                      data-key="detailed"
                      onClick={() => {
                        this.sendTrackingDataDebounceDetailedBtn(
                          'event',
                          'aspire_appbar',
                          'click',
                          'detailed_feedback_btn'
                        )
                      }}>
                      Detailed Feedback
                    </NavLink>{' '}
                  </li>
                </ul>
              </div>
            </div>
            <div className={'col-sm-8'}>
              <div className="text-right">
                <ul
                  className="nav-bar-right"
                  role="navigation"
                  aria-label="user settings navigation">
                  {addResumeBtn}
                  <OverlayTrigger
                    trigger={['hover']}
                    rootClose
                    placement="bottom"
                    overlay={popOverTargetFunctions}>
                    <li
                      key="numberOfFunctions"
                      className="tf-blue-txt cursor-default">
                      {targetFunctionsModalButton}
                    </li>
                  </OverlayTrigger>
                  <li>{linkedinIntegrationButtonWithOverlay}</li>
                  {threeDotsBtn}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div role="dialog" aria-label="Upload latest resume" aria-modal={true}>
          <FocusLock disabled={!this.state.showResumeModal} returnFocus={true}>
            <Modal
              isOpen={this.state.showResumeModal}
              onRequestHide={() => this.hideResumeModal('outside')}
              className="as-resume-modal">
              <ModalBody>
                <UploadResume
                  id={fetchId}
                  hideModal={this.hideResumeModal}
                  topFour={resumeFiles['top_four']}
                  currentResume={resumeFiles['current']}
                />
              </ModalBody>
            </Modal>
          </FocusLock>
        </div>
        <div
          role="dialog"
          aria-label="Upload full profile PDF"
          aria-modal={true}>
          <FocusLock disabled={!this.props.showPdfModal} returnFocus={true}>
            <Modal
              className="pupup-center pdf-upload-modal"
              isOpen={this.props.showPdfModal}
              onRequestHide={() => this.hidePdfModal('outside')}>
              <ModalBody>
                <UploadPdf id={fetchId} hideModal={this.hidePdfModal} />
              </ModalBody>
            </Modal>
          </FocusLock>
        </div>
        <div
          role="dialog"
          aria-label="Change target functions"
          aria-modal={true}>
          <FocusLock
            disabled={!this.state.showTargetFuncModal}
            returnFocus={true}>
            <Modal
              id="select-target-function"
              isOpen={this.state.showTargetFuncModal}
              onRequestHide={() => this.hideTargetFuncModal('outside')}
              className="sf-modal">
              <ModalBody>
                <ChangeFunction
                  id={fetchId}
                  jobFuncs={targetJobFunctions}
                  hideModal={this.hideTargetFuncModal}
                />
              </ModalBody>
            </Modal>
          </FocusLock>
        </div>
        <div
          role="dialog"
          aria-label="Integrate changes into your linkedin profile"
          aria-modal={true}>
          <FocusLock
            disabled={!this.state.showDirectIntegrationModal}
            returnFocus={true}>
            <Modal
              id="linkedin-integration"
              isOpen={this.state.showDirectIntegrationModal}
              onRequestHide={() => this.hideDirectIntegrationModal('outside')}
              className="linkedin-integration-modal">
              <ModalBody>
                <IntegrateToLinkedIn
                  id={fetchId}
                  hideModal={this.hideDirectIntegrationModal}
                  sectionToSuggestCopy={sectionToSuggestCopy.section_array}
                  feedbackData={feedbackData}
                  downloadImage={this.downloadImageDebounce}
                  linkedInUrl={linkedInUrl}
                />
              </ModalBody>
            </Modal>
          </FocusLock>
        </div>
        <div
          role="dialog"
          aria-label="Customer feedback form"
          aria-modal={true}>
          <CustomerFeedback />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    idResume: state.uploadResume.id,
    idPdf: state.uploadPdf.id,
    idFunction: state.changeFunction.id,
    idEdit: state.editData.id,
    uploadedAtEdit: state.editData.uploaded_at,
    uploaded_resume: state.uploadResume.uploaded_resume,
    uploaded_pdf: state.uploadPdf.uploaded_pdf,
    changed_function: state.changeFunction.changed_function,
    uploaded_edited_data: state.editData.uploaded_edited_data,
    feedback_fetching: state.aspireFeedbackData.fetching,
    status: state.aspireFeedbackData.status,
    showPdfModal: state.uploadPdf.showPdfModal,
    processingStatus: state.aspireFeedbackData.status,
    loaderInput: state.aspireFeedbackData.mini_loader_text,
    tourStatus: state.tour.tourStatus,
    allCapsResume: state.aspireFeedbackData.allCapsResume,
    allSmallResume: state.aspireFeedbackData.allSmallResume,
    normalResume: state.aspireFeedbackData.normalResume,
    ui: state.detailedFeedbackUi,
    functions: state.aspireFunctionMappings.function_mappings,
    visited_sections: state.aspireFeedbackData.visited_sections,
    customerFeedback: state.CustomerFeedback,
    logId: state.aspireFeedbackData.log_id,
    sectionToSuggestCopy: state.aspireFeedbackData.sectionToSuggestCopy,
    feedbackData: state.aspireFeedbackData.data.section_wise_feedback,
    linkedInUrl: state.aspireFeedbackData.data.linkedin_url,
    isEditOpen: state.detailedFeedbackUi.isEditOpen,
  }
}
export default connect(mapStateToProps, {
  updateResumeState,
  updatePdfState,
  updateFunctionState,
  updateEditedDataState,
  startTour,
  generatePdf,
  checkForRendering,
  showFeedbackModal,
  downloadImage,
})(AppBar)
