import React, { Component } from 'react'
import ModalHOC from '../hoc/ModalHOC'
import { connect } from 'react-redux'
import _ from 'underscore'
import VideoCheck from './VideoCheck'
import Gender from './../popups/genderPopup'
import { updateChecksDone } from './../../actions/apiActions'
import { mutuals, log, common } from './../../actions/commonActions'
import InterviewQuestions from './../popups/InterviewQuestions'

const InputCheckImg =
  process.env.APP_PRODUCT_BASE_URL +
  '/dist/images/icons/input-check-illustration.svg'
const tickGreen =
  process.env.APP_PRODUCT_BASE_URL + '/dist/images/icons/tick-green.svg'
const leftArrowBlack =
  process.env.APP_PRODUCT_BASE_URL + '/dist/images/icons/left-arrow-black.svg'

const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)
const FocusTrap = require('focus-trap-react')
var Loader = require('react-loaders').Loader
var classNames = require('classnames')

class SystemCheck extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      displayNetworkCheck: false,
      stage: { index: 0, type: 'active' },
      systemCheckInfo: true,
      systemCheck: true,
      editBasicInfo: false,
      basicDetailsFormVisible: false,
      shouldDisplaySystemCheckInfo: true,
      displaySystemCheck: false,
      mountNetworkCheck: true,
      showInputsCheck: true,
      interviewQues: false,
    }

    this.audioStream = null
    this.attachEscEvent()

    this.displayNetworkCheck = this.displayNetworkCheck.bind(this)
    this.inputsCheckCompleted = this.inputsCheckCompleted.bind(this)
    this.gotoBasicDetails = this.gotoBasicDetails.bind(this)
    this.showInterviewQuesSection = this.showInterviewQuesSection.bind(this)
  }

  attachEscEvent() {
    document.onkeydown = e => {
      if (e.key === 'Escape') {
        this.modalToggler()
      }
    }
  }

  componentDidMount() {
    if (this.props.modalOpenType === 'questions-panel')
      this.showInterviewQuesSection()
  }

  componentWillUnmount() {
    document.onkeydown = null
  }

  inputsCheckCompleted() {
    this.setState({
      stage: { index: 0, type: 'done' },
    })
    updateChecksDone('input_check')
  }

  displayNetworkCheck() {
    this.setState({
      showInputsCheck: false,
      displayNetworkCheck: true,
      stage: { index: 1, type: 'active' },
    })
  }

  gotoBasicDetails() {
    this.setState({
      stage: { index: 1, type: 'done' },
    })
    this.activateTab('editBasicInfo')
    this.makeBasicDetailsFormVisible()
  }

  modalToggler() {
    this.props.closePopup()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.userInfo) !== JSON.stringify(this.props.userInfo)
    ) {
      this.setState({
        matchText: `I am ${nextProps.userInfo.firstName} ${nextProps.userInfo.lastName}`,
      })
    }
  }

  activateTab = group => {
    this.setState({
      systemCheck: false,
      editBasicInfo: false,
      interviewQues: false,
      [group]: true,
    })
  }

  displayInputCheck() {
    this.setState({
      displaySystemCheck: true,
      showInputsCheck: true,
      shouldDisplaySystemCheckInfo: false,
      systemCheckInfo: false,
      displayNetworkCheck: false,
      interviewQues: false,
    })
  }

  makeBasicDetailsFormVisible() {
    this.setState({
      shouldDisplaySystemCheckInfo: false,
      displaySystemCheck: false,
      basicDetailsFormVisible: true,
      displayNetworkCheck: false,
      mountNetworkCheck: false,
      interviewQues: false,
    })
  }

  showInterviewQuesSection() {
    this.setState({
      shouldDisplaySystemCheckInfo: false,
      displaySystemCheck: false,
      basicDetailsFormVisible: false,
      displayNetworkCheck: false,
      mountNetworkCheck: false,
      interviewQues: true,
    })
    this.activateTab('interviewQues')
  }

  makeSystemCheckInfoVisible() {
    this.setState({
      basicDetailsFormVisible: false,
      shouldDisplaySystemCheckInfo: true,
      displayNetworkCheck: false,
      mountNetworkCheck: false,
      displaySystemCheck: false,
      interviewQues: false,
    })

    setTimeout(() => {
      this.setState({ mountNetworkCheck: true })
    }, 500)
  }

  render() {
    let tabImgStyle = { width: 18, height: 18 }
    let { tabIndex, customizations } = this.props
    return (
      <FocusTrap>
        <div className="epModalCover">
          <div
            className={`epModal`}
            style={{ width: 875, height: 480, padding: '0 0 20px 0' }}>
            {this.props.firstTimeUser ? (
              <button
                style={{
                  position: 'absolute',
                  left: -120,
                  top: 0,
                  color: 'white',
                }}
                onClick={() => {
                  this.props.backToTips()
                }}>
                <img src={leftArrowBlack} alt="left arrow" />
                <span className="ml-4">Back to tips</span>
              </button>
            ) : (
              <button
                className="epModalClose text-white"
                style={{ top: 0, right: -35 }}
                onClick={() => {
                  this.modalToggler()
                }}
                tabIndex={tabIndex}
                aria-label={'system check close button'}>
                <span className="ep-icon-close"></span>
              </button>
            )}

            <div className="clearfix">
              {this.props.modalOpenType !== 'questions-panel' ? (
                <>
                  <button
                    className={classNames('float-left p-5', {
                      'cursor-pointer': this.props.userInfoEP.isInputChecked,
                      'w-1/3': mutuals.multipleQuesEnabled(this.props),
                      'w-1/2': !mutuals.multipleQuesEnabled(this.props),
                      'brand-blue-color border-b-brand-blue': this.state
                        .systemCheck,
                    })}
                    disabled={
                      this.props.userInfoEP.isInputChecked ? false : true
                    }
                    onClick={() => {
                      if (this.props.userInfoEP.isInputChecked) {
                        this.activateTab('systemCheck')
                        this.makeSystemCheckInfoVisible()
                      }
                    }}
                    tabIndex={
                      this.props.userInfoEP.isInputChecked
                        ? this.props.tabIndex
                        : null
                    }
                    aria-label={`System check tab click to goto system check process`}>
                    <span className="ep-icon-edit text-18-normal align-text-bottom" />
                    <span className="ml-6 subHead align-middle">
                      System Check
                    </span>
                  </button>
                  <button
                    className={classNames('float-left p-5', {
                      'cursor-pointer': this.props.userInfoEP.isInputChecked,
                      'w-1/3': mutuals.multipleQuesEnabled(this.props),
                      'w-1/2': !mutuals.multipleQuesEnabled(this.props),
                      'brand-blue-color border-b-brand-blue': this.state
                        .editBasicInfo,
                    })}
                    disabled={
                      this.props.userInfoEP.isInputChecked ? false : true
                    }
                    onClick={() => {
                      if (this.props.userInfoEP.isInputChecked) {
                        this.activateTab('editBasicInfo')
                        this.makeBasicDetailsFormVisible()
                      }
                    }}
                    tabIndex={
                      this.props.userInfoEP.isInputChecked
                        ? this.props.tabIndex
                        : null
                    }
                    aria-label={`Basic details tab click to goto basic details form`}>
                    <span className="ep-icon-setting text-18-normal align-text-bottom" />
                    <span className="ml-6 subHead">Basic Details</span>
                  </button>
                </>
              ) : null}

              {mutuals.multipleQuesEnabled(this.props) ? (
                <button
                  className={classNames('float-left w-1/3 p-5', {
                    'cursor-pointer': this.props.userInfoEP.isInputChecked,
                    'brand-blue-color border-b-brand-blue':
                      this.state.interviewQues &&
                      this.props.modalOpenType !== 'questions-panel',
                  })}
                  disabled={this.props.userInfoEP.isInputChecked ? false : true}
                  onClick={() => {
                    if (this.props.userInfoEP.isInputChecked) {
                      this.showInterviewQuesSection()
                    }
                  }}
                  tabIndex={
                    this.props.userInfoEP.isInputChecked
                      ? this.props.tabIndex
                      : null
                  }
                  aria-label={`interview question tab click to goto interview question form`}>
                  <span className="ep-icon-question text-18-normal align-text-bottom" />
                  <span className="ml-6 subHead">Interview Question</span>
                </button>
              ) : null}
            </div>

            {this.state.shouldDisplaySystemCheckInfo
              ? this.systemCheckInfo()
              : null}

            {this.state.displaySystemCheck ? (
              <React.Fragment>
                {this.state.showInputsCheck ? (
                  <VideoCheck
                    displayNetworkCheck={this.displayNetworkCheck}
                    inputsCheckCompleted={this.inputsCheckCompleted}
                    matchText={this.state.matchText}
                    userInfo={this.props.userInfo}
                    gotoBasicDetails={this.gotoBasicDetails}
                    tabIndex={this.props.tabIndex}
                  />
                ) : null}
              </React.Fragment>
            ) : null}

            {this.state.basicDetailsFormVisible ? (
              <Gender
                closePopup={this.props.closePopup}
                changeFirstTimeUserStatusAndClosePopup={
                  this.props.changeFirstTimeUserStatusAndClosePopup
                }
                gender={this.props.gender}
                langCode={this.props.langCode}
                customizations={this.props.customizations}
                showInterviewQuesSection={this.showInterviewQuesSection}
              />
            ) : null}

            {this.state.interviewQues ? (
              <InterviewQuestions
                closePopup={this.props.closePopup}
                changeFirstTimeUserStatusAndClosePopup={
                  this.props.changeFirstTimeUserStatusAndClosePopup
                }
                onSuccessOfCreateInt={this.props.onSuccessOfCreateInt}
                gotoBasicDetails={this.gotoBasicDetails}
                modalOpenType={this.props.modalOpenType}
              />
            ) : null}
          </div>
        </div>
      </FocusTrap>
    )
  }

  systemCheckInfo = props => {
    return (
      <div className="calib-setup">
        <div
          className="clearfix flex justify-center text-left"
          style={{ marginTop: 120 }}>
          <section>
            <div className="paraHead mt-6 directive">Inputs Check</div>

            <div className="mt-4 directive-detail" style={{ padding: 0 }}>
              Use Earphones with Mic for optimal Experience
            </div>

            <button
              onClick={() => {
                trackingDebounceSmall({
                  event_type: 'click',
                  event_description: 'Calibration next button clicked',
                  interview_id: -1,
                })

                this.displayInputCheck()
              }}
              className="button blueButton"
              style={{ padding: '10px 50px', marginTop: 35 }}
              tabIndex={this.props.tabIndex}
              aria-label={`inputs check button click to goto input check process`}>
              Check
            </button>

            {this.props.userInfoEP.isInputChecked && false ? (
              <div className="clearfix">
                <div className="flex justify-center mt-3">
                  <img style={{ width: 20 }} src={tickGreen} alt="green tick" />
                  <div className="ml-3 mt-1" style={{ fontSize: 14 }}>
                    Working
                  </div>
                </div>

                <div className="mt-3 hintColor" style={{ fontSize: 12 }}>
                  Checked {this.props.userInfoEP.inputCheckLastTime} ago
                </div>
              </div>
            ) : null}
          </section>

          <section
            className="ml-10"
            tabIndex={this.props.tabindex}
            aria-label={
              'Please consider using earphones for better speech recognition. Specifically essential for noisy surroundings.'
            }>
            <div className="flex justify-center">
              <div className="flex items-center justify-center">
                <img
                  className="illus-img"
                  alt="input check"
                  src={InputCheckImg}
                />
              </div>
            </div>

            {this.props.userInfoEP.isNetworkChecked && false ? (
              <div className="clearfix">
                <div className="flex justify-center mt-3">
                  <img style={{ width: 20 }} src={tickGreen} alt="green tick" />
                  <div className="ml-3 mt-1" style={{ fontSize: 14 }}>
                    Working
                  </div>
                </div>

                <div className="mt-3 hintColor" style={{ fontSize: 12 }}>
                  Checked {this.props.userInfoEP.networkCheckLastTime} ago
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.user.data,
    userInfoEP: state.userInfoEP,
    customizations: state.epCustomizations,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

SystemCheck = connect(mapStateToProps, mapDispatchToProps)(SystemCheck)

export default ModalHOC(SystemCheck)
