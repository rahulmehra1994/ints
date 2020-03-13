export const feedbackAriaLabel = {
  empty: {
    title_text: 'You have not written this section!',
    title: 'You have not written this section!',
    body: {
      categories:
        ' Unable to find any mentioned categories as the seciton is empty.',
      language:
        ' The language parameter is evaluated along the following aspects. Write atleast <b>50+</b> words for language feedback.',
      impact: ' The impact parameter is evaluated along the following aspects.',
      skills: ' There are no skills detected as the section is empty.',
      seo:
        ' There are no relevant SEO keywords detected as the section is empty.',
      section_score: {
        Headline: 'Start writing in the edit mode.',
        Summary: 'Start writing in the edit mode.',
        Experience: 'Start writing in the edit mode.',
        Education: 'Start writing in the edit mode.',
      },
    },
  },
  red: {
    title_text: 'Needs Work!',
    title: 'Needs Work!',
    body: {
      categories:
        ' Please consider adding more relevant categories in this section. See edit mode for category suggestions.',
      language:
        ' Follow the feedback to improve your language in this section.',
      impact: ' Follow the feedback to make your section more impactful.',
      skills:
        ' You should try to include more skills relevant to target job function(s) from your profile.',
      seo:
        ' Include more SEO keywords by incorporating additional information categories. See edit mode for suggestions.',
      section_score: {
        Headline: 'Consider the feedback to improve this section',
        Summary: 'Consider the feedback to improve this section',
        Experience: 'Consider the feedback to improve this section',
        Education: 'Consider the feedback to improve this section',
      },
    },
  },
  yellow: {
    title_text: 'On Track!',
    title: 'On Track!',
    body: {
      categories:
        ' Please consider adding more relevant categories in this section. See edit mode for category suggestions.',
      language:
        ' Follow the feedback to improve your language in this section.',
      impact: ' Follow the feedback to make your section more impactful.',
      skills:
        ' You should try to include more skills relevant to target job function(s) from your profile.',
      seo:
        ' Include more SEO keywords by incorporating additional information categories. See edit mode for suggestions.',
      section_score: {
        Headline: 'Consider the feedback to improve this section',
        Summary: 'Consider the feedback to improve this section',
        Experience: 'Consider the feedback to improve this section',
        Education: 'Consider the feedback to improve this section',
      },
    },
  },
  green: {
    title_text: 'Looks Good!',
    title: 'Looks Good!',
    body: {
      categories: ' You have added sufficient number of relevant categories.',
      language:
        ' Follow the feedback to further improve your language in this section',
      impact: ' Your section is impactful. Great work!',
      skills:
        ' You have included top skills relevant to target job function(s) from your profile.',
      seo: ' You have done a good job of including SEO keywords here.',
      section_score: {
        Headline: 'You have done a good job with this section',
        Summary: 'You have done a good job with this section',
        Experience: 'You have done a good job with this experience',
        Education: 'You have done a good job with this section',
      },
    },
  },
}

export const editScreenAriaLabel = {
  logButtonActive:
    'Click this button to see the history of previous edited versions of the section',
  logButtonInactive:
    'See the history of previous edited versions of the section. You have no edits yet.',
  editButton:
    'Click on this button to try the edit mode to instantly see the effect any changes have on your score',
  previousButton: 'Click to see the previous entry of this section',
  nextButton: 'Click to see the feedback of next entry in this section',
}

export const contentSectionAriaLabel = {
  impact: {
    Summary: {
      red: {
        action_oriented:
          'You have not begun your bullets with an action verb. Try using action oriented verbs in the beginning to create more impact.',
        specifics:
          'Try to use specifics in the bullets to quantify your contribution to the company and create a greater impact on the profile visitor.',
      },
      green: {
        action_oriented:
          'Good Job! You have begun your bullets with strong action verbs signalling actions performed by you.',
        specifics:
          'You have done a good job of quantifying your impact in the bullets.',
      },
      yellow: {
        action_oriented:
          'You have not begun your bullets with an action verb. Try using action oriented verbs in the beginning to create more impact.',
        specifics:
          'Try to use specifics in the bullets to quantify your contribution to the company and create a greater impact on the profile visitor.',
      },
    },
    Experience: {
      red: {
        action_oriented:
          'You have not begun your sentences with an action verb. Try using action oriented verbs in the beginning to create more impact.',
        specifics:
          'Try to use specifics to quantify your contribution to the company and create a greater impact on the profile visitor.',
      },
      green: {
        action_oriented:
          'Good Job! You have begun your sentences with strong action verbs signalling actions performed by you.',
        specifics:
          'You have done a good job of quantifying your impact in this experience.',
      },
      yellow: {
        action_oriented:
          'You have not begun your sentences with an action verb. Try using action oriented verbs in the beginning to create more impact.',
        specifics:
          'Try to use specifics to quantify your contribution to the company and create a greater impact on the profile visitor.',
      },
    },
  },
  language: {
    Headline: {
      red: {
        buzzwords:
          'You have used some filler words. Revise your sentences to make them more effective and concise.',

        verb_overusage:
          'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',

        tense: '',

        narrative_voice: '',

        spell_check: '',
      },
      green: {
        buzzwords:
          "Good Job! You have stayed away from using any fillers, that's great!",
        verb_overusage: 'You have not overused any verb, good job!',
        tense: '',
        narrative_voice: '',
        spell_check: '',
      },
      yellow: {
        buzzwords:
          'You have used some filler words. Revise your sentences to make them more effective and concise.',

        verb_overusage:
          'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',

        tense: '',
        narrative_voice: '',
        spell_check: '',
      },
    },
    Summary: {
      red: {
        buzzwords:
          'You have used some filler words. Revise your sentences to make them more effective and concise.',

        verb_overusage:
          'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',

        tense:
          'You have switched tenses in your sample multiple times, making it inconsistent. Try writing the sample without switching the tense too much.',

        narrative_voice:
          'While writing your summary, try to avoid switching voice from first person to third person or vice versa when talking about yourself.',

        spell_check: '',
      },
      green: {
        buzzwords:
          "Good Job! You have stayed away from using any fillers, that's great!",

        verb_overusage: 'You have not overused any verb, good job!',

        tense:
          'Good Job! You have avoided switching between tenses too much and maintained consistency in your sample.',

        narrative_voice:
          'You have done a good job of writing your summary section without switching voice from first person to third person or vice versa.',

        spell_check: '',
      },
      yellow: {
        buzzwords:
          'You have used some filler words. Revise your sentences to make them more effective and concise.',

        verb_overusage:
          'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',

        tense:
          'You have switched tenses multiple times in your sample, making it inconsistent. Try writing the sample without switching the tense too much.',

        narrative_voice:
          'While writing your summary, try to avoid switching voice from first person to third person or vice versa when talking about yourself.',

        spell_check: '',
      },
    },
    Experience: {
      red: {
        buzzwords:
          'You have used some filler words. Revise your sentences to make them more effective and concise.',

        verb_overusage:
          'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',

        tense:
          'You have switched tenses in your sample, making it inconsistent. Try writing the sample in single tense.',

        narrative_voice:
          'You have used third person voice in your sample. Try to write information about yourself in first person.',

        spell_check: '',
      },
      green: {
        buzzwords:
          "Good Job! You have stayed away from using any fillers, that's great!",

        verb_overusage: 'You have not overused any verb, good job!',

        tense:
          'Good Job! You have avoided switching between tenses and maintained consistency in your sample.',

        narrative_voice:
          'You have done an excellent job of writing your section in first person and keeping the use of third person voice limited to only necessary parts.',

        spell_check: '',
      },
      yellow: {
        buzzwords:
          'You have used some filler words. Revise your sentences to make them more effective and concise.',

        verb_overusage:
          'You have overused a few verbs. Revise your sentences or use synonyms in their place to make them more effective.',

        tense:
          'You have switched tenses in your sample, making it inconsistent. Try writing the sample in single tense.',

        narrative_voice:
          'You have used third person voice in your sample. Try to write information about yourself in first person.',

        spell_check: '',
      },
    },
  },
}

export const personalInformationFeedbackAriaLabel = {
  red:
    'It is very important to get your basic information right. Make sure that you choose a professional profile URL and avoid any errors! and your profile Needs Work!. Consider the feedback to improve this section.',
  yellow:
    'It is very important to get your basic information right. Make sure that you choose a professional profile URL and avoid any errors! and your profile is On Track!. Consider the feedback to improve this section.',
  green:
    'It is very important to get your basic information right. Make sure that you choose a professional profile URL and avoid any errors! and your profile Looks Good!. You have done a good job with this section.',
  feedbackMap: {
    name: {
      green: 'You have written your name in the correct format.',
      yellow:
        'Please mention both your First and Last name and ensure that it matches with the name in your resume.',
      red:
        'Please mention both your First and Last name and ensure that it matches with the name in your resume.',
    },
    url: {
      green: 'You have done a good job of writing a professional profile URL.',
      yellow:
        'Your profile URL is weak and difficult to look for on the web. Please check edit mode for suggestions.',
      red:
        'Your profile URL is weak and difficult to look for on the web. Please check edit mode for suggestions.',
    },
    connections: {
      green:
        'You have done a good job of forging an extensive professional network!',
      yellow:
        'You have few connections. Consider expanding your network to more than 500 connections.',
      red:
        'You have few connections. Consider expanding your network to more than 500 connections.',
    },
  },
}

export const profilePictureFeedbackAriaLabel = {
  empty: {
    title_text: 'You have not uploaded your profile picture!',
    body:
      'Upload your profile picture in the edit mode to get instant feedback',
  },
  red: {
    title_text: 'Needs Work!',
    body: 'Consider the feedback to improve this section',
  },
  yellow: {
    title_text: 'On Track!',
    body: 'Consider the feedback to improve this section',
  },
  green: {
    title_text: 'Looks Good!',
    body:
      'You have done a good job of uploading a professional profile picture',
  },
}

export const editModalAriaLabel = {
  loading_sample: 'please wait while we load the samples for you',
  loading_sample_error: 'Error while laoding samples',
  next_sample: 'click to get the next sample. Shift tab to see',
  previous_sample: 'Click to get the previous sample. Shift tab to see',
  saving: 'Please wait while your changes are being processed',
  save: 'Click to save the changes you have made and get feedback here itself',
  close: 'Click to close the edit modal',
  reset: 'Click to reset changes',
  no_change_made: 'Button disabled, no changes made',
  loading_feedback: 'Please wait while the feedback is loading',

  samples: 'Click to get the feedback of samples',
  content: 'Click to get the feedback of content',
  skills: 'Click to get the feedback of skills',
  language: 'Click to get the feedback of language',
  impact: 'Click to get the feedback of impact',
  rephrase_words: 'Click to get the feedback of rephrase_words',

  similar_skill: 'Similar users are writing about these skills',
  no_skill:
    'You have not mentioned skills effectively. Please refer to the following guidance for specialised tips on how to highlight skills in this section.',
  write_skill: 'How to write about skills?',
  write_skill_ans:
    'Writing about skills can be done in two ways, they can be stated directly or as phrases from which the reader can derive skills. For higher visibility, try using direct forms of skills so that recruiters can easily find you.',
  what_skill: 'what skill to write about?',

  profile_picture: {
    empty: 'You have not uploaded your profile picture',
    upload: 'Click to upload profile picture',
    uploading: 'Please wait while the picture is being processed',
    edit: 'Click to edit profile picture',
    sample:
      'Sample suggestions for good profile pictures. Your profile picture should have the following attributes. A face/frame ratio of around 50%, clear picture with correct background and foreground illumination, an appropriate face to body ratio and with camera eye contact and smile',
    profile_pic: 'Your profile picture',
    zoom: 'Zoom in and out with arrow keys',
    left_rotate: 'Click to Rotate image 90 degree anti clockwise',
    right_rotate: 'Click to Rotate image 90 degree clockwise',
    close_upload: 'Click to close the upload profile picture modal',
    input_file: 'input type file. Only images formats',
  },
  personal_info: {
    suggested_url:
      'we have some url for you which you can use to increase your profile visibility',
    availability: 'Check availability of URLs on LinkedIn',
    name: 'Edit or change your profile name',
    url: 'Edit your LinkedIn url to increase profile visibility',
    enter_url: 'Enter profile URL. Mandatory field',
    enter_name: 'Enter name. Mandatory field',
  },
  Headline: {
    skill_try: 'Try to include 3-5 relevant skills to improve score',
    suggestion_edit: 'Below are some suggestion for good headline',
    headline: 'headline suggestions basis your profile',
    category: 'Similar users are writing about these categories',
    skill: 'Similar users are writing about these skills',
  },
  summary: {},
  experience: {},
  education: {},
  Summary: {
    mentioned_skill: 'you have mentioned these skills in your summary',
    mentioned_skill_resume: 'you have mentioned these skills in your Resume',
    skill_try: 'Try to include 10+ relevant skills to improve score',
    content_try: 'Try to include 5-8 relevant categories in this section',
    mentioned_category: 'you have mentioned these categories in your Summary',
    include_category: 'Similar users are writing about these categories',
    tense: {
      correct_way:
        'correct way As Product Manager at Google, I was responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team. I was selected from amongst 200 employees to form 10 person strategic review team responsible for software product development, driving new product sales as well as managing relations with existing product users',
      incorrect_way:
        'incorrect way As Product Manager at Google, I was responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team. I am selected from amongst 200 employees to form 10 person strategic review team responsible for software product development, driving new product sales as well as managing relations with existing product users',
    },
    narrative_voice: {
      correct_way:
        'correct way I am a Management Consultant with 8 years of experience serving telecommunications and technology clients. I am presently working at KPMG and have proven expertise in financial and data analysis.',
      incorrect_way:
        'incorrect way Management Consultant with 8 years experience serving telecommunications and technology clients. I am working at KPMG and have gained expertise in financial analysis and data analysis.',
    },

    specifics: {
      correct_way:
        'correct way Developed product roadmap and introduced new product features in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
      incorrect_way:
        'incorrect way Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth',
    },
    action_oriented: {
      correct_way:
        'correct way Developed product roadmap and introduced new product features in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
      incorrect_way:
        'incorrect way Responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
    },

    verb_overusage: {
      correct_way:
        'correct way I developed product roadmap in collaboration with international cross-functional team, generating ideas to redesign product promotion strategies. I also established and trained 10 person strategic review team responsible for product development.',
      incorrect_way:
        'incorrect way I developed product roadmap in collaboration with international cross-functional team, generating ideas to redesign product promotion strategies. I also developed and trained 10 person strategic review team responsible for product development.',
    },
    buzzwords: {
      correct_way:
        'correct way I am a committed and competent professional with expertise in Financial Analysis and Valuation',
      incorrect_way:
        'incorrect way I am a dedicated individual and am an expert in Financial Analysis and Valuation',
    },

    example: [
      {
        example:
          'With 8 years of experience as a Human Resources Manager at  Goldman Sachs including 2 years of experience in talent development and recruiting, I have recently obtained a Professional Certificate in Human Resources and am aiming to open my own HR Consultancy for providing HR solutions to a diverse and wide set of companies.',
      },
      {
        example:
          'At College, I was the Chairman of the Toastmasters Club. As Chairman, I organized various training sessions and workshops for students. I had also participated in various international competitions and had won the 1st prize in the KPMG International Case Competition twice in a row.',
      },
      {
        example:
          'I am an MBA candidate focusing on Finance and Strategy at Harvard Business School and have prior experience of 3 years in the same field. I have always been academically inclined and graduated Summa Cum Laude from Cornell University.',
      },
      {
        example:
          'I am presently looking for opportunities in the Education Industry as I always felt that working for student development and enhancing students’ careers was my calling in life. I can be reached at abc.jkl@gmail.com.',
      },
    ],
  },
  Experience: {
    input_title: 'Enter Job title, mandatory field.',
    input_company: 'Enter Company name, mandatory field.',
    is_current: {
      true:
        'Check if this is current experience. Press space to check or uncheck',
      false:
        'Check if this is current experience. Press space to check or uncheck',
    },
    to:
      'Select end month and year from the following drop down, tab to move to drop down. Mandatory field',
    from:
      'Select start month and year from the following drop down, tab to move to drop down. Mandatory field',
    from_month:
      'Select start month from drop down by arrow key, Mandatory field',
    from_year: 'Select start year from drop down by arrow key, Mandatory field',
    to_month: 'Select end month from drop down by arrow key, Mandatory field',
    to_year: 'Select end year from drop down by arrow key, Mandatory field',
    mentioned_skill: 'you have mentioned these skills in your Experience',
    mentioned_skill_resume: 'you have mentioned these skills in your Resume',
    no_skill:
      'You have not mentioned skills effectively. Please refer to the following guidance for specialised tips on how to highlight skills in this section.',
    skill_try: 'Try to include 8+ relevant skills to improve score',
    content_try: 'Try to include 2-4 relevant categories in this section',
    mentioned_category:
      'you have mentioned these categories in your Experience',
    include_category: 'Similar users are writing about these categories',
    tense: {
      correct_way:
        'correct way Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15% Selected from amongst 200 employees to form 10 person strategic review team responsible for software product development; spearheaded new product sales and managed relations with existing product users',
      incorrect_way:
        'incorrect way Develop product roadmap and introducing new product feature in collaboration with international cross-functional team; generate ideas to redesign product promotion strategies, leading to revenue growth of 15% Selected from amongst 200 employees to form 10 person strategic review team responsible for software product development, driving new product sales as well as managing relations with existing product users',
    },
    narrative_voice: {
      correct_way:
        'correct way Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
      incorrect_way:
        'incorrect way Responsible for developing product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
    },
    specifics: {
      correct_way:
        'correct way Developed product roadmap and introduced new product features in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
      incorrect_way:
        'incorrect way Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth',
    },
    action_oriented: {
      correct_way:
        'correct way Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
      incorrect_way:
        'incorrect way Responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
    },
    verb_overusage: {
      correct_way:
        'correct way Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15% Selected from amongst 200 employees to form 10 person strategic review team responsible for software product development; drove new product sales and managed relations with existing product users',
      incorrect_way:
        'incorrect way Analysed past marketing data and prepared digital marketing strategies; implemented strategies to drive 25% increase in new customers Compared and analysed results from campaign and took corrective actions; provided sales data and marketing training material to new analysts, improving efficiency by 28%',
    },
    buzzwords: {
      correct_way:
        'correct way Developed product roadmap in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
      incorrect_way:
        'incorrect way Developed the product roadmap in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies that led to revenue growth of 15%',
    },
    example: [
      {
        example:
          'Accounting Intern - Accounts payable | Accounts receivables | Auditing at Deloitte Mar 2016 - May 2016 As part of summer internship at Deloitte, I undertook the following task: - Performed meticulous accounting for companies across Healthcare and Technology industries; processed and consolidated 100+ customer and vendor invoices, saving company close to $10,000 in interest payments',
      },
      {
        example:
          'President - Marketing Club at Harvard Business School Jan 1993 - Jan 1995 While pursuing my MBA, I was President of Marketing Club and had won "Student of the Year D Award" as well as various international competitions. I was majorly responsible for: - Organising 10+ competitions and seminars every year, looking for and inviting industry professionals to speak at events and getting maximum student turnout',
      },
      {
        example:
          'MBA Finance Student at Harvard Business School Jan 2016 - Present Presently, I am pursuing MBA in Finance and Strategy at Harvard Business School, graduating in 2017. Over the last 1 year, I have built skills in financial analysis and modeling, along with investment analysis and investment strategies. - Received CFA Certification 2 months earlier; tutored batch of 100+ students in basic financial management concepts securing top of class results',
      },
    ],
  },
  Education: {
    skill_try: 'Try to include 2-4 relevant skills to improve score',
    mentioned_skill: 'you have mentioned these skills in your education',
    mentioned_skill_resume: 'you have mentioned these skills in your Resume',
    no_skill:
      'You have not mentioned skills effectively. Please refer to the following guidance for specialised tips on how to highlight skills in this section.',
    content_try: 'Try to include 5-8 relevant categories in this section',
    mentioned_category: 'you have mentioned these categories in your education',
    include_category: 'Similar users are writing about these categories',
    input_school: 'Enter School name, mandatory field.',
    input_degree: 'Enter Degree name. ',
    input_field: 'Enter field of study. ',
    from_year: 'Select start year from drop down by arrow key, Mandatory field',
    to_year: 'Select end year from drop down by arrow key, Mandatory field',
    to:
      'Select end month and year from the following drop down, tab to move to drop down. Mandatory field. ',
    from:
      'Select start month and year from the following drop down, tab to move to drop down. Mandatory field',
  },
}

export const infoScreenConnectLabel = {
  language: 'Click to know more about language',
  seo: 'Click to know more about Search engine optimisation keywords',
  skills: 'Click to know more about skills',
  impact: 'Click to know more about impactful sentences',
  information_category: 'Click to know more about information category',
  profile_picture: 'Click to know more about good profile picture',
}

export const infoScreenAriaLabel = {
  close: 'Click to close the information modal',
  next: 'Click to see next sample',
  previous: 'click to see previous sample',
  category: {
    what: 'What are Information Categories?',
    text:
      'Your profile needs to include certain important pieces of information that gives your profile visitors an overall view of you as a professional for example, your job role, job functions, educational qualification etc. This information helps recruiters figure out if you might be the correct fit for their company',
    list: 'List of categories that you can include',
    next: 'click to know next sample then shift tab to listen',
    previous: 'click to know previous sample then shift tab to listen',
    heading:
      'Illustrations of how Information Categories improve first impression',
    Headline: {
      sample: {
        first:
          'This example include Job Function,Industry, Job Role, Company/Organisation. Begin with 5 yrs experience in Marketing as job function in Technology Industry as industry. Product Manager as job role at Apple as company, skilled in Product marketing as job function',
        second:
          'This example include Degree, Concentration,   School/University, Goal Based Keyword, Job Function. Begin with MBA Finance & Strategy as degree concentration, Candidate at Stanford as university, Looking or interested as goal based keyword for internship opportunities in the field of Business Development as job function.',
        third:
          'This example include Goal Based Keyword,Job Function,Position of Responsibility,Club/Society, Certifications. Begin with Recent graduate seeking or looking as goal based keyword Investment Banking as job function internship | President - Finance Club as position of responsibility and club | CFA as certificate, Asset Management, Strategy as job function',
      },
    },
    Summary: {
      sample: {
        first:
          'With 8 years of experience in job role at company name, for example Human Resources Manager at Goldman Sachs including 2 years of experience your job function, for example, talent development and recruiting, I have recently obtained a certificatio, for example, Professional Certificate in Human Resources, and am aiming to open my own HR Consultancy for providing HR solutions to a diverse and wide set of companies.',
        second:
          'At College, I was the Chairman, or any position of responsibility of the clubs and society for example, Toastmasters Club. As Chairman, I organized various training sessions and workshops for students. I had also participated in various competition and received awards, for example international competitions and had won the 1st prize in the KPMG International Case Competition twice in a row',
        third:
          'start with including degree and concentration from your university then summarise, for example, I am an MBA as degree candidate, focusing on Finance as concentration and Strategy as concentration at Harvard Business School as university and have prior experience of 3 years in the same field. I have always been academically inclined and graduated Summa Cum Laude from Cornell University as university.',
        fourth:
          'start with a goal based keyword towards your industry, for example I am presently looking for opportunities in the Education Industry as I always felt that working for student development and enhancing students’ careers was my calling in life. I can be reached at contact information for example abc.jkl@gmail.com.',
      },
    },
    Experience: {
      sample: {
        first:
          'This example includes Job Role, Job Function , Company/Organisation, Industry. Headline as Accounting Intern as job role - Accounts payable as job function | Accounts receivables | Auditing at Deloitte as company. Include your duration of experience. Then summarise. As part of summer internship at Deloitte as company , I undertook the following task:- Performed meticulous accounting as job function for companies across Healthcare and Technology industries as industry. processed and consolidated 100+ customer and vendor invoices, saving company close to $10,000 in interest payments',
        second:
          'This example includes Position of Responsibility, Club/Society, School/University, Awards, Competitions, Goal Based Keyword. Headline as President - Marketing Club as position of responsibility at Harvard Business School as university. Include your duration of experience. While pursuing my MBA, I was President of Marketing Club and had won "Student of the Year D Award" as awards as well as various international competitions as competition. I was majorly responsible for:- Organising 10+ competitions and seminars every year, looking for and inviting industry professionals as goal based keyword to speak at events and getting maximum student turnout',
        third:
          'This example include Degree, Concentration, School/University and Certifications. Headline as MBA Finance as degree concentration Student at C Harvard Business School as university. Include your duration of experience. Then summarise. Presently, I am pursuing MBA in Finance and Strategy at Harvard Business School, graduating in 2017. Over the last 1 year, I have built skills in financial analysis and modeling, along with investment analysis and investment strategies.- Received CFA Certification as certifications 2 months earlier; tutored batch of 100+ students in basic financial management concepts securing top of class results',
      },
    },
    Education: {
      sample: {
        first:
          'This example includes information categories School/University, Degree, Concentration, Position of Responsibility, Club/Society, Certifications. Headline as London Business School as school Master of Business Administration (MBA), Finance as Degree, concentration. Include duration of education for example 2015 - 2017. Include your major achievements for example Activities and Societies: President as position of responsibilty, Consulting Club, Member - Energy Club , Member - Business Club and China Club as clubs and society, completed CFA Certification as certification',
        second:
          'This example includes School/University, Degree, Concentration, Club/Society,   Awards, Competitions. Headline as Harvard Business School as school, Master of Business Administration (MBA), Finance as degree, concentraion. Include duration of education for example 2015 - 2017. Include your major achievements for example Activities and Societies: Member of Private Equity and Venture Capital Club as clubs, Winner as awards of Case Study Competition as competition',
      },
    },
  },
  impact: {
    what: 'what is impact?',
    text: `Impact refers to the effect of your profile on visitors. It can be measured by the way you have conveyed your actions and their outcomes in your profile. If after reading a sentence, the recruiter immediately notices your action and its effect, you have done a good job in reflecting the impact of your experiences.`,
    action_oriented: {
      Summary: {
        text: `If you are including bullets in your summary section, begin with
            strong action verbs that inform the Recruiter of the exact actions
            YOU performed.`,
        correct: `correct bullet example is, 
            Developed product roadmap
            and introduced new product features in collaboration with
            international cross-functional team; generated ideas to redesign
            product promotion strategies, leading to revenue growth of 15%
          `,
        incorrect: `
        incorrect bullet example is, 
            Responsible for developing
            product roadmap and introducing new product feature in collaboration
            with international cross-functional team; generated ideas to
            redesign product promotion strategies, leading to revenue growth of
            15%
          `,
      },
      Experience: {
        text: `
            Your experience needs to showcase the work YOU did. Begin your
            sentences with strong action verbs that inform the Recruiter of the
            exact actions YOU performed.
          `,
        correct: `correct bullet example is,
            Developed product roadmap
            and introduced new product feature in collaboration with
            international cross-functional team; generated ideas to redesign
            product promotion strategies, leading to revenue growth of 15%
          `,
        incorrect: `incorrect bullet example is,
            Responsible for developing
            product roadmap and introducing new product feature in collaboration
            with international cross-functional team; generated ideas to
            redesign product promotion strategies, leading to revenue growth of
            15%
          `,
      },
    },
    specifics: {
      text: `
          Specifics refer to the quantification of outcomes/ impact in your
          profile. These are outlined by a quantifiable outcome or size and
          scope of work. Examples include revenue, cost, size of your team, or
          departments you supported.
        `,
      correct: `correct bullet example is, 
            Developed product roadmap
            and introduced new product features in collaboration with
            international cross-functional team; generated ideas to redesign
            product promotion strategies, leading to revenue growth of 15%
          `,
      incorrect: `incorrect bullet example is, 
            Developed product roadmap
            and introduced new product feature in collaboration with
            international cross-functional team; generated ideas to redesign
            product promotion strategies, leading to revenue growth
          `,
    },
  },
  language: {
    what: 'What is the role of language in Linkedin profile?',
    text:
      'Your language plays a huge role in guiding the recruiter’s decision to continue reading your profile or not. Make sure that you avoid basic grammatical mistakes, write in consistent tense and avoid overuse of words.',
    sectionData: {
      voice: {
        Summary: {
          text: `Voice consistency is a measure to check the amount of switch between voices in your summary section. Make sure that you are not switching from first person to third person or vice versa when talking about yourself.`,
          correct: `correct bullet example is, I am a Management Consultant with 8 years of experience serving telecommunications and technology clients. I am presently working at KPMG and have proven expertise in financial and data analysis.`,
          incorrect: `incorrect bullet example is, Management Consultant with 8 years experience serving telecommunications and technology clients. I am working at KPMG and have gained expertise in financial analysis and data analysis.`,
        },
        Experience: {
          text: `The system identifies and evaluates narrative voice. It is advisable to write in first person instead of third person when talking about yourself as it creates a direct connect with recruiters or people visiting your profile.`,
          correct: `correct bullet example is, Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%`,
          incorrect: `incorrect bullet example is, Responsible for developing product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%`,
        },
      },
      tenseconsistency: {
        Summary: {
          text: `Tense consistency is a measure to check the amount of switch between tenses in your summary section. To avoid presenting a disconcerting read to the reviewer and to ensure consistency, one should write the summary without switching between tenses too much.`,
          correct: `correct bullet example is, As Product Manager at Google, I was responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team. I was selected from amongst 200 employees to form 10 person strategic review team responsible for software product development, driving new product sales as well as managing relations with existing product users`,
          incorrect: `incorrect bullet example is, As Product Manager at Google, I was responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team. I am selected from amongst 200 employees to form 10 person strategic review team responsible for software product development, driving new product sales as well as managing relations with existing product users`,
        },
        Experience: {
          text: `Tense consistency is a measure to check the amount of switch between tenses in your experience section. To avoid presenting a disconcerting read to the reviewer and to ensure consistency, one should write the experience without switching between tenses.`,
          correct: `correct bullet example is, Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15% next bullet point Selected from amongst 200 employees to form 10 person strategic review team responsible for software product development; spearheaded new product sales and managed relations with existing product users`,
          incorrect: `incorrect bullet example is, Develop product roadmap and introducing new product feature in collaboration with international cross-functional team; generate ideas to redesign product promotion strategies, leading to revenue growth of 15%                              
                               next bullet point
                 Selected from amongst 200 employees to form 10 person strategic review team responsible for software product development, driving new product sales as well as managing relations with existing product users`,
        },
      },
      avoidedwords: {
        Summary: {
          text: `
                Avoided Words include passive language, filler words, often used
                in a sentence such as 'successfully', 'the', 'which', 'where',
                and others that consume valuable space on your profile without
                creating much impact.
                It may make sense to use these in some cases, so use your
                judgement to remove them completely or revise the sentence
                content, making it more concise and impactful.
          `,
          correct: `correct bullet example is, 
                I am a committed and competent professional with expertise in
                Financial Analysis and Valuation
          `,
          incorrect: `incorrect bullet example is, 
                I am a dedicated
                 individual
                and am an expert in Financial Analysis and Valuation
          `,
        },
        Experience: {
          text: `
                Avoided Words include passive language, filler words, often used
                in a sentence such as 'successfully', 'the', 'which', 'where',
                and others that consume valuable space on your profile without
                creating much impact.
                It may make sense to use these in some cases, so use your
                judgement to remove them completely or revise the sentence
                content, making it more concise and impactful.
          `,
          correct: `correct bullet example is, 
                  Developed product
                roadmap in collaboration with international cross-functional
                team; generated ideas to redesign product promotion strategies,
                leading to revenue growth of 15%
          `,
          incorrect: `incorrect bullet example is, 
                  Developed
                 the
                 product roadmap in
                collaboration with international cross-functional team;
                generated ideas to redesign product promotion strategies
                 that
                 led to revenue growth of
                15%
          `,
        },
      },
      verboverusage: {
        Summary: {
          text: `
              Using same words again and again makes a profile sound too
              repetitive, diminishing the chances of important information
              standing out. Each word of the profile holds a certain weight and
              repeating words lends a negative impression.
          `,
          correct: `correct bullet example is, 
                I developed product roadmap in collaboration with international
                cross-functional team, generating ideas to redesign product
                promotion strategies. I also established and trained 10 person
                strategic review team responsible for product development.
          `,
          incorrect: `incorrect bullet example is, 
                I developed
                 product roadmap in
                collaboration with international cross-functional team,
                generating ideas to redesign product promotion strategies. I
                also developed
                 and trained 10
                person strategic review team responsible for product
                development.
          `,
        },
        Experience: {
          text: `
              Using same words again and again makes a profile sound too
              repetitive, diminishing the chances of important information
              standing out. Each word of the profile holds a certain weight and
              repeating words lends a negative impression.
          `,
          correct: `correct bullet example is, 
                  Developed product
                roadmap and introduced new product feature in collaboration with
                international cross-functional team; generated ideas to redesign
                product promotion strategies, leading to revenue growth of 15%
              next bullet point
                  Selected from amongst
                200 employees to form 10 person strategic review team
                responsible for software product development; drove new product
                sales and managed relations with existing product users
          `,
          incorrect: `incorrect bullet example is, 
                Analysed
                 past marketing data
                and prepared digital marketing strategies; implemented
                strategies to drive 25% increase in new customers
                next bullet point
                  Compared and
                analysed
                 results from campaign
                and took corrective actions; provided sales data and marketing
                training material to new analysts, improving efficiency by 28%
          `,
        },
      },
    },
  },
  profile_picture: {
    what: 'What factors to consider for perfect profile picture?',
    text:
      'According to LinkedIn research, having a picture, by itself, makes your profile 14 times more likely to be viewed. It is your chance to have a good first impression on the Recruiter. Make sure that your picture is professional and has all the characteristics of a good image listed below.',
    sample: {
      face_frame: 'A good image has a face/frame ratio of around 50%.',
      face_body:
        'In a good LinkedIn profile picture, your face covers a larger area as compared to your body.',
      background:
        'A good image has a light colored background that helps to portray your picture clearly.',
      foreground:
        'Ensure that shadows and other reflections do not interfere with the clarity and prominence of your face.',
      eye:
        'One should make an eye contact with the camera. This portrays confidence in the person.',
      smile:
        'An open smile increases likeability and is a feature in almost all good LinkedIn profile pictures.',
      size:
        'Photo size should be between 400 x 400 and 20K x 20K pixels for optimum picture clarity.',
    },
  },
  profile_strength: {
    what: '',
    text: '',
  },
  visibility: {
    what: 'what is profile visibility?',
    text:
      'Profile visibility refers to how early your profile features in a list of profiles when recruiters search by some keywords. Including keywords relevant to your target job function(s) in your profile helps improve your SEO ranking and increases the chances of recruiters finding your profile earlier.',
    sample: {
      text: 'Elements that help make a LinkedIn profile more visible:',
      keyword:
        'Using standard terminologies for job roles, competencies, skills, and any other jargon helps your profile match search queries that recruiters use.',
      skill:
        'Include as many skills relevant to target function(s) as possible in your profile so that when the recruiter searches with any skill relevant to your target function(s), your profile prominently features at the top of the list.',
      category:
        'Mentioning job roles, job functions, schools, companies, all help in directing your profile towards searches that recruiters would be doing.',
    },
  },
  skill: {
    what: 'How and why are skills important for your Linkedin Profile?',
    text:
      'Relevant skills refer to skills that are important for pursuing a career in your chosen target function(s). Including these skills in your profile makes the recruiters feel that you are a better fit for the job and increases your chances of being singled out for that job. Follow the diagram below to decide which skills to focus on.',
    sample: {
      focus: 'What skills to focus on?',
      focus_ans:
        'With our machine learning and AI engines, you can exactly know what skills are valued for the target functions you have selected. Try to focus on the intersection of what you have and what is required.',
      write: 'How to write about skills?',
      write_ans:
        'Writing about skills can be done in two ways, they can be stated directly or as phrases from which the reader can derive skills. For higher visibility, try using direct forms of skills so that recruiters can easily find you.',
      stated: 'know what are stated skills',
      stated_ans:
        'Stated skills are skills that are mentioned directly in your profile. Stating a relevant skill increases your SEO ranking.',
      stated_ex_1:
        'example To showcase “Business Development” skill, you can write: Led and improved business development efforts and reduced client acquisition cost by 38%',
      stated_ex_2:
        'example To showcase “Recruiting” skill, you can write: Worked as HR Manager and handled recruiting of new and efficient candidates for KPMG; reduced vacancies, improving efficiency by 25%',
      derived: 'know what are derived skills',
      derived_ans:
        'Derived skills are skills that have been mentioned in such a way that the reader can infer the skill from the language used',
      derived_ex_1:
        'example To showcase “Strategy Implementation” skill, you can write: Developed and executed Go to Market strategies, resulting in increased sales and profit',
      derived_ex_2:
        'example To showcase “Team Leadership” skill, you can write: Led cross-functional team of Business Development, Marketing, HR and IT to design 2 CRM data-processing tools for optimum client handling',
    },
  },
}

export const logModalAriaLabel = {
  revert: 'Revert to this version',
  close: 'Click to close the log modal',
  '1': 'score improved from this version',
  '-1': 'score decreased from this version',
  '0': 'No improvement from this version,',
}

export const resumePDFChangeFunctionModalAriaLabel = {
  close: 'Click to close the modal',
  pdf: {
    upload:
      'click to upload the LinkedIn pdf, by uploading your pdf you will be able to unlock your full profile feedback. ',
    steps: `Below are the steps to upload your linkedin profile`,
    step1:
      'Click the ‘Go to LinkedIn’ button provided below to open your linkedin account. It will open in a new tab.',
    step2: `Click ‘More’ button on the linkedin page and then ‘Save to PDF’ from the dropdown`,
    step3: `Upload your downloaded pdf here`,
    go_to: 'Click to go to your linkedin profile, new tab will be open',
    file_input: 'input type file. only pdf',
  },
  resume: {
    match:
      'We provide the skill match between your resume and linkedIn to maintain a consistency',
    upload:
      'Click to upload a new resume in PDF format. Resume will be processed automatically once uploaded.',
    uploaded:
      'You have the option to select from the resume you have uploaded on our platform, you can select from them',
    no_upload: 'You have not uploaded any resume on our platform',
    note:
      'Please note, only resume in pdf format are allowed and no cover letter',
    resume: 'uploaded on resume platform, Click to check it out there',
    cf: 'uploaded on career fit platform, click to check it out there',
    file_input: 'input type file. only pdf',
  },
  cf: {
    feedback: 'Click to view feedback',
    select: 'Please select atleast one or at max 3 Target functions',
  },
}

export const zoneToAriaLabelMapping = {
  picture_empty:
    'You have not uploaded your profile picture! Upload profile picture in the edit mode.',
  empty: 'You have not written this section!, start writing in the edit mode.',
  red: 'Needs Work, Consider the feedback to improve this section.',
  yellow: 'is on Track, Consider the feedback to improve this section.',
  green: 'Looks Good, You have done a good job with this section!',
}

export const summaryScreenAriaLabel = {
  see_how:
    'Unlock the full feedback for all sections by uploading your full profile, click to upload your linkedin PDF',
  see_how_clicked: 'Your profile is being processed please wait',
}

export const customerFeedbackAriaLabel = {
  close: 'click to close the feedback modal',
  later: 'remind me later',
  submit: 'submit the feedback',
  feedbackLive: 'Please provide your valuable feedback.',
}

export const dataIntegrationAriaLabel = {
  close: 'Click to close the data integration modal',
  copy: 'Click this button to copy this section content to clipboard',
  download:
    'Click to download the profile picture. You can directly upload this profile picture on your linkedIn profile',
  no_changes: 'You haven’t made any changes yet ',
  start_editing: 'Start editing to see improvements',
  copy_note: 'Note - Only description will be copied',
  go_to_linkedin:
    'Click to go to your linkedin profile, this will open in a new tab',
}
