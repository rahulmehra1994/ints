import $ from 'jquery'
import { handleActions } from 'redux-actions'
import { actionLabels } from './../actions/ActionLabels'
var intialCalibrationState = {
  finalCalibrationId: -1,
}

export const calibration = handleActions(
  {
    [actionLabels.FINAL_CALIBRATION_ID]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.finalCalibrationId = action.payload
      return newState
    },
  },
  intialCalibrationState
)
