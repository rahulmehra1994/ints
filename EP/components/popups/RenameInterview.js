import React, { Component } from 'react'
import { connect } from 'react-redux'
import { modifyInterview, intKeyIsValid } from './../../actions/apiActions'
import {
  mutuals,
  setInterviews,
  modifyIntNameForDisplay,
  checkForSpecialChars,
} from './../../actions/commonActions'
import { notify } from '@vmockinc/dashboard/services/helpers'
import _ from 'underscore'

const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

class RenameModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newName: '',
      buttonDisable: false,
      initialName: '',
    }
    this.toggleFunction = this.toggleFunction.bind(this)
    this.submitName = this.submitName.bind(this)
    this.activateButton = this.activateButton.bind(this)
    this.modalToggler = this.modalToggler.bind(this)
    this.escEvent = this.escEvent.bind(this)
  }

  componentDidMount() {
    let initialName = modifyIntNameForDisplay(this.props.intDetails.intName)
    this.setState({ initialName: initialName })
    this.attachEscEvent()
  }

  componentWillUnmount() {
    this.removeEscEvent()
  }

  attachEscEvent() {
    document.addEventListener('keydown', this.escEvent)
  }

  removeEscEvent() {
    document.removeEventListener('keydown', this.escEvent)
  }

  escEvent(e) {
    if (e.key === 'Escape') {
      this.props.closeModal()
    }
  }

  toggleFunction() {
    this.props.closeModal()
  }

  submitName() {
    let val = this.refs.renameInput.value

    if (val === '') {
      alert('Interview name cannot be empty!')
      return
    }

    let pattern = /[a-zA-Z]/g
    if (!pattern.test(val)) {
      alert('Mandatory at least 1 letter (a-z,A-Z)')
      return
    }

    if (this.state.initialName === val) {
      alert('Cannot submit the same name!')
      return
    }

    if (checkForSpecialChars(val)) return
    this.setState({ buttonDisable: true })

    let intKey = this.props.appIntKey
    let data = {
      id: intKey,
      type: 'rename',
      val,
    }
    modifyInterview(data, () => {
      intKeyIsValid(intKey, () => {
        this.modalToggler()
        notify('Interview renamed', 'success', {
          layout: 'topRight',
        })
      })
    })
  }

  activateButton() {
    this.setState({ buttonDisable: false, newName: '' })
    this.refs.renameInput.value = ''
    this.toggleFunction()
  }

  modalToggler() {
    this.props.closeModal()
  }

  render() {
    let { intName } = this.props.intDetails
    let { tabIndex } = this.props
    return (
      <div className="epModalCover">
        <div
          className="revaluateModal epModal relative"
          style={{ width: 440, marginTop: 280 }}>
          <div className="epModalContent" style={{ padding: 16 }}>
            <section className="rename-modal">
              <div className="text-18-demi text-left mt-6">Rename</div>
              <div className="mt-8 text-14-normal text-left">
                Please enter a new name for this interview
              </div>

              <div className="mt-10">
                <input
                  ref="renameInput"
                  defaultValue={modifyIntNameForDisplay(intName)}
                  className="px-4 border border border-grey-light rounded w-full text-14-normal"
                  style={{ height: 35 }}
                  onInput={event => {
                    this.setState({ newName: event.target.value })
                  }}
                  maxLength="50"
                  tabIndex={tabIndex}
                  aria-label={'input new interview name'}
                />
              </div>

              <div style={{ textAlign: 'right', marginTop: 20 }}>
                <button
                  className="brand-blue-color button-maker text-14-normal"
                  onClick={this.toggleFunction}
                  tabIndex={tabIndex}
                  aria-label={`Click here to close the pop-up and go back`}>
                  Cancel
                </button>
                <button
                  className="button btn-primary"
                  style={{ marginLeft: 72, width: 136, height: 38 }}
                  onClick={this.submitName}
                  tabIndex={tabIndex}
                  aria-label={`Click here to submit`}
                  disabled={this.state.buttonDisable}>
                  OK
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    appIntKey: state.appIntKey.key,
    intDetails: state.interviewEP,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(RenameModal)
