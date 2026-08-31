import { NEED_KEYS, type NeedsMap } from '../types/employee';
import { RadarChart } from './RadarChart';

const SHORT_LABELS: Record<(typeof NEED_KEYS)[number], string> = {
  material: 'Материальные',
  security: 'Безопасность',
  social: 'Социальные',
  respect: 'Уважение',
  development: 'Развитие',
  selfRealization: 'Самореализация',
  physicalComfort: 'Комфорт',
};

interface NeedsRadarChartProps {
  needs: NeedsMap;
}

export function NeedsRadarChart({ needs }: NeedsRadarChartProps) {
  return (
    <RadarChart
      ariaLabel="Радар базовых потребностей"
      maxValue={100}
      axes={NEED_KEYS.map((key) => ({
        key,
        label: SHORT_LABELS[key],
        value: needs[key].percent,
        valueLabel: `${needs[key].percent}%`,
      }))}
    />
  );
}
