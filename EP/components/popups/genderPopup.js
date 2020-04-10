import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { log, mutuals } from './../../actions/commonActions'
import { updateUserInfo } from './../../actions/apiActions'
import { Dropdown } from 'semantic-ui-react'

const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

var classNames = require('classnames')
var langList = [
  { code: 'en-AU', country: 'Australia' },
  { code: 'en-CA', country: 'Canada' },
  { code: 'en-IN', country: 'India' },
  { code: 'en-KE', country: 'Kenya' },
  { code: 'en-TZ', country: 'Tanzania' },
  { code: 'en-GH', country: 'Ghana' },
  { code: 'en-NZ', country: 'New Zealand' },
  { code: 'en-NG', country: 'Nigeria' },
  { code: 'en-SG', country: 'Singapore' },
  { code: 'en-ZA', country: 'South Africa' },
  { code: 'en-IE', country: 'Ireland' },
  { code: 'en-PH', country: 'Philippines' },
  { code: 'en-GB', country: 'United Kingdom' },
  { code: 'en-US', country: 'United States' },
]

const DEFAULT_LANG_CODE = 'en-US*'

langList = langList.sort((a, b) => {
  if (a.country > b.country) return 1
  if (b.country > a.country) return -1
  return 0
})

langList.unshift({ code: DEFAULT_LANG_CODE, country: 'English (Default)' })

const stateOptions = _.map(langList, (state, index) => ({
  key: state.code,
  text: state.country,
  value: state.code,
}))
const basicDetailsIllus =
  process.env.APP_BASE_URL + '/dist/images/icons/basic-details-illustration.svg'

class GenderPopup extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      genderSelected: null,
      isConfirmActive: false,
      langCode: DEFAULT_LANG_CODE,
      buttonText: '',
    }
    this.onSuccess = this.onSuccess.bind(this)
  }

  componentDidMount() {
    let buttonText = ''
    if (mutuals.multipleQuesEnabled(this.props)) {
      buttonText = 'Save And Proceed Forward'
    } else {
      buttonText = 'Save And Exit'
    }

    this.setState({
      buttonText: buttonText,
    })

    this.selectEarlierChoosenOptions()

    mutuals.socketTracking({
      curr_page: '/gender-popup',
      event_type: 'mount',
      event_description: 'gender popup opened',
      interview_id: -1,
    })

    document.getElementById('basicInfo').focus()
  }

  selectEarlierChoosenOptions() {
    let { gender, langCode } = this.props

    if (langCode !== '') {
      this.setState(
        {
          langCode: langCode,
          genderSelected: gender,
        },
        () => {
          this.checkInputs()
        }
      )
    }
    this.checkInputs()
  }

  submitGender() {
    if (this.props.customizations.appearance_enabled) {
      this.whenAppearanceEnabled()
    } else {
      this.whenAppearanceNotEnabled()
    }
  }

  whenAppearanceEnabled() {
    let { genderSelected, langCode } = this.state
    mutuals.socketTracking({
      event_type: 'click',
      event_description: `confirm_button_results_gender_${genderSelected}_accent_${langCode}`,
      interview_id: -1,
    })

    if (genderSelected === null && langCode === '-1') {
      alert('Please select your gender and Accent')
      return
    }
    this.setState({ isConfirmActive: false })

    let fd = new FormData()
    fd.append('gender', genderSelected)
    fd.append('accent', langCode)
    updateUserInfo(fd, this.onSuccess)
  }

  whenAppearanceNotEnabled() {
    let { langCode } = this.state
    mutuals.socketTracking({
      event_type: 'click',
      event_description: `confirm_button_results_accent_${langCode}`,
      interview_id: -1,
    })

    if (langCode === '-1') {
      alert('Please select your Accent')
      return
    }
    this.setState({ isConfirmActive: false })

    let fd = new FormData()
    fd.append('gender', '')
    fd.append('accent', langCode)
    updateUserInfo(fd, this.onSuccess)
  }

  onSuccess() {
    this.setState({ isConfirmActive: true })

    if (mutuals.multipleQuesEnabled(this.props)) {
      this.props.showInterviewQuesSection()
    } else {
      this.props.changeFirstTimeUserStatusAndClosePopup()

      trackingDebounceSmall({
        event_type: 'click',
        event_description: 'Gender popup closed',
      })
    }
  }

  setLangCode(e) {
    this.setState({ langCode: e }, () => {
      this.checkInputs()
    })
  }

  genderSelected(gender) {
    this.setState({ genderSelected: gender }, () => {
      this.checkInputs()
    })
  }

  checkInputs() {
    if (this.props.customizations.appearance_enabled) {
      if (
        this.state.langCode !== '-1' &&
        this.state.langCode !== '' &&
        this.state.genderSelected !== null &&
        this.state.genderSelected !== ''
      ) {
        this.setState({ isConfirmActive: true })
      } else {
        this.setState({ isConfirmActive: false })
      }
    } else {
      if (this.state.langCode !== '-1' && this.state.langCode !== '') {
        this.setState({ isConfirmActive: true })
      } else {
        this.setState({ isConfirmActive: false })
      }
    }
  }

  render() {
    let { langCode } = this.state

    return (
      <div className="gender-wrapper">
        <div
          style={{
            paddingLeft: 70,
            paddingTop: this.props.customizations.appearance_enabled ? 55 : 112,
          }}>
          <h1
            id="basicInfo"
            className="para hintColor text-left"
            tabIndex="20"
            aria-label={`Please fill these basic details before Calibration`}>
            Please fill these basic details before Calibration
          </h1>

          <div className="text-left clearfix mt-8">
            <div className="basicInfoOption">
              <label
                className="para hintColor block"
                tabIndex="20"
                aria-label={`accent selection below, it is a mandatory field.`}>
                Accent
              </label>

              <Dropdown
                ref="accentDropdown"
                placeholder="select"
                selection
                options={stateOptions}
                onChange={(event, data) => {
                  this.setLangCode(data.value)
                }}
                className="mt-6 w-full"
                tabIndex="20"
                aria-label={`This is a dropdown menu. up or down the arrow keys to select different accents.`}
                value={langCode}
                aria-hidden={true}
              />
            </div>
          </div>

          {this.props.customizations.appearance_enabled ? (
            <div className="text-left clearfix mt-12">
              <div className="basicInfoOption">
                <label
                  className="para hintColor"
                  tabIndex="20"
                  aria-label={`Appearance selection field below. this is mandatory`}>
                  Appearance
                </label>

                <div className="gender clearfix">
                  <button
                    tabIndex="20"
                    aria-label={`${
                      this.state.genderSelected === 'male'
                        ? 'male gender selected'
                        : 'click to select male gender'
                    }`}
                    className={classNames({
                      'eachGender relative cursor-pointer': true,
                    })}
                    onClick={() => {
                      this.genderSelected('male')
                    }}>
                    <div
                      className={classNames({
                        genderRadio: true,
                        genderRadioBorder: this.state.genderSelected === 'male',
                      })}>
                      <div
                        className={classNames({
                          clearfix: true,
                          genderRadioFilled:
                            this.state.genderSelected === 'male',
                        })}
                      />
                    </div>

                    <div className="genderLabel hintColor">
                      Business suit and tie
                    </div>
                  </button>

                  <button
                    tabIndex="20"
                    aria-label={`${
                      this.state.genderSelected === 'female'
                        ? 'female gender selected'
                        : 'click to select female gender'
                    }`}
                    className={classNames({
                      'eachGender relative cursor-pointer': true,
                    })}
                    onClick={() => {
                      this.genderSelected('female')
                    }}>
                    <div
                      className={classNames({
                        genderRadio: true,
                        genderRadioBorder:
                          this.state.genderSelected === 'female',
                      })}>
                      <div
                        className={classNames({
                          clearfix: true,
                          genderRadioFilled:
                            this.state.genderSelected === 'female',
                        })}
                      />
                    </div>

                    <div className="genderLabel hintColor">Business suit</div>
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-16">
            <button
              type="button"
              onClick={() => {
                this.submitGender()
              }}
              className={classNames('button blueButton w-full', {
                'opacity-50': !this.state.isConfirmActive,
              })}
              style={{ paddingTop: 12, paddingBottom: 12 }}
              disabled={!this.state.isConfirmActive}
              tabIndex="20"
              aria-label={this.state.buttonText}>
              {this.state.buttonText}
            </button>
          </div>
        </div>

        <div
          className="flex items-center justify-center"
          style={{ height: 420 }}>
          <img src={basicDetailsIllus} alt={'basic details illustration'} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    customizations: state.epCustomizations,
    common: state.commonStuff,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GenderPopup)
