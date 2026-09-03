import { Button, Input, Space, Tooltip, Typography, theme } from 'antd';
import { InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  NEED_KEYS,
  NEED_LABELS,
  NEED_MAX,
  NEED_TOOLTIPS,
  type Employee,
  type NeedKey,
  type NeedMark,
} from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { NeedsRadarChart } from './NeedsRadarChart';

interface NeedsBlockProps {
  employee: Employee;
  onChangeScore: (need: NeedKey, delta: number) => void;
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
  onChangeScore,
  onChangeMark,
  onChangeComment,
}: NeedsBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();

  return (
    <div>
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Оцените каждую потребность по шкале 0–{NEED_MAX}
      </Typography.Text>

      <NeedsRadarChart needs={employee.needs} />

      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {NEED_KEYS.map((key) => {
          const need = employee.needs[key];
          const mark = MARK_META[need.mark];
          const canIncrease = need.score < NEED_MAX;
          const canDecrease = need.score > 0;

          return (
            <div
              key={key}
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
                    onClick={() => onChangeScore(key, -1)}
                    aria-label={`Уменьшить ${NEED_LABELS[key]}`}
                    style={isMobile ? { width: 40, height: 40 } : undefined}
                  />
                  <Typography.Text
                    strong
                    style={{ minWidth: 36, textAlign: 'center', display: 'inline-block' }}
                  >
                    {need.score}
                  </Typography.Text>
                  <Button
                    size={isMobile ? 'middle' : 'small'}
                    icon={<PlusOutlined />}
                    disabled={!canIncrease}
                    onClick={() => onChangeScore(key, 1)}
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
