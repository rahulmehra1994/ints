import { handleActions } from 'redux-actions'
import {
  PROCESS_EDITED_DATA_INIT,
  PROCESS_EDITED_DATA_DONE,
  PROCESS_EDITED_DATA_FAIL,
  UPDATE_EDITED_DATA_STATE,
} from '../actions/Edit'
import $ from 'jquery'

const initialState = {
  id: null,
  log_id: 0,
  uploaded_at: null,

  section_name: '',
  sub_section_id: null,
  new_sub_section: false,
  delete_sub_section: false,

  uploading_edited_data: false,
  uploaded_edited_data: false,
}

export const editData = handleActions(
  {
    [PROCESS_EDITED_DATA_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.uploading_edited_data = true
      newState.uploaded_edited_data = false
      if (action.payload !== false) {
        newState.section_name = action.payload.section_name
        newState.sub_section_id = action.payload.sub_section_id
        newState.new_sub_section = action.payload.new_sub_section
        newState.delete_sub_section = action.payload.delete_sub_section
      } else {
        newState.section_name = ''
        newState.sub_section_id = null
        newState.new_sub_section = false
        newState.delete_sub_section = false
      }
      return newState
    },

    [PROCESS_EDITED_DATA_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_edited_data = false
        if (action.payload !== false) {
          newState.id = action.payload.id
          newState.log_id = action.payload.log_id
          newState.uploaded_at = action.payload.uploaded_at
          newState.uploaded_edited_data = true
        }
        return newState
      },
      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.uploading_edited_data = false
        return newState
      },
    },

    [PROCESS_EDITED_DATA_FAIL]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.uploading_edited_data = false
      return newState
    },

    [UPDATE_EDITED_DATA_STATE]: (state, action) => {
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
