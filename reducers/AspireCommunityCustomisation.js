import { handleActions } from 'redux-actions'
import {
  FETCH_COMMUNITY_CUSTOMISATION_INIT,
  FETCH_COMMUNITY_CUSTOMISATION_DONE,
  FETCH_COMMUNITY_CUSTOMISATION_FAIL,
} from '../actions/AspireCommunityCustomisation'
import $ from 'jquery'

const initialState = {
  fetching: false,
  fetched: false,
  customisations: null,
  error: null,
}

export const AspireCommunityCustomisation = handleActions(
  {
    [FETCH_COMMUNITY_CUSTOMISATION_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = true
      newState.fetched = false
      newState.error = null
      newState.customisations = null
      return newState
    },

    [FETCH_COMMUNITY_CUSTOMISATION_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        newState.fetched = true
        newState.error = false
        newState.customisations = action.payload.customisations
        return newState
      },

      throw(state, action) {
        let newState = $.extend(true, {}, state)
        newState.fetching = false
        newState.fetched = true
        newState.error = true
        newState.customisations = null
        return newState
      },
    },

    [FETCH_COMMUNITY_CUSTOMISATION_FAIL]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.fetching = false
      newState.fetched = true
      newState.error = true
      newState.customisations = null
      return newState
    },
  },
  initialState
)
