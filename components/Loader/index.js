import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

const data = {
  edited_data: {
    text: 'Rescoring based on changes',
  },
  resume: {
    text: 'Resume loading',
  },
  pdf: {
    text: 'Full profile loading',
  },
  changed_function: {
    text: 'New target function loading',
  },
}

class Loader extends Component {
  render() {
    const {
      loaderInput,
      sectionName,
      processedModulesCount,
      padding,
    } = this.props

    if (!data.hasOwnProperty(loaderInput)) {
      return null
    }

    let percent = 0

    if (
      !_.isNull(processedModulesCount) &&
      processedModulesCount['total'] > 0
    ) {
      percent = Math.ceil(
        (processedModulesCount['processed'] / processedModulesCount['total']) *
          100
      )
    }

    let spacing = 0

    if (!_.isUndefined(padding)) {
      spacing = padding
    }

    let styles = {
      width: 'calc(100%-' + spacing + 'px',
      left: spacing + 'px',
      right: spacing + 'px',
    }

    return (
      <div
        className="progress-bar-black-box loader-z-index"
        style={styles}
        aria-live="polite">
        <div className="edit-progress-overlay">
          <div className="div-progress">
            <div
              className="progress-color-blue"
              style={{ width: percent + '%' }}
            />
          </div>
          <p>{data[loaderInput]['text']}</p>
          <UpdateLoaderPercent percent={percent} />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    loaderInput: state.aspireFeedbackData.mini_loader_text,
    processedModulesCount: state.aspireFeedbackData.processed_modules_count,
  }
}

export default connect(
  mapStateToProps,
  {}
)(Loader)

const UpdateLoaderPercent = props => {
  return (
    <div key={props.percent} className="progress-number">
      {props.percent}%{' '}
    </div>
  )
}
