import PublicSchoolHubPage from '../../components/schoolhub/public-page';

export default function BoardingPage() {
  return (
    <PublicSchoolHubPage
      title="Boarding & Computer Lab"
      description="View boarding facilities, routines, expectations, student welfare information, ICT learning spaces, and the resources that make residential and digital learning organized and supportive."
      sections={[
        { title: 'Boarding Life', type: 'BOARDING' },
        { title: 'Computer Lab', type: 'COMPUTER_LAB' },
      ]}
      emptyText="No boarding or computer lab information available yet."
    />
  );
}
