import React, { Component } from 'react'
import { log } from '../../actions/commonActions'
import _ from 'underscore'
import Tabs from './../commons/Tabs'
import TraversableModal from './../popups/TraversableModal'

var Loader = require('react-loaders').Loader
var src = [
  {
    id: 'Analytical',
    head: 'Analytical Skills',
    type: 'Analytical',
    headTxt:
      'Analytical skills include the process of analyzing a problem, getting to the root-cause, structuring problems and identifying solutions.',
    importanceForRecruiters:
      'Recruiters state Analytical Skills as a "must-have" for any job role, as every job is essentially solving some issue/challenge that an organization is facing. While these skills can be exhibited in various ways, recruiters expect job-seekers to showcase how they have solved problems in the past.',
    listItems: [
      'Analyzed target market and consumer cohorts segmented on the basis of geography in team of 5; defined business maps charting quarterly strategy involving sales plan and advertising campaigns for 10+ regions',
      'Examined and estimated latent factors of long term components of yield curve using Nelson-Siegel model; bonded data using Matlab securing maturities of 100+ banks, monitoring daily transactions to ensure 100% accuracy',
      'Consolidated financial statements for 5 units, drafting monthly management report with financial results of 2 quarters; reviewed liquidity status of 4 subsidiaries and referenced SEC reports, improving debt-equity ratio by 12%',
    ],
    rawTabData: [
      {
        tabLabel: 'Time Management',
        head: 'any head',
        parameters: [
          { name: 'Progress Tracking' },
          { name: 'Task Delegation' },
          { name: 'Project Planning' },
          { name: 'Scheduling' },
          { name: 'Multitasking' },
        ],
      },
      {
        tabLabel: 'Problem solving',
        head: 'any head',
        parameters: [
          { name: 'Crisis Management' },
          { name: 'Root Cause Analysis' },
          { name: 'Troubleshooting' },
          { name: 'Process Optimization' },
          { name: 'Continuous Improvement Initiatives' },
        ],
      },
      {
        tabLabel: 'Number crunching',
        head: 'any head',
        parameters: [
          { name: 'Trend Analysis' },
          { name: 'Risk Assessment' },
          { name: 'Data Analysis' },
          { name: 'Forecasting' },
          { name: 'Statistical Techniques' },
        ],
      },
      {
        tabLabel: 'Analytical soft skill',
        head: 'any head',
        parameters: [
          { name: 'Resource Allocation' },
          { name: 'Impact Assessment' },
          { name: 'SWOT Analysis' },
          { name: 'Strategic Review' },
          { name: 'Data Analysis' },
        ],
      },
      {
        tabLabel: 'Investigative',
        head: 'any head',
        parameters: [
          { name: 'Progress Tracking' },
          { name: 'Due Diligence' },
          { name: 'Risk Assessment' },
          { name: 'Root Cause Analysis' },
          { name: 'Troubleshooting' },
        ],
      },
      {
        tabLabel: 'Strategic Thinking',
        head: 'any head',
        parameters: [
          { name: 'New Business Opportunities' },
          { name: 'Strategic Alliance' },
          { name: 'Business Planning' },
          { name: 'Strategy Formulation' },
          { name: 'Turnaround Management' },
        ],
      },
      {
        tabLabel: 'Planning',
        head: 'any head',
        parameters: [
          { name: 'Product Roadmap' },
          { name: 'Project Planning' },
          { name: 'Resource Allocation' },
          { name: 'Task Delegation' },
          { name: 'Strategic Planning' },
        ],
      },

      {
        tabLabel: 'Creative thinking',
        head: 'any head',
        parameters: [
          { name: 'Digital Marketing' },
          { name: 'Content Strategy' },
          { name: 'Graphic Design' },
          { name: 'Brand Activation' },
          { name: 'Product Prototypes' },
        ],
      },

      {
        tabLabel: 'Practical Thinking',
        head: 'any head',
        parameters: [
          { name: 'Competitive Analysis' },
          { name: 'Strategy Execution' },
          { name: 'Process Improvement' },
          { name: 'Project Scoping' },
          { name: 'Market Entry Strategy' },
        ],
      },
    ],
  },

  {
    id: 'Communication',
    head: 'Communication Skills',
    type: 'Communication',
    headTxt:
      'Communication skills refer to the ability to articulate your messages effectively for getting to a desired outcome.',
    importanceForRecruiters:
      'Recruiters agree that this is the most transferrable soft skill and perhaps the most critical to how successful employees are in their careers. Every role increasingly requires employees to influence others to get to a desired goal whether this is within or external to the organization.',
    listItems: [
      'Collaborated with Scrum Master on agile development, determining software features with team of 3; interacted with 10 clients on product feedback, completing project 1 week prior to deadline',
      'Guided sales force development program, collaborating with 5+ Sales Managers on strategy execution; interacted with 2 teams for optimizing workflows, resulting in sales growth of 25% per quarter',
      'Rendered search marketing services to client, tabulating analytics data to draft monthly progress reports; communicated 30% improvement in site visibility via SEO efforts, increasing contract duration by 1 year',
    ],
    rawTabData: [
      {
        tabLabel: 'Negotiation and Persuasion',
        head: 'any head',
        parameters: [
          { name: 'Sales Prospecting' },
          { name: 'Partnerships' },
          { name: 'Contract Negotiation' },
          { name: 'Customer Acquisition' },
          { name: 'Pitching' },
        ],
      },
      {
        tabLabel: 'Customer Orientation',
        head: 'any head',
        parameters: [
          { name: 'Customer Service' },
          { name: 'Account Management' },
          { name: 'Client Liaison' },
          { name: 'Customer Requirements' },
          { name: 'Aftersales Support' },
        ],
      },
      {
        tabLabel: 'Presentation Skills',
        head: 'any head',
        parameters: [
          { name: 'Client Presentation' },
          { name: 'Pitch Deck' },
          { name: 'Management Reporting' },
          { name: 'Business Conferences' },
          { name: 'Project Proposal' },
        ],
      },
      {
        tabLabel: 'Verbal Communication',
        head: 'any head',

        parameters: [
          { name: 'Price Negotiation' },
          { name: 'Customer Service' },
          { name: 'Team Training' },
          { name: 'Pitching' },
          { name: 'Client Meeting' },
        ],
      },

      {
        tabLabel: 'Written Communication',
        head: 'any head',
        parameters: [
          { name: 'Research Papers' },
          { name: 'Report Preparation' },
          { name: 'Pitch Deck' },
          { name: 'Proposal Drafting' },
          { name: 'Business Case' },
        ],
      },
      {
        tabLabel: 'Visual Communication',
        head: 'any head',
        parameters: [
          { name: 'Display Advertising' },
          { name: 'Graphic Design' },
          { name: 'Digital Marketing' },
          { name: 'Media Production' },
          { name: 'Animation' },
        ],
      },
      {
        tabLabel: 'Building Relationships',
        head: 'any head',
        parameters: [
          { name: 'Strategic Alliance' },
          { name: 'Stakeholder Management' },
          { name: 'Team Building' },
          { name: 'Client Advisory' },
          { name: 'Account Management' },
        ],
      },

      {
        tabLabel: 'Conflict Resolution',
        head: 'any head',
        parameters: [
          { name: 'Industrial Relations' },
          { name: 'Negotiation' },
          { name: 'Dispute Management' },
          { name: 'Mediation' },
          { name: 'Settlement' },
        ],
      },

      {
        tabLabel: 'Creative Skills',
        head: 'any head',
        parameters: [
          { name: 'Media Production' },
          { name: 'Designing' },
          { name: 'Music' },
          { name: 'Creative Writing' },
          { name: 'Theatre & Drama' },
        ],
      },

      {
        tabLabel: 'Communication Soft Skill',
        head: 'any head',
        parameters: [
          { name: 'Relationship Management' },
          { name: 'Business Correspondence' },
          { name: 'Documentations' },
          { name: 'Consulting' },
          { name: 'Pitching' },
        ],
      },
      {
        tabLabel: 'Interpersonal skills',
        head: 'any head',
        parameters: [
          { name: 'Customer Service' },
          { name: 'Peer Support' },
          { name: 'Client Liaison' },
          { name: 'Partnerships' },
          { name: 'Team Building' },
        ],
      },
    ],
  },

  {
    id: 'Initiative',
    head: 'Initiative Skills',
    type: 'Initiative',
    headTxt:
      'Initiative skills can be shown through creative problem-solving, new innovation, or simply going beyond the call of duty.',
    importanceForRecruiters:
      'Recruiters consistently rate initiative to be a much needed skill. Most skills surveys highlight Initiative as the skill that differentiates the average performers from the high performers. The message is simply that, those who step out of their comfort zones to achieve an outcome, usually do.',
    listItems: [
      'Identified key variables of stock market; proposed simulation model matching historical values with 70% accuracy on project on Modeling Stock Market behavior through Fuzzy Neural Networks (FNN)',
      'Developed comparative ranking system to assist $10B client in determining performance of 12 products and services in US market over 2-year period; recommended portfolio optimization to increase sales by 25%',
      'Identified and developed key government and institutional clients for education business; initiated sales process and managed business development activities with 5 key accounts leading to $30MM+ revenue',
    ],
    rawTabData: [
      {
        tabLabel: 'Innovation and Creativity',
        head: 'any head',
        parameters: [
          { name: 'Technology Transformation' },
          { name: 'New Product Development' },
          { name: 'Process Optimisation' },
          { name: 'R & D' },
          { name: 'New Methods' },
        ],
      },
      {
        tabLabel: 'Mentoring',
        head: 'any head',
        parameters: [
          { name: 'Team Mentoring' },
          { name: 'Coaching' },
          { name: 'Training Delivery' },
          { name: 'Peer Counseling' },
          { name: 'People Development' },
        ],
      },
      {
        tabLabel: 'Entrepreneurial skills',
        head: 'any head',
        parameters: [
          { name: 'Start-Up Venture' },
          { name: 'Restructuring' },
          { name: 'New Product Development' },
          { name: 'Business Modeling' },
          { name: 'Crisis Mitigation' },
        ],
      },
      {
        tabLabel: 'Initiative',
        head: 'any head',
        parameters: [
          { name: 'Pro-Bono' },
          { name: 'Youth Development' },
          { name: 'Tutoring' },
          { name: 'Community Service' },
          { name: 'Volunteering' },
        ],
      },
    ],
  },

  {
    id: 'Leadership',
    head: 'Leadership Skills',
    type: 'Leadership',
    headTxt:
      'Leadership skills refer to the ability to take on a role of leading teams, projects or any scope of work to excellence.',
    importanceForRecruiters:
      'Recruiters look for leadership skills to assess whether a candidate will be able to lead in whatever context they are placed in. In many cases even if the current role does not require strong leadership skills, recruiters consider this to be a critical skill as it clearly predicts long-term success.',
    listItems: [
      'Spearheaded Asia pacific market entry with cross-functional team of 5 and managed bank operations to achieve 25% growth per quarter; devised roadmap for achieve quarterly growth for 2 years capturing 15% of market share',
      'Monitored calibration of instruments to ensure accurate readings and championed preventive maintenance of test apparatus and peripheral equipment; reduced overall repair costs by over 25% in 6 months',
      'Led team of 5 accountants to revamp internal accounting processes for data analytics firm; promoted use of new accountancy software, leading to improved accuracy and elimination of system redundancies by over 20',
    ],
    rawTabData: [
      {
        tabLabel: 'Team management',
        head: 'any head',
        parameters: [
          { name: 'Project Management' },
          { name: 'Task Delegation' },
          { name: 'Conflict Management' },
          { name: 'Team Building' },
          { name: 'Team Mentoring' },
        ],
      },
      {
        tabLabel: 'Leadership',
        head: 'any head',
        parameters: [
          { name: 'Staff Motivation' },
          { name: 'Team Training' },
          { name: 'Cross-Functional Leadership' },
          { name: 'Performance Management' },
          { name: 'Task Administration' },
        ],
      },
      {
        tabLabel: 'Task Management',
        head: 'any head',
        parameters: [
          { name: 'Resource Planning' },
          { name: 'Workflow Management' },
          { name: 'Work Delegation' },
          { name: 'Operations Coordination' },
          { name: 'Project Implementation' },
        ],
      },
      {
        tabLabel: 'People Management',
        head: 'any head',
        parameters: [
          { name: 'Event Management' },
          { name: 'Team Leadership' },
          { name: 'Performance Management' },
          { name: 'Project Coordination' },
          { name: 'Staff Administration' },
        ],
      },
    ],
  },

  {
    id: 'Teamwork',
    head: 'Teamwork Skills',
    type: 'Teamwork',
    headTxt:
      'Teamwork refers to the ability of a professional to work with others in a cohesive manner towards a common goal.',
    importanceForRecruiters:
      'Recruiters are looking for team players because they know that winning in an organization is never a result of only individual efforts, rather how individuals come together to strive for a common goal. Team skills are critical in any role and define the success of any project.',
    listItems: [
      'Developed sales force development strategy and collaborated with 50+ sales managers for executing strategy, developing teams, and optimizing workflows; resulted in sales growth of 25% per quarter for 2 years',
      'Facilitated internal audit processes, prepared annual functional reports for 5 companies and conducted control analysis; presented audit recommendations to senior management for approval',
      'Coordinated with 2 internal teams to collect progress reports and data analysis for 3 projects and presented to CEO for decision making; scheduled and convened weekly project review meetings with 2 team members',
    ],
    rawTabData: [
      {
        tabLabel: 'Teamwork',
        head: 'any head',
        parameters: [
          { name: 'Personal Development' },
          { name: 'Intercultural Communication' },
          { name: 'Dispute Settlement' },
          { name: 'Team Motivation' },
          { name: 'Task Delegation' },
        ],
      },
      {
        tabLabel: 'Collaboration',
        head: 'any head',
        parameters: [
          { name: 'Research Groups' },
          { name: 'Cross-Functional Collaboration' },
          { name: 'Peer Couseling' },
          { name: 'Brainstorming' },
          { name: 'Partnerships' },
        ],
      },
      {
        tabLabel: 'Coordinating Activities',
        head: 'any head',
        parameters: [
          { name: 'Project Monitoring' },
          { name: 'Campaign Management' },
          { name: 'Event Coordination' },
          { name: 'Task Administration' },
          { name: 'Supervision' },
        ],
      },
      {
        tabLabel: 'Facilitation',
        head: 'any head',
        parameters: [
          { name: 'Administrative Assistance' },
          { name: 'Peer Support' },
          { name: 'Conflict Management' },
          { name: 'Project Collaboration' },
          { name: 'Event Coordination' },
        ],
      },
    ],
  },
]
export default class ContentSamples extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      arrIndex: 0,
      tabPosition: 0,
      arr: src,
      tabsData: [],
      currentTabData: null,
    }
    this.attachEscEvent()
  }

  componentDidMount() {
    let myArr = []

    src.forEach(item => {
      myArr.push(item)
    })

    this.setState({ arr: myArr }, () => {
      this.findTheIndex()
      this.changeDataForTabs()
    })
  }

  changeDataForTabs = () => {
    if (!_.has(this.state.arr[this.state.arrIndex], 'rawTabData')) {
      this.setState({
        tabsData: [],
        currentTabData: null,
      })
      return
    }
    let temp = []
    let data = this.state.arr[this.state.arrIndex].rawTabData
    _.each(data, (val, index) => {
      temp.push({ label: val.tabLabel, arr: val.parameters, head: val.head })
    })

    this.setState({
      tabsData: temp,
      currentTabData: temp[0],
    })
  }

  switchTab = (data, key) => {
    this.setState({
      currentTabData: data,
    })
  }

  findTheIndex() {
    this.state.arr.map((item, index) => {
      if (this.props.type === item.type) this.setState({ arrIndex: index })
    })
  }

  attachEscEvent() {
    document.onkeydown = e => {
      if (e.key === 'Escape') this.modalToggler()
    }
  }

  componentWillUnmount() {
    document.onkeydown = null
  }

  modalToggler() {
    this.props.sentenceSamplesToggle(this.state.arr[0].type)
  }

  traverse(arg) {
    if (arg === 'previous') {
      if (this.state.arrIndex === 0) {
        this.setState(
          { arrIndex: this.state.arr.length - 1 },
          this.changeDataForTabs
        )
      } else {
        this.setState(
          { arrIndex: this.state.arrIndex - 1 },
          this.changeDataForTabs
        )
      }
    } else {
      if (this.state.arrIndex === this.state.arr.length - 1) {
        this.setState({ arrIndex: 0 }, this.changeDataForTabs)
      } else {
        this.setState(
          { arrIndex: this.state.arrIndex + 1 },
          this.changeDataForTabs
        )
      }
    }
    document.querySelector('.competency-samples-tab-scroll').scroll(0, 0)
  }

  content = () => {
    let { arrIndex, currentTabData } = this.state
    return (
      <div>
        <button
          className="epModalClose"
          onClick={() => {
            this.modalToggler()
          }}
          tabIndex={0}
          aria-label={'samples popup close button'}>
          <span className="ep-icon-close"></span>
        </button>

        <div>
          <span className="mainHead">{this.state.arr[arrIndex]['head']}</span>
        </div>

        <div className="scroll-el" style={{ height: 500 }}>
          <div className="mt-6 text-14-normal">
            {this.state.arr[arrIndex]['headTxt']}
          </div>

          <div className="paraHead mt-8">
            <span>Importance For Recruiters</span>
          </div>

          <div className="mt-2 text-14-normal">
            {this.state.arr[arrIndex]['importanceForRecruiters']}
          </div>

          {this.state.arr[arrIndex]['listItems'].length > 0 ? (
            <div className="paraHead mt-8">
              <span>Samples</span>
            </div>
          ) : null}

          {this.state.arr[arrIndex]['listItems'].map((item, index) => {
            return (
              <div key={index} className="ep-li">
                <div className="li-text text-14-normal">{item}</div>
              </div>
            )
          })}

          <div className="clearfix">
            {!_.isNull(currentTabData) ? (
              <Tabs
                tabIndex={0}
                tabsData={this.state.tabsData}
                showOptions={false}
                parentMethod={this.switchTab}
                unit={this.props.unit}
              />
            ) : null}

            <div className="my-5 text-14-med text-center">
              Talk about the following experience to showcase this skill
            </div>

            <div className="mt-4 flex justify-center items-center">
              {!_.isNull(currentTabData)
                ? currentTabData.arr.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="rounded-full border border-grey float-left ml-4 flex justify-center items-center text-center"
                        style={{ width: 120, height: 120 }}>
                        <span>{item.name}</span>
                      </div>
                    )
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="epModalCover sentenceSamplesModal">
        <TraversableModal
          traverse={this.traverse.bind(this)}
          content={this.content.bind(this)}></TraversableModal>
      </div>
    )
  }
}
