import PublicSchoolHubPage from '../../components/schoolhub/public-page';

export default function SecurityPage() {
  return (
    <PublicSchoolHubPage
      title="School Security"
      singleType="SECURITY"
      description="Find safety measures, security contacts, access guidance, and the systems that help keep students, staff, and visitors protected."
      emptyText="No security information available yet."
    />
  );
}
