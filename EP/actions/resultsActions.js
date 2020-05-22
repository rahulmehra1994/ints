import { PREFIX } from './../actions/actions'
import { createAction } from 'redux-actions'

export const MULTIPLE_GENTLE_RESULTS = PREFIX + 'MULTIPLE_GENTLE_RESULTS'

//--------------------------------------------------------------------------------------------------------------------------------------------

export function concatenateResults(results) {
  return {
    type: 'CONCATENATE_RESULTS',
    results: results,
  }
}
//--------------------------------------------------------------------------------------------------------------------------------------------

export function gentleResults(results) {
  return {
    type: 'GENTLE_RESULTS',
    results: results,
  }
}

export function multipleGentleResultsAction(results) {
  return {
    type: 'MULTIPLE_GENTLE_RESULTS',
    results: results,
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function punctuatorResults(results) {
  return {
    type: 'PUNCTUATOR_RESULTS',
    results: results,
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export function interviewKeys(data) {
  return {
    type: 'STORE_INTERVIEW_KEYS',
    payload: data,
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export function initializeEpResults() {
  return {
    type: 'INITIALIZE_RESULTS',
    payload: null,
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export function appIntKey(key) {
  return {
    type: 'APP_INT_KEY',
    payload: key,
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
