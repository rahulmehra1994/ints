import { createAction } from 'redux-actions'
// import api from './../modules/services/api'
import api from '@vmockinc/dashboard/services/api'
import store from './../../store/configureStore'
import _ from 'underscore'
import {
  counters,
  apiCallAgain,
  fetchConcatenateResults,
  fetchPunctuator,
  newGentle,
  reCallImgVideo,
  fetchTotalResult,
  fetchUserSpeechSubtitles,
} from './../actions/apiActions'
import { log } from './../actions/commonActions'
import { PREFIX, setConvertVideo, setStatuses } from './../actions/actions'

export const VIDEO_PROCESSED_PERCENT = PREFIX + 'VIDEO_PROCESSED_PERCENT'
export const INTERVIEW_DURATION = PREFIX + 'INTERVIEW_DURATION'
export const INTERVIEW_NAME = PREFIX + 'INTERVIEW_NAME'
export const INTERVIEW_QUESTION_ID = PREFIX + 'INTERVIEW_QUESTION_ID'
export const INTERVIEW_FAVOURITE_STATUS = PREFIX + 'INTERVIEW_FAVOURITE_STATUS'

export function setVideoProcessedPercent(percentage) {
  store.dispatch(createAction(VIDEO_PROCESSED_PERCENT)(percentage))
}

export function setInterviewDuration(duration) {
  store.dispatch(createAction(INTERVIEW_DURATION)(duration))
}

export function setInterviewName(payload) {
  store.dispatch(createAction(INTERVIEW_NAME)(payload))
}

export function setInterviewQuestion(payload) {
  store.dispatch(createAction(INTERVIEW_QUESTION_ID)(payload))
}

export function setIsInterviewFavourite(payload) {
  store.dispatch(createAction(INTERVIEW_FAVOURITE_STATUS)(payload))
}

export function createInterview2(callback, fd) {
  api
    .service('ep')
    .post(`/createinterview`, fd, { processData: false, contentType: false })
    .done(data => {
      callback(data)
      setInterviewName(data.name)
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'createIntCount',
        () => {
          createInterview2(callback, fd)
        },
        1000,
        10,
        xhr
      )

      log(
        '%c Api faliure /createinterview2',
        'background: red; color: white',
        xhr
      )
    })
}

export function startInterviewApi(params, callback) {
  let fd = new FormData()
  _.each(params, (value, key) => {
    fd.append(key, value)
  })
  fd.append('interview_key', store.getState().appIntKey.key)

  api
    .service('ep')
    .post(`/startinterview`, fd, { processData: false, contentType: false })
    .done(response => {
      callback()
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'startIntCount',
        () => {
          startInterviewApi(params, callback)
        },
        1000,
        10,
        xhr
      )

      log(
        '%c Api faliure /startinterview',
        'background: red; color: white',
        xhr
      )
    })
}

export function checkAppearance() {
  let fd = new FormData()
  fd.append('interview_key', store.getState().appIntKey.key)

  api
    .service('ep')
    .post(`/checkappearance`, fd, { processData: false, contentType: false })
    .done(response => {
      //success
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'checkAppearCount',
        () => {
          checkAppearance()
        },
        2000,
        10,
        xhr
      )

      log(
        '%c Api faliure /checkappearance',
        'background: red; color: white',
        xhr
      )
    })
}

export function submitTranscriptApi(params, onSuccessTranscript) {
  let fd = new FormData()
  _.each(params, (value, key) => {
    fd.append(key, value)
  })

  fd.append(
    'name',
    store.getState().user.data.firstName +
      ' ' +
      store.getState().user.data.lastName
  )

  api
    .service('ep')
    .post(`/savetranscript`, fd, { processData: false, contentType: false })
    .done(res => {
      onSuccessTranscript()
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'saveTranscriptApiCount',
        () => {
          submitTranscriptApi(params, onSuccessTranscript)
        },
        1000,
        10,
        xhr
      )

      log(
        '%c Api faliure /savetranscript',
        'background: red; color: white',
        xhr
      )
    })
}

export function saveAudioAPI(params, onSaveAudioAPISuccess) {
  let fd = new FormData()
  _.each(params, (value, key) => {
    fd.append(key, value)
  })

  fd.append(
    'name',
    store.getState().user.data.firstName +
      ' ' +
      store.getState().user.data.lastName
  )

  api
    .service('ep')
    .post(`/saveaudio`, fd, { processData: false, contentType: false })
    .done(res => {
      onSaveAudioAPISuccess()
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'saveAudioCount',
        () => {
          saveAudioAPI(params, onSaveAudioAPISuccess)
        },
        2000,
        10,
        xhr
      )
      log('%c Api faliure /saveaudio', 'background: red; color: white', xhr)
    })
}

export function processresults(props, params) {
  let fd = new FormData()
  _.each(params, (value, key) => {
    fd.append(key, value)
  })

  api
    .service('ep')
    .post(`/processresults`, fd, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      if (data.status === 'success') {
        changeInterviewToSuccess()
        checkIntResultsFirst(props)
      } else {
        processresults(props, params)
      }
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'processresultsCount',
        () => {
          processresults(props, params)
        },
        2000,
        10,
        xhr
      )

      log(
        '%c Api faliure /processresults',
        'background: red; color: white',
        xhr
      )
    })
}

export function checkIntResultsFirst(props) {
  let interviewKey = store.getState().appIntKey.key
  let fd = new FormData()
  fd.append('interview_key', store.getState().appIntKey.key)
  api
    .service('ep')
    .post(`/getresultstatus`, fd, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      if (data.concatenate === 'success') {
        store.dispatch(setStatuses(data))
        fetchConcatenateResults()
        setTimeout(() => {
          props.history.push(`/${interviewKey}/results/summary`)
        }, 2000)
      } else {
        setTimeout(() => {
          checkIntResultsFirst(props)
        }, 1000)
      }
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'checkIntResultsFirstCount',
        () => {
          checkIntResultsFirst(props)
        },
        3000,
        5,
        xhr
      )

      log(
        '%c Api faliure /getresultstatus',
        'background: red; color: white',
        xhr
      )
    })
}

function againFetchIntStatuses(data) {
  let arr = _.filter(data, status => {
    if (
      status !== 'success' &&
      status !== 'failed' &&
      typeof status !== 'number'
    ) {
      return true
    } else {
      return false
    }
  })

  if (arr.length > 0) return true
  else return false
}

var reCallImgVideoCount = 0,
  punctuatorCount = 0,
  gentleCount = 0,
  concatenateCount = 0

export function getIntResults() {
  let fd = new FormData()
  fd.append('interview_key', store.getState().appIntKey.key)
  api
    .service('ep')
    .post(`/getresultstatus`, fd, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      if (againFetchIntStatuses(data)) {
        setTimeout(() => {
          getIntResults()
        }, 1000)
      }

      if (
        data.concatenate === 'success' &&
        data.post_gentle_praat === 'success' &&
        data.categories === 'success' &&
        data.gentle === 'success' &&
        data.praat === 'success'
      ) {
        fetchTotalResult()
      }

      store.dispatch(setStatuses(data))

      if (data.categories === 'success' && punctuatorCount === 0) {
        punctuatorCount += 1
        fetchPunctuator()
      }
      if (data.post_gentle_praat === 'success' && gentleCount === 0) {
        gentleCount += 1
        newGentle()
        fetchUserSpeechSubtitles()
      }
      if (data.concatenate === 'success' && concatenateCount === 0) {
        concatenateCount += 1
        fetchConcatenateResults()
      }
      if (data.convert_video === 'success' && reCallImgVideoCount === 0) {
        reCallImgVideoCount += 1
        reCallImgVideo()
        store.dispatch(setConvertVideo(true))
      }

      setVideoProcessedPercent(data.video_clips_processed_percentage)
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'getresultstatusCount',
        () => {
          getIntResults()
        },
        2000,
        10,
        xhr
      )

      log(
        '%c Api faliure /getresultstatus',
        'background: red; color: white',
        xhr
      )
    })
}

export function changeInterviewToSuccess() {
  let fd = new FormData()
  api
    .service('ep')
    .post(`/updateinterviewstatus`, fd, {
      processData: false,
      contentType: false,
    })
    .done(res => {
      //success
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'changeInterviewToSuccessCount',
        () => {
          changeInterviewToSuccess()
        },
        1000,
        5,
        xhr
      )

      log(
        '%c Api faliure /updateinterviewstatus',
        'background: red; color: white',
        xhr
      )
    })
}

export function sendNoOfVideoClips(params, intDuration) {
  let fd = new FormData()
  _.each(params, (value, key) => {
    fd.append(key, value)
  })
  fd.append('interview_key', store.getState().appIntKey.key)

  api
    .service('ep')
    .post(`/updateclipcount`, fd, {
      processData: false,
      contentType: false,
    })
    .done(res => {
      //success of sendNoOfVideoClips
    })
    .fail(xhr => {
      apiCallAgain(
        counters,
        'sendNoOfVideoClipsCount',
        () => {
          sendNoOfVideoClips(params, intDuration)
        },
        1000,
        5,
        xhr
      )

      log(
        '%c Api faliure /sendNoOfVideoClips',
        'background: red; color: white',
        xhr
      )
    })
}

export function sendAudioData(index, state) {
  let data = state.audiosArray[index]
  let fd = new FormData()
  fd.append('transcript', data.transcript)
  fd.append('blob', data.blob)
  fd.append('startTime', data.startTime)
  fd.append('endTime', data.endTime)
  fd.append('id', data.id)

  api
    .service('ep')
    .post(`/audioAndTranscript`, fd, {
      processData: false,
      contentType: false,
    })
    .done(data => {
      state.audiosArray[index].isSent = true
      state.apiReqLocked = false
      this.checkAudioNotSent()
    })
    .fail(xhr => {
      apiCallAgain(
        counters.audioClips,
        index,
        () => {
          sendAudioData(index, state)
        },
        1000,
        10,
        xhr
      )

      log('%c Api faliure /sasa', 'background: red; color: white', xhr)
    })
}

export function uploadVideoAPI(params, onUploadVideoSuccess, onFailure) {
  let fd = new FormData()
  _.each(params, (value, key) => {
    fd.append(key, value)
  })

  api
    .service('ep')
    .post(`/processclip`, fd, { processData: false, contentType: false })
    .done(() => {
      onUploadVideoSuccess(params.id)
    })
    .fail(xhr => {
      onFailure(params, onUploadVideoSuccess, onFailure, xhr)
    })
}
