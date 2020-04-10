import React from 'react'
import CenterWrapper from './../../styled-components/CenterWrapper'
import CircleSpinner from './../../styled-components/LoadingSpinner/Circle'

export default () => (
  <div className="appCompLoaderWrap">
    <CenterWrapper>
      <CircleSpinner />
    </CenterWrapper>
  </div>
)
