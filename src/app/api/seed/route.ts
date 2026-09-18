import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Story from "@/models/Story";

const authors = [
  { name: "Sarah Johnson", email: "sarah@websq.com.au", bio: "Travel writer and adventure seeker." },
  { name: "David Wilson", email: "david@websq.com.au", bio: "Tech enthusiast and lifelong learner." },
  { name: "Emily Brown", email: "emily@websq.com.au", bio: "Education advocate and storyteller." },
];

const stories = [
  // ===== LIFE =====
  {
    title: "The Day I Learned to Let Go",
    category: "Life",
    coverImage: "/categories/life.jpg",
    excerpt: "Sometimes the hardest thing to do is nothing at all. Here is how I learned that letting go is not giving up.",
    content: `<p>For years, I held onto everything — grudges, fears, expectations, and plans that no longer served me. I thought letting go meant losing control.</p><p>It was during a quiet evening walk along the beach that it finally clicked. The waves kept coming, pulling sand back and pushing it forward, endlessly. Nothing was permanent. The shoreline I stood on today would be different tomorrow.</p><p>I started small. I let go of a friendship that had become toxic. I stopped replaying arguments in my head. I forgave myself for mistakes I made years ago.</p><p>Each release felt like putting down a heavy bag I had been carrying for so long I forgot it was there. The weight lifted. My shoulders dropped. I could breathe.</p><p>Letting go is not about pretending things did not happen. It is about choosing peace over pain, growth over stagnation, and the future over the past.</p><p>Today, I still catch myself holding on. But now I recognize the weight, and I know how to set it down.</p>`,
    author: 0,
    views: 342,
    likesCount: 45,
    commentsCount: 12,
  },
  {
    title: "Why Mornings Changed Everything",
    category: "Life",
    coverImage: "/categories/life.jpg",
    excerpt: "I used to hate mornings. Now they are the most productive and peaceful part of my day.",
    content: `<p>I was never a morning person. My alarm was my enemy, and I would hit snooze until the last possible second. Mornings were chaos.</p><p>Then I read about a CEO who woke up at 4:30 AM every day. Not to work, but to have time for himself. That idea stuck with me.</p><p>I started waking up just 30 minutes earlier. No phone. No emails. Just coffee, journaling, and silence. The first week was brutal. By the third week, something shifted.</p><p>I felt calmer. More focused. I stopped rushing through breakfast. I actually enjoyed the sunrise.</p><p>Now my morning routine is sacred. I meditate for 10 minutes, write in my journal, and plan my day. It is only an hour, but it changed how I experience everything else.</p><p>You do not need to wake up at 4 AM. Just give yourself 30 minutes of quiet before the world starts demanding things from you.</p>`,
    author: 1,
    views: 287,
    likesCount: 38,
    commentsCount: 9,
  },
  {
    title: "Learning to Say No",
    category: "Life",
    coverImage: "/categories/life.jpg",
    excerpt: "Saying yes to everything left me exhausted and resentful. Here is how two simple words changed my life.",
    content: `<p>For most of my adult life, I was a people-pleaser. If someone asked me for help, I said yes. If I was invited somewhere, I said yes. If there was extra work at the office, I said yes.</p><p>I thought I was being helpful and reliable. In reality, I was burning out.</p><p>The turning point came when I realized I had said yes to so many things that I had no time for myself. My weekends were booked. My evenings were packed. I was tired all the time.</p><p>A friend told me something I will never forget: "Every time you say yes to something, you are saying no to something else." That hit hard.</p><p>I started practicing. "No, I cannot take on another project right now." "No, I cannot make it this weekend." "No, thank you."</p><p>At first, people were surprised. Some were even upset. But over time, the people who mattered understood. And I had more energy, more time, and more joy for the things that truly mattered.</p>`,
    author: 2,
    views: 456,
    likesCount: 67,
    commentsCount: 21,
  },
  {
    title: "Finding Joy in Small Things",
    category: "Life",
    coverImage: "/categories/life.jpg",
    excerpt: "The secret to happiness was not in big achievements, but in tiny everyday moments I had been ignoring.",
    content: `<p>I spent years chasing big milestones — the promotion, the house, the vacation. Each time I reached one, the excitement faded quickly, and I was already chasing the next thing.</p><p>Then one Tuesday, I noticed something. I was sitting on my balcony, drinking tea, watching a cat stretch in the sunlight on the roof across the street. And I felt genuinely happy.</p><p>Not because anything special was happening. Just because the tea was warm, the sun was out, and the moment was perfect as it was.</p><p>That was when I realized I had been looking for happiness in all the wrong places. It was not in the achievements. It was in the spaces between them.</p><p>Now I notice the good stuff. The smell of fresh bread. A stranger holding the door. The sound of rain on the roof. A good laugh with a friend.</p><p>Big goals are still important. But they are no longer the source of my happiness. The small things are.</p>`,
    author: 0,
    views: 523,
    likesCount: 89,
    commentsCount: 34,
  },

  // ===== FAMILY =====
  {
    title: "A Letter to My Daughter",
    category: "Family",
    coverImage: "/categories/family.jpg",
    excerpt: "Things I want my daughter to know as she grows up in a world full of noise and pressure.",
    content: `<p>My dearest girl,</p><p>You are only five years old, and already you have taught me more about love than I ever thought possible. I want to write this letter now, before the world gets loud and you start believing you need to be anything other than yourself.</p><p>You do not need to be perfect. You do not need everyone to like you. You do not need to have all the answers. You just need to be kind — to others and to yourself.</p><p>There will be days when things feel hard. When friends let you down. When you fail at something you worked hard for. On those days, I want you to remember this: you are allowed to feel sad, but you are not allowed to give up on yourself.</p><p>Be curious. Ask questions. Make mistakes. Laugh loudly. Dance in the kitchen. Read books under the covers with a flashlight.</p><p>And always, always know that no matter what happens, you have a home in my heart that nothing can ever take away.</p><p>Love, Mum</p>`,
    author: 2,
    views: 891,
    likesCount: 156,
    commentsCount: 43,
  },
  {
    title: "Cooking With Grandma: Recipes and Memories",
    category: "Family",
    coverImage: "/categories/family.jpg",
    excerpt: "The kitchen was Grandma's classroom, and every recipe was a lesson in love.",
    content: `<p>Every Sunday morning, the smell of cardamom and cinnamon would drift through the house. That meant Grandma was in the kitchen.</p><p>She never used measuring cups. A pinch of this, a handful of that. "Cooking is about feeling, not numbers," she would say, waving her wooden spoon like a conductor's baton.</p><p>Her hands told stories. The scar on her left thumb from a knife slip in 1978. The flour permanently dusted into the lines of her palms. Every wrinkle was a chapter of a life well-lived.</p><p>I learned more in that kitchen than any classroom. I learned patience — waiting for the dough to rise. I learned generosity — she always made enough for neighbors. I learned that food is love made visible.</p><p>Grandma passed away two years ago. But every time I step into my kitchen and cook her recipes, she is right there with me. In the smell of cardamom. In the warmth of the oven. In the love I put on the table for my own family.</p>`,
    author: 0,
    views: 678,
    likesCount: 112,
    commentsCount: 28,
  },
  {
    title: "The Tradition We Almost Lost",
    category: "Family",
    coverImage: "/categories/family.jpg",
    excerpt: "How reviving an old family tradition brought us closer together after years of drifting apart.",
    content: `<p>For decades, our family had a tradition: every New Year's Eve, we would gather at Grandma's house, share a meal, and each person would write a wish for the year ahead on a piece of paper. We would put them in a jar and read them the following year.</p><p>When Grandma passed, the tradition stopped. No one suggested continuing it. The jar sat empty on a shelf, gathering dust.</p><p>Three years ago, I found the jar while cleaning the attic. Inside were yellowed papers with wishes from years past. "I wish for a healthy baby." "I wish for Dad to retire happy." "I wish for our family to stay close."</p><p>Tears streamed down my face. I called my siblings that night. "We are bringing back the jar," I said.</p><p>That New Year's Eve, we gathered — 14 of us — in my parents' living room. We shared a meal, laughed until our sides hurt, and each wrote a wish. The jar is no longer empty.</p><p>Sometimes the traditions we need most are the ones we already have. We just need someone to remind us.</p>`,
    author: 1,
    views: 445,
    likesCount: 78,
    commentsCount: 19,
  },
  {
    title: "What My Father Never Said",
    category: "Family",
    coverImage: "/categories/family.jpg",
    excerpt: "He never said I love you. But his actions spoke louder than any words ever could.",
    content: `<p>Dad was not the type to say "I love you." In our family, feelings were expressed through actions, not words.</p><p>He would wake up at 5 AM to warm up the car before my school run in winter. He would stay up late fixing my bicycle chain without being asked. He drove six hours each way to watch me play a 20-minute football match in college.</p><p>I used to wish he would just say it. Just once. But he never did.</p><p>It was only after I moved out and started my own family that I understood. Dad was not cold. He was showing love the only way he knew how — through presence, through sacrifice, through quiet, unwavering support.</p><p>Last Christmas, while helping him fix a shelf, he turned to me and said, almost offhandedly, "I am proud of you, son." Two words. No "I love you." No hug. Just that.</p><p>It was enough. It was everything.</p><p>Dad, if you ever read this — I know. I always knew. And I love you too.</p>`,
    author: 2,
    views: 734,
    likesCount: 134,
    commentsCount: 37,
  },

  // ===== CAREER =====
  {
    title: "Why I Quit My Dream Job",
    category: "Career",
    coverImage: "/categories/career.jpg",
    excerpt: "Everyone thought I was crazy for leaving a six-figure salary. Here is why it was the best decision I ever made.",
    content: `<p>I had the job everyone wanted. Corner office, great team, impressive title on LinkedIn. From the outside, it looked like I had made it.</p><p>But every Sunday night, I felt a knot in my stomach. The work was fine. The pay was excellent. But I was not excited. I was not learning. I was going through the motions.</p><p>The breaking point was a Tuesday morning. I was sitting in a meeting that could have been an email, thinking about a side project I had been working on for months — an app that helped local farmers sell produce directly to restaurants. That project lit me up. The meeting did not.</p><p>I handed in my resignation that Friday. My boss thought I was having a breakdown. My parents thought I had lost my mind. My friends were confused.</p><p>That was 18 months ago. Today, my app is live in three cities. I earn less than half of what I used to. But I wake up excited. I work on something I believe in. I am building something of my own.</p><p>The dream job was never really my dream. It was someone else's definition of success.</p>`,
    author: 1,
    views: 1023,
    likesCount: 198,
    commentsCount: 56,
  },
  {
    title: "The Interview That Changed My Career",
    category: "Career",
    coverImage: "/categories/career.jpg",
    excerpt: "I walked into that interview unprepared and walked out with a completely new perspective on work.",
    content: `<p>I was 24, fresh out of university, and had an interview at a startup I really wanted to join. I had prepared answers for every possible question. I knew the company inside out.</p><p>But the interviewer did not ask a single question I expected.</p><p>"Tell me about a time you failed," she said. I gave a polished answer about a group project in uni. She nodded but was not satisfied.</p><p>"No, tell me about a real failure. Something that actually hurt. Something you still think about."</p><p>I froze. I had never been asked that before. I stumbled through an answer about a friendship I ruined by being selfish in high school. It was raw, honest, and completely unrehearsed.</p><p>She smiled. "That is the answer I was looking for. Most people give me a scripted response. You were real."</p><p>I got the job. More importantly, I learned something that day that has guided my career ever since: authenticity beats preparation. People connect with real, not perfect.</p>`,
    author: 0,
    views: 567,
    likesCount: 89,
    commentsCount: 24,
  },
  {
    title: "From Rejection to Resilience",
    category: "Career",
    coverImage: "/categories/career.jpg",
    excerpt: "I was rejected from 47 jobs before landing the one that changed my life.",
    content: `<p>The number is embarrassing, but I counted: 47 job rejections before I finally got hired. Forty-seven times I polished my resume, practiced my answers, wore my best outfit, and got told "no."</p><p>After rejection number 20, I stopped counting. After rejection number 30, I stopped believing in myself. After rejection number 40, I almost gave up on my field entirely.</p><p>What kept me going was a note on my desk from my mum: "The right door is there. You just have to keep knocking."</p><p>Rejection number 48 was different. The interviewer actually smiled when she saw my portfolio. "We have been waiting for someone like you," she said.</p><p>I nearly cried in the interview room.</p><p>That job taught me more in two years than five years of university. It led me to my current role, which I love.</p><p>If you are in the middle of your rejection phase, I want you to know: every no is bringing you closer to your yes. Do not stop knocking.</p>`,
    author: 2,
    views: 890,
    likesCount: 167,
    commentsCount: 42,
  },
  {
    title: "Building a Career Without a Plan",
    category: "Career",
    coverImage: "/categories/career.jpg",
    excerpt: "I never had a five-year plan. Here is how following curiosity led me to an amazing career.",
    content: `<p>In career workshops, they always ask: "Where do you see yourself in five years?" I never had an answer. Not because I was lazy, but because I genuinely did not know.</p><p>I started as a journalist, then moved to marketing, then to UX design, then to product management. Each move seemed random from the outside. But inside, I was following a thread of curiosity.</p><p>Journalism taught me to tell stories. Marketing taught me to understand audiences. UX design taught me to solve problems. Product management taught me to lead teams. Each role built on the last.</p><p>Today, I lead a product team at a company I love. My background in multiple fields is not a weakness — it is my superpower. I can write copy, design interfaces, analyze data, and speak to users. Because I have done it all.</p><p>So if you do not have a plan, relax. Plans are overrated. Curiosity is underrated. Follow what excites you, learn everything you can, and trust that it will all connect.</p><p>It always does.</p>`,
    author: 1,
    views: 445,
    likesCount: 76,
    commentsCount: 18,
  },

  // ===== EDUCATION =====
  {
    title: "The Teacher Who Changed My Life",
    category: "Education",
    coverImage: "/categories/education.jpg",
    excerpt: "One teacher saw something in me that I could not see in myself. That changed everything.",
    content: `<p>I was a quiet kid. Not the smartest, not the loudest, not the one teachers remembered. I blended into the background and preferred it that way.</p><p>Then in Year 10, Mrs. Chen walked into our English class. She was different. She did not just teach from the textbook. She asked us questions that made us think.</p><p>One day, she asked us to write a short story. I wrote about a boy who could talk to birds. It was silly, but I put effort into it.</p><p>Mrs. Chen handed it back with a note: "You have a gift for storytelling. Have you ever considered writing more?"</p><p>No teacher had ever said anything like that to me. I had never considered myself good at anything.</p><p>I started writing. A lot. Short stories, poems, journal entries. Writing became my voice. It gave me confidence. It led me to study communications, which led to my career.</p><p>I tracked Mrs. Chen down years later and sent her a letter. She wrote back: "I always knew you had it in you. I just pointed it out."</p><p>Teachers do not just teach subjects. They see potential. And sometimes, that changes a life.</p>`,
    author: 0,
    views: 756,
    likesCount: 145,
    commentsCount: 38,
  },
  {
    title: "Why I Went Back to University at 35",
    category: "Education",
    coverImage: "/categories/education.jpg",
    excerpt: "Everyone said it was too late. I proved them wrong.",
    content: `<p>At 35, I was a single mum with two kids, a full-time job, and a dream I had been putting off for a decade. I wanted to become a psychologist.</p><p>"You are too old," friends said. "You cannot afford it," my bank account agreed. "What about the kids?" my mum asked.</p><p>But something inside me refused to let it go. I had been fascinated by psychology since I was a teenager. Every self-help book, every podcast, every conversation about the mind — I was all in.</p><p>So I applied. Part-time degree. Online classes after the kids went to bed. Weekend study sessions at the library while my mum watched the children.</p><p>It was the hardest thing I have ever done. There were nights I cried over textbooks. Mornings I could barely keep my eyes open. Semesters I wanted to quit.</p><p>But I did not. Three years later, I graduated with honours. My kids were in the audience, cheering louder than anyone.</p><p>It is never too late. The only thing worse than starting late is never starting at all.</p>`,
    author: 2,
    views: 1234,
    likesCount: 234,
    commentsCount: 67,
  },
  {
    title: "Learning a New Language at 40",
    category: "Education",
    coverImage: "/categories/education.jpg",
    excerpt: "My brain felt like mush, my pronunciation was terrible, but the journey was worth every awkward moment.",
    content: `<p>When I told my family I was learning Japanese at 40, my teenage son laughed. My husband raised an eyebrow. My colleagues thought it was a phase.</p><p>I had always wanted to learn a second language. Growing up in a monolingual household, I admired people who could switch between languages effortlessly. It seemed like a superpower.</p><p>The first three months were humbling. I could not even pronounce basic words correctly. My 8-year-old nephew learned faster than me. I felt foolish.</p><p>But I kept showing up. Every morning, 30 minutes of practice. Apps, textbooks, YouTube videos, and eventually a conversation partner in Tokyo.</p><p>A year later, I had my first full conversation in Japanese with a shopkeeper in Tokyo. I understood her. She understood me. I nearly cried on the spot.</p><p>Learning a language at any age is hard. But it teaches you something valuable: how to be bad at something and keep going anyway. That is a skill that applies to everything.</p>`,
    author: 1,
    views: 567,
    likesCount: 98,
    commentsCount: 23,
  },
  {
    title: "What School Never Taught Me",
    category: "Education",
    coverImage: "/categories/education.jpg",
    excerpt: "Twelve years of school and university, and the most important lessons came from outside the classroom.",
    content: `<p>I excelled in school. Good grades, awards, scholarships. I was the kid who followed the rules and checked every box.</p><p>Then I entered the real world and realized I knew almost nothing that mattered.</p><p>School taught me algebra but not how to do taxes. It taught me history but not how to understand myself. It taught me to memorise but not how to think critically. It taught me to compete but not how to collaborate.</p><p>The lessons that actually shaped me came from outside the classroom: learning to negotiate with a landlord, figuring out how to cook a decent meal on a budget, understanding that failure is not the end of the world.</p><p>I am not against formal education. It has its place. But we need to be honest about what it covers and what it misses.</p><p>The best education is a combination of structured learning and real-world experience. Read books. Travel. Make mistakes. Talk to people who are nothing like you. That is where the real learning happens.</p>`,
    author: 0,
    views: 678,
    likesCount: 112,
    commentsCount: 31,
  },

  // ===== TECHNOLOGY =====
  {
    title: "How AI Changed My Daily Routine",
    category: "Technology",
    coverImage: "/categories/technology.jpg",
    excerpt: "From sceptic to daily user — how artificial intelligence became an unexpected part of my everyday life.",
    content: `<p>I was firmly in the "AI is overhyped" camp. Every tech company was slapping "AI-powered" on their products, and I was rolling my eyes.</p><p>Then a colleague showed me how she used AI to draft emails, summarise meetings, and plan her week. It was not magic. It was just... practical.</p><p>I started small. I used an AI tool to help me write a difficult email to a client. Instead of staring at a blank screen for 20 minutes, I had a draft in 2 minutes. I edited it, made it mine, and sent it.</p><p>Now AI helps me brainstorm blog ideas, organise my notes, translate messages for international colleagues, and even plan meals for the week.</p><p>The key is treating AI as a tool, not a replacement. It is incredibly good at first drafts and mundane tasks. It is terrible at originality, empathy, and nuance — the things that make us human.</p><p>Use AI for the grunt work. Save your brain for the creative stuff.</p>`,
    author: 1,
    views: 934,
    likesCount: 167,
    commentsCount: 45,
  },
  {
    title: "Digital Detox: I Survived a Week Without My Phone",
    category: "Technology",
    coverImage: "/categories/technology.jpg",
    excerpt: "Seven days without scrolling. Here is what happened to my brain, my sleep, and my relationships.",
    content: `<p>I was averaging 6 hours of screen time a day. Not for work. For scrolling. Instagram, Twitter, news apps, YouTube — a constant stream of content filling every quiet moment.</p><p>So I did something drastic. I put my phone in a drawer for a week. I told my close contacts to call me if anything urgent came up. Then I stepped into the unknown.</p><p>Day 1 was terrifying. I reached for my phone 47 times. I counted. Each time, I had to remind myself: it is in the drawer.</p><p>Day 2 was easier. I started noticing things — the sound of birds outside, the way sunlight moved across my living room wall. I had not been present in my own home for months.</p><p>By Day 4, I was sleeping better. I fell asleep reading a book instead of doom-scrolling. I woke up refreshed, not groggy.</p><p>By Day 7, something had shifted. My mind felt quieter. I was more patient with my family. I had ideas for blog posts, creative projects, things I had been too distracted to think about.</p><p>I am back on my phone now. But I set limits. And I put it in the drawer every Sunday. The quiet is too valuable to give up.</p>`,
    author: 0,
    views: 1567,
    likesCount: 289,
    commentsCount: 72,
  },
  {
    title: "The App That Saved My Marriage",
    category: "Technology",
    coverImage: "/categories/technology.jpg",
    excerpt: "We were too busy for each other. Then we found a simple tool that brought us back together.",
    content: `<p>My wife and I had been together for 12 years. We loved each other, but we were drifting. Between work, kids, and the chaos of daily life, we had become roommates who happened to share a bed.</p><p>We did not fight. We just... stopped connecting. Conversations were about logistics: who is picking up the kids, what is for dinner, did you pay the electricity bill.</p><p>Then a friend recommended a simple app designed for couples. It sent daily prompts: "What is one thing your partner did today that you appreciated?" "What is a memory that makes you smile?"</p><p>We both rolled our eyes at first. But we tried it.</p><p>The first prompt made me realise I had not told my wife she looked beautiful in months. The second made me remember our first date — how nervous I was, how she laughed at my terrible jokes.</p><p>We started talking again. Not about logistics. About us. About dreams, fears, memories, and plans.</p><p>Technology is often blamed for destroying relationships. But sometimes, it can be the bridge that brings people back together.</p>`,
    author: 2,
    views: 890,
    likesCount: 156,
    commentsCount: 39,
  },
  {
    title: "Why Every Adult Should Learn to Code",
    category: "Technology",
    coverImage: "/categories/technology.jpg",
    excerpt: "Not to become a developer. But to understand the world we live in.",
    content: `<p>I am not a programmer. I work in marketing. But last year, I spent three months learning basic Python, and it was one of the best decisions of my adult life.</p><p>Not because I plan to switch careers. But because understanding code is like understanding how a car engine works — you do not need to build one, but it helps you navigate the world.</p><p>Coding taught me to think logically. To break big problems into small steps. To debug — to look at something that is not working and systematically figure out why.</p><p>Those skills apply to everything. Writing a report. Planning a project. Even resolving conflicts. The process is the same: identify the problem, break it down, test solutions, learn from errors.</p><p>You do not need to learn Python or JavaScript. Start with something simple. There are free courses everywhere. Spend an hour a week for a month. You will be surprised how it changes the way you think.</p><p>The world runs on code. Understanding the basics is not just useful — it is empowering.</p>`,
    author: 1,
    views: 678,
    likesCount: 112,
    commentsCount: 29,
  },

  // ===== TRAVEL =====
  {
    title: "Solo Travel Changed Who I Am",
    category: "Travel",
    coverImage: "/categories/travel.jpg",
    excerpt: "I was terrified of travelling alone. Then I booked a one-way ticket to Thailand.",
    content: `<p>Travelling alone had always been my nightmare. The thought of eating alone in a restaurant, navigating foreign streets without a companion, sleeping in an unfamiliar room — it all felt overwhelming.</p><p>Then, at 28, after a breakup that left me questioning everything, I booked a one-way ticket to Bangkok. No return date. No itinerary. Just me and a backpack.</p><p>The first two days were brutal. I was lonely, confused, and questioning my decision. I sat in a hostel common room pretending to be busy on my phone while fighting back tears.</p><p>Then a Dutch traveller asked if I wanted to join her for street food. That small invitation changed everything. We explored temples, got lost in markets, and talked until 3 AM about our lives, fears, and dreams.</p><p>By the end of the trip, I had met people from 15 countries, learned to navigate alone, and discovered that I was far braver than I ever imagined.</p><p>Solo travel does not just show you the world. It shows you who you are when no one is watching.</p>`,
    author: 0,
    views: 1890,
    likesCount: 345,
    commentsCount: 87,
  },
  {
    title: "The Hidden Gems of Rural Japan",
    category: "Travel",
    coverImage: "/categories/travel.jpg",
    excerpt: "Beyond Tokyo and Kyoto, there is a Japan that most tourists never see.",
    content: `<p>Everyone told me to visit Tokyo, Kyoto, and Osaka. And they were right — those cities are incredible. But the Japan I fell in love with was somewhere else entirely.</p><p>I took a local train from Tokyo to a tiny village called Shirakawa-go. Three hours of winding tracks through mountains and rice fields. When I arrived, I felt like I had stepped into a different century.</p><p>Traditional wooden farmhouses with steep thatched roofs. Rice paddies stretching to the horizon. An elderly woman selling homemade mochi from a cart. No crowds. No tourist shops. Just life, slowly unfolding.</p><p>I stayed with a local family who served me home-cooked dinner and taught me to make tea the traditional way. We barely spoke the same language, but the warmth was universal.</p><p>The next morning, I watched the sunrise over the mountains from the village viewpoint. It was the most peaceful moment of my life.</p><p>Japan's hidden gems are not hidden at all. They are just off the beaten path, waiting for those willing to wander.</p>`,
    author: 2,
    views: 1234,
    likesCount: 213,
    commentsCount: 54,
  },
  {
    title: "How Traveling Taught Me to Be Present",
    category: "Travel",
    coverImage: "/categories/travel.jpg",
    excerpt: "I used to document every moment instead of living it. A lesson in Morocco changed that forever.",
    content: `<p>I was one of those travellers. Every dish photographed. Every sunset filmed. Every moment captured for Instagram before it was experienced.</p><p>Then I lost my phone in Marrakech.</p><p>I was devastated. Three weeks of photos, gone. But something unexpected happened: I started looking up.</p><p>I noticed the way the light fell through the archways of the riad. I smelled the spices in the souk without worrying about getting the perfect angle. I had actual conversations with shopkeepers instead of just nodding while composing captions.</p><p>Without my phone, I was forced to be present. And being present was magical.</p><p>Of course, I replaced my phone eventually. But I changed the rules. Now I take a few photos at the start of each day, then put the phone away. The rest of the day is mine to live, not to document.</p><p>The best travel memories are not the ones in your camera roll. They are the ones in your heart.</p>`,
    author: 1,
    views: 987,
    likesCount: 178,
    commentsCount: 41,
  },
  {
    title: "Budget Travel: Seeing the World on $30 a Day",
    category: "Travel",
    coverImage: "/categories/travel.jpg",
    excerpt: "You do not need to be rich to travel. You need to be creative.",
    content: `<p>The biggest myth in travel is that it has to be expensive. I have been to 22 countries, and I have rarely spent more than $30 a day.</p><p>The secret is simple: stay in hostels, eat where locals eat, and use public transport. A bed in a hostel dorm costs $8-15 almost anywhere in the world. A local meal costs $2-5. A bus ride costs $1-3.</p><p>But it is not just about saving money. Budget travel forces you to connect with a place in ways that luxury travel does not. You learn to navigate local transit systems. You discover hole-in-the-wall restaurants that tourists miss. You meet fellow travellers in hostel common rooms.</p><p>My most expensive trip was a weekend in a resort. My favourite trip was three weeks in Vietnam for $600 total.</p><p>The resort was nice. Vietnam was life-changing.</p><p>Stop waiting until you can afford luxury. Start travelling now, even if it is humble. The world does not care about your hotel star rating. It cares that you showed up.</p>`,
    author: 0,
    views: 2345,
    likesCount: 423,
    commentsCount: 98,
  },

  // ===== HEALTH =====
  {
    title: "How Walking 10,000 Steps Changed My Health",
    category: "Health",
    coverImage: "/categories/health.jpg",
    excerpt: "No gym membership, no expensive equipment. Just a pair of shoes and a daily commitment.",
    content: `<p>I hated gyms. The crowds, the machines, the awkwardness of not knowing what to do. Every January I would join, and by February I would have stopped.</p><p>Then a doctor told me my blood pressure was rising. Not dangerous yet, but a warning sign. She suggested one simple change: walk more.</p><p>I started with 5,000 steps a day. Just walking around my neighbourhood. Podcasts in my ears, comfortable shoes on my feet. It was easy. Almost too easy.</p><p>Within a month, I bumped it to 8,000. Then 10,000. I started taking the stairs. Parking further from the shop entrance. Walking during lunch breaks.</p><p>Three months later, I went back to the doctor. Blood pressure: normal. Weight: down 4 kg. Energy: through the roof. Sleep: deeper than it had been in years.</p><p>The best exercise is the one you actually do. For me, that is walking. No memberships. No equipment. No excuses. Just me, my shoes, and the road ahead.</p>`,
    author: 1,
    views: 1456,
    likesCount: 267,
    commentsCount: 63,
  },
  {
    title: "The Power of Saying No to Sugar",
    category: "Health",
    coverImage: "/categories/health.jpg",
    excerpt: "I gave up sugar for 30 days. The results stunned me.",
    content: `<p>I had a sweet tooth that controlled me. Chocolate after every meal. Soda with lunch. Ice cream before bed. I knew it was bad, but I could not stop.</p><p>Then I watched a documentary about sugar addiction, and something clicked. I decided to try 30 days without added sugar.</p><p>Day 1-3: Headaches. Irritability. Cravings that felt like actual hunger. I almost quit at least five times.</p><p>Day 4-7: The headaches faded. My energy stabilised. I stopped needing an afternoon nap.</p><p>Day 8-14: My taste buds changed. An apple tasted incredibly sweet. Foods I used to love — sugary cereal, candy bars — tasted artificial and gross.</p><p>Day 15-30: I lost 3 kg. My skin cleared up. I slept better. I thought more clearly. I had energy I had not felt in years.</p><p>After 30 days, I did not go back to my old habits. I still eat sugar occasionally, but it is a choice, not a need. The difference is night and day.</p>`,
    author: 2,
    views: 1890,
    likesCount: 345,
    commentsCount: 78,
  },
  {
    title: "Mental Health Is Not a Trend",
    category: "Health",
    coverImage: "/categories/health.jpg",
    excerpt: "Mental health awareness is everywhere now. But are we actually doing the work?",
    content: `<p>Every brand has a mental health campaign. Every influencer talks about self-care. Mental health awareness is trendy now. And while that is better than silence, I worry we are confusing awareness with action.</p><p>Posting a black-and-white selfie with a hashtag is not mental health care. Buying a wellness journal is not therapy. Taking a bubble bath is not treatment for clinical depression.</p><p>I know because I tried all of those things. And I was still struggling.</p><p>Real mental health care looks like: sitting with a therapist and unpacking childhood trauma. Taking medication when your brain chemistry needs support. Setting boundaries that make people uncomfortable. Doing the boring, unglamorous, daily work of self-awareness.</p><p>I am glad mental health is no longer taboo. But let us be honest about what it actually takes. It is not a trend. It is a lifelong practice.</p><p>If you are struggling, do not just post about it. Get help. Real help. You deserve more than a hashtag.</p>`,
    author: 0,
    views: 2567,
    likesCount: 489,
    commentsCount: 112,
  },
  {
    title: "Why Sleep Is the Ultimate Performance Hack",
    category: "Health",
    coverImage: "/categories/health.jpg",
    excerpt: "I used to brag about sleeping 5 hours. Now I realise that was not dedication — it was damage.",
    content: `<p>In university, pulling all-nighters was a badge of honour. At my first job, sleeping less meant working more, which meant getting ahead. I wore my exhaustion like a trophy.</p><p>Then the consequences caught up. Brain fog. Weight gain. Constant colds. Irritability that was affecting my relationships. My body was screaming at me to stop, and I was ignoring it.</p><p>A friend who is a sleep researcher told me something that changed my perspective: "Sleep is not time off. It is when your brain processes emotions, consolidates memories, and repairs your body. Cutting sleep is like skipping the night shift at a hospital."</p><p>I started prioritising sleep. Eight hours, non-negotiable. No screens before bed. Cool room. Consistent schedule.</p><p>The results were dramatic. I was more productive in 6 well-rested hours than I had been in 10 exhausted ones. My mood improved. My immune system strengthened. My creativity flourished.</p><p>Stop glorifying exhaustion. Start glorifying rest. It is not lazy — it is the smartest thing you can do for your health, career, and relationships.</p>`,
    author: 1,
    views: 1678,
    likesCount: 312,
    commentsCount: 84,
  },

  // ===== INSPIRATION =====
  {
    title: "The Domino Effect of One Small Act",
    category: "Inspiration",
    coverImage: "/categories/inspiration.jpg",
    excerpt: "I held a door open for a stranger. That tiny moment rippled into something I never expected.",
    content: `<p>It was a rainy Tuesday. I was running late, distracted, and not in the mood for pleasantries. But when I reached the coffee shop door, I noticed a woman behind me struggling with two bags and an umbrella.</p><p>I held the door. She smiled. "Thank you so much. You have no idea how much I needed that."</p><p>Something about the way she said it made me pause. It was not just about the door. She looked tired, overwhelmed. I asked if she was okay.</p><p>Turns out she had just lost her job that morning. She was on her way to pick up her kids and did not know how she was going to tell them. We talked for 10 minutes. I shared some contacts in my network. She cried. I hugged her.</p><p>A year later, I received an email. She had found a new job through one of my contacts. She was doing well. And she wanted to thank me — not for holding the door, but for stopping to ask if she was okay.</p><p>We underestimate the power of small acts. A door held open. A kind word. A moment of attention. You never know what ripple you are creating.</p>`,
    author: 0,
    views: 3456,
    likesCount: 567,
    commentsCount: 134,
  },
  {
    title: "Failure Is Not the Opposite of Success",
    category: "Inspiration",
    coverImage: "/categories/inspiration.jpg",
    excerpt: "Every successful person I know has a trail of failures behind them. Here is what they all have in common.",
    content: `<p>We treat failure like it is the end. Like it is proof that we are not good enough. But every successful person I have interviewed, worked with, or admired shares one thing in common: they failed spectacularly, multiple times, before they succeeded.</p><p>One founder pitched her idea to 80 investors before the 81st said yes. That company is now worth $2 billion. A writer I know received 147 rejection letters before her first book was published. It became a bestseller.</p><p>The difference between people who succeed and people who do not is not talent. It is not luck. It is the willingness to fail and keep going.</p><p>Failure teaches you things success never can. It shows you what does not work. It humbles you. It builds resilience. It separates those who want it from those who merely wish for it.</p><p>So the next time you fail — and you will — do not see it as a stop sign. See it as a lesson, a redirection, and proof that you are trying. That is more than most people do.</p>`,
    author: 2,
    views: 2890,
    likesCount: 456,
    commentsCount: 98,
  },
  {
    title: "The Power of Showing Up Every Day",
    category: "Inspiration",
    coverImage: "/categories/inspiration.jpg",
    excerpt: "Motivation gets you started. Discipline keeps you going. Consistency changes everything.",
    content: `<p>I used to wait for motivation. "I will write when I feel inspired." "I will exercise when I have energy." "I will start when the time is right."</p><p>Guess what? The time is never right. Motivation is unreliable. Inspiration comes and goes like weather.</p><p>So I made a decision: I would show up every day, regardless of how I felt. Write 500 words even if they are terrible. Walk 30 minutes even if it rains. Work on my business even when I am tired.</p><p>At first, the results were mediocre. My writing was okay. My fitness was average. My business grew slowly. But I kept showing up.</p><p>After three months, something shifted. The mediocre writing became good. The average fitness became strong. The slow growth became momentum.</p><p>Consistency is not glamorous. Nobody posts about it on Instagram. There are no motivational posters about doing boring work every day. But it is the most powerful force in personal growth.</p><p>Do not wait to feel ready. Do not wait for motivation. Just show up. Today, tomorrow, and the day after. The results will take care of themselves.</p>`,
    author: 1,
    views: 1987,
    likesCount: 378,
    commentsCount: 87,
  },
  {
    title: "Gratitude in the Hard Times",
    category: "Inspiration",
    coverImage: "/categories/inspiration.jpg",
    excerpt: "I started a gratitude journal during the worst year of my life. It saved me.",
    content: `<p>2023 was my hardest year. I lost my job, went through a breakup, and my mum was hospitalised. Everything that could go wrong did.</p><p>A therapist suggested I try gratitude journaling. Three things I was grateful for, every night, no matter what.</p><p>I thought it was ridiculous. How was I supposed to feel grateful when my life was falling apart?</p><p>But I tried it. Night one: "1. I have a roof over my head. 2. My friend called today. 3. The coffee was good this morning." It felt forced. Mechanical.</p><p>Night two: "1. I got out of bed. 2. The sun came out for a bit. 3. I ate a meal I enjoyed."</p><p>Night thirty: "1. I am stronger than I thought. 2. My mum is recovering. 3. I have people who love me."</p><p>The circumstances did not change overnight. But my perspective did. Gratitude did not erase the pain, but it reminded me that pain was not all there was. There was still good. There was still hope.</p><p>I still journal every night. Even on the good days. Especially on the hard ones.</p>`,
    author: 0,
    views: 2345,
    likesCount: 423,
    commentsCount: 104,
  },
];

export async function POST() {
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
          role: "user",
        });
      }
      createdAuthors.push(user);
    }

    // Create stories
    let created = 0;
    let skipped = 0;

    for (const story of stories) {
      const existing = await Story.findOne({ title: story.title });
      if (existing) {
        skipped++;
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

      // Set clean slug (bypass pre-save hook)
      const cleanSlug = story.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      await Story.updateOne({ _id: doc._id }, { slug: cleanSlug });

      created++;
    }

    return NextResponse.json({
      message: `Seeded ${created} stories (${skipped} already existed)`,
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
