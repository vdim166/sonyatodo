import { saveTodoType } from '../../../classes/ipcSignals';

export function sortTodosByDeadline(todos: saveTodoType[]): saveTodoType[] {
  return [...todos].sort((a, b) => {
    const aDate = a.deadline?.to ? new Date(a.deadline.to).getTime() : null;
    const bDate = b.deadline?.to ? new Date(b.deadline.to).getTime() : null;

    // Если у обеих задач нет дедлайна — порядок не меняем
    if (!aDate && !bDate) return 0;

    // Если у одной нет дедлайна — она идет вниз
    if (!aDate) return 1;
    if (!bDate) return -1;

    // Чем меньше дата — тем ближе дедлайн (идет выше)
    return aDate - bDate;
  });
}
