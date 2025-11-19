import { useAppContext } from '../../../hooks/useAppContext';
import { useModalsContext } from '../../../hooks/useModalsContext';
import { Cross } from '../../../icons/Cross';
import './styles.css';
import { StatisticColumn } from '../../StatisticColumn';
import { useEffect, useState } from 'react';
import { ipcSignals } from '../../../classes/ipcSignals';
import { TabType } from '../../../contexts/AppContext';

export const ProjectStatisticsModal = () => {
  const { closeModal } = useModalsContext();

  const { currentProjectName } = useAppContext();

  const [data, setData] = useState<{ [name: string]: number } | null>(null);
  const [tabSequence, setTabSequence] = useState<TabType[] | null>(null);
  const [allNumber, setAllNumber] = useState<number | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await ipcSignals.loadData(currentProjectName || 'main');

        const result: { [name: string]: number } = {};

        let allNumber = 0;

        for (let i = 0; i < data.allTopics.length; ++i) {
          const topic = data.allTopics[i];

          result[topic.name] = topic.todos.length;

          allNumber += topic.todos.length;
        }

        setAllNumber(allNumber);
        setData(result);

        setTabSequence(data.tabs);
      } catch (error) {
        console.log('error', error);
      }
    };

    loadProject();
  }, []);

  if (tabSequence === null || data === null || allNumber === null)
    return <div>Loading...</div>;

  return (
    <div>
      <div className="widget_settings_modal_cross" onClick={closeModal}>
        <Cross />
      </div>

      <div className="project_statistics_main">
        <h1>{currentProjectName}</h1>

        <div className="project_statistics_content">
          {tabSequence.map((tab) => {
            const percent = Number(
              ((data[tab.name] / allNumber) * 100).toFixed(2),
            );
            return (
              <StatisticColumn
                key={tab.name}
                percent={percent}
                count={`${data[tab.name]} / ${percent}%`}
                name={tab.name}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
