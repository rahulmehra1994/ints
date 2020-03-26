import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
var Loader = require('react-loaders').Loader

class AsyncImage extends Component {
  constructor(props) {
    super(props)
    this.state = { loader: true }
  }

  render() {
    let { width, height, loaderSize, alt } = this.props
    let localStyle = {
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      borderRadius: 8,
    }

    let stl = {}

    if (_.has(this.props, 'style')) {
      stl = Object.assign(localStyle, this.props.style)
    } else {
      stl = Object.assign(localStyle, {})
    }

    return (
      <div className="relative" style={{ width, height }}>
        <img
          alt={alt}
          src={this.props.src}
          onLoad={() => {
            this.setState({ loader: false })
          }}
          style={stl}
        />
        {this.state.loader ? (
          <div className="loaderWrap bg-grey-lighter" style={stl}>
            <Loader
              type={'line-scale'}
              active
              style={{ transform: `scale(${loaderSize})` }}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = (state, defaultProps) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AsyncImage)
