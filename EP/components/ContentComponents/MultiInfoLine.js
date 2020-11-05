import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals } from './../../actions/commonActions'
import { log, common } from './../../actions/commonActions'

const feedback =
  process.env.APP_PRODUCT_BASE_URL + '/dist/images/new/icons-big/feedback.svg'
const contentStrength =
  process.env.APP_PRODUCT_BASE_URL +
  '/dist/images/new/icons-big/content-strength-not-available.svg'

var Loader = require('react-loaders').Loader

class MultiInfoLine extends Component {
  constructor(props) {
    super(props)
    this.state = { tags: [1, 2, 3, 4, 5], showFull: false, showLess: true }
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['appearance'],
      event_type: 'mount',
    })
  }

  trackFromRender = _.once((res, vals) => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['appearance'],
      event_type: 'render',
      event_description:
        'appear_combined_' +
        res +
        '_params_' +
        '_tie_' +
        vals.tie +
        '_suit_' +
        vals.suit,
    })
  })

  showLess = () => {
    this.setState({ showLess: true, chipsLength: 3 })
  }

  showMore = () => {
    this.setState({ showLess: false, chipsLength: 3 })
  }

  render() {
    return (
      <div
        className="grid border-b"
        style={{ gridTemplateColumns: '150px 1fr 75px' }}>
        <div className="flex items-center">
          <span
            className="ep-icon-close text-18-demi"
            style={{ color: common.sectionColor[2] }}
          />

          <span className="ml-4 text-18-med">Teamwork</span>
        </div>
        <div className="">
          {this.state.tags.map((item, index) => {
            if (this.state.showLess && index > 2) return null
            return (
              <div
                className="m-1 py-1 px-2 inline-block"
                style={{ background: common.lightBgColor[0] }}>
                <span
                  className="ep-icon-right-rounded text-18-normal"
                  style={{ color: common.sectionColor[0] }}
                />
                <span className="ml-2">Conflict Management</span>
              </div>
            )
          })}
        </div>

        <div className="text-right">
          {this.state.tags.length > 3 ? (
            this.state.showLess ? (
              <div>
                <span className="bluePrimaryTxt">3+</span>
                <span
                  className="ep-icon-expand-down text-18-normal rounded-full bg-grey-light"
                  onClick={this.showMore}
                />
              </div>
            ) : (
              <span
                className="ep-icon-expand-up text-18-normal rounded-full bg-grey-light"
                onClick={this.showLess}
              />
            )
          ) : null}

          {true ? (
            <div onClick={this.props.sentenceSamplesToggle}>
              <span className="hintColor"> - not detected - </span>

              <span className="bluePrimaryTxt float-right text-18-normal">
                <span className="ep-icon-info-filled" />
                <span className="ml-2">Insights</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(MultiInfoLine)
