import { handleActions } from 'redux-actions'
import {
  CHECK_FOR_RENDERING,
  HIDE_MODAL,
  SET_BUBBLE_COUNT,
  SET_FEEDBACK_COUNT,
  CREATE_CUSTOMER_FEEDBACK,
  SHOW_MODAL,
} from '../actions/CustomerFeedback'
import $ from 'jquery'

const initialState = {
  isOpen: false,
  rating: 0,
}

export const customerFeedback = handleActions(
  {
    [CHECK_FOR_RENDERING]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        if (!state.isOpen) {
          newState.isOpen = action.payload.feedback
        } else {
        }
        return newState
      },
      throw(state, action) {},
    },
    [HIDE_MODAL]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.isOpen = action.payload
        return newState
      },
    },
    [SHOW_MODAL]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState.isOpen = action.payload
        return newState
      },
    },
    [SET_BUBBLE_COUNT]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        newState[action.payload.key] = parseInt(action.payload.count)
        return newState
      },
    },
    [CREATE_CUSTOMER_FEEDBACK]: {
      next(state, action) {
        let newState = $.extend(true, {}, state)
        return newState
      },
    },
  },
  initialState
)

// import { FETCH_NF_SCORE_DONE } from './../actions/feedbackAction'
// export const nfScore = handleActions({
//   [FETCH_NF_SCORE_DONE]: (state, action) => {
//     let newState = $.extend(true, {}, state)
//     newState.nfScore = action.payload.scores.total
//     return newState
//   }
//   }, {
//   nfScore: null
// })
