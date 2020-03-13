import { createAction } from 'redux-actions'
import api from '@vmockinc/dashboard/services/api'
import _ from 'underscore'
import { notification } from '../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const PREFIX = 'CustomerFeedback.'

export const CHECK_FOR_RENDERING = PREFIX + 'CHECK_FOR_RENDERING'
const checkForRenderingDone = createAction(CHECK_FOR_RENDERING)

export const SHOW_MODAL = PREFIX + 'SHOW_FEEDBACK_MODAL'
const showModalDone = createAction(SHOW_MODAL)

export function showFeedbackModal() {
  return dispatch => {
    dispatch(showModalDone(true))
  }
}

export function checkForRendering() {
  return dispatch => {
    return api
      .service('ap')
      .get('aspire/feedback')
      .done(response => dispatch(checkForRenderingDone(response)))
      .fail(xhr => dispatch(checkForRenderingFail(api.error(xhr))))
  }
}
export const CREATE_CUSTOMER_FEEDBACK = PREFIX + 'CREATE_CUSTOMER_FEEDBACK'
const createCustomerFeedbackDone = createAction(CREATE_CUSTOMER_FEEDBACK)

export function createCustomerFeedback(data) {
  return dispatch => {
    return api
      .service('ap')
      .post('aspire/feedback', data)
      .done(response => {
        notification(
          'Thanks. Your feedback has been sent successfully.',
          'information'
        )
        dispatch(createCustomerFeedbackDone(response))
      })
      .fail(function(xhr) {
        if (xhr.status === 400) {
          sendTrackingData(
            'process',
            'aspire_actions',
            'notify_error',
            'already_sent_feedback'
          )
          notification('You have already sent feedback.', 'error')
        } else if (
          xhr.status === 403 &&
          xhr.getResponseHeader('content-type') === 'text/html'
        ) {
          sendTrackingData(
            'process',
            'aspire_actions',
            'notify_error',
            'customer_feedback_api_failed-' + JSON.parse(xhr.responseText)
          )
          notification(
            'Error occured. Please check you content and try it again.',
            'error'
          )
        } else {
          sendTrackingData(
            'process',
            'aspire_actions',
            'notify_error',
            'customer_feedback_api_failed-' + JSON.parse(xhr.responseText)
          )
        }
      })
  }
}

export const HIDE_MODAL = PREFIX + 'HIDE_MODAL'
const hideModalDone = createAction(HIDE_MODAL)

export function hideFeedbackModal() {
  return dispatch => {
    dispatch(hideModalDone(false))
  }
}

export const SET_BUBBLE_COUNT = PREFIX + 'SET_BUBBLE_COUNT'
const setBubbleCountDone = createAction(SET_BUBBLE_COUNT)

export function setBubbleCount(count, key) {
  return dispatch => {
    let response = {
      count: count,
      key: key,
    }
    dispatch(setBubbleCountDone(response))
  }
}
