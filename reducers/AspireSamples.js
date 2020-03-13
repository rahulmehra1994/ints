import { handleActions } from 'redux-actions'
import {
  FETCH_NEW_SAMPLES_INIT,
  FETCH_NEW_SAMPLES_DONE,
  FETCH_NEW_SAMPLES_FAIL,
  UPDATE_NEW_SAMPLES_STATE,
} from '../actions/AspireSamples'
import $ from 'jquery'

const initialState = {
  fetching: false,
  fetched: false,
  samples: null,
  error: null,
}

export const aspireSamplesData = handleActions(
  {
    [FETCH_NEW_SAMPLES_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = true
      newState.fetched = false
      newState.error = null
      newState.samples = null
      return newState
    },

    [FETCH_NEW_SAMPLES_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        newState.fetched = true
        newState.error = false
        newState.samples = action.payload
        return newState
      },

      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        newState.fetched = true
        newState.error = true
        newState.samples = null
        // console.log(action.payload)
        return newState
      },
    },

    [FETCH_NEW_SAMPLES_FAIL]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = false
      newState.fetched = true
      newState.error = true
      newState.samples = null
      return newState
    },

    [UPDATE_NEW_SAMPLES_STATE]: (state, action) => {
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
