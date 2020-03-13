import { handleActions } from 'redux-actions'
import {
  LATEST_FETCH_ID_INIT,
  LATEST_FETCH_ID_DONE,
  LATEST_FETCH_ID_ERROR,
  PROCESS_DATA_INIT,
  PROCESS_DATA_DONE,
  PROCESS_DATA_FAIL,
  UPDATE_API_DATA,
  UPLOAD_PDF_INIT,
  UPLOAD_PDF_DONE,
  UPDATE_PDF_DATA,
  UPDATE_PDF_STATE,
  UPLOAD_RESUME_INIT,
  UPLOAD_RESUME_DONE,
  UPDATE_RESUME_DATA,
  UPDATE_RESUME_STATE,
  TARGET_FUNCTION_INIT,
  TARGET_FUNCTION_DONE,
  TARGET_FUNCTION_FAIL,
  UPDATE_FUNCTION_STATE,
  FETCH_FUNCTION_MAPPINGS_INIT,
  FETCH_FUNCTION_MAPPINGS_DONE,
  FETCH_FUNCTION_MAPPINGS_ERROR,
} from '../actions/Login'
import $ from 'jquery'

const initialState = {
  id: null,
  log_id: 0,
  user_id: -1,
  api_id: null,
  pdf_id: null,
  resume_id: null,
  job_function_id: null,
  status: null, // 'processing'
  message: null,

  api_data: null,
  uploading_data: false,
  uploaded_data: false,

  pdf_data: null,
  uploading_pdf: false,
  uploaded_pdf: false,
  showPdfModal: false,

  resume_data: null,
  uploading_resume: false,
  uploaded_resume: false,

  changing_function: false,
  changed_function: false,
}

export const loginData = handleActions(
  {
    [PROCESS_DATA_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.uploading_data = true
      newState.uploaded_data = false
      return newState
    },

    [PROCESS_DATA_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_data = false
        if (action.payload !== false) {
          newState.id = action.payload.id
          newState.api_id = action.payload.api_id
          newState.pdf_id = action.payload.pdf_id
          newState.resume_id = action.payload.resume_id
          newState.job_function_id = action.payload.job_function_id
          newState.status = action.payload.status
          newState.message = action.payload.message
          newState.uploaded_data = true
        }
        return newState
      },
      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_data = false
        return newState
      },
    },

    [PROCESS_DATA_FAIL]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.uploading_data = false
      return newState
    },

    [UPDATE_API_DATA]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.api_data = action.payload.api_data
      return newState
    },
  },
  initialState
)

export const uploadPdf = handleActions(
  {
    [UPLOAD_PDF_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.uploading_pdf = true
      newState.uploaded_pdf = false
      return newState
    },

    [UPLOAD_PDF_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_pdf = false
        if (action.payload !== false) {
          newState.id = action.payload.id
          newState.api_id = action.payload.api_id
          newState.pdf_id = action.payload.pdf_id
          newState.resume_id = action.payload.resume_id
          newState.job_function_id = action.payload.job_function_id
          newState.status = action.payload.status
          newState.message = action.payload.message
          newState.uploaded_pdf = true
        }
        return newState
      },
      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_pdf = false
        console.error(action.payload)
        return newState
      },
    },

    [UPDATE_PDF_DATA]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.pdf_data = action.payload.pdf_data
      return newState
    },

    [UPDATE_PDF_STATE]: (state, action) => {
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

export const uploadResume = handleActions(
  {
    [UPLOAD_RESUME_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.uploading_resume = true
      newState.uploaded_resume = false
      return newState
    },

    [UPLOAD_RESUME_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_resume = false
        if (action.payload !== false) {
          newState.id = action.payload.id
          newState.api_id = action.payload.api_id
          newState.pdf_id = action.payload.pdf_id
          newState.resume_id = action.payload.resume_id
          newState.resume_files = action.payload.resume_files
          newState.job_function_id = action.payload.job_function_id
          newState.status = action.payload.status
          newState.message = action.payload.message
          newState.uploaded_resume = true
        }
        return newState
      },
      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_resume = false
        console.error(action.payload)
        return newState
      },
    },

    [UPDATE_RESUME_DATA]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.resume_data = action.payload.resume_data
      return newState
    },

    [UPDATE_RESUME_STATE]: (state, action) => {
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

export const changeFunction = handleActions(
  {
    [TARGET_FUNCTION_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.changing_function = true
      newState.changed_function = false
      return newState
    },

    [TARGET_FUNCTION_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.changing_function = false
        if (action.payload !== false) {
          newState.id = action.payload.id
          newState.api_id = action.payload.api_id
          newState.pdf_id = action.payload.pdf_id
          newState.resume_id = action.payload.resume_id
          newState.job_function_id = action.payload.job_function_id
          newState.status = action.payload.status
          newState.message = action.payload.message
          newState.changed_function = true
        }
        return newState
      },
      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.changing_function = false
        return newState
      },
    },

    [TARGET_FUNCTION_FAIL]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.changing_function = false
      // console.log('Edited data failed to process')
      return newState
    },

    [UPDATE_FUNCTION_STATE]: (state, action) => {
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

const aspireFunctionMappingsState = {
  fetching: false,
  fetched: false,
  function_mappings: {},
}

export const aspireFunctionMappings = handleActions(
  {
    [FETCH_FUNCTION_MAPPINGS_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = true
      newState.fetched = false
      return newState
    },

    [FETCH_FUNCTION_MAPPINGS_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        newState.fetched = true
        newState.function_mappings = action.payload.function_mappings
        return newState
      },

      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        return newState
      },
    },

    [FETCH_FUNCTION_MAPPINGS_ERROR]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = false
      return newState
    },
  },
  aspireFunctionMappingsState
)

const latestFetchIdState = {
  fetch_id: -1,
  fetching: false,
  fetched: false,
}

export const aspireLatestFetchId = handleActions(
  {
    [LATEST_FETCH_ID_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = true
      newState.fetched = false
      return newState
    },

    [LATEST_FETCH_ID_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        newState.fetched = true
        newState.fetch_id = action.payload.fetch_id
        return newState
      },
      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        newState.fetch_id = -1
        return newState
      },
    },

    [LATEST_FETCH_ID_ERROR]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = false
      newState.fetch_id = -1
      return newState
    },
  },
  latestFetchIdState
)
