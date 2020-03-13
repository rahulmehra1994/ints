import React, { Component } from 'react'
// import Modal from 'react-bootstrap/lib/Modal'
import InfoCategories from './InfoCategories'
import InfoLanguage from './InfoLanguage'
import InfoImpact from './InfoImpact'
import InfoProfileVisibility from './InfoProfileVisibility'
import InfoSkills from './InfoSkills'
import InfoProfileStrength from './InfoProfileStrength'
import InfoProfilePicture from './InfoProfilePicture'
import InfoConnection from './InfoConnection'
import { Modal, ModalBody } from '@vmockinc/dashboard/Common/commonComps/Modal'
import FocusLock, { MoveFocusInside } from 'react-focus-lock'
import classNames from 'classnames'

const componentMap = {
  categories: InfoCategories,
  language: InfoLanguage,
  impact: InfoImpact,
  seo: InfoProfileVisibility,
  skills: InfoSkills,
  score: InfoProfileStrength,
  picture: InfoProfilePicture,
  connection: InfoConnection,
}

export default class InfoScreens extends Component {
  render() {
    const { show, module, currentSection, hideModal } = this.props
    const CurrentComponent = componentMap[module]
    const { extendModalClass = '' } = this.props

    return (
      <div>
        <FocusLock disabled={!show} returnFocus={true}>
          <Modal
            className={classNames('as-info-modal', extendModalClass)}
            isOpen={show}
            onRequestHide={hideModal}>
            <ModalBody>
              <CurrentComponent
                currentSection={currentSection}
                hideModal={hideModal}
              />
            </ModalBody>
          </Modal>
        </FocusLock>
      </div>
    )
  }
}
