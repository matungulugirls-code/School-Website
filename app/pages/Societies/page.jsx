import PublicSchoolHubPage from '../../components/schoolhub/public-page';

export default function SocietiesPage() {
  return (
    <PublicSchoolHubPage
      title="Societies & Student Council"
      description="Explore student societies, service groups, academic communities, student leadership, and council initiatives that strengthen participation and school culture."
      sections={[
        { title: 'Societies', type: 'SOCIETY' },
        { title: 'Student Council', type: 'STUDENT_COUNCIL' },
      ]}
      emptyText="No societies or student council information available yet."
    />
  );
}
