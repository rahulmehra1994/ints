import { createAction } from 'redux-actions'
import api from '@vmockinc/dashboard/services/api'
import { notification } from '../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const PREFIX = 'ASPIRE_SAMPLES.'

export const FETCH_NEW_SAMPLES_INIT = PREFIX + 'FETCH_NEW_SAMPLES_INIT'
export const FETCH_NEW_SAMPLES_DONE = PREFIX + 'FETCH_NEW_SAMPLES_DONE'
export const FETCH_NEW_SAMPLES_FAIL = PREFIX + 'FETCH_NEW_SAMPLES_FAIL'
export const UPDATE_NEW_SAMPLES_STATE = PREFIX + 'UPDATE_NEW_SAMPLES_STATE'

const fetchNewSamplesInit = createAction(FETCH_NEW_SAMPLES_INIT)
const fetchNewSamplesDone = createAction(FETCH_NEW_SAMPLES_DONE)
const fetchNewSamplesFail = createAction(FETCH_NEW_SAMPLES_FAIL)
export const updateNewSamplesState = createAction(UPDATE_NEW_SAMPLES_STATE)

const timeOutMilliseconds = 2000

export function fetchNewSamples(fetchId, sectionName, currentIndex) {
  return (dispatch, getState) => {
    dispatch(fetchNewSamplesInit())
    return api
      .service('ap')
      .post(`aspire/new-samples`, {
        id: fetchId,
        section: sectionName,
        sub_section_id: currentIndex,
      })
      .done(response => {
        let isEditOpen = getState().detailedFeedbackUi.isEditOpen
        if (isEditOpen) {
          let currentEditSection = getState().detailedFeedbackUi
            .currentEditSection
          let currentEditSectionIndex = getState().detailedFeedbackUi
            .currentEditSectionIndex
          if (currentEditSection == sectionName) {
            if (
              currentEditSectionIndex == currentIndex ||
              (typeof currentEditSectionIndex == 'string' &&
                currentEditSectionIndex.indexOf('_new') >= 0 &&
                currentIndex == -1)
            ) {
              dispatch(fetchNewSamplesDone(response))
            }
          }
        }
      })
      .fail(xhr => {
        let error = 'new_samples_api_failed'
        let contentType = xhr.getResponseHeader('Content-Type')
        if (contentType && contentType.indexOf('application/json') !== -1) {
          error = error + '-' + xhr.responseJSON
        }
        sendTrackingData('process', 'aspire_actions', 'error', error)
        dispatch(fetchNewSamplesFail())
      })
  }
}
