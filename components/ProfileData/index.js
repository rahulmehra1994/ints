import React, { Component } from 'react'
import { connect } from 'react-redux'
import PdfData from './PdfData'
import EditScreens from '../EditScreens'
import LogScreen from '../LogScreen'
import { processEditedData } from '../../actions/Edit'
import { updateText } from '../../actions/DetailedFeedback'
import { fetchPdf } from '../../actions/GeneratePdf'
import InfoScreens from '../InfoScreens'
import { Dropdown, MenuItem } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Popover from 'react-bootstrap/lib/Popover'
import $ from 'jquery'
import _ from 'underscore'
import classNames from 'classnames'
import { notification, checkIfEmpty } from '../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
// import Modal from 'react-bootstrap/lib/Modal'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@vmockinc/dashboard/Common/commonComps/Modal'
import FocusLock, { MoveFocusInside } from 'react-focus-lock'
import 'jquery-highlight'
import { editScreenAriaLabel } from '../Constants/AriaLabelText'

const timeOutMilliseconds = 2000

const sectionUnderscore = {
  'Personal Information': 'personal_information',
  'Profile Picture': 'profile_picture',
  Headline: 'headline',
  Summary: 'summary',
  Experience: 'experience',
  Education: 'education',
}

const tabIndexesSequence = {
  personalInformation: {
    name: 11,
    profile_url: 13,
    connections: 15,
  },
}

class ProfileData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      showLogModal: false,
      activeEditSection: 'Personal Information',
      activeLogSection: 'Personal Information',
      showInfoScreen: false,
      activeInfoScreen: '',
      showConfirmDelete: false,
      showConfirmEditClose: false,
      lastFocusedElement: null,
    }

    this.showEditModal = this.showEditModal.bind(this)
    this.hideEditModal = this.hideEditModal.bind(this)
    this.showLogModal = this.showLogModal.bind(this)
    this.hideLogModal = this.hideLogModal.bind(this)
    this.renderTextData = this.renderTextData.bind(this)
    this.showInfoModal = this.showInfoModal.bind(this)
    this.hideInfoModal = this.hideInfoModal.bind(this)
    this.showConfirmDeleteModal = this.showConfirmDeleteModal.bind(this)
    this.hideConfirmDeleteModal = this.hideConfirmDeleteModal.bind(this)
    this.showConfirmEditCloseModal = this.showConfirmEditCloseModal.bind(this)
    this.hideConfirmEditCloseModal = this.hideConfirmEditCloseModal.bind(this)
    this.handleThreeDotsClickTracking = this.handleThreeDotsClickTracking.bind(
      this
    )
    this.handleDisabledLogBtnTracking = this.handleDisabledLogBtnTracking.bind(
      this
    )
    this.debounceTime = 2000
    this.sendTrackingDataDebounce = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
    this.sendTrackingDataDebounceAddSection = _.debounce(
      sendTrackingData,
      2000,
      true
    )
    this.sendTrackingDataDebounceDeleteSection = _.debounce(
      sendTrackingData,
      2000,
      true
    )
    this.sendTrackingDataDebounceStartWriting = _.debounce(
      sendTrackingData,
      2000,
      true
    )
    this.sendTrackingDataDebounceEditModal = _.debounce(
      sendTrackingData,
      1000,
      true
    )
    this.sendTrackingDataDebounceLogModal = _.debounce(
      sendTrackingData,
      1000,
      true
    )
    this.sendTrackingDataDebounceInfoModal = _.debounce(
      sendTrackingData,
      2000,
      true
    )
    this.sendTrackingDataDebounceThreeDotsBtn = _.debounce(
      sendTrackingData,
      this.debounceTime,
      true
    )
  }

  replaceImageWithAvatarIfNotPresent(id) {
    $('#' + id).on('error', function() {
      $(this).attr(
        'src',
        `${process.env.APP_BASE_URL}dist/images/profile-avatar.png`
      )
      $(this).attr('alt', 'profile picture not uploaded')
    })
  }

  UNSAFE_componentWillUpdate() {
    this.replaceImageWithAvatarIfNotPresent('profile-data-img')
    this.replaceImageWithAvatarIfNotPresent('profile-data-img-1')
    let selectedPanel = this.props.selectedPanelPersonalInfo
    let id = '#' + selectedPanel
    $(id).unhighlight()
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      updateEditSection,
      editSectionUpdated,
      ui,
      section_wise_feedback,
      updateText,
      newSubSection,
    } = this.props

    const { section, sectionWiseText } = ui
    this.props.underlineSpellError()
    $('.highlight').attr('tabindex', 11)
    $('.highlight-div').attr('tabindex', 11)
    if (this.props.currentSection == 'Personal Information') {
      let selectedPanel = this.props.selectedPanelPersonalInfo
      let id = '#' + selectedPanel

      if (selectedPanel == 'connections') {
        let connections = null
        if (
          section_wise_feedback.hasOwnProperty(
            'personal_information_feedback'
          ) &&
          section_wise_feedback['personal_information_feedback'].hasOwnProperty(
            'connections_score_class'
          ) &&
          section_wise_feedback['personal_information_feedback'][
            'connections_score_class'
          ].hasOwnProperty('connections')
        ) {
          connections =
            section_wise_feedback['personal_information_feedback'][
              'connections_score_class'
            ]['connections']
        }

        if (!_.isNull(connections)) {
          $(id).highlight(connections.toString(), {
            wordsOnly: true,
            wordsBoundaryStart: '(?:[\\b\\W]|^)',
            wordsBoundaryEnd: '(?:[\\b\\W]|$)',
          })
          $(id)
            .find('span')
            .attr(
              'tabindex',
              tabIndexesSequence['personalInformation'][selectedPanel]
            )
        } else {
          $(id).highlight(sectionWiseText[selectedPanel])
          $(id)
            .find('span')
            .attr(
              'tabindex',
              tabIndexesSequence['personalInformation'][selectedPanel]
            )
        }
      } else {
        $(id).highlight(sectionWiseText[selectedPanel])
        $(id)
          .find('span')
          .attr(
            'tabindex',
            tabIndexesSequence['personalInformation'][selectedPanel]
          )
      }
    }

    // if (updateEditSection === true && !_.isEmpty(sectionWiseText[sectionUnderscore[section]])) {
    //   this.props.changeNewSubSectionValue(false)
    // }

    if (this.state.showModal === true && updateEditSection === true) {
      editSectionUpdated()
    }

    if (this.state.showModal === true) {
      $('.div-overlay-opacity').addClass('as-unset-opacity')
      $('.div-over-overlay').addClass('as-unset-opacity')
    }

    if (prevState.showModal === true && this.state.showModal === false) {
      $('.div-overlay-opacity').removeClass('as-unset-opacity')
      $('.div-over-overlay').removeClass('as-unset-opacity')
    }
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

  editButton(sectionName) {
    let logButton = null
    let editButton = null
    let logs = this.props.ui['logs']
    let currIndex = this.props.ui[sectionName]['currentIndex']
    let tabIndex = this.props.tabIndex

    if (
      logs.hasOwnProperty(sectionName) &&
      logs[sectionName].hasOwnProperty(currIndex)
    ) {
      if (this.props.currentSection == sectionName) {
        var logOverlay = (
          <Popover
            id={'popover-contained'}
            aria-label="log status available"
            style={{ zIndex: 25 }}>
            <strong>
              Click this button to see the history of previous edited versions
              of the section.
            </strong>
          </Popover>
        )

        logButton = (
          <li className="js-detailed-log-button">
            <OverlayTrigger
              key={'overlay-log-' + sectionName}
              trigger={['focus', 'hover']}
              rootClose
              placement="bottom"
              overlay={logOverlay}
              container={this}>
              <a
                href="javascript:void(0);"
                tabIndex={tabIndex}
                aria-label={editScreenAriaLabel['logButtonActive']}
                onClick={() => this.showLogModal(sectionName)}>
                <img
                  src={`${process.env.APP_BASE_URL}dist/images/redo-blue.png`}
                  alt="Edit"
                />
              </a>
            </OverlayTrigger>
          </li>
        )
      } else {
        logButton = (
          <li className="js-detailed-log-button">
            <a
              href="javascript:void(0);"
              tabIndex={-1}
              aria-hidden={true}
              onClick={() => this.showLogModal(sectionName)}>
              <img
                src={`${process.env.APP_BASE_URL}dist/images/redo-blue.png`}
                alt="Edit"
              />
            </a>
          </li>
        )
      }
    } else {
      if (this.props.currentSection == sectionName) {
        var logOverlay = (
          <Popover
            id={'popover-contained'}
            aria-label="log status not available"
            style={{ zIndex: 25 }}>
            <strong>
              See the history of previous edited versions of the section. You
              have no edits yet.
            </strong>
          </Popover>
        )

        logButton = (
          <li className="js-detailed-log-button">
            <OverlayTrigger
              key={'overlay-log-' + sectionName}
              trigger={['focus', 'hover']}
              rootClose
              placement="bottom"
              overlay={logOverlay}
              container={this}>
              <a
                href="javascript:void(0);"
                onClick={() => this.handleDisabledLogBtnTracking(sectionName)}
                tabIndex={tabIndex}
                aria-label={editScreenAriaLabel['logButtonInactive']}>
                <img
                  src={`${process.env.APP_BASE_URL}dist/images/redo-gray.png`}
                  alt="Edit"
                />
              </a>
            </OverlayTrigger>
          </li>
        )
      } else {
        logButton = (
          <li className="js-detailed-log-button">
            <a tabIndex={-1} aria-hidden={true} href="javascript:void(0);">
              <img
                src={`${process.env.APP_BASE_URL}dist/images/redo-gray.png`}
                alt="Edit"
              />
            </a>
          </li>
        )
      }
    }

    if (this.props.currentSection == sectionName) {
      let editOverlay = (
        <Popover
          id={'popover-contained'}
          aria-label="popover"
          style={{ zIndex: 25 }}>
          <strong>
            Try the edit mode to instantly see the effect any changes have on
            your score!
          </strong>
        </Popover>
      )

      editButton = (
        <li className="js-detailed-edit-button">
          <a
            href="javascript:void(0);"
            tabIndex={tabIndex}
            aria-label={editScreenAriaLabel['editButton']}
            onClick={() => this.showEditModal(sectionName)}>
            <OverlayTrigger
              key={'overlay-edit-' + sectionName}
              trigger={['focus', 'hover']}
              rootClose
              placement="bottom"
              overlay={editOverlay}
              container={this}>
              <img
                src={`${process.env.APP_BASE_URL}dist/images/edit.png`}
                alt="Edit"
              />
            </OverlayTrigger>
          </a>
        </li>
      )
    } else {
      editButton = (
        <li className="js-detailed-edit-button">
          <a
            tabIndex={-1}
            aria-hidden={true}
            href="javascript:void(0);"
            onClick={() => this.showEditModal(sectionName)}>
            <img
              src={`${process.env.APP_BASE_URL}dist/images/edit.png`}
              alt="Edit"
            />
          </a>
        </li>
      )
    }

    return (
      <div className="edit-col z-index-9995 js-detailed-edit-log-buttons">
        <ul>
          {editButton}
          {logButton}
        </ul>
      </div>
    )
  }

  editButton68(sectionName, tabIndex) {
    let editButton = null
    let logButton = null
    let logs = this.props.ui['logs']
    let currIndex = this.props.ui[sectionName]['currentIndex']

    if (
      logs.hasOwnProperty(sectionName) &&
      logs[sectionName].hasOwnProperty(currIndex)
    ) {
      if (this.props.currentSection == sectionName) {
        var logOverlay = (
          <Popover
            id={'popover-contained'}
            aria-label="popover"
            style={{ zIndex: 25 }}>
            <strong>
              Click this button to see the history of previous edited versions
              of the section.
            </strong>
          </Popover>
        )

        logButton = (
          <li className="js-detailed-log-button">
            <OverlayTrigger
              key={'overlay-log-' + sectionName}
              trigger={['focus', 'hover']}
              rootClose
              placement="bottom"
              overlay={logOverlay}
              container={this}>
              <a
                tabIndex={tabIndex}
                aria-label={editScreenAriaLabel['logButtonActive']}
                href="javascript:void(0);"
                onClick={() => this.showLogModal(sectionName)}>
                <img
                  src={`${process.env.APP_BASE_URL}dist/images/redo-blue.png`}
                  alt="Edit"
                />
              </a>
            </OverlayTrigger>
          </li>
        )
      } else {
        logButton = (
          <li className="js-detailed-log-button">
            <a
              href="javascript:void(0);"
              tabIndex={-1}
              aria-hidden={true}
              onClick={() => this.showLogModal(sectionName)}>
              <img
                src={`${process.env.APP_BASE_URL}dist/images/redo-blue.png`}
                alt="Edit"
              />
            </a>
          </li>
        )
      }
    } else {
      if (this.props.currentSection == sectionName) {
        var logOverlay = (
          <Popover
            id={'popover-contained'}
            aria-label="popover"
            style={{ zIndex: 25 }}>
            <strong>
              See the history of previous edited versions of the section. You
              have no edits yet.
            </strong>
          </Popover>
        )

        logButton = (
          <li className="js-detailed-log-button">
            <OverlayTrigger
              key={'overlay-log-' + sectionName}
              trigger={['focus', 'hover']}
              rootClose
              placement="bottom"
              overlay={logOverlay}
              container={this}>
              <a
                tabIndex={tabIndex}
                aria-label={editScreenAriaLabel['logButtonInactive']}
                href="javascript:void(0);"
                onClick={() => this.handleDisabledLogBtnTracking(sectionName)}>
                <img
                  src={`${process.env.APP_BASE_URL}dist/images/redo-gray.png`}
                  alt="Edit"
                />
              </a>
            </OverlayTrigger>
          </li>
        )
      } else {
        logButton = (
          <li className="js-detailed-log-button">
            <a tabIndex={-1} href="javascript:void(0);" aria-hidden={true}>
              <img
                src={`${process.env.APP_BASE_URL}dist/images/redo-gray.png`}
                alt="Edit"
              />
            </a>
          </li>
        )
      }
    }

    if (this.props.currentSection == sectionName) {
      let editOverlay = (
        <Popover
          id={'popover-contained'}
          aria-label="popover"
          style={{ zIndex: 25 }}>
          <strong>
            Try the edit mode to instantly see the effect any changes have on
            your score!
          </strong>
        </Popover>
      )

      editButton = (
        <li className="js-detailed-edit-button">
          <a
            tabIndex={tabIndex}
            aria-label={editScreenAriaLabel['editButton']}
            href="javascript:void(0);"
            onClick={() => this.showEditModal(sectionName)}>
            <OverlayTrigger
              key={'overlay-edit-' + sectionName}
              trigger={['focus', 'hover']}
              rootClose
              placement="bottom"
              overlay={editOverlay}
              container={this}>
              <img
                src={`${process.env.APP_BASE_URL}dist/images/edit.png`}
                alt="Edit"
              />
            </OverlayTrigger>
          </a>
        </li>
      )
    } else {
      editButton = (
        <li className="js-detailed-edit-button">
          <a
            href="javascript:void(0);"
            aria-hidden={true}
            tabIndex={-1}
            onClick={() => this.showEditModal(sectionName)}>
            <img
              src={`${process.env.APP_BASE_URL}dist/images/edit.png`}
              alt="Edit"
            />
          </a>
        </li>
      )
    }

    return (
      <div className="edit-col top68 z-index-9995 js-detailed-edit-log-buttons">
        <ul>
          {editButton}
          {logButton}
        </ul>
      </div>
    )
  }

  startWritingTracking() {
    let jsonObjectForTracking = {
      eventLabel: 'start_writing_btn',
      currentSection: this.props.currentSection,
    }
    this.sendTrackingDataDebounceStartWriting(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  addNewSection() {
    let jsonObjectForTracking = {
      eventLabel: 'add_new_section_btn',
      currentSection: this.props.currentSection,
    }
    this.sendTrackingDataDebounceAddSection(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )

    if (!_.isEmpty(this.props.loaderInput)) {
      this.sendTrackingDataDebounce(
        'process',
        'aspire_detailed_feedback_screen',
        'notify_error',
        'cannot_process_until_current_complete'
      )
      notification(
        'Cannot process new data until current processing is complete.',
        'error',
        timeOutMilliseconds
      )
      return
    }

    this.showEditModal(this.props.currentSection, true)
  }

  deleteSection() {
    const {
      fetchId,
      currentSection,
      processEditedData,
      loaderInput,
    } = this.props
    let currentIndex = this.props.ui[currentSection]['currentIndex']
    this.hideConfirmDeleteModal()

    let jsonObjectForTracking = {
      eventLabel: 'delete_section_btn',
      currentSection: currentSection,
      currentIndex: currentIndex,
    }

    this.sendTrackingDataDebounceDeleteSection(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )

    if (!_.isEmpty(loaderInput)) {
      this.sendTrackingDataDebounce(
        'process',
        'aspire_detailed_feedback_screen',
        'notify_error',
        'cannot_process_until_current_complete'
      )
      notification(
        'Cannot process new data until current processing is complete.',
        'error',
        timeOutMilliseconds
      )
      return
    }

    let countSections = _.size(
      this.props.ui.sectionWiseTextStatic[sectionUnderscore[currentSection]]
    )
    let score = this.props.ui.sections[currentSection]['section_score'][
      currentIndex
    ]['score']
    // Delete edit action to api
    processEditedData(
      fetchId,
      currentSection,
      currentIndex,
      countSections,
      false,
      {},
      '',
      {},
      score,
      true,
      false
    )
  }

  showEditModal(sectionName, newSubSection = false) {
    if (!_.isEmpty(this.props.loaderInput)) {
      this.sendTrackingDataDebounce(
        'process',
        'aspire_detailed_feedback_screen',
        'notify_error',
        'cannot_process_until_current_complete'
      )
      notification(
        'Please wait for the processing to complete.',
        'error',
        timeOutMilliseconds
      )
      return
    }

    this.props.changeNewSubSectionValue(newSubSection)
    const {
      editedSection,
      editedSubSectionId,
      editedSectionDeleted,
      changeModalState,
      ui,
    } = this.props

    // editedSectionDeleted is true only during delete
    let currentIndex = this.props.ui[sectionName]['currentIndex']
    if (newSubSection == true) {
      currentIndex = sectionName + '_new'
    }

    if (
      this.props.currentSection == sectionName &&
      !(
        editedSectionDeleted == true &&
        editedSection == sectionName &&
        currentIndex == editedSubSectionId
      )
    ) {
      this.setFocusOnActiveElement()
      this.setState({ showModal: true, activeEditSection: sectionName })
      changeModalState('edit', true)
      this.props.updateText({
        updateKeys: [
          ['isEditOpen'],
          ['currentEditSection'],
          ['currentEditSectionIndex'],
        ],
        data: {
          isEditOpen: true,
          currentEditSection: sectionName,
          currentEditSectionIndex: currentIndex,
        },
      })

      let jsonObjectForTracking = {
        eventLabel: newSubSection ? 'new_sub_section' : 'edit_sub_section',
        sectionName: sectionName,
        subSectionId: newSubSection
          ? null
          : this.props.ui[sectionName]['currentIndex'],
      }

      this.sendTrackingDataDebounceEditModal(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
      return
    }
  }

  hideEditModal(
    currentSection,
    currentIndex,
    sectionWiseTextEditable,
    sectionWiseTextStatic,
    profilePictureConfirmClose = false
  ) {
    const { processingStatus } = this.props
    if (processingStatus == 'processing' || _.isNull(processingStatus)) {
      this.hideEditModalActual()
    } else if (
      currentSection == 'profile_picture' &&
      profilePictureConfirmClose
    ) {
      this.showConfirmEditCloseModal()
    } else if (
      typeof currentIndex == 'string' &&
      currentIndex.indexOf('_new') >= 0
    ) {
      if (checkIfEmpty(sectionWiseTextEditable[currentIndex], currentSection)) {
        this.hideEditModalActual()
      } else {
        this.showConfirmEditCloseModal()
      }
    } else {
      if (
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ===
        JSON.stringify(sectionWiseTextStatic[currentIndex])
      ) {
        this.hideEditModalActual()
      } else {
        this.showConfirmEditCloseModal()
      }
    }
    $('body').removeClass('modal-open')
  }

  hideEditModalActual() {
    const { changeModalState, editedSubSectionId } = this.props
    this.setState({ showModal: false, activeEditSection: '' })
    this.props.changeNewSubSectionValue(false)
    this.getElementFocusedOnModalClose()
    changeModalState('edit', false)
    this.props.updateText({
      updateKeys: [
        ['isEditOpen'],
        ['currentEditSection'],
        ['currentEditSectionIndex'],
      ],
      data: {
        isEditOpen: false,
        currentEditSection: '',
        currentEditSectionIndex: '',
      },
    })
    this.hideConfirmEditCloseModal()
    $('body').removeClass('modal-open')
    $('#integrate-button').focus()
  }

  showConfirmEditCloseModal() {
    this.setState({ showConfirmEditClose: true })
  }

  hideConfirmEditCloseModal() {
    this.setState({ showConfirmEditClose: false })
    $('body').removeClass('modal-open')
  }

  showLogModal(sectionName) {
    const {
      editedSection,
      editedSubSectionId,
      editedSectionDeleted,
      changeModalState,
    } = this.props

    // editedSectionDeleted is true only during delete
    if (
      this.props.currentSection == sectionName &&
      !(
        editedSectionDeleted == true &&
        editedSection == sectionName &&
        this.props.ui[sectionName]['currentIndex'] == editedSubSectionId
      )
    ) {
      this.setFocusOnActiveElement()
      this.setState({ showLogModal: true, activeLogSection: sectionName })
      changeModalState('log', true)

      let jsonObjectForTracking = {
        eventLabel: 'log_modal_open',
        sectionName: sectionName,
        subSectionId: this.props.ui[sectionName]['currentIndex'],
      }

      this.sendTrackingDataDebounceLogModal(
        'event',
        'aspire_detailed_feedback_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
    }
  }

  handleDisabledLogBtnTracking(sectionName) {
    let jsonObjectForTracking = {
      eventLabel: 'disabled_log_btn_click',
      sectionName: sectionName,
      subSectionId: this.props.ui[sectionName]['currentIndex'],
    }

    this.sendTrackingDataDebounceLogModal(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
  }

  hideLogModal() {
    const {
      changeModalState,
      editedSectionDeleted,
      editedSubSectionId,
    } = this.props
    this.setState({ showLogModal: false, activeLogSection: '' })
    this.getElementFocusedOnModalClose()
    changeModalState('log', false)

    // let jsonObjectForTracking = {
    //   'eventLabel': 'log_modal_close',
    //   'subSectionId': editedSubSectionId
    // }

    // sendTrackingData('event','aspire_detailed_feedback_screen','click',JSON.stringify(jsonObjectForTracking))
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
    // sendTrackingData('event','aspire_info_screen_close','click',this.state.activeInfoScreen)
    this.setState({ showInfoScreen: false, activeInfoScreen: '' })
  }

  showConfirmDeleteModal() {
    if (!_.isEmpty(this.props.loaderInput)) {
      this.sendTrackingDataDebounce(
        'process',
        'aspire_detailed_feedback_screen',
        'notify_error',
        'cannot_process_until_current_complete'
      )
      notification(
        'Cannot process new data until current processing is complete.',
        'error',
        timeOutMilliseconds
      )
      return
    }

    this.setState({ showConfirmDelete: true })
  }

  hideConfirmDeleteModal() {
    this.setState({ showConfirmDelete: false })
  }

  handleThreeDotsClickTracking() {
    this.sendTrackingDataDebounceThreeDotsBtn(
      'event',
      'aspire_detailed_feedback_screen',
      'click',
      'three_dots_btn'
    )
  }

  handlePrev(index, sectionName) {
    const { onSelectPrev, currentSection } = this.props
    onSelectPrev(index, sectionName, currentSection)
  }

  handleNext(index, len, sectionName) {
    const { onSelectNext, currentSection } = this.props
    onSelectNext(index, len, sectionName, currentSection)
  }

  handleMouseOver(e) {
    let id = $(e.target)
      .closest('[data-id]')
      .data('id')
    $('#' + id).css({ color: '#000000' })
  }

  handleMouseOut(e) {
    let id = $(e.target)
      .closest('[data-id]')
      .data('id')
    $('#' + id).css({ color: '#828282' })
  }

  handleMouseOverDots(e) {
    let id = $(e.target)
      .closest('[data-id]')
      .data('id')
    $('#' + id).css({ 'background-color': 'gainsboro' })
  }

  handleMouseOutDots(e) {
    let id = $(e.target)
      .closest('[data-id]')
      .data('id')
    $('#' + id).css({ 'background-color': 'white' })
  }

  fetchImageUrl(url) {
    if (_.isEmpty(url)) {
      return `${process.env.APP_BASE_URL}dist/images/profile-avatar.png`
    }

    return url
  }

  renderSummary(summaryData, activeSummary, firstDivId, tabIndex) {
    if (
      _.isEmpty(summaryData) ||
      (summaryData.hasOwnProperty('text') &&
        summaryData['text'].length == 1 &&
        summaryData['text'][0]['text'][0] == 'N/A')
    ) {
      if (this.props.currentSection == 'Summary') {
        return (
          <div
            id="Summary"
            data-section="Summary"
            className={
              'profile contnet-left border-radius-top-none ' + activeSummary
            }>
            <div>
              <div className="profile active-section border-radius-top-none">
                <p className="p-heading-3">
                  You have not written this section{' '}
                </p>
                <a
                  className="btn2 btn btn-primary"
                  href="javascript:void(0);"
                  tabIndex={tabIndex}
                  aria-label={
                    'You have not written this section, Click and start writing'
                  }
                  onClick={() => {
                    this.startWritingTracking()
                    this.showEditModal('Summary', true)
                  }}>
                  Start writing{' '}
                  <span className="glyphicon glyphicon glyphicon-pencil" />{' '}
                </a>
                <div className="clearfix" />
                <br />
                <br />
              </div>
            </div>
            <div className="clearfix" />
          </div>
        )
      } else {
        return <div className="clearfix summary-margin" />
      }
    }

    let data = (
      <div
        id="summary"
        data-section="Summary"
        className={
          'profile contnet-left border-radius-top-none ' + activeSummary
        }>
        <div>
          {this.renderTextData(
            summaryData['text'],
            'Summary',
            !_.isUndefined(firstDivId) && firstDivId.hasOwnProperty(0)
              ? firstDivId[0]
              : 10000
          )}
          {this.editButton('Summary')}
        </div>
        <div className="clearfix" />
      </div>
    )

    if (_.isEmpty(activeSummary)) {
      return (
        <div
          className="div-over-overlay div-overlay-opacity"
          onClick={e => this.props.onSelectSection(e, 'profile_data')}
          data-key="Summary">
          {data}
        </div>
      )
    } else {
      return data
    }
  }

  render68(experienceData, sectionName, firstDivId, tabIndex) {
    if (_.isEmpty(experienceData)) {
      if (this.props.currentSection == sectionName) {
        return (
          <div id={sectionUnderscore[sectionName]} data-section={sectionName}>
            <div className="profile active-section border-radius-top-none">
              <p className="p-heading-3">You have not written this section </p>
              <a
                className="btn2 btn btn-primary"
                href="javascript:void(0);"
                tabIndex={tabIndex}
                aria-label="You have not written this section, click and start writing"
                onClick={() => {
                  this.startWritingTracking()
                  this.showEditModal(sectionName, true)
                }}>
                Start writing{' '}
                <span className="glyphicon glyphicon glyphicon-pencil" />{' '}
              </a>
              <div className="clearfix" />
              <br />
              <br />
            </div>
          </div>
        )
      } else {
        return []
      }
    }

    let len = _.size(experienceData)
    let index = this.props.ui[sectionName]['currentIndex']
    let prevNextButtons = []
    let k = 0

    if (len > 1) {
      if (index > 0) {
        prevNextButtons.push(
          <a
            href="javascript:void(0);"
            tabIndex={this.props.currentSection === sectionName ? tabIndex : -1}
            aria-label={editScreenAriaLabel['previousButton']}
            aria-hidden={
              this.props.currentSection === sectionName ? false : true
            }
            key={k++}
            className="btn-primary btn-sm n-p-buttons height28"
            onClick={this.handlePrev.bind(this, index, sectionName)}
            data-index={index}>
            <span className="glyphicon glyphicon-triangle-left"> </span>{' '}
            Previous
          </a>
        )
      } else {
        prevNextButtons.push(
          <a
            href="javascript:void(0);"
            key={k++}
            tabIndex={this.props.currentSection === sectionName ? tabIndex : -1}
            aria-label={`You are on your latest ${sectionName} shift tab to get feedback`}
            aria-hidden={
              this.props.currentSection === sectionName ? false : true
            }
            className="btn-primary btn-sm n-p-buttons height28 fade-button"
            onClick={this.handlePrev.bind(this, index, sectionName)}
            data-index={index}>
            <span className="glyphicon glyphicon-triangle-left"> </span>{' '}
            Previous
          </a>
        )
      }
      if (index < len - 1) {
        prevNextButtons.push(
          <a
            href="javascript:void(0);"
            tabIndex={this.props.currentSection === sectionName ? tabIndex : -1}
            aria-label={
              this.props.currentSection === sectionName
                ? editScreenAriaLabel['nextButton']
                : 'next button of different section'
            }
            aria-hidden={
              this.props.currentSection === sectionName ? false : true
            }
            key={k++}
            className="btn-primary btn-sm n-p-buttons height28"
            onClick={this.handleNext.bind(this, index, len, sectionName)}
            data-index={index}
            data-len={len}>
            Next <span className="glyphicon glyphicon-triangle-right"> </span>
          </a>
        )
      } else {
        prevNextButtons.push(
          <a
            href="javascript:void(0);"
            key={k++}
            aria-hidden={
              this.props.currentSection === sectionName ? false : true
            }
            aria-label={`You are on your last ${sectionName} shift tab to get feedback`}
            tabIndex={this.props.currentSection === sectionName ? tabIndex : -1}
            className="btn-primary btn-sm n-p-buttons height28 fade-button"
            onClick={this.handleNext.bind(this, index, len, sectionName)}
            data-index={index}
            data-len={len}>
            Next <span className="glyphicon glyphicon-triangle-right"> </span>
          </a>
        )
      }
    }

    if (this.props.currentSection == sectionName) {
      prevNextButtons.push(
        <Dropdown
          key={k++}
          onClick={this.handleThreeDotsClickTracking}
          id="add-delete-section-dropdown"
          className="add-delete-section-dropdown">
          <Dropdown.Toggle
            tabIndex={tabIndex}
            noCaret
            className="add-delete-section-btn">
            <img
              src={`${process.env.APP_BASE_URL}dist/images/three-dots-edit-delete-experience.gif`}
              alt="button with 2 list elements"
              height="23"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu pull-right dropdown-add-delete">
            <MenuItem
              onSelect={() => this.addNewSection()}
              className="add-delete-section-menu-item"
              eventKey="1">
              Add a new section
            </MenuItem>
            <MenuItem
              onSelect={this.showConfirmDeleteModal}
              className="add-delete-section-menu-item"
              eventKey="2">
              Delete this section
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      )
    } else {
      prevNextButtons.push(
        <a
          key={k++}
          className="edit-dots"
          aria-hidden={
            this.props.currentSection === sectionName ? false : true
          }>
          <img
            src={`${process.env.APP_BASE_URL}dist/images/three-dots-edit-delete-experience.gif`}
            alt="button with 2 list items disabled"
            height="23"
          />
        </a>
      )
    }

    firstDivId =
      !_.isUndefined(firstDivId) && firstDivId.hasOwnProperty(index)
        ? firstDivId[index]
        : 10000

    let data = (
      <div
        id={sectionUnderscore[sectionName]}
        data-section={sectionName}
        className={classNames('profile contnet-left', {
          'active-section': this.props.currentSection === sectionName,
        })}>
        <div className="Next-Previous">
          <div className="number-text pull-left">
            {index + 1}/{len}
          </div>
          <div className="n-p-button pull-right">{prevNextButtons}</div>
        </div>
        <div className="borer-1px" />
        {this.editButton68(sectionName, tabIndex)}
        {this.renderTextData(
          experienceData[index]['title'],
          sectionName,
          firstDivId
        )}
        {this.renderTextData(
          experienceData[index]['sub_title'],
          sectionName,
          firstDivId
        )}
        {this.renderTextData(
          experienceData[index]['time_duration'],
          sectionName,
          firstDivId
        )}
        <div>
          {this.renderTextData(
            experienceData[index]['text'],
            sectionName,
            firstDivId
          )}
        </div>
        <div className="clearfix" />
      </div>
    )

    if (this.props.currentSection !== sectionName) {
      return (
        <div
          className="div-over-overlay div-overlay-opacity"
          onClick={e => this.props.onSelectSection(e, 'profile_data')}
          data-key={sectionName}>
          {data}
        </div>
      )
    } else {
      return data
    }
  }

  renderSkills(skillsData) {
    if (_.isEmpty(skillsData)) {
      if (this.props.currentSection == 'Skills') {
        return (
          <div>
            <div className="profile active-section border-radius-top-none">
              <p className="p-heading-3">You have not written this section </p>
              <a className="btn2 btn btn-primary" href="javascript:void(0);">
                Start writing{' '}
                <span className="glyphicon glyphicon glyphicon-pencil" />{' '}
              </a>
              <div className="clearfix" />
              <br />
              <br />
            </div>
          </div>
        )
      } else {
        return []
      }
    }

    let data = (
      <div
        id="Skills"
        className={classNames('profile', {
          'active-section': this.props.currentSection === 'Skills',
        })}>
        <p className="p-heading-1 align-text-left">Top Skills</p>
        <ul className="skills-keywords keywords-gray keyqords-r-paiding-none tab-r-paiding-none">
          {skillsData}
        </ul>
        {this.editButton('Skills')}
      </div>
    )

    if (this.props.currentSection == 'Skills') {
      return (
        <div
          className="div-over-overlay div-overlay-opacity"
          onClick={e => this.props.onSelectSection(e, 'profile_data')}
          data-key="Skills">
          {data}
        </div>
      )
    } else {
      return data
    }
  }

  renderImage(active, sectionWiseText) {
    let data = (
      <div
        className={
          'profile border-radius-bottom-none ' + active['personalInformation']
        }>
        <img
          src={this.fetchImageUrl(sectionWiseText['imageUrl'])}
          id="profile-data-img"
          width="80px"
          height="80px"
          className="img-circle p-image"
          alt=""
        />
        <div className="clearfix" />
      </div>
    )

    return (
      <div
        className={classNames(
          {
            'div-over-overlay':
              this.props.currentSection !== 'Personal Information',
          },
          {
            opacity29:
              this.props.currentSection !== 'Personal Information' &&
              this.props.currentSection == 'Headline',
          }
        )}
        onClick={e => this.props.onSelectSection(e, 'profile_data')}
        data-key="Profile Picture">
        {data}
      </div>
    )
  }

  renderName(active, sectionWiseText) {
    let data = (
      <div
        key={`${sectionWiseText['name']}-inactive`}
        className={
          'profile border-radius-padding-none ' + active['personalInformation']
        }>
        <div className="p-name" id="name">
          {sectionWiseText['name']}
          {this.editButton('Personal Information')}
        </div>
        <div className="clearfix" />
      </div>
    )

    if (this.props.currentSection !== 'Personal Information') {
      return (
        <div
          key={`${sectionWiseText['name']}-active`}
          className={classNames('div-over-overlay', {
            opacity29: this.props.currentSection == 'Headline',
          })}
          onClick={e => this.props.onSelectSection(e, 'profile_data')}
          data-key="Personal Information">
          {data}
        </div>
      )
    }

    return data
  }

  renderHeadline(active, sectionWiseText, editHeadline, firstDivId) {
    let data = (
      <div
        id="headline"
        data-section="Headline"
        className={
          'feedback-headline-padding profile border-radius-padding-none ' +
          active['headline'] +
          ' ' +
          active['personalInfoHeadline']
        }>
        <div className="p-headline">
          {this.renderTextData(
            sectionWiseText['headline'],
            'Headline',
            !_.isUndefined(firstDivId) && firstDivId.hasOwnProperty(0)
              ? firstDivId[0]
              : 10000
          )}
        </div>
        {editHeadline === true ? this.editButton('Headline') : null}
        <div className="clearfix" />
      </div>
    )

    if (this.props.currentSection !== 'Headline') {
      return (
        <div
          className={'div-over-overlay'}
          onClick={e => this.props.onSelectSection(e, 'profile_data')}
          data-key="Headline">
          {data}
        </div>
      )
    } else {
      return data
    }
  }

  renderUrl(active, sectionWiseText) {
    let data = (
      <div
        className={
          'profile border-radius-padding-none ' + active['personalInformation']
        }>
        <div className="padding-bottom-10">
          <span id="profile_url">{sectionWiseText['profile_url']}</span>
          <br />
          <span id="connections">
            {sectionWiseText['personal_information']}
          </span>
        </div>
        <div className="clearfix" />
      </div>
    )

    if (this.props.currentSection !== 'Personal Information') {
      return (
        <div
          className={classNames('div-over-overlay', {
            opacity29: this.props.currentSection == 'Headline',
          })}
          onClick={e => this.props.onSelectSection(e, 'profile_data')}
          data-key="Personal Information">
          {data}
        </div>
      )
    } else {
      return data
    }

    return data
  }

  renderTextData(textData, sectionName, firstDivId, arrayIndex = null) {
    if (_.isString(textData) || _.isNull(textData)) {
      return textData
    }

    if (_.isArray(textData)) {
      var output = []

      for (let i in textData) {
        output.push(
          this.renderTextData(textData[i], sectionName, firstDivId, i)
        )
      }

      return output
    }

    if (_.isObject(textData)) {
      var output = []
      let tempOutput = null

      if (
        arrayIndex !== '0' &&
        textData.hasOwnProperty('new_line') &&
        textData['new_line'] == true
      ) {
        output.push(<br />)
      } else if (
        arrayIndex !== '0' &&
        textData.hasOwnProperty('new_paragraph') &&
        textData['new_paragraph'] == true
      ) {
        output.push(<br />)
      }

      let id = Math.floor(Math.random() * 100 + 1)
      if (textData.hasOwnProperty('div_id') && !_.isEmpty(textData['div_id'])) {
        let divId = parseInt(textData['div_id'])
        if (divId >= firstDivId + 20) {
          divId = Math.ceil((divId - firstDivId) / 20) * 20 + firstDivId
          id = 'profile-data-' + divId
        }
      }

      let key = this.generateRandomString()

      if (textData['type'] == 'div') {
        tempOutput = (
          <div
            id={id}
            key={key}
            target={'target-' + key}
            className={this.getClass(textData)}>
            {textData.hasOwnProperty('bullet') ? textData['bullet'] : null}
            {this.renderTextData(textData['text'], sectionName, firstDivId)}
          </div>
        )
      } else if (textData['type'] == 'span') {
        tempOutput = (
          <span
            id={id}
            key={key}
            target={'target-' + key}
            className={this.getClass(textData)}>
            {textData.hasOwnProperty('bullet') ? textData['bullet'] : null}
            {this.renderTextData(textData['text'], sectionName, firstDivId)}
            {textData.hasOwnProperty('end_period') &&
            textData['end_period'] === true
              ? ' '
              : ''}
          </span>
        )
      } else if (textData['type'] == 'title_span') {
        tempOutput = (
          <div id={id} className="p-heading-1">
            <span
              key={key}
              target={'target-' + key}
              className={this.getClass(textData)}>
              {textData.hasOwnProperty('bullet') ? textData['bullet'] : null}
              {this.renderTextData(textData['text'], sectionName, firstDivId)}
            </span>
          </div>
        )
      } else if (textData['type'] == 'input') {
        if (textData.hasOwnProperty('name')) {
          tempOutput = (
            <input
              id={id}
              name={textData['name']}
              className={this.getClass(textData)}
              value={this.inputValue(textData)}
            />
          )
        } else {
          tempOutput = (
            <input
              id={id}
              className={this.getClass(textData)}
              value={this.inputValue(textData)}
            />
          )
        }
      }

      if (
        textData.hasOwnProperty('suggestions') &&
        !_.isEmpty(textData['suggestions'])
      ) {
        var popoverOverlay = (
          <Popover
            id={'popover-contained-gray'}
            aria-label="popover"
            className="feedback-word-popover">
            <strong>
              Use words like {textData['suggestions'].join(', ')} for higher
              quality of language.
            </strong>
          </Popover>
        )

        if (textData['module_type'] == 'action_oriented') {
          var popoverOverlay = (
            <Popover
              id={'popover-contained-gray'}
              aria-label="popover"
              className="feedback-word-popover">
              <strong>
                <span className="large-font">{textData['text']}</span> is
                considered to be a weak verb.
                <br /> Although in some cases it may make sense to do so,
                <br /> try to re-word your sentence to start with stronger
                action verbs.
                <br /> Some common ones used by your peers are:
                <br />{' '}
                <span className="feedback-word-popover-color">
                  {textData['suggestions'].join(', ')}
                </span>
              </strong>
            </Popover>
          )
        } else if (textData['module_type'] == 'verb_overusage') {
          var popoverOverlay = (
            <Popover
              id={'popover-contained-gray'}
              aria-label="popover"
              className="feedback-word-popover">
              <strong>
                You have written{' '}
                <span className="large-font">{textData['text']}</span> multiple
                times in this section.
                <br /> Consider re-phrasing it with usages such as:
                <br />{' '}
                <span className="feedback-word-popover-color">
                  {textData['suggestions'].join(', ')}
                </span>
              </strong>
            </Popover>
          )
        }
        output.push(
          <OverlayTrigger
            trigger={['focus', 'hover']}
            rootClose
            placement="top"
            overlay={popoverOverlay}
            container={this}>
            {tempOutput}
          </OverlayTrigger>
        )
      } else {
        output.push(tempOutput)
      }
    }
    return output
  }

  getClass(textData) {
    if (textData.hasOwnProperty('class')) {
      return (
        textData['class']['highlight_class'] + ' ' + textData['class']['others']
      )
    }

    return null
  }

  generateRandomString(length = 10) {
    let text = ''
    let possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
  }

  inputValue(textData) {
    if (_.isNull(textData)) {
      return ''
    }

    if (_.isString(textData)) {
      return textData
    }

    let output = []

    if (_.isArray(textData)) {
      for (let i in textData) {
        output.push(this.inputValue(textData[i]))
      }
    }

    if (_.isObject(textData)) {
      let bullet =
        textData.hasOwnProperty('bullet') + ' ' ? textData['bullet'] : ''
      output.push(bullet)
      output.push(this.inputValue(textData['text']))
    }

    return output.join('')
  }

  render() {
    const {
      fetchId,
      totalScore,
      totalScoreColor,
      currentSection,
      sectionWiseText,
      sectionWiseTextPdf,
      resumeSkillsInLinkedin,
      ui,
      updateEditSection,
      editSectionUpdated,
      processingStatus,
      changeNewSubSectionValue,
      tabIndex,
    } = this.props

    let currentTab = tabIndex

    let active = {
      profilePicture: 'hidden',
      personalInformation: '',
      personalInfoHeadline: '',
      headline: '',
      summary: '',
    }

    let editHeadline = true

    if (currentSection === 'Personal Information') {
      active['personalInformation'] = 'active-section'
      active['personalInfoHeadline'] = 'active-section color-gray'
      editHeadline = false
    } else if (currentSection === 'Profile Picture') {
      active['profilePicture'] = 'active-section'
    } else if (currentSection === 'Headline') {
      active['headline'] = 'active-section'
    } else if (currentSection === 'Summary') {
      active['summary'] = 'active-section'
    }

    let bottomPadding = '450px'

    if (window.innerHeight > 1000) {
      bottomPadding = '200px'
    }

    let editComponent = []

    if (this.state.showModal === true) {
      var currIndex =
        this.props.newSubSection === true
          ? this.state.activeEditSection + '_new'
          : this.props.ui[this.state.activeEditSection]['currentIndex']
      editComponent.push(
        <EditScreens
          focusDisable={this.state.showConfirmEditClose}
          show={this.state.showModal}
          fetchId={fetchId}
          sectionName={this.state.activeEditSection}
          newSubSection={this.props.newSubSection}
          currentIndex={currIndex}
          derivedSkills={this.props.ui.derivedSkills}
          sectionWiseText={sectionWiseText}
          sectionWiseTextEditable={this.props.ui.sectionWiseTextEditable}
          sectionsEntitiesToHighlight={
            this.props.ui.sectionsEntitiesToHighlight
          }
          sectionsPerSkill={this.props.ui['sectionsPerSkill']}
          resumeSkillsInLinkedin={resumeSkillsInLinkedin}
          feedback={this.props.ui['sections'][currentSection]}
          showEditModal={this.showEditModal}
          hideEditModal={this.hideEditModal}
          updateEditSection={updateEditSection}
          editSectionUpdated={editSectionUpdated}
          changeNewSubSectionValue={changeNewSubSectionValue}
        />
      )
    }

    let logComponent = []

    if (this.state.showLogModal === true) {
      let logs = this.props.ui['logs']
      var currIndex = this.props.ui[currentSection]['currentIndex']
      let countSections = _.size(
        this.props.ui.sectionWiseTextStatic[sectionUnderscore[currentSection]]
      )
      let prevData = this.props.ui.sectionWiseTextStatic[
        sectionUnderscore[currentSection]
      ][currIndex]

      if (
        logs.hasOwnProperty(currentSection) &&
        logs[currentSection].hasOwnProperty(currIndex)
      ) {
        logComponent.push(
          <LogScreen
            show={this.state.showLogModal}
            fetchId={fetchId}
            sectionName={currentSection}
            currentIndex={currIndex}
            countSections={countSections}
            logs={logs[currentSection][currIndex]}
            feedback={this.props.ui['sections'][currentSection]}
            prevData={prevData}
            showLogModal={this.showLogModal}
            hideLogModal={this.hideLogModal}
          />
        )
      }
    }

    let infoComponent = null

    if (this.state.showInfoScreen == true) {
      infoComponent = (
        <InfoScreens
          show={this.state.showInfoScreen}
          module={this.state.activeInfoScreen}
          currentSection={currentSection}
          hideModal={this.hideInfoModal}
        />
      )
    }

    return (
      <div className="profile-outer-div">
        {editComponent}
        {logComponent}
        {infoComponent}
        <PdfData sectionWiseTextPdf={sectionWiseTextPdf} />
        <div className="profile-sec dark-gray-bg-3 tour-scroll js-detailed-tall scrollbar-elements">
          <div className="profile-container">
            <div
              id="personal_information"
              className="overlay"
              data-section="Personal Information"
            />
            <div
              id="profile_picture"
              data-section="Profile Picture"
              className={'Profile-Picture ' + active['profilePicture']}>
              {this.editButton('Profile Picture')}
              <img
                src={this.fetchImageUrl(sectionWiseText['imageUrl'])}
                id="profile-data-img-1"
                width="190px"
                height="190px"
                className="img-circle p-image2"
                alt=""
              />
              <div className="clearfix" />
            </div>
            <div
              className={classNames({
                'div-overlay-opacity':
                  this.props.currentSection !== 'Personal Information' &&
                  this.props.currentSection !== 'Headline',
              })}>
              {this.renderImage(active, sectionWiseText)}
              {this.renderName(active, sectionWiseText)}
              {this.renderHeadline(
                active,
                sectionWiseText,
                editHeadline,
                ui['sections']['Headline']['first_div_id']
              )}
              {this.renderUrl(active, sectionWiseText)}
            </div>
            {this.renderSummary(
              sectionWiseText['summary'],
              active['summary'],
              ui['sections']['Summary']['first_div_id'],
              tabIndex
            )}
            {this.render68(
              sectionWiseText['experience'],
              'Experience',
              ui['sections']['Experience']['first_div_id'],
              tabIndex
            )}
            {this.render68(
              sectionWiseText['education'],
              'Education',
              ui['sections']['Education']['first_div_id'],
              tabIndex
            )}
          </div>
          <div className="p-black-box">
            <div className="p-black-overlay">
              <div className="pull-left left-text">
                {' '}
                Edits made in 3 sections{' '}
              </div>
              <a
                href="javascript:void(0);"
                className="btn-primary btn3 pull-right">
                download changes{' '}
              </a>
            </div>
          </div>
        </div>
        <FocusLock disabled={!this.state.showConfirmDelete}>
          <Modal
            isOpen={this.state.showConfirmDelete}
            onRequestHide={this.hideConfirmDeleteModal}
            keyboard={true}>
            <div className="delete-modal">
              <div className="delete-modal-close-icon">
                <a
                  href="javascript:void(0);"
                  aria-label={'Click to close the delete section modal'}
                  className="close-button glyphicon glyphicon-remove pull-right confirm-delete-close-margin modal-close-btn"
                  onClick={this.hideConfirmDeleteModal}
                />
              </div>
              <div className="card-block-lg text-center">
                <div className="delete-modal-icon-row">
                  <img
                    className="delete-modal-icon"
                    src={`${process.env.APP_BASE_URL}dist/images/delete-dark.png`}
                    alt="Delete icon"
                  />
                </div>
                <div className="delete-modal-heading">
                  Confirm Section Delete
                </div>
                <div className="delete-modal-subheading">
                  Are you sure you want to delete this section ?
                </div>
                <div className="delete-modal-btn-grp">
                  <button
                    type="button"
                    className="btn btn-primary btn-yes"
                    aria-label="Click to delete the section"
                    onClick={() => this.deleteSection()}>
                    Yes
                  </button>
                  <button
                    type="button"
                    className="btn btn-default btn-no"
                    aria-label="Click to exit the delete modal"
                    onClick={this.hideConfirmDeleteModal}>
                    No
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </FocusLock>
        <FocusLock disabled={!this.state.showConfirmEditClose}>
          <Modal
            isOpen={this.state.showConfirmEditClose}
            onRequestHide={this.hideConfirmEditCloseModal}
            keyboard={true}>
            <div className="as-confirm-edit-close delete-modal as-confirm-edit-close-backdrop">
              <div className="delete-modal-close-icon">
                <a
                  href="javascript:void(0);"
                  aria-label="Click to close the modal"
                  className="close-button glyphicon glyphicon-remove pull-right confirm-delete-close-margin modal-close-btn"
                  onClick={this.hideConfirmEditCloseModal}
                />
              </div>
              <div className="card-block-lg text-center">
                <div className="delete-modal-icon-row">
                  <img
                    className="delete-modal-icon"
                    src={`${process.env.APP_BASE_URL}dist/images/edit-screens/alert-icon.svg`}
                    alt="Alert icon"
                  />
                </div>
                <div className="delete-modal-heading">Unsaved Changes</div>
                <div className="delete-modal-subheading">
                  Are you sure you want to close this section ?
                </div>
                <div className="delete-modal-btn-grp">
                  <button
                    type="button"
                    className="btn btn-primary btn-yes"
                    aria-label={
                      'Click yes to remove the changes and close edit modal'
                    }
                    onClick={() => this.hideEditModalActual()}>
                    Yes
                  </button>
                  <button
                    type="button"
                    className="btn btn-default btn-no"
                    aria-label={'Click to continue editing'}
                    onClick={this.hideConfirmEditCloseModal}>
                    No
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </FocusLock>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    editedSection: state.editData.section_name,
    editedSubSectionId: state.editData.sub_section_id,
    editedSectionDeleted: state.editData.delete_sub_section,
    loaderInput: state.aspireFeedbackData.mini_loader_text,
    processingStatus: state.aspireFeedbackData.status,
    section_wise_feedback: state.aspireFeedbackData.data.section_wise_feedback,
  }
}

export default connect(mapStateToProps, {
  processEditedData,
  fetchPdf,
  updateText,
})(ProfileData)
