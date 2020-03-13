import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals } from './../../actions/commonActions'
import { log, common } from './../../actions/commonActions'
import AsyncImage from './../Loading/asyncImage'
import { appearMsgs } from './../messages/messages'
import { DetailInfoHeader } from './../commons/DetailHeader'
import IsThereOrNotBox from './../commons/IsThereOrNotBox.js'
import { PageHealth, pageHealthData } from './../commons/PageHealth'

var Loader = require('react-loaders').Loader

class AppearanceCombined extends Component {
  constructor(props) {
    super(props)
    this.state = { loader: true, tabIndex: -1, pageHealthType: null }
    this.pageHealthShowLogic = this.pageHealthShowLogic.bind(this)
  }

  pageHealthShowLogic() {
    let { concatData, combinedRes } = this.props

    if (concatData.face_not_detected_percent >= 10) {
      this.setState({ pageHealthType: 'notDetected' })
      return
    }

    if (combinedRes.appearCombinedVal === 0) {
      this.setState({ pageHealthType: 'goodJobState' })
      return
    }

    if (combinedRes.appearCombinedVal === 2) {
      this.setState({ pageHealthType: 'needsWorkState' })
      return
    }
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
    this.pageHealthShowLogic()
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
              tabIndex={common.tabIndexes.appearance}
              onKeyPress={e => {
                if (e.key === 'Enter' && tabIndex === -1) {
                  this.setState(
                    { tabIndex: common.tabIndexes.appearance },
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
                label={'Appearance'}
                img={
                  process.env.APP_BASE_URL +
                  '/dist/images/new/icons-big/appearance-big.svg'
                }
                alt={'appearance info'}
                color={sectionColor[combinedRes.appearCombinedVal]}
                ariaLabel={`${
                  sectionStatus[combinedRes.appearCombinedVal]
                } in appearance. ${appearMsgs[combinedRes.appearCombinedVal]}`}
                status={sectionStatus[combinedRes.appearCombinedVal]}
                underMsg={appearMsgs[combinedRes.appearCombinedVal]}
              />

              <div className="mt-8 flex justify-center items-center">
                {userInfoEP.gender !== 'female' && userInfoEP.gender !== '' ? (
                  <div className="mr-10" style={{ width: 320 }}>
                    <IsThereOrNotBox
                      head="Tie"
                      value={vals.tie}
                      callback={mutuals.findAbsentOrPresent}
                    />
                  </div>
                ) : null}

                <div style={{ width: 320 }}>
                  <IsThereOrNotBox
                    head="Suit"
                    value={vals.suit}
                    callback={mutuals.findAbsentOrPresent}
                  />
                </div>
              </div>

              <div
                className="mt-8 w-full relative"
                style={{
                  background: `url(${this.props.appearImgPath})`,
                  backgroundSize: 'cover',
                }}>
                <div
                  className="absolute pin bg-black"
                  style={{ opacity: 0.8 }}
                />
                <div className="white-bg flex justify-center py-20">
                  <AsyncImage
                    src={this.props.appearImgPath}
                    height={'240px'}
                    width={'320px'}
                    loaderSize={1}
                    alt={'appearance'}
                  />
                </div>
              </div>

              <PageHealth
                data={pageHealthData['appearance']}
                state={this.state.pageHealthType}
                type={'nonVerbals'}
                label={'appearance'}
              />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppearanceCombined)
