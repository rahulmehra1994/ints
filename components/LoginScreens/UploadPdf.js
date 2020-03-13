import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updatePdfData, uploadPdfFile } from '../../actions/Login'
import $ from 'jquery'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { resumePDFChangeFunctionModalAriaLabel } from '../Constants/AriaLabelText'

class UploadPdf extends Component {
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
  }

  componentDidMount() {
    this.replaceImageWithAvatarIfNotPresent('as-pdf-profile-img-backup')
  }

  componentDidUpdate() {
    this.replaceImageWithAvatarIfNotPresent('as-pdf-profile-img-backup')
  }

  handleClick(e) {
    e.preventDefault()
    this.sendTrackingDataDebounceClick(
      'event',
      'aspire_appbar',
      'click',
      'upload_pdf_button'
    )
    $('#pdfFileID').click()
  }

  handleSubmit(e) {
    e.preventDefault()
    this.uploadPdfInput()
  }

  handleChange(e) {
    this.sendTrackingDataDebounceSubmit(
      'event',
      'aspire_appbar',
      'submit',
      'upload_pdf_button'
    )
    this.uploadPdfInput()
  }

  uploadPdfInput() {
    const formData = new FormData(this.form)
    if (!this.props.hasOwnProperty('id')) {
      const { updatePdfData } = this.props
      updatePdfData({
        pdf_data: { formData: formData, formPdf: this.formPdf },
      })
      this.formPdf.value = ''
    } else {
      const { uploadPdfFile, hideModal } = this.props
      uploadPdfFile(formData, this.formPdf)
      this.formPdf.value = ''
      hideModal('outside')
    }
  }

  fetchImageUrl(url) {
    if (_.isEmpty(url)) {
      return `${process.env.APP_BASE_URL}dist/images/img-suggestion-4.jpg`
    }

    return url
  }

  replaceImageWithAvatarIfNotPresent(id) {
    $('#' + id).on('error', function() {
      $(this).attr(
        'src',
        `${process.env.APP_BASE_URL}dist/images/img-suggestion-4.jpg`
      )
    })
  }

  render() {
    const { feedback } = this.props
    let prevFetchId = 0
    let formParams = []

    if (this.props.hasOwnProperty('id')) {
      prevFetchId = this.props.id
      formParams.push(
        <input type="hidden" name="prev_id" value={prevFetchId} />
      )
    } else {
      formParams.push(
        <input type="hidden" key="api_id" name="api_id" value="-1" />
      )
      formParams.push(
        <input type="hidden" key="resume_id" name="resume_id" value="0" />
      )
    }

    let url = ''
    if (
      feedback.hasOwnProperty('section_wise_feedback') &&
      feedback['section_wise_feedback'].hasOwnProperty(
        'profile_picture_feedback'
      ) &&
      !_.isEmpty(
        feedback['section_wise_feedback']['profile_picture_feedback']
      ) &&
      feedback['section_wise_feedback'][
        'profile_picture_feedback'
      ].hasOwnProperty('profile_picture_url')
    ) {
      url = this.fetchImageUrl(
        feedback['section_wise_feedback']['profile_picture_feedback'][
          'profile_picture_url'
        ]
      )
    } else {
      url = this.fetchImageUrl('')
    }

    let name =
      feedback['section_wise_feedback']['personal_information_feedback'][
        'profile_name_score_class'
      ]['name']

    let linkedInUrl = 'https://www.linkedin.com/'
    if (feedback.hasOwnProperty('linkedin_url')) {
      linkedInUrl = feedback['linkedin_url']
    }
    return (
      <div className="as-pdf-upload-container">
        <div className="as-pdf-upload-heading-wrapper">
          <a
            href="javascript:void(0);"
            className="icon-cross as-pdf-close-btn as-anchor-tag"
            aria-label={resumePDFChangeFunctionModalAriaLabel['close']}
            onClick={() => this.props.hideModal('close_btn')}
          />
          <div className="as-pdf-heading">
            <span
              tabIndex={0}
              aria-label={
                resumePDFChangeFunctionModalAriaLabel['pdf']['steps']
              }>
              How to upload your full profile ?
            </span>
          </div>
        </div>
        <div className="as-pdf-upload-partition-line" />
        <div className="as-pdf-upload-content-wrapper">
          <div className="col-sm-5 as-pdf-upload-content">
            <div
              className="as-pdf-upload-steps"
              tabIndex={0}
              aria-label={
                resumePDFChangeFunctionModalAriaLabel['pdf']['step1']
              }>
              <div className="col-sm-2 as-pdf-upload-steps-number">1</div>
              <span className="as-pdf-upload-steps-text">
                Click ‘Go to LinkedIn’ profile
              </span>
            </div>
            <div className="line-between-steps" />
            <div
              className="as-pdf-upload-steps"
              tabIndex={0}
              aria-label={
                resumePDFChangeFunctionModalAriaLabel['pdf']['step2']
              }>
              <div className="col-sm-2 as-pdf-upload-steps-number">2</div>
              <span className=" as-pdf-upload-steps-text">
                Click ‘More’ and then ‘Save to PDF’
              </span>
            </div>
            <div className="line-between-steps" />
            <div
              className="as-pdf-upload-steps"
              tabIndex={0}
              aria-label={
                resumePDFChangeFunctionModalAriaLabel['pdf']['step3']
              }>
              <div className="col-sm-2 as-pdf-upload-steps-number">3</div>
              <span className=" as-pdf-upload-steps-text">
                Upload your profile PDF
              </span>
            </div>
            <div className="col-sm-6 as-pdf-btns-col">
              <a
                href={linkedInUrl}
                target="_blank"
                aria-label={resumePDFChangeFunctionModalAriaLabel['go_to']}>
                <button
                  className="btn btn-outline-primary as-go-to-linkedin-btn"
                  tabIndex={-1}>
                  Go to LinkedIn Profile
                </button>{' '}
              </a>
            </div>
            <div className="col-sm-5 col-sm-offset-1 as-pdf-btns-col">
              <form
                method="post"
                id="pdfFormID"
                ref={c => (this.form = c)}
                onSubmit={this.handleSubmit}>
                <button
                  className="btn btn-primary as-upload-pdf-btn"
                  aria-label={
                    resumePDFChangeFunctionModalAriaLabel['pdf']['upload']
                  }
                  onClick={e => this.handleClick(e)}>
                  Upload LinkedIn PDF
                </button>
                <input
                  aria-label={
                    resumePDFChangeFunctionModalAriaLabel['pdf']['file_input']
                  }
                  type="file"
                  accept="application/pdf"
                  name="linked_in"
                  id="pdfFileID"
                  ref={ref => {
                    this.formPdf = ref
                  }}
                  className="hide-it"
                  onChange={this.handleChange}
                />
                {formParams}
              </form>
            </div>
          </div>
          <div className="col-sm-7 as-pdf-upload-background-container">
            <div className="as-pdf-upload-background">
              <div className="as-pdf-profile-container-img">
                <img
                  className="as-pdf-upload-profile-img"
                  src={url}
                  id="as-pdf-profile-img-backup"
                  alt="your profile picture"
                />
              </div>
              <div className="as-pdf-profile-container-name">
                <div className="as-pdf-upload-profile-name">{name}</div>
              </div>
              <div className="white-block" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    pdf_data: state.uploadPdf.pdf_data,
    feedback: state.aspireFeedbackData.data,
  }
}

export default connect(
  mapStateToProps,
  { updatePdfData, uploadPdfFile }
)(UploadPdf)
