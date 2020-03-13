import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

const processingImg = process.env.APP_BASE_URL + '/dist/images/processing.svg'

class Interview_processing extends Component {
  videoUploadedPercentage() {
    let percent =
      (this.props.noOfVideoProcessed / this.props.noOfVideoSent) * 100
    return parseInt(percent)
  }

  showTill99(value) {
    let val = parseInt(value)
    if (val >= 100) {
      return 99
    } else {
      return val
    }
  }

  componentDidMount() {}

  render() {
    return (
      <div className={this.props.className}>
        <div className="intProcess">
          <div className="text-center">
            <div className="subSubHead">
              {'Uploading Interview '}
              <span>
                ({this.videoUploadedPercentage()}
                %)
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="subSubHead">
              {'Processing Video '}
              <span>
                ({this.showTill99(this.props.videoProcessedPercent)}
                %)
              </span>
            </div>
          </div>

          <div className="processing-status">
            <span className="processing-text">Processing Interview</span>
            <img
              src={processingImg}
              className="processing-image"
              alt={`processing icon`}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    videoProcessedPercent: state.interviewEP.videoProcessedPercent,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Interview_processing)
