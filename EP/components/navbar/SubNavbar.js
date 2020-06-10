import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  mutuals,
  modifyIntNameForDisplay,
  common,
  log,
} from '../../actions/commonActions'
import { modifyInterview, intKeyIsValid } from '../../actions/apiActions'
import _ from 'underscore'
import RenameInterivew from './../popups/RenameInterview'
import { notify } from '@vmockinc/dashboard/services/helpers'
import NetworkFeedback from '@vmockinc/dashboard/NetworkFeedback'

var goto = function (data) {
  mutuals.socketTracking({
    event_type: 'click',
    event_description: `In EP navbar ${data} clicked`,
  })
}

class SubNavbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      summaryActive: false,
      detailedActive: false,
      openRenameModal: false,
      disableFavourite: false,
      disableRename: false,
    }
    this.intOptions = null
    this.isVideoSummDisabled = this.isVideoSummDisabled.bind(this)
    this.optionsDropdownOpen = this.optionsDropdownOpen.bind(this)
    this.optionsDropdownClose = this.optionsDropdownClose.bind(this)
    this.closeOptionsDropdownOnEsc = this.closeOptionsDropdownOnEsc.bind(this)
  }

  componentDidMount() {
    this.deactivateButtonForAdmin()
    log('inteview details', this.props.intDetails)
  }

  deactivateButtonForAdmin() {
    if (this.props.epCustomizations.user_type === 'admin')
      this.setState({ disableFavourite: true, disableRename: true })
  }

  summaryActive() {
    if (this.props.location.pathname === this.props.appUrls.summary) {
      return true
    }
    return false
  }

  detailedActive() {
    if (
      this.props.location.pathname !== this.props.appUrls.summary &&
      this.props.location.pathname !== this.props.appUrls.videosummary
    ) {
      return true
    }
    return false
  }

  isVideoSummDisabled() {
    if (
      this.props.userVideoPath !== null &&
      this.props.userVideoProcessedPath !== null &&
      this.props.videoRes
    ) {
      return false
    } else {
      return true
    }
  }

  alterInterview(type) {
    let id = this.props.appIntKey
    let { isFavourite } = this.props.intDetails

    let res = isFavourite === 1 ? 0 : 1

    modifyInterview({ id, type, val: res }, () => {
      this.setState({ disableFavourite: true })
      intKeyIsValid(id, () => {
        this.setState({ disableFavourite: false })
        if (res) {
          notify('Marked favourite', 'success', {
            layout: 'topRight',
          })
        } else {
          notify('UnMarked favourite', 'success', {
            layout: 'topRight',
          })
        }
      })
    })
  }

  optionsDropdownClose(event) {
    this.setState({ optionsDropdown: false })
    document.removeEventListener('click', this.optionsDropdownClose)
    document.removeEventListener('keydown', this.closeOptionsDropdownOnEsc)
  }

  optionsDropdownOpen() {
    this.setState(
      {
        optionsDropdown: true,
      },
      () => {
        document.addEventListener('click', this.optionsDropdownClose)
        document.addEventListener('keydown', this.closeOptionsDropdownOnEsc)
      }
    )
  }

  closeOptionsDropdownOnEsc(event) {
    if (event.key === 'Escape') this.optionsDropdownClose('clickedSortOption')
  }

  closeRenameModalHandler() {
    this.setState({ openRenameModal: false })
  }

  openRenameModalHandler() {
    this.setState({ openRenameModal: true, optionsDropdown: false })
  }

  render() {
    let props = this.props
    let { tabIndex } = this.props
    let { intName, isFavourite } = this.props.intDetails
    let stl = { height: 40, float: 'left', paddingTop: 12 }
    return (
      <div
        className="test1 pl-6 pr-6 relative"
        role="navigation"
        aria-label="Secondary navigation bar">
        <div
          className="navTabs flex items-center justify-center float-left font-semibold"
          style={{ height: 40 }}>
          <div
            className="elipsis"
            style={{ ...stl, maxWidth: 230 }}
            title={modifyIntNameForDisplay(intName)}>
            {modifyIntNameForDisplay(intName)}
          </div>

          <button
            className="float-left ml-6 text-16-normal"
            onClick={() => {
              this.alterInterview('favourites')
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') this.alterInterview('favourites')
            }}
            disabled={this.state.disableFavourite}
            tabIndex={tabIndex}
            aria-label={'mark favourite or unfavourite the current interview'}>
            {isFavourite ? (
              <span className="ep-icon-star-filled align-text-bottom bluePrimaryTxt" />
            ) : (
              <span className="ep-icon-star-outline align-text-bottom" />
            )}
          </button>

          <button
            className="float-left ml-6"
            onClick={() => {
              if (this.state.openRenameModal === false) {
                this.optionsDropdownOpen()
              }
            }}
            disabled={this.state.disableRename}
            tabIndex={tabIndex}
            aria-label={'open interview alterations panel'}>
            <span className="ep-icon-option align-text-bottom text-20-normal" />

            {this.state.optionsDropdown ? (
              <div
                ref={node => (this.intOptions = node)}
                className="absolute shadow-1 bg-white"
                style={{ zIndex: 1000 }}>
                <div
                  onClick={() => {
                    this.openRenameModalHandler()
                  }}
                  onKeyPress={e => {
                    if (e.key === 'Enter') this.openRenameModalHandler()
                  }}
                  className="px-4 py-3 pointer-cursor hover:bg-grey-lightest"
                  tabIndex={tabIndex}
                  aria-label={'opens interview rename popup'}>
                  Rename
                </div>
              </div>
            ) : null}
            {this.state.openRenameModal ? (
              <RenameInterivew
                tabIndex={tabIndex}
                closeModal={this.closeRenameModalHandler.bind(this)}
              />
            ) : null}
          </button>

          <Link
            tabIndex={this.props.tabIndex}
            aria-label={`summary page`}
            to={props.appUrls.summary}
            onClick={() => {
              goto('summary_page_link')
            }}>
            {this.summaryActive() ? (
              <div
                className="navbarActiveTxt"
                style={{ ...stl, marginLeft: 30 }}>
                Summary{' '}
              </div>
            ) : (
              <div className="blackTextApp" style={{ ...stl, marginLeft: 30 }}>
                Summary{' '}
              </div>
            )}
          </Link>

          <Link
            tabIndex={tabIndex}
            aria-label={`detailed page`}
            to={props.appUrls.eyeGaze}
            onClick={() => {
              goto('video_summary')
            }}>
            {this.detailedActive() ? (
              <div
                className="navbarActiveTxt"
                style={{ ...stl, marginLeft: 30 }}>
                Detailed
              </div>
            ) : (
              <div className="blackTextApp" style={{ ...stl, marginLeft: 30 }}>
                Detailed
              </div>
            )}
          </Link>

          <div className="relative">
            <Link
              tabIndex={this.props.tabIndex}
              aria-label={`Video Feedback page`}
              to={props.appUrls.videosummary}
              onClick={() => {
                goto('detailed_page_link')
              }}>
              {this.props.location.pathname ===
              this.props.appUrls.videosummary ? (
                <div
                  className="navbarActiveTxt"
                  style={{ ...stl, marginLeft: 30 }}>
                  Video Feedback
                </div>
              ) : (
                <div
                  className="blackTextApp"
                  style={{ ...stl, marginLeft: 30 }}>
                  Video Feedback
                </div>
              )}
            </Link>

            {this.isVideoSummDisabled() ? (
              <div className="deactivate"></div>
            ) : null}
          </div>

          <div style={{ position: 'absolute', right: 20 }}>
            {this.props.performanceInfo !== null ? (
              <button className="inline-block">
                <NetworkFeedback
                  role="in-app"
                  placement="button"
                  product="interview"
                  interviewName={this.props.intDetails.intName}
                  interview_id={this.props.appIntKey}
                  score={Number(this.props.performanceInfo.op_index.toFixed(2))}
                  className="blueButton px-4 py-2 cursor-pointer rounded mr-2 text-14-normal"
                  text="Network Feedback"
                  imgUrl={this.props.videoProcessedThumb}
                  fetchResumeHistory={true}
                  interviewDuration={this.props.intDetails.intDuration}
                />
              </button>
            ) : null}

            <a
              tabIndex={this.props.tabIndex}
              aria-label={`calibration page`}
              href={props.appUrls.calibration}
              onClick={() => {
                goto('take_another_interview')
              }}>
              <button className="float-right blueButton px-4 py-2 cursor-pointer rounded mr-2 text-14-normal">
                + New Interview
              </button>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    appIntKey: state.appIntKey.key,
    videoRes: state.convertVideoRes.status,
    userVideoPath: _.has(state.epPaths, 'userVideoPath')
      ? state.epPaths.userVideoPath
      : null,
    userVideoProcessedPath: _.has(state.epPaths, 'userVideoProcessedPath')
      ? state.epPaths.userVideoProcessedPath
      : null,
    intDetails: state.interviewEP,
    epCustomizations: state.epCustomizations,
    videoProcessedThumb: state.epPaths.userVideoProcessedThumb,
    performanceInfo: state.results.performanceInfo,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SubNavbar)
