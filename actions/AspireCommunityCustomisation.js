import { createAction } from 'redux-actions'
import api from '@vmockinc/dashboard/services/api'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const PREFIX = 'AspireCommunityCustomisation.'

export const FETCH_COMMUNITY_CUSTOMISATION_INIT =
  PREFIX + 'FETCH_COMMUNITY_CUSTOMISATION_INIT'
export const FETCH_COMMUNITY_CUSTOMISATION_DONE =
  PREFIX + 'FETCH_COMMUNITY_CUSTOMISATION_DONE'
export const FETCH_COMMUNITY_CUSTOMISATION_FAIL =
  PREFIX + 'FETCH_COMMUNITY_CUSTOMISATION_FAIL'

const fetchCommunityCustomisationInit = createAction(
  FETCH_COMMUNITY_CUSTOMISATION_INIT
)
const fetchCommunityCustomisationDone = createAction(
  FETCH_COMMUNITY_CUSTOMISATION_DONE
)
const fetchCommunityCustomisationFail = createAction(
  FETCH_COMMUNITY_CUSTOMISATION_FAIL
)

export function getCommunityCustomisation() {
  return (dispatch, getState) => {
    dispatch(fetchCommunityCustomisationInit())
    return api
      .service('ap')
      .get(`aspire/benchmark-ui-customisation`)
      .done(response => {
        dispatch(fetchCommunityCustomisationDone(response))
      })
      .fail(xhr => {
        sendTrackingData(
          'process',
          'aspire_actions',
          'error',
          'get-customisation-api-failed-' + JSON.parse(xhr.responseText)
        )
        dispatch(fetchCommunityCustomisationFail())
      })
  }
}
