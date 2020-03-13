import { createAction } from 'redux-actions'
import { notification } from '../services/helpers'
import api from '@vmockinc/dashboard/services/api'
import { push } from 'react-router-redux'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const PREFIX = 'Edit.'

export const PROCESS_EDITED_DATA_INIT = PREFIX + 'PROCESS_EDITED_DATA_INIT'
export const PROCESS_EDITED_DATA_DONE = PREFIX + 'PROCESS_EDITED_DATA_DONE'
export const PROCESS_EDITED_DATA_FAIL = PREFIX + 'PROCESS_EDITED_DATA_FAIL'
export const UPDATE_EDITED_DATA_STATE = PREFIX + 'UPDATE_EDITED_DATA_STATE'

export const processEditedDataInit = createAction(PROCESS_EDITED_DATA_INIT)
export const processEditedDataDone = createAction(PROCESS_EDITED_DATA_DONE)
export const processEditedDataFail = createAction(PROCESS_EDITED_DATA_FAIL)
export const updateEditedDataState = createAction(UPDATE_EDITED_DATA_STATE)

const timeOutMilliseconds = 2000

export function processEditedData(
  fetchId,
  sectionName,
  currentIndex,
  countSections,
  newSubSection,
  data,
  uid,
  prevData,
  score,
  deleteSubSection,
  emptyMessage
) {
  let dataObj = _.extend({}, data)
  if (emptyMessage !== false) {
    notification(emptyMessage, 'error', timeOutMilliseconds)
    sendTrackingData(
      'process',
      'aspire_actions',
      'notify_error',
      'empty_edit_section'
    )
    return dispatch => {}
  }

  if (deleteSubSection !== true) {
    let flag = false

    for (let entity in dataObj) {
      if (_.isString(dataObj[entity]) && !_.isEmpty(dataObj[entity].trim())) {
        flag = true
        break
      }
    }

    if (JSON.stringify(dataObj) === JSON.stringify(prevData)) flag = false

    if (flag === false) {
      notification(
        sectionName + ' section has not been edited.',
        'error',
        timeOutMilliseconds
      )
      sendTrackingData(
        'process',
        'aspire_actions',
        'notify_error',
        'section_not_edited'
      )
      return dispatch => {}
    }
  }

  if (sectionName !== 'Profile Picture') {
    for (let entity in dataObj) {
      dataObj[entity] = dataObj[entity]
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }
  }

  let editInfo = {
    section_name: sectionName,
    sub_section_id: currentIndex,
    new_sub_section: newSubSection,
    delete_sub_section: deleteSubSection,
  }

  return (dispatch, getState) => {
    dispatch(processEditedDataInit(editInfo))

    return api
      .service('ap')
      .post(`aspire/edit-section`, {
        fetch_id: fetchId,
        section_name: sectionName,
        sub_section_id: currentIndex,
        count_sections: countSections,
        new_sub_section: newSubSection,
        data: JSON.stringify(dataObj),
        sub_section_uid: uid,
        prev_data: JSON.stringify(prevData),
        score: score,
        delete_sub_section: deleteSubSection,
      })
      .done(response => {
        notification('Processing started.', 'information', timeOutMilliseconds)
        let jsonObjectForTracking = {
          eventLabel: 'processing_started',
          sectionName: sectionName,
          subSectionId: currentIndex,
          newSubSection: newSubSection,
          deleteSubSection: deleteSubSection,
        }
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_success',
          JSON.stringify(jsonObjectForTracking)
        )
        dispatch(processEditedDataDone(response))
      })
      .fail(xhr => {
        notification('Failed to process section.', 'error', timeOutMilliseconds)
        let jsonObjectForTracking = {
          eventLabel: 'failed_to_process_section',
          sectionName: sectionName,
          subSectionId: currentIndex,
          newSubSection: newSubSection,
          deleteSubSection: deleteSubSection,
        }
        sendTrackingData(
          'process',
          'aspire_actions',
          'notify_error',
          JSON.stringify(jsonObjectForTracking)
        )
        dispatch(processEditedDataFail())
      })
  }
}
