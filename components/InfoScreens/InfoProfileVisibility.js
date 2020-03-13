import React, { Component } from 'react'
import { infoScreenAriaLabel } from '../Constants/AriaLabelText'

export default class InfoProfileVisibility extends Component {
  render() {
    return (
      <div>
        <div className="container-fluid bg-white categories-info padding-6p">
          <div className="row">
            <div className="col-sm-12">
              <div className="close-icon">
                <a
                  aria-label={infoScreenAriaLabel['close']}
                  href="javascript:void(0);"
                  onClick={() => this.props.hideModal()}>
                  {' '}
                  X
                </a>
              </div>
              <h2> Profile visibility?</h2>
              <div className="info-categories-icon">
                <img
                  alt=""
                  src={`${process.env.APP_BASE_URL}dist/images/info-categories-icon.jpg`}
                  width="60"
                />
              </div>
              <div className="info-right-data">
                <h3
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['visibility']['what']}>
                  What is profile visibility?
                </h3>
                <p
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['visibility']['text']}>
                  Profile visibility refers to how early your profile features
                  in a list of profiles when recruiters search by some keywords.
                  Including keywords relevant to your target job function(s) in
                  your profile helps improve your SEO ranking and increases the
                  chances of recruiters finding your profile earlier.{' '}
                </p>
              </div>
              <div className="row margin-4p border-top-gray">
                <div className="row display-flex">
                  <div className="col-sm-6 padding-top-30">
                    <div className="smp-bullets visibility-info-bg border-radius-5 tall ">
                      {' '}
                      <img
                        src={`${process.env.APP_BASE_URL}dist/images/profile-visibility-img.jpg`}
                        width="100%"
                        alt=""
                      />{' '}
                    </div>
                  </div>
                  <div className="col-sm-6 padding-top-30">
                    <div className="smp-bullets tall ">
                      <h4
                        tabIndex={0}
                        aria-label={
                          infoScreenAriaLabel['visibility']['sample']['text']
                        }>
                        {' '}
                        Elements that help make a LinkedIn profile more visible:
                      </h4>
                      <div className="smp-bullets ">
                        <div className="smp-icon visibility-icons">
                          {' '}
                          <img
                            alt=""
                            src={`${process.env.APP_BASE_URL}dist/images/use-standard-keywords.jpg`}
                            width="100%"
                          />
                        </div>
                        <div className="smp-data">
                          <h5
                            tabIndex={0}
                            aria-label={
                              infoScreenAriaLabel['visibility']['sample'][
                                'keyword'
                              ]
                            }>
                            Use standard keywords
                          </h5>
                          <p>
                            {' '}
                            Using standard terminologies for job roles,
                            competencies, skills, and any other jargon helps
                            your profile match search queries that recruiters
                            use.{' '}
                          </p>
                        </div>
                        <br />
                        <br />
                        <div className="smp-icon visibility-icons">
                          {' '}
                          <img
                            alt=""
                            src={`${process.env.APP_BASE_URL}dist/images/state-more-skills.jpg`}
                            width="100%"
                          />{' '}
                        </div>
                        <div className="smp-data">
                          <h5
                            tabIndex={0}
                            aria-label={
                              infoScreenAriaLabel['visibility']['sample'][
                                'skill'
                              ]
                            }>
                            State more skills
                          </h5>
                          <p>
                            {' '}
                            Include as many skills relevant to target
                            function(s) as possible in your profile so that when
                            the recruiter searches with any skill relevant to
                            your target function(s), your profile prominently
                            features at the top of the list.{' '}
                          </p>
                        </div>
                        <br />
                        <br />
                        <div className="smp-icon visibility-icons">
                          {' '}
                          <img
                            alt=""
                            src={`${process.env.APP_BASE_URL}dist/images/specify-a-lot-of-information.jpg`}
                            width="100%"
                          />{' '}
                        </div>
                        <div className="smp-data">
                          <h5
                            tabIndex={0}
                            aria-label={
                              infoScreenAriaLabel['visibility']['sample'][
                                'category'
                              ]
                            }>
                            Specify Information Categories
                          </h5>
                          <p>
                            {' '}
                            Mentioning job roles, job functions, schools,
                            companies, all help in directing your profile
                            towards searches that recruiters would be doing.{' '}
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
    )
  }
}
