import React, { Component } from 'react'
import _ from 'underscore'

export default class Disclaimer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMouseInside: false,
    }
  }
  mouseEnter = () => {
    this.setState({ isMouseInside: true })
  }
  mouseLeave = () => {
    this.setState({ isMouseInside: false })
  }

  render() {
    let { isMouseInside } = this.state
    return (
      <div className="disclaimer">
        <div
          className="hover-section"
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}>
          <div className="disclaimer-label">
            <span className={`${this.props.config.icon} align-middle`}></span>
            {_.has(this.props, 'buttonText') ? (
              <span className="ml-4">{this.props.buttonText}</span>
            ) : null}
          </div>

          {isMouseInside ? (
            <div className="disclaimer-info" style={this.props.config.style}>
              {_.has(this.props, 'heading') ? (
                <div className="subHead">{this.props.heading}</div>
              ) : null}
              <div className={_.has(this.props, 'heading') ? null : 'mt-3'}>
                {this.props.body}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
