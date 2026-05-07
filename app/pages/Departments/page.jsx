import PublicSchoolHubPage from '../../components/schoolhub/public-page';

export default function DepartmentsPage() {
  return (
    <PublicSchoolHubPage
      title="School Departments"
      departments
      description="Explore the school departments, academic groupings, support teams, and organized structures that keep teaching and operations coordinated."
      emptyText="No departments available yet."
    />
  );
}
