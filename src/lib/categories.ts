export const STORY_CATEGORIES = [
  "Technology",
  "AI",
  "Web Development",
  "SEO",
  "Digital Marketing",
  "Education",
  "Life",
  "Family",
  "Career",
  "Travel",
  "Health",
  "Inspiration",
  "Personal",
] as const;

export type StoryCategory = (typeof STORY_CATEGORIES)[number];

export const isStoryCategory = (value: string): value is StoryCategory =>
  (STORY_CATEGORIES as readonly string[]).includes(value);