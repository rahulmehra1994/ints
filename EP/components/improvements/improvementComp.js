import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import ReactHtmlParser from 'react-html-parser'
import ModalHOC from './../hoc/ModalHOC'
import { mutuals, log } from './../../actions/commonActions'
import AsyncImage from './../Loading/asyncImage'
import ContentLoader from 'react-content-loader'

const FocusTrap = require('focus-trap-react')
var Loader = require('react-loaders').Loader

const improvementSection =
  process.env.APP_BASE_URL + '/dist/images/new/improvement-section.svg'

class Improvement extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
      currentIndex: null,
      currentItem: null,
      articles: [],
      modalOpen: false,
    }
  }

  componentDidMount() {
    var loc = window.location.pathname
    var cat = loc.split('/')[5]
    this.setState({ category: cat })
    this.tabIndexDeactivate()
    this.modifyData(cat)
  }

  modifyData(cat) {
    let temp = this.props.improveArticles.filter((item, index) => {
      if (cat === item.category) return true
      else return false
    })

    this.setState({ articles: temp })
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (this.props.location.pathname !== props.location.pathname) {
      var loc = props.location.pathname
      var cat = loc.split('/')[4]
      this.setState({ category: cat })
      this.tabIndexDeactivate()
      this.modifyData(cat)
    }
  }

  modalOpener(index, item) {
    if (this.refs.floatingPlayer) this.refs.floatingPlayer.pause()
    mutuals.socketTracking({
      event_type: 'click',
      event_description: 'Article' + item.title + '_opened',
    })

    this.setState({ currentIndex: index, currentItem: item, modalOpen: true })
  }

  modalClose(index, item) {
    mutuals.socketTracking({
      event_type: 'click',
      event_description: 'Article' + item.title + '_closed',
    })

    this.setState({ modalOpen: false }, () => {
      this.setState({ currentIndex: null, currentItem: null })
    })
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

  forward() {
    if (this.state.currentIndex < this.state.articles.length - 1) {
      this.setState(
        {
          currentIndex: this.state.currentIndex + 1,
        },
        () => {
          this.setState({
            currentItem: this.state.articles[this.state.currentIndex],
          })
        }
      )
    } else {
      this.setState({ currentIndex: 0, currentItem: this.state.articles[0] })
    }
  }

  previous() {
    if (this.state.currentIndex > 0) {
      this.setState(
        {
          currentIndex: this.state.currentIndex - 1,
        },
        () => {
          this.setState({
            currentItem: this.state.articles[this.state.currentIndex],
          })
        }
      )
    } else {
      this.setState(
        {
          currentIndex: this.state.articles.length - 1,
        },
        () => {
          this.setState({
            currentItem: this.state.articles[this.state.currentIndex],
          })
        }
      )
    }
  }

  render() {
    let { tabIndexesMain, category, tabIndexes, articles } = this.state
    let compLoader = this.props.common.compLoader

    if (articles.length <= 0) {
      return (
        <div className="cardStyle clearfix bg-white p-6">
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

          {this.state.articles.map((item, index) => {
            return (
              <div
                className="improv"
                key={index}
                tabIndex={tabIndexes[category]}
                aria-label={`${item.title}. click to read more.`}
                onKeyPress={e => {
                  if (e.key === 'Enter') this.modalOpener(index, item)
                }}>
                <div
                  className="grid mt-4 cursor-pointer"
                  style={{ gridTemplateColumns: '60px 1fr' }}
                  onClick={() => {
                    this.modalOpener(index, item)
                  }}>
                  <div className="mt-1 relative">
                    <ContentLoader
                      speed={2}
                      width={96}
                      height={54}
                      viewBox="0 0 96 54"
                      backgroundColor="#dedede"
                      foregroundColor="#b7b7b7">
                      <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
                      <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
                      <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
                      <rect
                        x="92"
                        y="50"
                        rx="0"
                        ry="0"
                        width="61"
                        height="39"
                      />
                      <rect
                        x="11"
                        y="0"
                        rx="0"
                        ry="0"
                        width="223"
                        height="141"
                      />
                    </ContentLoader>

                    <img
                      className="border-radius-3 w-100 absolute pin z-100"
                      src={item.thumbnails}
                    />
                  </div>

                  <div className="pl-4   overflow-auto">
                    <div className="paraHead elipsis">{item.title}</div>

                    <div className="hint elipsis">{item.summary}</div>
                  </div>
                </div>
              </div>
            )
          })}

          {this.state.modalOpen ? (
            <Modal
              item={this.state.currentItem}
              index={this.state.currentIndex}
              modalClose={this.modalClose.bind(this)}
              forward={this.forward.bind(this)}
              previous={this.previous.bind(this)}
              articles={this.state.articles}
            />
          ) : null}
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    common: state.commonStuff,
    improveArticles: state.improveArticles,
  }
}

export class ModalTemplate extends Component {
  constructor(props) {
    super(props)
    this.attachEscEvent = this.attachEscEvent.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.attachEscEvent)
  }

  attachEscEvent(e) {
    if (e.key === 'Escape')
      this.props.modalClose(this.props.index, this.props.item)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.attachEscEvent)
  }

  render() {
    let { props } = this
    return (
      <FocusTrap>
        <div
          className="epModalCover grid"
          style={{
            gridTemplateColumns: '1fr 768px 1fr',
          }}>
          <div className="flex justify-center items-center">
            <button
              className="traverse-button-side"
              style={{ left: -100 }}
              onClick={() => {
                this.props.previous()
              }}
              tabIndex={0}
              aria-label={'article previous move button'}>
              <span className="ep-icon-expand-left text-white text-24-normal" />
            </button>
          </div>

          <div className="articles-scroll h-screen">
            <div className="epModal">
              <button
                className="epModalClose"
                style={{ zIndex: 1 }}
                onClick={() => {
                  props.modalClose(props.index, props.item)
                }}
                tabIndex={0}
                aria-label={'improvement modal close button'}>
                <span className="ep-icon-close"></span>
              </button>

              <div className="pl-10 pt-8">
                <img src={improvementSection} alt="Suggested Reads" />
                <span className="ml-4 hintColor">Suggested Reads</span>
              </div>

              <div className="text-24-bold pl-10 pt-2 pb-5">
                {props.item.title}
              </div>

              <AsyncImage
                src={props.item.images}
                width={768}
                height={256}
                loaderSize={1.2}
                alt={props.item.title}
                style={{ borderRadius: 0 }}
              />

              <div className="epModalContent overflow-auto">
                {ReactHtmlParser(props.item.description)}
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              className="traverse-button-side"
              style={{ right: -100 }}
              onClick={() => {
                this.props.forward()
              }}
              tabIndex={0}
              aria-label={'article forward move button'}>
              <span className="ep-icon-expand-right text-white text-24-normal" />
            </button>
          </div>
        </div>
      </FocusTrap>
    )
  }
}

const Modal = ModalHOC(ModalTemplate)

export default connect(mapStateToProps, {})(Improvement)
