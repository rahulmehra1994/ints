import React from 'react'

export const colorMap = {
  green: 'circel-green',
  yellow: 'circel-yellow',
  red: 'circel-red',
  gray: 'color-gray',
}

export const symbolMap = {
  green: <i className="fa fa-check" aria-hidden="true" />,
  yellow: <i className="fa fa-exclamation" aria-hidden="true" />,
  red: <i className="fa fa-times" aria-hidden="true" />,
}

export const feedbackMap = {
  face_frame_ratio: {
    green:
      'You have done a good job keeping your face/frame ratio of around 50%.',
    yellow: 'Try to maintain a face/frame ratio of around 50%.',
    red: 'Try to maintain a face/frame ratio of around 50%.',
    gray:
      'Unable to detect. A good image has a face/frame ratio of around 50%.',
  },
  background: {
    green: 'You profile picture has a clear background. Good job!',
    yellow: 'Make sure your picture has a clear background.',
    red: 'Make sure your picture has a clear background.',
    gray: 'Unable to detect. A good image should have a clear background.',
  },
  foreground: {
    green:
      'The objects in your photo do not interfere with clarity and prominence of face. Good job!',
    yellow:
      'Make sure that objects in your photo do not interfere with clarity and prominence of face.',
    red:
      'Make sure that objects in your photo do not interfere with clarity and prominence of face.',
    gray:
      'Unable to detect. Objects in the photo should not interfere with clarity and prominence of face.',
  },
  resolution: {
    green:
      'Your photo size is within the specified limits of 400 x 400 and 20K x 20K pixels. Good job!',
    yellow:
      'Make sure that your photo size is within the specified limits of 400 x 400 and 20K x 20K pixels.',
    red:
      'Make sure that your photo size is within the specified limits of 400 x 400 and 20K x 20K pixels.',
    gray:
      'Unable to detect. Photo size should be between 400 x 400 and 20K x 20K pixels.',
  },
  symmetry: {
    green: 'Your face and shoulders are turned just right!',
    yellow: 'Your face is turned too far.',
    red: 'Your face is turned too far.',
    gray:
      'Unable to detect. Face and shoulders should be angled approrpiately to the camera.',
  },
  face_body_ratio: {
    green:
      'Your profile picture has an appropriate face to body ratio. Good Job!',
    yellow:
      'Ensure that your face covers more area in your picture as compared to your body.',
    red:
      'Ensure that your face covers more area in your picture as compared to your body.',
    gray:
      'Unable to detect. Ensure that your face covers more area as compared to your body.',
  },
  professional_clothes: {
    green: 'A suit and tie are suave and professional attire. Good job!',
    yellow: 'A suit and tie are suave and professional attire.',
    red: 'A suit and tie are suave and professional attire.',
    gray: 'Unable to detect. A suit and tie are suave and professional attire.',
  },
  pupil: {
    green:
      'You have done a good job of maintaining eye contact with the camera.',
    yellow: 'Try to make eye contact with the camera.',
    red: 'Try to make eye contact with the camera.',
    gray: 'Unable to detect. One should make an eye contact with the camera.',
  },
  smile: {
    green: 'An open smile is more likeable. Good Job!',
    yellow: 'Try to have a more open smile as it increases likeability.',
    red: 'Try to have a more open smile as it increases likeability.',
    gray: 'Unable to detect. Try to have a more open smile.',
  },
}
