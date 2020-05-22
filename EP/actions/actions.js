import { createAction } from 'redux-actions'
import store from './../../store/configureStore'
import { defaultUrls } from './../services/services'
import { actionLabels } from './ActionLabels'

const setEyeResults = createAction(actionLabels.EYE_RESULTS)
const setFaceResults = createAction(actionLabels.FACE_RESULTS)
const setHandResults = createAction(actionLabels.HAND_RESULTS)
const setBodyResults = createAction(actionLabels.BODY_RESULTS)
const setAppearanceResults = createAction(actionLabels.APPEAR_RESULTS)
export const setSentenceResults = createAction(actionLabels.SENTENCE_RESULTS)
export const setWordResults = createAction(actionLabels.WORD_RESULTS)
const setVocalResults = createAction(actionLabels.VOCAL_RESULTS)
const setPausesResults = createAction(actionLabels.PAUSES_RESULTS)
const setDisfluencyResults = createAction(actionLabels.DISFLUENCY_RESULTS)
const setModulationResults = createAction(actionLabels.MODULATION_RESULTS)
export const initializeEpResults = createAction(actionLabels.INITIALIZE_RESULTS)
export const appUrls = createAction(actionLabels.SET_APP_URLS)
export const setConvertVideo = createAction(actionLabels.CONVERT_VIDEO_RESULTS)
export const setStatuses = createAction(actionLabels.STATUSES)
export const setTranscript = createAction(actionLabels.SET_TRANSCRIPT)
export const setTotalResult = createAction(actionLabels.TOTAL_RESULT)
export const setVideoType = createAction(actionLabels.SET_VIDEO_TYPE)
export const toggleVideoFloating = createAction(actionLabels.VIDEO_FLOATING)
export const setRegularVideoState = createAction(
  actionLabels.REGULAR_VIDEO_STATE
)
export const setFloatingVideoState = createAction(
  actionLabels.FlOATING_VIDEO_STATE
)
export const setFloatingVideoPlaying = createAction(
  actionLabels.VIDEO_FLOATING_PLAYING
)
export const setFinalCalibId = createAction(actionLabels.FINAL_CALIBRATION_ID)
export const setVideoChunksData = createAction(
  actionLabels.COMP_VIDEO_CHUNKS_DATA
)
export const toggleVideoChunks = createAction(actionLabels.VIDEO_CHUNKS_VISIBLE)
export const setVideoChunksState = createAction(actionLabels.VIDEO_CHUNKS_STATE)
export const setIllustrationData = createAction(
  actionLabels.FETCH_ILLUSTRATION_DATA
)
export const setTabIndex = createAction(actionLabels.TAB_INDEX)
export const setEPCustomizations = createAction(actionLabels.EP_CUSTOMIZATIONS)
export const setInfoBarsAnimationState = val => {
  store.dispatch(createAction(actionLabels.INFOBARS_ANIMATION_STATE)(val))
}

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
