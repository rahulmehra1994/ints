import React from 'react'
import _ from 'underscore'
import classNames from 'classnames'

export const InfoComponent = props => {
  const {
    icon = 'bulb',
    iconClass = 'col-sm-2',
    bullet = [],
    content = '',
    tabIndex = 0,
    showInfoBtn = false,
    backgroundClass = 'info',
    componentClass = '',
    showBorderBottom = true,
  } = props
  let bulletComponent = (
    <ul className="col col-sm-10 info-comp-bullet-box">
      {_.map(bullet, (value, key) => {
        return <li key={key}>{value}</li>
      })}
    </ul>
  )
  let contentComponent = (
    <div className="col col-sm-11 info-comp-content-box">{content}</div>
  )
  return (
    <div className="info-component-wrapper">
      <div
        className={classNames(
          'info-feedback-block',
          backgroundClass,
          componentClass
        )}>
        <div className="row info-comp-box margin-lr-0">
          <div className={classNames('col info-comp-icon', iconClass)}>
            <span className={`icon-${icon} icon-class`} />
          </div>
          {!_.isEmpty(bullet) ? bulletComponent : contentComponent}
        </div>
        {showInfoBtn ? (
          <div className="info-btn-cont">
            <div className="info-comp-btn">
              <a
                href="javascript:void(0);"
                onClick={props.infoFunction}
                tabIndex={tabIndex}
                aria-label={'Click for more info'}>
                <span className="icon-info info-btn-icon" />
                &nbsp;Click to see more details
              </a>
            </div>
          </div>
        ) : null}
      </div>
      {showBorderBottom ? (
        <div className="border-gray-bottom margin-bottom-15" />
      ) : null}
    </div>
  )
}
