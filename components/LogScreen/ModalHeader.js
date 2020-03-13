import React, { Component } from 'react'
import classNames from 'classnames'
import { logModalAriaLabel } from '../Constants/AriaLabelText'

class ModalHeader extends Component {
  render() {
    const { hideLogModal, sectionName } = this.props

    return (
      <div className="as-edit-heading-wrapper">
        <a
          href="javascript:void(0);"
          aria-label={logModalAriaLabel['close']}
          onClick={hideLogModal}
          className="icon-cross as-edit-close-btn modal-close-button"
        />
        <div className="as-edit-heading">
          Log of changes <small>({sectionName})</small>
        </div>
      </div>
    )
  }
}
export default ModalHeader
