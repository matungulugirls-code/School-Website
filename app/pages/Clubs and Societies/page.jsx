import PublicSchoolHubPage from '../../components/schoolhub/public-page';

export default function ClubsAndSocietiesPage() {
  return (
    <PublicSchoolHubPage
      title="Clubs & Societies"
      description="Discover co-curricular opportunities, student communities, leadership spaces, creative programs, and societies that enrich life beyond the classroom."
      sections={[
        { title: 'Clubs', type: 'CLUB' },
        { title: 'Societies', type: 'SOCIETY' },
      ]}
      emptyText="No clubs or societies available yet."
    />
  );
}
