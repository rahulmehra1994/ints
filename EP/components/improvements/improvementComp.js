import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import ReactHtmlParser from 'react-html-parser'
import ModalHOC from './../hoc/ModalHOC'
import { mutuals } from './../../actions/commonActions'
import AsyncImage from './../Loading/asyncImage'

const FocusTrap = require('focus-trap-react')
var Loader = require('react-loaders').Loader

const improvementSection =
  process.env.APP_BASE_URL + '/dist/images/new/improvement-section.svg'

class Improvement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalStatus: new Array(100).fill(false),
      key: '',
      cat: '',
      tabIndexes: {
        'eye-contact': -1,
        'facial-expression': -1,
        gesture: -1,
        'body-posture': -1,
        appearance: -1,
        'word-usage': -1,
        'sentence-analysis': -1,
        'vocal-features': -1,
        'appropriate-pauses': -1,
        disfluencies: -1,
        'speech-modulation': -1,
      },
      tabIndexesMain: {
        [this.props.appUrls.eyeGaze]: 24,
        [this.props.appUrls.smile]: 34,
        [this.props.appUrls.gesture]: 44,
        [this.props.appUrls.body]: 54,
        [this.props.appUrls.appearance]: 64,
        [this.props.appUrls.word]: 74,
        [this.props.appUrls.sentence]: 84,
        [this.props.appUrls.vocal]: 94,
        [this.props.appUrls.pauses]: 104,
        [this.props.appUrls.disfluencies]: 114,
        [this.props.appUrls.modulation]: 124,
        [this.props.appUrls.videosummary]: 134,
      },
    }
  }

  componentDidMount() {
    var loc = window.location.pathname
    var cat = loc.split('/')[5]
    this.setState({ category: cat })
    this.tabIndexDeactivate()
  }

  componentWillReceiveProps(props) {
    if (this.props.location.pathname !== props.location.pathname) {
      var loc = props.location.pathname
      var cat = loc.split('/')[4]
      this.setState({ category: cat })
      this.tabIndexDeactivate()
    }
  }

  modalToggler(index, title) {
    if (this.refs.floatingPlayer) this.refs.floatingPlayer.pause()
    let status
    this.state.modalStatus[index] ? (status = '_closed') : (status = '_opened')

    mutuals.socketTracking({
      event_type: 'click',
      event_description: 'Article ' + title + status,
    })

    this.state.modalStatus[index] = !this.state.modalStatus[index]
    this.setState({ modalStatus: this.state.modalStatus })
  }

  tabIndexActivate() {
    this.setState(
      {
        tabIndexes: {
          'eye-contact': 24,
          'facial-expression': 34,
          gesture: 44,
          'body-posture': 54,
          appearance: 64,
          'word-usage': 74,
          'sentence-analysis': 84,
          'vocal-features': 94,
          'appropriate-pauses': 104,
          disfluencies: 114,
          'speech-modulation': 124,
        },
      },
      () => {
        var elements = document.getElementsByClassName('improv')
        elements[0].focus()
      }
    )
  }

  tabIndexDeactivate() {
    this.setState({
      tabIndexes: {
        'eye-contact': -1,
        'facial-expression': -1,
        gesture: -1,
        'body-posture': -1,
        appearance: -1,
        'word-usage': -1,
        'sentence-analysis': -1,
        'vocal-features': -1,
        'appropriate-pauses': -1,
        disfluencies: -1,
        'speech-modulation': -1,
      },
    })
  }

  render() {
    let { tabIndexesMain, category, tabIndexes } = this.state
    let compLoader = this.props.common.compLoader
    let improveArticles = this.props.improveArticles

    if (improveArticles.length <= 0) {
      return (
        <div className="cardStyle clearfix bg-white p-6 mt-4">
          <div className="clearfix loaderWrap">
            <Loader
              type={compLoader.type}
              active
              style={{ transform: compLoader.scale }}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div
          className="cardStyle clearfix bg-white p-6"
          tabIndex={tabIndexesMain[this.props.location.pathname]}
          onKeyPress={e => {
            if (e.key === 'Enter' && tabIndexes[category] === -1) {
              this.tabIndexActivate()
            }
          }}
          aria-label={`Suggested Reads this section provides access to relevant guidance based articles ${
            tabIndexes[category] === -1 ? 'select to continue further' : ''
          }`}>
          <div className="subHead">
            <img src={improvementSection} alt="Suggested Reads" />
            <span className="ml-4">Suggested Reads</span>
          </div>

          <div className="hr mt-4" />

          {improveArticles.map((item, index) => {
            return category === item.category ? (
              <div
                className="improv"
                key={index}
                tabIndex={tabIndexes[category]}
                aria-label={`${item.title}. click to read more.`}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    this.modalToggler(index, item.title)
                  }
                }}>
                <div
                  className="clearfix relative mt-6 cursor-pointer"
                  onClick={() => {
                    this.modalToggler(index, item.title)
                  }}>
                  <span className="float-left w-1/5 text-center">
                    <AsyncImage
                      src={item.thumbnails}
                      width={60}
                      height={38}
                      loaderSize={0.4}
                      alt={item.title}
                    />
                  </span>
                  <div className="float-left w-4/5 pl-6">
                    <div className="paraHead elipsis">{item.title}</div>

                    <div className="hint elipsis">{item.summary}</div>
                  </div>
                </div>

                {this.state.modalStatus[index] ? (
                  // <FocusTrap>
                    <Modal
                      item={item}
                      index={index}
                      modalToggler={this.modalToggler.bind(this)}
                    />
                  // </FocusTrap>
                ) : null}
              </div>
            ) : null
          })}
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  let combinedRes = null

  if (!_.isEmpty(state.results)) {
    if (state.results.eyeResults) {
      combinedRes = state.results.eyeResults
    }
  }

  return {
    combinedRes: combinedRes,
    common: state.commonStuff,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
    gentleData: !_.isEmpty(state.gentleResults) ? state.gentleResults : null,
    punctData: !_.isEmpty(state.punctuatorResults)
      ? state.punctuatorResults
      : null,
    improveArticles: state.improveArticles,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export class ModalTemplate extends Component {
  constructor(props) {
    super(props)
    this.attachEscEvent()
  }

  attachEscEvent() {
    document.onkeydown = e => {
      if (e.key === 'Escape')
        this.props.modalToggler(this.props.index, this.props.item.title)
    }
  }

  componentWillUnmount() {
    document.onkeydown = null
  }

  render() {
    let { props } = this
    return (
      <div className="epModalCover">
        <div className="epModal">
          <div className="text-24-bold pl-16 pt-16 pb-8">Suggested Reads</div>

          <button
            className="epModalClose"
            style={{ zIndex: 1 }}
            onClick={() => {
              props.modalToggler(props.index, props.item.title)
            }}
            tabIndex="1"
            aria-label={'improvement modal close button'}>
            <span className="ep-icon-close"></span>
          </button>

          <AsyncImage
            src={props.item.images}
            width={768}
            height={256}
            loaderSize={1.2}
            alt={props.item.title}
            style={{ borderRadius: 0 }}
          />

          <div className="epModalContent">
            <div className="subHead mt-8">{props.item.title}</div>
            <div className="mt-6">
              {ReactHtmlParser(props.item.description)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Modal = ModalHOC(ModalTemplate)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Improvement)
