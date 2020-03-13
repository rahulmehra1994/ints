import React, { Component } from 'react'
import { connect } from 'react-redux'
import Summary from '../components/Summary'

function mapStateToProps(state, ownProps) {
  return {
    feedback: state.aspireFeedbackData.data, // aspire feedback data
    has_api: state.aspireFeedbackData.has_api,
    has_pdf: state.aspireFeedbackData.has_pdf,
    has_resume: state.aspireFeedbackData.has_resume,
    status: state.aspireFeedbackData.status,
  }
}

export default connect(mapStateToProps)(Summary)
