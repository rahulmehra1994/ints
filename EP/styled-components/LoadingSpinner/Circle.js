import React from 'react'
import styled, { keyframes } from 'styled-components'

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const LoadingDiv = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  && div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 51px;
    height: 51px;
    margin: 6px;
    border: 6px solid #fff;
    border-radius: 50%;
    animation: ${rotate360} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  && div:nth-child(1) {
    animation-delay: -0.45s;
  }
  && div:nth-child(2) {
    animation-delay: -0.3s;
  }
  && div:nth-child(3) {
    animation-delay: -0.15s;
  }
`

export const CircleSpinner = () => (
  <LoadingDiv>
    <div />
    <div />
    <div />
    <div />
  </LoadingDiv>
)

export default CircleSpinner
