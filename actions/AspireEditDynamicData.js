import { createAction } from 'redux-actions'
import api from '@vmockinc/dashboard/services/api'
import { notification } from '../services/helpers'

const PREFIX = 'ASPIRE_EDIT_DYNAMIC_DATA.'

export const FETCH_EDIT_DYNAMIC_DATA_INIT =
  PREFIX + 'FETCH_EDIT_DYNAMIC_DATA_INIT'
export const FETCH_EDIT_DYNAMIC_DATA_DONE =
  PREFIX + 'FETCH_EDIT_DYNAMIC_DATA_DONE'
export const FETCH_EDIT_DYNAMIC_DATA_FAIL =
  PREFIX + 'FETCH_EDIT_DYNAMIC_DATA_FAIL'
export const UPDATE_EDIT_DYNAMIC_DATA_STATE =
  PREFIX + 'UPDATE_EDIT_DYNAMIC_DATA_STATE'

const fetchEditDynamicDataInit = createAction(FETCH_EDIT_DYNAMIC_DATA_INIT)
const fetchEditDynamicDataDone = createAction(FETCH_EDIT_DYNAMIC_DATA_DONE)
const fetchEditDynamicDataFail = createAction(FETCH_EDIT_DYNAMIC_DATA_FAIL)
export const updateEditDynamicDataState = createAction(
  UPDATE_EDIT_DYNAMIC_DATA_STATE
)

const timeOutMilliseconds = 2000

export function fetchEditDynamicData(
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
  module,
  sectionWiseTextEditable
) {
  return (dispatch, getState) => {
    dispatch(fetchEditDynamicDataInit(module))
    return api
      .service('ap')
      .post(`aspire/edit-section-dynamic`, {
        fetch_id: fetchId,
        section_name: sectionName,
        sub_section_id: currentIndex,
        count_sections: countSections,
        new_sub_section: newSubSection,
        data: JSON.stringify(data),
        sub_section_uid: uid,
        prev_data: JSON.stringify(prevData),
        score: score,
        delete_sub_section: deleteSubSection,
        module: module,
      })
      .done(response => {
        // let jsonObjectForTracking = {
        //   'eventLabel' : 'processing_started',
        //   'sectionName' : sectionName,
        //   'subSectionId' : currentIndex,
        //   'newSubSection': newSubSection,
        //   'deleteSubSection': deleteSubSection,
        // }
        // sendTrackingData('process','aspire_actions','notify_success',JSON.stringify(jsonObjectForTracking))
        let currentSection = getState().detailedFeedbackUi.section
        if (currentSection == sectionName) {
          dispatch(fetchEditDynamicDataDone(response[sectionName]))
          if (module == 'content') {
            dispatch(
              updateEditDynamicDataState({
                updateKeys: [['sectionWiseTextIntermediateContent']],
                data: {
                  sectionWiseTextIntermediateContent: sectionWiseTextEditable,
                },
              })
            )
          } else if (module == 'skills') {
            dispatch(
              updateEditDynamicDataState({
                updateKeys: [['sectionWiseTextIntermediateSkills']],
                data: {
                  sectionWiseTextIntermediateSkills: sectionWiseTextEditable,
                },
              })
            )
          } else if (module == 'language') {
            dispatch(
              updateEditDynamicDataState({
                updateKeys: [['sectionWiseTextIntermediateLanguage']],
                data: {
                  sectionWiseTextIntermediateLanguage: sectionWiseTextEditable,
                },
              })
            )
          } else if (module == 'impact') {
            dispatch(
              updateEditDynamicDataState({
                updateKeys: [['sectionWiseTextIntermediateImpact']],
                data: {
                  sectionWiseTextIntermediateImpact: sectionWiseTextEditable,
                },
              })
            )
          } else if (module == 'rephrase_words') {
            dispatch(
              updateEditDynamicDataState({
                updateKeys: [['sectionWiseTextIntermediateRephraseWords']],
                data: {
                  sectionWiseTextIntermediateRephraseWords: sectionWiseTextEditable,
                },
              })
            )
          }
        }
      })
      .fail(xhr => {
        // let jsonObjectForTracking = {
        //   'eventLabel' : 'failed_to_process_section',
        //   'sectionName' : sectionName,
        //   'subSectionId' : currentIndex,
        //   'newSubSection': newSubSection,
        //   'deleteSubSection': deleteSubSection,
        // }
        // sendTrackingData('process','aspire_actions','notify_error',JSON.stringify(jsonObjectForTracking))
        dispatch(fetchEditDynamicDataFail(module))
      })
  }
}
