import { Input } from 'antd';
import { useLocale } from '../context/LocaleContext';

interface NotesBlockProps {
  value: string;
  onChange: (notes: string) => void;
  placeholder?: string;
}

export function NotesBlock({
  value,
  onChange,
  placeholder,
}: NotesBlockProps) {
  const { t } = useLocale();

  return (
    <Input.TextArea
      rows={6}
      placeholder={placeholder ?? t('notes.oneToOnePlaceholder')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
