const resumeMessage = (
  company: string,
  role?: string
) => `I'm applying for a job at ${company}. ${
  role
    ? `The role is ${role}.`
    : `I'm applying for open Product Management leadership roles.`
} 

I'm applying for a job at ${company}. I'm applying for ${
  role ? `the ${role} role.` : `open Product Management leadership roles.`
}

My name is Tim Feeley. 
I’m Tim Feeley, a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.   
I worked at Google for 4 years, where I grew and led teams and PMs in 4 countries responsible for protecting over Google accounts, building culture, principles and practices to keep everyone aligned and empowered to make decisions autonomously.
At Goldman Sachs, I worked for the Marcus consumer fintech division and developed a customizable and centralized platform for account opening and identity management, serving 9M+ customers while increasing signup conversion.
At Meta, I was responsible for the global Facebook UX library, containing designs, code and guidance to craft beautiful, simple interfaces —with measurable results.
At Tripadvisor, I created and led the Site Experience team, improving how travelers navigate and experience the site and apps, managing seven reports, two managers & 30+ engineers across 3 offices.

I have a technical and design background and have led teams, grown Product Managers and built product organizations.

Write a letter to the hiring team expressing interest.

You must begin it with these two paragraphs:
1) "Hi ${company} hiring team,"
2) "I’m Tim—a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people."

You must end it with this paragraph:
"For more information about me, visit []"


Avoid phrases like "I am confident" and "skillset and experience" and "proven track record".
Avoid any business jargon.
Connect my skills and experience with ${company}'s mission.
It should be casual, conversational, clever, witty.`

export default resumeMessage
