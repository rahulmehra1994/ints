import React, { Component } from 'react'
import { infoScreenAriaLabel } from '../Constants/AriaLabelText'
import $ from 'jquery'

export default class InfoSkills extends Component {
  handleTab(id, tabId) {
    $('.categories-info')
      .find('li')
      .removeClass('active')
      .attr('aria-selected', false)
    $('.categories-info')
      .find('div')
      .removeClass('in active')
    $(tabId)
      .addClass('active')
      .attr('aria-selected', true)
    $(id).addClass('in active')
  }

  render() {
    const { currentSection } = this.props
    // default
    let venDiagram = `${process.env.APP_BASE_URL}dist/images/skills-write-summary-headline.png`

    if (currentSection == 'Headline' || currentSection == 'Summary') {
      // same no need to change
    } else if (currentSection == 'Experience') {
      venDiagram = `${process.env.APP_BASE_URL}dist/images/skills-write-experience.png`
    }

    return (
      <div>
        <div className="container-fluid bg-white categories-info padding-6p">
          <div className="row">
            <div className="col-sm-12">
              <div className="close-icon">
                <a
                  role="button"
                  aria-label={infoScreenAriaLabel['close']}
                  onClick={() => this.props.hideModal()}>
                  {' '}
                  X
                </a>
              </div>
              <h2> Skills</h2>
              <div className="info-categories-icon">
                <img
                  src={`${process.env.APP_BASE_URL}dist/images/info-categories-icon.jpg`}
                  width="60"
                  alt=""
                />
              </div>
              <div className="info-right-data">
                <h3
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['skill']['what']}>
                  How and why are skills important for your Linkedin Profile?{' '}
                </h3>
                <p
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['skill']['text']}>
                  Relevant skills refer to skills that are important for
                  pursuing a career in your chosen target function(s). Including
                  these skills in your profile makes the recruiters feel that
                  you are a better fit for the job and increases your chances of
                  being singled out for that job. Follow the diagram below to
                  decide which skills to focus on.{' '}
                </p>
              </div>
              <div className="row margin-4p border-top-gray">
                <div className="row display-flex">
                  <div className="col-sm-6 padding-top-30">
                    <div className="smp-bullets smp-gray-bg border-radius-5 tall ">
                      <h4
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['skill']['sample']['focus']
                        }>
                        What skills to focus on?
                      </h4>
                      <div className="text-center">
                        <img src={venDiagram} width="80%" alt="" />
                      </div>
                      <p
                        className="text-normal padding-top-20 "
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['skill']['sample']['focus_ans']
                        }>
                        With our machine learning and AI engines, you can
                        exactly know what skills are valued for the target
                        functions you have selected. Try to focus on the
                        intersection of what you have and what is required.
                      </p>
                    </div>
                  </div>
                  <div className="col-sm-6 padding-top-30 how-to-right">
                    <div className="smp-bullets smp-gray-bg border-radius-5 tall ">
                      <h4
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['skill']['sample']['write']
                        }>
                        How to write about skills?
                      </h4>
                      <p
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['skill']['sample']['write_ans']
                        }>
                        Writing about skills can be done in two ways, they can
                        be stated directly or as phrases from which the reader
                        can derive skills. For higher visibility, try using
                        direct forms of skills so that recruiters can easily
                        find you.
                      </p>
                      <div className="smp-gray-bg border-radius-5 ">
                        <ul className="nav nav-tabs" role="tablist">
                          <li
                            role="tab"
                            className="active"
                            id="statedSkillsTab"
                            aria-selected={true}>
                            <a
                              aria-label={
                                infoScreenAriaLabel['skill']['sample']['stated']
                              }
                              role="button"
                              onClick={this.handleTab.bind(
                                this,
                                '#statedskills',
                                '#statedSkillsTab'
                              )}
                              aria-controls="statedskills"
                              data-toggle="tab">
                              Stated skills
                            </a>
                          </li>
                          <li
                            role="tab"
                            id="derivedSkillsTab"
                            aria-selected={false}>
                            <a
                              aria-label={
                                infoScreenAriaLabel['skill']['sample'][
                                  'derived'
                                ]
                              }
                              onClick={this.handleTab.bind(
                                this,
                                `#derivedskills`,
                                `#derivedSkillsTab`
                              )}
                              role="button"
                              aria-controls="derivedskills"
                              data-toggle="tab">
                              Derived skills
                            </a>
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div
                            role="tabpanel"
                            className="tab-pane fade in active"
                            id="statedskills">
                            <p
                              // tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['skill']['sample'][
                                  'stated_ans'
                                ]
                              }>
                              Stated skills are skills that are mentioned
                              directly in your profile. Stating a relevant skill
                              increases your SEO ranking.
                            </p>
                            <h5
                              className="border-bottom-gray"
                              // tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['skill']['sample'][
                                  'stated_ex_1'
                                ]
                              }>
                              {' '}
                              Example 1
                            </h5>
                            <p>
                              To showcase “Business Development” skill, you can
                              write:
                            </p>
                            <p>
                              Led and improved business development efforts and
                              reduced client acquisition cost by 38%
                            </p>
                            <h5
                              className="border-bottom-gray"
                              // tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['skill']['sample'][
                                  'stated_ex_2'
                                ]
                              }>
                              {' '}
                              Example 2
                            </h5>
                            <p>
                              To showcase “Recruiting” skill, you can write:
                            </p>
                            <p>
                              Worked as HR Manager and handled recruiting of new
                              and efficient candidates for KPMG; reduced
                              vacancies, improving efficiency by 25%
                            </p>
                          </div>
                          <div
                            role="tabpanel"
                            className="tab-pane fade"
                            id="derivedskills">
                            <p
                              // tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['skill']['sample'][
                                  'derived_ans'
                                ]
                              }>
                              Derived skills are skills that have been mentioned
                              in such a way that the reader can infer the skill
                              from the language used.
                            </p>
                            <h5
                              className="border-bottom-gray"
                              // tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['skill']['sample'][
                                  'derived_ex_1'
                                ]
                              }>
                              {' '}
                              Example 1
                            </h5>
                            <p>
                              To showcase “Strategy Implementation” skill, you
                              can write:
                            </p>
                            <p>
                              Developed and executed Go to Market strategies,
                              resulting in increased sales and profit
                            </p>
                            <h5
                              className="border-bottom-gray"
                              // tabIndex={0}
                              aria-label={
                                infoScreenAriaLabel['skill']['sample'][
                                  'derived_ex_2'
                                ]
                              }>
                              {' '}
                              Example 2
                            </h5>
                            <p>
                              To showcase “Team Leadership” skill, you can
                              write:
                            </p>
                            <p>
                              Led cross-functional team of Business Development,
                              Marketing, HR and IT to design 2 CRM
                              data-processing tools for optimum client handling
                            </p>
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
