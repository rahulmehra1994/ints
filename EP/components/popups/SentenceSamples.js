import React, { Component } from 'react'
import ModalHOC from './../hoc/ModalHOC'
import { log } from '../../actions/commonActions'
import _ from 'underscore'

const FocusTrap = require('focus-trap-react')

var Loader = require('react-loaders').Loader
export const src = [
  {
    id: 'education',
    head: 'Education',
    type: 'Education',
    headTxt:
      'Education category is activated when you mention details about your college, degree, concentration. Use this category to inform the employer about your academic background and to highlight the skills you have gained in your college.',
    listItems: [
      'I am in the final year of MBA at XYZ Business School, specializing in Brand Management and Marketing.',
      'A [freshman]/[sophomore]/[student] at XYZ Business School, I am pursuing an MBA degree in Finance and Strategy.',
      'I studied Communications at University X, and that gave me a whole new set of skills to work with people and help them get the information and support they need. ',
    ],
  },
  {
    id: 'work_experience',
    head: 'Experience',
    type: 'Experience',
    headTxt:
      'Experience category is activated when you mention your internship and full-time work experiences. Use this category to highlight the skills you have gained in your previous roles to inform the employer about your overall competence and job fit.',
    listItems: [
      'My experiences in venture capital and other entrepreneurial roles, coupled with MBA lessons, honed my ability to perform and deliver in a fast-paced, dynamic environment.',
      'I am a business professional with over six years of experience managing commercial relationships in the Telecom and Retail industries.',
      'I have experience in both the strategic design of Learning and Education programs and operations, as well as in large-scale program delivery and implementation.',
    ],
  },
  {
    id: 'achievements',
    head: 'Achievements',
    type: 'Achievements',
    headTxt:
      'Achievements category is activated when you mention details about your accomplishments, awards, scholarships or the impact realised through your previous work stints. Use this category to highlight the fact that you can achieve better results than your peers/competitors.',
    listItems: [
      `In my previous role at XYZ Company, I was awarded the 'Vice president award' for influencing 10% business growth in the Philippines market by undertaking sound innovation planning and execution for premium consumers.`,
      'I conceptualized and launched 4 tariff plans for the prepaid customer segment resulting in 85000 additional new customers and a 100% growth in 6 months in a city where mobile penetration is 105%.',
      'I have always been interested in being part of an entrepreneurial environment. I was also the winner of a business plan competition at ABC business school and was conferred with the runners-up award at ‘XYZ business plan of the year’ competition in Belgium. ',
    ],
  },
  {
    id: 'professional_interests',
    head: 'Career Interests',
    type: 'Career Interests',
    headTxt:
      'Interest category is activated when you mention details about your professional objective or ambition. Use this category to highlight your current career targets. A weak depiction of interest merely grants a superficial view of your desires while an articulate and strong expression of your career goals represents your conviction to contribute to prospective employers.',
    listItems: [
      `I believe my academic background, business knowledge and industry experiences have  instilled an eagerness in me to thrive as an Associate in your firm. (Strong form)`,
      'I am eager to combine my passion for business with the healthcare industry. (Weak form)',
      'I am confident that my relevant experience in a high volume environment makes me a desirable and strong match for this position. (Strong form)',
      'I want to look for an internship in a big city and maybe overseas for the experience of a lifetime. (Weak form)',
    ],
  },
  {
    id: 'personal_details',
    head: 'Personal Details',
    type: 'Personal Details',
    headTxt:
      'Personal category is activated when you mention details about your hometown or your family. It is advisable to avoid talking about it unless you can bring forth some unique personal experiences that introduce a personality trait and help the recruiter to identify a special skill and ultimately connect the same with the job requirements.',
    listItems: [
      `I belong to a family with over 90 years’ experience in textile production due to which I was exposed to the techniques associated with manufacturing operations and supply chain processes in my formative years.`,
      'I was born and raised in this county and have an excellent knowledge of the area as well as Central and XYZ counties.',
    ],
  },
  {
    id: 'hobbies',
    head: 'Hobbies',
    type: 'Hobbies',
    headTxt:
      'Hobbies category is activated when you mention details about the activities you like indulging in, in your spare time. You may use this category also to highlight how the activities you pursue in your spare time shape you as a better professional and resource.',
    listItems: [
      `Since my job is technical in nature, for me it's refreshing to spend time doing something completely different, like writing short plays.`,
      'Reading was always a passion, but it wasn’t until the last couple of years that I started to collect more books, build a library and expand my perspectives in the process!',
      'During my spare time, I like playing and practising table tennis which not only rejuvenates me but also increases my focus.',
    ],
  },
  {
    id: 'por',
    head: 'Positions of Responsibility (POR)',
    type: 'POR',
    headTxt:
      'POR category is activated when you mention about your experiences of taking on a leadership role. Use this category to highlight the skills you have gained in that role and to inform the employer about your overall competence and job fit.',
    listItems: [
      `As Cultural Secretary of the college, I am in charge of managing the finances and budget for the annual fest of the college.`,
      'I have been nominated as the President of the Finance Club, and have organized numerous talk sessions and mock stock competitions in that capacity.',
      'I am the President of the Leadership & Human Capital Club at XYZ college and am responsible for organizing various Speaker Series, Educational Trips and networking events that are, in turn, directed at providing a platform to students to network with industry professionals and gain a deeper understanding of the field.',
    ],
  },
]
class ContentSamples extends Component {
  constructor(...args) {
    super(...args)
    this.state = { arrIndex: 0, arr: src }
    this.attachEscEvent()
  }

  componentDidMount() {
    let myArr = []

    src.forEach((item, index) => {
      if (
        _.has(this.props.epCustomizations.essential_section, item.id) &&
        this.props.epCustomizations.essential_section[item.id].is_enabled
      ) {
        myArr.push(item)
      }
      if (
        _.has(this.props.epCustomizations.additional_section, item.id) &&
        this.props.epCustomizations.additional_section[item.id].is_enabled
      ) {
        myArr.push(item)
      }
    })

    this.setState({ arr: myArr }, () => {
      this.findTheIndex()
    })
  }

  findTheIndex() {
    this.state.arr.map((item, index) => {
      if (this.props.type === item.type) this.setState({ arrIndex: index })
    })
  }

  attachEscEvent() {
    document.onkeydown = e => {
      if (e.key === 'Escape') {
        this.modalToggler()
      }
    }
  }

  componentWillUnmount() {
    document.onkeydown = null
  }

  modalToggler() {
    this.props.sentenceSamplesToggle('Education')
  }

  traverseArray(arg) {
    this.refs.scrollEl.scrollTo(0, 0)
    if (arg === 'previous') {
      if (this.state.arrIndex === 0) {
        this.setState({ arrIndex: this.state.arr.length - 1 })
      } else {
        this.setState({ arrIndex: (this.state.arrIndex -= 1) })
      }
    } else {
      if (this.state.arrIndex === this.state.arr.length - 1) {
        this.setState({ arrIndex: 0 })
      } else {
        this.setState({ arrIndex: (this.state.arrIndex += 1) })
      }
    }
  }

  render() {
    let { arrIndex } = this.state
    return (
      <FocusTrap>
        <div className="epModalCover sentenceSamplesModal">
          <div className="epModal p-10">
            <button
              className="epModalClose"
              onClick={() => {
                this.modalToggler()
              }}
              tabIndex={0}
              aria-label={'samples popup close button'}>
              <span className="ep-icon-close"></span>
            </button>

            <div ref="scrollEl" className="scroll-el">
              <div>
                <span className="mainHead">
                  {this.state.arr[arrIndex]['head']}
                </span>
              </div>
              <div className="mt-2 text-14-normal">
                {this.state.arr[arrIndex]['headTxt']}
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
            </div>

            <div className="mt-6 text-center">
              <span>
                <button
                  onClick={() => {
                    this.traverseArray('previous')
                  }}
                  className="traverse"
                  tabIndex={0}
                  aria-label={'sample previous move button'}>
                  <span
                    className="ep-icon-expand-left"
                    style={{
                      '-webkit-text-stroke': '1px',
                      'vertical-align': -2,
                    }}
                  />
                  <span className="ml-6">Prev</span>
                </button>

                <span className="para grey-color mx-12">{`${arrIndex + 1}/${
                  this.state.arr.length
                }`}</span>

                <button
                  onClick={() => {
                    this.traverseArray('forward')
                  }}
                  className="traverse"
                  tabIndex={0}
                  aria-label={'sample forward move button'}>
                  <span>Next</span>

                  <span
                    className="ep-icon-expand-right ml-6 align-middle"
                    style={{
                      '-webkit-text-stroke': '1px',
                      'vertical-align': -2,
                    }}
                  />
                </button>
              </span>
            </div>
          </div>
        </div>
      </FocusTrap>
    )
  }
}

export default ModalHOC(ContentSamples)
