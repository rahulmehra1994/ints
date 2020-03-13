import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import _ from 'underscore'
import { setBubbleCount } from '../../actions/CustomerFeedback'

class FeedbackRating extends Component {
  highlightBubble(e) {
    const { setBubbleCount, column } = this.props
    var count = e.target.dataset.count
    setBubbleCount(count, column)
  }

  unhighlightBubble() {
    const { setBubbleCount, column } = this.props
    setBubbleCount(0, column)
  }

  handleOptionClick(value) {
    const { setFeedbackRating, column } = this.props
    var count = value
    setFeedbackRating(count, column)
  }

  handleClick(e) {
    const { setFeedbackRating, column } = this.props
    var count = e.target.dataset.count
    this.highlightBubble(e)
    setFeedbackRating(count, column)
  }

  render() {
    const {
      customerFeedback,
      className,
      rating,
      column,
      setFeedbackRating,
    } = this.props
    var starColor = 'default-bubble-color'
    var count = customerFeedback[column] || rating
    return (
      <div className="feedback-rating-parameter">
        <div className="row" tabIndex={-1}>
          <div className={className}>
            <button
              aria-label={'rate 1'}
              // onFocus={this.highlightBubble.bind(this)}
              // onBlur={this.unhighlightBubble.bind(this)}
              onMouseOver={this.highlightBubble.bind(this)}
              onMouseOut={this.unhighlightBubble.bind(this)}
              onClick={this.handleClick.bind(this)}
              data-count={1}
              className={
                count > 0
                  ? `rating-bubble bg-danger`
                  : `rating-bubble ${starColor}`
              }>
              1
            </button>
          </div>

          <div className={className}>
            <button
              aria-label={'rate 2'}
              // onFocus={this.highlightBubble.bind(this)}
              // onBlur={this.unhighlightBubble.bind(this)}
              onMouseOver={this.highlightBubble.bind(this)}
              onMouseOut={this.unhighlightBubble.bind(this)}
              onClick={this.handleClick.bind(this)}
              data-count={2}
              className={
                count > 1
                  ? `rating-bubble bg-orange`
                  : `rating-bubble ${starColor}`
              }>
              2
            </button>
          </div>

          <div className={className}>
            <button
              aria-label={'rate 3'}
              // onFocus={this.highlightBubble.bind(this)}
              // onBlur={this.unhighlightBubble.bind(this)}
              onMouseOver={this.highlightBubble.bind(this)}
              onMouseOut={this.unhighlightBubble.bind(this)}
              onClick={this.handleClick.bind(this)}
              data-count={3}
              className={
                count > 2
                  ? `rating-bubble bg-warning`
                  : `rating-bubble ${starColor}`
              }>
              3
            </button>
          </div>

          <div className={className}>
            <button
              aria-label={'rate 4'}
              // onFocus={this.highlightBubble.bind(this)}
              // onBlur={this.unhighlightBubble.bind(this)}
              onMouseOver={this.highlightBubble.bind(this)}
              onMouseOut={this.unhighlightBubble.bind(this)}
              onClick={this.handleClick.bind(this)}
              data-count={4}
              className={
                count > 3
                  ? `rating-bubble bg-light-green`
                  : `rating-bubble ${starColor}`
              }>
              4
            </button>
          </div>

          <div className={className}>
            <button
              aria-label={'rate 5'}
              // onFocus={this.highlightBubble.bind(this)}
              // onBlur={this.unhighlightBubble.bind(this)}
              onMouseOver={this.highlightBubble.bind(this)}
              onMouseOut={this.unhighlightBubble.bind(this)}
              onClick={this.handleClick.bind(this)}
              data-count={5}
              className={
                count > 4
                  ? `rating-bubble bg-success`
                  : `rating-bubble ${starColor}`
              }>
              5
            </button>
          </div>
          <div className={className}>
            {/* <select aria-label="select options" name="1">
              <option
                value="1"
                onChange={() => {
                  this.handleOptionClick(1)
                }}
              >
                1
              </option>
              <option
                value="2"
                onChange={() => {
                  this.handleOptionClick(2)
                }}
              >
                2
              </option>
              <option
                value="3"
                onChange={() => {
                  this.handleOptionClick(3)
                }}
              >
                3
              </option>
              <option
                value="4"
                onChange={() => {
                  this.handleOptionClick(4)
                }}
              >
                4
              </option>
              <option
                value="5"
                onChange={() => {
                  this.handleOptionClick(5)
                }}
              >
                5
              </option>
            </select> */}
          </div>
        </div>
      </div>
    )
  }
}

FeedbackRating.propTypes = {
  children: PropTypes.node,
}

function mapStateToProps(state, ownProps) {
  return {
    customerFeedback: state.customerFeedback,
  }
}

export default connect(
  mapStateToProps,
  { setBubbleCount }
)(FeedbackRating)
