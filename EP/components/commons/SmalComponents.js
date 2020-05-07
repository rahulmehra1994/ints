import React, { Component } from 'react'
import _ from 'underscore'
export function ExpandCollapseButton(props) {
  return (
    <div
      className={`flex justify-center items-center ${
        _.has(props, 'style') ? props.style.class : ''
      }`}
      onClick={props.toggleMethod}>
      {props.state ? (
        <React.Fragment>
          <span className="ep-icon-expand-up" />
          {_.has(props, 'textual') ? props.textual.expandText : null}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <span className="ep-icon-expand-down" />
          {_.has(props, 'textual') ? props.textual.collapseText : null}
        </React.Fragment>
      )}
    </div>
  )
}
