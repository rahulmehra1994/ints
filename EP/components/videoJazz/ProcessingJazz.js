import React, { Component } from 'react'
import { connect } from 'react-redux'
import { log } from './../../actions/commonActions'
import _ from 'underscore'
import * as d3 from 'd3'
import InterviewProcessing from './../interview/Interview_processing'
import { notify } from '@vmockinc/dashboard/services/helpers'

var classNames = require('classnames')

var circles
var svgContainer
var width = 640
var height = 480
var facePointSize = 2
var eyePointSize = 1.5
var lipsPointSize = 1.75
var faceColor = '#FFFF00'
var eyeColor = '#00FF00'
var lipColor = '#00FFFF'
var duration = 300
var delay = 300

class VideoAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isBlackInfoStripVisible: false,
    }
    this.count = 0
    this.facePoints = 0
    this.rightEye = 0
    this.leftEye = 0
    this.lips = 0
    this.afterFacePointsArrived = this.afterFacePointsArrived.bind(this)
  }

  componentDidMount() {
    this.afterFacePointsArrived()
  }

  componentDidUpdate() {
    if (
      this.props.animState &&
      this.count < 1 &&
      this.props.facePointsImgPath !== null &&
      this.props.facePoints !== null
    ) {
      this.count += 1

      setTimeout(() => {
        this.create()
      }, 1000)
      setTimeout(() => {
        this.setState({ isBlackInfoStripVisible: true })
        this.showPopup()
      }, 4000)
    }
  }

  showPopup() {
    this.state.notifi = notify(
      'Please do not close the tab before the interview is uploaded.',
      'warning',
      {
        layout: 'topRight',
        timeout: false,
        callback: {
          onClose: () => {},
        },
      }
    )
  }

  componentWillUnmount() {
    if (this.state.notifi) this.state.notifi.close()
  }

  afterFacePointsArrived() {
    let fp = this.props.facePoints
    if (fp === null || fp === '') {
      setTimeout(() => {
        this.afterFacePointsArrived()
      }, 500)
      return
    }

    if (fp.face_points === null || fp.face_points === '') {
      setTimeout(() => {
        this.afterFacePointsArrived()
      }, 500)
      return
    }

    var f = [],
      le = [],
      re = [],
      lips = []

    this.setState({ userPoints: JSON.parse(fp.face_points) }, () => {
      for (var i = 0; i < 17; i++) {
        f.push(this.state.userPoints[i])
      }
      for (var i = 36; i < 42; i++) {
        le.push(this.state.userPoints[i])
      }
      for (var i = 42; i < 48; i++) {
        re.push(this.state.userPoints[i])
      }
      for (var i = 48; i < 60; i++) {
        lips.push(this.state.userPoints[i])
      }

      this.facePoints = f
      this.leftEye = le
      this.rightEye = re
      this.lips = lips
    })
  }

  create() {
    svgContainer = d3
      .select('.userImageProcessing')
      .append('svg')
      .attr('id', 'main')
      .attr('width', width)
      .attr('height', height)
      .style('position', 'absolute')
      .style('opacity', 1)

    circles = svgContainer.selectAll('circle')

    this.startAnim()

    setInterval(() => {
      this.startAnim()
    }, this.facePoints.length * duration)
  }

  startAnim() {
    d3.selectAll('.facePoints').remove()
    d3.selectAll('.leftEyePoints').remove()
    d3.selectAll('.rightEyePoints').remove()
    d3.selectAll('.lipsPoints').remove()

    this.faceAnim()
    this.eyeAnim()
    this.lipAnim()
  }

  faceAnim() {
    circles
      .data(this.facePoints)
      .enter()
      .append('circle')
      .attr('class', 'facePoints')
      .attr('cx', (d, i) => {
        return d[0]
      })
      .attr('cy', (d, i) => {
        return d[1]
      })
      .attr('r', (d, i) => {
        return facePointSize
      })
      .attr('fill', faceColor)
      .style('opacity', 0)
      .transition()
      .delay((d, i) => {
        return i * delay
      })
      .duration(duration)
      .style('opacity', 1)
  }

  eyeAnim() {
    circles
      .data(this.leftEye)
      .enter()
      .append('circle')
      .attr('class', 'leftEyePoints')
      .attr('cx', (d, i) => {
        return d[0]
      })
      .attr('cy', (d, i) => {
        return d[1]
      })
      .attr('r', (d, i) => {
        return eyePointSize
      })
      .attr('fill', eyeColor)
      .style('opacity', 0)
      .transition()
      .delay((d, i) => {
        return i * delay
      })
      .duration(duration)
      .style('opacity', 1)

    circles
      .data(this.rightEye)
      .enter()
      .append('circle')
      .attr('class', 'rightEyePoints')
      .attr('cx', (d, i) => {
        return d[0]
      })
      .attr('cy', (d, i) => {
        return d[1]
      })
      .attr('r', (d, i) => {
        return eyePointSize
      })
      .attr('fill', eyeColor)
      .style('opacity', 0)
      .transition()
      .delay((d, i) => {
        return i * delay
      })
      .duration(duration)
      .style('opacity', 1)
  }

  lipAnim() {
    circles
      .data(this.lips)
      .enter()
      .append('circle')
      .attr('class', 'lipsPoints')
      .attr('cx', (d, i) => {
        return d[0]
      })
      .attr('cy', (d, i) => {
        return d[1]
      })
      .attr('r', (d, i) => {
        return lipsPointSize
      })
      .attr('fill', lipColor)
      .style('opacity', 0)
      .transition()
      .delay((d, i) => {
        return i * delay
      })
      .duration(duration)
      .style('opacity', 1)
  }

  render() {
    return (
      <div
        className="relative userImageProcessing"
        style={{ width: '640px', height: '480px', margin: '0 auto' }}>
        <img
          id="i1"
          className="absolute"
          style={{ width: '640px', height: '480px' }}
          src={this.props.facePointsImgPath}
          alt={`user interview`}
        />

        <canvas
          ref="canvas"
          width={640}
          height={480}
          style={{ position: 'absolute', display: 'none' }}
        />

        <div
          className={''}
          style={{
            transform: 'rotateY(180deg)',
            position: 'absolute',
            bottom: 0,
            textAlign: 'center',
            width: '100%',
          }}>
          <InterviewProcessing
            className={classNames({
              hidden: !this.state.isBlackInfoStripVisible,
              fadeInUp: this.state.isBlackInfoStripVisible,
            })}
            status="pending"
            noOfVideoSent={this.props.noOfVideoSent}
            noOfVideoProcessed={this.props.noOfVideoProcessed}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    facePointsImgPath: _.has(state.epPaths, 'facePointsImgPath')
      ? state.epPaths.facePointsImgPath
      : null,
    facePoints: state.epPaths.facePoints ? state.epPaths.facePoints : null,
    appIntKey: state.appIntKey.key,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoAnalysis)
