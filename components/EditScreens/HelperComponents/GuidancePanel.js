import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Panel, Accordion } from 'react-bootstrap'

export default class GuidancePanel extends Component {
  constructor(props) {
    super(props)
  }

  getArrowIcon(isOpen) {
    if (isOpen == false) {
      return (
        <span
          className="fa fa-angle-down as-icon-angle-down-up"
          aria-hidden="true"
        />
      )
    } else {
      return (
        <span
          className="fa fa-angle-up as-icon-angle-down-up"
          aria-hidden="true"
        />
      )
    }
  }

  getHeader(heading, isOpen) {
    return (
      <div className="as-guidance-panel-header">
        <div className="as-guidance-panel-heading">
          <span className="pull-left">{heading}</span>{' '}
          {this.getArrowIcon(isOpen)}
        </div>
      </div>
    )
  }

  render() {
    const {
      subModule,
      heading,
      isOpen,
      handleGuidanceToggle,
      correctWayText,
      incorrectWayText,
      correctWayAriaLabel,
      incorrectWayAriaLabel,
      type,
    } = this.props
    return (
      <Panel
        className="as-guidance-panel"
        expanded={isOpen}
        onToggle={() => handleGuidanceToggle(subModule, type)}>
        <Panel.Heading>
          <Panel.Title className="as-guidance-title">
            <Panel.Toggle
              className="as-guidance-toggle-btn"
              componentClass="button"
              role="button"
              tabIndex={0}
              aria-label={'Click for guidance'}>
              {this.getHeader(heading, isOpen)}
            </Panel.Toggle>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <div className="as-guidance-submodule-container">
              <div className="as-guidance-left">
                <div className="as-guidance-left-icon as-guidance-left-red">
                  <span className="fa fa-thumbs-down" aria-hidden="true" />
                </div>
              </div>
              <div className="as-guidance-right">
                <div className="as-guidance-example-heading">
                  <span tabIndex={0} aria-label={incorrectWayAriaLabel}>
                    Incorrect Way
                  </span>
                </div>
                <div
                  className="as-guidance-example-text"
                  dangerouslySetInnerHTML={{ __html: incorrectWayText }}
                />
              </div>
            </div>
            <div className="as-guidance-submodule-border-top" />
            <div className="as-guidance-submodule-container">
              <div className="as-guidance-left">
                <div className="as-guidance-left-icon as-guidance-left-green">
                  <span className="fa fa-thumbs-up" aria-hidden="true" />
                </div>
              </div>
              <div className="as-guidance-right">
                <div className="as-guidance-example-heading">
                  <span tabIndex={0} aria-label={correctWayAriaLabel}>
                    Correct Way
                  </span>
                </div>
                <div
                  className="as-guidance-example-text"
                  dangerouslySetInnerHTML={{ __html: correctWayText }}
                />
              </div>
            </div>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    )
  }
}
