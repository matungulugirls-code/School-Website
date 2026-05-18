INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'Academic High Mean and National C1 Upgrade Anniversary',
  'Matungulu Girls celebrated a strong academic mean achievement in 2025 and marked the National C1 upgrade in April 2026, reflecting growth, recognition, and renewed academic ambition.',
  'Leadership',
  2026,
  '[{"url":"/Matungulu/31.jpeg","public_id":"local/matungulu-31","caption":"Matungulu Girls milestone celebration"}]',
  TRUE,
  1,
  TRUE,
  'National School Recognition',
  '["2025 high mean achievement","National C1 upgrade","April 2026 anniversary"]',
  '2026-04-01 00:00:00.000',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'Academic High Mean and National C1 Upgrade Anniversary'
);

INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'Success in National Science Fair',
  'Students represented Matungulu Girls with distinction in the National Science Fair, demonstrating creativity, research confidence, and STEM problem-solving.',
  'Academic',
  2025,
  '[{"url":"/Matungulu/28.jpeg","public_id":"local/matungulu-28","caption":"Science and innovation showcase"}]',
  TRUE,
  2,
  TRUE,
  'National Science Fair',
  '["STEM innovation","Research presentation","Student innovators"]',
  '2025-08-15 00:00:00.000',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'Success in National Science Fair'
);

INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'Success in Mathematics Contest',
  'Matungulu Girls celebrated success in mathematics contests, strengthening confidence in numeracy, analytical thinking, and academic competition.',
  'Academic',
  2025,
  '[{"url":"/Matungulu/27.jpeg","public_id":"local/matungulu-27","caption":"Mathematics contest success"}]',
  TRUE,
  3,
  TRUE,
  'Mathematics Department',
  '["Mathematics contest team","Problem solving","Academic competition"]',
  '2025-06-10 00:00:00.000',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'Success in Mathematics Contest'
);

INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'National Music and Games Level Success',
  'Learners advanced their talents through music and games at national level, showing discipline, teamwork, creativity, and school spirit beyond the classroom.',
  'Arts',
  2025,
  '[{"url":"/Matungulu/26.jpeg","public_id":"local/matungulu-26","caption":"Music and games achievement"}]',
  TRUE,
  4,
  TRUE,
  'Co-curricular Department',
  '["Music team","Games team","National level participation"]',
  '2025-04-20 00:00:00.000',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'National Music and Games Level Success'
);

INSERT INTO `Achievement`
  (`title`, `description`, `category`, `year`, `images`, `featured`, `displayOrder`, `isActive`, `awardingBody`, `recipients`, `achievedDate`, `createdAt`, `updatedAt`)
SELECT
  'Tree Planting and Environmental Stewardship',
  'The school community took part in tree planting and environmental care, promoting responsibility, sustainability, and service to the wider community.',
  'Environment',
  2025,
  '[{"url":"/Matungulu/25.jpeg","public_id":"local/matungulu-25","caption":"Tree planting and environmental care"}]',
  TRUE,
  5,
  TRUE,
  'Environmental Club',
  '["Tree planting","Environmental stewardship","Community service"]',
  '2025-03-15 00:00:00.000',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
WHERE NOT EXISTS (
  SELECT 1 FROM `Achievement` WHERE `title` = 'Tree Planting and Environmental Stewardship'
);
