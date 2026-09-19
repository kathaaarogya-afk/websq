import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Story from "@/models/Story";
import Category from "@/models/Category";

const authors = [
  { name: "Admin", email: "admin@websq.com.au", bio: "Site administrator.", role: "admin" as const },
  { name: "Sarah Johnson", email: "sarah@websq.com.au", bio: "Travel writer and adventure seeker.", role: "user" as const },
  { name: "David Wilson", email: "david@websq.com.au", bio: "Tech enthusiast and lifelong learner.", role: "user" as const },
  { name: "Emily Brown", email: "emily@websq.com.au", bio: "Education advocate and storyteller.", role: "user" as const },
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
    author: 3,
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
    author: 1,
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
    author: 2,
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
    author: 2,
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
    author: 1,
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
    author: 2,
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
    author: 1,
    views: 1567,
    likesCount: 289,
    commentsCount: 72,
  },

  // ===== TRAVEL (2) =====
  {
    title: "Solo Travel Changed Who I Am",
    category: "Travel",
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",
    excerpt: "I was terrified of travelling alone. Then I booked a one-way ticket to Thailand.",
    content: `<p>Travelling alone had always been my nightmare. The thought of eating alone in a restaurant, navigating foreign streets without a companion, sleeping in an unfamiliar room — it all felt overwhelming.</p><p>Then, at 28, after a breakup that left me questioning everything, I booked a one-way ticket to Bangkok. No return date. No itinerary. Just me and a backpack.</p><p>The first two days were brutal. I was lonely, confused, and questioning my decision. I sat in a hostel common room pretending to be busy on my phone while fighting back tears.</p><p>Then a Dutch traveller asked if I wanted to join her for street food. That small invitation changed everything. We explored temples, got lost in markets, and talked until 3 AM about our lives, fears, and dreams.</p><p>By the end of the trip, I had met people from 15 countries, learned to navigate alone, and discovered that I was far braver than I ever imagined.</p><p>Solo travel does not just show you the world. It shows you who you are when no one is watching.</p>`,
    author: 1,
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
    author: 2,
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
    author: 2,
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
    author: 2,
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
    author: 1,
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
    author: 2,
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
    author: 1,
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
    author: 2,
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
    author: 3,
    views: 312,
    likesCount: 67,
    commentsCount: 19,
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
          role: author.role || "user",
        });
      }
      createdAuthors.push(user);
    }

    let created = 0;
    let skipped = 0;

    const categories = ["Life", "Family", "Career", "Education", "Technology", "Travel", "Health", "Inspiration", "Personal"];
    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat });
      if (!exists) {
        await Category.create({ name: cat, description: `Stories about ${cat.toLowerCase()}` });
      }
    }

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
