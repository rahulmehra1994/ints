import { createAction } from 'redux-actions'
import api from '@vmockinc/dashboard/services/api'
import { notification, generateUrl } from '../services/helpers'
import { push } from 'react-router-redux'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const PREFIX = 'AspireFeedback.'
const timeOutMilliseconds = 2000

export const FETCH_FEEDBACK_INIT = PREFIX + 'FETCH_FEEDBACK_INIT'
export const FETCH_FEEDBACK_DONE = PREFIX + 'FETCH_FEEDBACK_DONE'
export const FETCH_FEEDBACK_FAIL = PREFIX + 'FETCH_FEEDBACK_FAIL'
export const FETCH_FEEDBACK_DATA = PREFIX + 'FETCH_FEEDBACK_DATA'
export const UPDATE_FEEDBACK_STATE = PREFIX + 'UPDATE_FEEDBACK_STATE'
const fetchFeedbackInit = createAction(FETCH_FEEDBACK_INIT)
const fetchFeedbackDone = createAction(FETCH_FEEDBACK_DONE)
const fetchFeedbackFail = createAction(FETCH_FEEDBACK_FAIL)
const fetchFeedbackData = createAction(FETCH_FEEDBACK_DATA)
export const updateFeedbackState = createAction(UPDATE_FEEDBACK_STATE)

export function fetchFeedback(fetchId, fetchStatic = true) {
  return (dispatch, getState) => {
    dispatch(fetchFeedbackInit())
    return api
      .service('ap')
      .get(`aspire/result`, {
        modules: '["ui"]',
        id: fetchId,
      })
      .done(response => {
        if (response.status === 'processing') {
          dispatch(fetchFeedbackDone(response))
        } else if (
          getState().aspireFeedbackData.fetched === false &&
          getState().aspireFeedbackData.fetching === true
        ) {
          dispatch(fetchFeedbackDone(response))
          response['fetch_static'] = fetchStatic
          dispatch(fetchFeedbackData(response))
        }
      })
      .fail(xhr => {
        dispatch(fetchFeedbackFail(xhr.responseJSON))
      })
  }
}

export const FETCHED_STATIC_DATA = PREFIX + 'FETCHED_STATIC_DATA'
const fetchedStaticData = createAction(FETCHED_STATIC_DATA)

export function detailedFeedbackUpdated() {
  return dispatch => {
    dispatch(fetchedStaticData())
  }
}

export function redirectSelect(fetchId = -1, page = 'summary', section = '') {
  const path = generateUrl(fetchId, page, section)
  return dispatch => {
    dispatch(push(path))
  }
}

export function runNotifier(message) {
  notification(message, 'information', timeOutMilliseconds)
}

export const SET_RESUME_OR_CV = PREFIX + 'SET_RESUME_OR_CV'
const setResumeOrCv = createAction(SET_RESUME_OR_CV)

export function resumeOrCv(value) {
  return dispatch => {
    dispatch(setResumeOrCv(value))
  }
}

export const MARK_SECTION_VISITED = PREFIX + 'MARK_SECTION_VISITED'
const markSectionVisitedDone = createAction(MARK_SECTION_VISITED)

export function markSectionVisited($module) {
  return dispatch => {
    return api
      .service('ap')
      .post('aspire/section-visit', { module: $module })
      .done(response => dispatch(markSectionVisitedDone($module)))
      .fail(function(xhr) {
        sendTrackingData(
          'process',
          'aspire_actions',
          'error',
          'mark_section_visited_api_failed-' + JSON.parse(xhr.responseText)
        )
      })
  }
}
