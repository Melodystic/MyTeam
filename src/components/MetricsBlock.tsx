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
  METRIC_PRESETS,
  type Employee,
  type EmployeeMetric,
} from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { RadarChart } from './RadarChart';

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

  const availablePresets = METRIC_PRESETS.filter((p) => !usedPresetKeys.has(p.key));

  const handleAddPresets = () => {
    if (presetKeys.length === 0) return;
    onAddMetrics(
      METRIC_PRESETS.filter((p) => presetKeys.includes(p.key)).map(createMetricFromPreset),
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
        Оцените сотрудника по шкале 0–{METRIC_MAX}. Добавьте метрики из базового набора
        или создайте свои. Рекомендуется держать фокус на 3–5 метриках — так проще
        читать радар и принимать решения. Для радара нужно минимум 3 оси.
      </Typography.Text>

      {employee.metrics.length >= 3 ? (
        <RadarChart
          ariaLabel="Радар метрик сотрудника"
          maxValue={METRIC_MAX}
          axes={employee.metrics.map((metric) => ({
            key: metric.id,
            label: metric.shortName,
            value: metric.value,
            valueLabel: String(metric.value),
          }))}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            employee.metrics.length === 0
              ? 'Пока нет метрик — добавьте из набора ниже'
              : `Добавьте ещё ${3 - employee.metrics.length}, чтобы появился радар`
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
        <Typography.Text strong>Добавить метрики</Typography.Text>

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
            placeholder="Базовый набор метрик"
            style={{ flex: 1, minWidth: 0 }}
            size={isMobile ? 'large' : 'middle'}
            value={presetKeys}
            disabled={availablePresets.length === 0}
            options={availablePresets.map((p) => ({
              value: p.key,
              label: p.name,
            }))}
            optionRender={(option) => {
              const preset = METRIC_PRESETS.find((p) => p.key === option.value);
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
            Добавить
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
            placeholder="Своя метрика"
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
            Создать
          </Button>
        </div>
      </div>

      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {employee.metrics.map((metric) => {
          const preset = METRIC_PRESETS.find((p) => p.key === metric.presetKey);
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
                    {metric.name}
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
                    aria-label={`Удалить ${metric.name}`}
                    style={isMobile ? { width: 40, height: 40 } : undefined}
                  />
                </div>

                <Space size="middle" style={{ alignSelf: isMobile ? 'flex-end' : undefined }}>
                  <Button
                    size={isMobile ? 'middle' : 'small'}
                    icon={<MinusOutlined />}
                    disabled={!canDecrease}
                    onClick={() => onChangeValue(metric.id, -1)}
                    aria-label={`Уменьшить ${metric.name}`}
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
                    aria-label={`Увеличить ${metric.name}`}
                    style={isMobile ? { width: 40, height: 40 } : undefined}
                  />
                </Space>
              </div>

              <Input.TextArea
                rows={2}
                placeholder="Комментарий к метрике..."
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
