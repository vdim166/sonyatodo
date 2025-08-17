import { useAppContext } from '../../hooks/useAppContext';
import './styles.css';

export const ProjectsHolder = () => {
  const { projects, currentProjectName, setCurrentProjectName } =
    useAppContext();

  if (!projects) return <div>Loading...</div>;

  const moveToProject = (project: string) => () => {
    setCurrentProjectName(project);
  };

  return (
    <div className="project_holder">
      <p className="project_holder_title">Проекты</p>
      <div className="project_holder_container">
        {projects.map((project) => {
          return (
            <div
              onClick={moveToProject(project)}
              className={`project_holder_container_option ${currentProjectName === project ? 'selected' : ''}`}
              key={project}
            >
              <p>{project}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
