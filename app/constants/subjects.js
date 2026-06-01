// CBC (Competency Based Curriculum) Subjects (from Grade 10-12)
export const CBC_SUBJECTS = [
  'Mathematics',
  'English',
  'Kiswahili',
  'Integrated Science',
  'Creative Arts & Sports',
  'Agriculture',
  'Home Science',
  'Pre-Technical Studies',
  'Social Studies',
  'Religious Education',
  'Business Studies',
  'French',
  'German',
  'Mandarin',
  'Kenyan Sign Language',
  'Indigenous Languages',
  'Computer Science',
  'Physical Education'
];

// 8-4-4 System Subjects (Form 1-4)
export const EIGHTHFOURTHFOUR_SUBJECTS = [
  'Mathematics',
  'English',
  'Kiswahili',
  'History & Government',
  'Geography',
  'Biology',
  'Chemistry',
  'Physics',
  'CRE/IRE/HRE',
  'Computer Studies',
  'Arabic',
  'Music',
  'Art & Design',
  'Building Construction',
  'Electricity',
  'Metalwork',
  'Woodwork',
  'Power Mechanics',
  'Aviation Technology',
  'Marine Engineering'
];

// Combined list of all subjects (CBC + 8-4-4, with duplicates removed)
export const ALL_SUBJECTS = Array.from(new Set([
  ...CBC_SUBJECTS,
  ...EIGHTHFOURTHFOUR_SUBJECTS
])).sort();

// Grouped subjects for better organization
export const GROUPED_SUBJECTS = {
  'CBC Subjects': CBC_SUBJECTS,
  '8-4-4 Subjects': EIGHTHFOURTHFOUR_SUBJECTS.filter(s => !CBC_SUBJECTS.includes(s))
};

// Subject icons mapping (optional, can be extended)
export const SUBJECT_COLORS = {
  'Mathematics': '#FF6B6B',
  'English': '#4ECDC4',
  'Kiswahili': '#45B7D1',
  'Science': '#FFA07A',
  'Integrated Science': '#FFA07A',
  'Physics': '#FFB347',
  'Chemistry': '#87CEEB',
  'Biology': '#90EE90',
  'History & Government': '#D8BFD8',
  'Geography': '#DEB887',
  'Religious Education': '#DDA0DD',
  'Computer Science': '#20B2AA',
  'Computer Studies': '#20B2AA',
  'Art & Design': '#FFD700',
  'Creative Arts & Sports': '#FFD700',
  'Music': '#FF69B4',
  'Physical Education': '#00CED1',
  'Business Studies': '#DC143C',
  'Agriculture': '#228B22',
  'Home Science': '#F08080',
  'Building Construction': '#808080',
  'Electricity': '#FFD700',
  'Metalwork': '#A9A9A9',
  'Woodwork': '#8B4513',
  'Aviation Technology': '#87CEEB',
  'Marine Engineering': '#4169E1',
  'French': '#0047AB',
  'German': '#000000',
  'Mandarin': '#FF0000',
  'Kenyan Sign Language': '#DC143C',
  'Indigenous Languages': '#8B4513',
  'Pre-Technical Studies': '#A0522D',
};
