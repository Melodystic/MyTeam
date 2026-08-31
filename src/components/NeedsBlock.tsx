import { Button, Input, Space, Tooltip, Typography, theme } from 'antd';
import { InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  NEED_KEYS,
  NEED_LABELS,
  NEED_TOOLTIPS,
  getUnusedPercent,
  type Employee,
  type NeedKey,
  type NeedMark,
} from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { NeedsRadarChart } from './NeedsRadarChart';

interface NeedsBlockProps {
  employee: Employee;
  onChangePercent: (need: NeedKey, delta: number) => void;
  onChangeMark: (need: NeedKey, mark: NeedMark) => void;
  onChangeComment: (need: NeedKey, comment: string) => void;
}

const MARK_META: Record<NeedMark, { color: string; label: string; tip: string }> = {
  K: {
    color: '#52c41a',
    label: 'К',
    tip: 'Зелёный — потребность К',
  },
  OT: {
    color: '#ff4d4f',
    label: 'ОТ',
    tip: 'Красный — потребность ОТ',
  },
};

export function NeedsBlock({
  employee,
  onChangePercent,
  onChangeMark,
  onChangeComment,
}: NeedsBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const unused = getUnusedPercent(employee.needs);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          marginBottom: 16,
          gap: 12,
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
        }}
      >
        <Typography.Text type="secondary">
          Распределите 100% между потребностями шагами по 5%
        </Typography.Text>
        <Typography.Text
          strong
          style={{
            padding: '4px 12px',
            borderRadius: token.borderRadius,
            background: unused > 0 ? token.colorWarningBg : token.colorSuccessBg,
            color: unused > 0 ? token.colorWarningText : token.colorSuccessText,
            alignSelf: isMobile ? 'flex-start' : undefined,
          }}
        >
          Неиспользовано: {unused}%
        </Typography.Text>
      </div>

      <NeedsRadarChart needs={employee.needs} />

      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {NEED_KEYS.map((key) => {
          const need = employee.needs[key];
          const mark = MARK_META[need.mark];
          const canIncrease = unused >= 5;
          const canDecrease = need.percent >= 5;

          return (
            <div
              key={key}
              style={{
                padding: isMobile ? 12 : 12,
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
                    gap: 10,
                    minWidth: 0,
                    width: isMobile ? '100%' : undefined,
                  }}
                >
                  <Tooltip title={`${mark.tip}. Нажмите, чтобы переключить.`}>
                    <button
                      type="button"
                      onClick={() => onChangeMark(key, need.mark === 'K' ? 'OT' : 'K')}
                      aria-label={`Индикатор потребности: ${mark.label}`}
                      style={{
                        width: isMobile ? 36 : 28,
                        height: isMobile ? 36 : 28,
                        borderRadius: '50%',
                        border: `2px solid ${mark.color}`,
                        background: mark.color,
                        color: '#fff',
                        fontSize: isMobile ? 11 : 10,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        lineHeight: 1,
                        flexShrink: 0,
                        touchAction: 'manipulation',
                      }}
                    >
                      {mark.label}
                    </button>
                  </Tooltip>
                  <Typography.Text style={{ flex: 1, minWidth: 0 }}>
                    {NEED_LABELS[key]}
                  </Typography.Text>
                  <Tooltip title={NEED_TOOLTIPS[key]} trigger={isMobile ? ['click'] : ['hover']}>
                    <InfoCircleOutlined
                      style={{
                        color: token.colorTextSecondary,
                        fontSize: isMobile ? 18 : 14,
                        padding: isMobile ? 6 : 0,
                        flexShrink: 0,
                      }}
                    />
                  </Tooltip>
                </div>

                <Space size="middle" style={{ alignSelf: isMobile ? 'flex-end' : undefined }}>
                  <Button
                    size={isMobile ? 'middle' : 'small'}
                    icon={<MinusOutlined />}
                    disabled={!canDecrease}
                    onClick={() => onChangePercent(key, -5)}
                    aria-label={`Уменьшить ${NEED_LABELS[key]}`}
                    style={isMobile ? { width: 40, height: 40 } : undefined}
                  />
                  <Typography.Text
                    strong
                    style={{ minWidth: 48, textAlign: 'center', display: 'inline-block' }}
                  >
                    {need.percent}%
                  </Typography.Text>
                  <Button
                    size={isMobile ? 'middle' : 'small'}
                    icon={<PlusOutlined />}
                    disabled={!canIncrease}
                    onClick={() => onChangePercent(key, 5)}
                    aria-label={`Увеличить ${NEED_LABELS[key]}`}
                    style={isMobile ? { width: 40, height: 40 } : undefined}
                  />
                </Space>
              </div>

              <Input.TextArea
                rows={2}
                placeholder="Комментарий к потребности..."
                value={need.comment}
                onChange={(e) => onChangeComment(key, e.target.value)}
              />
            </div>
          );
        })}
      </Space>
    </div>
  );
}
