export const sections = [
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

export const sectionUnderscoreEntities = {
  personal_information: ['name', 'profile_url'],
  profile_picture: [],
  headline: ['text'],
  summary: ['text'],
  experience: ['title', 'company', 'from', 'to', 'text'],
  education: [
    'school',
    'from',
    'to',
    'degree',
    'field_of_study',
    'grade',
    'activities_and_societies',
  ],
}

export const sectionEntities = {
  'Personal Information': ['name', 'profile_url'],
  'Profile Picture': [],
  Headline: ['text'],
  Summary: ['text'],
  Experience: ['title', 'company', 'from', 'to', 'text'],
  Education: [
    'school',
    'from',
    'to',
    'degree',
    'field_of_study',
    'grade',
    'activities_and_societies',
  ],
}
