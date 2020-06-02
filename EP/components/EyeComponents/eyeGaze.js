import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { eyeGazeMsgs } from './../messages/messages'
import {
  mutuals,
  highContrast,
  common,
  log,
} from './../../actions/commonActions'
import {
  toggleVideoFloating,
  dispatchSetTabIndex,
} from './../../actions/actions'
import NoDetectionAlert from '../popups/NoDetectionAlert'
import { DetailInfoHeader } from './../commons/DetailHeader'
import InfoBarComponent from './../commons/InfoBarComponent'
import TimelineVideos from './../commons/TimelineVideos'
import { PageHealth, pageHealthData } from './../commons/PageHealth'
import Disclaimer from './../../disclaimer-show-feature/containers/disclaimer/Disclaimer'

const eyeContactBig =
  process.env.APP_PRODUCT_BASE_URL +
  '/dist/images/new/icons-big/eye-contact-big.svg'
var Loader = require('react-loaders').Loader
class EyeContactCenter extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      tabIndex: -1,
      pageHealthType: null,
    }
    this.pageHealthShowLogic = this.pageHealthShowLogic.bind(this)
  }

  componentDidMount() {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['eyeGaze'],
      event_type: 'mount',
    })
  }

  pageHealthShowLogic() {
    let { concatData } = this.props

    if (concatData.face_not_detected_percent >= 10) {
      this.setState({ pageHealthType: 'notDetected' })
      return
    }

    if (concatData.eye_contact_results[0].center > 90) {
      this.setState({ pageHealthType: 'goodJobState' })
      return
    }

    if (concatData.eye_contact_results[0].center < 50) {
      this.setState({ pageHealthType: 'needsWorkState' })
      return
    }
  }

  trackFromRender = _.once(res => {
    mutuals.socketTracking({
      curr_page: mutuals.urlEnds['eyeGaze'],
      event_type: 'render',
      event_description: 'eye_gaze_combined_results_' + res,
    })
    this.pageHealthShowLogic()
  })

  render() {
    let { tabIndex } = this.state
    let { compLoader, sectionColor, sectionStatus } = this.props.common
    let { combinedRes, concatData, eyeCombinedVal } = this.props
    let eyeVals
    let safeToRender = false

    if (!_.isEmpty(concatData)) {
      if (!_.isEmpty(concatData.eye_contact_results)) {
        safeToRender = true
        eyeVals = concatData.eye_contact_results[0]
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
          tabIndex={common.tabIndexes.eyeContact}
          onKeyPress={e => {
            if (e.key === 'Enter' && tabIndex === -1) {
              this.setState({ tabIndex: common.tabIndexes.eyeContact }, () => {
                try {
                  document
                    .querySelector('.information-content .onEnterFocusAda')
                    .focus()
                } catch (e) {
                  console.error(e)
                }

                dispatchSetTabIndex(common.tabIndexes.eyeContact)
              })
            }
          }}
          aria-label={`Information section. This section provides details to your performance. ${
            tabIndex === -1 ? 'Select to continue further' : ''
          }`}>
          <DetailInfoHeader
            tabIndex={tabIndex}
            label={'Eye Contact'}
            img={eyeContactBig}
            alt={'eye contact info'}
            color={sectionColor[eyeCombinedVal]}
            ariaLabel={`${sectionStatus[eyeCombinedVal]} in eye contact. ${eyeGazeMsgs[eyeCombinedVal]}`}
            status={sectionStatus[eyeCombinedVal]}
            underMsg={eyeGazeMsgs[eyeCombinedVal]}
          />

          <InfoBarComponent
            tabIndex={tabIndex}
            id="eyeContact"
            label="Eye Contact Duration"
            mainValue={eyeVals.center}
            threshold={{
              data: [{ value: 75 }],
              underLabel: 'Min Required',
            }}
            bgColor={eyeCombinedVal}
            barsAndLegends={[
              {
                label: 'Center',
                value: eyeVals.center,
                color: sectionColor[eyeCombinedVal],
              },
            ]}
            unit={'%'}
            category={'nonVerbals'}
          />

          <Disclaimer
            body="Eye contact results may become less accurate if the eyes are not visible clearly under poor lighting, effects of shadow on face, coloured glasses, or poor camera quality."
            buttonText="Disclaimer"
            config={{ style: { width: 450 }, icon: 'ep-icon-warning-outline' }}
          />

          {this.trackFromRender(sectionStatus[eyeCombinedVal])}

          <TimelineVideos
            heading={`Off Center Eye Contact Duration - ${Math.ceil(
              eyeVals.left + eyeVals.right + eyeVals.up + eyeVals.down
            )}%`}
            tabIndex={tabIndex}
            concatData={concatData}
            data={eyeVals.clip_times}
            unit={'clip'}
            emoji={{ type: 'bad', category: 'eye' }}
          />

          <PageHealth
            data={pageHealthData['eyeContact']}
            state={this.state.pageHealthType}
            type={'nonVerbals'}
            label={'eye contact'}
          />
        </div>
      </div>
    ) : (
      <div className="clearfix loaderWrap">
        <Loader
          type={compLoader.type}
          active
          style={{ transform: compLoader.scale, fill: 'black' }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  let combinedRes = null

  if (!_.isEmpty(state.results)) {
    if (state.results.eyeResults) {
      combinedRes = state.results.eyeResults
    }
  }

  return {
    combinedRes: combinedRes,
    common: state.commonStuff,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
    eyeCombinedVal: state.results.eyeResults
      ? state.results.eyeResults.eyeCombinedVal
      : null,
    eyeCombinedMsg: state.results.eyeResults
      ? state.results.eyeResults.eyeCombinedMsg
      : null,
    videoFloating: state.videoInfo.videoFloating,
    videoChunksVisible: state.videoInfo.videoChunksVisible,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleVideoFloating: val => {
      dispatch(toggleVideoFloating(val))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EyeContactCenter)
