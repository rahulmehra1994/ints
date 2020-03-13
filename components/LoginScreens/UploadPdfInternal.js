import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  updatePdfData,
  uploadPdfFile,
  redirectInternal,
  getLatestFetchId,
  functionMappings,
} from '../../actions/Login'
import $ from 'jquery'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import Loading from '@vmockinc/dashboard/Dashboard/components/Loading'

class UploadPdfInternal extends Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    // this.sendTrackingDebounce = _.debounce(sendTrackingData, 1000, true)
  }

  UNSAFE_componentWillMount() {
    if (!this.props.latestFetchIdFetched) {
      this.props.getLatestFetchId()
      this.props.functionMappings()
    }
  }

  handleClick(e) {
    e.preventDefault()
    // this.sendTrackingDebounce('event','aspire_appbar','submit','pdf_upload')
    $('#internalFileID').click()
  }

  handleSubmit(e) {
    e.preventDefault()
    this.uploadPdfInput()
  }

  handleChange(e) {
    this.uploadPdfInput()
  }

  uploadPdfInput() {
    const formData = new FormData(this.form)
    if (!this.props.hasOwnProperty('id')) {
      const { params, updatePdfData, redirectInternal } = this.props
      updatePdfData({
        pdf_data: { formData: formData, formPdf: this.formPdf },
      })
      this.formPdf.value = ''

      redirectInternal(`/aspire/data/select-function`)
    } else {
      const { uploadPdfFile, hideModal } = this.props
      uploadPdfFile(formData, this.formPdf)
      this.formPdf.value = ''
      hideModal()
    }
  }

  render() {
    if (
      !this.props.latestFetchIdFetched ||
      !this.props.functionMappingFetched
    ) {
      return <Loading className="fullscreen" />
    }

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
    return (
      <div className="test-upload-pdf">
        <div className="container-fluid light-gray-bg-2 uploadPDF">
          <div className="row">
            <div className="col-sm-12">
              <h2 className="text-weight inline-block">
                Downloading your Linkedin profile{' '}
              </h2>{' '}
              <span
                className="close-button glyphicon glyphicon-remove pull-right pdf-close-btn-margin"
                onClick={this.props.hideModal}
                style={{ display: 'none' }}
              />
              <img
                src={`${process.env.APP_BASE_URL}dist/images/linkedin-pdf-upload-screen.jpg`}
                width="100%"
              />
            </div>
          </div>
          <div className="row padding-tb-15 ">
            <div className="col-sm-3">
              <div className="pdf-points">
                <div className="number-icon">
                  <div className="pdf-circle"> 1 </div>
                </div>
                <div className="pdf-text">
                  <span className="linkedin-step-h"> Login </span> <br />
                  Log into your Linkedin account and click on profile section.
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="pdf-points">
                <div className="number-icon">
                  <div className="pdf-circle"> 2 </div>
                </div>
                <div className="pdf-text">
                  {' '}
                  <span className="linkedin-step-h"> View profile </span> <br />
                  Click on the symbol residing to the right of “View profile
                  as”.
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="pdf-points">
                <div className="number-icon">
                  <div className="pdf-circle"> 3 </div>
                </div>
                <div className="pdf-text">
                  <span className="linkedin-step-h"> Save to PDF </span> <br />{' '}
                  Select the “Save to PDF” option from dropdown that appears.
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="pdf-points">
                <div className="number-icon">
                  <div className="pdf-circle"> 4 </div>
                </div>
                <div className="pdf-text">
                  {' '}
                  <span className="linkedin-step-h">
                    {' '}
                    Downloaded{' '}
                  </span> <br /> Go to the downloaded location of this file and
                  upload on Aspire.
                </div>
              </div>
            </div>
          </div>
          <div className="clearfix" />
          <div className="row padding-tb-15">
            <div className="col-sm-12 center-block text-center ">
              <form
                method="post"
                id="formID"
                ref={c => (this.form = c)}
                onSubmit={this.handleSubmit}>
                <a
                  href="javascript:void(0);"
                  className="btn3 btn btn-primary"
                  type="button"
                  onClick={e => this.handleClick(e)}>
                  {' '}
                  Upload Now{' '}
                </a>
                <input
                  type="file"
                  accept="application/pdf"
                  name="linked_in"
                  id="internalFileID"
                  ref={function(ref) {
                    this.formPdf = ref
                  }.bind(this)}
                  className="hide-it"
                  onChange={this.handleChange}
                />
                {formParams}
              </form>
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
    latestFetchIdFetched: state.aspireLatestFetchId.fetched,
    functionMappingFetched: state.aspireFunctionMappings.fetched,
  }
}

export default connect(
  mapStateToProps,
  {
    getLatestFetchId,
    functionMappings,
    redirectInternal,
    updatePdfData,
    uploadPdfFile,
  }
)(UploadPdfInternal)
