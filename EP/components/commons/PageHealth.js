import React from 'react'
import { mutuals, common } from '../../actions/commonActions'
import ReactHtmlParser from 'react-html-parser'
import _ from 'underscore'

let faceNotDetectedData = {
  colorType: 2,
  heading: 'Face not detected',
  underText:
    'Your face was not detected in several portions of the video. Please adopt the following steps to resolve this gap:',
  bullets: [
    `Increase illumination - If the room is not properly lit up, or the light source is not positioned from the front, your face may appear dark. Try increasing the illumination level or moving the source of light towards your face. `,
    `Sit at an appropriate distance from the screen.`,
    `Avoid looking extreme left/right.`,
    `Ensure that the camera source does not vibrate.`,
    `Avoid moving during the interview duration.`,
  ],
}

let speechNotDetectedData = {
  colorType: 2,
  heading: 'Speech not detected',
  underText: `Sorry, we didn't hear you! If you haven't spoken anything, practice is the first step towards improvement. However, in case your speech was not detected, please adopt the following steps - `,
  bullets: [
    `Speak louder so that the system can recognise your speech.`,
    ` Reduce the level of ambient noises in the room.`,
    `Ensure that your microphone is working. Click on "System Check" on the calibration page to check whether your microphone and camera are working properly.
    `,
  ],
}

let imgArr = [
  {
    path: process.env.APP_BASE_URL + '/dist/images/new/flag-outline.svg',
    alt: 'flag',
  },
  { path: '', alt: '' },
  {
    path: process.env.APP_BASE_URL + '/dist/images/new/help-outline.svg',
    alt: 'help',
  },
]

export let PageHealth = props => {
  if (props.state === null) {
    return null
  }

  let data = null
  if (props.state === 'notDetected') {
    if (_.has(props, 'type') && props.type === 'nonVerbals') {
      data = faceNotDetectedData
    } else {
      data = speechNotDetectedData
    }
  } else {
    data = props.data[props.state]
  }

  return (
    <div
      className="future-steps"
      style={{ borderLeftColor: common.primaryColor[data.colorType] }}>
      <h2 className="clearfix">
        <img
          className="img-beside-text"
          src={imgArr[data.colorType].path}
          alt={imgArr[data.colorType].alt}
        />
        <span className="ml-6 text-">{ReactHtmlParser(data.heading)}</span>
      </h2>
      <div className="mt-6">{ReactHtmlParser(data.underText)}</div>

      <div className="shift-left">
        {data.bullets.map((item, index) => {
          return (
            <div key={index} className="bullet-items">
              <div
                className="rounded-full"
                style={{ background: common.lighterColor[data.colorType] }}>
                <span style={{ color: common.darkColor[data.colorType] }}>
                  {index + 1}
                </span>
              </div>

              <div className="pt-2">{item}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export let pageHealthData = {
  eyeContact: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: `It is difficult to maintain eye contact with the interviewer during the entire course of an interview so practice Business Gaze. <div class="mt-4"/>
  Also, in an in-person interview, you may face multiple interviewers. Maintain eye contact and direct your answer towards the interviewer posing the question. However, if your answer is longer than 20 seconds, make sure to engage the other interviewers as well while making brief eye contact to ensure you have their attention.`,
      bullets: [],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText:
        'Building eye contact with the interviewer establishes trust and evokes a sense of comfort as well as connect. It also portrays self-confidence.',
      bullets: [],
    },
  },
  facial: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: `Facial yoga can help ease the muscles and nerves and make it easier to speak for longer hours. <div class="mt-4"/>
  Perform cheek exercises to tone the muscles around your face and ease the process of talking and smiling for longer hours and make it appear organic. Stretching your mouth muscles by alternately smiling will release the tension around your mouth for better speech clarity.`,
      bullets: [],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: `Smiling is a default facial expression for any conversation that reflects positivity and fosters communication. A light, relaxed smile helps to break the ice with the interviewer and conveys a sense of calm and an enthusiastic job-ready attitude.<div class="mt-4" />
  Smile at the beginning when you walk into the interview to convey enthusiasm and self-confidence as well as at the end of the interview to acknowledge the effort and time expended by the interviewer.`,
      bullets: [],
    },
  },
  gesture: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: `You can further enhance your gestures :`,
      bullets: [
        'You may list your achievements by counting the same on your fingers.',
        'Place your hands in a steeple to convey confidence and conviction.',
        'Keep your hand movement restricted to the region between the chest and waist for maximum impact.',
        'Explain process flows or levels by flattening your hand and moving it down stepwise as you list the points.',
        'To bring attention to a specific point or idea, create some space (approx. 2 inches) between your thumb and forefinger and hold your hand in front of your chest.',
      ],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: `According to research by Holler and Beattie, hand gestures increase the value of a verbal message by 60%! They enable the speaker to express emotions and create emphasis as needed. <div class='mt-4'/>
  However, there are certain must-avoid gestures which should not be used in a formal setting:`,
      bullets: [
        `Pointing- This can seem accusatory or invasive and immediately put interviewers on their guard.`,
        `Crossing arms across the chest- Generally perceived as a sign of defensiveness, it can also convey a casual attitude or signal disinterest.`,
        `Palms on the table- Holding your palms downwards is a sign of dominance. Tapping your fingers on the table is also not considered appropriate.`,
      ],
    },
  },
  body: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: `Interviewers start to evaluate a candidate within the first 10 seconds of the interview! Even before the actual conversation starts! How you walk into the room can cast a strong impression within those 10 seconds. <div class="mt-4" /> Rehearse your interview walk. Walk in confidently with your back straight, neck elongated and shoulders and head held high. Do not drag your feet. Walk directly towards the recruiter while maintaining a steady eye contact.`,
      bullets: [],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: `When you have an appropriate posture, you exude a sense of confidence. When you sit up straight and look straight ahead, it also encourages you to look directly into the interviewer's eyes while speaking.`,
      bullets: [],
    },
  },
  appearance: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: `Some industries have a casual dress code, and it may not be appropriate to come to the interview in a conservative, formal suit. If you have contacts at the company, inquire about the recruiters’ expectations and the organisation’s culture and try to fit with the tone. If you don’t have any personal contacts, it’s acceptable to call the human resources department and ask about the acceptable interview dress code.`,
      bullets: [],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: `A survey of employers carried out by the National Association of Colleges and Employers looked at various external attributes in interviewees and their influence on the interviewer’s hiring decision. The results indicated that the nature of a candidate’s grooming would have the strongest influence on the employer’s attitude while 73 percent of respondents said it would have a strong influence.`,
      bullets: [],
    },
  },
  word: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: 'Good state is detected',
      bullets: [``, ``],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: 'Needs work State',
      bullets: [``, ``],
    },
  },
  sentence: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: ``,
      bullets: [``, ``],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: 'Needs work State',
      bullets: [``, ``],
    },
  },
  vocal: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: 'Good state is detected',
      bullets: [],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: 'Needs work State',
      bullets: [],
    },
  },
  pauses: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: `Pauses are one component of communication. Consider the following elements for effective communication. You can rehearse for all of these and find the combination that is right for you.`,
      bullets: [
        `Pitch- Maintain your natural pitch but you can take on a lower pitch for more serious discussions.`,
        `Speed and Intensity- Speak slowly and clearly, making sure you are easily audible.`,
        `Emphasis- To add greater impact, use powerful words like ‘spearheaded’ or highlight your achievements to draw the interviewer’s attention.`,
        `Pauses- When used appropriately, pauses can help dramatize your speech and attract attention at the strategic segments, for instance, when asserting an important point.`,
      ],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: `Pauses help your interviewer in keeping abreast with your speech but excessive pauses tend to disrupt the comprehension. They can end up becoming a drain on the recruiter’s time and also sabotage your chances of casting a favourable impression. Structure your thoughts before the interview to avoid unnecessary pauses.`,
      bullets: [],
    },
  },
  disfluencies: {
    goodJobState: {
      colorType: 0,
      heading:
        'Next steps: <span class="font-normal">Pointers for in-person interview</span>',
      underText: ` An important part of delivering your pitch is to appear confident. While confidence can be expressed in a variety of ways, you may begin by expressing confidence by limiting filler words. The more you practise, the more prepared you will feel, and the fewer filler words you will naturally use. <div class="mt-4" /> While it is important to practise, it is not recommended that you memorize a script as you may sound robotic and get absorbed by the thought of saying the 'right' words in the right order. Practise performing your pitch out loud in a variety of ways so that you can get the nerves out of the way.`,
      bullets: [],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: `Disfluency is an interruption in the smooth flow of speech. It could represent any un-meaningful sound like aah, umm, or any other stutter. This happens primarily when thoughts are not clear and the person continues rambling on incoherent points. <div class="mt-4" /> The system counts the number of times you use fillers. Once you are conscious of these unnecessary interruptions, gradually try to reduce their usage.`,
      bullets: [],
    },
  },
  modulation: {
    goodJobState: {
      colorType: 0,
      heading: `Next steps: Motivate Yourself`,
      underText: `There are 4 main elements to focus on while practising for effective modulation:`,
      bullets: [
        `Pitch- Maintain your natural pitch but you can take on a lower pitch for more serious discussions.`,
        `Speed and Intensity- Speak slowly and clearly, making sure you are easily audible.`,
        `Emphasis- To add greater impact, use powerful words like ‘spearheaded’ or highlight your achievements to draw the interviewer’s attention.`,
        `Pauses- When used appropriately, pauses can help dramatize your speech and attract attention at the strategic segments, for instance, when asserting an important point.`,
      ],
    },
    needsWorkState: {
      colorType: 2,
      heading: 'Next steps: <span class="font-normal">Motivate Yourself</span>',
      underText: `Voice modulation is a very important aspect of your speech. It helps you hold the interviewer’s attention and add emphasis to the important parts of your speech. It reflects confidence and helps in convincing the interviewer that you are well prepared and know what you are talking about.
  Certain vocal exercises can help with speech modulation.`,
      bullets: [],
    },
  },
}
