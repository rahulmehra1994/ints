// import api from './../modules/services/api'
import api from '@vmockinc/dashboard/services/api'
import store from './../../store/configureStore'
import _ from 'underscore'
import {
  eyeResults,
  faceResults,
  handResults,
  bodyResults,
  appearanceResults,
  wordResults,
  sentenceResults,
  vocalResults,
  pausesResults,
  disfluencyResults,
  modulationResults,
  setTranscript,
  setTotalResult,
  setWordResults,
  setSentenceResults,
  setIllustrationData,
  setEPCustomizations,
} from './actions'

import {
  concatenateResults,
  gentleResults,
  punctuatorResults,
  interviewKeys,
} from './resultsActions'

import {
  setInterviewDuration,
  setInterviewName,
  setInterviewQuestion,
  setIsInterviewFavourite,
} from './interviewActions'

import { log } from './../actions/commonActions'
import { logout } from '@vmockinc/dashboard/services/auth'

export function isOnline() {
  if (navigator.onLine) {
    return true
  } else {
    return false
  }
}

export var counters = {
  fetchImproveArticlesCount: 0,
  interviewStatusCount: 0,
  concatApiCount: 0,
  praatApiCount: 0,
  punctuatorApiCount: 0,
  gentleProcessedApiCount: 0,
  inteviewsApiCount: 0,
  fetchUserVideoPathCount: 0,
  fetchAppearCompImgCount: 0,
  fetchFacePointsImgCount: 0,
  fetchUserVideoProcessedPathCount: 0,
  createIntCount: 0,
  startIntCount: 0,
  checkAppearCount: 0,
  saveTranscriptApiCount: 0,
  saveAudioCount: 0,
  processresultsCount: 0,
  getresultstatusCount: 0,
  updateInterviewStatusCount: 0,
  facePointCount: 0,
  sendClip: new Array(50).fill(0),
  sendNoOfVideoClipsCount: 0,
  audioClips: new Array(50).fill(0),
  intKeyIsValidCount: 0,
  fetchTranscriptCount: 0,
  submitTranscriptCount: 0,
  fetchTotalResultCount: 0,
  updateUserInfoCount: 0,
  checkUserRegistrationCount: 0,
  fetchIllustrationDataCount: 0,
  gentleAfterApiCount: 0,
  updateFeedbackCount: 0,
  fetchUserSpeechSubtitlesCount: 0,
  userCustomizationsEPCount: 0,
  updateChecksDoneCount: 0,
  getUserInfoCount: 0,
  modifyInterviewCount: 0,
}

export function apiCallAgain(
  counters,
  key,
  callback,
  networkFailDelay,
  noOfTimes,
  xhr
) {
  counters[key] += 1
  if (counters[key] < noOfTimes) {
    if (isOnline() && xhr.status >= 400 && xhr.status < 600) {
      callback()
    } else {
      setTimeout(() => {
        if (callback) callback()
      }, networkFailDelay)
    }
  }
}

export function fetchImproveArticles() {
  let formData = new FormData()
  api
    .service('ep')
    .post(`/getarticles`, formData, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['fetchImproveArticlesCount'] = 0
      store.dispatch(setImproveArticles(data.articles))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'fetchImproveArticlesCount',
        fetchImproveArticles,
        1000,
        5,
        xhr
      )
      log(
        '%c Api faliure /fetchImproveArticles',
        'background: red; color: white',
        xhr
      )
    })
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export function setImproveArticles(data) {
  return {
    type: 'IMPROVE_ARTICLES',
    payload: data,
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function getUserInfo() {
  api
    .service('ep')
    .get('/getuserdata')
    .done(data => {
      counters['getUserInfoCount'] = 0
      setUserInfo(data)
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'getUserInfoCount',
        () => {
          getUserInfo()
        },
        1000,
        5,
        xhr
      )
      log('%c Api faliure /getuserdata', 'background: red; color: white', xhr)
    })
}

export function setUserInfo(data) {
  store.dispatch({
    type: 'SET_USER_INFO',
    payload: data,
  })
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function updateUserInfo(fd, onSuccess) {
  api
    .service('ep')
    .post(`/updateuserdata`, fd, { processData: false, contentType: false })
    .done(data => {
      counters['updateUserInfoCount'] = 0
      setUserInfo(data)
      onSuccess()
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'updateUserInfoCount',
        () => {
          updateUserInfo(fd, onSuccess)
        },
        1000,
        5,
        xhr
      )

      log(
        '%c Api faliure /updateuserdata',
        'background: red; color: white',
        xhr
      )
    })
}

export function updateChecksDone(type) {
  let formData = new FormData()
  formData.append(type, true)

  api
    .service('ep')
    .post(`/updateuserdata`, formData, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      let gender = store.getState().userInfoEP.gender
      if (gender === null) getUserInfo()

      counters['updateChecksDoneCount'] = 0
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'updateChecksDoneCount',
        () => {
          updateChecksDone(type)
        },
        1000,
        5,
        xhr
      )

      log(
        '%c Api faliure /updateuserdata',
        'background: red; color: white',
        xhr
      )
    })
}

export function setIntReady(data) {
  return {
    type: 'ANOTHER_INTERVIEW_READY',
    payload: data,
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function getInterviewStatus() {
  return new Promise((resolve, reject) => {
    let fd = new FormData()

    api
      .service('ep')
      .post(`/getinterviewstatus`, fd, {
        processData: false,
        contentType: false,
      })
      .done(data => {
        resolve(data.status)
      })
      .fail(xhr => {
        resolve('API_FAILED')
        log(
          '%c Api faliure /getinterviewstatus',
          'background: red; color: white',
          xhr
        )
      })
  })
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function nullifyIntReady() {
  return {
    type: 'NULLIFY_INTERVIEW_READY',
    payload: null,
  }
}

export function fetchConcatenateResults() {
  let concatRes = store.getState().concatenateResults
  if (!_.isEmpty(concatRes)) {
    store.dispatch(isEyeDataLegit(concatRes))
    store.dispatch(isFaceDataLegit(concatRes))
    store.dispatch(isHandDataLegit(concatRes))
    store.dispatch(isAppearDataLegit(concatRes))
    store.dispatch(isBodyDataLegit(concatRes))

    //send concatenate data to store
    store.dispatch(concatenateResults(concatRes))
    return
  }

  let formData = new FormData()
  formData.append('interview_key', store.getState().appIntKey.key)
  formData.append('has_time', false)

  api
    .service('ep')
    .post(`/concatenateresults`, formData, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['concatApiCount'] = 0
      store.dispatch(isEyeDataLegit(data))
      store.dispatch(isFaceDataLegit(data))
      store.dispatch(isHandDataLegit(data))
      store.dispatch(isAppearDataLegit(data))
      store.dispatch(isBodyDataLegit(data))

      //send concatenate data to store
      store.dispatch(concatenateResults(data))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'concatApiCount',
        () => {
          fetchConcatenateResults()
        },
        3000,
        5,
        xhr
      )

      log(
        '%c Api faliure /concatenateresults',
        'background: red; color: white',
        xhr
      )
    })
}

export function isEyeDataLegit(data) {
  return dispatch => {
    if (data.eye_contact_results.length > 0)
      dispatch(eyeResults(data.eye_contact_results[0]))
  }
}

export function isFaceDataLegit(data) {
  return dispatch => {
    if (data.facial_expression_results.length > 0)
      dispatch(faceResults(data.facial_expression_results[0]))
  }
}

export function isHandDataLegit(data) {
  return dispatch => {
    if (data.hand_gesture_results.length > 0)
      dispatch(handResults(data.hand_gesture_results[0]))
  }
}

export function isAppearDataLegit(data) {
  return dispatch => {
    if (data.appearance.length > 0)
      dispatch(appearanceResults(data.appearance[0]))
  }
}

export function isBodyDataLegit(data) {
  return dispatch => {
    if (data.body_posture_results)
      dispatch(bodyResults(data.body_posture_results[0]))
  }
}

export function fetchPunctuator() {
  let formData = new FormData()
  formData.append('interview_key', store.getState().appIntKey.key)

  api
    .service('ep')
    .post(`/punctuatorresults`, formData, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['punctuatorApiCount'] = 0
      store.dispatch(wordResults(data.content.content_results_overall))
      store.dispatch(sentenceResults(data.category.category_results_overall))
      store.dispatch(punctuatorResults(data))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'punctuatorApiCount',
        () => {
          fetchPunctuator()
        },
        3000,
        5,
        xhr
      )
      log(
        '%c Api faliure /punctuatorresults',
        'background: red; color: white',
        xhr
      )
    })
}

export function newGentle() {
  let formData = new FormData()
  formData.append('interview_key', store.getState().appIntKey.key)

  api
    .service('ep')
    .post(`/gentle_processed_results`, formData, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['gentleProcessedApiCount'] = 0
      if (store.getState().statuses.post_gentle_praat !== 'success') return

      genlteDataToStore(data)
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'gentleProcessedApiCount',
        () => {
          newGentle()
        },
        3000,
        5,
        xhr
      )

      log(
        '%c Api faliure /gentle_processed_results',
        'background: red; color: white',
        xhr
      )
    })
}

export function fetchGentleAfterRevaluation() {
  let formData = new FormData()
  formData.append('interview_key', store.getState().appIntKey.key)

  api
    .service('ep')
    .post(`/gentle_processed_results`, formData, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['gentleAfterApiCount'] = 0
      genlteDataToStore(data)
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'gentleAfterApiCount',
        () => {
          fetchGentleAfterRevaluation()
        },
        3000,
        5,
        xhr
      )

      log(
        '%c Api faliure /gentle_processed_results',
        'background: red; color: white',
        xhr
      )
    })
}

export function genlteDataToStore(data) {
  //send gentle data to store
  store.dispatch(gentleResults(data))

  if (data.pause.pause_results_overall !== null) {
    store.dispatch(pausesResults(data.pause.pause_results_overall))
  }

  if (data.sound_results) {
    store.dispatch(vocalResults(data['sound_results']['sound_results_overall']))
  }

  if (data.fillers) {
    store.dispatch(disfluencyResults(data.fillers.filler_results_overall))
  }

  if (data.articulation) {
    store.dispatch(
      modulationResults(data.articulation.articulation_results_overall)
    )
  }
}

export function fetchInterviews(callback = null, onFailure = null) {
  let formData = new FormData()
  formData.append('limit_start', 0)
  formData.append('limit_count', 6)

  api
    .service('ep')
    .post(`/getinterviewkeys`, formData, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['inteviewsApiCount'] = 0
      if (data.interview_keys === null) {
        store.dispatch(interviewKeys(null))
      } else {
        let uniqArray = _.uniq(data.interview_keys, item => {
          return item.interview_key
        })
        store.dispatch(interviewKeys(uniqArray))
      }
      if (callback !== null) {
        callback()
      }
    })
    .fail(xhr => {
      if (onFailure !== null) {
        onFailure()
        return
      }
      apiCallAgain(
        counters,
        'inteviewsApiCount',
        () => {
          fetchInterviews(callback, onFailure)
        },
        3000,
        5,
        xhr
      )

      log(
        '%c Api faliure /getinterviewkeys',
        'background: red; color: white',
        xhr
      )
    })
}

export function fetchUserVideoPath() {
  let url = '/uservideo?key=' + store.getState().appIntKey.key
  api
    .service('ep')
    .get(url)
    .done(data => {
      counters['fetchUserVideoPathCount'] = 0
      store.dispatch(videoPath(data.url))
      store.dispatch(videoProcessThumb(data.url_image))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'fetchUserVideoPathCount',
        () => {
          fetchUserVideoPath()
        },
        2000,
        5,
        xhr
      )

      log(
        '%c Api faliure /fetchUserVideoPath',
        'background: red; color: white',
        xhr
      )
    })
}

export function fetchUserSpeechSubtitles() {
  let url = '/usersubtitles?key=' + store.getState().appIntKey.key
  api
    .service('ep')
    .get(url)
    .done(data => {
      counters['fetchUserSpeechSubtitlesCount'] = 0
      store.dispatch(setVideoSubtitlePath(data.url))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'fetchUserSpeechSubtitlesCount',
        () => {
          fetchUserSpeechSubtitles()
        },
        2000,
        5,
        xhr
      )

      log(
        '%c Api faliure /fetchUserSpeechSubtitles',
        'background: red; color: white',
        xhr
      )
    })
}

export function fetchAppearCompImg() {
  let url = '/userimage?key=' + store.getState().appIntKey.key
  api
    .service('ep')
    .get(url)
    .done(data => {
      counters['fetchAppearCompImgCount'] = 0
      store.dispatch(appearImgPath(data.url))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'fetchAppearCompImgCount',
        () => {
          fetchAppearCompImg()
        },
        2000,
        5,
        xhr
      )

      log(
        '%c Api faliure /fetchAppearCompImg',
        'background: red; color: white',
        xhr
      )
    })
}

function videoPath(data) {
  return {
    type: 'USER_VIDEO_PATH',
    payload: data,
  }
}

export function fetchUserVideoProcessedPath() {
  let url = '/uservideoprocessed?key=' + store.getState().appIntKey.key
  api
    .service('ep')
    .get(url)
    .done(data => {
      counters['fetchUserVideoProcessedPathCount'] = 0
      store.dispatch(videoProcessedPath(data.url))
      store.dispatch(videoProcessedThumb(data.url_image))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'fetchUserVideoProcessedPathCount',
        () => {
          fetchUserVideoProcessedPath()
        },
        2000,
        5,
        xhr
      )

      log(
        '%c Api faliure /fetchUserVideoPath',
        'background: red; color: white',
        xhr
      )
    })
}

function videoProcessedPath(data) {
  return {
    type: 'USER_VIDEO_PROCESSED_PATH',
    payload: data,
  }
}

function videoProcessedThumb(data) {
  return {
    type: 'USER_VIDEO_PROCESSED_THUMB',
    payload: data,
  }
}

function videoProcessThumb(data) {
  return {
    type: 'USER_VIDEO_PROCESS_THUMB',
    payload: data,
  }
}

function setVideoSubtitlePath(data) {
  return {
    type: 'SET_VIDEO_SUBTITLE_PATH',
    payload: data,
  }
}

function appearImgPath(data) {
  return {
    type: 'APPEAR_IMG_PATH',
    payload: data,
  }
}

export function fetchFacePointsImg() {
  let fd = new FormData()
  fd.append('interview_key', store.getState().appIntKey.key)
  let url = '/processing_frame'
  api
    .service('ep')
    .post(url, fd, { processData: false, contentType: false })
    .done(data => {
      counters['fetchFacePointsImgCount'] = 0
      store.dispatch(facePointImgPath(data.url))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'fetchFacePointsImgCount',
        () => {
          fetchFacePointsImg()
        },
        1000,
        10,
        xhr
      )

      log(
        '%c Api faliure /fetchAppearCompImg',
        'background: red; color: white',
        xhr
      )
    })
}

export function fetchUserfacePoints() {
  let fd1 = new FormData()
  fd1.append('interview_key', store.getState().appIntKey.key)

  api
    .service('ep')
    .post(`/processing_frame_face_points`, fd1, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['facePointCount'] = 0
      store.dispatch(facePoints(data))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'facePointCount',
        () => {
          fetchUserfacePoints()
        },
        1000,
        10,
        xhr
      )

      log(
        '%c Api faliure /processing_frame_face_points',
        'background: red; color: white',
        xhr
      )
    })
}

function facePointImgPath(data) {
  return {
    type: 'FACE_POINTS_IMG_PATH',
    payload: data,
  }
}

function facePoints(data) {
  return {
    type: 'FACE_POINTS',
    payload: data,
  }
}

export function reCallImgVideo() {
  fetchUserVideoProcessedPath()
  fetchUserVideoPath()
  fetchAppearCompImg()
}

let fetchUserCustomizationsCount = 0
export function fetchUserCustomizations() {
  return dispatch => {
    api
      .service('accounts')
      .get('user/customizations')
      .done(response => {
        fetchUserCustomizationsCount = 0
        dispatch(setUserCustomizations(response))
      })
      .fail(xhr => {
        if (xhr && (xhr.status === 401 || xhr.status === 400)) {
          logout()
          return
        }

        fetchUserCustomizationsCount += 1
        if (fetchUserCustomizationsCount < 3) {
          dispatch(fetchUserCustomizations())
        }
        log(
          '%c Api faliure /customizations',
          'background: red; color: white',
          xhr
        )
      })
  }
}

export function setUserCustomizations(data) {
  return {
    type: 'FETCH_USER_CUSTOMIZATIONS',
    payload: data,
  }
}

export function intKeyIsValid(
  intKey,
  whenIntKeyFound = null,
  whenIntKeyIsNotFound = null
) {
  let formData = new FormData()
  formData.append('interview_key', intKey)
  api
    .service('ep')
    .post(`/checkinterviewkey`, formData, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['intKeyIsValidCount'] = 0
      setInterviewDuration(data.duration)
      setInterviewName(data.name)
      setInterviewQuestion(data.question_id)
      setIsInterviewFavourite(data.is_favourite)
      if (whenIntKeyFound !== null) whenIntKeyFound(data)
    })
    .fail(xhr => {
      if (xhr.status === 401 || xhr.status === 403) {
        if (whenIntKeyIsNotFound !== null) whenIntKeyIsNotFound()
        return
      }
      apiCallAgain(
        counters,
        'intKeyIsValidCount',
        intKeyIsValid(intKey, whenIntKeyFound, whenIntKeyIsNotFound),
        1000,
        5,
        xhr
      )
      log(
        '%c Api faliure /fetchImproveArticles',
        'background: red; color: white',
        xhr
      )
    })
}

export function punctDataToStore(data) {
  store.dispatch(wordResults(data.content.content_results_overall))
  store.dispatch(sentenceResults(data.category.category_results_overall))
  store.dispatch(punctuatorResults(data))
}

export function intialisePunctuator() {
  store.dispatch(setWordResults(null))
  store.dispatch(setSentenceResults(null))
  store.dispatch(punctuatorResults({}))
}

export function fetchTranscript(callback, onFailure = null) {
  let formData = new FormData()
  formData.append('interview_key', store.getState().appIntKey.key)

  api
    .service('ep')
    .post(`/gettranscriptresults`, formData, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['fetchTranscriptCount'] = 0
      store.dispatch(setTranscript(data))
      if (callback !== null) {
        callback(data)
      }
    })
    .fail(xhr => {
      if (onFailure !== null) {
        onFailure()
        return
      }
      apiCallAgain(
        counters,
        'fetchTranscriptCount',
        fetchTranscript(callback, onFailure),
        1000,
        5,
        xhr
      )
      log(
        '%c Api faliure /gettranscriptresults',
        'background: red; color: white',
        xhr
      )
    })
}

export function submitTranscript(transcript, onSuccess, onFailure) {
  let fd1 = new FormData()
  fd1.append('interview_key', store.getState().appIntKey.key)
  fd1.append('transcript', transcript)
  fd1.append('is_original', 0)
  fd1.append(
    'name',
    store.getState().user.data.firstName +
      ' ' +
      store.getState().user.data.lastName
  )

  api
    .service('ep')
    .post(`/savetranscript`, fd1, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      onSuccess()
    })
    .fail(xhr => {
      onFailure()
    })
}

export function fetchTotalResult() {
  let fd1 = new FormData()
  fd1.append('interview_key', store.getState().appIntKey.key)

  api
    .service('ep')
    .post(`/totalscore`, fd1, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['fetchTotalResultCount'] = 0
      store.dispatch(setTotalResult(data))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'fetchTotalResultCount',
        () => {
          fetchTotalResult()
        },
        1000,
        10,
        xhr
      )

      log(
        '%c Api faliure /fetchTotalResult',
        'background: red; color: white',
        xhr
      )
    })
}

export function checkUserRegistration(callback) {
  let fd = new FormData()
  api
    .service('ep')
    .post(`/checkuser`, fd, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['checkUserRegistrationCount'] = 0
      if (data.status === 'success') {
        callback()
      } else {
        window.location.href = '/dashboard/elevator-pitch'
      }
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'checkUserRegistrationCount',
        () => {
          checkUserRegistration(callback)
        },
        1000,
        10,
        xhr
      )

      log('%c Api faliure /checkuser', 'background: red; color: white', xhr)
    })
}

export function fetchIllustrationData() {
  let fd = new FormData()
  let url = '/getillustrationvideos'
  api
    .service('ep')
    .post(url, fd, { processData: false, contentType: false })
    .done(data => {
      counters['fetchIllustrationDataCount'] = 0
      store.dispatch(setIllustrationData(data.illustration_videos))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'fetchIllustrationDataCount',
        () => {
          fetchIllustrationData()
        },
        1000,
        10,
        xhr
      )

      log(
        '%c Api faliure /fetchIllustrationData',
        'background: red; color: white',
        xhr
      )
    })
}

export function updateFeedback(data, onSuccess, onFailure) {
  let fd = new FormData()
  fd.append('feedback_data', data)

  api
    .service('ep')
    .post(`/updatefeedback`, fd, { processData: false, contentType: false })
    .done(data => {
      counters['updateFeedbackCount'] = 0
      onSuccess()
    })
    .fail(xhr => {
      let count = 5
      apiCallAgain(
        counters,
        'updateFeedbackCount',
        () => {
          updateFeedback(data, onSuccess, onFailure)
        },
        1000,
        count,
        xhr
      )

      log(
        '%c Api faliure /updateFeedback',
        'background: red; color: white',
        xhr
      )
      if (counters.updateFeedbackCount === count) {
        onFailure()
      }
    })
}

export function userCustomizationsEP() {
  let fd = new FormData()

  api
    .service('ep')
    .post(`/usercustomizations`, fd, { processData: false, contentType: false })
    .done(data => {
      //success
      counters['userCustomizationsEPCount'] = 0
      store.dispatch(setEPCustomizations(data))
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'userCustomizationsEPCount',
        () => {
          userCustomizationsEP()
        },
        1000,
        5,
        xhr
      )

      log(
        '%c Api faliure /usercustomizations',
        'background: red; color: white',
        xhr
      )
    })
}

export function modifyInterview({ id, type, val }, callback = null) {
  let fd = new FormData()
  fd.append('interview_key', id)
  fd.append('task', type)
  fd.append('task_value', val)

  api
    .service('ep')
    .post(`/modifyinterviewdetails`, fd, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      counters['modifyInterviewCount'] = 0
      callback ? callback() : null
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'modifyInterviewCount',
        () => {
          modifyInterview({ id, type, val }, (callback = null))
        },
        500,
        10,
        xhr
      )

      log(
        '%c Api faliure /modifyinterivewdetails',
        'background: red; color: white',
        xhr
      )
    })
}
