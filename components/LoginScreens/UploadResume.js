import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateResumeData, uploadResumeFile } from '../../actions/Login'
import $ from 'jquery'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { encodeRouteParam } from '@vmockinc/dashboard/services/helpers'
import { resumePDFChangeFunctionModalAriaLabel } from '../Constants/AriaLabelText'

const modules = {
  resume: 'Resume module',
  careerfit: 'Career Fit',
  aspire: 'Aspire',
}

class UploadResume extends Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.sendTrackingDataDebounceClick = _.debounce(
      sendTrackingData,
      3000,
      true
    )
    this.sendTrackingDataDebounceSubmit = _.debounce(
      sendTrackingData,
      3000,
      true
    )
    this.sendTrackingDataDebounceSelect = _.debounce(
      sendTrackingData,
      3000,
      true
    )
  }

  handleClick(e) {
    e.preventDefault()
    this.sendTrackingDataDebounceClick(
      'event',
      'aspire_appbar',
      'click',
      'upload_resume_btn'
    )
    $('#resumeFileID').click()
  }

  handleSubmit(e) {
    e.preventDefault()
    this.uploadResumeInput()
  }

  handleChange(e) {
    this.sendTrackingDataDebounceSubmit(
      'event',
      'aspire_appbar',
      'submit',
      'upload_resume_btn'
    )
    this.uploadResumeInput()
  }

  handleMouseOver(e) {
    let id = $(e.target)
      .closest('[data-id]')
      .data('id')
    $('#resume' + id).css({ 'background-color': '#d4d4d4' })
  }

  handleMouseOut(e) {
    let id = $(e.target)
      .closest('[data-id]')
      .data('id')
    $('#resume' + id).css({ 'background-color': '#EDEDED' })
  }

  handleClickCross(e) {
    let i = $(e.target)
      .closest('[data-key]')
      .data('key')
    $('.resume' + i).css({ display: 'none' })
  }

  selectResumeID(e) {
    const { topFour, hideModal } = this.props
    let id = $(e.target)
      .closest('[data-id]')
      .data('id')
    let resumeId = topFour[id][0]

    let jsonObjectForTracking = {
      eventLabel: 'resume_select',
      resumeId: resumeId,
    }

    this.sendTrackingDataDebounceSelect(
      'event',
      'aspire_appbar',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.uploadResumeInput(resumeId)
  }

  uploadResumeInput(resumeId = -1) {
    const formData = new FormData(this.form)

    if (this.props.hasOwnProperty('id')) {
      const { uploadResumeFile, hideModal } = this.props

      if (
        this.formResume &&
        this.formResume.files &&
        this.formResume.files[0]
      ) {
        formData.append('file_name', this.formResume.files[0].name)
      }

      if (resumeId != -1) {
        formData.append('file_id', resumeId)
      }

      uploadResumeFile(formData, this.formResume, resumeId)
      this.formResume.value = ''
      hideModal('outside')
    }
  }

  getCfUrl(resumeId, endState) {
    endState = encodeRouteParam(endState)
    return `/career-fit/${resumeId}/${endState}/feedback_summary`
  }

  renderCfHistory(resumeId, endStatesArray) {
    if (_.isEmpty(endStatesArray)) {
      return null
    }

    const endStates = endStatesArray.map((endstate, i) => (
      <span key={i}>
        {i !== 0 ? ',' : ''}{' '}
        <a
          aria-label={resumePDFChangeFunctionModalAriaLabel['resume']['cf']}
          target="_blank"
          href={this.getCfUrl(resumeId, endstate).toLowerCase()}>
          {endstate}
        </a>
      </span>
    ))

    return (
      <div>
        {endStates.length} end state
        {endStates.length > 1 ? 's' : ''} checked on Career Fit: {endStates}
      </div>
    )
  }

  renderResumeLinks(resume) {
    let date = new Date(resume[2])
    date =
      date.getDate() +
      ' ' +
      date.toLocaleDateString('en-us', { month: 'long' }) +
      ' ' +
      date.getFullYear()

    let output = _.map(resume[3], (type, idx) => {
      return (
        <div>
          {type === 'careerfit'
            ? this.renderCfHistory(resume[0], resume[5])
            : ``}
          {type === 'aspire'
            ? `${resume[4].length} target function(s) checked on ${
                modules[type]
              }: ${resume[4].join(', ')}`
            : ``}
          {type === 'resume' ? (
            <div>
              Uploaded on{' '}
              <a
                aria-label={
                  resumePDFChangeFunctionModalAriaLabel['resume']['resume']
                }
                target="_blank"
                href={`/resume/${resume[0]}/feedback/summary`}>
                Resume module
              </a>{' '}
            </div>
          ) : (
            ``
          )}
        </div>
      )
    })

    return (
      <div>
        <strong>
          {' '}
          {resume[1].length > 30
            ? `${resume[1].substr(0, 30)}...`
            : resume[1]}{' '}
        </strong>{' '}
        <br />
        Uploaded on {date} <br />
        {output}
      </div>
    )
  }

  render() {
    let prevFetchId = 0
    let formParams = []

    if (this.props.hasOwnProperty('id')) {
      prevFetchId = this.props.id
      formParams.push(
        <input type="hidden" name="prev_id" value={prevFetchId} />
      )
    }

    const { topFour, allSmallResume, normalResume, currentResume } = this.props
    let uploadedResumes = []

    if (!_.isEmpty(topFour)) {
      for (let i in topFour) {
        uploadedResumes.push(
          <button
            aria-label={`select ${topFour[i][1]}`}
            id={'resume' + i}
            className="likedin-skills border-radius-4 cursor-pointer resume-file-uploaded-btn "
            data-id={i}
            onMouseOver={e => this.handleMouseOver(e)}
            onMouseOut={e => this.handleMouseOut(e)}
            onClick={e => this.selectResumeID(e)}>
            {this.renderResumeLinks(topFour[i])}
          </button>
        )
      }
    } else {
      uploadedResumes.push(
        <h4
          className="alternate-resume-heading"
          tabIndex={0}
          aria-label={
            resumePDFChangeFunctionModalAriaLabel['resume']['no_upload']
          }>
          {' '}
          No alternate {allSmallResume} uploaded
        </h4>
      )
    }

    let showLastResume = null
    if (!_.isEmpty(currentResume)) {
      showLastResume = (
        <div>
          <span className="font-14 current-resume-placeholder">
            Current Resume :{' '}
          </span>
          <span className="font-14 current-resume-name">{currentResume}</span>
        </div>
      )
    }

    return (
      <div>
        <div className="container-fluid bg-white">
          <div className="row">
            <div
              className="col-sm-12 position-relative"
              id="close-resume-modal">
              <div className="upload-resume-main-heading">
                <span
                  tabIndex={0}
                  aria-label={
                    resumePDFChangeFunctionModalAriaLabel['resume']['match']
                  }>
                  {normalResume} Skills Match
                </span>
              </div>
              <div className="upload-resume-sub-heading">
                (View skills match in edit mode)
              </div>
              <a
                onClick={() => this.props.hideModal('close_btn')}
                href="javascript:void(0)"
                className="icon-cross pull-right resume-close-btn modal-close-button"
                aria-label={resumePDFChangeFunctionModalAriaLabel['close']}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 margin-4p">
              <div className="col-upload-new-resume text-center border-gray-right">
                <div className="or-text"> OR</div>
                <h3>
                  <span
                    tabIndex={0}
                    aria-label={
                      resumePDFChangeFunctionModalAriaLabel['resume']['note']
                    }>
                    {' '}
                    Upload New {normalResume}
                  </span>
                </h3>
                <form
                  method="post"
                  id="resumeFormID"
                  ref={c => (this.form = c)}
                  onSubmit={this.handleSubmit}>
                  <a
                    aria-label={
                      resumePDFChangeFunctionModalAriaLabel['resume']['upload']
                    }
                    href="javascript:void(0);"
                    type="button"
                    onClick={e => this.handleClick(e)}>
                    <div className="upload-new-resume">
                      {' '}
                      <img
                        src={`${process.env.APP_BASE_URL}dist/images/upload-new-resume.gif`}
                        alt=""
                        height="90"
                      />{' '}
                    </div>
                  </a>
                  <br />
                  <button
                    aria-label={
                      resumePDFChangeFunctionModalAriaLabel['resume']['upload']
                    }
                    className="btn2 btn btn-primary"
                    onClick={e => this.handleClick(e)}>
                    {' '}
                    Upload {normalResume}{' '}
                  </button>
                  <h5>
                    {' '}
                    Only {allSmallResume} (pdf) allowed and no cover letter
                  </h5>
                  {showLastResume}
                  <input
                    aria-label={
                      resumePDFChangeFunctionModalAriaLabel['resume'][
                        'file_input'
                      ]
                    }
                    type="file"
                    accept="application/pdf"
                    name="resume"
                    id="resumeFileID"
                    ref={function(ref) {
                      this.formResume = ref
                    }.bind(this)}
                    className="hide-it"
                    onChange={this.handleChange}
                  />
                  {formParams}
                </form>
              </div>
            </div>
            <div className="col-sm-6 margin-4p">
              <div className="col-upload-new-resume">
                <h3>
                  <span
                    tabIndex={0}
                    aria-label={
                      resumePDFChangeFunctionModalAriaLabel['resume'][
                        'uploaded'
                      ]
                    }>
                    {' '}
                    Select from already uploaded{' '}
                  </span>
                </h3>
                <div className="uploaded-resumes-container">
                  {uploadedResumes}
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
    allSmallResume: state.aspireFeedbackData.allSmallResume,
    normalResume: state.aspireFeedbackData.normalResume,
  }
}
export default connect(mapStateToProps, { updateResumeData, uploadResumeFile })(
  UploadResume
)
