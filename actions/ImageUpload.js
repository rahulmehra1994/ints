import { createAction } from 'redux-actions'
import { getFileExtension } from '@vmockinc/dashboard/services/helpers'
import { notification } from '../services/helpers'
import api from '@vmockinc/dashboard/services/api'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const PREFIX = 'Image.'

export const UPLOAD_IMAGE_INIT = PREFIX + 'UPLOAD_IMAGE_INIT'
export const UPLOAD_IMAGE_DONE = PREFIX + 'UPLOAD_IMAGE_DONE'
export const UPDATE_IMAGE_DATA = PREFIX + 'UPDATE_IMAGE_DATA'

export const uploadImageInit = createAction(UPLOAD_IMAGE_INIT)
export const uploadImageDone = createAction(UPLOAD_IMAGE_DONE)
export const updateImageData = createAction(UPDATE_IMAGE_DATA)

export const DYNAMIC_FEEDBACK_INIT = PREFIX + 'DYNAMIC_FEEDBACK_INIT'
export const DYNAMIC_FEEDBACK_DONE = PREFIX + 'DYNAMIC_FEEDBACK_DONE'
export const DYNAMIC_FEEDBACK_RESET = PREFIX + 'DYNAMIC_FEEDBACK_RESET'

export const dynamicFeedbackInit = createAction(DYNAMIC_FEEDBACK_INIT)
export const dynamicFeedbackDone = createAction(DYNAMIC_FEEDBACK_DONE)
export const dynamicFeedbackReset = createAction(DYNAMIC_FEEDBACK_RESET)

const timeOutMilliseconds = 2000

export function dynamicImageFeedback(data) {
  return dispatch => {
    dispatch(uploadImageInit())

    return api
      .service('ap')
      .post(`aspire/upload-image`, data, {
        processData: false,
        contentType: false,
      })
      .done(response => {
        dispatch(uploadImageDone(response))
      })
      .fail(xhr => {
        let message = 'Failed to apply changes on Image.'
        let trackMessage = 'upload_failed'
        if (xhr && xhr.status === 403) {
          message = 'You can not upload a new image.'
          trackMessage = 'upload_limit_finish'
        }
        dispatch(uploadImageDone(new Error(message)))
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          'image_upload_failed-' + JSON.parse(xhr.responseText)
        )
        notification(message, 'error', timeOutMilliseconds)
      })
  }
}

export function uploadImage(data, image) {
  let imageName = null,
    imageExt = null,
    imageSize = null,
    imageType = null

  if (image && image.files && image.files[0]) {
    imageName = image.files[0].name
    imageSize = image.files[0].size
    imageType = image.files[0].type

    if (imageName) {
      imageExt = getFileExtension(imageName).toLowerCase()
    }
  }

  return dispatch => {
    // check if file is an Image
    const invalidFileMessage = 'Failed to upload file. Please upload an image.'
    // if (_.isEmpty(imageExt) || _.isEmpty(imageType)) {
    //   notification(invalidFileMessage, 'error', timeOutMilliseconds)
    //   let jsonObjectForTracking = {
    //     eventLabel: 'failed_please_upload_image',
    //     imageName: imageName,
    //     imageExt: imageExt,
    //     imageSize: imageExt,
    //     imageType: imageType
    //   }
    //   sendTrackingData(
    //     'process',
    //     'aspire_actions',
    //     'notify_error',
    //     JSON.stringify(jsonObjectForTracking)
    //   )
    //   return
    // }

    // if (imageExt) {
    //   if (imageExt !== 'png' && imageExt !== 'jpg' && imageExt !== 'jpeg') {
    //     if (imageExt === 'gif') {
    //       notification(
    //         "'Gif' format currently not supported. Please upload 'png', 'jpg' or 'jpeg' format image.",
    //         'error',
    //         timeOutMilliseconds
    //       )
    //     } else {
    //       notification(invalidFileMessage, 'error', timeOutMilliseconds)
    //     }

    //     let jsonObjectForTracking = {
    //       eventLabel: 'failed_please_upload_image',
    //       imageName: imageName,
    //       imageExt: imageExt,
    //       imageSize: imageExt,
    //       imageType: imageType
    //     }
    //     sendTrackingData(
    //       'process',
    //       'aspire_actions',
    //       'notify_error',
    //       JSON.stringify(jsonObjectForTracking)
    //     )
    //     return
    //   }
    // }

    // if (imageType) {
    //   if (
    //     imageType !== 'image/png' &&
    //     imageType !== 'image/jpg' &&
    //     imageType !== 'image/jpeg'
    //   ) {
    //     if (imageType === 'image/gif') {
    //       notification(
    //         "'Gif' format currently not supported. Please upload 'png', 'jpg' or 'jpeg' format image.",
    //         'error',
    //         timeOutMilliseconds
    //       )
    //     } else {
    //       notification(invalidFileMessage, 'error', timeOutMilliseconds)
    //     }

    //     let jsonObjectForTracking = {
    //       eventLabel: 'failed_please_upload_image',
    //       imageName: imageName,
    //       imageExt: imageExt,
    //       imageSize: imageExt,
    //       imageType: imageType
    //     }
    //     sendTrackingData(
    //       'process',
    //       'aspire_actions',
    //       'notify_error',
    //       JSON.stringify(jsonObjectForTracking)
    //     )
    //     return
    //   }
    // }

    if (imageSize) {
      if (imageSize > 8000000) {
        notification(
          'Failed to upload file. File size exceeds 8MB.',
          'error',
          timeOutMilliseconds
        )
        let jsonObjectForTracking = {
          eventLabel: 'failed_image_size_exceeds_8mb',
          imageName: imageName,
          imageExt: imageExt,
          imageSize: imageExt,
          imageType: imageType,
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

    dispatch(uploadImageInit())

    return api
      .service('ap')
      .post(`aspire/upload-image`, data, {
        processData: false,
        contentType: false,
      })
      .done(response => {
        dispatch(uploadImageDone(response))
        // notification(
        //   'Image uploaded. Please wait for the changes to take effect.',
        //   'information',
        //   timeOutMilliseconds
        // )
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_success',
          'image_uploaded'
        )
      })
      .fail(xhr => {
        let message = 'Failed to upload image. Try uploading again.'
        let trackMessage = 'upload_failed'
        if (xhr && xhr.status === 403) {
          message = 'You can not upload a new image.'
          trackMessage = 'upload_limit_finish'
        }
        dispatch(uploadImageDone(new Error(message)))
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          'image_upload_failed-' + JSON.parse(xhr.responseText)
        )
        notification(message, 'error', timeOutMilliseconds)
      })
  }
}

export const REFRESH_IMAGE_DONE = PREFIX + 'REFRESH_IMAGE_DONE'
export const refreshImageDone = createAction(REFRESH_IMAGE_DONE)

export function refreshImageUrl(profilePictureString = '') {
  return dispatch => {
    if (profilePictureString == '') {
      return
    }
    return api
      .service('ap')
      .post(`aspire/refresh-url`, {
        profile_picture_string: profilePictureString,
      })
      .done(response => {
        dispatch(refreshImageDone(response))
      })
      .fail(xhr => {})
  }
}
export const SAVE_CURRENT_IMAGE_INIT = PREFIX + 'SAVE_CURRENT_IMAGE_INIT'
export const SAVE_CURRENT_IMAGE_DONE = PREFIX + 'SAVE_CURRENT_IMAGE_DONE'
export const SAVE_CURRENT_IMAGE_FAIL = PREFIX + 'SAVE_CURRENT_IMAGE_FAIL'
export const saveCurrentImageInit = createAction(SAVE_CURRENT_IMAGE_INIT)
export const saveCurrentImageDone = createAction(SAVE_CURRENT_IMAGE_DONE)
export const saveCurrentImageFail = createAction(SAVE_CURRENT_IMAGE_FAIL)

export function saveCurrentImage(imageBlob) {
  return dispatch => {
    dispatch(saveCurrentImageInit())
    return api
      .service('ap')
      .post(`aspire/save-image`, imageBlob, {
        processData: false,
        contentType: false,
      })
      .done(response => {
        dispatch(saveCurrentImageDone(response))
      })
      .fail(xhr => {
        dispatch(saveCurrentImageFail())
        let message = 'Failed to save image. Try uploading again.'
        let trackMessage = 'upload_failed'
        if (xhr && xhr.status === 403) {
          message = 'You can not upload a new image.'
          trackMessage = 'upload_limit_finish'
        }
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          'image_save_failed-' + JSON.parse(xhr.responseText)
        )
        notification(message, 'error', timeOutMilliseconds)
      })
  }
}

export function downloadImage(data) {
  notification('Downloading. Please wait..', 'information', timeOutMilliseconds)
  // sendTrackingData('process','aspire_actions','notify_success','generate_pdf_processing_please_wait')

  return dispatch => {
    return api
      .service('ap')
      .post(`aspire/download-image`, {
        data: JSON.stringify(data),
      })
      .done(response => {
        downloadFile(response.url)
        sendTrackingData(
          'process',
          'aspire_actions',
          'success',
          'download_image_success'
        )
      })
      .fail(xhr => {
        notification(
          'Failed to download. Try again!',
          'error',
          timeOutMilliseconds
        )
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          'failed_to_download_pdf-' + JSON.parse(xhr.responseText)
        )
      })
  }
}

function downloadFile(url) {
  let a = window.document.createElement('a')
  a.href = url
  a.download = 'download'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
