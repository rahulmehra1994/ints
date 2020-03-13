import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from '../Loader'
import classNames from 'classnames'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { editModalAriaLabel } from '../Constants/AriaLabelText'

class PersonalInformation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: {
        profile_url: false,
        name: false,
      },
    }
    this.handleCloseButton = this.handleCloseButton.bind(this)
    this.handleUndoClick = this.handleUndoClick.bind(this)
    this.sendTrackingDataDebounceUndo = _.debounce(sendTrackingData, 3000, true)
  }

  handleChange(e) {
    let value = e.target.value
    let name = e.target.name

    if (name === 'profile_url') {
      value = 'https://www.linkedin.com/in/' + value
    }

    this.props.handleOnChangeData('personal_information', 0, name, value)
  }

  handleFocus(field, e) {
    e.preventDefault()
    let focused = this.state.focused
    for (let i in focused) {
      if (i == field) {
        focused[i] = true
      } else {
        focused[i] = false
      }
    }
    this.setState({ focused: focused })
  }

  handleBlur(field) {
    let focused = this.state.focused
    focused[field] = false
    this.setState({ focused: focused })
  }

  handleUndoClick() {
    const { currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'undo_changes_btn',
      currentSection: 'Personal Information',
      currentIndex: currentIndex,
    }

    this.sendTrackingDataDebounceUndo(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.props.handleUndoData('personal_information', 0)
  }

  getUrlParam(linkedInUrl) {
    let param = linkedInUrl.slice(28)
    return param
  }

  handleCloseButton() {
    const {
      handleUndoData,
      currentIndex,
      hideEditModal,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
    } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'close_btn',
      currentSection: 'Personal Information',
      currentIndex: currentIndex,
    }
    sendTrackingData(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    hideEditModal(
      'headline',
      currentIndex,
      sectionWiseTextEditable,
      sectionWiseTextStatic
    )
  }

  handleClick(e) {
    const { handleSaveChanges } = this.props
    handleSaveChanges()
  }

  handleDisabledUrlClick(e) {
    $('.variable-url').focus()
    this.handleFocus('profile_url', e)
  }

  renderEntityText(entity) {
    const { has_pdf, sectionWiseTextEditable, loaderInput } = this.props

    let fieldDisabled = false
    if (!_.isEmpty(loaderInput)) {
      fieldDisabled = true
    }

    if (entity == 'name') {
      if (has_pdf == 1) {
        return (
          <input
            type="text"
            className=""
            aria-label={editModalAriaLabel['personal_info']['enter_name']}
            autoFocus
            name="name"
            value={sectionWiseTextEditable[0]['name']}
            placeholder="Enter name"
            onChange={e => this.handleChange(e)}
            onFocus={e => this.handleFocus('name', e)}
            onBlur={() => this.handleBlur('name')}
            disabled={fieldDisabled}
          />
        )
      } else {
        return (
          <div className="as-edit-input-field-wrapper">
            <div className="as-input-div" id="hide-scrollbar">
              {sectionWiseTextEditable[0]['name']}
            </div>
            <span className="text-red as-red-info-msg">
              * Upload full LinkedIn pdf to edit your profile name.
            </span>
          </div>
        )
      }
    }

    if (entity == 'profile_url') {
      let urlParam = this.getUrlParam(sectionWiseTextEditable[0]['profile_url'])
      return (
        <div className="display-flex">
          <div
            className={classNames('fixed-url', {
              'as-focused-profile-fixed-url': this.state.focused['profile_url'],
            })}
            onClick={e => this.handleDisabledUrlClick(e)}>
            https://www.linkedin.com/in/
          </div>
          <input
            type="text"
            className={classNames('variable-url', {
              'as-focused-profile-variable-url': this.state.focused[
                'profile_url'
              ],
            })}
            aria-label={editModalAriaLabel['personal_info']['enter_url']}
            name="profile_url"
            value={urlParam}
            placeholder="Enter profile URL"
            onChange={e => this.handleChange(e)}
            onFocus={e => this.handleFocus('profile_url', e)}
            onBlur={() => this.handleBlur('profile_url')}
            disabled={fieldDisabled}
          />
        </div>
      )
    }
  }

  getSuggestedUrls() {
    const { sectionWiseText, tabIndex } = this.props

    let suggestedUrls = [],
      temp = []

    if (!_.isEmpty(sectionWiseText['suggested_urls'])) {
      let len = sectionWiseText['suggested_urls'].length
      let divisor = 2
      let lenForEach = 6
      let temp2 = []
      let l = 0

      for (let i in sectionWiseText['suggested_urls']) {
        temp.push(
          <div
            className="as-suggested-urls-list-item"
            tabIndex={0}
            aria-label={sectionWiseText['suggested_urls'][i]}>
            {sectionWiseText['suggested_urls'][i]}
          </div>
        )
      }

      suggestedUrls = (
        <div className="as-suggested-urls-wrapper">
          <div className="suggestion-box">
            <div className="as-suggested-urls-heading">
              <span
                tabIndex={0}
                aria-label={
                  editModalAriaLabel['personal_info']['suggested_url']
                }>
                Some suggested URLs
              </span>
            </div>
            <div className="as-suggested-urls-list">{temp}</div>
          </div>
          <span
            className="text-red as-red-info-msg"
            tabIndex={0}
            aria-label={editModalAriaLabel['personal_info']['availability']}>
            * Check availability of URLs on LinkedIn.
          </span>
        </div>
      )
    }

    return suggestedUrls
  }

  getLabel(field, heading, emptyCondition) {
    const { loaderInput } = this.props
    let colorClass = null
    if (_.isEmpty(emptyCondition)) {
      colorClass = 'as-edit-input-field-label text-red'
    } else if (!_.isEmpty(loaderInput)) {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    } else if (this.state.focused[field]) {
      colorClass = 'as-edit-input-field-label as-focused-label-text-color'
    } else {
      colorClass = 'as-edit-input-field-label as-label-text-color'
    }

    return (
      <label htmlFor={field} className={colorClass}>
        {heading} <span className="text-red">*</span>
      </label>
    )
  }

  render() {
    const {
      has_pdf,
      loaderInput,
      currentIndex,
      newSubSection,
      hideEditModal,
      sectionWiseText,
      sectionWiseTextStatic,
      sectionWiseTextEditable,
      highlightEntityText,
      unhighlightAll,
      feedback,
      handleSaveChanges,
      handleUndoData,
      fetchId,
      tabIndex,
    } = this.props

    let saveButton = (
      <button
        tabIndex={0}
        aria-label={editModalAriaLabel['save']}
        className="btn btn-primary btn-save-changes"
        onClick={() => this.handleClick()}>
        Save Changes
      </button>
    )
    if (!_.isEmpty(loaderInput)) {
      saveButton = (
        <button
          tabIndex={0}
          aria-label={editModalAriaLabel['saving']}
          className="btn btn-primary btn-save-changes cusrsor-not-allowed"
          disabled>
          Saving ...
        </button>
      )
    }

    let undoButton = null
    if (
      !(
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ===
          JSON.stringify(sectionWiseTextStatic[currentIndex]) ||
        !_.isEmpty(loaderInput)
      )
    ) {
      undoButton = (
        <button
          tabIndex={0}
          aria-label={editModalAriaLabel['reset']}
          className="btn btn-undo-changes"
          onClick={this.handleUndoClick}>
          Reset
        </button>
      )
    }

    let urlParam = this.getUrlParam(sectionWiseTextEditable[0]['profile_url'])

    return (
      <div className="as-edit-wrapper as-shadow">
        <Loader sectionName="Personal Information" />
        <div className="as-edit-heading-wrapper">
          <a
            href="javascript:void(0);"
            aria-label={editModalAriaLabel['close']}
            onClick={this.handleCloseButton}
            className="icon-cross as-edit-close-btn modal-close-button"
          />
          <div className="as-edit-heading">Edit Personal Information</div>
        </div>
        <div className="as-edit-container as-personal-information-container">
          <div className="as-edit-inputs-row">
            <div className="as-edit-inputs-col">
              {this.getLabel(
                'name',
                'Profile Name',
                sectionWiseTextEditable[0]['name']
              )}
              {this.renderEntityText('name')}
            </div>
          </div>
          <div className="as-edit-inputs-row">
            <div className="as-edit-inputs-col">
              {this.getLabel('profile_url', 'Profile URL', urlParam)}
              {this.renderEntityText('profile_url')}
            </div>
            {this.getSuggestedUrls()}
          </div>
          <div className="as-edit-buttons-group">
            {undoButton}
            {saveButton}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    loaderInput: state.aspireFeedbackData.mini_loader_text,
  }
}

export default connect(
  mapStateToProps,
  {}
)(PersonalInformation)
