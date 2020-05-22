import $ from 'jquery'
import { handleActions } from 'redux-actions'
import { actionLabels } from './../actions/ActionLabels'

export const interviewEP = handleActions(
  {
    [actionLabels.VIDEO_PROCESSED_PERCENT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.videoProcessedPercent = action.payload
      return newState
    },
    [actionLabels.INTERVIEW_DURATION]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.intDuration = action.payload
      return newState
    },
    [actionLabels.INTERVIEW_NAME]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.intName = action.payload
      return newState
    },
    [actionLabels.INTERVIEW_QUESTION_ID]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.intQuestionId = action.payload
      return newState
    },
    [actionLabels.INTERVIEW_FAVOURITE_STATUS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.isFavourite = action.payload
      return newState
    },
  },
  {
    videoProcessedPercent: 0,
    intDuration: null,
    intName: null,
    intQuestionId: null,
    isFavourite: null,
  }
)
