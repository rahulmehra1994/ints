import React from 'react'
import { PropTypes } from 'prop-types'
import AppBar from '../containers/AppBar'

const AspireFeedback = ({
  children,
  fetchId,
  page,
  targetJobFunctions,
  resumeFiles,
  fetchResume,
  fetchPdf,
  fetchChangedFunction,
  fetchEditedData,
}) => (
  <div>
    <AppBar
      fetchId={fetchId}
      page={page}
      targetJobFunctions={targetJobFunctions}
      resumeFiles={resumeFiles}
      fetchResume={fetchResume}
      fetchPdf={fetchPdf}
      fetchChangedFunction={fetchChangedFunction}
      fetchEditedData={fetchEditedData}
    />
    {children}
  </div>
)

AspireFeedback.propTypes = {
  children: PropTypes.node,
}

export default AspireFeedback
