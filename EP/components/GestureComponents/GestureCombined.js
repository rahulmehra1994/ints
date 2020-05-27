import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { gestureMsgs } from './../messages/messages'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import { log, mutuals, common } from './../../actions/commonActions'
import { DetailInfoHeader } from './../commons/DetailHeader'
import InfoBarComponent from './../commons/InfoBarComponent'
import TimelineVideos from './../commons/TimelineVideos'
import { PageHealth, pageHealthData } from './../commons/PageHealth'

const handGestureBig =
  process.env.APP_BASE_URL + '/dist/images/new/icons-big/hand-gestures-big.svg'
var Loader = require('react-loaders').Loader
var thresholdGoodState = 0
class GestureRighthand extends Component {
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

    if (concatData.face_not_detected_percent >= 10) {
      this.setState({ pageHealthType: 'notDetected' })
      return
    }

    if (combinedRes.gestCombinedVal === 0) {
      this.setState({ pageHealthType: 'goodJobState' })
      return
    }

    if (combinedRes.gestCombinedVal === 2) {
      this.setState({ pageHealthType: 'needsWorkState' })
      return
    }
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['gesture'],
      event_type: 'mount',
    })

    thresholdGoodState = this.props.epCustomizations.parameter_thresholds
      .gestures.hand_gesture
  }

  trackFromRender = _.once((res, handVals) => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['gesture'],
      event_type: 'render',
      event_description:
        'gesture_combined_results_' +
        res +
        '_params_left_hand_' +
        handVals.left_hand_detected +
        '_right_hand_' +
        handVals.right_hand_detected,
    })
    this.pageHealthShowLogic()
  })

  render() {
    let { tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, concatData } = this.props
    let handVals
    if (concatData !== null) {
      handVals = concatData.hand_gesture_results[0]
    }

    let safeToRender = false

    if (!_.isEmpty(concatData)) {
      if (
        _.has(concatData, 'left_hand_track_points') &&
        _.has(concatData, 'right_hand_track_points')
      ) {
        safeToRender = true
      }
    }

    return (
      <div>
        {combinedRes !== null && safeToRender ? (
          <div>
            <NoDetectionAlert
              section={'nonVerbals'}
              concatData={concatData}
              tabIndex={tabIndex}
            />

            <div
              id="start-of-content"
              role="main"
              className="clearfix information-content"
              tabIndex={common.tabIndexes.gesture}
              onKeyPress={e => {
                if (e.key === 'Enter' && tabIndex === -1) {
                  this.setState({ tabIndex: common.tabIndexes.gesture }, () => {
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
                label={'Hand Gestures'}
                img={handGestureBig}
                alt={'hand gesture info'}
                color={sectionColor[combinedRes.gestCombinedVal]}
                ariaLabel={`${
                  sectionStatus[combinedRes.gestCombinedVal]
                } in hand gesture. ${gestureMsgs[combinedRes.gestCombinedVal]}`}
                status={sectionStatus[combinedRes.gestCombinedVal]}
                underMsg={gestureMsgs[combinedRes.gestCombinedVal]}
              />

              <InfoBarComponent
                id="handGesture"
                label="Hand Gesture Duration"
                mainValue={handVals.either_hand_detected}
                threshold={{
                  data: [{ value: thresholdGoodState }],
                  underLabel: 'Min Required',
                }}
                bgColor={combinedRes.gestCombinedVal}
                barsAndLegends={[
                  {
                    label: 'Center',
                    value: handVals.either_hand_detected,
                    color: sectionColor[combinedRes.gestCombinedVal],
                  },
                ]}
                unit={'%'}
                category={'nonVerbals'}
              />

              {this.trackFromRender(
                sectionStatus[combinedRes.gestCombinedVal],
                handVals
              )}

              <TimelineVideos
                concatData={concatData}
                data={{
                  Gesture:
                    concatData.hand_gesture_results[0].clip_times.gesture,
                }}
                unit={'clip'}
                emoji={{ type: 'good' }}
              />

              <PageHealth
                data={pageHealthData['gesture']}
                state={this.state.pageHealthType}
                type={'nonVerbals'}
                label={'hand gestures'}
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
    if (state.results.handResults) {
      combinedRes = state.results.handResults
    }
  }

  return {
    combinedRes: combinedRes,
    common: state.commonStuff,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
    epCustomizations: state.epCustomizations,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(GestureRighthand)
