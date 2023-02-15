const websiteMessage = (
  company: string,
  role?: string
) => `I'm applying for a job at ${company}. ${
  role
    ? `The role is ${role}.`
    : `I'm applying for open Product Management leadership roles.`
} 

My name is Tim Feeley. 
I'm a product manager with two decades of experience building products that billions of people use.
Most recently, at Google, I was a product manager in the Identity space, leading Google Accounts.
Before that, at Facebook, I was the product manager for the Facebook Design System, where we researched, optimized and deployed high-performing UX design patterns.
Before that, at Tripadvisor, I built and led a team of product managers focused on the core app experience. 
I also have in-depth experience as a designer and developer. In fact, I designed and coded this very site!

Create an introduction for the hiring team. It should be 2-3 short paragraphs.

It should be friendly, casual, conversational and aspirational.
It should have a slight sense of humor.
It should start off introducing myself.
It should mention their mission and ${
  role
    ? `the ${role} role.`
    : `and that I'd love to talk more about open roles that could be a match.`
}
It shouldn't be too serious or formal and should avoid jargon.`

export default websiteMessage
