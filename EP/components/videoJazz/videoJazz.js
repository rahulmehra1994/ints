import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { log } from './../../actions/commonActions'
// import api from './../../modules/services/api'
import api from '@vmockinc/dashboard/services/api'
import _ from 'underscore'
import {
  counters,
  apiCallAgain,
  fetchFacePointsImg,
} from './../../actions/apiActions'
import InterviewProcessing from './../interview/Interview_processing'

var classNames = require('classnames')

var circle = {
  startRadius: 100,
  radius: 50,
  maxRadius: 300,
  x: 320,
  y: 320,
  animationInterval: '',
  intervalCount: '',
  timestep: 16.6,
  animationSpeed: 1 / 100,
  angle: 0,
  centerX: 320,
  centerY: 240,
}

class VideoAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offset: 0,
      offsetLeftJaw: 50,
      offsetRightJaw: 50,
      offsetJaw: 300,
      offsetEye: 300,
      offsetLips: 350,
      offsetY: 31,
      offsetCenterJaw: 31,
      img: '',
      facePoints: [],
      rightEye: [],
      leftEye: [],
      lips: [],
      count: 0,
      everythingHasArrived: 0,
      facePointCount: 0,
      fetchUserImageCount: 0,
    }
  }

  componentDidMount() {
    this.fetchUserImage()
    this.fetchUserfacePoints()
  }

  componentDidUpdate() {
    if (
      this.props.animState === true &&
      this.state.count < 1 &&
      this.state.everythingHasArrived >= 2
    ) {
      this.setState({ count: ++this.state.count }, () => {
        this.init()
      })
    }
  }

  drawCircle(x, y, size = 2, color = 'lime') {
    this.state.ctx.beginPath()
    this.state.ctx.arc(x - this.state.offset, y, size, 0, 2 * Math.PI)
    this.state.ctx.fillStyle = color
    this.state.ctx.fill()
  }

  drawCircle2(x, y, size = 2, color = 'lime') {
    this.state.ctx.beginPath()
    this.state.ctx.arc(x - this.state.offset, y, size, 0, 2 * Math.PI)
    this.state.ctx.fillStyle = color
    this.state.ctx.fill()
  }

  fetchUserfacePoints() {
    let fd1 = new FormData()
    fd1.append('interview_key', window.localStorage.getItem('interview_key'))

    api
      .service('ep')
      .post(`/processing_frame_face_points`, fd1, {
        processData: false,
        contentType: false,
      })
      .done(data => {
        this.setState({
          everythingHasArrived: ++this.state.everythingHasArrived,
        })
        var f = []
        var le = []
        var re = []
        var lips = []

        this.setState({ userPoints: JSON.parse(data.face_points) }, () => {
          log('userpoints ', '', this.state.userPoints)
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

          this.setState({
            facePoints: f,
            leftEye: le,
            rightEye: re,
            lips: lips,
          })
        })
      })
      .fail(xhr => {
        apiCallAgain(
          counters,
          'facePointCount',
          () => {
            this.fetchUserfacePoints()
          },
          1000,
          10,
          xhr
        )

        log(
          '%c Api faliure /processing_frame_face_points',
          'background: red; color: white',
          xhr
        )
      })
  }

  fetchUserImage() {
    fetchFacePointsImg()
    this.setState({
      everythingHasArrived: ++this.state.everythingHasArrived,
    })
  }

  init() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    var speed = 6
    this.setState({ ctx: ctx }, () => {
      var m = setInterval(() => {
        if (this.state.offsetJaw > 0) {
          this.setState({ offsetJaw: (this.state.offsetJaw -= 1) })
        }

        if (this.state.offsetEye > 0) {
          this.setState({ offsetEye: (this.state.offsetEye -= 1) })
        }

        if (this.state.offsetLips > 0) {
          this.setState({ offsetLips: (this.state.offsetLips -= 1) })
        } else {
          clearInterval(mi)
          clearInterval(m)
          this.circleSpin()
        }
      }, speed)

      var mi = setInterval(() => {
        this.state.ctx.clearRect(0, 0, 640, 480)
        //this.state.ctx.drawImage(this.state.img, 0, 0);

        this.state.facePoints.map((item, index) => {
          if (index < 6) {
            this.drawCircle(item[0] - this.state.offsetJaw, item[1])
          }
          if (index > 10) {
            this.drawCircle(item[0] + this.state.offsetJaw, item[1])
          }
          if (index >= 6 && index <= 10) {
            this.drawCircle(item[0], item[1] + this.state.offsetJaw)
          }
        })

        this.state.leftEye.map((item, index) => {
          if (index < 3) {
            this.drawCircle(item[0], item[1] - this.state.offsetEye)
          }
          if (index >= 3) {
            this.drawCircle(item[0], item[1] + this.state.offsetEye)
          }
        })

        this.state.rightEye.map((item, index) => {
          //count no of eyes
          if (index < 3) {
            this.drawCircle(item[0], item[1] - this.state.offsetEye)
          }
          if (index >= 3) {
            this.drawCircle(item[0], item[1] + this.state.offsetEye)
          }
        })

        this.state.lips.map((item, index) => {
          if (index < 3 || index > 8) {
            this.drawCircle(item[0] - this.state.offsetLips, item[1])
          } else {
            this.drawCircle(item[0] + this.state.offsetLips, item[1])
          }
        })
      }, speed)
    })
  }

  circleSpin() {
    var centerFaceX = this.state.lips[3][0]
    var centerFaceY = (this.state.leftEye[3][1] + this.state.rightEye[0][1]) / 2
    var x1 = this.state.facePoints[8][0]
    var y1 = this.state.facePoints[8][1]
    var radius = Math.hypot(centerFaceX - x1, centerFaceY - y1)
    var myColor = '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    myColor = 'white'

    setInterval(() => {
      this.state.ctx.clearRect(0, 0, 640, 480)
      //this.state.ctx.drawImage(this.state.img, 0, 0);

      this.state.facePoints.map((item, index) => {
        this.drawCircle(
          centerFaceX + Math.cos(circle.angle) * radius,
          centerFaceY + Math.sin(circle.angle) * radius,
          3,
          myColor
        )

        circle.angle += 0.6
      })

      this.state.leftEye.map((item, index) => {
        if (index < 3) {
          this.drawCircle(item[0], item[1] - this.state.offsetEye)
        }
        if (index >= 3) {
          this.drawCircle(item[0], item[1] + this.state.offsetEye)
        }
      })

      this.state.rightEye.map((item, index) => {
        //count no of eyes
        if (index < 3) {
          this.drawCircle(item[0], item[1] - this.state.offsetEye)
        }
        if (index >= 3) {
          this.drawCircle(item[0], item[1] + this.state.offsetEye)
        }
      })

      this.state.lips.map((item, index) => {
        if (index < 3 || index > 8) {
          this.drawCircle(item[0] - this.state.offsetLips, item[1])
        } else {
          this.drawCircle(item[0] + this.state.offsetLips, item[1])
        }
      })
    }, 90)
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
          alt={`user interview image`}
        />
        <canvas
          ref="canvas"
          width={640}
          height={480}
          style={{ position: 'absolute' }}
        />

        <InterviewProcessing
          status="pending"
          noOfVideoSent={this.props.totalsent}
          noOfVideoProcessed={this.props.totalprocessed}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    facePointsImgPath: _.has(state.epPaths, 'facePointsImgPath')
      ? state.epPaths.facePointsImgPath
      : null,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoAnalysis)
