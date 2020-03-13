import React from 'react'

export const sectionData = {
  voice: {
    Summary: {
      text: (
        <p>
          Voice consistency is a measure to check the amount of switch between
          voices in your summary section. Make sure that you are not switching
          from first person to third person or vice versa when talking about
          yourself.
        </p>
      ),
      correct: (
        <p>
          I am a Management Consultant with 8 years of experience serving
          telecommunications and technology clients. I am presently working at
          KPMG and have proven expertise in financial and data analysis.
        </p>
      ),
      incorrect: (
        <p>
          Management Consultant with 8 years experience serving
          telecommunications and technology clients. I am working at KPMG and
          have gained expertise in financial analysis and data analysis.
        </p>
      ),
    },
    Experience: {
      text: (
        <p>
          The system identifies and evaluates narrative voice. It is advisable
          to write in first person instead of third person when talking about
          yourself as it creates a direct connect with recruiters or people
          visiting your profile.
        </p>
      ),
      correct: (
        <p>
          <span>{String.fromCharCode(9642)} </span> Developed product roadmap
          and introduced new product feature in collaboration with international
          cross-functional team; generated ideas to redesign product promotion
          strategies, leading to revenue growth of 15%
        </p>
      ),
      incorrect: (
        <p>
          <span>{String.fromCharCode(9642)} </span> Responsible for developing
          product roadmap and introduced new product feature in collaboration
          with international cross-functional team; generated ideas to redesign
          product promotion strategies, leading to revenue growth of 15%
        </p>
      ),
    },
  },
  tenseconsistency: {
    Summary: {
      text: (
        <p>
          Tense consistency is a measure to check the amount of switch between
          tenses in your summary section. To avoid presenting a disconcerting
          read to the reviewer and to ensure consistency, one should write the
          summary without switching between tenses too much.
        </p>
      ),
      correct: (
        <div>
          <p>
            {' '}
            As Product Manager at Google, I was responsible for developing
            product roadmap and introducing new product feature in collaboration
            with international cross-functional team. I was selected from
            amongst 200 employees to form 10 person strategic review team
            responsible for software product development, driving new product
            sales as well as managing relations with existing product users{' '}
          </p>
        </div>
      ),
      incorrect: (
        <div>
          <p>
            {' '}
            As Product Manager at Google, I{' '}
            <span className="text-red">was</span> responsible for developing
            product roadmap and introducing new product feature in collaboration
            with international cross-functional team. I{' '}
            <span className="text-red">am</span> selected from amongst 200
            employees to form 10 person strategic review team responsible for
            software product development, driving new product sales as well as
            managing relations with existing product users{' '}
          </p>
        </div>
      ),
    },
    Experience: {
      text: (
        <p>
          Tense consistency is a measure to check the amount of switch between
          tenses in your experience section. To avoid presenting a disconcerting
          read to the reviewer and to ensure consistency, one should write the
          experience without switching between tenses.
        </p>
      ),
      correct: (
        <div>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span> Developed product roadmap
            and introduced new product feature in collaboration with
            international cross-functional team; generated ideas to redesign
            product promotion strategies, leading to revenue growth of 15%{' '}
          </p>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span> Selected from amongst 200
            employees to form 10 person strategic review team responsible for
            software product development; spearheaded new product sales and
            managed relations with existing product users{' '}
          </p>
        </div>
      ),
      incorrect: (
        <div>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span>{' '}
            <span className="text-red">Develop</span> product roadmap and
            introducing new product feature in collaboration with international
            cross-functional team; generate ideas to redesign product promotion
            strategies, leading to revenue growth of 15%{' '}
          </p>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span>{' '}
            <span className="text-red">Selected</span> from amongst 200
            employees to form 10 person strategic review team responsible for
            software product development, driving new product sales as well as
            managing relations with existing product users{' '}
          </p>
        </div>
      ),
    },
  },
  avoidedwords: {
    Summary: {
      text: (
        <div>
          <p>
            Avoided Words include passive language, filler words, often used in
            a sentence such as 'successfully', 'the', 'which', 'where', and
            others that consume valuable space on your profile without creating
            much impact.
          </p>
          <p>
            It may make sense to use these in some cases, so use your judgement
            to remove them completely or revise the sentence content, making it
            more concise and impactful.
          </p>
        </div>
      ),
      correct: (
        <div>
          <p>
            {' '}
            I am a committed and competent professional with expertise in
            Financial Analysis and Valuation{' '}
          </p>
        </div>
      ),
      incorrect: (
        <div>
          <p>
            {' '}
            I am a <span className="text-red">dedicated</span> individual and am
            an expert in Financial Analysis and Valuation{' '}
          </p>
        </div>
      ),
    },
    Experience: {
      text: (
        <div>
          <p>
            Avoided Words include passive language, filler words, often used in
            a sentence such as 'successfully', 'the', 'which', 'where', and
            others that consume valuable space on your profile without creating
            much impact.
          </p>
          <p>
            It may make sense to use these in some cases, so use your judgement
            to remove them completely or revise the sentence content, making it
            more concise and impactful.
          </p>
        </div>
      ),
      correct: (
        <div>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span> Developed product roadmap
            in collaboration with international cross-functional team; generated
            ideas to redesign product promotion strategies, leading to revenue
            growth of 15%
          </p>
        </div>
      ),
      incorrect: (
        <div>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span> Developed{' '}
            <span className="text-red"> the</span> product roadmap in
            collaboration with international cross-functional team; generated
            ideas to redesign product promotion strategies{' '}
            <span className="text-red"> that</span> led to revenue growth of 15%{' '}
          </p>
        </div>
      ),
    },
  },
  verboverusage: {
    Summary: {
      text: (
        <p>
          Using same words again and again makes a profile sound too repetitive,
          diminishing the chances of important information standing out. Each
          word of the profile holds a certain weight and repeating words lends a
          negative impression.
        </p>
      ),
      correct: (
        <div>
          <p>
            {' '}
            I developed product roadmap in collaboration with international
            cross-functional team, generating ideas to redesign product
            promotion strategies. I also established and trained 10 person
            strategic review team responsible for product development.
          </p>
        </div>
      ),
      incorrect: (
        <div>
          <p>
            {' '}
            I <span className="text-red">developed</span> product roadmap in
            collaboration with international cross-functional team, generating
            ideas to redesign product promotion strategies. I also{' '}
            <span className="text-red">developed</span> and trained 10 person
            strategic review team responsible for product development.{' '}
          </p>
        </div>
      ),
    },
    Experience: {
      text: (
        <p>
          Using same words again and again makes a profile sound too repetitive,
          diminishing the chances of important information standing out. Each
          word of the profile holds a certain weight and repeating words lends a
          negative impression.
        </p>
      ),
      correct: (
        <div>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span> Developed product roadmap
            and introduced new product feature in collaboration with
            international cross-functional team; generated ideas to redesign
            product promotion strategies, leading to revenue growth of 15%{' '}
          </p>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span> Selected from amongst 200
            employees to form 10 person strategic review team responsible for
            software product development; drove new product sales and managed
            relations with existing product users{' '}
          </p>
        </div>
      ),
      incorrect: (
        <div>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span>{' '}
            <span className="text-red">Analysed</span> past marketing data and
            prepared digital marketing strategies; implemented strategies to
            drive 25% increase in new customers{' '}
          </p>
          <p>
            {' '}
            <span>{String.fromCharCode(9642)} </span> Compared and{' '}
            <span className="text-red">analysed</span> results from campaign and
            took corrective actions; provided sales data and marketing training
            material to new analysts, improving efficiency by 28%{' '}
          </p>
        </div>
      ),
    },
  },
}
