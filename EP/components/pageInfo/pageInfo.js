import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals } from './../../actions/commonActions'

var Loader = require('react-loaders').Loader

class PageInfo extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      modalToggle: false,
    }
  }

  componentDidMount() {}

  modalToggler() {
    this.setState({ modalToggle: !this.state.modalToggle })
  }

  render() {
    return (
      <div>
        <div
          onClick={() => {
            this.modalToggler()
          }}
          className="pageInfo hidden">
          <span>?</span>
        </div>

        {this.state.modalToggle ? (
          <div className="fullScreenCover">
            <div className="epModal">
              <span
                className="epModalClose"
                onClick={() => {
                  this.modalToggler()
                }}>
                <span className="ep-icon-close"></span>
              </span>

              <div className="epModalContent">{this.props.children}</div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    common: state.commonStuff,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageInfo)
