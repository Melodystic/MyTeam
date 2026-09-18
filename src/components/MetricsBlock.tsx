import { useMemo, useState } from 'react';
import {
  Button,
  Empty,
  Input,
  Select,
  Space,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import {
  DeleteOutlined,
  InfoCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  createCustomMetric,
  createMetricFromPreset,
  METRIC_MAX,
  type Employee,
  type EmployeeMetric,
} from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { RadarChart } from './RadarChart';
import { useLocale } from '../context/LocaleContext';

interface MetricsBlockProps {
  employee: Employee;
  onAddMetrics: (metrics: EmployeeMetric[]) => void;
  onRemoveMetric: (metricId: string) => void;
  onChangeValue: (metricId: string, delta: number) => void;
  onChangeComment: (metricId: string, comment: string) => void;
}

export function MetricsBlock({
  employee,
  onAddMetrics,
  onRemoveMetric,
  onChangeValue,
  onChangeComment,
}: MetricsBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { domain, t } = useLocale();
  const [presetKeys, setPresetKeys] = useState<string[]>([]);
  const [customName, setCustomName] = useState('');

  const usedPresetKeys = useMemo(
    () =>
      new Set(
        employee.metrics
          .map((m) => m.presetKey)
          .filter((key): key is string => !!key),
      ),
    [employee.metrics],
  );

  const metricPresets = domain.METRIC_PRESETS;
  const availablePresets = metricPresets.filter(
    (preset) => !usedPresetKeys.has(preset.key),
  );

  const handleAddPresets = () => {
    if (presetKeys.length === 0) return;
    onAddMetrics(
      metricPresets
        .filter((preset) => presetKeys.includes(preset.key))
        .map(createMetricFromPreset),
    );
    setPresetKeys([]);
  };

  const handleAddCustom = () => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    onAddMetrics([createCustomMetric(trimmed)]);
    setCustomName('');
  };

  return (
    <div>
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        {t('metrics.intro', { max: METRIC_MAX })}
      </Typography.Text>

      {employee.metrics.length >= 3 ? (
        <RadarChart
          ariaLabel={t('metrics.radarAria')}
          maxValue={METRIC_MAX}
          axes={employee.metrics.map((metric) => ({
            key: metric.id,
            label:
              metricPresets.find((preset) => preset.key === metric.presetKey)
                ?.shortName ?? metric.shortName,
            value: metric.value,
            valueLabel: String(metric.value),
          }))}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            employee.metrics.length === 0
              ? t('metrics.empty')
              : t('metrics.addForRadar', {
                  count: 3 - employee.metrics.length,
                })
          }
          style={{ margin: '12px 0 24px' }}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 20,
          padding: isMobile ? 12 : 16,
          borderRadius: token.borderRadiusLG,
          background: token.colorFillAlter,
        }}
      >
        <Typography.Text strong>{t('metrics.addTitle')}</Typography.Text>

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 8,
            alignItems: isMobile ? 'stretch' : 'center',
          }}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder={t('metrics.presetsPlaceholder')}
            style={{ flex: 1, minWidth: 0 }}
            size={isMobile ? 'large' : 'middle'}
            value={presetKeys}
            disabled={availablePresets.length === 0}
            options={availablePresets.map((p) => ({
              value: p.key,
              label: p.name,
            }))}
            optionRender={(option) => {
              const preset = metricPresets.find(
                (item) => item.key === option.value,
              );
              return (
                <div>
                  <div>{option.label}</div>
                  {preset ? (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {preset.description}
                    </Typography.Text>
                  ) : null}
                </div>
              );
            }}
            onChange={setPresetKeys}
            maxTagCount="responsive"
          />
          <Button
            type="primary"
            disabled={presetKeys.length === 0}
            onClick={handleAddPresets}
            size={isMobile ? 'large' : 'middle'}
          >
            {t('common.add')}
          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 8,
            alignItems: isMobile ? 'stretch' : 'center',
          }}
        >
          <Input
            placeholder={t('metrics.customPlaceholder')}
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onPressEnter={handleAddCustom}
            size={isMobile ? 'large' : 'middle'}
            style={{ flex: 1 }}
            maxLength={60}
          />
          <Button
            disabled={!customName.trim()}
            onClick={handleAddCustom}
            size={isMobile ? 'large' : 'middle'}
          >
            {t('common.create')}
          </Button>
        </div>
      </div>

      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {employee.metrics.map((metric) => {
          const preset = metricPresets.find(
            (item) => item.key === metric.presetKey,
          );
          const metricName = preset?.name ?? metric.name;
          const canIncrease = metric.value < METRIC_MAX;
          const canDecrease = metric.value > 0;

          return (
            <div
              key={metric.id}
              style={{
                padding: 12,
                borderRadius: token.borderRadiusLG,
                background: token.colorFillAlter,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexDirection: isMobile ? 'column' : 'row',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                    width: isMobile ? '100%' : undefined,
                    flex: 1,
                  }}
                >
                  <Typography.Text style={{ flex: 1, minWidth: 0 }}>
                    {metricName}
                  </Typography.Text>
                  {preset ? (
                    <Tooltip
                      title={preset.description}
                      trigger={isMobile ? ['click'] : ['hover']}
                    >
                      <InfoCircleOutlined
                        style={{
                          color: token.colorTextSecondary,
                          fontSize: isMobile ? 18 : 14,
                          padding: isMobile ? 6 : 0,
                          flexShrink: 0,
                        }}
                      />
                    </Tooltip>
                  ) : null}
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onRemoveMetric(metric.id)}
                    aria-label={t('metrics.deleteAria', {
                      name: metricName,
                    })}
                    style={isMobile ? { width: 40, height: 40 } : undefined}
                  />
                </div>

                <Space size="middle" style={{ alignSelf: isMobile ? 'flex-end' : undefined }}>
                  <Button
                    size={isMobile ? 'middle' : 'small'}
                    icon={<MinusOutlined />}
                    disabled={!canDecrease}
                    onClick={() => onChangeValue(metric.id, -1)}
                    aria-label={t('metrics.decreaseAria', {
                      name: metricName,
                    })}
                    style={isMobile ? { width: 40, height: 40 } : undefined}
                  />
                  <Typography.Text
                    strong
                    style={{ minWidth: 36, textAlign: 'center', display: 'inline-block' }}
                  >
                    {metric.value}
                  </Typography.Text>
                  <Button
                    size={isMobile ? 'middle' : 'small'}
                    icon={<PlusOutlined />}
                    disabled={!canIncrease}
                    onClick={() => onChangeValue(metric.id, 1)}
                    aria-label={t('metrics.increaseAria', {
                      name: metricName,
                    })}
                    style={isMobile ? { width: 40, height: 40 } : undefined}
                  />
                </Space>
              </div>

              <Input.TextArea
                rows={2}
                placeholder={t('metrics.commentPlaceholder')}
                value={metric.comment}
                onChange={(e) => onChangeComment(metric.id, e.target.value)}
              />
            </div>
          );
        })}
      </Space>
    </div>
  );
}
