import $ from 'jquery'
import { handleActions } from 'redux-actions'
import { actionLabels } from './../actions/ActionLabels'

var intialRes = {
  eyeResults: null,
  faceResults: null,
  handResults: null,
  bodyResults: null,
  appearanceResults: null,
  wordResults: null,
  sentenceResults: null,
  vocalResults: null,
  pauseResults: null,
  disfluencyResults: null,
  modulationResults: null,
  totalResult: null,
  performanceInfo: null,
}

export const epResults = handleActions(
  {
    [actionLabels.EYE_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.eyeResults = action.payload
      return newState
    },
    [actionLabels.FACE_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.faceResults = action.payload
      return newState
    },
    [actionLabels.HAND_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.handResults = action.payload
      return newState
    },
    [actionLabels.BODY_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.bodyResults = action.payload
      return newState
    },
    [actionLabels.APPEAR_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.appearanceResults = action.payload
      return newState
    },
    [actionLabels.SENTENCE_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.sentenceResults = action.payload
      return newState
    },
    [actionLabels.WORD_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.wordResults = action.payload
      return newState
    },
    [actionLabels.VOCAL_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.vocalResults = action.payload
      return newState
    },
    [actionLabels.PAUSES_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.pauseResults = action.payload
      return newState
    },
    [actionLabels.DISFLUENCY_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.disfluencyResults = action.payload
      return newState
    },
    [actionLabels.MODULATION_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.modulationResults = action.payload
      return newState
    },
    [actionLabels.INITIALIZE_RESULTS]: (state, action) => {
      return intialRes
    },
    [actionLabels.TOTAL_RESULT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.totalResult = action.payload.result
      newState.performanceInfo = action.payload
      return newState
    },
  },
  intialRes
)

export const convertVideoRes = handleActions(
  {
    [actionLabels.CONVERT_VIDEO_RESULTS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.status = action.payload
      return newState
    },
  },
  { status: null }
)

export const statuses = handleActions(
  {
    [actionLabels.STATUSES]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState = action.payload
      return newState
    },
  },
  {
    concatenate: null,
    convert_video: null,
    categories: null,
    gentle: null,
    post_gentle_praat: null,
    praat: null,
    punctuator: null,
    video_clips_processed_percentage: null,
  }
)

export const transcript = handleActions(
  {
    [actionLabels.SET_TRANSCRIPT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.transcript = action.payload.transcript
      newState.status = action.payload.status
      newState.is_already_reevaluated = action.payload.is_already_reevaluated
      newState.punctuated_transcript_cleaned =
        action.payload.punctuated_transcript_cleaned
      newState.audio_url_full_interview =
        action.payload.audio_url_full_interview
      newState.is_reevaluation_enabled = action.payload.is_reevaluation_enabled
      return newState
    },
  },
  {
    transcript: -1,
    status: -1,
    is_already_reevaluated: -1,
    punctuated_transcript_cleaned: -1,
    audio_url_full_interview: -1,
    is_reevaluation_enabled: true,
  }
)

export const illustrationData = handleActions(
  {
    [actionLabels.FETCH_ILLUSTRATION_DATA]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState = action.payload
      return newState
    },
  },
  {
    appearance: [],
    'appropriate-pauses': [],
    'body-posture': [],
    calibration: [],
    disfluencies: [],
    'elevator-pitch': [],
    'eye-contact': [],
    'eye-gaze': [],
    gesture: [],
    interview: [],
    last_page: [],
    'processing-page': [],
    'sentence-analysis': [],
    smile: [],
    'speech-modulation': [],
    'start-calibration': [],
    summary: [],
    'user-guide': [],
    videosummary: [],
    'vocal-features': [],
    'word-usage': [],
  }
)
