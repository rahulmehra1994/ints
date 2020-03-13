import React from 'react'

export const colorMap = {
  green: 'color-green',
  yellow: 'color-orange',
  red: 'color-red',
}

export const symbolMap = {
  green: <span className="fa fa-check" aria-hidden="true" />,
  yellow: <span className="fa fa-exclamation" aria-hidden="true" />,
  red: <span className="fa fa-times" aria-hidden="true" />,
}

export const feedbackContent = {
  red: {
    title_text: 'Needs Work!',
    body: <p>Consider the feedback to improve this section. </p>,
  },
  yellow: {
    title_text: 'On Track!',
    body: <p>Consider the feedback to improve this section. </p>,
  },
  green: {
    title_text: 'Looks Good!',
    body: <p>You have done a good job with this section! </p>,
  },
}

export const connectionBullet = [
  'Grow your network to 500+ professional connections',
  'Build engagement within your network',
]
