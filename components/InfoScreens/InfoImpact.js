import React, { Component } from 'react'
import { infoScreenAriaLabel } from '../Constants/AriaLabelText'

const sectionData = {
  action_oriented: {
    Summary: {
      text: (
        <p>
          If you are including bullets in your summary section, begin with
          strong action verbs that inform the Recruiter of the exact actions YOU
          performed.
        </p>
      ),
      correct: (
        <p>
          <span>{String.fromCharCode(9642)} </span> Developed product roadmap
          and introduced new product features in collaboration with
          international cross-functional team; generated ideas to redesign
          product promotion strategies, leading to revenue growth of 15%
        </p>
      ),
      incorrect: (
        <p>
          <span>{String.fromCharCode(9642)} </span> Responsible for developing
          product roadmap and introducing new product feature in collaboration
          with international cross-functional team; generated ideas to redesign
          product promotion strategies, leading to revenue growth of 15%
        </p>
      ),
    },
    Experience: {
      text: (
        <p>
          Your experience needs to showcase the work YOU did. Begin your
          sentences with strong action verbs that inform the Recruiter of the
          exact actions YOU performed.
        </p>
      ),
      correct: (
        <p>
          {' '}
          <span>{String.fromCharCode(9642)} </span> Developed product roadmap
          and introduced new product feature in collaboration with international
          cross-functional team; generated ideas to redesign product promotion
          strategies, leading to revenue growth of 15%
        </p>
      ),
      incorrect: (
        <p>
          {' '}
          <span>{String.fromCharCode(9642)} </span> Responsible for developing
          product roadmap and introducing new product feature in collaboration
          with international cross-functional team; generated ideas to redesign
          product promotion strategies, leading to revenue growth of 15%
        </p>
      ),
    },
  },
  specifics: {
    text: (
      <p>
        Specifics refer to the quantification of outcomes/ impact in your
        profile. These are outlined by a quantifiable outcome or size and scope
        of work. Examples include revenue, cost, size of your team, or
        departments you supported.
      </p>
    ),
    correct: (
      <div>
        <p>
          {' '}
          <span>{String.fromCharCode(9642)} </span> Developed product roadmap
          and introduced new product features in collaboration with
          international cross-functional team; generated ideas to redesign
          product promotion strategies, leading to revenue growth of 15%{' '}
        </p>
      </div>
    ),
    incorrect: (
      <div>
        <p>
          {' '}
          <span>{String.fromCharCode(9642)} </span> Developed product roadmap
          and introduced new product feature in collaboration with international
          cross-functional team; generated ideas to redesign product promotion
          strategies, leading to revenue growth{' '}
        </p>
      </div>
    ),
  },
}

export default class InfoImpact extends Component {
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
              <h2> Impact</h2>
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
                  aria-label={infoScreenAriaLabel['impact']['what']}>
                  What is Impact?
                </h3>
                <p
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['impact']['text']}>
                  Impact refers to the effect of your profile on visitors. It
                  can be measured by the way you have conveyed your actions and
                  their outcomes in your profile. If after reading a sentence,
                  the recruiter immediately notices your action and its effect,
                  you have done a good job in reflecting the impact of your
                  experiences.{' '}
                </p>
              </div>
              <div className="row margin-4p">
                <ul className="nav nav-tabs" role="tablist">
                  <li
                    role="tab"
                    aria-selected={true}
                    className="active"
                    id="action-orientedTab">
                    <a
                      aria-label="what are action Oriented sentence?"
                      role="button"
                      aria-controls="action-oriented"
                      onClick={this.handleTab.bind(
                        this,
                        '#action-oriented',
                        '#action-orientedTab'
                      )}
                      data-toggle="tab">
                      Action Oriented
                    </a>
                  </li>
                  <li role="tab" id="specificsTab" aria-selected={false}>
                    <a
                      aria-label="what are specifics in a sentence?"
                      role="button"
                      aria-controls="specifics"
                      onClick={this.handleTab.bind(
                        this,
                        '#specifics',
                        '#specificsTab'
                      )}
                      data-toggle="tab">
                      Specifics
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    role="tabpanel"
                    className="tab-pane fade in active"
                    id="action-oriented">
                    <div className="row">
                      <div
                        className="col-sm-6"
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['impact']['action_oriented'][
                            currentSection
                          ]['text']
                        }>
                        {sectionData['action_oriented'][currentSection]['text']}
                      </div>
                      <div className="col-sm-6">
                        <h3
                          className="smp-heading"
                          tabIndex={0}
                          aria-label={'Sample bullets'}>
                          {' '}
                          Sample Bullets
                        </h3>
                        <div className="smp-bullets smp-gray-bg border-radius-5 margin-bottom-20">
                          <div className="smp-icon smp-green">
                            <i className="fa fa-thumbs-up" aria-hidden="true" />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['impact'][
                                  'action_oriented'
                                ][currentSection]['correct']
                              }>
                              Correct way
                            </h4>
                            {
                              sectionData['action_oriented'][currentSection][
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
                                infoScreenAriaLabel['impact'][
                                  'action_oriented'
                                ][currentSection]['incorrect']
                              }>
                              Incorrect way
                            </h4>
                            {
                              sectionData['action_oriented'][currentSection][
                                'incorrect'
                              ]
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="specifics">
                    <div className="row">
                      <div
                        className="col-sm-6"
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['impact']['specifics']['text']
                        }>
                        {sectionData['specifics']['text']}
                      </div>
                      <div className="col-sm-6">
                        <h3
                          className="smp-heading"
                          tabIndex={0}
                          aria-label={'Sample bullets'}>
                          {' '}
                          Sample Bullets
                        </h3>
                        <div className="smp-bullets smp-gray-bg border-radius-5 margin-bottom-20">
                          <div className="smp-icon smp-green">
                            <i className="fa fa-thumbs-up" aria-hidden="true" />
                          </div>
                          <div className="smp-data">
                            <h4
                              tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['impact']['specifics'][
                                  'correct'
                                ]
                              }>
                              Correct way
                            </h4>
                            {sectionData['specifics']['correct']}
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
                                infoScreenAriaLabel['impact']['specifics'][
                                  'correct'
                                ]
                              }>
                              Incorrect way
                            </h4>
                            {sectionData['specifics']['incorrect']}
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
