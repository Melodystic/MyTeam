import { Input } from 'antd';

interface NotesBlockProps {
  value: string;
  onChange: (notes: string) => void;
  placeholder?: string;
}

export function NotesBlock({
  value,
  onChange,
  placeholder = 'Запишите итоги и договорённости после one-to-one...',
}: NotesBlockProps) {
  return (
    <Input.TextArea
      rows={6}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
