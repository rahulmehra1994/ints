import React from 'react'

export const ErrorExclam = props => (
  <svg
    width="22px"
    height="22px"
    viewBox="0 0 26 26"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg">
    <g
      id="EP-calibration"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd">
      <g id="Calibration-004" transform="translate(-571.000000, -207.000000)">
        <g
          id="baseline-error_outline-24px-(1)"
          transform="translate(569.000000, 205.000000)">
          <polygon id="Path" points="0 0 30 0 30 30 0 30" />
          <path
            d="M13.75,18.75 L16.25,18.75 L16.25,21.25 L13.75,21.25 L13.75,18.75 Z M13.75,8.75 L16.25,8.75 L16.25,16.25 L13.75,16.25 L13.75,8.75 Z M14.9875,2.5 C8.0875,2.5 2.5,8.1 2.5,15 C2.5,21.9 8.0875,27.5 14.9875,27.5 C21.9,27.5 27.5,21.9 27.5,15 C27.5,8.1 21.9,2.5 14.9875,2.5 Z M15,25 C9.475,25 5,20.525 5,15 C5,9.475 9.475,5 15,5 C20.525,5 25,9.475 25,15 C25,20.525 20.525,25 15,25 Z"
            id="Shape"
            fill="#F34D3D"
            fillRule="nonzero"
          />
        </g>
      </g>
    </g>
  </svg>
)

export const SuccessTick = props => (
  <svg
    width="22px"
    height="22px"
    viewBox="0 0 26 26"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg">
    <g
      id="EP-calibration"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd">
      <g id="Calibration-007" transform="translate(-579.000000, -209.000000)">
        <g
          id="baseline-check_circle_outline-24px"
          transform="translate(577.000000, 207.000000)">
          <path
            d="M0,0 L30,0 L30,30 L0,30 L0,0 Z M0,0 L30,0 L30,30 L0,30 L0,0 Z"
            id="Shape"
          />
          <path
            d="M20.7375,9.475 L12.5,17.7125 L8.0125,13.2375 L6.25,15 L12.5,21.25 L22.5,11.25 L20.7375,9.475 Z M15,2.5 C8.1,2.5 2.5,8.1 2.5,15 C2.5,21.9 8.1,27.5 15,27.5 C21.9,27.5 27.5,21.9 27.5,15 C27.5,8.1 21.9,2.5 15,2.5 Z M15,25 C9.475,25 5,20.525 5,15 C5,9.475 9.475,5 15,5 C20.525,5 25,9.475 25,15 C25,20.525 20.525,25 15,25 Z"
            id="Shape"
            fill="#46A879"
            fillRule="nonzero"
          />
        </g>
      </g>
    </g>
  </svg>
)

export const AnalyzeAnim = props => (
  <svg
    width="40px"
    height="40px"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 60"
    preserveAspectRatio="xMidYMid"
    className="lds-ellipsis"
    style={{ background: 'none' }}>
    <circle cx="84" cy="50" r="2.42784" fill="#dce4eb">
      <animate
        attributeName="r"
        values="10;0;0;0;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="0s"
      />
      <animate
        attributeName="cx"
        values="84;84;84;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
    <circle cx="75.7454" cy="50" r="10" fill="#bbcedd">
      <animate
        attributeName="r"
        values="0;10;10;10;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="-0.6s"
      />
      <animate
        attributeName="cx"
        values="16;16;50;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="-0.6s"
      />
    </circle>
    <circle cx="41.7454" cy="50" r="10" fill="#85a2b6">
      <animate
        attributeName="r"
        values="0;10;10;10;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="-0.3s"
      />
      <animate
        attributeName="cx"
        values="16;16;50;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="-0.3s"
      />
    </circle>
    <circle cx="16" cy="50" r="7.57216" fill="#fdfdfd">
      <animate
        attributeName="r"
        values="0;10;10;10;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="0s"
      />
      <animate
        attributeName="cx"
        values="16;16;50;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
    <circle cx="16" cy="50" r="0" fill="#dce4eb">
      <animate
        attributeName="r"
        values="0;0;10;10;10"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="0s"
      />
      <animate
        attributeName="cx"
        values="16;16;16;50;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.2s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
  </svg>
)
