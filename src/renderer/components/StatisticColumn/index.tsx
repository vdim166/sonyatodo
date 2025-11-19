import { CSSProperties, useEffect, useState } from 'react';
import { getRandomHexColor } from '../shared/functions/getRandomHexColor';
import './styles.css';

type StatisticColumnProps = {
  percent: number;
  name: string;
  count: string;
  color?: string;
};

export const StatisticColumn = ({
  percent,
  name,
  count,
  color = getRandomHexColor(),
}: StatisticColumnProps) => {
  const [style, setStyle] = useState<CSSProperties>({
    height: 0,
    backgroundColor: color,
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStyle({
          height: `${percent * 4}px`,
          backgroundColor: color,
        });
      });
    });
  }, []);

  return (
    <div className="statistic_column_container" style={{ height: '450px' }}>
      <div className="statistic_column_name">{name}</div>
      <div className="statistic_column" style={style}></div>
      <div className="statistic_column_count">{count}</div>
    </div>
  );
};
