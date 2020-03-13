import { createAction } from 'redux-actions'
// import api from './../modules/services/api'
import api from '@vmockinc/dashboard/services/api'
import store from './../../store/configureStore'
import _ from 'underscore'
import { log } from './../actions/commonActions'

import { PREFIX } from './../actions/actions'

export const VIDEO_PROCESSED_PERCENT = PREFIX + 'VIDEO_PROCESSED_PERCENT'

export function setVideoProcessedPercent(percentage) {
  store.dispatch(createAction(VIDEO_PROCESSED_PERCENT)(percentage))
}

export function calibrationAPIStage1(
  key,
  id,
  newblob,
  calibStage1Success,
  calibrationStage1
) {
  let fd = new FormData()
  fd.append('clip', newblob, 'clip')
  fd.append('id', key)
  fd.append('interview_key', store.getState().appIntKey.key)
  api
    .service('ep')
    .post(`/calibration`, fd, { processData: false, contentType: false })
    .done(data => {
      calibStage1Success(data, id)
    })
    .fail(xhr => {
      // if (xhr.status === 422) window.location.reload()
      log('%c Api faliure /calibration', 'background: red; color: white', xhr)
      calibrationStage1(id + 1)
    })
}
