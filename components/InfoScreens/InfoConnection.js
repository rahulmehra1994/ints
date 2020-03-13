import React, { Component } from 'react'

export default class InfoConnection extends Component {
  render() {
    return (
      <div className="info-connect-body">
        <button
          className="text-btn"
          tabIndex={0}
          aria-label="Click to close the modal"
          onClick={this.props.hideModal}>
          <span className="icon-cross" />
        </button>
        <img
          src={`${process.env.APP_BASE_URL}dist/images/aspire_networking.jpg`}
          alt="info modal"
        />
      </div>
    )
  }
}
