import { log } from './../../actions/commonActions'
import { mutuals } from './../../actions/commonActions'

// handle user media capture
// export function captureUserMedia(callback) {
//   var params = {
//     audio: false,
//     video: {
//       width: { min: 620, ideal: 640, max: 660 },
//       height: { min: 460, ideal: 480, max: 500 },
//     },
//   }

//   navigator.getUserMedia(params, callback, error => {
//     log('getUserMedia error ', '', error)

//     mutuals.socketTracking({
//       event_type: 'app flow',
//       event_description: 'camera permission problem',
//     })
//   })

//   return true
// }

export function captureUserMedia(callback) {
  var params = {
    audio: false,
    video: {
      width: { min: 620, ideal: 640, max: 660 },
      height: { min: 460, ideal: 480, max: 500 },
    },
  }

  navigator.mediaDevices
    .getUserMedia(params)
    .then(stream => {
      callback(stream)
    })
    .catch(error => {
      log('captureUserMedia error => ', error)

      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: `captureUserMedia error => ${JSON.stringify(error)}`,
      })
    })

  return true
}

// export function captureUserMediaAudio(callback) {
//   var params = {
//     audio: true,
//     video: false,
//   }

//   navigator.getUserMedia =
//     navigator.getUserMedia ||
//     navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia ||
//     navigator.msGetUserMedia

//   navigator.getUserMedia(params, callback, error => {
//     log('getUserMedia error ', '', error)

//     mutuals.socketTracking({
//       event_type: 'app flow',
//       event_description: 'microphone permission problem',
//       local_date_time: new Date().getTime(),
//     })
//   })
// }

export function captureUserMediaAudio(callback) {
  var params = {
    audio: true,
    video: false,
  }

  navigator.mediaDevices
    .getUserMedia(params)
    .then(stream => {
      callback(stream)
    })
    .catch(error => {
      log('captureUserMediaAudio error => ', error)

      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: `captureUserMediaAudio error => ${JSON.stringify(
          error
        )}}`,
      })
    })
}

// export function captureUserMediaWithAudio(callback) {
//   var params = {
//     audio: true,
//     video: {
//       frameRate: {
//         ideal: 16,
//         min: 15,
//       }, //Keep in mind the frame rate of a stream coming from a webcam depends a lot on the light in the room.
//       width: { min: 620, ideal: 640, max: 660 },
//       height: { min: 460, ideal: 480, max: 500 },
//     },
//   }

//   navigator.getUserMedia(params, callback, error => {
//     log('getUserMedia error ', '', error)
//   })
//   return true
// }

export function captureUserMediaWithAudio(callback) {
  var constraints = {
    audio: true,
    video: {
      frameRate: {
        ideal: 16,
        min: 15,
      }, //Keep in mind the frame rate of a stream coming from a webcam depends a lot on the light in the room.
      width: { min: 620, ideal: 640, max: 660 },
      height: { min: 460, ideal: 480, max: 500 },
    },
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      callback(stream)
    })
    .catch(error => {
      log('captureUserMediaWithAudio error =>', error)

      mutuals.socketTracking({
        event_type: 'app flow',
        local_date_time: new Date().getTime(),
        event_description: `captureUserMediaWithAudio error => ${JSON.stringify(
          error
        )}`,
      })
    })

  return true
}

export function pad(number, length) {
  var str = '' + number
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

export function mediaPermisssion(type) {
  //type could be camera, microphone
  return navigator.permissions.query({ name: type })
}

export function permissionStatus() {
  var per = []
  return new Promise((resolve, reject) => {
    mediaPermisssion('camera').then(res => {
      if (res.state === 'granted') {
        per.push('')
      } else per.push('camera')

      mediaPermisssion('microphone').then(res => {
        if (res.state === 'granted') {
          per.push('')
        } else per.push('microphone')

        resolve({
          status: per[0] !== '' || per[1] !== '' ? false : true,
          msg: `Please provide${per[0] !== '' ? ' ' + per[0] : ''}${
            per[0] !== '' && per[1] !== '' ? ' and' : ''
          }${per[1] !== '' ? ' ' + per[1] : ''} permission.`,
        })
      })
    })
  })
}

export function checkForAudioTracks(callback) {
  return new Promise((resolve, reject) => {
    navigator.getUserMedia(
      { audio: true },
      stream => {
        if (stream.getAudioTracks().length > 0) {
          resolve({ status: true, msg: 'success' })
        }

        if (stream.getAudioTracks().length < 1) {
          resolve({ status: false, msg: 'no microphone tracks' })

          mutuals.socketTracking({
            event_type: 'app flow',
            event_description: 'no microphone tracks',
          })
        }
      },
      error => {
        resolve({ status: false, msg: 'error' })

        mutuals.socketTracking({
          event_type: 'app flow',
          event_description: 'error - no microphone tracks',
        })
      }
    )
  })
}

export function checkForVideoTracks(callback) {
  return new Promise((resolve, reject) => {
    navigator.getUserMedia(
      { video: true },
      stream => {
        if (stream.getVideoTracks().length > 0) {
          resolve({ status: true, msg: 'success' })
        }

        if (stream.getVideoTracks().length < 1) {
          resolve({ status: false, msg: 'no video tracks' })

          mutuals.socketTracking({
            event_type: 'app flow',
            event_description: 'no video tracks',
          })
        }
      },
      error => {
        resolve({ status: false, msg: 'error' })

        mutuals.socketTracking({
          event_type: 'app flow',
          event_description: 'error - no video tracks',
        })
      }
    )
  })
}

checkForAudioTracks().then(tracksRes => {
  mediaPermisssion('microphone').then(result => {
    if (result.state === 'granted') {
      if (tracksRes.status === false) {
        alert(
          'Please close any other software that is using microphone or allow access to microphone for chrome'
        )
      }
    }
  })
})

checkForVideoTracks().then(tracksRes => {
  mediaPermisssion('camera').then(result => {
    if (result.state === 'granted') {
      if (tracksRes.status === false) {
        alert(
          'Please close any other software that is using camera or allow access to camera for chrome'
        )
      }
    }
  })
})
