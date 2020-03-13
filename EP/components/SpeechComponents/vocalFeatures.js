import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals, common } from './../../actions/commonActions'
import { vocalMsgs } from './../messages/messages'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import { DetailInfoHeader } from './../commons/DetailHeader'
import InfoBarComponent from './../commons/InfoBarComponent'

import { PageHealth, pageHealthData } from './../commons/PageHealth'

const vocalFeaturesBig =
  process.env.APP_BASE_URL + '/dist/images/new/icons-big/vocal-features-big.svg'
var Loader = require('react-loaders').Loader

class SpeechPitch extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      tabIndex: -1,
      pageHealthType: null,
      speechRateBlock: false,
      pitchBlock: false,
    }
    this.pageHealthShowLogic = this.pageHealthShowLogic.bind(this)
  }

  pageHealthShowLogic() {
    let { transcript } = this.props

    if (
      transcript.punctuated_transcript_cleaned !== -1 &&
      (transcript.punctuated_transcript_cleaned === '' ||
        transcript.punctuated_transcript_cleaned === 'null' ||
        transcript.punctuated_transcript_cleaned === 'null ')
    ) {
      this.setState({ pageHealthType: 'notDetected' })
      return
    }
  }

  pageHealthShowLogicActivate = _.once(() => {
    this.pageHealthShowLogic()
  })

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['vocal'],
      event_type: 'mount',
    })
  }

  trackFromRender = _.once((res, pitchRes, intensityRes, wpmRes) => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['vocal'],
      event_type: 'render',
      event_description:
        'vocal_features_combined_' +
        res +
        '_params_' +
        '_pitch_' +
        pitchRes +
        '_intensity_' +
        intensityRes +
        '_wpm_' +
        wpmRes,
    })
  })

  speechRateMount = _.once(() => {
    setTimeout(() => {
      this.setState({ speechRateBlock: true })
    }, 200)
  })

  pitchMount = _.once(() => {
    setTimeout(() => {
      this.setState({ pitchBlock: true })
    }, 400)
  })

  render() {
    let { tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, gentleData } = this.props

    let vocalVals,
      pitchRes,
      intensityRes,
      wpmRes,
      safeToRender = false

    if (!_.isEmpty(gentleData)) {
      if (!_.isEmpty(gentleData.sound_results)) {
        pitchRes = mutuals.validKey(gentleData.sound_results, 'pitch_result')
        intensityRes = mutuals.validKey(
          gentleData.sound_results,
          'intensity_result'
        )
        wpmRes = mutuals.validKey(gentleData.sound_results, 'wpm_result')

        if (gentleData.sound_results['sound_results_individual'].length > 0) {
          safeToRender = true
          vocalVals = gentleData.sound_results['sound_results_individual'][0]
        }
      }
    }

    return (
      <div>
        {combinedRes !== null && gentleData !== null ? (
          <div>
            {this.pageHealthShowLogicActivate()}
            <NoDetectionAlert
              info={'No speech was detected in the interview.'}
              section={'verbals'}
              tabIndex={tabIndex}
            />

            <div
              id="start-of-content"
              role="main"
              className="clearfix information-content vocal"
              tabIndex={common.tabIndexes.vocal}
              onKeyPress={e => {
                if (e.key === 'Enter' && tabIndex === -1) {
                  this.setState({ tabIndex: common.tabIndexes.vocal }, () => {
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
                label={'Vocal Features'}
                img={vocalFeaturesBig}
                alt={'vocal features info'}
                color={sectionColor[combinedRes.vocalCombinedVal]}
                ariaLabel={`${
                  sectionStatus[combinedRes.vocalCombinedVal]
                } in vocal features. ${
                  vocalMsgs[combinedRes.vocalCombinedVal]
                }`}
                status={sectionStatus[combinedRes.vocalCombinedVal]}
                underMsg={vocalMsgs[combinedRes.vocalCombinedVal]}
              />

              {this.trackFromRender(
                sectionStatus[combinedRes.vocalCombinedVal],
                pitchRes,
                intensityRes,
                wpmRes
              )}

              <InfoBarComponent
                id="intensity"
                label="Intensity"
                mainValue={vocalVals.intensity}
                threshold={{
                  data: [{ value: 65 }, { value: 75 }],
                  underLabel: 'Good range',
                }}
                bgColor={intensityRes}
                barsAndLegends={[
                  {
                    label: 'Intensity',
                    value: vocalVals.intensity,
                    color: sectionColor[intensityRes],
                  },
                ]}
                unit={'Db'}
                category={'verbals'}
                barEnds={{ left: 'Soft voice', right: 'Loud voice' }}
              />

              {this.speechRateMount()}

              {this.state.speechRateBlock ? (
                <InfoBarComponent
                  id="speechRate"
                  label="Speech Rate"
                  mainValue={vocalVals.wpm}
                  threshold={{
                    data: [{ value: 110 }, { value: 140 }],
                    underLabel: 'Good range',
                  }}
                  bgColor={wpmRes}
                  barsAndLegends={[
                    {
                      label: 'Speech Rate',
                      value: vocalVals.wpm,
                      color: sectionColor[wpmRes],
                    },
                  ]}
                  unit={'wpm'}
                  category={'verbals'}
                  barEnds={{ left: 'Slow speed', right: 'Fast speed' }}
                />
              ) : null}

              {this.pitchMount()}

              {this.state.pitchBlock ? (
                <InfoBarComponent
                  id="pitch"
                  label="Pitch"
                  mainValue={vocalVals.pitch}
                  threshold={{
                    data: [{ value: 85 }, { value: 255 }],
                    underLabel: 'Good range',
                  }}
                  bgColor={pitchRes}
                  barsAndLegends={[
                    {
                      label: 'Pitch',
                      value: vocalVals.pitch,
                      color: sectionColor[pitchRes],
                    },
                  ]}
                  unit={'Hz'}
                  category={'verbals'}
                  barEnds={{ left: 'Deep voice', right: 'Shrill voice' }}
                />
              ) : null}

              <PageHealth
                data={pageHealthData['vocal']}
                state={this.state.pageHealthType}
                label={'vocal features'}
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
    if (state.results.vocalResults) {
      combinedRes = state.results.vocalResults
    }
  }

  return {
    combinedRes: combinedRes,
    common: state.commonStuff,
    gentleData: !_.isEmpty(state.gentleResults) ? state.gentleResults : null,
    transcript: state.transcript,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeechPitch)
