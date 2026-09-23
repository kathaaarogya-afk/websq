import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Story from "@/models/Story";
import Category from "@/models/Category";
import { STORY_CATEGORIES } from "@/lib/categories";

const categoryDescriptions: Record<string, string> = {
  Technology: "Guides, news and deep dives into everything tech.",
  AI: "Artificial intelligence explained in plain, practical language.",
  "Web Development": "Build websites with tutorials, code and best practices.",
  SEO: "Search engine optimisation — get found on Google, step by step.",
  "Digital Marketing": "Practical marketing skills for the internet era.",
  Education: "Learning journeys, study tips and skill-building.",
  Life: "Everyday experiences and personal lessons.",
  Family: "Stories and lessons from family life.",
  Career: "Work, growth, resilience and professional know-how.",
  Travel: "Destinations, adventures and travel wisdom.",
  Health: "Physical and mental wellbeing, the practical way.",
  Inspiration: "Ideas and encouragement to keep going.",
  Personal: "Personal reflections, honestly written.",
};

const authors = [
  { name: "Admin", email: "admin@websq.com.au", bio: "Site administrator.", role: "admin" as const, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  { name: "Sarah Johnson", email: "sarah@websq.com.au", bio: "Life stories, lessons and everyday reflections.", role: "user" as const, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" },
  { name: "David Wilson", email: "david@websq.com.au", bio: "Technology writer covering gadgets, AI and digital life.", role: "user" as const, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
  { name: "Emily Brown", email: "emily@websq.com.au", bio: "Education advocate writing about learning and growth.", role: "user" as const, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  { name: "Alex Morgan", email: "alex@websq.com.au", bio: "Writer on artificial intelligence, explained without the hype.", role: "user" as const, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
  { name: "Chris Patel", email: "chris@websq.com.au", bio: "Web developer sharing tutorials, code and build stories.", role: "user" as const, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face" },
  { name: "Amanda Reyes", email: "amanda@websq.com.au", bio: "SEO specialist helping sites get found on Google.", role: "user" as const, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face" },
  { name: "Priya Sharma", email: "priya@websq.com.au", bio: "Digital marketing strategist with practical, hands-on advice.", role: "user" as const, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" },
  { name: "Liam O'Connor", email: "liam@websq.com.au", bio: "Parent and storyteller writing about family life.", role: "user" as const, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
  { name: "Maria Gonzalez", email: "maria@websq.com.au", bio: "Writing about careers, work and professional growth.", role: "user" as const, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face" },
  { name: "Tom Bennett", email: "tom@websq.com.au", bio: "Adventure seeker sharing travel stories and tips.", role: "user" as const, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face" },
  { name: "Nina Sarwar", email: "nina@websq.com.au", bio: "Health and wellbeing writer with a practical approach.", role: "user" as const, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  { name: "Grace Nguyen", email: "grace@websq.com.au", bio: "Writer on inspiration, motivation and perseverance.", role: "user" as const, image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face" },
  { name: "Jack Turner", email: "jack@websq.com.au", bio: "Honest personal essays on privacy, habits and self-discovery.", role: "user" as const, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
];

const stories = [
  // ===== LIFE (2) =====
  {
    title: "The Day I Learned to Let Go",
    category: "Life",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    excerpt: "Sometimes the hardest thing to do is nothing at all. Here is how I learned that letting go is not giving up.",
    content: `<p>For years, I held onto everything — grudges, fears, expectations, and plans that no longer served me. I thought letting go meant losing control.</p><p>It was during a quiet evening walk along the beach that it finally clicked. The waves kept coming, pulling sand back and pushing it forward, endlessly. Nothing was permanent. The shoreline I stood on today would be different tomorrow.</p><p>I started small. I let go of a friendship that had become toxic. I stopped replaying arguments in my head. I forgave myself for mistakes I made years ago.</p><p>Each release felt like putting down a heavy bag I had been carrying for so long I forgot it was there. The weight lifted. My shoulders dropped. I could breathe.</p><p>Letting go is not about pretending things did not happen. It is about choosing peace over pain, growth over stagnation, and the future over the past.</p><p>Today, I still catch myself holding on. But now I recognize the weight, and I know how to set it down.</p>`,
    author: 1,
    views: 342,
    likesCount: 45,
    commentsCount: 12,
  },
  {
    title: "Finding Joy in Small Things",
    category: "Life",
    coverImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=600&fit=crop",
    excerpt: "The secret to happiness was not in big achievements, but in tiny everyday moments I had been ignoring.",
    content: `<p>I spent years chasing big milestones — the promotion, the house, the vacation. Each time I reached one, the excitement faded quickly, and I was already chasing the next thing.</p><p>Then one Tuesday, I noticed something. I was sitting on my balcony, drinking tea, watching a cat stretch in the sunlight on the roof across the street. And I felt genuinely happy.</p><p>Not because anything special was happening. Just because the tea was warm, the sun was out, and the moment was perfect as it was.</p><p>That was when I realized I had been looking for happiness in all the wrong places. It was not in the achievements. It was in the spaces between them.</p><p>Now I notice the good stuff. The smell of fresh bread. A stranger holding the door. The sound of rain on the roof. A good laugh with a friend.</p><p>Big goals are still important. But they are no longer the source of my happiness. The small things are.</p>`,
    author: 1,
    views: 523,
    likesCount: 89,
    commentsCount: 34,
  },

  // ===== FAMILY (2) =====
  {
    title: "A Letter to My Daughter",
    category: "Family",
    coverImage: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&h=600&fit=crop",
    excerpt: "Things I want my daughter to know as she grows up in a world full of noise and pressure.",
    content: `<p>My dearest girl,</p><p>You are only five years old, and already you have taught me more about love than I ever thought possible. I want to write this letter now, before the world gets loud and you start believing you need to be anything other than yourself.</p><p>You do not need to be perfect. You do not need everyone to like you. You do not need to have all the answers. You just need to be kind — to others and to yourself.</p><p>There will be days when things feel hard. When friends let you down. When you fail at something you worked hard for. On those days, I want you to remember this: you are allowed to feel sad, but you are not allowed to give up on yourself.</p><p>Be curious. Ask questions. Make mistakes. Laugh loudly. Dance in the kitchen. Read books under the covers with a flashlight.</p><p>And always, always know that no matter what happens, you have a home in my heart that nothing can ever take away.</p><p>Love, Mum</p>`,
    author: 8,
    views: 891,
    likesCount: 156,
    commentsCount: 43,
  },
  {
    title: "Cooking With Grandma: Recipes and Memories",
    category: "Family",
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    excerpt: "The kitchen was Grandma's classroom, and every recipe was a lesson in love.",
    content: `<p>Every Sunday morning, the smell of cardamom and cinnamon would drift through the house. That meant Grandma was in the kitchen.</p><p>She never used measuring cups. A pinch of this, a handful of that. "Cooking is about feeling, not numbers," she would say, waving her wooden spoon like a conductor's baton.</p><p>Her hands told stories. The scar on her left thumb from a knife slip in 1978. The flour permanently dusted into the lines of her palms. Every wrinkle was a chapter of a life well-lived.</p><p>I learned more in that kitchen than any classroom. I learned patience — waiting for the dough to rise. I learned generosity — she always made enough for neighbors. I learned that food is love made visible.</p><p>Grandma passed away two years ago. But every time I step into my kitchen and cook her recipes, she is right there with me. In the smell of cardamom. In the warmth of the oven. In the love I put on the table for my own family.</p>`,
    author: 8,
    views: 678,
    likesCount: 112,
    commentsCount: 28,
  },

  // ===== CAREER (2) =====
  {
    title: "Why I Quit My Dream Job",
    category: "Career",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    excerpt: "Everyone thought I was crazy for leaving a six-figure salary. Here is why it was the best decision I ever made.",
    content: `<p>I had the job everyone wanted. Corner office, great team, impressive title on LinkedIn. From the outside, it looked like I had made it.</p><p>But every Sunday night, I felt a knot in my stomach. The work was fine. The pay was excellent. But I was not excited. I was not learning. I was going through the motions.</p><p>The breaking point was a Tuesday morning. I was sitting in a meeting that could have been an email, thinking about a side project I had been working on for months — an app that helped local farmers sell produce directly to restaurants. That project lit me up. The meeting did not.</p><p>I handed in my resignation that Friday. My boss thought I was having a breakdown. My parents thought I had lost my mind. My friends were confused.</p><p>That was 18 months ago. Today, my app is live in three cities. I earn less than half of what I used to. But I wake up excited. I work on something I believe in. I am building something of my own.</p><p>The dream job was never really my dream. It was someone else's definition of success.</p>`,
    author: 9,
    views: 1023,
    likesCount: 198,
    commentsCount: 56,
  },
  {
    title: "From Rejection to Resilience",
    category: "Career",
    coverImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop",
    excerpt: "I was rejected from 47 jobs before landing the one that changed my life.",
    content: `<p>The number is embarrassing, but I counted: 47 job rejections before I finally got hired. Forty-seven times I polished my resume, practiced my answers, wore my best outfit, and got told "no."</p><p>After rejection number 20, I stopped counting. After rejection number 30, I stopped believing in myself. After rejection number 40, I almost gave up on my field entirely.</p><p>What kept me going was a note on my desk from my mum: "The right door is there. You just have to keep knocking."</p><p>Rejection number 48 was different. The interviewer actually smiled when she saw my portfolio. "We have been waiting for someone like you," she said.</p><p>I nearly cried in the interview room.</p><p>That job taught me more in two years than five years of university. It led me to my current role, which I love.</p><p>If you are in the middle of your rejection phase, I want you to know: every no is bringing you closer to your yes. Do not stop knocking.</p>`,
    author: 9,
    views: 890,
    likesCount: 167,
    commentsCount: 42,
  },

  // ===== EDUCATION (2) =====
  {
    title: "The Teacher Who Changed My Life",
    category: "Education",
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    excerpt: "One teacher saw something in me that I could not see in myself. That changed everything.",
    content: `<p>I was a quiet kid. Not the smartest, not the loudest, not the one teachers remembered. I blended into the background and preferred it that way.</p><p>Then in Year 10, Mrs. Chen walked into our English class. She was different. She did not just teach from the textbook. She asked us questions that made us think.</p><p>One day, she asked us to write a short story. I wrote about a boy who could talk to birds. It was silly, but I put effort into it.</p><p>Mrs. Chen handed it back with a note: "You have a gift for storytelling. Have you ever considered writing more?"</p><p>No teacher had ever said anything like that to me. I had never considered myself good at anything.</p><p>I started writing. A lot. Short stories, poems, journal entries. Writing became my voice. It gave me confidence. It led me to study communications, which led to my career.</p><p>I tracked Mrs. Chen down years later and sent her a letter. She wrote back: "I always knew you had it in you. I just pointed it out."</p><p>Teachers do not just teach subjects. They see potential. And sometimes, that changes a life.</p>`,
    author: 3,
    views: 756,
    likesCount: 145,
    commentsCount: 38,
  },
  {
    title: "Why I Went Back to University at 35",
    category: "Education",
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    excerpt: "Everyone said it was too late. I proved them wrong.",
    content: `<p>At 35, I was a single mum with two kids, a full-time job, and a dream I had been putting off for a decade. I wanted to become a psychologist.</p><p>"You are too old," friends said. "You cannot afford it," my bank account agreed. "What about the kids?" my mum asked.</p><p>But something inside me refused to let it go. I had been fascinated by psychology since I was a teenager. Every self-help book, every podcast, every conversation about the mind — I was all in.</p><p>So I applied. Part-time degree. Online classes after the kids went to bed. Weekend study sessions at the library while my mum watched the children.</p><p>It was the hardest thing I have ever done. There were nights I cried over textbooks. Mornings I could barely keep my eyes open. Semesters I wanted to quit.</p><p>But I did not. Three years later, I graduated with honours. My kids were in the audience, cheering louder than anyone.</p><p>It is never too late. The only thing worse than starting late is never starting at all.</p>`,
    author: 3,
    views: 1234,
    likesCount: 234,
    commentsCount: 67,
  },

  // ===== TECHNOLOGY (2) =====
  {
    title: "How AI Changed My Daily Routine",
    category: "Technology",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    excerpt: "From sceptic to daily user — how artificial intelligence became an unexpected part of my everyday life.",
    content: `<p>I was firmly in the "AI is overhyped" camp. Every tech company was slapping "AI-powered" on their products, and I was rolling my eyes.</p><p>Then a colleague showed me how she used AI to draft emails, summarise meetings, and plan her week. It was not magic. It was just... practical.</p><p>I started small. I used an AI tool to help me write a difficult email to a client. Instead of staring at a blank screen for 20 minutes, I had a draft in 2 minutes. I edited it, made it mine, and sent it.</p><p>Now AI helps me brainstorm blog ideas, organise my notes, translate messages for international colleagues, and even plan meals for the week.</p><p>The key is treating AI as a tool, not a replacement. It is incredibly good at first drafts and mundane tasks. It is terrible at originality, empathy, and nuance — the things that make us human.</p><p>Use AI for the grunt work. Save your brain for the creative stuff.</p>`,
    author: 2,
    views: 934,
    likesCount: 167,
    commentsCount: 45,
  },
  {
    title: "Digital Detox: I Survived a Week Without My Phone",
    category: "Technology",
    coverImage: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=600&fit=crop",
    excerpt: "Seven days without scrolling. Here is what happened to my brain, my sleep, and my relationships.",
    content: `<p>I was averaging 6 hours of screen time a day. Not for work. For scrolling. Instagram, Twitter, news apps, YouTube — a constant stream of content filling every quiet moment.</p><p>So I did something drastic. I put my phone in a drawer for a week. I told my close contacts to call me if anything urgent came up. Then I stepped into the unknown.</p><p>Day 1 was terrifying. I reached for my phone 47 times. I counted. Each time, I had to remind myself: it is in the drawer.</p><p>Day 2 was easier. I started noticing things — the sound of birds outside, the way sunlight moved across my living room wall. I had not been present in my own home for months.</p><p>By Day 4, I was sleeping better. I fell asleep reading a book instead of doom-scrolling. I woke up refreshed, not groggy.</p><p>By Day 7, something had shifted. My mind felt quieter. I was more patient with my family. I had ideas for blog posts, creative projects, things I had been too distracted to think about.</p><p>I am back on my phone now. But I set limits. And I put it in the drawer every Sunday. The quiet is too valuable to give up.</p>`,
    author: 2,
    views: 1567,
    likesCount: 289,
    commentsCount: 72,
  },

  // ===== AI (2) =====
  {
    title: "What Is ChatGPT, Really? AI Explained in Plain English",
    category: "AI",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    excerpt: "No jargon, no hype. Here is what large language models actually do, how they 'think', and where they trip up.",
    content: `You have heard the term **ChatGPT** a thousand times. But what is it, really?

## The short version

ChatGPT is a **language model** — a piece of software trained on a huge amount of text that learns to predict which word is most likely to come next.

## How it works

1. It is fed millions of books, articles and web pages.
2. During training, it learns patterns in how words are used together.
3. When you type a prompt, it generates a response **one word at a time**, choosing the most probable next word.

That is it. Under the hood there is no magic — just math, statistics and a very large number of calculations.

## Why it feels so smart

Because it has "read" so much text, it can imitate human writing remarkably well. It understands context, tone and structure — but it does not *understand* meaning the way we do.

## Where it trips up

- It **makes things up** (called \`hallucination\`) when it is unsure.
- It **has no memory** of what happened before for long conversations.
- It can be confidently wrong.

## The takeaway

Treat AI like a very fast intern: brilliant at first drafts, summaries and starting points — but always check the facts before relying on it.

\`\`\`text
Great for:    drafting, brainstorming, summarising
Shaky at:     exact facts, current events, math
Use it for:   starting points, not final answers
\`\`\``,
    author: 4,
    views: 623,
    likesCount: 145,
    commentsCount: 41,
  },
  {
    title: "5 AI Tools That Save Me Hours Every Week",
    category: "AI",
    coverImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
    excerpt: "A practical list of AI tools I actually use for writing, research and web work — with realistic pros and cons.",
    content: `I tested a lot of AI tools so you do not have to. Here are **five** that genuinely save me time.

| Tool | Best for | Costs |
|------|----------|-------|
| ChatGPT | Drafting & brainstorming | Free / paid plans |
| Claude | Long-form writing & analysis | Free / paid plans |
| Perplexity | Research with citations | Free / paid plans |
| GitHub Copilot | Writing code faster | Paid |
| Canva AI | Images & design | Free / paid plans |

## 1. Drafting

I used to stare at a blank screen for 20 minutes. Now I ask for a rough outline:

> "Give me 5 section headings for an article about remote work."

## 2. Research

Tools like Perplexity return answers **with sources**, which makes fact-checking fast.

## 3. Code

GitHub Copilot suggests the next lines of code as you type. It is not always right, but it cuts keystrokes dramatically.

## My honest advice

- **Never copy-paste** AI output without editing. Readers can tell.
- **Use AI for the first 20%**, then do the thinking yourself.
- The best tool is the one that fits your workflow — not the trendiest.

> Rule of thumb: AI multiplies your effort. It does not replace it.`,
    author: 4,
    views: 812,
    likesCount: 173,
    commentsCount: 39,
  },

  // ===== SEO (1) =====
  {
    title: "SEO for Beginners: How Google Actually Ranks Your Website",
    category: "SEO",
    coverImage: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&h=600&fit=crop",
    excerpt: "Stop guessing. Here is how search engines decide which pages deserve the top spot — and what you can do about it.",
    content: `**SEO** (Search Engine Optimisation) sounds complicated, but the core idea is simple: help Google understand your page so it can show it to the right people.

## How Google thinks

Google works like a librarian who has read every page on the internet. When you search, it finds the pages that best answer your question. Three things matter:

1. **Relevance** — does your page match what people searched for?
2. **Quality** — is your content helpful, accurate and trustworthy?
3. **Popularity** — do other sites link to you? (backlinks)

## The checklist that actually works

| Task | Why it matters | Effort |
|------|---------------|--------|
| Use one clear topic per page | Helps Google understand your focus | Low |
| Put keywords in your title & headings | Signals relevance | Low |
| Write for humans first | Keep readers on your page | Medium |
| Make pages load fast | Better experience = better ranking | Medium |
| Get quality backlinks | Popularity signal | High |

## One simple rule

> Write the page you wish existed when you searched for that topic.

When a page genuinely helps people, links and shares follow — and that is most of SEO.

\`\`\`text
Don't start with tools.
Start with: "What question does this page answer?"
\`\`\`

## Patience is the secret

SEO is a long game. Most pages take **3–6 months** to rank. If a tool promises overnight results, it is probably going to hurt you later. Stay consistent, stay helpful, and the traffic comes.`,
    author: 6,
    views: 540,
    likesCount: 121,
    commentsCount: 33,
  },
  {
    title: "Digital Marketing on a Small Budget: What Actually Works",
    category: "Digital Marketing",
    coverImage: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop",
    excerpt: "You do not need a huge ad budget. A practical plan for growing your business online with almost no money.",
    content: `Everyone wants a cheap way to grow online. Good news: the basics still work, and most of them are **free**.

## 1. Email beats social media

Your social following belongs to the platform. Your email list belongs to you. Start collecting emails **on day one** — a simple form on your site is enough.

> An engaged list of 1,000 fans will outperform 100,000 random followers.

## 2. One channel, done properly

Pick **one** social platform where your audience actually hangs out. Post there consistently for 90 days before adding another. Spreading yourself thin is the fastest way to fail.

## 3. Content is your ad

Blog posts, short videos and guides bring in organic traffic that keeps working months later — unlike paid ads that stop the moment you stop paying.

## 4. Free tools are plenty

| Tool | Use it for |
|------|-----------|
| Google Search Console | See how people find you |
| Google Analytics | Track your traffic |
| Canva | Design without a designer |
| UTM links | Measure which posts work |

## The 20% effort minimum

Spend a little time weekly on:

- One useful article or video
- One email to your list
- Replying to comments and DMs

Do that for a quarter and you will have data on what works. **Double down on what works** — that is the whole strategy.`,
    author: 7,
    views: 612,
    likesCount: 138,
    commentsCount: 27,
  },

  // ===== TRAVEL (2) =====
  {
    title: "Solo Travel Changed Who I Am",
    category: "Travel",
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",
    excerpt: "I was terrified of travelling alone. Then I booked a one-way ticket to Thailand.",
    content: `<p>Travelling alone had always been my nightmare. The thought of eating alone in a restaurant, navigating foreign streets without a companion, sleeping in an unfamiliar room — it all felt overwhelming.</p><p>Then, at 28, after a breakup that left me questioning everything, I booked a one-way ticket to Bangkok. No return date. No itinerary. Just me and a backpack.</p><p>The first two days were brutal. I was lonely, confused, and questioning my decision. I sat in a hostel common room pretending to be busy on my phone while fighting back tears.</p><p>Then a Dutch traveller asked if I wanted to join her for street food. That small invitation changed everything. We explored temples, got lost in markets, and talked until 3 AM about our lives, fears, and dreams.</p><p>By the end of the trip, I had met people from 15 countries, learned to navigate alone, and discovered that I was far braver than I ever imagined.</p><p>Solo travel does not just show you the world. It shows you who you are when no one is watching.</p>`,
    author: 10,
    views: 1890,
    likesCount: 345,
    commentsCount: 87,
  },
  {
    title: "The Hidden Gems of Rural Japan",
    category: "Travel",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
    excerpt: "Beyond Tokyo and Kyoto, there is a Japan that most tourists never see.",
    content: `<p>Everyone told me to visit Tokyo, Kyoto, and Osaka. And they were right — those cities are incredible. But the Japan I fell in love with was somewhere else entirely.</p><p>I took a local train from Tokyo to a tiny village called Shirakawa-go. Three hours of winding tracks through mountains and rice fields. When I arrived, I felt like I had stepped into a different century.</p><p>Traditional wooden farmhouses with steep thatched roofs. Rice paddies stretching to the horizon. An elderly woman selling homemade mochi from a cart. No crowds. No tourist shops. Just life, slowly unfolding.</p><p>I stayed with a local family who served me home-cooked dinner and taught me to make tea the traditional way. We barely spoke the same language, but the warmth was universal.</p><p>The next morning, I watched the sunrise over the mountains from the village viewpoint. It was the most peaceful moment of my life.</p><p>Japan's hidden gems are not hidden at all. They are just off the beaten path, waiting for those willing to wander.</p>`,
    author: 10,
    views: 1234,
    likesCount: 213,
    commentsCount: 54,
  },

  // ===== HEALTH (2) =====
  {
    title: "How Walking 10,000 Steps Changed My Health",
    category: "Health",
    coverImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
    excerpt: "No gym membership, no expensive equipment. Just a pair of shoes and a daily commitment.",
    content: `<p>I hated gyms. The crowds, the machines, the awkwardness of not knowing what to do. Every January I would join, and by February I would have stopped.</p><p>Then a doctor told me my blood pressure was rising. Not dangerous yet, but a warning sign. She suggested one simple change: walk more.</p><p>I started with 5,000 steps a day. Just walking around my neighbourhood. Podcasts in my ears, comfortable shoes on my feet. It was easy. Almost too easy.</p><p>Within a month, I bumped it to 8,000. Then 10,000. I started taking the stairs. Parking further from the shop entrance. Walking during lunch breaks.</p><p>Three months later, I went back to the doctor. Blood pressure: normal. Weight: down 4 kg. Energy: through the roof. Sleep: deeper than it had been in years.</p><p>The best exercise is the one you actually do. For me, that is walking. No memberships. No equipment. No excuses. Just me, my shoes, and the road ahead.</p>`,
    author: 11,
    views: 1456,
    likesCount: 267,
    commentsCount: 63,
  },
  {
    title: "The Power of Saying No to Sugar",
    category: "Health",
    coverImage: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=600&fit=crop",
    excerpt: "I gave up sugar for 30 days. The results stunned me.",
    content: `<p>I had a sweet tooth that controlled me. Chocolate after every meal. Soda with lunch. Ice cream before bed. I knew it was bad, but I could not stop.</p><p>Then I watched a documentary about sugar addiction, and something clicked. I decided to try 30 days without added sugar.</p><p>Day 1-3: Headaches. Irritability. Cravings that felt like actual hunger. I almost quit at least five times.</p><p>Day 4-7: The headaches faded. My energy stabilised. I stopped needing an afternoon nap.</p><p>Day 8-14: My taste buds changed. An apple tasted incredibly sweet. Foods I used to love — sugary cereal, candy bars — tasted artificial and gross.</p><p>Day 15-30: I lost 3 kg. My skin cleared up. I slept better. I thought more clearly. I had energy I had not felt in years.</p><p>After 30 days, I did not go back to my old habits. I still eat sugar occasionally, but it is a choice, not a need. The difference is night and day.</p>`,
    author: 11,
    views: 1890,
    likesCount: 345,
    commentsCount: 78,
  },

  // ===== INSPIRATION (2) =====
  {
    title: "The Domino Effect of One Small Act",
    category: "Inspiration",
    coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    excerpt: "I held a door open for a stranger. That tiny moment rippled into something I never expected.",
    content: `<p>It was a rainy Tuesday. I was running late, distracted, and not in the mood for pleasantries. But when I reached the coffee shop door, I noticed a woman behind me struggling with two bags and an umbrella.</p><p>I held the door. She smiled. "Thank you so much. You have no idea how much I needed that."</p><p>Something about the way she said it made me pause. It was not just about the door. She looked tired, overwhelmed. I asked if she was okay.</p><p>Turns out she had just lost her job that morning. She was on her way to pick up her kids and did not know how she was going to tell them. We talked for 10 minutes. I shared some contacts in my network. She cried. I hugged her.</p><p>A year later, I received an email. She had found a new job through one of my contacts. She was doing well. And she wanted to thank me — not for holding the door, but for stopping to ask if she was okay.</p><p>We underestimate the power of small acts. A door held open. A kind word. A moment of attention. You never know what ripple you are creating.</p>`,
    author: 12,
    views: 3456,
    likesCount: 567,
    commentsCount: 134,
  },
  {
    title: "Failure Is Not the Opposite of Success",
    category: "Inspiration",
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    excerpt: "Every successful person I know has a trail of failures behind them. Here is what they all have in common.",
    content: `<p>We treat failure like it is the end. Like it is proof that we are not good enough. But every successful person I have interviewed, worked with, or admired shares one thing in common: they failed spectacularly, multiple times, before they succeeded.</p><p>One founder pitched her idea to 80 investors before the 81st said yes. That company is now worth $2 billion. A writer I know received 147 rejection letters before her first book was published. It became a bestseller.</p><p>The difference between people who succeed and people who do not is not talent. It is not luck. It is the willingness to fail and keep going.</p><p>Failure teaches you things success never can. It shows you what does not work. It humbles you. It builds resilience. It separates those who want it from those who merely wish for it.</p><p>So the next time you fail — and you will — do not see it as a stop sign. See it as a lesson, a redirection, and proof that you are trying. That is more than most people do.</p>`,
    author: 12,
    views: 2890,
    likesCount: 456,
    commentsCount: 98,
  },

  // ===== PERSONAL STORIES (3 short, ~500 words each) =====
  {
    title: "The Moment That Changed My Life",
    category: "Personal",
    coverImage: "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=800&h=600&fit=crop",
    excerpt: "A single phone call on a Tuesday afternoon reshaped everything I thought I knew about my future.",
    content: `<p>It was a Tuesday. I remember because I had just made a coffee — black, no sugar — and was staring at my laptop screen, pretending to work on a proposal I had been putting off for days.</p><p>The phone rang. It was my mum. Her voice was calm, the way it gets when something serious has happened and she is trying not to make it worse.</p><p>"Your dad had a heart attack. He is alive. But it is serious."</p><p>I dropped the coffee. It shattered on the kitchen floor, but I did not notice. I grabbed my keys and drove to the hospital in what felt like forty minutes but was probably fifteen.</p><p>When I arrived, Dad was in the cardiac unit. He was pale, connected to machines, but awake. When he saw me, he smiled — actually smiled — and said, "I told them you would come running."</p><p>That night, sitting beside his bed while Mum slept in the chair across the room, I thought about all the things I had been too busy to do. Visit more. Call more. Say the things I always assumed there would be time for later.</p><p>Dad recovered. The doctors said he was lucky. But luck had nothing to do with it — he had spent years walking every morning, eating well, and ignoring my jokes about him becoming a health nut. His discipline saved his life.</p><p>What changed for me was simpler. I stopped postponing the important things. I booked a flight home the next month. I called Dad every Sunday after that. I told my brother I was proud of him, something I had never said out loud.</p><p>The coffee on the kitchen floor? I cleaned it up when I got home, three days later. It had dried into a brown stain that took forever to scrub. I kept thinking about that stain — how something so small can sit there, untouched, while everything around it changes.</p><p>Dad is fine now. He still walks every morning. I still call him every Sunday. And I never let a coffee go cold while something important is waiting.</p>`,
    author: 13,
    views: 187,
    likesCount: 34,
    commentsCount: 8,
  },
  {
    title: "A Lesson I Will Never Forget",
    category: "Education",
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    excerpt: "My biggest mistake taught me more than any classroom ever could.",
    content: `<p>I was twenty-three and thought I knew everything. I had just graduated, landed a junior role at a marketing firm, and was convinced I was on track to run the place within five years.</p><p>My first big project was a campaign for a local bakery. I spent weeks on it — bold concepts, flashy designs, social media strategies. I presented it to the team with the confidence of someone who had never been told no.</p><p>The client hated it. Not disliked — hated. She said it did not feel like her bakery. It felt like something from a textbook. She was right.</p><p>My manager, James, pulled me aside afterward. I expected a lecture. Instead, he asked me one question: "Did you visit the bakery?"</p><p>I had not. I had looked at their website, read their social media, and built the entire campaign from behind my desk. I had never smelled the bread, watched the customers, or spoken to the owner about what made her business special.</p><p>James told me something I carry to this day: "Research tells you what. Experience tells you why. You need both."</p><p>I went to the bakery the next morning. I ate a croissant. I watched the owner greet every customer by name. I saw the hand-painted sign above the counter that said, "Made with love since 1987." I understood.</p><p>The second version of the campaign was completely different. Warm, personal, focused on the people, not the product. The client loved it. It ran for two years.</p><p>That mistake — my arrogance, my assumption that I could understand something without experiencing it — taught me more than four years of university. I learned to listen before I create, to observe before I decide, and to never assume I am the smartest person in the room.</p><p>I keep a photo of that bakery on my desk. Not as a reminder of failure, but as a reminder that the best lessons come from the moments we least expect.</p>`,
    author: 3,
    views: 245,
    likesCount: 52,
    commentsCount: 15,
  },
  {
    title: "The Place I Will Never Forget",
    category: "Travel",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    excerpt: "A tiny village in the mountains of Vietnam changed how I see the world.",
    content: `<p>I had been travelling for three weeks when I arrived in Sapa. By then, I was tired of hostels, tired of instant noodles, and tired of pretending that jet lag did not exist.</p><p>A local woman named Mai offered to be my guide. She spoke limited English and I spoke zero Vietnamese, but somehow we understood each other. She led me up a mountain path that did not appear on any map.</p><p>We walked for hours. The trail wound through rice terraces that cascaded down the hillside like green staircases. The air smelled of earth and wild flowers. There were no other tourists. Just us, the birds, and the occasional water buffalo blocking the path.</p><p>At the top, Mai pointed to a small village below. Her village. She invited me to her home for lunch.</p><p>Her house was a wooden stilt house with a dirt floor and a fire pit in the centre. Her children ran around barefoot, laughing. Her husband brought me tea that tasted like nothing I had ever had before — sweet, earthy, warm.</p><p>She cooked rice with vegetables from her garden. It was the simplest meal I had eaten in weeks and the best. We sat on the floor, ate with our hands, and smiled at each other because words were not necessary.</p><p>After lunch, her daughter showed me her drawings — crayon pictures of mountains, houses, and stick figures holding hands. One drawing had three people: the daughter, her mother, and a tall figure with yellow hair. That was me.</p><p>I left that village with a full stomach and a full heart. I gave Mai what I could — some money, a small gift from my bag. She gave me something bigger: a reminder that hospitality does not require a common language, and that the best moments in travel are the ones you never plan.</p><p>I have been to bigger cities, fancier resorts, and more famous landmarks since then. But none of them made me feel the way that village did. Sapa taught me that the world is full of kindness, if you are willing to wander off the path.</p>`,
    author: 10,
    views: 312,
    likesCount: 67,
    commentsCount: 19,
  },

  // ===== TECHNOLOGY (additional, by David) =====
  {
    title: "My Week Using a Mac After 10 Years on Windows",
    category: "Technology",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    excerpt: "Switching ecosystems is chaos. Here is what surprised me, what annoyed me, and what I would tell someone thinking of switching.",
    content: `After a decade of Windows, I switched to a Mac for a week. Here is the honest breakdown.

## What was surprisingly easy

- **Setup** — everything just worked, almost zero driver hunting.
- **Battery life** — miles ahead of my old laptop.
- **Trackpad gestures** — I kept doing them even after switching back.

## What annoyed me

- **Keyboard shortcuts** — \`Ctrl\` becomes \`Cmd\`, and every muscle memory breaks.
- **Window management** — dragging a window to the edge does not snap it on macOS.
- **The price** — you pay a premium for the hardware.

## The verdict

> The best computer is the one you do the most work on — not the one with the nicest logo.

For **web developers**, macOS and Linux both shine because the command line just works. For general users, either operating system is fine. It comes down to your budget and your workflow.

\`\`\`text
Great for:   developers, creators, battery life
Skip if:     you game, or you love Windows-only tools
\`\`\`

I went back to Windows — but I imported a few Mac habits that genuinely improved my workflow.`,
    author: 2,
    views: 412,
    likesCount: 89,
    commentsCount: 24,
  },
  {
    title: "Smart Home Tech That Actually Made Life Easier",
    category: "Technology",
    coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop",
    excerpt: "Most smart home gadgets are expensive gimmicks. These five genuinely earn their place in my home.",
    content: `I went all-in on smart home tech so you can avoid my mistakes. Here are the **five devices that actually earn their keep**.

## 1. Smart plugs with energy monitoring

Know exactly what your appliances cost. Set the kettle to start before you wake. Five minutes to install, saves money every month.

## 2. Video doorbell

Never miss a delivery. The security peace of mind is worth it alone.

## 3. Smart thermostat

The biggest energy saver on the list — it learns when you are home and turns off heating you do not need.

## 4. Echo and WiFi speakers

"Set a timer for 10 minutes" while your hands are covered in dough. Cheap, simple, surprisingly useful.

## 5. Robot vacuum

It vacuums while you sleep. That is worth more than any other feature on this list.

## The rule that saved me money

> Buy gadgets that remove a task, not ones that add a remote control.

Ask: **"Does this remove a step from my day?"** If the answer is no, skip it.

| Device | Removes | Worth it? |
|--------|---------|-----------|
| Robot vacuum | Manual vacuuming | Yes |
| Smart bulb | Walking to a switch | Meh |
| Smart fridge | Nothing, really | No |

Start small. One plug. One speaker. See what sticks.`,
    author: 2,
    views: 358,
    likesCount: 74,
    commentsCount: 19,
  },

  // ===== AI (additional, by David) =====
  {
    title: "How to Write Prompts That Get Better AI Answers",
    category: "AI",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
    excerpt: "The AI is not 'dumb' — your prompt is vague. A practical guide to prompt engineering for normal people.",
    content: `Most bad AI answers are caused by bad prompts. Here is how to fix that.

## The problem

> "Write something about websites."

This gives you a generic paragraph. Of course it does — you asked for generic.

## The fix: give the AI a job

| Weak prompt | Strong prompt |
|-------------|---------------|
| "Write about websites" | "Write a 300-word beginner guide to what a website is, for a small business owner" |
| "Make it SEO friendly" | "Give me 5 title tags for this article, each under 60 characters" |
| "Check my grammar" | "Fix the grammar but keep my casual tone" |

## The four-part formula

1. **Role** — "You are a friendly web developer..."
2. **Task** — "...explain DNS to a beginner..."
3. **Format** — "...in 5 bullet points with no jargon."
4. **Constraint** — "...under 150 words."

Try it:

\`\`\`text
You are an experienced SEO writer.
Write a 3-paragraph intro for a blog post about local SEO.
Use simple language, no jargon, and end with a question.
\`\`\`

## One more tip

Ask the AI to **improve its own answer**. Add: *"Now rewrite that more concisely."* Iteration beats hoping for perfect first drafts.`,
    author: 4,
    views: 527,
    likesCount: 141,
    commentsCount: 37,
  },
  {
    title: "AI in Education: Help or Hype?",
    category: "AI",
    coverImage: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
    excerpt: "Classrooms are quietly filling up with AI. Does it help students learn, or does it just help them cheat?",
    content: `Walk into any lecture today and half the students are quietly asking an AI for answers. Is that the end of learning — or the start of something better?

## What AI is genuinely good at in education

- **Personalised explanations** — ask it to explain a topic "like I am 12" and it adapts.
- **Practice quizzes** — instant generated questions for revision.
- **Feedback on drafts** — before the teacher even sees them.

## The real danger

AI does not fail students because it is wrong — it fails them because it gives **answers instead of understanding**. Copy a generated essay and you have learned nothing.

## The rule that keeps it honest

> Use AI for the first and last draft — never the thinking in between.

| Phase | Use AI? |
|-------|---------|
| Understanding a concept | Yes |
| Practising by yourself | No |
| Polishing your work | Yes |
| Generating your argument | No |

## The bigger picture

The exams AI can pass today will not matter in ten years. What will matter: **knowing what to ask, how to verify, and how to use tools honestly** — which is exactly what learning with AI, done properly, teaches.`,
    author: 4,
    views: 603,
    likesCount: 156,
    commentsCount: 48,
  },

  // ===== WEB DEVELOPMENT (4, by Admin) =====
  {
    title: "How a Website Works: Domains, Hosting and DNS Explained",
    category: "Web Development",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    excerpt: "You have heard the words a hundred times. Here is how a domain, hosting and DNS actually fit together.",
    content: `The internet feels like magic until you break it into three simple pieces.

## 1. The domain name

\`websq.com.au\` is just an **address** — a human-friendly name we use instead of a long number (IP address).

## 2. DNS — the phone book

When you type a domain, **DNS** looks up the number behind it, like a phone book. Your browser then knows which server to contact.

\`\`\`text
You type:  websq.com.au
DNS finds: 104.21.x.x (the server address)
Browser:   "Hello server, send me the homepage!"
\`\`\`

## 3. Hosting — the building

Hosting is a **computer permanently switched on** that stores your website's files and serves them to anyone who asks.

## How they connect

- **Domain** = your address
- **DNS** = how people find your address
- **Hosting** = the building at that address

## A common beginner mistake

Buying a domain does **not** give you a website. You still need hosting (or a builder like the one WebSQ runs on) to store and serve your pages. Put together, the three parts are the whole story of how any site loads.`,
    author: 5,
    views: 489,
    likesCount: 112,
    commentsCount: 31,
  },
  {
    title: "Build Your First Website in a Weekend: A Step-by-Step Plan",
    category: "Web Development",
    coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop",
    excerpt: "No experience? No problem. A realistic two-day plan to go from nothing to a live website.",
    content: `You do not need a degree to launch a website. Here is a realistic **48-hour plan**.

## Day 1 — Build it (4–5 hours)

1. **Pick a goal** — one page people can actually use (a portfolio, a simple landing page).
2. **Set up a builder** — for beginners, a site builder beats coding from scratch. Write the content first, design second.
3. **Keep it simple** — homepage + about + contact. Three pages is plenty.

## Day 2 — Launch it (3–4 hours)

1. **Buy a domain** — keep it short, ending in .com or a local ending like .com.au.
2. **Connect hosting** — most builders include hosting in the plan. No extra setup needed.
3. **Make it easy to find** — submit your site to Google Search Console, and write a short meta description.

## The checklist

- [x] Clear headline and what you offer
- [x] One photo of the real you
- [x] A way to contact you
- [x] Works on a phone

## Momentum beats perfection

A basic site online today beats a polished plan in a year. Launch small, learn, and improve as you go. That is exactly how every serious website started — **including this one**.`,
    author: 5,
    views: 834,
    likesCount: 197,
    commentsCount: 56,
  },
  {
    title: "Websites vs Web Apps: What Is the Difference?",
    category: "Web Development",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
    excerpt: "A blog and a banking app are both 'sites' — but they are not the same thing at all. Here is how to tell them apart.",
    content: `Is Google Docs a "website"? Is Netflix a "website"? The answer is: sort of, but not really — they are **web apps**.

## The difference in one line

> A website **shows** you content. A web app **does** something with you.

| | Website | Web app |
|---|---------|---------|
| Purpose | Read & browse | Use & interact |
| Examples | Blogs, news, portfolios | Email, banking, dashboards |
| Main job | Display information | Handle your data and actions |

## Why it matters

Businesses ask agencies for "a website" when they really need an app (or vice versa) — and the cost difference is massive. A website can cost hundreds. A web app with logins, payments and a database can cost thousands.

## How to decide what you need

Ask: **"Does the user just read it, or do they do things in it?"**

- Just reading → **website**
- Logging in, saving data, paying — anything interactive → **web app**

## The grey zone

Most modern site builders blur the line. An **online shop** is technically an app (cart, checkout, accounts) but people call it "a website". Both are fair — the important part is scoping the project so you pay for the right thing.`,
    author: 5,
    views: 396,
    likesCount: 88,
    commentsCount: 21,
  },
  {
    title: "Choosing Website Hosting: Shared, VPS or Cloud?",
    category: "Web Development",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    excerpt: "Shared, VPS, dedicated, cloud — the hosting world is full of jargon. A plain-English buyer's guide.",
    content: `Hosting is where your website lives. Here is what the options actually mean.

## Shared hosting

Your site shares one server with many others. Like sharing an apartment.

- **Good for**: small sites, blogs, starting out
- **Pros**: cheap, easy
- **Cons**: slow neighbours can slow you down

## VPS (Virtual Private Server)

A server split into private rooms — each site gets its own space and resources.

- **Good for**: growing sites, online stores
- **Pros**: more control, more reliability
- **Cons**: needs a little technical know-how

## Cloud hosting

Your site runs across many connected servers. If one fails, another takes over instantly.

- **Good for**: anything you want to stay up
- **Pros**: extreme reliability, scales up when you get busy
- **Cons**: can be pricier, pricing can be confusing

## Dedicated

A whole physical server just for you. Expensive, powerful, overkill for most.

> **Rule of thumb:** start shared, move to VPS or cloud the day your site outgrows it. Most sites never need more.

## The metric that matters most

Ignore the marketing. Ask the host: **"How fast do you respond when things break?"** Support quality beats every spec on the page.`,
    author: 5,
    views: 342,
    likesCount: 79,
    commentsCount: 17,
  },

  // ===== SEO (additional, by Admin) =====
  {
    title: "12 Proven Ways to Rank Higher on Google",
    category: "SEO",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    excerpt: "No shortcuts, no black-hat tricks. Twelve everyday actions that move your pages up the rankings.",
    content: `Ranking higher does not require magic. These **twelve actions** move the needle — do them consistently and results follow.

## On your page

1. **Match the search intent** — if people search "how to", your page should teach, not sell.
2. **One page, one topic** — do not cram three topics onto one URL.
3. **Use your keyword early** — in the title, first heading, and first paragraph.
4. **Write longer than the lazy answer** — complete, useful content wins.
5. **Add fresh images** with descriptive filenames (not \`IMG_2021.jpg\`).

## Under the hood

6. **Speed up your site** — compress images; every second counts.
7. **Make it mobile-perfect** — most traffic is on phones.
8. **Fix broken links** — dead pages hurt trust.
9. **Add meta descriptions** — the snippet people click.

## Off the page

10. **Get real backlinks** — guest posts, directories, partnerships.
11. **Build internal links** — link related pages on your own site.
12. **Refresh old posts** — update the best ones yearly; Google rewards recency.

## Track it

Google Search Console tells you which pages are already appearing in results. Find the ones ranked 8–15 and improve them — **the biggest wins are hiding in page two**.`,
    author: 6,
    views: 718,
    likesCount: 176,
    commentsCount: 44,
  },
  {
    title: "What Is Keyword Research and Why It Matters",
    category: "SEO",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    excerpt: "Keyword research is how you find out what people are actually searching — before you write a single word.",
    content: `You could write brilliant content that **nobody searches for**. Keyword research stops that.

## What it is

Finding the exact phrases people type into Google, then building your content around them.

## Why it matters

- Tells you **what to write** (demand, not guesses)
- Tells you **which words to use** in titles and headings
- Tells you **how hard** it will be to rank

## Short vs long tail

| | Head keyword | Long-tail keyword |
|---|-------------|-------------------|
| Example | "laptops" | "best budget laptop for video editing" |
| Searches | Huge | Small |
| Competition | Fierce | Manageable |
| Buyer intent | Browsing | Ready to decide |

**Beginners should start with long-tail.** Winning a small search that converts is worth more than losing a big one.

## Where to research for free

- **Google autocomplete** — type a phrase and see what Google suggests
- **"People also ask"** boxes
- **Google Keyword Planner** — free with an account

## The practical workflow

1. List 10 questions your audience asks
2. Check each in Google Keyword Planner
3. Pick phrases with *some* volume and weaker competition
4. Write one focused page per phrase

That is the whole game. Research first, write second — every time.`,
    author: 6,
    views: 594,
    likesCount: 143,
    commentsCount: 35,
  },
  {
    title: "Local SEO: How Small Businesses Win Nearby Customers",
    category: "SEO",
    coverImage: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&h=600&fit=crop",
    excerpt: "For cafes, tradies and clinics, ranking 'near me' matters more than anything else on the internet.",
    content: `If you run a local business, you do not need to rank nationally — you need to show up when someone nearby searches. That is **local SEO**.

## The single most important step

**Claim and fill out your Google Business Profile.** It is free and it is where local results and maps listings come from.

## Make it complete

- Correct name, address, phone number
- Business category
- Real photos of your premises
- Opening hours (update them when they change)

## Get reviews — genuinely

Reviews are the strongest local signal. Ask happy customers directly. Reply to every review, good or bad — it signals you care.

## Consistent business info everywhere

Your name, address and phone must match on your website, Google, Facebook and directories. Even tiny mismatches confuse Google.

## Local content

Write one page on your site per location, and answer local questions:

> "What are the best [service] options in [suburb]?"

## The simple checklist

- [ ] Google Business Profile claimed
- [ ] 10+ genuine reviews
- [ ] NAP consistent everywhere
- [ ] Location page on your website

Local SEO is less competitive than global SEO. Do the basics well and you will quietly outrank bigger brands in your area.`,
    author: 6,
    views: 467,
    likesCount: 118,
    commentsCount: 29,
  },

  // ===== DIGITAL MARKETING (additional, by Admin) =====
  {
    title: "Email Marketing 101: Build a List That Sells",
    category: "Digital Marketing",
    coverImage: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&h=600&fit=crop",
    excerpt: "Email remains the highest-returning channel in digital marketing. Here is how to grow a list people actually open.",
    content: `Social feeds change every day. Your **email list** is the one asset nobody can take from you. Yet most businesses neglect it.

## Why email beats everything

- **Ownership** — you control the list, not an algorithm
- **Cost** — pennies compared to ads
- **Engagement** — people check email more than any app

## Grow the list ethically

Don't bribe, don't spam, don't buy lists.

1. **Offer something useful** — a checklist, a mini-guide, a discount. A real reason to subscribe.
2. **Put the form somewhere visible** — header, footer, end of every blog post.
3. **Never buy lists** — purchased addresses tank your deliverability and trust.

## Write emails people open

- **Subject line under 50 characters** with a benefit, not a pun
- One idea per email
- A clear next step ("Reply yes", "Read the guide", "Claim the code")

## The cadence that works

| Type | Frequency |
|------|-----------|
| Helpful content | Weekly |
| Promotions | 1–2 a month max |
| Personal stories | Occasionally |

## The metric that matters

Forget open rates. Watch **replies and clicks** — they show people actually care. Two thousand engaged subscribers will beat twenty thousand cold ones every time.`,
    author: 7,
    views: 543,
    likesCount: 129,
    commentsCount: 31,
  },
  {
    title: "Social Media Marketing: Which Platform Should You Pick?",
    category: "Digital Marketing",
    coverImage: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=600&fit=crop",
    excerpt: "You cannot be everywhere. A practical guide to choosing the one platform your business should actually use.",
    content: `The biggest mistake in social media marketing is trying to be everywhere at once. Here is how to pick **your** platform.

## Match the platform to the audience

| Platform | Best audience | Best for |
|----------|--------------|----------|
| Facebook | 30+, local communities | Local business, events, groups |
| Instagram | 18–35, visual | Products, lifestyle, creators |
| TikTok | teens–30s | Short entertainment, discovery |
| LinkedIn | Professionals | B2B, services, thought leadership |
| Pinterest | Planners, home & DIY | Recipes, decor, tutorials |

## Match the platform to your content

- Can you make **great video**? TikTok and Reels reward it.
- Do you sell something **visual**? Instagram and Pinterest.
- Are you selling to **businesses**? LinkedIn, and nowhere else.

## The one-platform rule

> Post consistently on **one** platform for 90 days before adding a second.

Three platforms you ignore always look worse than one you nail.

## What posting actually means

- Original content 70–80% of the time
- Curated stuff and personal posts the rest
- Reply to every comment — engagement feeds algorithms

## Tool to stop wasting time

Schedule a week of posts in an hour with a scheduler (Buffer, Later, or Meta's own tools). Consistency beats viral luck.`,
    author: 7,
    views: 488,
    likesCount: 121,
    commentsCount: 27,
  },
  {
    title: "Content Marketing: Why Every Business Needs a Blog",
    category: "Digital Marketing",
    coverImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop",
    excerpt: "Content marketing is how you get found, trusted and chosen — without paying for clicks forever.",
    content: `"Why should my business blog? Nobody reads blogs anymore." People say this while Googling every question of their day. Search is content marketing.

## What content marketing is

Creating useful articles, guides and videos **people actually search for**, so you get found by future customers for free.

## Why it beats paid ads

- **Ads stop** the moment the budget stops
- **Content keeps working** — an article from 2022 can still bring customers today
- Trust compounds — answering questions builds authority

## A realistic content plan

| Week | Task |
|------|------|
| 1 | Answer your top customer question in an article |
| 2 | Turn it into a short video |
| 3 | Send both to your email list |
| 4 | Review which questions to answer next |

## Pick questions, not topics

Search questions people actually ask:

> "How much does it cost to..." — "How to choose..." — "Why is my... "

Answer them honestly and you win the search result.

## Repurpose everything

One article → one email → three social posts → one newsletter. Never create content once. This is exactly how WebSQ works: **write once, publish everywhere, keep earning readers**.`,
    author: 7,
    views: 521,
    likesCount: 134,
    commentsCount: 34,
  },

  // ===== EDUCATION (additional, by Emily) =====
  {
    title: "Learning Online as an Adult: What Actually Sticks",
    category: "Education",
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    excerpt: "I have started a hundred online courses and finished four. Here is why the four finished — and the rest did not.",
    content: `Online learning is free and unlimited and yet most of us finish almost nothing. After years of trial and error, here is what actually works.

## Why courses fail

- No deadline = no urgency
- Watching feels like doing
- Too much theory, too little practice

## What actually stuck for me

**One topic at a time.** Not "learn marketing" — "learn how to write a product page". Narrow goals have a finish line.

**Build while you watch.** Every tutorial included a mini project. Knowing I had something to show pushed me to finish.

**Teaching to someone else.** Explaining what I learned to a friend (or writing an article) locked it in better than re-watching anything.

## The method

1. Pick one small skill
2. Find one focused resource
3. Do the practice, not just the theory
4. Use it within a week on something real

## A warning about the course graveyard

Courses you buy but never open are expensive furniture. Before buying, ask: **"Can I learn this with 10 free YouTube videos plus practice?"** Usually, the answer is yes.`,
    author: 3,
    views: 404,
    likesCount: 96,
    commentsCount: 23,
  },

  // ===== LIFE (additional, by Sarah) =====
  {
    title: "What a Year of Morning Walks Taught Me",
    category: "Life",
    coverImage: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&h=600&fit=crop",
    excerpt: "No app, no plan, no goal — just thirty minutes outside before the day begins. Here is what changed.",
    content: `A year ago I started walking every morning. Not to lose weight or hit a step goal — just to see the sunrise before my phone reminded me the day had started.

## The first month was hard

My bed was warm and my schedule was not built for it. I told myself: just get to the corner and back. That was the trick — **lower the bar so low you cannot miss it**.

## What the year gave me

- **Quieter mornings** — my best ideas arrive while walking, not while scrolling.
- **Better mood** — starting the day outside set a calmer tone than starting it at a screen.
- **A feeling of belonging** — I started recognising the same faces; the street became a small community.

## The habit pattern that worked

1. Clothes ready the night before
2. Phone stays inside (no notifications)
3. Same time every day — routine beats motivation

## The honest truth

I have not changed my life dramatically. But day by day, something has shifted. The morning is mine before the world gets loud — and that small ownership matters more than I expected.

Take the walk. Even if it is just to the corner.`,
    author: 1,
    views: 731,
    likesCount: 164,
    commentsCount: 41,
  },
  {
    title: "The Art of Doing Nothing",
    category: "Life",
    coverImage: "https://images.unsplash.com/photo-1443884590026-2e4d21aee71c?w=800&h=600&fit=crop",
    excerpt: "We treat idle time as wasted time. But doing nothing, on purpose, might be the most productive habit there is.",
    content: `Sitting quietly with no phone, no show, no plan sounds like wasted time. We have been taught that every minute must produce something.

## What we lost

Our grandparents had gaps between tasks. Waiting rooms, long commutes, quiet afternoons — spaces where the brain wandered. Those gaps are gone, filled by scroll breaks and stream queues.

## What the neuroscience says

**Default mode network**: when you do nothing, your brain gets busy in its own background — sorting memories, connecting ideas, solving problems you stopped consciously thinking about.

The "shower thought" is not a fluke. It is your brain finally getting room to work.

## Try a 15-minute reset

- Put the phone in another room
- Sit somewhere comfortable
- Do nothing. No music. No podcast.

It will feel uncomfortable. That is the point — you are unclamping your brain.

> Rest is not the opposite of work. Rest is the other half of it.

## The best ideas arrive in the gaps

Most of my writing ideas come on walks or quiet afternoons — never while I am hunched over a screen forcing creativity. Plan less. Wander more. Let the gaps back in.`,
    author: 1,
    views: 866,
    likesCount: 201,
    commentsCount: 52,
  },

  // ===== FAMILY (additional, by Emily) =====
  {
    title: "The Night We Played Board Games Instead of Scrolling",
    category: "Family",
    coverImage: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=600&fit=crop",
    excerpt: "One power outage accidentally gave us back family time. We are keeping it.",
    content: `The lights flickered and died at 7pm. No internet, no streaming, nothing to do — so we dug out the dusty board games box.

## The awkward start

Nobody wanted to. We sat with blank faces, phones in hand, realising how strange we looked without a screen. Then my son asked if I remembered how to play Monopoly. I did not fully. We read the rules together. Something about fumbling through it broke the ice.

## What the evening gave us

- Four hours of actual conversation
- Me learning more about my kids' humour in one night than a month of dinners
- Nobody checking notifications

## The shift we made

We now have a **"screen-to-table" rule**: Sundays, phones go in a basket by the door, and we play or talk instead.

## Why it matters

Connection is not about being in the same room. It is about being in the same moment. A board game forces the moment to happen — someone has to look you in the eye while taking their turn.

One evening of cards does not fix everything. But it is a start, and a start is what family time has been missing.`,
    author: 8,
    views: 612,
    likesCount: 148,
    commentsCount: 37,
  },
  {
    title: "What My Kids Taught Me About Technology",
    category: "Family",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
    excerpt: "I set out to teach my children about screens. They ended up teaching me.",
    content: `I assumed my children needed to be protected from technology — that I, as the adult, understood it better. A few years in, I am not so sure.

## What I learned from watching them

**Curiosity before fear.** A seven-year-old with a new app does not fear it; they poke, tap and discover. Somewhere along the way, adults swapped that curiosity for caution.

**They ask better questions.** "Why does the game know I am tired?" — I had never once thought to question where apps get their assumptions.

## The healthy boundaries we found together

- Screens off in bedrooms at night — for **all** of us, parents included
- Tech time is not a reward or punishment; it is a normal part of the day
- We talk about what they saw online like we talk about school

## The honest takeaway

Our kids will live in a world of AI, deepfakes and tools we cannot imagine. Panicking about it helps nobody. **Teaching them to ask "How does this work?" and "Who made this?"** — that survives any upgrade.

The best tech mentorship is a conversation, not a ban.`,
    author: 8,
    views: 558,
    likesCount: 122,
    commentsCount: 31,
  },

  // ===== CAREER (additional, by David) =====
  {
    title: "Freelancing Full-Time: My First Year in Numbers",
    category: "Career",
    coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop",
    excerpt: "I kept spreadsheets for my first year of freelancing. The numbers are honest — including the ugly ones.",
    content: `Everyone talks about freedom; nobody mentions the invoice chasing. Here is my first year of freelancing — the numbers.

## The good numbers

- **Income**: mostly grown by month 6
- **Hourly rate**: rose every quarter once I stopped undercharging
- **Repeat clients**: 60% of income came from people who hired me again

## The ugly numbers

- **Non-billable time**: almost 20% — admin, proposals, "quick calls"
- **Late payments**: 3 clients who took over 45 days
- **Zero-earning days**: at least 3 a month, and they hurt

## The three rules I wish I started with

1. **Save 25% of every invoice** — taxes and slow months are coming.
2. **Charge for the outcome, not the hour** — a 3-hour task does not price 3 hours; it prices the years it took to do it fast.
3. **Never work without a deposit** — 50% up front ends most payment problems.

\`\`\`text
Month 1-3:  build a client base, low rates, accept it
Month 4-6:  raise rates, pick a niche
Month 7-12: drop low-paid work, double down on repeat clients
\`\`\`

## Would I do it again?

Yes — but with a year of savings in the bank first. Freedom feels better when your bills do not depend on this week's invoice.`,
    author: 9,
    views: 689,
    likesCount: 158,
    commentsCount: 39,
  },
  {
    title: "Skills That Will Matter Most in the Next 10 Years",
    category: "Career",
    coverImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop",
    excerpt: "AI is coming for routine work. These are the human skills that become more valuable — not less — as technology advances.",
    content: `Every career list talks about learning to code. Everyone is learning to code. Here is the truth nobody is selling: **AI makes some hard skills easy, and easy skills hard to stay relevant.**

## The skills that appreciate

**Asking better questions.** When answers are free, the value moves to framing the question. People who can define the problem win.

**Judgement.** AI produces plausible answers, not verified ones. Knowing what is good, what is wrong and what matters is a rare, rising skill.

**Communication.** Whoever explains complexity simply gets promoted — AI writes drafts, but humans still decide who to trust.

**Resilience.** Tools change every year. The ability to re-learn without drama is now a core professional skill.

## The skills that depreciate

- Routine data entry
- Drafting standard documents
- Basic translations / formatting

## The advice that actually pays

> Give yourself one month a year to deliberately learn something new.

If "learning to learn" feels too soft, formalise it: one certificate, one project, one new tool — annually. Technology will keep moving. Meeting it is now part of the job description.`,
    author: 9,
    views: 823,
    likesCount: 189,
    commentsCount: 47,
  },

  // ===== TRAVEL (additional, by Sarah) =====
  {
    title: "Working Remotely Abroad: A Digital Nomad Guide",
    category: "Travel",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    excerpt: "Good coffee, wiFi speed over waterfall views, and everything you pack fits in a carry-on. What I learned in a year of remote work travel.",
    content: `I worked from five countries last year. Here is the practical guide I wish someone had given me first.

## Priorities in order

1. **Internet** — verify real speed, not hotel marketing
2. **Time zone overlap** with colleagues/clients
3. **Cost of living** — "cheap and stable" beats "Instagram-famous"
4. Scenery comes fourth, honestly

## The packing rule

Everything fits in a carry-on. If it does not, carry less. Laundry exists everywhere.

\`\`\`text
Non-negotiable kit:
- Backup drive (cloud AND physical)
- Power bank + universal adapter
- Noise-cancelling headphones
- Offline copies of key documents
\`\`\`

## Money and admin

- Notify your bank before departure (twice)
- Copy your passport + visa pages to the cloud
- Keep digital receipts in one folder — tax season will thank you

## The truth about 'location independence'

You are more productive, not less — but you also need boundaries. Done properly, a working day in a new city ends with real adventure. Done poorly, it is just a hotel room in a warmer time zone.

Work first, explore after 5pm. That is the whole secret.`,
    author: 10,
    views: 745,
    likesCount: 179,
    commentsCount: 43,
  },

  // ===== HEALTH (additional, by Emily) =====
  {
    title: "Why Your Posture Matters More Than You Think",
    category: "Health",
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    excerpt: "Chest pain, headaches, 'random' fatigue — sometimes the cause is not your health. It is how you sit.",
    content: `I spent a year blaming my neck pain on stress. It turned out to be something far more boring: **my posture**.

## The chain reaction

Slouch in a chair for years and the body quietly adjusts:

- Shoulders round forward
- Head stretches to reach the screen
- Breathing becomes shallow
- Neck and back muscles work overtime

The result masquerades as exhaustion, headaches and poor focus.

## The 3 fixes that helped me

1. **Screen at eye level** — books or a stand; stop looking down at a laptop
2. **Sit with a gap** between the chair back and your lower back, then fill it with a small cushion
3. **Movement breaks** — 2 minutes of stretching for every 30 minutes of sitting

## The desk check

\`\`\`text
Elbows at 90°
Feet flat on the floor
Screen top at eye height
Keyboard close enough to relax your shoulders
\`\`\`

## Why it sneaks up on you

Bad posture feels comfortable — for a while. That is exactly why it is so common. What is comfortable today is often what hurts tomorrow.

Fix your setup once, and the rest of the day — and your neck — quietly thanks you.`,
    author: 11,
    views: 478,
    likesCount: 117,
    commentsCount: 26,
  },
  {
    title: "Building a Sleep Routine That Actually Works",
    category: "Health",
    coverImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop",
    excerpt: "I tried every sleep hack and most were marketing. These are the handful that are backed by science and survived real life.",
    content: `A good night's sleep is the lever behind everything else — and the most steamed-over advice on the internet. Here is what actually held up.

## What the research says (not the influencers)

- **Same wake time beats same sleep time.** Even if you sleep late, waking at a consistent hour anchors your rhythm.
- **Light is the main controller.** Morning sunlight tells your brain the day started; screens at midnight tell it the opposite.
- **Cooler rooms help.** Around 18 °C is the commonly cited sweet spot.

## The routine I keep

1. Same wake time, including weekends
2. Morning light within an hour of waking
3. Last coffee before 2pm
4. Screens off 30 minutes before bed
5. Bedroom only for sleeping (and one occasional book)

## The one hack that changed everything

**The 20-minute rule.** If you are awake in bed for 20 minutes, get up and do something boring until you feel tired. Lying there staring at the ceiling teaches your brain that bed = frustrating. Breaking that association fixed my sleep better than any app.

> Routine is boring, which is exactly why it works.

Skip the expensive sleep gadgets. Start with light, consistency and a cooler room — and let sleep find you.`,
    author: 11,
    views: 507,
    likesCount: 126,
    commentsCount: 32,
  },

  // ===== INSPIRATION (additional, by Sarah) =====
  {
    title: "Consistency Beats Motivation: A Practical System",
    category: "Inspiration",
    coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop",
    excerpt: "Motivation shows up when it feels like it. Systems work no matter what. Here is how to build one that survives bad days.",
    content: `Everyone is motivated on a good day. The difference between people who finish things and people who collect starts is what happens on the bad ones.

## Why motivation lies to you

Motivation is an emotion, not a fuel. It spikes after a podcast and vanishes by Tuesday. If your plan depends on it, your plan is fragile.

## Shrinking to the smallest step

Make the task so small you cannot reasonably skip it:

- "Write for one hour" → "Write one sentence"
- "Work out" → "Put on your shoes"
- "Edit the video" → "Open the editor"

Start tiny. The momentum usually carries you further — and on the worst days, tiny is still a win.

## Tracks, not streaks

Count the streak, but forgive breaks. Missing one day is a pause, not a reset. The people who succeed are the ones who simply **resume**.

## A tool that worked for me

\`\`\`text
The 2-minute rule:
If it takes under 2 minutes, do it now.
If it takes longer, do the first 2 minutes now anyway.
\`\`\`

## The honest bottom line

You will not feel like it most days. Do it slightly, badly, incompletely — then come back tomorrow. That is the system. It is unglamorous, and it is unstoppable.`,
    author: 12,
    views: 892,
    likesCount: 224,
    commentsCount: 58,
  },
  {
    title: "Why 'Good Enough' Beats 'Perfect'",
    category: "Inspiration",
    coverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&h=600&fit=crop",
    excerpt: "Perfectionism looks like high standards and feels like fear. Here is how shipping 'good enough' changed my work.",
    content: `For years I would not publish anything until it was perfect. The result: I published almost nothing.

## The trap

Perfectionism is not a love of quality. It is **fear dressed up as standards** — usually fear of being judged. Meanwhile, "not ready" quietly becomes "never done".

## What shipping taught me

I started publishing deliberately imperfect work — a blog draft, a portfolio page, a video with a small mistake left in. Nobody pointed a finger. People engaged, corrected, suggested. I learned more from their feedback in two weeks than from a year of polishing in private.

## The rule I use now

> Perfect is the enemy of published.

Ask instead: **"Is this good enough to help one person?"** If yes — put it out there.

## A simple audit

If a task is not improving your day's outcome by at least 10%, it is polishing.

## The freeing truth

Your first version will not be your best — and that is fine. Every strong piece of work I have seen was version three of version one. You only reach version three by shipping version one.

Ship it. Improve it. Repeat.`,
    author: 12,
    views: 764,
    likesCount: 187,
    commentsCount: 44,
  },

  // ===== PERSONAL (additional, by Sarah) =====
  {
    title: "Starting Over in a New City at 30",
    category: "Personal",
    coverImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
    excerpt: "No friends, no plan, no safety net. What I learned when I moved to a city where nobody knew my name.",
    content: `At 30 I moved to a city where I knew exactly zero people. It was not an easy decision; it was a reset I could not afford to skip.

## The first month was brutal

Loneliness was a physical thing, a weight in my chest. I ate the same takeaway three times a week because cooking for nobody felt pointless. I learned that "it takes time" is not comfort — it is just a fact you have to survive.

## What started to work

I put one word in front of every headline: **just**.

- Just go to the coffee shop. Just sit at the counter.
- Just say yes to the group run even though I am slow.
- Just message the acquaintance of an acquaintance.

Small actions, repeated, quietly built a life.

## The surprising gift

When nobody knows your history, you get to choose who you are now. Old labels — the shy one, the one who always... — vanished. I was just me, meeting people freshly.

## If you are considering the leap

Do it with savings. Lower the cost of the first six months, because that is when it hurts. And remember: every person in that city was new once.

The first six months are the price. The years after are the reward.`,
    author: 13,
    views: 680,
    likesCount: 151,
    commentsCount: 38,
  },
  {
    title: "The Journal Entry That Made Me Change Careers",
    category: "Personal",
    coverImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=600&fit=crop",
    excerpt: "One honest page answering 'What am I doing this for?' ended a decade-long career. Here is what that looked like.",
    content: `I did not leave my career because of a dramatic event. I left because of a boring, honest journal entry.

## The exercise

On a quiet Sunday, I answered three questions in writing:

1. What did I do this week that actually mattered to me?
2. What would I do if I were not afraid of the cost?
3. What am I saving my life for?

When I read the answers back, the gap between my life and my answers was too wide to ignore.

## The pattern in my pages

I kept writing the same five things I wanted: better work, more time with family, work that uses my head. My actual calendar showed the opposite priorities. That mismatch — not any single event — is what slowly ended things.

## What the change cost

A pay cut. Twelve months of evenings spent building something new. Long conversations with people who thought I was reckless. Worth it? Yes — because I finally aligned the calendar with the journal.

## Try the exercise

Write the three questions tonight. Not to quit tomorrow — to see honestly what your life is pointing at. Sometimes a small change is all the truth requires.

> Your journal does not decide. It reveals. Then you decide.`,
    author: 13,
    views: 745,
    likesCount: 171,
    commentsCount: 45,
  },
  {
    title: "What I Learned From a Year Without Social Media",
    category: "Personal",
    coverImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop",
    excerpt: "A year away from feeds changed my attention, my mood and my relationships more than any book or course ever has.",
    content: `I deleted my social apps for a year. No grand philosophy — I just noticed that my attention was being rented out, and I wanted it back.

## The first weeks

The withdrawal was real. I reached for my phone constantly, then sat holding it like a forgotten prop. I realised how often I used scrolling to avoid other things — boredom, difficulty, silence.

## What changed by month three

- **Attention** — I could read a book for an hour again. That felt like a superpower.
- **Comparison** — my mood stopped being daily news about strangers' highlight reels.
- **Conversations** — I asked people real questions instead of already knowing the answer from their last post.

## The honest downsides

I missed some updates from distant friends and events. FOMO was real the first month. It faded.

## What survived the year

I came back, but changed:

- No apps on the home screen
- No posting just to post
- Time-boxed, once in the evening

## The takeaway

The apps are not evil; the dynamic is. Attention is the only currency we never get back. A year offline taught me to spend mine on purpose — and that lesson has quietly changed everything else.`,
    author: 13,
    views: 987,
    likesCount: 213,
    commentsCount: 61,
  },
];

export async function GET() {
  return seedDatabase();
}

export async function POST() {
  return seedDatabase();
}

async function seedDatabase() {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash("hashedpassword123", 12);

    const createdAuthors = [];
    for (const author of authors) {
      let user = await User.findOne({ email: author.email });
      if (!user) {
        user = await User.create({
          name: author.name,
          email: author.email,
          password: hashedPassword,
          bio: author.bio,
          image: author.image || "",
          role: author.role || "user",
        });
      } else {
        const updates: Record<string, unknown> = {};
        if (author.image && !user.image) updates.image = author.image;
        if (author.bio && user.bio !== author.bio) updates.bio = author.bio;
        if (Object.keys(updates).length > 0) {
          updates.updatedAt = new Date();
          await User.updateOne({ _id: user._id }, { $set: updates });
        }
      }
      createdAuthors.push(user);
    }

    let created = 0;
    let skipped = 0;
    let updated = 0;

    const categories = STORY_CATEGORIES;
    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat });
      if (!exists) {
        await Category.create({
          name: cat,
          description: categoryDescriptions[cat] || `Stories about ${cat.toLowerCase()}`,
        });
      }
    }

    for (const story of stories) {
      const existing = await Story.findOne({ title: story.title });
      if (existing) {
        await Story.updateOne(
          { _id: existing._id },
          {
            author: createdAuthors[story.author]._id,
            status: "published",
            adminStatus: "approved",
          }
        );
        skipped++;
        updated++;
        continue;
      }

      const now = new Date();
      const doc = await Story.create({
        title: story.title,
        content: story.content,
        excerpt: story.excerpt,
        category: story.category,
        coverImage: story.coverImage,
        author: createdAuthors[story.author]._id,
        status: "published",
        adminStatus: "approved",
        views: story.views,
        likesCount: story.likesCount,
        commentsCount: story.commentsCount,
        publishedAt: now,
        approvedAt: now,
      });

      const cleanSlug = story.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      await Story.updateOne({ _id: doc._id }, { slug: cleanSlug });

      created++;
    }

    return NextResponse.json({
      message: `Seeded ${created} stories (${updated} updated, ${skipped} matched existing)`,
      authors: createdAuthors.map((a) => a.name),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
