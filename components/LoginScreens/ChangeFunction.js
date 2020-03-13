import React, { Component } from 'react'
import { connect } from 'react-redux'
import { processDataForNewFunction } from '../../actions/Login'
import { notification, similar_text_array } from '../../services/helpers'
import $ from 'jquery'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import SelectPlus from 'react-select-plus'
import { resumePDFChangeFunctionModalAriaLabel } from '../Constants/AriaLabelText'

class ChangeFunction extends Component {
  constructor() {
    super()
    this.state = {
      studentProf: 'Student',
      jobFuncs: [],
      value: [],
      disabled: false,
      jobFunctionMapOptions: [],
      filters: [],
    }
    this.studentProfFlag = false
    this.tags = {}
    this.targetFunctionBackToFrontEndMapping = {}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.debounceHandleSubmit = _.debounce(this.handleSubmit, 2000, true)
    this.getSelectedJobFunctionsAtTop = this.getSelectedJobFunctionsAtTop.bind(
      this
    )
    this.removeJobFunction = this.removeJobFunction.bind(this)
    this.onChangeTFSelect = this.onChangeTFSelect.bind(this)
    this.filterOptions = this.filterOptions.bind(this)
    this.filterOptionsEndState = this.filterOptionsEndState.bind(this)
    this.resetFilter = this.resetFilter.bind(this)
    this.debounceTime = 3000
    this.trackClickDebounce = _.debounce(this.trackClick, 3000, true)
    this.trackProcessDebounce = _.debounce(this.trackProcess, 3000, true)
    this.randomString = null
  }

  trackClick(tag) {
    sendTrackingData('event', 'aspire_change_function_modal', 'click', tag)
  }

  trackProcess(tag, error = true) {
    let process = error ? 'notify_error' : 'notify_success'
    sendTrackingData('process', 'aspire_change_function_modal', process, tag)
  }

  UNSAFE_componentWillMount() {
    const { functions } = this.props
    this.tags = functions['tags']
    this.targetFunctionBackToFrontEndMapping = functions['mapping']
    const jobFuncs = [].concat(this.props.jobFuncs)
    let jobFunctionMapOptions = []

    _.mapObject(this.targetFunctionBackToFrontEndMapping, function(val, key) {
      let newItem = { label: val, value: key }
      jobFunctionMapOptions.push(newItem)
    })

    for (let i = 0; i < jobFuncs.length; i++) {
      let value = jobFuncs[i]
      jobFunctionMapOptions = jobFunctionMapOptions.filter(
        obj => obj.value !== value
      )
    }

    this.setState({ jobFuncs: jobFuncs })
    this.setState({ jobFunctionMapOptions: jobFunctionMapOptions })
    this.randomString = this.generateRandomString(20)
  }

  componentDidUpdate() {
    $('.sf-select-class .Select-value').css('display', 'none')
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

  filterOptionsEndState(options, filter, currentValues) {
    if (filter.length > 0) {
      if (filter.length <= 25) {
        this.state.filters.push(filter)
      }
    }

    if (filter.length < 3 || filter.length > 25) {
      return this.filterOptions(options, filter, currentValues)
    }
    return similar_text_array(
      options,
      filter,
      this.tags,
      this.targetFunctionBackToFrontEndMapping,
      this.state.jobFuncs
    )
  }

  filterOptions(options, filter, currentValues) {
    var filterOriginal = filter
    filter = filter.toLowerCase()
    var retOptions = []
    var tempOptions = []
    var pos = -1
    var present = 0
    for (var i = 0; i < options.length; i++) {
      var label = options[i]['label'].toLowerCase()
      var value = options[i]['value'].toLowerCase()
      if (present !== 1 && label === filter) {
        present = 1
      }
      pos = label.search(filter)
      if (pos === 0) {
        retOptions.push(options[i])
      } else if (pos > 0) {
        tempOptions.push(options[i])
      } else if (options[i]['group']) {
        var groupLabel = options[i]['group']['label'].toLowerCase()
        var posGroup = groupLabel.search(filter)
        if (posGroup >= 0) {
          tempOptions.push(options[i])
        }
      }
    }
    for (var i = 0; i < tempOptions.length; i++) {
      retOptions.push(tempOptions[i])
    }

    return retOptions
  }

  onChangeTFSelect(value) {
    let val = value[0].value
    let bool = _.contains(this.state.jobFuncs, val)

    if (!bool) {
      if (_.size(this.state.jobFuncs) < 3) {
        var jobFuncs = this.state.jobFuncs
        jobFuncs.push(val)
        let noOfFunctions = _.size(jobFuncs)

        if (noOfFunctions == 3) {
          this.setState({ disabled: true })
        }
        let jobFunctionMapOptions = this.state.jobFunctionMapOptions.filter(
          obj => obj.value !== val
        )
        this.setState({ jobFunctionMapOptions: jobFunctionMapOptions })
        this.setState({ jobFuncs: jobFuncs })
        this.trackClickDebounce(`Selected ${val}`)
      } else {
        notification('Maximum 3 target functions allowed!', 'error')
        this.trackProcessDebounce('max_3_functions_allowed')
      }
    }

    this.setState({ filters: [] })
  }

  compare(a, b) {
    if (a.label < b.label) return -1
    if (a.label > b.label) return 1
    return 0
  }

  removeJobFunction(jobFunction) {
    let bool = _.contains(this.state.jobFuncs, jobFunction)

    if (bool == true) {
      if (_.size(this.state.jobFuncs) > 0) {
        let jsonObjectForTracking = {
          eventLabel: 'remove_job_function',
          jobFunctionRemoved: jobFunction,
          randomString: this.randomString,
        }
        this.trackClickDebounce(JSON.stringify(jsonObjectForTracking))

        var jobFuncs = this.state.jobFuncs.filter(jf => jf !== jobFunction)
        let label = this.targetFunctionBackToFrontEndMapping[jobFunction]
        let newItem = { label: label, value: jobFunction }
        let jobFunctionMapOptions = $.extend(
          true,
          [],
          this.state.jobFunctionMapOptions
        )
        jobFunctionMapOptions.push(newItem)
        if (_.size(jobFuncs) < 3) {
          this.setState({ disabled: false })
        }
        this.setState({ jobFunctionMapOptions: jobFunctionMapOptions })
        this.setState({ jobFuncs: jobFuncs })
      }
    }
  }

  getSelectedJobFunctionsAtTop() {
    let output = []
    let jobFuncs = this.state.jobFuncs

    if (jobFuncs.length == 0) {
      return (
        <div className="sf-nothing-selected">
          <span
            tabIndex={0}
            aria-label={resumePDFChangeFunctionModalAriaLabel['cf']['select']}>
            Please select Target function(s)
          </span>
        </div>
      )
    }

    for (let i = 0; i < jobFuncs.length; i++) {
      let label = this.targetFunctionBackToFrontEndMapping[jobFuncs[i]]
      output.push(
        <li className="sf-li">
          <div
            className="sf-name"
            aria-label={`you have selected ${label}`}
            tabIndex={0}>
            {label}
          </div>
          <a
            aria-label={`click to remove ${label}`}
            href="javascript:void(0);"
            onClick={() => this.removeJobFunction(jobFuncs[i])}
            className="sf-cross">
            X
          </a>
        </li>
      )
    }

    return output
  }

  resetFilter() {
    this.setState({ filters: [] })
  }

  handleSubmit() {
    const { id, processDataForNewFunction, jobFuncs, hideModal } = this.props
    let targetJobFunctions = [].concat(this.state.jobFuncs)

    if (_.size(targetJobFunctions) < 1) {
      notification('No target functions selected!', 'error')
      this.trackClickDebounce('view_feedback_button_with_no_tf')
      return
    }

    let intersect = _.intersection(jobFuncs, targetJobFunctions)
    let unchangedMessage = false

    if (
      intersect.length == jobFuncs.length &&
      intersect.length == targetJobFunctions.length
    ) {
      unchangedMessage = 'Target Functions not changed!'
    }

    let jsonObjectForTracking = {
      eventLabel: 'view_feedback_button',
      targetJobFunctions: targetJobFunctions,
      randomString: this.randomString,
    }

    sendTrackingData(
      'event',
      'aspire_change_function_modal',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    processDataForNewFunction(id, targetJobFunctions, unchangedMessage)
    hideModal('outside')
  }

  render() {
    this.state.jobFunctionMapOptions.sort(this.compare)
    let noResultsFound = null
    noResultsFound = (
      <div aria-live="assertive" aria-label="No result found, please retype">
        No Result found
      </div>
    )

    return (
      <div className="sf-container sf-container-modal">
        <div className="sf-container-top sf-container-top-for-modal">
          <div className="sf-bg-image" />
          <div className="sf-content">
            <div className="sf-subheading">
              What functions would you like to target with your <br />
              Linkedin Profile (max 3)?
            </div>
            <div className="sf-selected-list-container">
              <div className="sf-selected-list">
                {this.getSelectedJobFunctionsAtTop()}
              </div>
            </div>
            <div className="row sf-dropdown-block">
              <div className="sf-dropdown-right-only">
                <SelectPlus
                  className="sf-select-class"
                  closeOnSelect={this.state.disabled}
                  noResultsText={noResultsFound}
                  searchable={true}
                  multi
                  valueKey="value"
                  aria-label="Select target functions (max 3)"
                  tabSelectsValue={false}
                  clearable={false}
                  placeholder="Select target functions (max 3)"
                  options={this.state.jobFunctionMapOptions}
                  filterOptions={this.filterOptionsEndState}
                  onChange={this.onChangeTFSelect}
                  onOpen={this.resetFilter}
                  onClose={this.resetFilter}
                />
              </div>
              <div className="sf-view-btn">
                <a
                  href="javascript:void(0);"
                  aria-label={
                    resumePDFChangeFunctionModalAriaLabel['cf']['feedback']
                  }
                  type="button"
                  data-value="default"
                  onClick={this.debounceHandleSubmit}
                  className="btn btn-sf-view-feedback btn-primary">
                  {' '}
                  View Feedback
                </a>
              </div>
            </div>
          </div>
          <a
            href="javascript:void(0);"
            onClick={() => this.props.hideModal('close_btn')}
            aria-label={resumePDFChangeFunctionModalAriaLabel['close']}
            className="pull-right icon-cross sf-modal-close-btn modal-close-button"
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    functions: state.aspireFunctionMappings.function_mappings,
  }
}

export default connect(
  mapStateToProps,
  { processDataForNewFunction }
)(ChangeFunction)
