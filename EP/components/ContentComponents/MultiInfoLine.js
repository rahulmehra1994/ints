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
import ReactHtmlParser from 'react-html-parser'

var classNames = require('classnames')
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
      showFull: false,
      showLess: true,
    }
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['competency'],
      event_type: 'mount',
    })
  }

  showLess = () => {
    this.setState({ showLess: true })
  }

  showMore = () => {
    this.setState({ showLess: false })
  }

  labelIcon() {
    let { categories } = this.props.data
    if (_.has(this.props, 'additional') && categories.length === 0)
      return <span className="pl-1 pr-2">&#8212;</span>

    if (_.has(this.props, 'additional') && categories.length != 0) return right

    if (competenciesDetected(categories)) return right
    else return wrong
  }

  render() {
    let { showLess } = this.state
    let { categories } = this.props.data

    return (
      <section
        className="py-4 border-b"
        style={{ background: showLess ? 'initial' : '#f7f7f7' }}>
        <div className="grid" style={{ gridTemplateColumns: '200px 1fr' }}>
          <div className="flex items-center pl-2">
            {this.labelIcon()}

            <span className="ml-4 text-14-med">{this.props.data.label}</span>
          </div>
          <div className="relative" style={{ paddingRight: 100 }}>
            {this.state.showLess &&
              categories.map((item, index) => {
                if (index > 2) return null
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

            {categories.length === 0 ? (
              <span className="grey-color"> Not detected! </span>
            ) : null}

            <span className="absolute pin-t" style={{ right: 15 }}>
              {categories.length === 0 ? (
                <button
                  className="float-right"
                  onClick={() => {
                    this.props.sentenceSamplesToggle(this.props.data.type)
                  }}>
                  <span className="bluePrimaryTxt text-14-demi">
                    View Samples
                  </span>
                </button>
              ) : null}

              {categories.length > 0 ? (
                this.state.showLess ? (
                  <div>
                    {categories.length > 2 ? (
                      <span className="bluePrimaryTxt">2+</span>
                    ) : null}
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

        {this.state.showLess ? null : (
          <div
            className={classNames('mt-6', {
              'bg-white mx-4 p-5 shadow-1': !this.state.showLess,
            })}>
            <div className="text-14-demi">Detected Categories</div>

            <div className="mt-2">
              {categories.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="mr-1 mb-1 py-1 px-2 inline-block"
                    style={{ background: common.lightBgColor[0] }}>
                    <span
                      className="ep-icon-right-rounded text-18-normal align-text-bottom"
                      style={{ color: common.sectionColor[0] }}
                    />
                    <span className="ml-2 text-14-normal">{item}</span>
                  </div>
                )
              })}
            </div>

            <div
              className="grid mt-3 py-2 border-t border-b"
              style={{ gridTemplateColumns: '200px 1fr' }}>
              <div className="text-14-demi">Keyword</div>
              <div className="text-14-demi">Sentence</div>
            </div>

            {this.props.data.content.map((item, i) => {
              return (
                <div
                  key={i}
                  className="grid mt-2"
                  style={{ gridTemplateColumns: '200px 1fr' }}>
                  <div className="text-14-med">{item.keyword}</div>
                  <div className="text-14-normal">
                    {ReactHtmlParser(item.content)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
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
