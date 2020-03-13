import $ from 'jquery'
import { handleActions } from 'redux-actions'
import { FINAL_CALIBRATION_ID } from './../actions/actions'

var intialCalibrationState = {
  finalCalibrationId: -1,
}

export const calibration = handleActions(
  {
    [FINAL_CALIBRATION_ID]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.finalCalibrationId = action.payload
      return newState
    },
  },
  intialCalibrationState
)
