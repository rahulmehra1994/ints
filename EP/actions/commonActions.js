import React from 'react'
import moment from 'moment'
import _ from 'underscore'
import store from './../../store/configureStore'
import * as cookie from 'js-cookie'
import io from 'socket.io-client'
import { notify } from '@vmockinc/dashboard/services/helpers'
import {
  changeInterviewToSuccess,
  setInterviewBasicData,
} from './interviewActions'
export const urlEnds = {
  calibration: '/calibration',
  interview: `/interview`,
  results: `/results`,
  summary: `/summary`,
  detailed: `/detailed`,
  eyeContact: `/eye-contact`,
  eyeGaze: `/eye-gaze`,
  smile: `/smile`,
  gesture: `/gesture`,
  body: `/body-posture`,
  appearance: `/appearance`,
  word: `/word-usage`,
  sentence: `/sentence-analysis`,
  competency: `/soft-skills`,
  vocal: `/vocal-features`,
  pauses: `/appropriate-pauses`,
  disfluencies: `/disfluencies`,
  modulation: `/speech-modulation`,
  videosummary: `/videosummary`,
  noContent: '/no-content',
}

const socketEP = io(process.env.SOCKET_URL_EP, {
  transports: ['websocket'],
})
export const debounceTime = { small: 1500, medium: 3000, large: 5000 }

const trackingDebounceSmall = _.debounce(
  socketTracking,
  debounceTime.small,
  true
)

export const highContrast =
  cookie.get('accessible_styles') === 'true' ? true : false
export var common = {
  sectionStatus: ['Good Job', 'On Track', 'Needs Work', ''],
  sectionColor: highContrast
    ? ['#33844e', '#a66908', '#cc4400', 'transparent', 'transparent']
    : ['#44af67', '#f5a623', '#ff5500', 'transparent', 'transparent'],
  compLoader: { type: 'line-scale', scale: 'scale(1.2)' },
  lightBgColor: highContrast
    ? ['#e4f2eb', '#ffecd6', ' #ffddd9']
    : ['#e4f2eb', '#ffecd6', ' #ffddd9'],
  primaryColor: highContrast
    ? ['#347000', '#9d611e', '#8f0a17']
    : ['#46A879', '#FF9E2D', '#F34D3D'],
  darkColor: highContrast
    ? ['#347000', '#9d611e', ' #8F0A17']
    : ['#347000', '#ED8D1D', ' #8F0A17'],
  lightColor: highContrast
    ? ['#5ECB00', '#FFD35A', '#F75565']
    : ['#5ECB00', '#FFD35A', '#F75565'],
  lighterColor: highContrast
    ? ['#F0F8F4', '#FFF4E8', '#FFECEA']
    : ['#F0F8F4', '#FFF4E8', '#FFECEA'],
  tabIndexes: {
    calibration: 23,
    interview: 24,
    // results: `/results`,
    summary: 15,
    // detailed: `/detailed`,
    eyeContact: 21,
    eyeGaze: 21,
    smile: 31,
    gesture: 41,
    body: 51,
    appearance: 61,
    word: 71,
    sentence: 81,
    competency: 91,
    vocal: 101,
    pauses: 111,
    disfluencies: 121,
    modulation: 131,
    videosummary: 141,
    insights: 22,
    improvement: 23,
    illustration: 24,
    noContent: 151,
  },
}

export const wrong = (
  <span
    className="ep-icon-wrong"
    style={{
      fontSize: 20,
      verticalAlign: 'sub',
      color: common.sectionColor[2],
    }}>
    <span className="path1" />
    <span className="path2" />
  </span>
)

export const right = (
  <span
    className="ep-icon-right"
    style={{
      fontSize: 20,
      verticalAlign: 'sub',
      color: common.sectionColor[0],
    }}>
    <span className="path1" />
    <span className="path2" />
  </span>
)

const warningImg = (
  <span
    className="ep-icon-caution"
    style={{
      fontSize: 20,
      verticalAlign: 'sub',
      color: common.sectionColor[1],
    }}></span>
)

export const getStatusIcon = [right, warningImg, wrong]

export const txtPrimaryColor = [
  'greenPrimaryTxt',
  'yellowPrimaryTxt',
  'redPrimaryTxt',
]
export const bgPrimaryColor = [
  'greenPrimaryBg',
  'yellowPrimaryBg',
  'redPrimaryBg',
]

export const insightsGraphValColors = highContrast
  ? [
      `url(${process.env.APP_PRODUCT_BASE_URL}/dist/images/new/graph/graph-dots/ada/green.svg)`,
      `url(${process.env.APP_PRODUCT_BASE_URL}/dist/images/new/graph/graph-dots/ada/yellow.svg)`,
      `url(${process.env.APP_PRODUCT_BASE_URL}/dist/images/new/graph/graph-dots/ada/red.svg)`,
    ]
  : [
      `url(${process.env.APP_PRODUCT_BASE_URL}/dist/images/new/graph/graph-dots/normal/green.svg)`,
      `url(${process.env.APP_PRODUCT_BASE_URL}/dist/images/new/graph/graph-dots/normal/yellow.svg)`,
      `url(${process.env.APP_PRODUCT_BASE_URL}/dist/images/new/graph/graph-dots/normal/red.svg)`,
    ]

export function oneOrMany2(string, val) {
  var v = parseInt(val, 10)
  if (v !== 1) {
    return v + ' ' + string.substr(0, string.length - 1) + 'ies'
  } else {
    return v + ' ' + string
  }
}

export function dateFormat(time) {
  return moment(time).format('Do MMMM YYYY')
}

export function dateSmall(time) {
  return moment(time).format('MMM D')
}

export function isKeyThere(data, key) {
  if (_.size(data) < 1) {
    return 'NA'
  } else if (_.has(data[0], key)) {
    return data[0][key]
  } else {
    return null
  }
}

export function validKey(obj, key) {
  if (_.has(obj, key)) {
    return obj[key]
  } else {
    return 'NA'
  }
}

export const getAppearIcon = {
  false: wrong,
  true: right,
}

export function log() {
  if (process.env.APP_ENV !== 'live' && process.env.APP_ENV !== 'staging') {
    return console.log(...arguments)
  }
}

export function trackAndGotoUrl(url, type, desc, interviewId) {
  trackingDebounceSmall({
    event_type: type,
    event_description: desc,
    interview_id: interviewId,
  })

  setTimeout(() => {
    window.location.href = url
  }, 500)
}

export function singleOrPlural(val, word) {
  var v = parseInt(val, word)
  if (v !== 1) {
    return ' ' + val + ' ' + word + 's'
  } else {
    return ' ' + val + ' ' + word
  }
}

export function singluarOrPlural(val, word) {
  var v = parseInt(val, word)
  if (v !== 1) return ' ' + word + 's'
  else return ' ' + word
}

export function shouldShowConcatNA(obj) {
  if (obj.concatenate_status === 'success') {
    return true
  } else {
    return false
  }
}

export function isGraphValNull(obj, key) {
  if (obj[key] !== 'success') {
    return true
  } else {
    return false
  }
}

export function isOrAre(val) {
  if (val === 0 || val > 1) {
    return 'are'
  }
  return 'is'
}

function trackWindowOnfocus() {
  socketTracking({
    curr_page: currentComp,
    event_type: 'onfocus',
    event_description: 'page in focus',
    interview_id: -1,
  })
}

function trackWindowBlur() {
  socketTracking({
    curr_page: currentComp,
    event_type: 'offocus',
    event_description: 'page offocus',
    interview_id: -1,
  })
}

export function onAndBlurFocus() {
  window.addEventListener('focus', trackWindowOnfocus)
  window.addEventListener('blur', trackWindowBlur)
}

export function removeOnAndBlurFocus() {
  window.removeEventListener('focus', trackWindowOnfocus)
  window.removeEventListener('blur', trackWindowBlur)
}

export const defaultInactivityTime = 20000
export const largeInactivityTime = 30000

var currentComp = ''
function urlBreaker(data) {
  let val = ''
  if (_.has(data, 'curr_page')) {
    val = data.curr_page
  } else {
    let paths = window.location.pathname.split('/')
    val = '/' + paths[paths.length - 1]
  }
  currentComp = val
  return val
}

export function socketTracking(data, callback = null) {
  try {
    let objectHavingBothKeysVals = Object.assign(
      {
        curr_url: window.location.href,
        curr_page: urlBreaker(data),
        event_type: '',
        event_description: '',
        interview_id:
          data.interview_id !== -1 ? store.getState().appIntKey.key : '',
      },
      data
    )
    socketEP.emit(
      'message',
      JSON.stringify({
        user_tracking: objectHavingBothKeysVals,
      }),
      // objectHavingBothKeysVals,
      () => {
        if (callback) callback()
      }
    )
  } catch (e) {
    console.error('CATCHED_ERROR:', e)
  }
}

export var findAbsentOrPresent = val => {
  if (val === false || val === 2) {
    return 'absent'
  }
  if (val === true || val === 0) {
    return 'present'
  }
}

export function multipleQuesEnabled(props) {
  //NOTE: Don't change the props parameter it is read only
  if (props.customizations.is_multiple_questions_enabled === 1) {
    return true
  } else {
    return false
  }
}

function isContentEnabled(props) {
  console.log('isContentEnabled', props)
  let { customizations, intQuestionId } = props
  if (customizations === null || intQuestionId === null) return null

  if (multipleQuesEnabled(props)) {
    //get content disabled value from the question selected
    if (intQuestionId !== -1) {
      let res =
        customizations['question_id_mapping'][intQuestionId][
          'is_content_strength_enabled'
        ]
      return res
    } else {
      //for older interviews in the community where mcq is enabled interview_id will come -1 and interview is given on ques => please tell me something about yourself? so content should be enabled for that
      return true
    }
  } else {
    return true
  }
}

export var mutuals = {
  singleOrPlural,
  singluarOrPlural,
  oneOrMany2,
  dateFormat,
  dateSmall,
  isKeyThere,
  validKey,
  getStatusIcon,
  getAppearIcon,
  log,
  trackAndGotoUrl,
  txtPrimaryColor,
  bgPrimaryColor,
  setupTimers,
  removeTimers,
  changeInactivityTime,
  defaultInactivityTime,
  largeInactivityTime,
  ariaLabelAddOnAudioSeekbar,
  debounceTime,
  socketTracking,
  urlEnds,
  pickDeep,
  getValueFromKeys,
  findAbsentOrPresent,
  multipleQuesEnabled,
  isContentEnabled,
  deepCopy,
  randomStr,
  xAxisGraphsTick,
  productName,
  shouldModifyWPM,
  modifyWPMVal,
}

export var timeoutInMiliseconds = { time: defaultInactivityTime }
var timeoutId,
  countActivity = -1

export function changeInactivityTime(time = defaultInactivityTime) {
  window.clearTimeout(timeoutId)
  timeoutInMiliseconds.time = time
}

export function resetTimer() {
  window.clearTimeout(timeoutId)
  startTimer()
  if (countActivity === 0) {
    socketTracking({
      curr_page: currentComp,
      event_type: 'onfocus',
      event_description: 'inactivity ended',
    })
    countActivity = 1
  }
}

export function startTimer() {
  // window.setTimeout returns an Id that can be used to start and stop a timer
  timeoutId = window.setTimeout(doInactive, timeoutInMiliseconds.time)
}

export function doInactive() {
  // does whatever you need it to actually do - probably signs them out or stops polling the server for info
  countActivity = 0

  socketTracking({
    curr_page: currentComp,
    event_type: 'offocus',
    event_description: 'inactivity achieved ',
  })
}

export function setupTimers() {
  document.addEventListener('mousemove', resetTimer, false)
  document.addEventListener('mousedown', resetTimer, false)
  document.addEventListener('keypress', resetTimer, false)
  document.addEventListener('touchmove', resetTimer, false)
  startTimer()
}

export function removeTimers() {
  document.removeEventListener('mousemove', resetTimer, false)
  document.removeEventListener('mousedown', resetTimer, false)
  document.removeEventListener('keypress', resetTimer, false)
  document.removeEventListener('touchmove', resetTimer, false)
  window.clearTimeout(timeoutId)
}

export function ariaLabelAddOnAudioSeekbar() {
  setTimeout(() => {
    if (this.safeToRender) {
      let inputs = document.querySelectorAll("input[type='range']")
      for (let i = 0; i < inputs.length; i++)
        inputs[i].setAttribute('aria-label', 'audio seekbar')
    } else {
      ariaLabelAddOnAudioSeekbar.call(this)
    }
  }, 500)
}

function showNoti(data) {
  notify(data, 'warning', {
    layout: 'topRight',
    timeout: false,
    callback: {
      onClose: () => {},
    },
  })
}

export function pickDeep(collection, identity, thisArg) {
  var picked = _.pick(collection, identity, thisArg)
  var collections = _.pick(collection, _.isObject, thisArg)

  _.each(collections, function (item, key, collection) {
    var object
    if (_.isArray(item)) {
      object = _.reduce(
        item,
        function (result, value) {
          var picked = pickDeep(value, identity, thisArg)
          if (!_.isEmpty(picked)) {
            result.push(picked)
          }
          return result
        },
        []
      )
    } else {
      object = pickDeep(item, identity, thisArg)
    }

    if (!_.isEmpty(object)) {
      picked[key] = object
    }
  })

  return picked
}

export function getValueFromKeys(obj, keys) {
  let keysArr = keys.split('.')

  for (let i = 0; i < keysArr.length; i++) {
    if (!_.isUndefined(obj) && !_.isNull(obj)) {
      if (Array.isArray(obj)) {
        obj = obj[0]
        i = i - 1
      } else {
        obj = obj[keysArr[i]]
      }
    } else {
      return null
    }
  }

  return obj
}

export function faceNotDetected(props) {
  let { concatData } = props
  if (!_.isEmpty(concatData)) {
    if (
      concatData.face_not_detected_percent >= 10 &&
      concatData.face_not_detected_percent < 30
    )
      return { status: true, type: 'warning' }

    if (concatData.face_not_detected_percent >= 30)
      return { status: true, type: 'danger' }

    return { status: false, type: '' }
  }
}

export function transcriptNotDetected(props) {
  let { transcript } = props
  if (transcript.punctuated_transcript_cleaned === -1) {
    return false
  }
  if (
    transcript.punctuated_transcript_cleaned === '' ||
    transcript.punctuated_transcript_cleaned === 'null' ||
    transcript.punctuated_transcript_cleaned === 'null '
  ) {
    return true // not detected
  }

  return false //detected
}

export function noDetection(props) {
  if (
    (props.category === 'nonVerbals' && faceNotDetected(props).status) ||
    (props.category === 'verbals' && transcriptNotDetected(props))
  ) {
    return true
  } else if (
    (props.category === 'nonVerbals' &&
      faceNotDetected(props).status === false) ||
    (props.category === 'verbals' && transcriptNotDetected(props) === false)
  ) {
    return false
  }
}

export function deepCopy(val) {
  return JSON.parse(JSON.stringify(val))
}

function randomStr(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function checkForSpecialChars(val) {
  let pattern = /[^a-zA-Z0-9_# ]/g
  let res = pattern.test(val) // gives true for string which has value other than this pattern
  if (res) {
    alert('Cannot submit special characters')
    return true
  } else {
    return false
  }
}

export function xAxisGraphsTick(val) {
  let str = new Date(val * 1000).toISOString()
  return str.substr(14, 5)
}

export function ContentStrengthBlock() {
  return (
    <span
      className="px-2 rounded-lg text-white text-12-normal"
      style={{ fontSize: 9, background: common.sectionColor[0] }}>
      C.S.
    </span>
  )
}

export const COMMUNITY = 'imperial'

export const COMMUNITY_LIST = ['imperial', 'msubroad']

export function productName() {
  if (_.isEmpty(store.getState().user.data)) {
    return ''
  } else {
    if (COMMUNITY_LIST.indexOf(store.getState().user.data.community) !== -1) {
      return 'Interviews'
    } else {
      return 'Elevator Pitch'
    }
  }
}

export const IDEAL_WPM = 250
export function shouldModifyWPM(val) {
  return val > IDEAL_WPM ? true : false
}

export function modifyWPMVal(val) {
  return shouldModifyWPM(val) ? IDEAL_WPM : val
}

export function competenciesDetected(arr) {
  if (arr.length === 0) return false
  else return true
}

export function getCompetencyCombinedVal(state) {
  if (
    !_.isEmpty(state.punctuatorResults) &&
    !_.isEmpty(state.punctuatorResults.competency) &&
    !_.isEmpty(state.punctuatorResults.competency.competency_results_overall)
  ) {
    return state.punctuatorResults.competency.competency_results_overall
      .competency_combined_val
  } else {
    return 3 //leftbar main it is getting 3 in the else logic
  }
}

export function shouldCompetencyDisplay(props) {
  if (
    isContentEnabled({
      customizations: props.epCustomizations,
      intQuestionId: props.interviewEP.intQuestionId,
    }) === false
  )
    return false

  if (props.epCustomizations.competency === false) return false //hide

  if (props.interviewEP.basicData.is_new) return true

  if (props.interviewEP.basicData.is_competency_processed) return true
  else return false
}

export function showFirstTimeRevaluationPopup(props) {
  if (
    isContentEnabled({
      customizations: props.epCustomizations,
      intQuestionId: props.interviewEP.intQuestionId,
    }) === false
  )
    return false

  if (props.epCustomizations.competency === false) return false

  if (props.interviewEP.basicData.is_new) return false //hide

  if (props.interviewEP.basicData.is_competency_processed) return false //hide

  if (
    props.interviewEP.basicData.initial_competency_processed_status === false
  ) {
    return true //primary initial popup show
  } else {
    return false //hide
  }
}

export function showCompetencyRevaluationModal(props) {
  if (
    isContentEnabled({
      customizations: props.epCustomizations,
      intQuestionId: props.interviewEP.intQuestionId,
    }) === false
  )
    return false

  if (props.epCustomizations.competency === false) return false

  if (props.interviewEP.basicData.is_new) return false //hide

  if (props.interviewEP.basicData.is_competency_processed) return false //hide

  if (props.interviewEP.basicData.initial_competency_processed_status) {
    return true //secondary popup show
  } else {
    return false //hide
  }
}
