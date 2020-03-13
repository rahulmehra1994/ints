import { handleActions } from 'redux-actions'
import {
  UPLOAD_IMAGE_INIT,
  UPLOAD_IMAGE_DONE,
  UPDATE_IMAGE_DATA,
  REFRESH_IMAGE_DONE,
  SAVE_CURRENT_IMAGE_INIT,
  SAVE_CURRENT_IMAGE_DONE,
  SAVE_CURRENT_IMAGE_FAIL,
} from '../actions/ImageUpload'
import { FETCH_FEEDBACK_DATA } from '../actions/AspireFeedback'
import $ from 'jquery'

const initialState = {
  uploading_image: false,
  uploaded_image: false,
  edit_picture_mounted: false,
  update_store: false,
  refresh_url: false,
  url: null,
  string: '',
  face_frame_ratio: null,
  background: null,
  foreground: null,
  resolution: null,
  symmetry: null,
  face_body_ratio: null,
  professional_clothes: null,
  pupil: null,
  smile: null,
  dataUri: null,
  original_image_string: null,
  saving_image: false,
  saved_image: false,
}

export const imageData = handleActions(
  {
    [UPLOAD_IMAGE_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.uploading_image = true
      newState.uploaded_image = false
      return newState
    },

    [UPLOAD_IMAGE_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_image = false
        if (action.payload !== false) {
          newState.url = action.payload.url
          newState.string = action.payload.profile_picture_string
          newState.face_frame_ratio = action.payload.face_frame_ratio_feedback
          newState.background = action.payload.background_illumination_feedback
          newState.foreground = action.payload.foreground_illumination_feedback
          newState.resolution = action.payload.image_resolution_feedback
          newState.symmetry = action.payload.shoulder_symmetry_feedback
          newState.face_body_ratio = action.payload.face_body_ratio_feedback
          newState.professional_clothes =
            action.payload.professional_clothes_feedback
          newState.pupil = action.payload.pupil_feedback
          newState.smile = action.payload.smile_feedback
          newState.uploaded_image = true
          newState.update_store = true
          // newState.dataUri = action.payload.src
        }
        return newState
      },
      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_image = false
        console.error(action.payload)
        return newState
      },
    },

    [UPDATE_IMAGE_DATA]: (state, action) => {
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

    [REFRESH_IMAGE_DONE]: (state, action) => {
      let newState = $.extend(true, {}, state)
      if (action.payload !== false) {
        newState.url = action.payload.url
        newState.refresh_url = true
      }
      return newState
    },

    [SAVE_CURRENT_IMAGE_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.saving_image = true
      newState.saved_image = false
      return newState
    },
    [SAVE_CURRENT_IMAGE_DONE]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.original_image_string = action.payload.string
      newState.saving_image = false
      newState.saved_image = true
      return newState
    },
    [SAVE_CURRENT_IMAGE_FAIL]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.original_image_string = state.string
      newState.saved_image = false
      newState.saving_image = false
      return newState
    },
    [FETCH_FEEDBACK_DATA]: (state, action) => {
      let newState = $.extend(true, {}, state)
      if (
        action.payload !== false &&
        action.payload.status !== 'failed' &&
        action.payload.status !== 'not_processed' &&
        action.payload.fetched !== true &&
        action.payload.status !== 'wrong_pdf' &&
        action.payload.status !== 'invalid_pdf' &&
        action.payload.status !== 'wrong_resume' &&
        action.payload.status !== 'size_exceeded' &&
        action.payload.status !== 'unsupported_language'
      ) {
        newState.original_image_string =
          action.payload.uploaded_picture.original_image_string
        newState.dataUri =
          action.payload.uploaded_picture.original_image_data_uri
      }
      return newState
    },
  },
  initialState
)
