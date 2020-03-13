import { createAction } from 'redux-actions'
import { getFileExtension } from '@vmockinc/dashboard/services/helpers'
import { notification } from '../services/helpers'
import api from '@vmockinc/dashboard/services/api'
import { push } from 'react-router-redux'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const PREFIX = 'Login.'

export const PROCESS_DATA_INIT = PREFIX + 'PROCESS_DATA_INIT'
export const PROCESS_DATA_DONE = PREFIX + 'PROCESS_DATA_DONE'
export const PROCESS_DATA_FAIL = PREFIX + 'PROCESS_DATA_FAIL'
export const UPDATE_API_DATA = PREFIX + 'UPDATE_API_DATA'
export const UPLOAD_PDF_INIT = PREFIX + 'UPLOAD_PDF_INIT'
export const UPLOAD_PDF_DONE = PREFIX + 'UPLOAD_PDF_DONE'
export const UPDATE_PDF_DATA = PREFIX + 'UPDATE_PDF_DATA'
export const UPDATE_PDF_STATE = PREFIX + 'UPDATE_PDF_STATE'
export const UPLOAD_RESUME_INIT = PREFIX + 'UPLOAD_RESUME_INIT'
export const UPLOAD_RESUME_DONE = PREFIX + 'UPLOAD_RESUME_DONE'
export const UPDATE_RESUME_DATA = PREFIX + 'UPDATE_RESUME_DATA'
export const UPDATE_RESUME_STATE = PREFIX + 'UPDATE_RESUME_STATE'
export const TARGET_FUNCTION_INIT = PREFIX + 'TARGET_FUNCTION_INIT'
export const TARGET_FUNCTION_DONE = PREFIX + 'TARGET_FUNCTION_DONE'
export const TARGET_FUNCTION_FAIL = PREFIX + 'TARGET_FUNCTION_FAIL'
export const UPDATE_FUNCTION_STATE = PREFIX + 'UPDATE_FUNCTION_STATE'

export const processDataInit = createAction(PROCESS_DATA_INIT)
export const processDataDone = createAction(PROCESS_DATA_DONE)
export const processDataFail = createAction(PROCESS_DATA_FAIL)
export const updateApiData = createAction(UPDATE_API_DATA)
export const uploadPdfInit = createAction(UPLOAD_PDF_INIT)
export const uploadPdfDone = createAction(UPLOAD_PDF_DONE)
export const updatePdfData = createAction(UPDATE_PDF_DATA)
export const updatePdfState = createAction(UPDATE_PDF_STATE)
export const uploadResumeInit = createAction(UPLOAD_RESUME_INIT)
export const uploadResumeDone = createAction(UPLOAD_RESUME_DONE)
export const updateResumeData = createAction(UPDATE_RESUME_DATA)
export const updateResumeState = createAction(UPDATE_RESUME_STATE)
export const targetFunctionInit = createAction(TARGET_FUNCTION_INIT)
export const targetFunctionDone = createAction(TARGET_FUNCTION_DONE)
export const targetFunctionFail = createAction(TARGET_FUNCTION_FAIL)
export const updateFunctionState = createAction(UPDATE_FUNCTION_STATE)

const timeOutMilliseconds = 2000

export function redirectInternal(path) {
  return dispatch => {
    dispatch(push(path))
  }
}

export function processApiData(target_job_functions, student_prof) {
  return dispatch => {
    dispatch(processDataInit())
    return api
      .service('ap')
      .post(`aspire/linkedin-api`, {
        target_job_functions: JSON.stringify(target_job_functions),
        student_professional: student_prof,
      })
      .done(response => {
        dispatch(processDataDone(response))
      })
      .fail(xhr => dispatch(processDataFail()))
  }
}

export function uploadPdfFile(data, pdf) {
  let pdfName = null,
    pdfExt = null,
    pdfSize = null,
    pdfType = null

  if (pdf && pdf.files && pdf.files[0]) {
    pdfName = pdf.files[0].name
    pdfSize = pdf.files[0].size
    pdfType = pdf.files[0].type
    if (pdfName) {
      pdfExt = getFileExtension(pdfName)
    }
  }

  return dispatch => {
    // check if file is a PDF
    const invalidFileMessage =
      'Failed to upload file. Please upload a PDF file.'

    // for dot extension files like htaccess and htpasswd
    if (
      pdf &&
      pdf.files &&
      pdf.files[0] &&
      (_.isEmpty(pdfExt) || _.isEmpty(pdfType))
    ) {
      notification(invalidFileMessage, 'error', timeOutMilliseconds)
      let jsonObjectForTracking = {
        eventLabel: 'failed_please_upload_pdf',
        pdfName: pdfName,
        pdfExt: pdfExt,
        pdfSize: pdfSize,
        pdfType: pdfType,
      }
      sendTrackingData(
        'process',
        'aspire_actions',
        'notify_error',
        JSON.stringify(jsonObjectForTracking)
      )
      return
    }

    if (pdfExt) {
      if (pdfExt !== 'pdf') {
        notification(invalidFileMessage, 'error', timeOutMilliseconds)
        let jsonObjectForTracking = {
          eventLabel: 'failed_please_upload_pdf',
          pdfName: pdfName,
          pdfExt: pdfExt,
          pdfSize: pdfSize,
          pdfType: pdfType,
        }
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          JSON.stringify(jsonObjectForTracking)
        )
        return
      }
    } else if (pdfType) {
      if (pdfType !== 'application/pdf') {
        notification(invalidFileMessage, 'error', timeOutMilliseconds)
        let jsonObjectForTracking = {
          eventLabel: 'failed_please_upload_pdf',
          pdfName: pdfName,
          pdfExt: pdfExt,
          pdfSize: pdfSize,
          pdfType: pdfType,
        }
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          JSON.stringify(jsonObjectForTracking)
        )
        return
      }
    }

    dispatch(uploadPdfInit())
    return api
      .service('ap')
      .post(`aspire/linkedin-pdf`, data, {
        processData: false,
        contentType: false,
      })
      .done(response => {
        notification('Processing started.', 'information', timeOutMilliseconds)
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_success',
          'profile_processing_after_pdf_upload_started'
        )
        dispatch(uploadPdfDone(response))
      })
      .fail(xhr => {
        let message = 'Failed to upload profile. Try uploading again.'
        let trackMessage = 'upload_failed'

        if (xhr && xhr.status === 403) {
          message = 'You can not upload a new profile.'
          trackMessage = 'upload_limit_finish'
        }

        if (pdfSize) {
          if (xhr && xhr.status !== 403 && pdfSize > 2000000) {
            message =
              message + ' Please upload a PDF file having size less than 2 MB.'
          }
        }

        dispatch(uploadPdfDone(new Error(message)))
        notification(message, 'error', timeOutMilliseconds)
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          'pdf_upload_failed-' + JSON.parse(xhr.responseText)
        )
      })
  }
}

export function uploadResumeFile(data, pdf, resumeId = -1) {
  if (resumeId != -1) {
    return (dispatch, getState) => {
      dispatch(uploadResumeInit())
      return api
        .service('ap')
        .post(`aspire/resume-api`, data, {
          processData: false,
          contentType: false,
        })
        .done(response => {
          notification(
            'Processing started.',
            'information',
            timeOutMilliseconds
          )
          sendTrackingData(
            'process',
            'aspire_actions',
            'notify_success',
            'processing_started_after_resume_upload'
          )
          dispatch(uploadResumeDone(response))
        })
        .fail(xhr => {
          let message =
            'Failed to upload ' +
            getState().aspireFeedbackData.allSmallResume +
            '. Try uploading again.'
          let trackMessage = 'upload_failed'

          if (xhr && xhr.status === 403) {
            message =
              'You can not upload a new ' +
              getState().aspireFeedbackData.allSmallResume +
              '.'
            trackMessage = 'upload_limit_finish'
          }

          dispatch(uploadResumeDone(new Error(message)))
          notification(message, 'error', timeOutMilliseconds)
          sendTrackingData(
            'process',
            'aspire_actions',
            'notify_error',
            'resume_upload_failed-' + JSON.parse(xhr.responseText)
          )
        })
    }
  } else {
    let pdfName = null,
      pdfExt = null,
      pdfSize = null,
      pdfType = null

    if (pdf && pdf.files && pdf.files[0]) {
      pdfName = pdf.files[0].name
      pdfSize = pdf.files[0].size
      pdfType = pdf.files[0].type
      if (pdfName) {
        pdfExt = getFileExtension(pdfName)
      }
    }

    return (dispatch, getState) => {
      // check if file is a PDF
      const invalidFileMessage =
        'Failed to upload file. Please upload a PDF file.'

      // for dot extension files like htaccess and htpasswd
      if (_.isEmpty(pdfExt) || _.isEmpty(pdfType)) {
        notification(invalidFileMessage, 'error', timeOutMilliseconds)
        let jsonObjectForTracking = {
          eventLabel: 'resume_failed_please_upload_pdf',
          pdfName: pdfName,
          pdfExt: pdfExt,
          pdfSize: pdfSize,
          pdfType: pdfType,
        }
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          JSON.stringify(jsonObjectForTracking)
        )
        return
      }

      if (pdfExt) {
        if (pdfExt !== 'pdf') {
          notification(invalidFileMessage, 'error', timeOutMilliseconds)
          let jsonObjectForTracking = {
            eventLabel: 'resume_failed_please_upload_pdf',
            pdfName: pdfName,
            pdfExt: pdfExt,
            pdfSize: pdfSize,
            pdfType: pdfType,
          }
          sendTrackingData(
            'process',
            'aspire_actions',
            'notify_error',
            JSON.stringify(jsonObjectForTracking)
          )
          return
        }
      } else if (pdfType) {
        if (pdfType !== 'application/pdf') {
          notification(invalidFileMessage, 'error', timeOutMilliseconds)
          let jsonObjectForTracking = {
            eventLabel: 'resume_failed_please_upload_pdf',
            pdfName: pdfName,
            pdfExt: pdfExt,
            pdfSize: pdfSize,
            pdfType: pdfType,
          }
          sendTrackingData(
            'process',
            'aspire_actions',
            'notify_error',
            JSON.stringify(jsonObjectForTracking)
          )
          return
        }
      }

      dispatch(uploadResumeInit())

      return api
        .service('ap')
        .post(`aspire/resume-api`, data, {
          processData: false,
          contentType: false,
        })
        .done(response => {
          notification(
            'Processing started.',
            'information',
            timeOutMilliseconds
          )
          sendTrackingData(
            'process',
            'aspire_actions',
            'notify_success',
            'processing_started_after_resume_upload'
          )
          dispatch(uploadResumeDone(response))
        })
        .fail(xhr => {
          let message =
            'Failed to upload ' +
            getState().aspireFeedbackData.allSmallResume +
            '. Try uploading again.'
          let trackMessage = 'upload_failed'

          if (xhr && xhr.status === 403) {
            message = 'You can not upload a new resume.'
            trackMessage = 'upload_limit_finish'
          }

          if (pdfSize) {
            if (xhr && xhr.status !== 403 && pdfSize > 2000000) {
              message =
                message +
                ' Please upload a ' +
                getState().aspireFeedbackData.normalResume +
                ' file having size less than 2 MB.'
            }
          }

          dispatch(uploadResumeDone(new Error(message)))
          notification(message, 'error', timeOutMilliseconds)
          sendTrackingData(
            'process',
            'aspire_actions',
            'notify_error',
            'resume_upload_failed-' + JSON.parse(xhr.responseText)
          )
        })
    }
  }
}

export function processDataForNewFunction(
  fetchId,
  targetJobFunctions,
  unchangedMessage
) {
  if (unchangedMessage !== false) {
    notification(unchangedMessage, 'error', timeOutMilliseconds)
    return
  }

  return dispatch => {
    dispatch(targetFunctionInit())
    return api
      .service('ap')
      .post(`aspire/change-function`, {
        prev_id: fetchId,
        target_job_functions: JSON.stringify(targetJobFunctions),
      })
      .done(response => {
        notification('Processing started.', 'information', timeOutMilliseconds)
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_success',
          'target_function_change_processing_started'
        )
        dispatch(targetFunctionDone(response))
      })
      .fail(xhr => {
        notification(
          'Failed to process function change.',
          'error',
          timeOutMilliseconds
        )
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          'target_function_change_processing_failed-' +
            JSON.parse(xhr.responseText)
        )
        dispatch(targetFunctionFail())
      })
  }
}

export const FETCH_FUNCTION_MAPPINGS_INIT =
  PREFIX + 'FETCH_FUNCTION_MAPPINGS_INIT'
export const FETCH_FUNCTION_MAPPINGS_DONE =
  PREFIX + 'FETCH_FUNCTION_MAPPINGS_DONE'
export const FETCH_FUNCTION_MAPPINGS_ERROR =
  PREFIX + 'FETCH_FUNCTION_MAPPINGS_ERROR'

export const fetchFunctionMappingsInit = createAction(
  FETCH_FUNCTION_MAPPINGS_INIT
)
export const fetchFunctionMappingsDone = createAction(
  FETCH_FUNCTION_MAPPINGS_DONE
)
export const fetchFunctionMappingsError = createAction(
  FETCH_FUNCTION_MAPPINGS_ERROR
)

export function functionMappings() {
  return dispatch => {
    dispatch(fetchFunctionMappingsInit())
    return api
      .service('ap')
      .get(`aspire/function-mappings`, {})
      .done(response => {
        dispatch(fetchFunctionMappingsDone(response))
      })
      .fail(xhr => {
        sendTrackingData(
          'process',
          'dashboard_aspire_actions',
          'error',
          'function-mappings-api-failed-' + JSON.parse(xhr.responseText)
        )
        dispatch(fetchFunctionMappingsError(JSON.parse(xhr.responseText)))
      })
  }
}

export const LATEST_FETCH_ID_INIT = PREFIX + 'LATEST_FETCH_ID_INIT'
export const LATEST_FETCH_ID_DONE = PREFIX + 'LATEST_FETCH_ID_DONE'
export const LATEST_FETCH_ID_ERROR = PREFIX + 'LATEST_FETCH_ID_ERROR'

export const latestFetchIdInit = createAction(LATEST_FETCH_ID_INIT)
export const latestFetchIdDone = createAction(LATEST_FETCH_ID_DONE)
export const latestFetchIdError = createAction(LATEST_FETCH_ID_ERROR)

export function getLatestFetchId() {
  return dispatch => {
    dispatch(latestFetchIdInit())
    return api
      .service('ap')
      .get(`aspire/latest-fetch-id`, {})
      .done(response => {
        dispatch(latestFetchIdDone(response))
      })
      .fail(xhr => {
        sendTrackingData(
          'process',
          'aspire_actions',
          'error',
          'check_fetch_id_api_failed-' + JSON.parse(xhr.responseText)
        )
        dispatch(latestFetchIdError(JSON.parse(xhr.responseText)))
      })
  }
}
