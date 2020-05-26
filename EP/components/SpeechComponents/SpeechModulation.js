import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals, common } from './../../actions/commonActions'
import { modulationMsgs } from './../messages/messages'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import { DetailInfoHeader } from './../commons/DetailHeader'
import IsThereOrNotBox from './../commons/IsThereOrNotBox'
import { PageHealth, pageHealthData } from './../commons/PageHealth'

const modualtionBig =
  process.env.APP_BASE_URL +
  '/dist/images/new/icons-big/speech-modulation-big.svg'
var Loader = require('react-loaders').Loader

class SpeechModulation extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      tabIndex: -1,
      pageHealthType: null,
    }
    this.pageHealthShowLogic = this.pageHealthShowLogic.bind(this)
  }

  pageHealthShowLogic(timelineVideoShow) {
    let { combinedRes, transcript } = this.props

    if (
      transcript.punctuated_transcript_cleaned !== -1 &&
      (transcript.punctuated_transcript_cleaned === '' ||
        transcript.punctuated_transcript_cleaned === 'null' ||
        transcript.punctuated_transcript_cleaned === 'null ')
    ) {
      this.setState({ pageHealthType: 'notDetected' })
      return
    }

    if (combinedRes.modulationCombinedVal === 0) {
      this.setState({ pageHealthType: 'goodJobState' })
      return
    }

    if (combinedRes.modulationCombinedVal === 2) {
      this.setState({ pageHealthType: 'needsWorkState' })
      return
    }
  }

  pageHealthShowLogicActivate = _.once(() => {
    this.pageHealthShowLogic()
  })
  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['modulation'],
      event_type: 'mount',
    })
  }

  trackFromRender = _.once((res, pitchRes, pauseRes) => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['modulation'],
      event_type: 'render',
      event_description:
        'modulation_combined_' +
        res +
        '_params_' +
        '_modulation_using_pitch_' +
        pitchRes +
        '_modulation_using_pause_' +
        pauseRes,
    })
  })

  render() {
    let { tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, gentleData } = this.props
    let pitchRes,
      pauseRes,
      safeToRender = false

    if (!_.isEmpty(gentleData)) {
      if (!_.isEmpty(gentleData.articulation)) {
        if (
          _.has(gentleData.articulation, 'pitch_modulation_result') &&
          _.has(gentleData.articulation, 'pause_modulation_result')
        ) {
          pitchRes = mutuals.validKey(
            gentleData.articulation,
            'pitch_modulation_result'
          )
          pauseRes = mutuals.validKey(
            gentleData.articulation,
            'pause_modulation_result'
          )
          safeToRender = true
        }
      }
    }
    return (
      <div>
        {combinedRes !== null && safeToRender ? (
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
              className=" clearfix information-content"
              tabIndex={common.tabIndexes.modulation}
              onKeyPress={e => {
                if (e.key === 'Enter' && tabIndex === -1) {
                  this.setState(
                    { tabIndex: common.tabIndexes.modulation },
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
              <DetailInfoHeader
                tabIndex={tabIndex}
                label={'Speech Modulation'}
                img={modualtionBig}
                alt={'speech modualtion'}
                color={sectionColor[combinedRes.modulationCombinedVal]}
                ariaLabel={`${
                  sectionStatus[combinedRes.modulationCombinedVal]
                } in speech modulation. ${
                  modulationMsgs[combinedRes.modulationCombinedVal]
                }`}
                status={sectionStatus[combinedRes.modulationCombinedVal]}
                underMsg={modulationMsgs[combinedRes.modulationCombinedVal]}
              />

              {this.trackFromRender(
                sectionStatus[combinedRes.modulationCombinedVal],
                pitchRes,
                pauseRes
              )}

              <div className="grid-2-cols mt-8" style={{ gridGap: 6 }}>
                <IsThereOrNotBox
                  head="Pitch Modulation"
                  value={pitchRes}
                  category={'verbals'}
                  callback={mutuals.findAbsentOrPresent}
                  description={'this is descrition'}
                />
                <IsThereOrNotBox
                  head="Pauses Modulation"
                  value={pauseRes}
                  category={'verbals'}
                  callback={mutuals.findAbsentOrPresent}
                  description={'this is descrition'}
                />
              </div>

              <PageHealth
                data={pageHealthData['modulation']}
                state={this.state.pageHealthType}
                label={'speech modulation'}
              />
            </div>
          </div>
        ) : (
          <div className="clearfix loaderWrap ">
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
    if (state.results.modulationResults) {
      combinedRes = state.results.modulationResults
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

export default connect(mapStateToProps, mapDispatchToProps)(SpeechModulation)
