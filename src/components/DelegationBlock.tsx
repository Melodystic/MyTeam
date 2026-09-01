import type { CSSProperties } from 'react';
import { Space, Typography, theme } from 'antd';
import { DELEGATION_DO, DELEGATION_DONT, type SavedNote } from '../types/employee';
import { SavedNotesBlock } from './SavedNotesBlock';
import { useIsMobile } from '../hooks/useBreakpoint';

interface DelegationBlockProps {
  notes: SavedNote[];
  onAdd: (text: string) => void;
  onUpdate: (noteId: string, text: string) => void;
}

function HelpList({ title, items }: { title: string; items: string[] }) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();

  const cardStyle: CSSProperties = {
    padding: isMobile ? 12 : 16,
    borderRadius: token.borderRadiusLG,
    background: token.colorFillAlter,
    border: `1px solid ${token.colorBorderSecondary}`,
    height: '100%',
  };

  return (
    <div style={cardStyle}>
      <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
        {title}
      </Typography.Title>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((item) => (
          <li key={item} style={{ marginBottom: 8 }}>
            <Typography.Text type="secondary">{item}</Typography.Text>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DelegationBlock({ notes, onAdd, onUpdate }: DelegationBlockProps) {
  const isMobile = useIsMobile();

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <SavedNotesBlock
        notes={notes}
        placeholder="Заметки по делегированию..."
        onAdd={onAdd}
        onUpdate={onUpdate}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        <HelpList title="Что делегировать" items={DELEGATION_DO} />
        <HelpList title="Что не делегировать" items={DELEGATION_DONT} />
      </div>
    </Space>
  );
}
