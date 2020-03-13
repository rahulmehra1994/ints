import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  processApiData,
  updateApiData,
  uploadPdfFile,
  updatePdfData,
  redirectInternal,
  getLatestFetchId,
} from '../../actions/Login'
import Avatar from '@vmockinc/dashboard/Dashboard/components/Avatar'
import Feed from '@vmockinc/dashboard/Dashboard/containers/Feed'
import { notification, similar_text_array } from '../../services/helpers'
import classNames from 'classnames'
import $ from 'jquery'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import SelectPlus from 'react-select-plus'

const imgSrc = '/dist/img/aspire/'

const timeOutMilliseconds = 2000

const studentProfessionalOptions = [
  { label: 'Student', value: 'Student' },
  { label: 'Professional', value: 'Professional' },
]

class SelectFunction extends Component {
  constructor() {
    super()
    this.state = {
      studentProf: 'Student',
      jobFuncs: [],
      value: [],
      disabled: false,
      jobFunctionMapOptions: [],
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
    this.onChangeStudentProfSelect = this.onChangeStudentProfSelect.bind(this)
    this.onChangeTFSelect = this.onChangeTFSelect.bind(this)
    this.filterOptions = this.filterOptions.bind(this)
    this.filterOptionsEndState = this.filterOptionsEndState.bind(this)
  }

  UNSAFE_componentWillMount() {
    this.studentProfFlag =
      _.isEmpty(this.props.api_data) ||
      (this.props.api_data.hasOwnProperty('positions') &&
        (!this.props.api_data.positions.hasOwnProperty('values') ||
          !this.props.api_data.positions.values.hasOwnProperty('0') ||
          _.isEmpty(this.props.api_data.positions.values['0'])))
    const { functions } = this.props
    this.tags = functions['tags']
    this.targetFunctionBackToFrontEndMapping = functions['mapping']

    let jobFunctionMapOptions = []

    _.mapObject(this.targetFunctionBackToFrontEndMapping, function(val, key) {
      let newItem = { label: val, value: key }
      jobFunctionMapOptions.push(newItem)
    })

    this.setState({ jobFunctionMapOptions: jobFunctionMapOptions })
  }

  componentDidUpdate() {
    $('.sf-select-class .Select-value').css('display', 'none')
  }

  onChangeStudentProfSelect(value) {
    this.setState({ studentProf: value.value })
  }

  filterOptionsEndState(options, filter, currentValues) {
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
      } else {
        notification('Maximum 3 target functions allowed!', 'error')
      }
    }
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
          Please select Target function(s)
        </div>
      )
    }

    for (let i = 0; i < jobFuncs.length; i++) {
      let label = this.targetFunctionBackToFrontEndMapping[jobFuncs[i]]
      output.push(
        <li className="sf-li">
          <div className="sf-name">{label}</div>
          <a
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      api_fetch_id,
      uploaded_data,
      updateApiData,
      pdf_fetch_id,
      uploaded_pdf,
      updatePdfData,
      redirectInternal,
      getLatestFetchId,
    } = nextProps
    if (uploaded_pdf == true) {
      getLatestFetchId()
      updatePdfData({ pdf_data: null })
      redirectInternal(`/aspire/${pdf_fetch_id}/feedback/summary`)
    }
  }

  componentDidMount() {
    const { api_data, pdf_data } = this.props
    if (_.isNull(api_data) && _.isNull(pdf_data)) {
      const { redirectInternal } = this.props
      redirectInternal(`/aspire/data/login-api`)
    }
  }

  handleSubmit(e) {
    const { api_data, processApiData, pdf_data, uploadPdfFile } = this.props
    var target_job_functions = [].concat(this.state.jobFuncs)
    var student_prof = ''
    if (this.studentProfFlag) {
      student_prof = this.state.studentProf
    }

    if (_.size(target_job_functions) < 1) {
      notification('No target functions selected!', 'error')
      return
    }

    if (!_.isNull(api_data)) {
      if (
        api_data.hasOwnProperty('pictureUrls') &&
        api_data['pictureUrls'].hasOwnProperty('values') &&
        !_.isEmpty(api_data['pictureUrls']['values'])
      ) {
        api_data['pictureUrl'] = api_data['pictureUrls']['values'][0]
      }
      processApiData(target_job_functions, student_prof)
    } else if (!_.isNull(pdf_data)) {
      let formData = pdf_data['formData']
      let formPdf = pdf_data['formPdf']
      formData.append('student_professional', student_prof)
      formData.append(
        'target_job_functions',
        JSON.stringify(target_job_functions)
      )
      uploadPdfFile(formData, formPdf)
    }
  }

  render() {
    let showStudentProfessional = null
    let showTFSelect = null

    this.state.jobFunctionMapOptions.sort(this.compare)

    if (this.studentProfFlag == true) {
      showStudentProfessional = (
        <div className="sf-dropdown-left">
          <SelectPlus
            className=""
            closeOnSelect={true}
            value={this.state.studentProf}
            searchable={false}
            valueKey="value"
            clearable={false}
            tabSelectsValue={false}
            placeholder="Are you a Professional or Student"
            options={studentProfessionalOptions}
            onChange={this.onChangeStudentProfSelect}
          />
        </div>
      )
      showTFSelect = (
        <div className="sf-dropdown-right">
          <SelectPlus
            className="sf-select-class"
            closeOnSelect={this.state.disabled}
            noResultsText="No results found"
            searchable={true}
            multi
            tabSelectsValue={false}
            valueKey="value"
            clearable={false}
            placeholder="Select target functions (max 3)"
            options={this.state.jobFunctionMapOptions}
            filterOptions={this.filterOptionsEndState}
            onChange={this.onChangeTFSelect}
          />
        </div>
      )
    } else {
      showStudentProfessional = null
      showTFSelect = (
        <div className="sf-dropdown-right-only">
          <SelectPlus
            className="sf-select-class"
            closeOnSelect={this.state.disabled}
            noResultsText="No results found"
            searchable={true}
            multi
            valueKey="value"
            tabSelectsValue={false}
            clearable={false}
            placeholder="Select target functions (max 3)"
            options={this.state.jobFunctionMapOptions}
            filterOptions={this.filterOptionsEndState}
            onChange={this.onChangeTFSelect}
          />
        </div>
      )
    }

    return (
      <div className="sf-container">
        <div className="sf-container-top">
          <div className="sf-bg-image" />
          <div className="sf-content">
            <div className="sf-heading">Power up your LinkedIn Profile</div>
            <div className="sf-subheading">Let's get started !</div>
            <div className="sf-selected-list-container">
              <div className="sf-selected-list">
                {this.getSelectedJobFunctionsAtTop()}
              </div>
            </div>
            <div className="row sf-dropdown-block">
              {showStudentProfessional}
              {showTFSelect}
              <div className="sf-view-btn">
                <a href="javascript:void(0);">
                  <button
                    type="button"
                    data-value="default"
                    onClick={this.debounceHandleSubmit}
                    className="btn btn-sf-view-feedback btn-primary">
                    View feedback
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="sf-container-bottom">
          <div className="sf-col">
            <div className="sf-col-icon">
              <img
                src={`${imgSrc}Actionable-insights.svg`}
                width="65px"
                height="65px"
              />
            </div>
            <div className="sf-col-heading">Actionable insights</div>
            <div className="sf-col-content">
              Personalized feedback to improve{' '}
              <strong>key profile elements</strong> with suggested samples. Edit
              feature to modify content and see the impact on profile
            </div>
          </div>
          <div className="sf-col">
            <div className="sf-col-icon">
              <img
                src={`${imgSrc}SEO-keyword-optimization.svg`}
                width="65px"
                height="65px"
              />
            </div>
            <div className="sf-col-heading">SEO keyword optimization</div>
            <div className="sf-col-content">
              AI based <strong>content recommendation</strong> to strengthen
              profile visibility. Machine Learning based{' '}
              <strong>scoring</strong> to evaluate overall profile strength
            </div>
          </div>
          <div className="sf-col">
            <div className="sf-col-icon">
              <img
                src={`${imgSrc}Intuitive-design.svg`}
                width="65px"
                height="65px"
              />
            </div>
            <div className="sf-col-heading">Skill set recommendations</div>
            <div className="sf-col-content">
              Align your Resume and LinkedIn profile to portray a consistent
              story. Intelligent <strong>skill gap analysis</strong> to power up
              LinkedIn profile
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    api_data: state.loginData.api_data,
    api_fetch_id: state.loginData.id,
    uploaded_data: state.loginData.uploaded_data,
    pdf_data: state.uploadPdf.pdf_data,
    pdf_fetch_id: state.uploadPdf.id,
    uploaded_pdf: state.uploadPdf.uploaded_pdf,
    user: state.user.data,
    functions: state.aspireFunctionMappings.function_mappings,
  }
}

export default connect(
  mapStateToProps,
  {
    processApiData,
    updateApiData,
    uploadPdfFile,
    updatePdfData,
    redirectInternal,
    getLatestFetchId,
  }
)(SelectFunction)
