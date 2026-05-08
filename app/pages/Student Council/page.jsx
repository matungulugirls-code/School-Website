import PublicSchoolHubPage from '../../components/schoolhub/public-page';

export default function StudentCouncilPage() {
  return (
    <PublicSchoolHubPage
      title="Student Council"
      singleType="STUDENT_COUNCIL"
      description="Meet the student leadership structure, council programs, responsibilities, service initiatives, and the learners helping shape school life."
      emptyText="No student council information available yet."
    />
  );
}
