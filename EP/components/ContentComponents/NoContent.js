import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals } from './../../actions/commonActions'
import { log, common } from './../../actions/commonActions'
const feedback =
  process.env.APP_BASE_URL + '/dist/images/new/icons-big/feedback.svg'
const contentStrength =
  process.env.APP_BASE_URL +
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
    // mutuals.socketTracking({
    //   curr_page: mutuals.urlEnds['appearance'],
    //   event_type: 'render',
    //   event_description:
    //     'appear_combined_' +
    //     res +
    //     '_params_' +
    //     '_tie_' +
    //     vals.tie +
    //     '_suit_' +
    //     vals.suit,
    // })
  })

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
          <div
            id="start-of-content"
            role="main"
            className="clearfix information-content"
            tabIndex={common.tabIndexes.noContent}
            onKeyPress={e => {
              if (e.key === 'Enter' && tabIndex === -1) {
                this.setState({ tabIndex: common.tabIndexes.noContent }, () => {
                  try {
                    document
                      .querySelector('.information-content .onEnterFocusAda')
                      .focus()
                  } catch (e) {
                    console.error(e)
                  }
                })
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
              <div className="mt-4 text-center text-14-demi">
                Content strength not available for this question
              </div>
            </div>
            {this.props.userCustomizations.isNfEnabled ? (
              <div>
                <hr />
                <div className="p-10">
                  <div className="text-center">
                    <img src={feedback} alt="feedback" />
                  </div>
                  <div className="mt-4 text-center text-18-demi">
                    Get feedback from coaches and peers on this interview
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="ep-icon-share bluePrimaryTxt text-20-normal"></span>
                    <span className="bluePrimaryTxt text-14-demi ml-6">
                      Share for Network Feedback
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
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
    intQuestionId: state.interviewEP.intQuestionId,
    userCustomizations: state.user.data,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(NoContent)
