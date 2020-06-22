import $ from 'jquery'
import { handleActions } from 'redux-actions'
import {
  VIDEO_PROCESSED_PERCENT,
  INTERVIEW_DURATION,
  INTERVIEW_NAME,
  INTERVIEW_QUESTION_ID,
  INTERVIEW_FAVOURITE_STATUS,
  INTERVIEW_BASIC_DATA,
} from './../actions/interviewActions'

export const interviewEP = handleActions(
  {
    [VIDEO_PROCESSED_PERCENT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.videoProcessedPercent = action.payload
      return newState
    },
    [INTERVIEW_DURATION]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.intDuration = action.payload
      return newState
    },
    [INTERVIEW_NAME]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.intName = action.payload
      return newState
    },
    [INTERVIEW_QUESTION_ID]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.intQuestionId = action.payload
      return newState
    },
    [INTERVIEW_FAVOURITE_STATUS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.isFavourite = action.payload
      return newState
    },
    [INTERVIEW_BASIC_DATA]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.basicData = action.payload
      return newState
    },
  },
  {
    videoProcessedPercent: 0,
    intDuration: null,
    intName: null,
    intQuestionId: null,
    isFavourite: null,
    basicData: null,
  }
)
