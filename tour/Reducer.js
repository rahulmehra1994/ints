import { handleActions } from 'redux-actions'
import {
  FETCH_TOUR_INIT,
  FETCH_TOUR_DONE,
  UPDATE_TOUR,
  START_TOUR,
  DISABLE_TOUR_BUTTON,
  ENABLE_TOUR_BUTTON,
  CHANGE_TOUR_ACTIVE,
} from './Action.js'
import $ from 'jquery'

const initialState = {
  startTour: false,
  tourStatus: null,
  showTourButton: true,
  tourActive: false,
}

export const tour = handleActions(
  {
    [FETCH_TOUR_INIT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      return newState
    },

    [FETCH_TOUR_DONE]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.tourStatus = action.payload
        return newState
      },
      throw(state, action) {
        let newState = $.extend(true, {}, state)
        return newState
      },
    },

    [UPDATE_TOUR]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.tourStatus = action.payload
        return newState
      },
    },

    [START_TOUR]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.startTour = action.payload
        return newState
      },
    },

    [ENABLE_TOUR_BUTTON]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.showTourButton = true
      return newState
    },

    [DISABLE_TOUR_BUTTON]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.showTourButton = false
      return newState
    },

    [CHANGE_TOUR_ACTIVE]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.tourActive = action.payload
      return newState
    },
  },
  initialState
)
