import { useEffect, useState } from 'react';
import './styles.css';
import { ipcSignals } from '../../../classes/ipcSignals';
import { useAppContext } from '../../../hooks/useAppContext';
import { Cross } from '../../../icons/Cross';
import { Input } from '../../shared/Input';
import { Button } from '../../shared/Button';
import { useModalsContext } from '../../../hooks/useModalsContext';

export const ProjectConstructor = () => {
  const { projects, setProjects } = useAppContext();

  const [value, setValue] = useState('');

  const { closeModal } = useModalsContext();

  const handleAddingProject = async () => {
    try {
      const data = await ipcSignals.addProject(value);

      setProjects(data);
      setValue('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleAddingProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [value]);

  if (!projects) return;

  const handleDeleteProject = (name: string) => async () => {
    try {
      const data = await ipcSignals.deleteProject(name);
      console.log('data', data);

      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="project_constructor_adding">
        Добавить проект
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button disabled={value.length === 0} onClick={handleAddingProject}>
          Добавить
        </Button>
      </div>
      <div className="project_constructor_container">
        <p>Проекты</p>
        {projects.map((project) => {
          return (
            <div className="project_constructor_container_option" key={project}>
              {project}
              {project !== 'main' && (
                <div
                  className="project_constructor_container_option_cross"
                  onClick={handleDeleteProject(project)}
                >
                  <Cross />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <Button onClick={closeModal}>Закрыть</Button>
      </div>
    </div>
  );
};
