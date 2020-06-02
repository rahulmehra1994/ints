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
  process.env.APP_PRODUCT_BASE_URL + '/dist/images/new/icons-big/feedback.svg'
const contentStrength =
  process.env.APP_PRODUCT_BASE_URL +
  '/dist/images/new/icons-big/content-strength-not-available.svg'

var Loader = require('react-loaders').Loader

class NoContent extends Component {
  constructor(props) {
    super(props)
    this.state = { loader: true, tabIndex: -1, pageHealthType: null }
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

  compToggle(comp) {
    this.setState({ [comp]: !this.state.comp })
  }

  render() {
    let { tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, concatData, userInfoEP } = this.props
    let vals,
      safeToRender = false

    if (!_.isEmpty(concatData)) {
      if (!_.isEmpty(concatData.appearance)) {
        safeToRender = true
        vals = concatData.appearance[0]
        this.trackFromRender(combinedRes.appearCombinedVal, vals)
      }
    }

    return (
      <div>
        {combinedRes !== null && safeToRender ? (
          <React.Fragment>
            <div
              id="start-of-content"
              role="main"
              className="clearfix information-content"
              tabIndex={common.tabIndexes.noContent}
              onKeyPress={e => {
                if (e.key === 'Enter' && tabIndex === -1) {
                  this.setState(
                    { tabIndex: common.tabIndexes.noContent },
                    () => {
                      try {
                        document
                          .querySelector(
                            '.information-content .onEnterFocusAda'
                          )
                          .focus()
                      } catch (e) {
                        console.error(e)
                      }
                    }
                  )
                }
              }}
              aria-label={`Information section. This section provides details to your performance. ${
                tabIndex === -1 ? 'Select to continue further' : ''
              }`}>
              <div className="p-10">
                <div className="text-center">
                  <img
                    src={contentStrength}
                    alt="content strength not availble"
                  />
                </div>
                <div className="mt-4 text-center paraHead">
                  Content strength not available for this question
                </div>
              </div>
              <hr />
              <div className="p-10">
                <div className="text-center">
                  <img src={feedback} alt="feedback" />
                </div>
                <div className="mt-4 text-center paraHead">
                  Get feedback from your peers on this interview
                </div>
                <div className="mt-4 text-center paraHead">
                  <span className="ep-icon-share bluePrimaryTxt"></span>
                  <span className="bluePrimaryTxt ml-6">
                    Share for Network Feedback
                  </span>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className="clearfix loaderWrap">
            <Loader
              type={compLoader.type}
              active
              style={{ transform: compLoader.scale }}
            />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  let combinedRes = null

  if (!_.isEmpty(state.results)) {
    if (state.results.appearanceResults) {
      combinedRes = state.results.appearanceResults
    }
  }

  return {
    combinedRes: combinedRes,
    common: state.commonStuff,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
    userInfoEP: state.userInfoEP,
    appIntKey: state.appIntKey.key,
    appearImgPath: _.has(state.epPaths, 'appearImgPath')
      ? state.epPaths.appearImgPath
      : null,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(NoContent)
