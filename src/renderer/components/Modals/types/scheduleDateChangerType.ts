import {
  ScheduleDateType,
  ScheduleTodoDTO,
} from '../../../../main/classes/ScheduleDatabase';

export type scheduleDateChangerType = {
  date: ScheduleTodoDTO;
  origin: ScheduleDateType;
};
