import api from '@vmockinc/dashboard/services/api'
import { notification } from '../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const timeOutMilliseconds = 2000

export function generatePdf(data) {
  notification('Processing. Please wait..', 'information', timeOutMilliseconds)
  // sendTrackingData('process','aspire_actions','notify_success','generate_pdf_processing_please_wait')

  return dispatch => {
    return api
      .service('ap')
      .post(`aspire/generate-pdf`, {
        data: JSON.stringify(data),
      })
      .done(response => {
        downloadFile(response.url)
        sendTrackingData(
          'process',
          'aspire_actions',
          'success',
          'download_pdf_success'
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
