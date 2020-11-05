import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import ReactHtmlParser from 'react-html-parser'
import ModalHOC from './../hoc/ModalHOC'
import { mutuals, log } from './../../actions/commonActions'

const FocusTrap = require('focus-trap-react')

class ModalTemplate extends Component {
  constructor(props) {
    super(props)
    this.attachEscEvent = this.attachEscEvent.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.attachEscEvent)
  }

  attachEscEvent(e) {
    if (e.key === 'Escape')
      this.props.modalClose(this.props.index, this.props.item)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.attachEscEvent)
  }

  render() {
    let { props } = this
    return (
      <FocusTrap>
        <div
          className="epModalCover grid"
          style={{
            gridTemplateColumns: '1fr 768px 1fr',
          }}>
          <div className="flex justify-center items-center">
            <button
              className="traverse-button-side"
              style={{ left: -100 }}
              onClick={() => {
                this.props.traverse('previous')
              }}
              tabIndex={0}
              aria-label={'article previous move button'}>
              <span className="ep-icon-expand-left text-white text-24-normal" />
            </button>
          </div>

          <div className="articles-scroll h-screen">
            <div className="epModal p-10">{this.props.content()}</div>
          </div>

          <div className="flex justify-center items-center">
            <button
              className="traverse-button-side"
              style={{ right: -100 }}
              onClick={() => {
                this.props.traverse()
              }}
              tabIndex={0}
              aria-label={'article forward move button'}>
              <span className="ep-icon-expand-right text-white text-24-normal" />
            </button>
          </div>
        </div>
      </FocusTrap>
    )
  }
}

export default ModalHOC(ModalTemplate)
