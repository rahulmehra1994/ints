import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals, common } from './../../actions/commonActions'
import {
  pausesMsgsMain,
  msgsPauses,
  msgsSentence,
} from './../messages/messages'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import CustomPlayPause from '../utilities/CustomPlayPause'
import CustomMuteUnmute from '../utilities/CustomMuteUnmute'
import { Media, Player, controls } from 'react-media-player'
import { DetailInfoHeader } from './../commons/DetailHeader'

import InfoBarComponent from './../commons/InfoBarComponent'

import TimelineAudio from './../commons/TimelineAudio'
import { PageHealth, pageHealthData } from './../commons/PageHealth'

const appropriateBig =
  process.env.APP_PRODUCT_BASE_URL +
  '/dist/images/new/icons-big/appropriate-pauses-big.svg'

const { SeekBar } = controls
var Loader = require('react-loaders').Loader
const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

class SpeechAnalysis extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      msgToUser: '',
      usercolor: '',
      tabIndex: -1,
      toggleShortPauses: new Array(100).fill(false),
      toggleMediumPauses: new Array(100).fill(false),
      toggleLongPauses: new Array(100).fill(false),
      smallPauseAudioLoader: new Array(100).fill(true),
      mediumPauseAudioLoader: new Array(100).fill(true),
      longPauseAudioLoader: new Array(100).fill(true),
      pageHealthType: null,
    }

    this.safeToRender = false
    this.pageHealthShowLogic = this.pageHealthShowLogic.bind(this)
  }

  pageHealthShowLogic() {
    let { gentleData, combinedRes, transcript } = this.props

    if (
      transcript.punctuated_transcript_cleaned !== -1 &&
      (transcript.punctuated_transcript_cleaned === '' ||
        transcript.punctuated_transcript_cleaned === 'null' ||
        transcript.punctuated_transcript_cleaned === 'null ')
    ) {
      this.setState({ pageHealthType: 'notDetected' })
      return
    }

    if (combinedRes.pauseCombinedVal === 0) {
      this.setState({ pageHealthType: 'goodJobState' })
      return
    }

    if (combinedRes.pauseCombinedVal === 2) {
      this.setState({ pageHealthType: 'needsWorkState' })
      return
    }
  }

  pageHealthShowLogicActivate = _.once(() => {
    this.pageHealthShowLogic()
  })

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['pauses'],
      event_type: 'mount',
    })
    mutuals.ariaLabelAddOnAudioSeekbar.call(this)
  }

  trackFromRender = _.once((res, pauseRes, sentenceRes) => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['pauses'],
      event_type: 'render',
      event_description:
        'appropriate_pauses_combined_' +
        res +
        '_params_' +
        '_no_of_pauses_' +
        pauseRes +
        '_no_of_sentences_' +
        sentenceRes,
    })
  })

  separatePauses(arr) {
    let shortPauses = arr.filter((item, index) => {
      return item.type === 3
    })
    let mediumPauses = arr.filter((item, index) => {
      return item.type === 2
    })
    let longPauses = arr.filter((item, index) => {
      return item.type === 1
    })
    return { shortPauses, mediumPauses, longPauses }
  }

  onAudioEvent(id, event) {
    let audios = document.getElementsByTagName('audio')

    for (let i = 0; i < audios.length; i++) {
      if (audios[i].id !== id) audios[i].pause()
    }

    trackingDebounceSmall({
      event_type: 'click',
      event_description: `EP pauses audio ${event}`,
    })
  }

  mediumPauseMount = _.once(() => {
    setTimeout(() => {
      this.setState({ mediumPauseBlock: true })
    }, 200)
  })

  longPauseMount = _.once(() => {
    setTimeout(() => {
      this.setState({ longPauseBlock: true })
    }, 400)
  })

  render() {
    let {
      tabIndex,
      toggleShortPauses,
      toggleMediumPauses,
      toggleLongPauses,
    } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, gentleData } = this.props
    let sentVals, pauseVals, pauseRes, sentenceRes

    let pauseClips = []
    let separatedClips = { shortPauses: [], mediumPauses: [], longPauses: [] }
    let audioLoaderStyle = { top: 6, left: 5 }

    if (!_.isEmpty(gentleData)) {
      if (!_.isEmpty(gentleData.pause)) {
        pauseClips = gentleData.pause.pauses_clips

        separatedClips = this.separatePauses(pauseClips)

        if (_.has(gentleData.pause, 'pause_results_individual')) {
          if (gentleData.pause['pause_results_individual'].length > 0) {
            pauseVals = gentleData.pause['pause_results_individual'][0]
            pauseRes = mutuals.validKey(gentleData.pause, 'pause_result')
            sentenceRes = mutuals.validKey(gentleData.pause, 'sent_result')

            if (_.has(gentleData, 'sentlength')) {
              if (gentleData.sentlength.length > 0) {
                sentVals = gentleData.sentlength[0]
                this.safeToRender = true
              }
            }
          }
        }
      }
    }
    return (
      <div>
        {combinedRes !== null && this.safeToRender ? (
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
              className="clearfix information-content"
              tabIndex={common.tabIndexes.pauses}
              onKeyPress={e => {
                if (e.key === 'Enter' && tabIndex === -1) {
                  this.setState({ tabIndex: common.tabIndexes.pauses }, () => {
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
                label={'Appropriate Pauses'}
                img={appropriateBig}
                alt={'appropriate pauses info'}
                color={sectionColor[combinedRes.pauseCombinedVal]}
                ariaLabel={`${
                  sectionStatus[combinedRes.pauseCombinedVal]
                } in appropriate pauses. ${
                  pausesMsgsMain[combinedRes.pauseCombinedVal]
                }`}
                status={sectionStatus[combinedRes.pauseCombinedVal]}
                underMsg={pausesMsgsMain[combinedRes.pauseCombinedVal]}
              />

              <InfoBarComponent
                id="shortPauses"
                label="Short Pauses"
                mainValue={pauseVals.short}
                threshold={{
                  data: [{ value: 3 }],
                  underLabel: 'Max Allowed',
                }}
                bgColor={pauseVals.short_result}
                barsAndLegends={[
                  {
                    label: 'Short Pauses',
                    value: pauseVals.short,
                    color: sectionColor[pauseVals.short_result],
                  },
                ]}
                unit={'time'}
                category={'verbals'}
              />

              {this.mediumPauseMount()}

              {this.state.mediumPauseBlock ? (
                <InfoBarComponent
                  id="mediumPauses"
                  label="Medium Pauses"
                  mainValue={pauseVals.medium}
                  threshold={{
                    data: [{ value: 1 }],
                    underLabel: 'Max Allowed',
                  }}
                  bgColor={pauseVals.medium_result}
                  barsAndLegends={[
                    {
                      label: 'Medium Pauses',
                      value: pauseVals.medium,
                      color: sectionColor[pauseVals.medium_result],
                    },
                  ]}
                  unit={'time'}
                  category={'verbals'}
                />
              ) : null}

              {this.longPauseMount()}

              {this.state.longPauseBlock ? (
                <InfoBarComponent
                  id="longPauses"
                  label="Long Pauses"
                  mainValue={pauseVals.long}
                  threshold={{
                    data: [{ value: 0 }],
                    underLabel: 'Max Allowed',
                  }}
                  bgColor={pauseVals.long_result}
                  barsAndLegends={[
                    {
                      label: 'Long Pauses',
                      value: pauseVals.long,
                      color: sectionColor[pauseVals.long_result],
                    },
                  ]}
                  unit={'time'}
                  category={'verbals'}
                />
              ) : null}

              {this.trackFromRender(
                sectionStatus[combinedRes.pauseCombinedVal],
                pauseRes,
                sentenceRes
              )}

              <TimelineAudio
                tabIndex={tabIndex}
                gentleData={gentleData}
                data={{
                  short: gentleData.pause.clip_times.short,
                  medium: gentleData.pause.clip_times.medium,
                  long: gentleData.pause.clip_times.long,
                }}
                extras={[
                  { label: 'Short Pause' },
                  { label: 'Medium Pause' },
                  { label: 'Long Pause' },
                ]}
                capsuleSuffix={'time'}
              />

              <PageHealth
                data={pageHealthData['pauses']}
                state={this.state.pageHealthType}
                label={'appropriate pauses'}
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
    if (state.results.pauseResults) {
      combinedRes = state.results.pauseResults
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

export default connect(mapStateToProps, mapDispatchToProps)(SpeechAnalysis)
