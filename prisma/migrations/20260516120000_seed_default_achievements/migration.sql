-- Seed public achievement records into the Achievement table.
-- These rows replace the old frontend fallback data and use existing public assets.

INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'National School Status',
  'Matungulu Girls Senior School was conferred Category One (C1) National School status during the 60th-anniversary celebrations in April 2026, recognizing sustained academic performance, governance, infrastructure, and co-curricular growth.',
  'Leadership',
  2026,
  JSON_ARRAY(JSON_OBJECT('url', '/hero/MatG1.jpg', 'caption', 'National school recognition')),
  TRUE,
  1,
  TRUE,
  'Ministry of Education',
  JSON_ARRAY('Category One (C1) National School status', 'Conferred during the 60th-anniversary celebrations', 'Expanded national admission visibility', 'Recognition for governance and infrastructure growth'),
  STR_TO_DATE('2026-04-01', '%Y-%m-%d'),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'National School Status' AND `year` = 2026
);

INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'Record KCSE Performance',
  'The 2025 KCSE results marked a historic academic high point for Matungulu Girls, with a mean score of 8.14, strong university transition, and excellent top-grade performance.',
  'Academic',
  2025,
  JSON_ARRAY(JSON_OBJECT('url', '/Matungulu/9.jpeg', 'caption', 'Academic excellence at Matungulu Girls')),
  TRUE,
  2,
  TRUE,
  'Matungulu Girls Senior School',
  JSON_ARRAY('Mean score of 8.14', '84% university transition', '1 A plain and 15 A- grades', 'Over 60% B+ and above'),
  STR_TO_DATE('2025-12-15', '%Y-%m-%d'),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'Record KCSE Performance' AND `year` = 2025
);

INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'Top County Ranking',
  'Matungulu Girls was recognized among the top public schools in Machakos County and as a leading girls'' school in its category, strengthening the school''s reputation for consistent excellence.',
  'Academic',
  2025,
  JSON_ARRAY(JSON_OBJECT('url', '/Matungulu/29.jpeg', 'caption', 'County ranking recognition')),
  TRUE,
  3,
  TRUE,
  'County Education Office',
  JSON_ARRAY('Best-performing girls'' school in category', 'Second-best public school overall in Machakos County', 'Recognition for KCSE consistency and student retention'),
  STR_TO_DATE('2025-12-20', '%Y-%m-%d'),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'Top County Ranking' AND `year` = 2025
);

INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'Most Improved School',
  'The school was recognized for a strong improvement journey, including academic gains, stronger student support programs, infrastructure growth, and deeper parent-teacher collaboration.',
  'Academic',
  2024,
  JSON_ARRAY(JSON_OBJECT('url', '/Matungulu/37.jpeg', 'caption', 'Most improved school recognition')),
  FALSE,
  4,
  TRUE,
  'Machakos County Government',
  JSON_ARRAY('Recognized for academic improvement', 'Growth in infrastructure and student support', 'Remedial and mentorship programs highlighted'),
  STR_TO_DATE('2024-08-15', '%Y-%m-%d'),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'Most Improved School' AND `year` = 2024
);

INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'National Science Fair',
  'Students earned national recognition in the Science and Engineering Fair through an innovation project focused on sustainable energy and practical environmental problem solving.',
  'Academic',
  2024,
  JSON_ARRAY(JSON_OBJECT('url', '/Matungulu/26.jpeg', 'caption', 'Science fair innovation')),
  FALSE,
  5,
  TRUE,
  'National Science and Engineering Fair',
  JSON_ARRAY('Top recognition in sustainable energy innovation', 'Project mentored by Chemistry and Biology departments', 'Student-led practical science innovation'),
  STR_TO_DATE('2024-06-20', '%Y-%m-%d'),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'National Science Fair' AND `year` = 2024
);
