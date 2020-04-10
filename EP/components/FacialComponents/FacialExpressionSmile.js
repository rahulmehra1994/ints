import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { smileMsgs } from './../messages/messages'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import { mutuals, highContrast, common } from './../../actions/commonActions'
import { dispatchSetTabIndex } from './../../actions/actions'
import { DetailInfoHeader } from './../commons/DetailHeader'
import InfoBarComponent from './../commons/InfoBarComponent'
import TimelineVideos from './../commons/TimelineVideos'
import { PageHealth, pageHealthData } from './../commons/PageHealth'

const facialExpressionsBig =
  process.env.APP_BASE_URL +
  '/dist/images/new/icons-big/facial-expression-big.svg'

var Loader = require('react-loaders').Loader

class FacialExpressionSmile extends Component {
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
    let faceVals = concatData.facial_expression_results[0]

    if (concatData.face_not_detected_percent >= 10) {
      this.setState({ pageHealthType: 'notDetected' })
      return
    }

    if (combinedRes.faceCombinedVal === 0) {
      this.setState({ pageHealthType: 'goodJobState' })
      return
    }

    if (faceVals.smile_count === 0) {
      this.setState({ pageHealthType: 'needsWorkState' })
      return
    }
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['smile'],
      event_type: 'mount',
    })
  }

  trackFromRender = _.once(res => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['smile'],
      event_type: 'render',
      event_description: 'facial_expressions_combined_results_' + res,
    })
    this.pageHealthShowLogic()
  })

  render() {
    let { tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, concatData } = this.props
    let faceVals,
      safeToRender = false
    let negativeClipData = { stressed: [], surprise: [] }

    if (!_.isEmpty(concatData)) {
      if (
        !_.isEmpty(concatData.facial_expression_results) &&
        _.has(concatData, 'smile_track_points')
      ) {
        safeToRender = true
        faceVals = concatData.facial_expression_results[0]
        negativeClipData.stressed =
          concatData.smile_track_points.clip_times.frown
        negativeClipData.surprise =
          concatData.smile_track_points.clip_times.surprise
      }
    }

    return combinedRes !== null && safeToRender ? (
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
          tabIndex={common.tabIndexes.smile}
          aria-label={`Information section. This section provides details to your performance. ${
            tabIndex === -1 ? 'Select to continue further' : ''
          }`}
          onKeyPress={e => {
            if (e.key === 'Enter' && tabIndex === -1) {
              this.setState({ tabIndex: common.tabIndexes.smile }, () => {
                try {
                  document
                    .querySelector('.information-content .onEnterFocusAda')
                    .focus()
                } catch (e) {
                  console.error(e)
                }

                dispatchSetTabIndex(common.tabIndexes.smile)
              })
            }
          }}>
          <DetailInfoHeader
            tabIndex={tabIndex}
            label={'Facial Expressions'}
            img={facialExpressionsBig}
            alt={'Facial Expressions info'}
            color={sectionColor[combinedRes.faceCombinedVal]}
            ariaLabel={`${
              sectionStatus[combinedRes.faceCombinedVal]
            } in facial expressions. ${smileMsgs[combinedRes.faceCombinedVal]}`}
            status={sectionStatus[combinedRes.faceCombinedVal]}
            underMsg={smileMsgs[combinedRes.faceCombinedVal]}
          />

          {this.trackFromRender(sectionStatus[combinedRes.faceCombinedVal])}

          <InfoBarComponent
            id="positiveExpressions"
            label="Positive Expressions Count"
            mainValue={faceVals.smile_count}
            threshold={{
              data: [{ value: 4 }],
              underLabel: 'Min Required',
            }}
            bgColor={faceVals.positive_result}
            barsAndLegends={[
              {
                label: 'Smile',
                value: faceVals.smile_count,
                color: sectionColor[faceVals.positive_result],
              },
            ]}
            unit={'time'}
            category={'nonVerbals'}
          />

          <TimelineVideos
            concatData={concatData}
            data={{ smile: concatData.smile_track_points.clip_times.smile }}
            unit={'clip'}
            emoji={{ type: 'good' }}
          />

          {faceVals.negative_count > 0 ? (
            <InfoBarComponent
              id="stressedAndSurprised"
              label="Negative Expressions Count"
              mainValue={faceVals.negative_count}
              threshold={{
                data: [{ value: 1 }],
                underLabel: 'Max Allowed',
              }}
              bgColor={faceVals.negative_result}
              barsAndLegends={[
                {
                  label: 'Stressed',
                  value: faceVals.stressed_count,
                  color: common.lightColor[faceVals.negative_result],
                },
                {
                  label: 'Surprise',
                  value: faceVals.surp_count,
                  color: common.darkColor[faceVals.negative_result],
                },
              ]}
              unit={'time'}
              category={'nonVerbals'}
            />
          ) : null}

          <TimelineVideos
            concatData={concatData}
            data={negativeClipData}
            unit={'clip'}
            emoji={{ type: 'bad' }}
          />

          <PageHealth
            data={pageHealthData['facial']}
            state={this.state.pageHealthType}
            type={'nonVerbals'}
            label={'facial expressions'}
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
    )
  }
}

const mapStateToProps = state => {
  let combinedRes = null

  if (!_.isEmpty(state.results)) {
    if (state.results.faceResults) {
      combinedRes = state.results.faceResults
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacialExpressionSmile)
