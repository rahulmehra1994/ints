import { createAction } from 'redux-actions'
import store from './../../store/configureStore'
import { defaultUrls } from './../services/services'

export const PREFIX = 'EP.'

export const EYE_RESULTS = PREFIX + 'EYE_RESULTS'
export const FACE_RESULTS = PREFIX + 'FACE_RESULTS'
export const HAND_RESULTS = PREFIX + 'HAND_RESULTS'
export const BODY_RESULTS = PREFIX + 'BODY_RESULTS'
export const APPEAR_RESULTS = PREFIX + 'APPEAR_RESULTS'
export const SENTENCE_RESULTS = PREFIX + 'SENTENCE_RESULTS'
export const WORD_RESULTS = PREFIX + 'WORD_RESULTS'
export const VOCAL_RESULTS = PREFIX + 'VOCAL_RESULTS'
export const PAUSES_RESULTS = PREFIX + 'PAUSES_RESULTS'
export const DISFLUENCY_RESULTS = PREFIX + 'DISFLUENCY_RESULTS'
export const MODULATION_RESULTS = PREFIX + 'MODULATION_RESULTS'
export const STORE_INTERVIEW_KEYS = PREFIX + 'STORE_INTERVIEW_KEYS'
export const INITIALIZE_RESULTS = PREFIX + 'INITIALIZE_RESULTS'
export const STORE_SAVE_AUDIO_RESULTS = PREFIX + 'STORE_SAVE_AUDIO_RESULTS'
export const SET_APP_URLS = PREFIX + 'SET_APP_URLS'
export const CONVERT_VIDEO_RESULTS = PREFIX + 'CONVERT_VIDEO_RESULTS'
export const STATUSES = PREFIX + 'APP_STATUSES'
export const SET_TRANSCRIPT = PREFIX + 'SET_TRANSCRIPT'
export const TOTAL_RESULT = PREFIX + 'TOTAL_RESULT'
export const SET_VIDEO_TYPE = PREFIX + 'SET_VIDEO_TYPE'
export const VIDEO_FLOATING = PREFIX + 'VIDEO_FLOATING'
export const REGULAR_VIDEO_STATE = PREFIX + 'REGULAR_VIDEO_STATE'
export const FlOATING_VIDEO_STATE = PREFIX + 'FlOATING_VIDEO_STATE'
export const VIDEO_FLOATING_PLAYING = PREFIX + 'VIDEO_FLOATING_PLAYING'
export const FINAL_CALIBRATION_ID = PREFIX + 'FINAL_CALIBRATION_ID'
export const COMP_VIDEO_CHUNKS_DATA = PREFIX + 'COMP_VIDEO_CHUNKS_DATA'
export const VIDEO_CHUNKS_VISIBLE = PREFIX + 'VIDEO_CHUNKS_VISIBLE'
export const VIDEO_CHUNKS_STATE = PREFIX + 'VIDEO_CHUNKS_STATE'
export const INFOBARS_ANIMATION_STATE = PREFIX + 'INFOBARS_ANIMATION_STATE'

export const FETCH_ILLUSTRATION_DATA = PREFIX + 'FETCH_ILLUSTRATION_DATA'
export const TAB_INDEX = PREFIX + 'TAB_INDEX'
export const EP_CUSTOMIZATIONS = PREFIX + 'EP_CUSTOMIZATIONS'
export const REQUIREMENTS = PREFIX + 'REQUIREMENTS'

const setEyeResults = createAction(EYE_RESULTS)
const setFaceResults = createAction(FACE_RESULTS)
const setHandResults = createAction(HAND_RESULTS)
const setBodyResults = createAction(BODY_RESULTS)
const setAppearanceResults = createAction(APPEAR_RESULTS)
export const setSentenceResults = createAction(SENTENCE_RESULTS)
export const setWordResults = createAction(WORD_RESULTS)
const setVocalResults = createAction(VOCAL_RESULTS)
const setPausesResults = createAction(PAUSES_RESULTS)
const setDisfluencyResults = createAction(DISFLUENCY_RESULTS)
const setModulationResults = createAction(MODULATION_RESULTS)

export const initializeEpResults = createAction(INITIALIZE_RESULTS)
export const appUrls = createAction(SET_APP_URLS)
export const setConvertVideo = createAction(CONVERT_VIDEO_RESULTS)
export const setStatuses = createAction(STATUSES)
export const setTranscript = createAction(SET_TRANSCRIPT)
export const setTotalResult = createAction(TOTAL_RESULT)
export const setVideoType = createAction(SET_VIDEO_TYPE)
export const toggleVideoFloating = createAction(VIDEO_FLOATING)
export const setRegularVideoState = createAction(REGULAR_VIDEO_STATE)
export const setFloatingVideoState = createAction(FlOATING_VIDEO_STATE)
export const setFloatingVideoPlaying = createAction(VIDEO_FLOATING_PLAYING)
export const setFinalCalibId = createAction(FINAL_CALIBRATION_ID)
export const setVideoChunksData = createAction(COMP_VIDEO_CHUNKS_DATA)
export const toggleVideoChunks = createAction(VIDEO_CHUNKS_VISIBLE)
export const setVideoChunksState = createAction(VIDEO_CHUNKS_STATE)

export const setIllustrationData = createAction(FETCH_ILLUSTRATION_DATA)
export const setTabIndex = createAction(TAB_INDEX)
export const setEPCustomizations = createAction(EP_CUSTOMIZATIONS)
export const setInfoBarsAnimationState = val => {
  store.dispatch(createAction(INFOBARS_ANIMATION_STATE)(val))
}
export const storeRequriments = createAction(REQUIREMENTS)

export function dispatchSetTabIndex(data) {
  store.dispatch(setTabIndex(data))
}

export function eyeResults(data) {
  return dispatch => {
    dispatch(
      setEyeResults({
        eyeCombinedVal: data.eye_combined_val,
        eyeCombinedMsg: {
          msgCenter: data.msg_center,
          msgBlink: data.msg_blink,
          msgClosure: data.msg_closure,
        },
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function faceResults(data) {
  return dispatch => {
    dispatch(
      setFaceResults({
        faceCombinedVal: data.face_combined_val,
        faceCombinedMsg: data.msg_face,
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function handResults(data) {
  return dispatch => {
    dispatch(
      setHandResults({
        gestCombinedVal: data.gest_combined_val,
        gestCombinedMsg: data.msg_gest,
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function bodyResults(data) {
  return dispatch => {
    dispatch(
      setBodyResults({
        bodyCombinedVal: data.body_combined_val,
        bodyCombinedMsg: data.msg_body,
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function appearanceResults(data) {
  return dispatch => {
    dispatch(
      setAppearanceResults({
        appearCombinedVal: data.appearance_combined_val,
        appearCombinedMsg: data.msg_appearance,
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function sentenceResults(data) {
  return dispatch => {
    dispatch(
      setSentenceResults({
        sentenceCombinedVal: data.category_combined_val,
        sentenceCombinedMsg: data.msg_category,
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function wordResults(data) {
  return dispatch => {
    dispatch(
      setWordResults({
        wordCombinedVal: data.content_combined_val,
        wordCombinedMsg: data.msg_content,
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function vocalResults(data) {
  return dispatch => {
    dispatch(
      setVocalResults({
        vocalCombinedVal: data.sound_combined_val,
        vocalCombinedMsg: data.msg_sound_results,
      })
    )
  }
}
//--------------------------------------------------------------------------------------------------------------------------------------------

export function pausesResults(data) {
  return dispatch => {
    dispatch(
      setPausesResults({
        pauseCombinedVal: data.pause_combined_val,
        pauseCombinedMsg: '',
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function disfluencyResults(data) {
  return dispatch => {
    dispatch(
      setDisfluencyResults({
        disfluencyCombinedVal: data.filler_combined_val,
        disfluencyCombinedMsg: data.msg_filler,
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function modulationResults(data) {
  return dispatch => {
    dispatch(
      setModulationResults({
        modulationCombinedVal: data.articulation_combined_val,
        modulationCombinedMsg: data.msg_articulation,
      })
    )
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------

export function setAppUrls(intkey) {
  let uris = defaultUrls(intkey)
  store.dispatch(appUrls(uris))
}
