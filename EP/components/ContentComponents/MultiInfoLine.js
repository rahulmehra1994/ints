import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals } from './../../actions/commonActions'
import {
  log,
  common,
  competenciesDetected,
  right,
  wrong,
} from './../../actions/commonActions'

const feedback =
  process.env.APP_PRODUCT_BASE_URL + '/dist/images/new/icons-big/feedback.svg'
const contentStrength =
  process.env.APP_PRODUCT_BASE_URL +
  '/dist/images/new/icons-big/content-strength-not-available.svg'

var Loader = require('react-loaders').Loader

class MultiInfoLine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: mutuals.deepCopy(props.data.categories),
      categoriesCopy: mutuals.deepCopy(props.data.categories),
      showFull: false,
      showLess: true,
    }
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['competency'],
      event_type: 'mount',
    })

    log('competency props => ', this.props, this.state)
  }

  showLess = () => {
    this.setState({ showLess: true, chipsLength: 3 })
  }

  showMore = () => {
    this.setState({ showLess: false, chipsLength: 3 })
  }

  labelIcon() {
    if (_.has(this.props, 'additional') && this.state.categories.length === 0)
      return <span className="pl-1 pr-2">&#8212;</span>
    if (_.has(this.props, 'additional') && this.state.categories.length != 0)
      return right
    let { categories } = this.state
    if (competenciesDetected(categories)) return right
    else return wrong
  }

  render() {
    let { categories, categoriesCopy } = this.state

    return (
      <div
        className="py-4 grid border-b"
        style={{ gridTemplateColumns: '200px 1fr' }}>
        <div className="flex items-center">
          {this.labelIcon()}

          <span className="ml-4 text-14-med">{this.props.data.label}</span>
        </div>
        <div className="relative" style={{ paddingRight: 100 }}>
          {categories.map((item, index) => {
            if (this.state.showLess && index > 2) return null
            return (
              <div
                key={index}
                className="m-1 py-1 px-2 inline-block"
                style={{ background: common.lightBgColor[0] }}>
                <span
                  className="ep-icon-right-rounded text-18-normal align-text-bottom"
                  style={{ color: common.sectionColor[0] }}
                />
                <span className="ml-2 text-14-normal">{item}</span>
              </div>
            )
          })}

          {categoriesCopy.length === 0 ? (
            <span className="grey-color"> Not detected! </span>
          ) : null}

          <span className="absolute pin-r pin-t">
            {categoriesCopy.length === 0 ? (
              <button
                className="float-right"
                onClick={this.props.sentenceSamplesToggle}>
                <span className="bluePrimaryTxt text-14-demi">
                  View Samples
                </span>
              </button>
            ) : null}

            {categories.length > 3 ? (
              this.state.showLess ? (
                <div>
                  <span className="bluePrimaryTxt">3+</span>
                  <span
                    className="ml-2 ep-icon-expand-down text-18-normal rounded-full bg-grey-light"
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
          </span>
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
