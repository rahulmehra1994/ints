import React, { Component } from 'react'
import {
  mutuals,
  log,
  common,
  faceNotDetected,
  transcriptNotDetected,
} from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'

var classNames = require('classnames')

const Body = props => {
  let stl =
    props.type === 'alert'
      ? {
          border: `1px solid ${common.sectionColor[2]}`,
          background: common.lighterColor[2],
        }
      : {
          border: `1px solid ${common.sectionColor[1]}`,
          background: common.lighterColor[1],
        }
  return (
    <div
      className="none-detection"
      style={stl}
      role="complementary"
      aria-label={props.info}>
      <span
        style={{
          fontSize: 24,
          color:
            props.type === 'alert'
              ? common.sectionColor[2]
              : common.sectionColor[1],
        }}
        className="ep-icon-warning-3-side align-bottom"
      />

      <span className="para ml-6">{props.info}</span>
    </div>
  )
}

class NoDetectionAlert extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'alert',
      showNonVerbalsNonDetection: false,
      showVerbalsNonDetection: false,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.shouldAlertBeVisible(nextProps)
  }

  componentDidMount() {
    this.shouldAlertBeVisible(this.props)
  }

  shouldAlertBeVisible(props) {
    if (
      props.section === 'nonVerbals' &&
      faceNotDetected(props).status &&
      faceNotDetected(props).type === 'warning'
    ) {
      this.setState({ showNonVerbalsNonDetection: true, type: 'warning' })
    } else if (
      props.section === 'nonVerbals' &&
      faceNotDetected(props).status &&
      faceNotDetected(props).type === 'danger'
    ) {
      this.setState({ showNonVerbalsNonDetection: true, type: 'alert' })
    }

    if (props.section === 'verbals' && transcriptNotDetected(props)) {
      this.setState({ showVerbalsNonDetection: true, type: 'alert' })
    } else if (
      props.section === 'verbals' &&
      transcriptNotDetected(props) === false
    ) {
      this.setState({ showVerbalsNonDetection: false, type: 'alert' })
    }
  }

  render() {
    let { concatData, section, info, tabIndex } = this.props
    let {
      type,
      showNonVerbalsNonDetection,
      showVerbalsNonDetection,
    } = this.state

    if (section === 'nonVerbals' && showNonVerbalsNonDetection) {
      return (
        <Body
          info={`Face not detected for more than ${
            concatData.face_not_detected_percent > 99
              ? 99
              : concatData.face_not_detected_percent
          }% of the interview.`}
          tabIndex={tabIndex}
          type={type}
        />
      )
    }

    if (section === 'verbals' && showVerbalsNonDetection) {
      return <Body info={info} tabIndex={tabIndex} type={type} />
    }

    return null
  }
}

function mapStateToProps(state, ownProps) {
  return {
    transcript: state.transcript,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
  }
}

export default connect(
  mapStateToProps,
  {}
)(NoDetectionAlert)
