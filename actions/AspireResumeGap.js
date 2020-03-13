import { createAction } from 'redux-actions'
import api from '@vmockinc/dashboard/services/api'
import { notification } from '../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const PREFIX = 'ASPIRE_RESUME_GAP.'

export const FETCH_RESUME_GAP_INIT = PREFIX + 'FETCH_RESUME_GAP_INIT'
export const FETCH_RESUME_GAP_DONE = PREFIX + 'FETCH_RESUME_GAP_DONE'
export const FETCH_RESUME_GAP_FAIL = PREFIX + 'FETCH_RESUME_GAP_FAIL'
export const UPDATE_RESUME_GAP_STATE = PREFIX + 'UPDATE_RESUME_GAP_STATE'

const fetchResumeGapInit = createAction(FETCH_RESUME_GAP_INIT)
const fetchResumeGapDone = createAction(FETCH_RESUME_GAP_DONE)
const fetchResumeGapFail = createAction(FETCH_RESUME_GAP_FAIL)
export const updateResumeGapState = createAction(UPDATE_RESUME_GAP_STATE)

const timeOutMilliseconds = 2000

export function fetchResumeGap(fetchId, sectionName, currentIndex) {
  return (dispatch, getState) => {
    dispatch(fetchResumeGapInit())
    return api
      .service('ap')
      .post(`aspire/resume-gap`, {
        id: fetchId,
        section: sectionName,
        sub_section_id: currentIndex,
      })
      .done(response => {
        dispatch(fetchResumeGapDone(response))
      })
      .fail(xhr => {
        sendTrackingData(
          'process',
          'aspire_actions',
          'error',
          'resume_gap_api_failed-' + JSON.parse(xhr.responseText)
        )
        dispatch(fetchResumeGapFail())
      })
  }
}
