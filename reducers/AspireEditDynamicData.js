import { handleActions } from 'redux-actions'
import {
  FETCH_EDIT_DYNAMIC_DATA_INIT,
  FETCH_EDIT_DYNAMIC_DATA_DONE,
  FETCH_EDIT_DYNAMIC_DATA_FAIL,
  UPDATE_EDIT_DYNAMIC_DATA_STATE,
} from '../actions/AspireEditDynamicData'
import $ from 'jquery'

const initialState = {
  fetchingSkills: false,
  fetchedSkills: false,
  dataSkills: null,
  errorSkills: null,
  sectionWiseTextIntermediateSkills: null,

  fetchingContent: false,
  fetchedContent: false,
  dataContent: null,
  errorContent: null,
  sectionWiseTextIntermediateContent: null,

  fetchingLanguage: false,
  fetchedLanguage: false,
  dataLanguage: null,
  errorLanguage: null,
  sectionWiseTextIntermediateLanguage: null,

  fetchingImpact: false,
  fetchedImpact: false,
  dataImpact: null,
  errorImpact: null,
  sectionWiseTextIntermediateImpact: null,

  fetchingRephraseWords: false,
  fetchedRephraseWords: false,
  dataRephraseWords: null,
  errorRephraseWords: null,
  sectionWiseTextIntermediateRephraseWords: null,
}

export const aspireEditDynamicData = handleActions(
  {
    [FETCH_EDIT_DYNAMIC_DATA_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      if (action.payload == 'skills') {
        newState.fetchingSkills = true
        newState.fetchedSkills = false
        newState.errorSkills = null
      } else if (action.payload == 'content') {
        newState.fetchingContent = true
        newState.fetchedContent = false
        newState.errorContent = null
      } else if (action.payload == 'language') {
        newState.fetchingLanguage = true
        newState.fetchedLanguage = false
        newState.errorLanguage = null
      } else if (action.payload == 'impact') {
        newState.fetchingImpact = true
        newState.fetchedImpact = false
        newState.errorImpact = null
      } else if (action.payload == 'rephrase_words') {
        newState.fetchingRephraseWords = true
        newState.fetchedRephraseWords = false
        newState.errorRephraseWords = null
      }
      return newState
    },

    [FETCH_EDIT_DYNAMIC_DATA_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        if (action.payload.hasOwnProperty('skills')) {
          newState.fetchingSkills = false
          newState.fetchedSkills = true
          newState.errorSkills = false
          newState.dataSkills = action.payload['skills']
        } else if (action.payload.hasOwnProperty('content')) {
          newState.fetchingContent = false
          newState.fetchedContent = true
          newState.errorContent = false
          newState.dataContent = action.payload['content']
        } else if (action.payload.hasOwnProperty('language')) {
          newState.fetchingLanguage = false
          newState.fetchedLanguage = true
          newState.errorLanguage = false
          newState.dataLanguage = action.payload['language']
        } else if (action.payload.hasOwnProperty('impact')) {
          newState.fetchingImpact = false
          newState.fetchedImpact = true
          newState.errorImpact = false
          newState.dataImpact = action.payload['impact']
        } else if (action.payload.hasOwnProperty('rephrase_words')) {
          newState.fetchingRephraseWords = false
          newState.fetchedRephraseWords = true
          newState.errorRephraseWords = false
          newState.dataRephraseWords = action.payload['rephrase_words']
        }
        return newState
      },

      throw(state, action) {
        let newState = $.extend(true, {}, state)
        if (action.payload.hasOwnProperty('skills')) {
          newState.fetchingSkills = false
          newState.fetchedSkills = true
          newState.errorSkills = true
          newState.sectionWiseTextIntermediateSkills = null
        } else if (action.payload.hasOwnProperty('content')) {
          newState.fetchingContent = false
          newState.fetchedContent = true
          newState.errorContent = true
          newState.sectionWiseTextIntermediateContent = null
        } else if (action.payload.hasOwnProperty('language')) {
          newState.fetchingLanguage = false
          newState.fetchedLanguage = true
          newState.errorLanguage = true
          newState.sectionWiseTextIntermediateLanguage = null
        } else if (action.payload.hasOwnProperty('impact')) {
          newState.fetchingImpact = false
          newState.fetchedImpact = true
          newState.errorImpact = true
          newState.sectionWiseTextIntermediateImpact = null
        } else if (action.payload.hasOwnProperty('rephrase_words')) {
          newState.fetchingRephraseWords = false
          newState.fetchedRephraseWords = true
          newState.errorRephraseWords = true
          newState.sectionWiseTextIntermediateRephraseWords = null
        }
        return newState
      },
    },

    [FETCH_EDIT_DYNAMIC_DATA_FAIL]: (state, action) => {
      let newState = $.extend(true, {}, state)
      if (action.payload == 'skills') {
        newState.fetchingSkills = false
        newState.fetchedSkills = true
        newState.errorSkills = true
        newState.sectionWiseTextIntermediateSkills = null
      } else if (action.payload == 'content') {
        newState.fetchingContent = false
        newState.fetchedContent = true
        newState.errorContent = true
        newState.sectionWiseTextIntermediateContent = null
      } else if (action.payload == 'language') {
        newState.fetchingLanguage = false
        newState.fetchedLanguage = true
        newState.errorLanguage = true
        newState.sectionWiseTextIntermediateLanguage = null
      } else if (action.payload == 'impact') {
        newState.fetchingImpact = false
        newState.fetchedImpact = true
        newState.errorImpact = true
        newState.sectionWiseTextIntermediateImpact = null
      } else if (action.payload == 'rephrase_words') {
        newState.fetchingRephraseWords = false
        newState.fetchedRephraseWords = true
        newState.errorRephraseWords = true
        newState.sectionWiseTextIntermediateRephraseWords = null
      }
      return newState
    },

    [UPDATE_EDIT_DYNAMIC_DATA_STATE]: (state, action) => {
      let newState = $.extend(true, {}, state)
      let updateKeys = action.payload.updateKeys
      let data = action.payload.data
      for (let i in updateKeys) {
        if (updateKeys[i].length == 1) {
          newState[updateKeys[i][0]] = data[updateKeys[i][0]]
        } else if (updateKeys[i].length == 2) {
          newState[updateKeys[i][0]][updateKeys[i][1]] =
            data[updateKeys[i][0]][updateKeys[i][1]]
        } else if (updateKeys[i].length == 3) {
          newState[updateKeys[i][0]][updateKeys[i][1]][updateKeys[i][2]] =
            data[updateKeys[i][0]][updateKeys[i][1]][updateKeys[i][2]]
        }
      }
      return newState
    },
  },
  initialState
)
