import { NEED_KEYS, NEED_MAX, type NeedsMap } from '../types/employee';
import { useLocale } from '../context/LocaleContext';
import { RadarChart } from './RadarChart';

interface NeedsRadarChartProps {
  needs: NeedsMap;
}

export function NeedsRadarChart({ needs }: NeedsRadarChartProps) {
  const { t } = useLocale();
  const shortLabels: Record<(typeof NEED_KEYS)[number], string> = {
    material: t('needs.materialShort'),
    security: t('needs.securityShort'),
    social: t('needs.socialShort'),
    respect: t('needs.respectShort'),
    development: t('needs.developmentShort'),
    selfRealization: t('needs.selfRealizationShort'),
    physicalComfort: t('needs.physicalComfortShort'),
  };

  return (
    <RadarChart
      ariaLabel={t('needs.radarAria')}
      maxValue={NEED_MAX}
      axes={NEED_KEYS.map((key) => ({
        key,
        label: shortLabels[key],
        value: needs[key].score,
        valueLabel: String(needs[key].score),
      }))}
    />
  );
}
