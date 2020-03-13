import { handleActions } from 'redux-actions'
import {
  SELECT_SECTION,
  SELECT_INDEX,
  UPDATE_TEXT,
} from '../actions/DetailedFeedback'
import $ from 'jquery'
import _ from 'underscore'

const initialState = {
  section: 'Personal Information', // section selected by default
  totalScore: 0,
  totalScoreColor: '',
  resumeSkillsInLinkedin: [],
  resumeSkillsNotInLinkedin: [],
  sectionWiseText: {
    imageUrl: '',
    name: '',
    personal_information: '',
    headline: '',
    summary: '',
    experience: '',
    education: '',
    volunteer_experience: '',
    skills: '',
    projects: '',
    publications: '',
  },
  sectionWiseTextPdf: {
    imageUrl: '',
    name: '',
    personal_information: '',
    headline: '',
    summary: '',
    experience: '',
    education: '',
    volunteer_experience: '',
    skills: '',
    projects: '',
    publications: '',
  },
  sections: {
    'Personal Information': {
      section: '',
      name: '',
      url: '',
      connections: '',
      section_score: '',
    },
    'Profile Picture': {
      section: '',
      face_frame_ratio: '',
      background: '',
      foreground: '',
      resolution: '',
      symmetry: '',
      face_body_ratio: '',
      professional_clothes: '',
      pupil: '',
      smile: '',
      section_score: '',
    },
    Headline: {
      language: '',
      categories: '',
      skills: '',
      seo: '',
      section_score: '',
    },
    Summary: {
      language: '',
      impact: '',
      categories: '',
      skills: '',
      seo: '',
      section_score: '',
    },
    Experience: {
      experience_count: '',
      sub_section_bullet_feedback: '',
      language: '',
      impact: '',
      categories: '',
      skills: '',
      seo: '',
      section_score: '',
    },
    Education: { categories: '', seo: '', section_score: '' },
    'Volunteer Experience': {
      sub_section_bullet_feedback: '',
      language: '',
      impact: '',
      skills: '',
      section_score: '',
    },
    Skills: { skills: '', section_score: '' },
    Projects: {
      sub_section_bullet_feedback: '',
      language: '',
      impact: '',
      skills: '',
      section_score: '',
    },
    Publications: { language: '', section_score: '' },
  },
  sectionsPerSkill: {},
  sectionWiseTextEditable: {
    personal_information: {},
    profile_picture: {},
    headline: {},
    summary: {},
    experience: {},
    education: {},
    volunteer_experience: {},
    skills: {},
    projects: {},
    publications: {},
  },
  sectionWiseTextStatic: {
    personal_information: {},
    profile_picture: {},
    headline: {},
    summary: {},
    experience: {},
    education: {},
    volunteer_experience: {},
    skills: {},
    projects: {},
    publications: {},
  },
  sectionsEntitiesToHighlight: {
    'Personal Information': {},
    'Profile Picture': {},
    Headline: { language: '', categories: '', skills: '', seo: '' },
    Summary: { language: '', impact: '', categories: '', skills: '', seo: '' },
    Experience: {
      language: '',
      impact: '',
      categories: '',
      skills: '',
      seo: '',
    },
    Education: { categories: '', seo: '' },
    'Volunteer Experience': { language: '', impact: '', skills: '' },
    Skills: {},
    Projects: { language: '', impact: '', skills: '' },
    Publications: { language: '' },
  },
  logs: {},
  isEditOpen: false,
  currentEditSection: '',
  currentEditSectionIndex: '',
}

const sections = [
  'Personal Information',
  'Profile Picture',
  'Headline',
  'Summary',
  'Experience',
  'Education',
  'Volunteer Experience',
  'Skills',
  'Projects',
  'Publications',
]
sections.forEach(name => {
  initialState[name] = {
    module: 0, // first module is selected by default
    currentIndex: 0, // first index is selected by default
  }
})

export const detailedFeedbackUi = handleActions(
  {
    [SELECT_SECTION]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState.section = action.payload
      return newState
    },

    [SELECT_INDEX]: (state, action) => {
      let newState = $.extend(true, {}, state)
      newState[state.section].currentIndex = action.payload
      return newState
    },

    [UPDATE_TEXT]: (state, action) => {
      let newState = $.extend(true, {}, state)
      let updateKeys = action.payload.updateKeys
      let data = action.payload.data
      for (let i in updateKeys) {
        if (updateKeys[i].length == 1) {
          newState[updateKeys[i][0]] = data[updateKeys[i][0]]
        } else if (updateKeys[i].length == 2) {
          newState[updateKeys[i][0]][updateKeys[i][1]] =
            data[updateKeys[i][0]][updateKeys[i][1]]
        } else if (updateKeys[i].length == 3) {
          newState[updateKeys[i][0]][updateKeys[i][1]][updateKeys[i][2]] =
            data[updateKeys[i][0]][updateKeys[i][1]][updateKeys[i][2]]
        } else if (updateKeys[i].length == 4) {
          newState[updateKeys[i][0]][updateKeys[i][1]][updateKeys[i][2]][
            updateKeys[i][3]
          ] =
            data[updateKeys[i][0]][updateKeys[i][1]][updateKeys[i][2]][
              updateKeys[i][3]
            ]
        }
      }
      return newState
    },
  },
  initialState
)
