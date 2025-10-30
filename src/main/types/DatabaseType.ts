import { TabType } from '../../renderer/contexts/AppContext';
import { TopicType } from './TopicType';

export type DatabaseType = {
  [key: string]: { allTopics: TopicType[]; tabs: TabType[] };
};
