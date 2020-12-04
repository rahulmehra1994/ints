import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  log,
  common,
  competenciesDetected,
  right,
  wrong,
  mutuals,
} from './../../actions/commonActions'
import ReactHtmlParser from 'react-html-parser'

var classNames = require('classnames')
var Loader = require('react-loaders').Loader

class MultiInfoLine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showFull: false,
      showLess: true,
      chipsToShow: 2,
      defaultChipsNo: 2,
    }
  }

  showLess = () => {
    this.setState({ showLess: true })
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['competency'],
      event_type: 'click',
      event_description: `competency parameter ${this.props.data.label} contracted`,
    })
  }

  showMore = () => {
    this.setState({ showLess: false })
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['competency'],
      event_type: 'click',
      event_description: `competency parameter ${this.props.data.label} expanded`,
    })
  }

  labelIcon() {
    let { categories } = this.props.data
    if (_.has(this.props, 'additional') && categories.length === 0)
      return <span className="pl-1 pr-2">&#8212;</span>

    if (_.has(this.props, 'additional') && categories.length != 0) return right

    if (competenciesDetected(categories)) return right
    else return wrong
  }

  showAllChips() {
    let { categories } = this.props.data
    this.setState({ chipsToShow: categories.length })
  }

  showDefaultChips() {
    this.setState({ chipsToShow: this.state.defaultChipsNo })
  }

  render() {
    let { showLess, chipsToShow, defaultChipsNo } = this.state
    let { categories } = this.props.data
    let { tabIndex } = this.props

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
                // if (index >= chipsToShow) return null
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
              <span className="m-1 grey-color"> Not detected! </span>
            ) : null}

            <span className="absolute pin-t" style={{ right: 15 }}>
              {categories.length === 0 ? (
                <button
                  className="float-right onEnterFocusAda"
                  tabIndex={tabIndex}
                  aria-label={`open sample of ${this.props.data.label}`}
                  onClick={() => {
                    this.props.competencySamplesToggle(this.props.data.type)
                  }}>
                  <span className="bluePrimaryTxt text-14-demi">
                    View Samples
                  </span>
                </button>
              ) : null}

              {categories.length > 0 ? (
                <button
                  className={classNames(
                    'ml-2 text-18-normal rounded-full bg-grey-light onEnterFocusAda',
                    {
                      'ep-icon-expand-down': this.state.showLess,
                      'ep-icon-expand-up': !this.state.showLess,
                    }
                  )}
                  onClick={() => {
                    this.state.showLess ? this.showMore() : this.showLess()
                  }}
                  tabIndex={tabIndex}
                  aria-label={`click to show ${
                    this.state.showLess ? 'more' : 'less'
                  } of competency information`}
                />
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
              style={{ gridTemplateColumns: '1fr' }}>
              {/* <div className="text-14-demi">Keyword</div> */}
              <div className="text-14-demi pl-3">Information</div>
            </div>

            {this.props.data.content.map((item, i) => {
              return (
                <div
                  key={i}
                  className="grid mt-2"
                  style={{ gridTemplateColumns: '1fr' }}>
                  {/* <div className="text-14-med">{item.keyword}</div> */}
                  <div className="text-14-normal pl-4">
                    {/* {ReactHtmlParser(item.content)} */}
                    <span className="">-</span>
                    <span className="ml-1">{item.content}</span>
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
