import { handleActions } from 'redux-actions'
import {
  FETCH_FEEDBACK_INIT,
  FETCH_FEEDBACK_DONE,
  FETCH_FEEDBACK_FAIL,
  FETCH_FEEDBACK_DATA,
  FETCHED_STATIC_DATA,
  UPDATE_FEEDBACK_STATE,
  FETCH_SAMPLES_DATA,
  SET_RESUME_OR_CV,
  MARK_SECTION_VISITED,
} from '../actions/AspireFeedback'
import $ from 'jquery'

const initialState = {
  fetching: false,
  fetched: false,
  data: null,
  has_api: 0,
  has_pdf: 0,
  has_resume: 0,

  user_id: null,
  log_id: null,
  api_id: null,
  pdf_id: null,
  resume_id: null,
  student_professional: null,
  processed_modules_count: null,
  resume_files: null,
  uploaded_picture: '',
  logs: null,
  status: null, // 'processing','done','wrong_pdf','wrong_resume','failed'
  mini_loader_text: '',
  update_detailed_state: false,
  samples: null,
  allCapsResume: 'RESUME',
  allSmallResume: 'resume',
  normalResume: 'Resume',
  visited_sections: null,
  callOnSelectSectionDependenciesInDetailedFeedback: false,
  keyForSelectSection: '',
  sectionToSuggestCopy: null,
}

export const aspireFeedbackData = handleActions(
  {
    [FETCH_FEEDBACK_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = true
      newState.status = null
      newState.fetched = false
      return newState
    },

    [FETCH_FEEDBACK_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        // Don't set fetched to false, in case two asynchronous calls to api - s.t. one succeeds one fails - output should be fetched = true
        if (
          action.hasOwnProperty('payload') &&
          action.payload.status === 'processing' &&
          action.payload.hasOwnProperty('processed_modules_count')
        ) {
          newState.processed_modules_count =
            action.payload.processed_modules_count
        } else if (
          action.payload !== false &&
          action.payload.fetched !== true
        ) {
          newState.fetched = true
          newState.status = action.payload.status
          return newState
        }
        return newState
      },

      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        // console.log(action.payload)
        return newState
      },
    },

    [FETCH_FEEDBACK_FAIL]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = false

      // Don't set fetched to false, in case two asynchronous calls to api - s.t. one succeeds one fails - output should be fetched = true
      if (
        action.hasOwnProperty('payload') &&
        action.payload.hasOwnProperty('processed_modules_count')
      ) {
        newState.processed_modules_count =
          action.payload.processed_modules_count
      }

      return newState
    },

    [FETCH_FEEDBACK_DATA]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = false
      if (
        action.payload !== false &&
        action.payload.status !== 'failed' &&
        action.payload.status !== 'not_processed' &&
        action.payload.fetched !== true
      ) {
        newState.fetched = true
        newState.status = action.payload.status
        if (
          action.payload.status !== 'wrong_pdf' &&
          action.payload.status !== 'invalid_pdf' &&
          action.payload.status !== 'wrong_resume' &&
          action.payload.status !== 'size_exceeded' &&
          action.payload.status !== 'unsupported_language'
        ) {
          newState.data = action.payload.ui
          newState.user_id = action.payload.user_id
          newState.log_id = action.payload.log_id
          newState.api_id = action.payload.api_id
          newState.pdf_id = action.payload.pdf_id
          newState.resume_id = action.payload.resume_id
          newState.has_api = action.payload.has_api
          newState.has_pdf = action.payload.has_pdf
          newState.has_resume = action.payload.has_resume
          newState.student_professional = action.payload.student_professional
          newState.processed_modules_count =
            action.payload.processed_modules_count
          newState.resume_files = action.payload.resume_files
          newState.logs = action.payload.logs
          newState.uploaded_picture = action.payload.uploaded_picture
          newState.update_detailed_state = action.payload.fetch_static
          newState.visited_sections = action.payload.visited_sections
          newState.sectionToSuggestCopy = action.payload.section_to_suggest_copy

          if (
            action.payload.hasOwnProperty('ui') &&
            action.payload.ui.hasOwnProperty('section_wise_feedback') &&
            action.payload.ui.section_wise_feedback.hasOwnProperty(
              'personal_information_feedback'
            ) &&
            action.payload.ui.section_wise_feedback.personal_information_feedback.hasOwnProperty(
              'connections_score_class'
            ) &&
            action.payload.ui.section_wise_feedback.personal_information_feedback.connections_score_class.hasOwnProperty(
              'connections'
            )
          ) {
            var connections = parseInt(
              action.payload.ui.section_wise_feedback
                .personal_information_feedback.connections_score_class
                .connections
            )
            if (connections >= 500) {
              newState.data.section_wise_feedback.personal_information_feedback.connections_score_class.connections =
                '500+'
            }
          }
        }
        return newState
      }
      return newState
    },

    [SET_RESUME_OR_CV]: (state, action) => {
      let newState = $.extend(true, {}, state)

      if (action.hasOwnProperty('payload')) {
        if (action.payload == 0) {
          newState.allCapsResume = 'RESUME'
          newState.allSmallResume = 'resume'
          newState.normalResume = 'Resume'
        } else {
          newState.allCapsResume = 'CV'
          newState.allSmallResume = 'CV'
          newState.normalResume = 'CV'
        }
      }

      return newState
    },

    [MARK_SECTION_VISITED]: (state, action) => {
      let newState = $.extend(true, {}, state)

      if (action.hasOwnProperty('payload')) {
        let module = action.payload
        newState.visited_sections[module] = 1
      }

      return newState
    },

    [FETCHED_STATIC_DATA]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.update_detailed_state = false
      return newState
    },

    [UPDATE_FEEDBACK_STATE]: (state, action) => {
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

    [FETCH_SAMPLES_DATA]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.samples = action.payload.data
        return newState
      },

      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.samples = null
        // console.log(action.payload)
        return newState
      },
    },
  },
  initialState
)
