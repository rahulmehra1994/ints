import React from 'react'
import { mutuals, common } from './../../actions/commonActions'
var getColor = val => {
  if (val === common.sectionStatus[0]) {
    return common.lightBgColor[0]
  }
  if (val === common.sectionStatus[1]) {
    return common.lightBgColor[1]
  }
  if (val === common.sectionStatus[2]) {
    return common.lightBgColor[2]
  }
}

export let DetailInfoHeader = props => {
  let bgColor = getColor(props.status)
  return (
    <div className="test3">
      <div>
        <img
          style={{ width: 56, height: 51 }}
          src={props.img}
          alt={props.alt}
        />
      </div>
      <div>
        <div className="clearfix">
          <h1 className="mainHead float-left">{props.label}</h1>

          <div
            className="test2 float-left ml-6"
            style={{
              background: bgColor,
            }}>
            <div
              className="rounded-full float-left"
              style={{
                width: 12,
                height: 12,
                background: props.color,
                marginTop: 3,
              }}></div>
            <div id="firstFocusComp" className="paraHead float-left ml-2">
              {props.status}
            </div>
          </div>
        </div>
        <div className="hint mt-4">{props.underMsg}</div>
      </div>
    </div>
  )
}
