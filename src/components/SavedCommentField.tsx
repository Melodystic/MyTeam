import { useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

interface SavedCommentFieldProps {
  value: string;
  saved: boolean;
  placeholder: string;
  emptyText: string;
  saveAria: string;
  editAria: string;
  onSave: (text: string) => void;
}

export function SavedCommentField({
  value,
  saved,
  placeholder,
  emptyText,
  saveAria,
  editAria,
  onSave,
}: SavedCommentFieldProps) {
  const isMobile = useIsMobile();
  const { t } = useLocale();
  const [draft, setDraft] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const isOpen = !saved || editing;
  const text = draft ?? value;

  const close = () => {
    setEditing(false);
    setDraft(null);
  };

  const save = () => {
    onSave(text.trim());
    close();
  };

  if (!isOpen) {
    return (
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Typography.Paragraph
          type={value ? undefined : 'secondary'}
          style={{ margin: 0, whiteSpace: 'pre-wrap' }}
        >
          {value || emptyText}
        </Typography.Paragraph>
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          aria-label={editAria}
          block={isMobile}
          size={isMobile ? 'large' : 'middle'}
        >
          {t('common.edit')}
        </Button>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Input.TextArea
        rows={2}
        placeholder={placeholder}
        value={text}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Space
        direction={isMobile ? 'vertical' : 'horizontal'}
        style={{ width: isMobile ? '100%' : undefined }}
      >
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={save}
          aria-label={saveAria}
          block={isMobile}
          size={isMobile ? 'large' : 'middle'}
        >
          {t('common.save')}
        </Button>
        {saved && (
          <Button
            onClick={close}
            block={isMobile}
            size={isMobile ? 'large' : 'middle'}
          >
            {t('common.cancel')}
          </Button>
        )}
      </Space>
    </Space>
  );
}
