import PublicSchoolHubPage from '../../components/schoolhub/public-page';

export default function BoardingPage() {
  return (
    <PublicSchoolHubPage
      title="Boarding Life"
      singleType="BOARDING"
      description="View boarding facilities, routines, expectations, student welfare information, and the spaces that make residential learning organized and supportive."
      emptyText="No boarding information available yet."
    />
  );
}
