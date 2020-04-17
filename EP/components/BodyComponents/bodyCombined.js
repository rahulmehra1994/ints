import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals, common } from './../../actions/commonActions'
import { bodyMsgs } from './../messages/messages'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import { dispatchSetTabIndex } from './../../actions/actions'
import { DetailInfoHeader } from './../commons/DetailHeader'
import InfoBarComponent from './../commons/InfoBarComponent'
import TimelineVideos from './../commons/TimelineVideos'
import { PageHealth, pageHealthData } from './../commons/PageHealth'

var Loader = require('react-loaders').Loader

class BodyCombined extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      tabIndex: -1,
      pageHealthType: null,
    }
    this.pageHealthShowLogic = this.pageHealthShowLogic.bind(this)
  }

  pageHealthShowLogic() {
    let { concatData, combinedRes } = this.props
    let postureVals = concatData.body_posture_results[0]

    let temp = Number(postureVals.straight_lean_ahead_count).toFixed(2)

    if (concatData.face_not_detected_percent >= 10) {
      this.setState({ pageHealthType: 'notDetected' })
      return
    }

    if (temp > 90) {
      this.setState({ pageHealthType: 'goodJobState' })
      return
    }

    if (temp < 50) {
      this.setState({ pageHealthType: 'needsWorkState' })
      return
    }
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['body'],
      event_type: 'mount',
    })
  }

  trackFromRender = _.once((res, postureVals) => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['body'],
      event_type: 'render',
      event_description:
        'posture_combined_' +
        res +
        '_params_' +
        'erect_and_lean_forward_' +
        postureVals.straight_lean_ahead_result +
        '_slouch_' +
        postureVals.slouch_result +
        '_lean_backward_' +
        postureVals.lean_back_result,
    })
    this.pageHealthShowLogic()
  })

  render() {
    let { tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, concatData } = this.props
    let postureVals,
      safeToRender = false

    if (!_.isEmpty(concatData)) {
      if (!_.isEmpty(concatData.body_posture_results)) {
        safeToRender = true
        postureVals = concatData.body_posture_results[0]
      }
    }

    return (
      <div>
        {combinedRes !== null && safeToRender ? (
          <div>
            {this.trackFromRender(combinedRes.bodyCombinedVal, postureVals)}
            <NoDetectionAlert
              section={'nonVerbals'}
              concatData={concatData}
              tabIndex={tabIndex}
            />

            <div
              id="start-of-content"
              role="main"
              className="clearfix information-content"
              tabIndex={common.tabIndexes.body}
              onKeyPress={e => {
                if (e.key === 'Enter' && tabIndex === -1) {
                  this.setState({ tabIndex: common.tabIndexes.body }, () => {
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
              <DetailInfoHeader
                tabIndex={tabIndex}
                label={'Body Posture'}
                img={
                  process.env.APP_BASE_URL +
                  '/dist/images/new/icons-big/body-posture-big.svg'
                }
                alt={'body posture info'}
                color={sectionColor[combinedRes.bodyCombinedVal]}
                ariaLabel={`${
                  sectionStatus[combinedRes.bodyCombinedVal]
                } in body posture. ${bodyMsgs[combinedRes.bodyCombinedVal]}`}
                status={sectionStatus[combinedRes.bodyCombinedVal]}
                underMsg={bodyMsgs[combinedRes.bodyCombinedVal]}
              />

              <InfoBarComponent
                id="bodyPosture"
                label="Body Posture Duration"
                mainValue={postureVals.straight_lean_ahead_count}
                threshold={{
                  data: [{ value: 90 }],
                  underLabel: 'Min Required',
                }}
                bgColor={postureVals.straight_lean_ahead_result}
                barsAndLegends={[
                  {
                    label: 'Upright',
                    value: postureVals.straight,
                    color:
                      common.lightColor[postureVals.straight_lean_ahead_result],
                    valueModifier: () => {
                      let value = arguments[0]['value']
                      return Math.floor(value)
                    },
                  },
                  {
                    label: 'Lean Forward',
                    value: postureVals.lean_ahead,
                    color:
                      common.darkColor[postureVals.straight_lean_ahead_result],
                    valueModifier: () => {
                      let value = arguments[0]['value']
                      let mainValue = arguments[1]
                      return mainValue - Math.floor(value)
                    },
                  },
                ]}
                unit={'%'}
                category={'nonVerbals'}
              />

              <TimelineVideos
                heading={`Bad Posture duration - ${Math.ceil(
                  postureVals.lean_back + postureVals.over_lean_ahead
                )} %`}
                concatData={concatData}
                data={{
                  'Lean Backward': postureVals.clip_times.lean_back,
                  Slouch: postureVals.clip_times.slouch,
                }}
                unit={'clip'}
                emoji={{ type: 'bad' }}
              />

              <PageHealth
                data={pageHealthData['body']}
                state={this.state.pageHealthType}
                type={'nonVerbals'}
                label={'body posture'}
              />
            </div>
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
    if (state.results.bodyResults) {
      combinedRes = state.results.bodyResults
    }
  }

  return {
    combinedRes: combinedRes,
    common: state.commonStuff,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(BodyCombined)
