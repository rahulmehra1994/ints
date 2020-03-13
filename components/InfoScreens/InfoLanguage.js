import React, { Component } from 'react'
import { sectionData } from '../Constants/InfoScreenText'
import { infoScreenAriaLabel } from '../Constants/AriaLabelText'
import $ from 'jquery'

export default class InfoLanguage extends Component {
  handleTab(id, tabId) {
    $('.language-info')
      .find('li')
      .removeClass('active')
      .attr('aria-selected', false)
    $('.language-info')
      .find('div')
      .removeClass('in active')
    $(tabId)
      .addClass('active')
      .attr('aria-selected', true)
    $(id).addClass('in active')
  }

  render() {
    const { currentSection } = this.props

    return (
      <div>
        <div className="container-fluid bg-white language-info padding-6p">
          <div className="row">
            <div className="col-sm-12">
              <div className="close-icon">
                <a
                  aria-label={infoScreenAriaLabel['close']}
                  role="button"
                  onClick={() => this.props.hideModal()}>
                  {' '}
                  X
                </a>
              </div>
              <h2> Language</h2>
              <div className="language-icon">
                <img
                  src={`${process.env.APP_BASE_URL}dist/images/language-icon.jpg`}
                  width="60"
                  alt=""
                />
              </div>
              <div className="info-right-data ">
                <h3
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['language']['what']}>
                  What is the role of language in Linkedin profile?
                </h3>
                <p
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['language']['text']}>
                  Your language plays a huge role in guiding the recruiter’s
                  decision to continue reading your profile or not. Make sure
                  that you avoid basic grammatical mistakes, write in consistent
                  tense and avoid overuse of words.
                </p>
              </div>
              <div className="row margin-4p">
                <ul className="nav nav-tabs" role="tablist">
                  <li
                    role="tab"
                    className="active"
                    aria-selected={true}
                    id="avoidedwordsTab">
                    <a
                      aria-label="check Avoided words Sample"
                      role="button"
                      aria-controls="avoidedwords"
                      onClick={this.handleTab.bind(
                        this,
                        '#avoidedwords',
                        '#avoidedwordsTab'
                      )}
                      data-toggle="tab">
                      Avoided Words
                    </a>
                  </li>
                  <li role="tab" id="verboverusageTab" aria-selected={false}>
                    <a
                      aria-label="check verb Overusage Sample"
                      role="button"
                      aria-controls="verboverusage"
                      onClick={this.handleTab.bind(
                        this,
                        '#verboverusage',
                        '#verboverusageTab'
                      )}
                      data-toggle="tab">
                      Verb Overusage
                    </a>
                  </li>
                  <li role="tab" id="voiceTab" aria-selected={false}>
                    <a
                      aria-label="check voice Consistency Sample"
                      role="button"
                      aria-controls="voice"
                      onClick={this.handleTab.bind(
                        this,
                        '#voice',
                        '#voiceTab '
                      )}
                      data-toggle="tab">
                      Voice Consistency
                    </a>
                  </li>
                  <li role="tab" id="tenseconsistencyTab" aria-selected={false}>
                    <a
                      aria-label="check tense consistency Sample"
                      role="button"
                      aria-controls="tenseconsistency"
                      onClick={this.handleTab.bind(
                        this,
                        '#tenseconsistency',
                        '#tenseconsistencyTab'
                      )}
                      data-toggle="tab">
                      Tense Consistency
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    role="tabpanel"
                    className="tab-pane fade in active"
                    id="avoidedwords">
                    <div className="row">
                      <div
                        className="col-sm-6"
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['language']['sectionData'][
                            'avoidedwords'
                          ][currentSection]['text']
                        }>
                        {sectionData['avoidedwords'][currentSection]['text']}
                      </div>
                      <div className="col-sm-6">
                        <h3 className="smp-heading"> Sample Bullets</h3>
                        <div className="smp-bullets smp-gray-bg border-radius-5 margin-bottom-20">
                          <div className="smp-icon smp-green">
                            <i className="fa fa-thumbs-up" aria-hidden="true" />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['language']['sectionData'][
                                  'avoidedwords'
                                ][currentSection]['correct']
                              }>
                              Correct way
                            </h4>
                            {
                              sectionData['avoidedwords'][currentSection][
                                'correct'
                              ]
                            }
                          </div>
                        </div>
                        <div className="smp-bullets smp-gray-bg border-radius-5">
                          <div className="smp-icon smp-red">
                            <i
                              className="fa fa-thumbs-down"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['language']['sectionData'][
                                  'avoidedwords'
                                ][currentSection]['incorrect']
                              }>
                              Incorrect way
                            </h4>
                            {
                              sectionData['avoidedwords'][currentSection][
                                'incorrect'
                              ]
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    role="tabpanel"
                    className="tab-pane fade"
                    id="verboverusage">
                    <div className="row">
                      <div
                        className="col-sm-6"
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['language']['sectionData'][
                            'verboverusage'
                          ][currentSection]['text']
                        }>
                        {sectionData['verboverusage'][currentSection]['text']}
                      </div>
                      <div className="col-sm-6">
                        <h3 className="smp-heading"> Sample Bullets</h3>
                        <div className="smp-bullets smp-gray-bg border-radius-5 margin-bottom-20">
                          <div className="smp-icon smp-green">
                            <i className="fa fa-thumbs-up" aria-hidden="true" />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['language']['sectionData'][
                                  'avoidedwords'
                                ][currentSection]['correct']
                              }>
                              Correct way
                            </h4>
                            {
                              sectionData['verboverusage'][currentSection][
                                'correct'
                              ]
                            }
                          </div>
                        </div>
                        <div className="smp-bullets smp-gray-bg border-radius-5">
                          <div className="smp-icon smp-red">
                            <i
                              className="fa fa-thumbs-down"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['language']['sectionData'][
                                  'avoidedwords'
                                ][currentSection]['incorrect']
                              }>
                              Incorrect way
                            </h4>
                            {
                              sectionData['verboverusage'][currentSection][
                                'incorrect'
                              ]
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="voice">
                    <div className="row">
                      <div
                        className="col-sm-6"
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['language']['sectionData'][
                            'voice'
                          ][currentSection]['text']
                        }>
                        {sectionData['voice'][currentSection]['text']}
                      </div>
                      <div className="col-sm-6">
                        <h3 className="smp-heading"> Sample Bullets</h3>
                        <div className="smp-bullets smp-gray-bg border-radius-5 margin-bottom-20">
                          <div className="smp-icon smp-green">
                            <i className="fa fa-thumbs-up" aria-hidden="true" />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['language']['sectionData'][
                                  'avoidedwords'
                                ][currentSection]['correct']
                              }>
                              Correct way
                            </h4>
                            {sectionData['voice'][currentSection]['correct']}
                          </div>
                        </div>
                        <div className="smp-bullets smp-gray-bg border-radius-5">
                          <div className="smp-icon smp-red">
                            <i
                              className="fa fa-thumbs-down"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['language']['sectionData'][
                                  'avoidedwords'
                                ][currentSection]['incorrect']
                              }>
                              Incorrect way
                            </h4>
                            {sectionData['voice'][currentSection]['incorrect']}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    role="tabpanel"
                    className="tab-pane fade"
                    id="tenseconsistency">
                    <div className="row">
                      <div
                        className="col-sm-6"
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['language']['sectionData'][
                            'tenseconsistency'
                          ][currentSection]['text']
                        }>
                        {
                          sectionData['tenseconsistency'][currentSection][
                            'text'
                          ]
                        }
                      </div>
                      <div className="col-sm-6">
                        <h3 className="smp-heading"> Sample Bullets</h3>
                        <div className="smp-bullets smp-gray-bg border-radius-5 margin-bottom-20">
                          <div className="smp-icon smp-green">
                            <i className="fa fa-thumbs-up" aria-hidden="true" />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['language']['sectionData'][
                                  'avoidedwords'
                                ][currentSection]['correct']
                              }>
                              Correct way
                            </h4>
                            {
                              sectionData['tenseconsistency'][currentSection][
                                'correct'
                              ]
                            }
                          </div>
                        </div>
                        <div className="smp-bullets smp-gray-bg border-radius-5">
                          <div className="smp-icon smp-red">
                            <i
                              className="fa fa-thumbs-down"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['language']['sectionData'][
                                  'avoidedwords'
                                ][currentSection]['incorrect']
                              }>
                              Incorrect way
                            </h4>
                            {
                              sectionData['tenseconsistency'][currentSection][
                                'incorrect'
                              ]
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
