import { createAction } from 'redux-actions'
import api from '@vmockinc/dashboard/services/api'

const PREFIX = 'AspireTour.'

export const FETCH_TOUR_INIT = PREFIX + 'FETCH_TOUR_INIT'
export const FETCH_TOUR_DONE = PREFIX + 'FETCH_TOUR_DONE'
export const UPDATE_TOUR = PREFIX + 'UPDATE_TOUR'
export const START_TOUR = PREFIX + 'START_TOUR'

const fetchTourInit = createAction(FETCH_TOUR_INIT)
const fetchTourDone = createAction(FETCH_TOUR_DONE)
const updateTour = createAction(UPDATE_TOUR)
const startTourState = createAction(START_TOUR)

export const DISABLE_TOUR_BUTTON = PREFIX + 'DISABLE_TOUR_BUTTON'
export const disableTourButton = createAction(DISABLE_TOUR_BUTTON)

export const ENABLE_TOUR_BUTTON = PREFIX + 'ENABLE_TOUR_BUTTON'
export const enableTourButton = createAction(ENABLE_TOUR_BUTTON)

export const CHANGE_TOUR_ACTIVE = PREFIX + 'CHANGE_TOUR_ACTIVE'
export const changeTourActiveStatus = createAction(CHANGE_TOUR_ACTIVE)

export function fetchTourStatus() {
  return dispatch => {
    dispatch(fetchTourInit())
    let error = new Error('Get tour status failed!')
    return api
      .service('ts')
      .get(`getTourStatus/aspire`, {})
      .done(response => dispatch(fetchTourDone(response)))
      .fail(xhr => dispatch(fetchTourDone(error)))
  }
}

export function updateTourStatus(val, tour) {
  return dispatch => {
    api.service('ts').post(`updateTourStatus/aspire`, {
      tour: tour,
    })
    dispatch(updateTour(val))
  }
}

export function startTour() {
  return dispatch => {
    dispatch(startTourState(true))
  }
}

export function tourDone() {
  return dispatch => {
    dispatch(startTourState(false))
  }
}

export function changeTourActive(val) {
  return dispatch => {
    dispatch(changeTourActiveStatus(val))
  }
}
