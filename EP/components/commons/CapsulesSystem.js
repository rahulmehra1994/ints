import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals } from './../../actions/commonActions'
import { log, common } from './../../actions/commonActions'
import AsyncImage from './../Loading/asyncImage'
import { appearMsgs } from './../messages/messages'
import { DetailInfoHeader } from './../commons/DetailHeader'
import IsThereOrNotBox from './../commons/IsThereOrNotBox'
import { PageHealth, pageHealthData } from './../commons/PageHealth'

const feedback =
  process.env.APP_BASE_URL + '/dist/images/new/icons-big/feedback.svg'
const contentStrength =
  process.env.APP_BASE_URL +
  '/dist/images/new/icons-big/content-strength-not-available.svg'

var Loader = require('react-loaders').Loader

class CapsulesSystem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loader: true,
      tabIndex: -1,
      pageHealthType: null,
      capsulesCount: 0,
      capsulesShowLimit: 2,
      capsules: [
        { label: 'Problem Solving' },
        { label: 'Problem Solving 2' },
        { label: 'Problem Solving 3' },
        { label: 'Problem Solving 4' },
        { label: 'Problem Solving' },
        { label: 'Problem Solving 2' },
        { label: 'Problem Solving 3' },
        { label: 'Problem Solving 4' },
        { label: 'Problem Solving' },
        { label: 'Problem Solving 2' },
        { label: 'Problem Solving 3' },
        { label: 'Problem Solving 4' },
      ],
    }
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['appearance'],
      event_type: 'mount',
    })
  }

  componentWillReceiveProps(newProps) {
    if (this.props.expandOrCollapse !== newProps.expandOrCollapse) {
      if (newProps.expandOrCollapse) {
        this.setState({ capsulesShowLimit: 2 })
      } else {
        this.setState({ capsulesShowLimit: this.state.capsules.length })
      }
    }
  }

  capsulesBlock() {
    let temp = this.state.capsules.map((item, index) => {
      if (index < this.state.capsulesShowLimit) {
        return (
          <div className="capsule-status-icon">
            <span
              className="ep-icon-right-rounded text-18-normal"
              style={{ color: common.sectionColor[0] }}
            />
            <span className="ml-2">Problem Solving</span>
          </div>
        )
        return null
      }
    })

    return temp
  }

  render() {
    return (
      <div className="left-border-ball-ends" style={{ height: 200 }}>
        <div>
          {this.capsulesBlock()}

          {this.state.capsulesShowLimit <= 2 ? (
            <div className="capsule-status-icon">
              <span className="brand-blue-color">
                +{this.state.capsules.length}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(CapsulesSystem)
