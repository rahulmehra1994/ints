import { urlEnds } from './../actions/commonActions'

export function defaultUrls(intkey) {
  return {
    calibration: `/elevator-pitch${urlEnds.calibration}`,
    interview: `${intkey}${urlEnds.interview}`,
    results: `${intkey}${urlEnds.results}`,
    summary: `${intkey}/results${urlEnds.summary}`,
    detailed: `${intkey}/results${urlEnds.detailed}`,
    eyeContact: `${intkey}/results/detailed${urlEnds.eyeContact}`,
    eyeGaze: `${intkey}/results/detailed/eye-contact${urlEnds.eyeGaze}`,
    smile: `${intkey}/results/detailed/facial-expression${urlEnds.smile}`,
    gesture: `${intkey}/results/detailed${urlEnds.gesture}`,
    body: `${intkey}/results/detailed${urlEnds.body}`,
    appearance: `${intkey}/results/detailed${urlEnds.appearance}`,
    word: `${intkey}/results/detailed${urlEnds.word}`,
    sentence: `${intkey}/results/detailed${urlEnds.sentence}`,
    competency: `${intkey}/results/detailed${urlEnds.competency}`,
    vocal: `${intkey}/results/detailed${urlEnds.vocal}`,
    pauses: `${intkey}/results/detailed${urlEnds.pauses}`,
    disfluencies: `${intkey}/results/detailed${urlEnds.disfluencies}`,
    modulation: `${intkey}/results/detailed${urlEnds.modulation}`,
    videosummary: `${intkey}/results/detailed${urlEnds.videosummary}`,
    noContent: `${intkey}/results/detailed${urlEnds.noContent}`,
  }
}
