import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setFloatingVideoPlaying } from './../../actions/actions'
import $ from 'jquery'

const ModalHOC = WrappedComponent => {
  class HOC extends Component {
    constructor(props) {
      super(props)
      this.state = {}
    }
    componentDidMount() {
      this.props.setFloatingVideoPlaying(false)

      $('body').css({ overflow: 'hidden', position: 'fixed', width: '100%' })
    }

    componentWillUnmount() {
      this.props.setFloatingVideoPlaying(true)
      $('body').css({ overflow: 'auto', position: 'initial' })
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  function mapStateToProps(state, ownProps) {
    return {
      videoRes: state.convertVideoRes.status,
      isVideoNormal: state.videoInfo.isVideoNormal,
      videoFloating: state.videoInfo.videoFloating,
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      setFloatingVideoPlaying: val => {
        dispatch(setFloatingVideoPlaying(val))
      },
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(HOC)
}

export default ModalHOC
