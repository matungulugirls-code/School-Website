import PublicSchoolHubPage from '../../components/schoolhub/public-page';

export default function ClubsPage() {
  return (
    <PublicSchoolHubPage
      title="Clubs"
      singleType="CLUB"
      description="Explore student clubs, creative programs, leadership spaces, and activity groups that help learners discover interests beyond academics."
      emptyText="No clubs available yet."
    />
  );
}
