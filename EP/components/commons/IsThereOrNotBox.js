import React from 'react'
import { mutuals, common, noDetection } from './../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'

var getColor = val => {
  if (val === 'absent') {
    return common.lightBgColor[2]
  }
  if (val === 'present') {
    return common.lightBgColor[0]
  }
  return 'white'
}

class IsThereOrNotBox extends React.Component {
  render() {
    let bgColor = getColor(this.props.callback(this.props.value))
    let bgStyle = { background: bgColor }
    let borderStyle = { border: 'solid 1px #dddddd' }
    return (
      <div
        className="is-there-or-not"
        style={
          _.has(this.props, 'category')
            ? noDetection(this.props)
              ? { border: 'solid 1px #dddddd' }
              : bgStyle
            : bgStyle
        }>
        <div className="subHead">
          <span>{this.props.head}</span>

          {_.has(this.props, 'description') ? (
            <span className="hover-wrap ml-2">
              <span className="ep-icon-info-outline" />

              <div
                className="hover-elm pin-l bg-white shadow-1 rounded-lg p-4 text-14-med"
                style={{ width: 200 }}>
                {this.props.description}
              </div>
            </span>
          ) : null}
        </div>

        <div className="mainHeadLight capitalize mt-8" style={{ fontSize: 32 }}>
          {this.props.callback(this.props.value)}
        </div>
      </div>
    )
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

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(IsThereOrNotBox)
