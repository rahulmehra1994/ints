import React, { Component } from 'react'
import Leftbar from './../leftbar/Leftbar'
import Contentbar from './../details/Contentbar'
import { connect } from 'react-redux'
import { mutuals, log } from './../../actions/commonActions'
import { toggleVideoFloating } from './../../actions/actions'
import VideoFloating from '../details/VideoFloating'
import VideoPreloader from './../utilities/VideoPreloader'

class Results extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeindex: null,
      showVideoPage: false,
      pauses: null,
    }
  }

  componentDidMount() {
    document.body.style.overflowY = 'hidden'
  }

  componentWillUnmount() {
    document.body.style.overflowY = 'auto'
  }

  updateActiveTab = index => {
    this.setState({ activeindex: index })

    if (index === 7) {
      this.setState({ showVideoPage: true })
    } else {
      this.setState({ showVideoPage: false })
    }
  }

  render() {
    return (
      <div className="results">
        <div className="clearfix mt-2">
          <Leftbar
            updateActiveTab={this.updateActiveTab}
            userInfo={this.props.userInfo}
            {...this.props}
          />

          <Contentbar {...this.props} location={this.props.location} />

          {this.props.videoFloating ? <VideoFloating /> : null}

          <VideoPreloader />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.user ? state.user.data : null,

    appUrls: state.appUrls,
    isVideoNormal: state.videoInfo.isVideoNormal,
    videoFloating: state.videoInfo.videoFloating,
    regularVideoState: state.videoInfo.regularVideoState,

    user: state.user.data,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleVideoFloating: val => {
      dispatch(toggleVideoFloating(val))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Results)
