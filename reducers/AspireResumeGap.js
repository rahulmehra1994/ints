import { handleActions } from 'redux-actions'
import {
  FETCH_RESUME_GAP_INIT,
  FETCH_RESUME_GAP_DONE,
  FETCH_RESUME_GAP_FAIL,
  UPDATE_RESUME_GAP_STATE,
} from '../actions/AspireResumeGap'
import $ from 'jquery'

const initialState = {
  fetching: false,
  fetched: false,
  data: null,
  error: null,
}

export const aspireResumeGapData = handleActions(
  {
    [FETCH_RESUME_GAP_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = true
      newState.fetched = false
      newState.error = null
      newState.data = null
      return newState
    },

    [FETCH_RESUME_GAP_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        newState.fetched = true
        newState.error = false
        newState.data = action.payload
        return newState
      },

      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        newState.fetched = false
        newState.error = true
        newState.data = null
        // console.log(action.payload)
        return newState
      },
    },

    [FETCH_RESUME_GAP_FAIL]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = false
      newState.fetched = false
      newState.error = true
      newState.data = null
      return newState
    },

    [UPDATE_RESUME_GAP_STATE]: (state, action) => {
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
