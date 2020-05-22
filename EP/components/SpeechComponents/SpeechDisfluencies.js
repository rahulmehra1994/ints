import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals, common } from './../../actions/commonActions'
import { disfluencyMsgs } from './../messages//messages'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import CustomPlayPause from '../utilities/CustomPlayPause'
import CustomMuteUnmute from '../utilities/CustomMuteUnmute'
import { Media, Player, controls } from 'react-media-player'
import { DetailInfoHeader } from './../commons/DetailHeader'
import InfoBarComponent from './../commons/InfoBarComponent'
import TimelineAudio from './../commons/TimelineAudio'
import { PageHealth, pageHealthData } from './../commons/PageHealth'

const disfluenciesBig =
  process.env.APP_BASE_URL + '/dist/images/new/icons-big/disfluencies-big.svg'
const { SeekBar } = controls
var Loader = require('react-loaders').Loader

class SpeechDisfluencies extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      tab: true,
      counterD: 0,
      counterE: 0,
      interviewKey: '',
      tabIndex: -1,
      toggleDisfluencies: new Array(100).fill(false),
      toggleElongation: new Array(100).fill(false),
      disfluencyAudioLoader: new Array(100).fill(true),
      elongationAudioLoader: new Array(100).fill(true),
      pageHealthType: null,
    }
    this.safeToRender = false
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

    if (combinedRes.disfluencyCombinedVal === 0) {
      this.setState({ pageHealthType: 'goodJobState' })
      return
    }

    if (combinedRes.disfluencyCombinedVal === 2) {
      this.setState({ pageHealthType: 'needsWorkState' })
      return
    }
  }

  pageHealthShowLogicActivate = _.once(() => {
    this.pageHealthShowLogic()
  })

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['disfluencies'],
      event_type: 'mount',
    })
    this.setState({ interviewKey: this.props.appIntKey })
    mutuals.ariaLabelAddOnAudioSeekbar.call(this)
  }

  counterD() {
    let fillersArray = this.props.fillersArray,
      counterD = 0
    fillersArray.map((item, index) => {
      if (item.type === 1) {
        counterD += 1
      }
    })
    return counterD
  }

  counterE() {
    let fillersArray = this.props.fillersArray,
      counterE = 0
    fillersArray.map((item, index) => {
      if (item.type === 2) {
        counterE += 1
      }
    })
    return counterE
  }

  changeState = tab => {
    this.setState({ tab: tab })
  }

  trackingData(data) {
    mutuals.socketTracking({
      event_type: 'click',
      event_description: data,
    })
  }

  onAudioEvent(id, event) {
    let audios = document.getElementsByTagName('audio')

    for (let i = 0; i < audios.length; i++) {
      if (audios[i].id !== id) audios[i].pause()
    }

    mutuals.socketTracking({
      event_type: 'click',
      event_description: event,
    })
  }

  trackFromRender = _.once(
    (res, elongationRes, ahUmRes, elongCounter, ahUmCount) => {
      mutuals.socketTracking({
        curr_page: mutuals.urlEnds['disfluencies'],
        event_type: 'render',
        event_description: `disfluency_combined_${res}_params_elongation_res_${elongationRes}_ah_um_res_${ahUmRes}_elongCount_${elongCounter}_ahUmCount_${ahUmCount}`,
      })
    }
  )

  trackEvent(index, fillersArray, cond) {
    this.trackingData(`${index}_of_${fillersArray.length}${cond}`)
  }

  elongationMount = _.once(() => {
    setTimeout(() => {
      this.setState({ elongationBlock: true })
    }, 200)
  })

  render() {
    let { tabIndex, toggleDisfluencies, toggleElongation } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, fillersArray, gentleRes } = this.props
    let elongationRes, ahUmRes
    let audioLoaderStyle = { top: 6, left: 5 }

    if (!_.isEmpty(gentleRes)) {
      if (!_.isEmpty(gentleRes.fillers)) {
        this.safeToRender = true
        elongationRes = mutuals.validKey(gentleRes.fillers, 'elongation_result')
        ahUmRes = mutuals.validKey(gentleRes.fillers, 'disfluency_result')
      }
    }

    if (fillersArray !== null) {
      fillersArray = fillersArray
    } else {
      fillersArray = new Array()
    }

    return combinedRes !== null && this.safeToRender ? (
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
          tabIndex={common.tabIndexes.disfluencies}
          onKeyPress={e => {
            if (e.key === 'Enter' && tabIndex === -1) {
              this.setState(
                { tabIndex: common.tabIndexes.disfluencies },
                () => {
                  try {
                    document
                      .querySelector('.information-content .onEnterFocusAda')
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
            label={'Speech Fluency'}
            img={disfluenciesBig}
            alt={'disfluencies info'}
            color={sectionColor[combinedRes.disfluencyCombinedVal]}
            ariaLabel={`${
              sectionStatus[combinedRes.disfluencyCombinedVal]
            } in disfluencies. ${
              disfluencyMsgs[combinedRes.disfluencyCombinedVal]
            }`}
            status={sectionStatus[combinedRes.disfluencyCombinedVal]}
            underMsg={disfluencyMsgs[combinedRes.disfluencyCombinedVal]}
          />

          {this.trackFromRender(
            sectionStatus[combinedRes.disfluencyCombinedVal],
            elongationRes,
            ahUmRes,
            this.counterE(),
            this.counterD()
          )}

          <InfoBarComponent
            id="ahUmCounter"
            label="Ah-Um Counter"
            mainValue={this.counterD()}
            threshold={{
              data: [{ value: 1 }],
              underLabel: 'Max Allowed',
            }}
            bgColor={ahUmRes}
            barsAndLegends={[
              {
                label: 'Ah-Um Counter',
                value: this.counterD(),
                color: sectionColor[ahUmRes],
              },
            ]}
            unit={'time'}
            category={'verbals'}
          />

          <TimelineAudio
            data={{ disfluency: gentleRes.fillers.clip_times.disfluency }}
            extras={[{ label: 'Ah-Um Counter' }]}
            capsuleSuffix={'clip'}
          />

          {this.elongationMount()}
          {this.state.elongationBlock ? (
            <InfoBarComponent
              id="elongation"
              label="Elongation"
              mainValue={this.counterE()}
              threshold={{
                data: [{ value: 1 }],
                underLabel: 'Max Allowed',
              }}
              bgColor={elongationRes}
              barsAndLegends={[
                {
                  label: 'Elongation',
                  value: this.counterE(),
                  color: sectionColor[elongationRes],
                },
              ]}
              unit={'time'}
              category={'verbals'}
            />
          ) : null}

          <TimelineAudio
            data={{ elongation: gentleRes.fillers.clip_times.elongation }}
            extras={[{ label: 'Elongations' }]}
            capsuleSuffix={'time'}
          />

          <PageHealth
            data={pageHealthData['disfluencies']}
            state={this.state.pageHealthType}
            label={'speech fluencies'}
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
    )
  }
}

const mapStateToProps = state => {
  let combinedRes = null

  if (!_.isEmpty(state.results)) {
    if (state.results.disfluencyResults) {
      combinedRes = state.results.disfluencyResults
    }
  }
  let uniqArray = null
  if (!_.isEmpty(state.gentleResults)) {
    uniqArray = _.uniq(
      state.gentleResults.fillers.filler_results_individual,
      item => {
        return item.fillers
      }
    )
  }

  return {
    appIntKey: state.appIntKey.key,
    combinedRes: combinedRes,
    common: state.commonStuff,
    fillersArray: uniqArray,
    gentleRes: !_.isEmpty(state.gentleResults) ? state.gentleResults : null,
    transcript: state.transcript,
    epCustomizations: state.epCustomizations,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SpeechDisfluencies)
