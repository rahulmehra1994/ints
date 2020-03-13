import React from 'react'
export const sectionUnderscoreName = {
  Education: 'education',
  Experience: 'experience',
  Headline: 'headline',
  'Personal Information': 'personal_information',
  'Profile Picture': 'profile_picture',
  Summary: 'summary',
}

export const sectioNameToBackendVisitedSectioNameMapping = {
  'Personal Information': 'detailed_personal_info',
  'Profile Picture': 'detailed_profile_picture',
  Headline: 'detailed_headline',
  Summary: 'detailed_summary',
  Experience: 'detailed_experience',
  Education: 'detailed_education',
  'Summary Screen': 'summary',
  'Edit Personal Information': 'edit_personal_info',
  'Edit Profile Picture': 'edit_profile_picture',
  'Edit Headline': 'edit_headline',
  'Edit Summary': 'edit_summary',
  'Edit Experience': 'edit_experience',
  'Edit Education': 'edit_education',
}

export const staticFeedback = {
  'Personal Information': null,
  'Profile Picture': null,
  Headline: {
    about: [
      'ABOUT THE HEADLINE',
      'A 120 character hook to stand out from your competitors and entice the visitors to click on your profile.',
    ],
  },
  Summary: {
    about: [
      'ABOUT THE SUMMARY',
      'Use your summary section to spell out to your network or visitors - who YOU are and what you are looking to accomplish.',
    ],
  },
  Experience: {
    about: [
      'ABOUT THE EXPERIENCE SECTION',
      'The objective of the experience section is to showcase your past and present positions and give the viewer a gist of your career track.',
    ],
  },
  Education: {
    about: [
      'ABOUT THE EDUCATION SECTION',
      'Use this section to tell the visitors about your educational background, positions of responsibility that you held and other extracurricular activities that you participated in.',
    ],
  },
}

export const feedbackMap = {
  face_frame_ratio: {
    key: '1',
    green:
      'You have done a good job keeping your face/frame ratio of around 50%.',
    yellow: 'Try to maintain a face/frame ratio of around 50%.',
    red: 'Try to maintain a face/frame ratio of around 50%.',
    gray:
      'Feature cannot be detected. A good image has a face/frame ratio of around 50%.',
  },
  background: {
    key: '2',
    green: 'You profile picture has a light colored background. Good job!',
    yellow: 'Make sure your picture has a light colored background.',
    red: 'Make sure your picture has a light colored background.',
    gray:
      'Feature cannot be detected. A good image should has a light colored background for clearer picture portrayal.',
  },
  foreground: {
    key: '3',
    green:
      'There are no shadows or reflections interfering with the clarity and prominence of your face. Good job!',
    yellow:
      'Ensure that shadows or reflections do not interfere with the clarity and prominence of your face.',
    red:
      'Ensure that shadows or reflections do not interfere with the clarity and prominence of your face.',
    gray:
      'Feature cannot be detected. A good picture is free of any shadow or object reflection.',
  },
  resolution: {
    key: '4',
    green:
      'Your photo size is within the specified limits of 400 x 400 and 20K x 20K pixels. Good job!',
    yellow:
      'Ensure that your photo size is within the specified limits of 400 x 400 and 20K x 20K pixels.',
    red:
      'Ensure that your photo size is within the specified limits of 400 x 400 and 20K x 20K pixels.',
    gray:
      'Feature cannot be detected. Photo size should be within 400 x 400 and 20K x 20K pixels for optimum picture clarity.',
  },
  face_body_ratio: {
    key: '5',
    green:
      'Your profile picture has an appropriate face to body ratio. Good Job!',
    yellow:
      'Ensure that your face covers a larger area in the picture as compared to your body.',
    red:
      'Ensure that your face covers a larger area in the picture as compared to your body.',
    gray:
      'Feature cannot be detected. In a good profile picture, your face covers a larger area as compared to your body.',
  },
  pupil: {
    key: '6',
    green:
      'You have done a good job of maintaining eye contact with the camera.',
    yellow:
      'Ensure that your profile picture has a clear depiction of your eye contact with the camera.',
    red:
      'Ensure that your profile picture has a clear depiction of your eye contact with the camera.',
    gray:
      'Feature cannot be detected. One should maintain eye contact with the camera as it signifies self confidence.',
  },
  smile: {
    key: '7',
    green: 'An open smile increases likeability. Good Job!',
    yellow:
      'Please try uploading a picture with a wide, open smile as it increases likeability.',
    red:
      'Please try uploading a picture with a wide, open smile as it increases likeability.',
    gray:
      'Feature cannot be detected. An open smile increases likeability and is a feature in almost all good profile pictures.',
  },
}

export const feedbackContentProfilePicture = {
  empty: {
    title_text: 'You have not uploaded your profile picture!',
    body: (
      <p>
        Upload your profile picture in the edit mode to get instant feedback.{' '}
      </p>
    ),
  },
  red: {
    title_text: 'Needs Work!',
    body: <p>Consider the feedback to improve this section. </p>,
  },
  yellow: {
    title_text: 'On Track!',
    body: <p>Consider the feedback to improve this section. </p>,
  },
  green: {
    title_text: 'Looks Good!',
    body: (
      <p>
        You have done a good job of uploading a professional profile picture.{' '}
      </p>
    ),
  },
}

export const divisionSubHeadlineText = {
  categories: {
    present: 'Relevant Categories Present',
    missing: 'Suggested Categories for Targeted Job',
    resume: 'Missing Categories From Resume',
  },
  skills: {
    present: 'Relevant skills present',
    missing: 'Suggested Skills for Targeted Job ',
    resume: 'Missing skills from resume',
  },
  visibility: {
    present: 'SEO keywords present',
    missing: 'Suggested SEO keywords',
  },
}

export const languageContent = {
  content: {
    buzzwords: (
      <div className="content">
        <p>
          <strong> What are Avoided Words? </strong>
        </p>
        <p>
          Avoided Words include passive language, filler words, often used in a
          profile consuming space without much impact.
        </p>
      </div>
    ),
    verb_overusage: (
      <div className="content">
        <p>
          <strong> What is Overusage? </strong>
        </p>
        <p>
          Using same words again and again makes a particular sample sound too
          repetitive. Each word of a sample holds a certain weight and repeating
          words lends a negative impression.
        </p>
      </div>
    ),
    tense: (
      <div className="content">
        <p>
          <strong> What is Tense Inconsistency? </strong>
        </p>
        <p>
          Tense inconsistency measures the amount of switch between tenses. You
          should try to stick to the same tense.
        </p>
      </div>
    ),
    narrative_voice: (
      <div className="content">
        <p>
          <strong> What is Voice Feedback? </strong>
        </p>
        <p>
          It checks for the narrative voice. One must try to keep the profile in
          first person and avoid using third person.
        </p>
      </div>
    ),
    spell_check: (
      <div className="content">
        <p>Stuff for Tab Spell</p>
      </div>
    ),
  },
  title: {
    buzzwords: 'Avoided Words',
    verb_overusage: 'Overusage',
    tense: 'Tense',
    narrative_voice: 'Voice',
    spell_check: 'Spell Error',
  },
  content_section_score: {
    Headline: {
      red: {
        buzzwords: {
          title: 'Needs Work!',
          text:
            'You have used some filler words. Revise your sentences to make them more effective and concise.',
        },
        verb_overusage: {
          title: 'Needs Work!',
          text:
            'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',
        },
        tense: {
          title: 'Needs Work!',
          text: '',
        },
        narrative_voice: {
          title: 'Needs Work!',
          text: '',
        },
        spell_check: {
          title: 'Needs Work!',
          text: '',
        },
      },
      green: {
        buzzwords: {
          title: 'Looks Good!',
          text:
            "Good Job! You have stayed away from using any fillers, that's great!",
        },
        verb_overusage: {
          title: 'Looks Good!',
          text: 'You have not overused any verb, good job!',
        },
        tense: {
          title: 'Looks Good!',
          text: '',
        },
        narrative_voice: {
          title: 'Looks Good!',
          text: '',
        },
        spell_check: {
          title: 'Looks Good!',
          text: '',
        },
      },
      yellow: {
        buzzwords: {
          title: 'On Track!',
          text:
            'You have used some filler words. Revise your sentences to make them more effective and concise.',
        },
        verb_overusage: {
          title: 'On Track!',
          text:
            'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',
        },
        tense: {
          title: 'On Track!',
          text: '',
        },
        narrative_voice: {
          title: 'On Track!',
          text: '',
        },
        spell_check: {
          title: 'On Track!',
          text: '',
        },
      },
    },
    Summary: {
      red: {
        buzzwords: {
          title: 'Needs Work!',
          text:
            'You have used some filler words. Revise your sentences to make them more effective and concise.',
        },
        verb_overusage: {
          title: 'Needs Work!',
          text:
            'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',
        },
        tense: {
          title: 'Needs Work!',
          text:
            'You have switched tenses in your sample multiple times, making it inconsistent. Try writing the sample without switching the tense too much.',
        },
        narrative_voice: {
          title: 'Needs Work!',
          text:
            'While writing your summary, try to avoid switching voice from first person to third person or vice versa when talking about yourself.',
        },
        spell_check: {
          title: 'Needs Work!',
          text: '',
        },
      },
      green: {
        buzzwords: {
          title: 'Looks Good!',
          text:
            "Good Job! You have stayed away from using any fillers, that's great!",
        },
        verb_overusage: {
          title: 'Looks Good!',
          text: 'You have not overused any verb, good job!',
        },
        tense: {
          title: 'Looks Good!',
          text:
            'Good Job! You have avoided switching between tenses too much and maintained consistency in your sample.',
        },
        narrative_voice: {
          title: 'Looks Good!',
          text:
            'You have done a good job of writing your summary section without switching voice from first person to third person or vice versa.',
        },
        spell_check: {
          title: 'Looks Good!',
          text: '',
        },
      },
      yellow: {
        buzzwords: {
          title: 'On Track!',
          text:
            'You have used some filler words. Revise your sentences to make them more effective and concise.',
        },
        verb_overusage: {
          title: 'On Track!',
          text:
            'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',
        },
        tense: {
          title: 'On Track!',
          text:
            'You have switched tenses multiple times in your sample, making it inconsistent. Try writing the sample without switching the tense too much.',
        },
        narrative_voice: {
          title: 'On Track!',
          text:
            'While writing your summary, try to avoid switching voice from first person to third person or vice versa when talking about yourself.',
        },
        spell_check: {
          title: 'On Track!',
          text: '',
        },
      },
    },
    Experience: {
      red: {
        buzzwords: {
          title: 'Needs Work!',
          text:
            'You have used some filler words. Revise your sentences to make them more effective and concise.',
        },
        verb_overusage: {
          title: 'Needs Work!',
          text:
            'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',
        },
        tense: {
          title: 'Needs Work!',
          text:
            'You have switched tenses in your sample, making it inconsistent. Try writing the sample in single tense.',
        },
        narrative_voice: {
          title: 'Needs Work!',
          text:
            'You have used third person voice in your sample. Try to write information about yourself in first person.',
        },
        spell_check: {
          title: 'Needs Work!',
          text: '',
        },
      },
      green: {
        buzzwords: {
          title: 'Looks Good!',
          text:
            "Good Job! You have stayed away from using any fillers, that's great!",
        },
        verb_overusage: {
          title: 'Looks Good!',
          text: 'You have not overused any verb, good job!',
        },
        tense: {
          title: 'Looks Good!',
          text:
            'Good Job! You have avoided switching between tenses and maintained consistency in your sample.',
        },
        narrative_voice: {
          title: 'Looks Good!',
          text:
            'You have done an excellent job of writing your section in first person and keeping the use of third person voice limited to only necessary parts.',
        },
        spell_check: {
          title: 'Looks Good!',
          text: '',
        },
      },
      yellow: {
        buzzwords: {
          title: 'On Track!',
          text:
            'You have used some filler words. Revise your sentences to make them more effective and concise.',
        },
        verb_overusage: {
          title: 'On Track!',
          text:
            'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',
        },
        tense: {
          title: 'On Track!',
          text:
            'You have switched tenses in your sample, making it inconsistent. Try writing the sample in single tense.',
        },
        narrative_voice: {
          title: 'On Track!',
          text:
            'You have used third person voice in your sample. Try to write information about yourself in first person.',
        },
        spell_check: {
          title: 'On Track!',
          text: '',
        },
      },
    },
  },
}

export const impactContent = {
  content: {
    action_oriented: (
      <div className="content feedback-impact-content">
        <p>
          <strong> What is Action Oriented? </strong>
        </p>
        <p>
          Your experience need to showcase what work you did. Begin your bullets
          with strong action verbs that tell the viewer what actions you
          performed.
        </p>
      </div>
    ),
    specifics: (
      <div className="content feedback-impact-content">
        <p>
          <strong> What are Specifics? </strong>
        </p>
        <p>
          Specifics refer to the quantification of outcomes/ impact in your
          profile. These are outlined by a quantifiable outcome or size and
          scope of work.
        </p>
      </div>
    ),
  },
  title: {
    action_oriented: 'Action Oriented',
    specifics: 'Specifics',
  },
  content_section_score: {
    Summary: {
      red: {
        action_oriented: {
          title: 'Needs Work!',
          text:
            'You have not begun your bullets with an action verb. Try using action oriented verbs in the beginning to create more impact.',
        },
        specifics: {
          title: 'Needs Work!',
          text:
            'Try to use specifics in the bullets to quantify your contribution to the company and create a greater impact on the profile visitor.',
        },
      },
      green: {
        action_oriented: {
          title: 'Looks Good!',
          text:
            'Good Job! You have begun your bullets with strong action verbs signalling actions performed by you.',
        },
        specifics: {
          title: 'Looks Good!',
          text:
            'You have done a good job of quantifying your impact in the bullets.',
        },
      },
      yellow: {
        action_oriented: {
          title: 'On Track!',
          text:
            'You have not begun your bullets with an action verb. Try using action oriented verbs in the beginning to create more impact.',
        },
        specifics: {
          title: 'On Track!',
          text:
            'Try to use specifics in the bullets to quantify your contribution to the company and create a greater impact on the profile visitor.',
        },
      },
    },
    Experience: {
      red: {
        action_oriented: {
          title: 'Needs Work!',
          text:
            'You have not begun your sentences with an action verb. Try using action oriented verbs in the beginning to create more impact.',
        },
        specifics: {
          title: 'Needs Work!',
          text:
            'Try to use specifics to quantify your contribution to the company and create a greater impact on the profile visitor.',
        },
      },
      green: {
        action_oriented: {
          title: 'Looks Good!',
          text:
            'Good Job! You have begun your sentences with strong action verbs signalling actions performed by you.',
        },
        specifics: {
          title: 'Looks Good!',
          text:
            'You have done a good job of quantifying your impact in this experience.',
        },
      },
      yellow: {
        action_oriented: {
          title: 'On Track!',
          text:
            'You have not begun your sentences with an action verb. Try using action oriented verbs in the beginning to create more impact.',
        },
        specifics: {
          title: 'On Track!',
          text:
            'Try to use specifics to quantify your contribution to the company and create a greater impact on the profile visitor.',
        },
      },
    },
  },
}

export const feedbackContent = {
  empty: {
    title_text: 'You have not written this section!',
    title: (
      <div className="message text-red">
        {' '}
        You have not written this section!{' '}
      </div>
    ),
    body: {
      categories: (
        <p>
          {' '}
          Unable to find any mentioned categories as the seciton is empty.{' '}
        </p>
      ),
      language: (
        <p>
          {' '}
          The language parameter is evaluated along the following aspects. Write
          atleast <b>50+</b> words for language feedback.{' '}
        </p>
      ),
      impact: (
        <p> The impact parameter is evaluated along the following aspects. </p>
      ),
      skills: <p> There are no skills detected as the section is empty. </p>,
      seo: (
        <p>
          {' '}
          There are no relevant SEO keywords detected as the section is empty.{' '}
        </p>
      ),
      section_score: {
        Headline: <p>Start writing in the edit mode. </p>,
        Summary: <p>Start writing in the edit mode. </p>,
        Experience: <p>Start writing in the edit mode. </p>,
        Education: <p>Start writing in the edit mode. </p>,
      },
    },
  },
  red: {
    title_text: 'Needs Work!',
    title: <div className="message text-red"> Needs Work! </div>,
    body: {
      categories: (
        <p>
          {' '}
          Please consider adding more relevant categories in this section. See
          edit mode for category suggestions.{' '}
        </p>
      ),
      language: (
        <p> Follow the feedback to improve your language in this section. </p>
      ),
      impact: <p> Follow the feedback to make your section more impactful. </p>,
      skills: (
        <p>
          {' '}
          You should try to include more skills relevant to target job
          function(s) from your profile.{' '}
        </p>
      ),
      seo: (
        <p>
          {' '}
          Include more SEO keywords by incorporating additional information
          categories. See edit mode for suggestions.{' '}
        </p>
      ),
      section_score: {
        Headline: <p>Consider the feedback to improve this section.</p>,
        Summary: <p>Consider the feedback to improve this section.</p>,
        Experience: <p>Consider the feedback to improve this section.</p>,
        Education: <p>Consider the feedback to improve this section.</p>,
      },
    },
  },
  yellow: {
    title_text: 'On Track!',
    title: <div className="message text-yellow"> On Track! </div>,
    body: {
      categories: (
        <p>
          {' '}
          Please consider adding more relevant categories in this section. See
          edit mode for category suggestions.{' '}
        </p>
      ),
      language: (
        <p> Follow the feedback to improve your language in this section. </p>
      ),
      impact: <p> Follow the feedback to make your section more impactful. </p>,
      skills: (
        <p>
          {' '}
          You should try to include more skills relevant to target job
          function(s) from your profile.{' '}
        </p>
      ),
      seo: (
        <p>
          {' '}
          Include more SEO keywords by incorporating additional information
          categories. See edit mode for suggestions.{' '}
        </p>
      ),
      section_score: {
        Headline: <p>Consider the feedback to improve this section.</p>,
        Summary: <p>Consider the feedback to improve this section.</p>,
        Experience: <p>Consider the feedback to improve this section.</p>,
        Education: <p>Consider the feedback to improve this section.</p>,
      },
    },
  },
  green: {
    title_text: 'Looks Good!',
    title: <div className="message text-green"> Looks Good! </div>,
    body: {
      categories: (
        <p> You have added sufficient number of relevant categories. </p>
      ),
      language: (
        <p>
          {' '}
          Follow the feedback to further improve your language in this section.
        </p>
      ),
      impact: <p> Your section is impactful. Great work! </p>,
      skills: (
        <p>
          {' '}
          You have included top skills relevant to target job function(s) from
          your profile.{' '}
        </p>
      ),
      seo: <p> You have done a good job of including SEO keywords here. </p>,
      section_score: {
        Headline: <p>You have done a good job with this section.</p>,
        Summary: <p>You have done a good job with this section.</p>,
        Experience: <p>You have done a good job with this experience.</p>,
        Education: <p>You have done a good job with this section.</p>,
      },
    },
  },
}
