import { handleActions } from 'redux-actions'
import State from '@vmockinc/dashboard/services/State'

import {
  epResults,
  convertVideoRes,
  statuses,
  transcript,
  illustrationData,
} from './resultsReducer'
import { interviewEP } from './interviewReducer'
import { calibration } from './calibrationReducer'
import {
  SET_APP_URLS,
  SET_VIDEO_TYPE,
  VIDEO_FLOATING,
  REGULAR_VIDEO_STATE,
  FlOATING_VIDEO_STATE,
  VIDEO_FLOATING_PLAYING,
  VIDEO_CHUNKS_STATE,
  TAB_INDEX,
  EP_CUSTOMIZATIONS,
  INFOBARS_ANIMATION_STATE,
} from './../actions/actions'
import $ from 'jquery'
import { common, highContrast } from './../actions/commonActions'

export const commonStuff = (state, action) => {
  return {
    sectionStatus: ['Good Job', 'On Track', 'Needs Work', ''],
    sectionColor:
      highContrast === false
        ? ['#44af67', '#f5a623', '#ff5500', '#ffffff']
        : ['#33844e', '#a66908', '#cc4400'],
    compLoader: { type: 'line-scale', scale: 'scale(1.2)' },
  }
}

export const concatenateResults = (state = {}, action) => {
  switch (action.type) {
    case 'CONCATENATE_RESULTS':
      return Object.assign({}, state, action.results)

    default:
      return state
  }
}

export const gentleResults = (state = {}, action) => {
  switch (action.type) {
    case 'GENTLE_RESULTS':
      return Object.assign({}, state, action.results)

    default:
      return state
  }
}

export const punctuatorResults = (state = {}, action) => {
  switch (action.type) {
    case 'PUNCTUATOR_RESULTS':
      return Object.assign({}, state, action.results)

    default:
      return state
  }
}

export const userInfoEP = (
  state = {
    gender: null,
    langCode: -1,
    inputCheckLastTime: null,
    isInputChecked: null,
    isNetworkChecked: null,
    isNew: null,
    networkCheckLastTime: null,
    questionData: null,
  },
  action
) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return {
        ...state,
        gender: action.payload.gender,
        langCode: action.payload.accent,
        inputCheckLastTime: action.payload.input_check,
        isInputChecked: action.payload.is_input_checked,
        isNetworkChecked: action.payload.is_network_checked,
        isNew: action.payload.is_new,
        networkCheckLastTime: action.payload.network_check,
        questionData: action.payload.last_question_details,
      }

    default:
      return state
  }
}

export const improveArticles = (state = [], action) => {
  switch (action.type) {
    case 'IMPROVE_ARTICLES':
      return action.payload
    default:
      return state
  }
}

export const anotherIntReady = (state = null, action) => {
  switch (action.type) {
    case 'ANOTHER_INTERVIEW_READY':
      return action.payload

    case 'NULLIFY_INTERVIEW_READY':
      return null

    default:
      return state
  }
}

export const interviewKeys = (state = -1, action) => {
  switch (action.type) {
    case 'STORE_INTERVIEW_KEYS':
      return Object.assign({}, state, { interviewKeys: action.payload })

    default:
      return state
  }
}

export const appIntKey = (state = null, action) => {
  switch (action.type) {
    case 'APP_INT_KEY':
      return Object.assign({}, state, { key: action.payload })

    default:
      return state
  }
}

export const appUrls = handleActions(
  {
    [SET_APP_URLS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState = action.payload
      return newState
    },
  },
  null
)

export const tabIndex = handleActions(
  {
    [TAB_INDEX]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.currentTabIndex = action.payload
      return newState
    },
  },
  { currentTabIndex: -1 }
)

export const epPaths = (state = {}, action) => {
  switch (action.type) {
    case 'USER_VIDEO_PATH':
      return Object.assign({}, state, { userVideoPath: action.payload })
    case 'APPEAR_IMG_PATH':
      return Object.assign({}, state, { appearImgPath: action.payload })
    case 'FACE_POINTS_IMG_PATH':
      return Object.assign({}, state, { facePointsImgPath: action.payload })
    case 'FACE_POINTS':
      return Object.assign({}, state, { facePoints: action.payload })
    case 'USER_VIDEO_PROCESSED_PATH':
      return Object.assign({}, state, {
        userVideoProcessedPath: action.payload,
      })
    case 'USER_VIDEO_PROCESS_THUMB':
      return Object.assign({}, state, { userVideoProcessThumb: action.payload })
    case 'USER_VIDEO_PROCESSED_THUMB':
      return Object.assign({}, state, {
        userVideoProcessedThumb: action.payload,
      })
    case 'SET_VIDEO_SUBTITLE_PATH':
      return Object.assign({}, state, {
        videoSubtitlesPath: action.payload,
      })
    default:
      return state
  }
}

export const videoInfo = handleActions(
  {
    [SET_VIDEO_TYPE]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.isVideoNormal = action.payload
      return newState
    },
    [VIDEO_FLOATING]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.videoFloating = action.payload
      return newState
    },
    [REGULAR_VIDEO_STATE]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.regularVideoState = action.payload
      return newState
    },
    [FlOATING_VIDEO_STATE]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.floatingVideoState = action.payload
      return newState
    },
    [VIDEO_FLOATING_PLAYING]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.videoFloatingPlaying = action.payload
      return newState
    },
    [VIDEO_CHUNKS_STATE]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.videoChunksState = action.payload
      return newState
    },
  },
  {
    isVideoNormal: true,
    videoFloating: false,
    regularVideoState: -1,
    floatingVideoState: -1,
    videoFloatingPlaying: -1,
    compVideoChunks: [],
    emoji: null,
    videoChunksVisible: false,
    videoChunksState: -1,
  }
)

export const userCustomizations = (state = null, action) => {
  switch (action.type) {
    case 'FETCH_USER_CUSTOMIZATIONS':
      return action.payload
    default:
      return state
  }
}

export const epCustomizations = handleActions(
  {
    [EP_CUSTOMIZATIONS]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState = action.payload
      return newState
    },
  },
  {}
)

export const animations = handleActions(
  {
    [INFOBARS_ANIMATION_STATE]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.infobar = action.payload
      return newState
    },
  },
  { infobar: {} }
)

const combined = {
  animations,
  appUrls,
  calibration,
  State: State,
  results: epResults,
  commonStuff: commonStuff,
  concatenateResults: concatenateResults,
  gentleResults: gentleResults,
  punctuatorResults: punctuatorResults,

  improveArticles: improveArticles,
  userInfoEP: userInfoEP,
  interviewKeys,
  appIntKey: appIntKey,
  anotherIntReady: anotherIntReady,
  epPaths: epPaths,
  interviewEP: interviewEP,
  userCustomizations,
  convertVideoRes,
  statuses,
  transcript,
  videoInfo,
  illustrationData,
  tabIndex,
  epCustomizations,
}

export default combined
