import React, { Component } from 'react'
import { connect } from 'react-redux'
import SummaryMainData from './SummaryData'
import _ from 'underscore'

class Summary extends Component {
  fetchScores(summaryData) {
    let mods = {
      Content: {
        index1: 'section_wise_content_score_class',
        index3: 'overall_content_score_class',
        index4: 'overall_content_score',
      },
      Skills: {
        index1: 'section_wise_skills_score_class',
        index3: 'overall_skills_score_class',
        index4: 'overall_skills_score',
      },
      Visibility: {
        index1: 'section_wise_profile_visibility_score_class',
        index3: 'overall_profile_visibility_score_class',
        index4: 'overall_profile_visibility_score',
      },
    }

    let sections = {
      Headline: {
        index2: 'headline',
      },
      Summary: {
        index2: 'summary',
      },
      Experience: {
        index2: 'experience',
      },
      Education: {
        index2: 'education',
      },
      'Volunteer Experience': {
        index2: 'volunteer_experience',
      },
      Skills: {
        index2: 'skills_&_expertise',
      },
      Projects: {
        index2: 'projects',
      },
      Publications: {
        index2: 'publications',
      },
    }

    const crosses = {
      Content: ['Skills'],
      Skills: ['Education', 'Publications'],
      Visibility: [
        'Volunteer Experience',
        'Skills',
        'Projects',
        'Publications',
      ],
    }

    let scores = {
      Total: {
        class: summaryData['overall_total_score_class']['color_feedback'],
        score: summaryData['overall_total_score_class']['overall_score'],
        text: summaryData['overall_total_score_class']['color_feedback']
          .toString()
          .toUpperCase(),
      },
    }

    for (let mod in mods) {
      scores[mod] = {}
      scores[mod]['Total'] = {
        class:
          'progress-bar progress-bar-' +
          summaryData[mods[mod]['index3']]['color_feedback'],
        score: summaryData[mods[mod]['index3']][mods[mod]['index4']],
        color: summaryData[mods[mod]['index3']]['color_feedback'],
      }

      for (let section in sections) {
        if (_.contains(crosses[mod], section)) {
          scores[mod][section] = {
            class: 'cross-circle',
          }
        } else if (
          _.isUndefined(summaryData[mods[mod]['index1']]) ||
          _.isUndefined(
            summaryData[mods[mod]['index1']][sections[section]['index2']]
          ) ||
          _.isUndefined(
            summaryData[mods[mod]['index1']][sections[section]['index2']][
              mods[mod]['index3']
            ]
          ) ||
          _.isUndefined(
            summaryData[mods[mod]['index1']][sections[section]['index2']][
              mods[mod]['index3']
            ][mods[mod]['index4']]
          )
        ) {
          scores[mod][section] = {
            class: 'question-circle',
          }
        } else {
          scores[mod][section] = {
            class:
              'progress-bar progress-bar-' +
              summaryData[mods[mod]['index1']][sections[section]['index2']][
                mods[mod]['index3']
              ]['color_feedback'],
            score:
              summaryData[mods[mod]['index1']][sections[section]['index2']][
                mods[mod]['index3']
              ][mods[mod]['index4']] + 3.0,
            color:
              summaryData[mods[mod]['index1']][sections[section]['index2']][
                mods[mod]['index3']
              ]['color_feedback'],
          }
        }
      }
    }

    return scores
  }

  render() {
    const {
      feedback,
      uploaded_picture,
      has_api,
      has_pdf,
      has_resume,
      status,
      match: { params },
      location,
    } = this.props

    if (_.isEmpty(feedback)) {
      return null
    }

    const { fetchId } = params
    const scores = this.fetchScores(feedback['summary_screen'])
    const name =
      feedback['section_wise_feedback']['personal_information_feedback'][
        'profile_name_score_class'
      ]['name']
    let imageUrl =
      uploaded_picture != '' &&
      !_.isUndefined(uploaded_picture) &&
      uploaded_picture['url'] != ''
        ? uploaded_picture['url']
        : feedback['section_wise_feedback']['profile_picture_feedback'][
            'profile_picture_url'
          ]
    let noImageUploaded = false
    if (_.isEmpty(imageUrl)) {
      noImageUploaded = true
      imageUrl = `${process.env.APP_BASE_URL}dist/images/profile-avatar.png`
    }

    return (
      <div role="region" aria-labelledby="summary-feedback">
        <SummaryMainData
          tabIndex={10}
          location={location}
          fetchId={fetchId}
          has_api={has_api}
          has_pdf={has_pdf}
          has_resume={has_resume}
          status={status}
          scores={scores}
          name={name}
          imageUrl={imageUrl}
          feedback={feedback}
          noImageUploaded={noImageUploaded}
        />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    uploaded_picture: state.aspireFeedbackData.uploaded_picture,
  }
}

export default connect(
  mapStateToProps,
  {}
)(Summary)
