import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'
import {
  oneOrMany2,
  singleOrPlural,
  getStatusIcon,
  isOrAre,
  common,
  highContrast,
  mutuals,
} from './../../actions/commonActions'
import _ from 'underscore'

var classNames = require('classnames')
const Msg = props => {
  return (
    <div className="text-14-normal" style={{ paddingBottom: 15 }}>
      {common.sectionStatus[props.status]}! There {isOrAre(props.data.length)}{' '}
      <span className="paraHead">
        {singleOrPlural(props.data.length, props.category)}
      </span>{' '}
      in your pitch. Vmock recommends{' '}
      <span className="paraHead italic">
        {' '}
        {singleOrPlural(props.range, props.category)}{' '}
        {props.range > 0 ? 'or more' : ''}
      </span>{' '}
      in your pitch.
    </div>
  )
}

export default class WordComponent extends Component {
  constructor(...props) {
    super(...props)
    this.state = {
      count: 0,
    }
  }

  toggleinfo = () => {
    let state = this.props.categories[this.props.category] ? 'closed' : 'opened'

    mutuals.socketTracking({
      event_type: 'click',
      event_description: `Dropdown ${this.props.type} ${state}`,
    })

    this.props.toggleAll(this.props.category)

    try {
      document.querySelector('. bar').scrollTo(0, 0)
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    let { categories, category, tabIndex, status } = this.props
    let message = ''
    let classname
    let data = []

    if (this.props.results) {
      data = this.props.results.map((item, index) => {
        if (item['content'] === '') return null

        if (item['type'] === 3 || item['type'] === 5)
          classname = highContrast ? 'accessiblityGreenBg' : 'greenBg'
        else classname = highContrast ? 'accessiblityRedBg' : 'redBg'

        let highlightedSentence = item['sentence']
        highlightedSentence = highlightedSentence.replace(
          new RegExp('\\b' + 'word-----highlight' + '\\b', 'gi'),
          classname
        )

        return (
          <div
            className="word-component-member"
            style={{
              borderBottom:
                index + 1 === this.props.results.length
                  ? ''
                  : '1px solid lightgray',
            }}
            key={index}>
            <div className="row-member-one">{item['content']}</div>
            <div className="row-member-two">{item['frequency']}</div>
            <div className="row-member-three">
              {ReactHtmlParser(
                highlightedSentence
                  .split('||')
                  .join(`<br /><div class="line-height- " />`)
              )}
            </div>
          </div>
        )
      })
    }

    switch (this.props.type) {
      case 'Filler words':
        message = (
          <Msg
            category={'filler word'}
            data={data}
            range={0}
            status={this.props.status}
          />
        )
        break
      case 'Specifics':
        message = (
          <Msg
            category={'specific word'}
            data={data}
            range={3}
            status={this.props.status}
          />
        )
        break
      case 'Action oriented terms':
        message = (
          <Msg
            category={'action-oriented word'}
            data={data}
            range={3}
            status={this.props.status}
          />
        )
        break
      case 'Repetitive terms':
        message = (
          <Msg
            category={'repetitive term'}
            data={data}
            range={0}
            status={this.props.status}
          />
        )
        break
      case 'Negative terms':
        message = (
          <Msg
            category={'negative term'}
            data={data}
            range={0}
            status={this.props.status}
          />
        )
        break
      default:
        break
    }

    if (this.props.results.length > 0) {
      this.props.openFirstFilled(category)
    }

    return (
      <div className="word-component-container">
        <div className="word-component-heading">
          <div className="heading-left mr-4">
            <span className="">{getStatusIcon[this.props.status]}</span>
            <span className="ml-6 capitalize">{this.props.type}</span>
          </div>

          <div className="heading-right">
            <span style={{ color: common.sectionColor[this.props.status] }}>
              {' '}
              {oneOrMany2('entry', data.length)}
            </span>{' '}
            <span
              className={classNames({
                'grey-color': highContrast,
                'grey-color': !highContrast,
              })}>
              (Goodrange: {this.props.goodrange})
            </span>
          </div>

          <div
            onClick={this.toggleinfo}
            className={classNames('downArrow cursor-pointer onEnterFocusAda', {
              animateDirDown: categories[category],
              animateDirUp: !categories[category],
            })}
            tabIndex={tabIndex}
            onKeyPress={e => (e.key === 'Enter' ? this.toggleinfo() : null)}
            aria-label={`${
              categories[category]
                ? `This is an contract button. Click here to hide more details of ${category}`
                : `This is an expand button. Click here to view more details of ${category}`
            }`}>
            <span className="ep-icon-drop-down" style={{ fontSize: 25 }} />
          </div>
        </div>
        {categories[category] ? (
          <div
            className="word-component-  "
            style={{
              paddingLeft: '35px',
            }}>
            <div>{message}</div>

            {data.length !== 0 ? (
              <div>
                <div className="row-heading-one">Word</div>
                <div className="row-heading-two">No. of entries</div>
                <div className="row-heading-three">Sentence</div>
              </div>
            ) : null}
            {data}
          </div>
        ) : null}
      </div>
    )
  }
}
