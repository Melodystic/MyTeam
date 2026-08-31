import { useRef, type ChangeEvent } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  App,
  Button,
  Dropdown,
  Layout as AntLayout,
  Space,
  Switch,
  Typography,
  theme,
} from 'antd';
import {
  DownloadOutlined,
  MoreOutlined,
  MoonOutlined,
  SunOutlined,
  TeamOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';
import { useEmployees } from '../context/EmployeesContext';
import { useIsMobile } from '../hooks/useBreakpoint';

const { Header, Content } = AntLayout;

export function AppLayout() {
  const { mode, toggleTheme } = useTheme();
  const { exportDatabase, importDatabase } = useEmployees();
  const { token } = theme.useToken();
  const { message, modal } = App.useApp();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      await exportDatabase();
      message.success('База выгружена в JSON-файл');
    } catch {
      message.error('Не удалось выгрузить базу');
    }
  };

  const handleImportClick = () => {
    modal.confirm({
      title: 'Загрузить базу из файла?',
      content:
        'Текущие данные в этом браузере будут полностью заменены содержимым файла резервной копии.',
      okText: 'Выбрать файл',
      cancelText: 'Отмена',
      onOk: () => {
        fileInputRef.current?.click();
      },
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      await importDatabase(file);
      message.success('База успешно загружена');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Не удалось загрузить базу');
    }
  };

  const themeToggle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <SunOutlined style={{ color: token.colorTextSecondary }} />
      <Switch
        checked={mode === 'dark'}
        onChange={toggleTheme}
        aria-label="Переключить тему"
        size={isMobile ? 'small' : 'default'}
      />
      <MoonOutlined style={{ color: token.colorTextSecondary }} />
    </div>
  );

  return (
    <AntLayout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <Header
        className="app-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          padding: isMobile ? '0 12px' : '0 24px',
          paddingTop: 'env(safe-area-inset-top)',
          height: 'auto',
          minHeight: 56,
          lineHeight: 'normal',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: 8,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            color: token.colorText,
            minWidth: 0,
            flexShrink: 1,
          }}
        >
          <TeamOutlined style={{ fontSize: 22, color: token.colorPrimary, flexShrink: 0 }} />
          <Typography.Title
            level={4}
            style={{ margin: 0, fontSize: isMobile ? 16 : undefined, whiteSpace: 'nowrap' }}
          >
            MyTeam
          </Typography.Title>
        </Link>

        <Space size={isMobile ? 'small' : 'middle'} style={{ flexShrink: 0 }}>
          {isMobile ? (
            <>
              {themeToggle}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'export',
                      icon: <DownloadOutlined />,
                      label: 'Сохранить базу',
                      onClick: () => void handleExport(),
                    },
                    {
                      key: 'import',
                      icon: <UploadOutlined />,
                      label: 'Загрузить базу',
                      onClick: handleImportClick,
                    },
                  ],
                }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  aria-label="Меню"
                  style={{ width: 40, height: 40 }}
                />
              </Dropdown>
            </>
          ) : (
            <>
              <Button icon={<DownloadOutlined />} onClick={() => void handleExport()}>
                Сохранить базу
              </Button>
              <Button icon={<UploadOutlined />} onClick={handleImportClick}>
                Загрузить базу
              </Button>
              {themeToggle}
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => void handleFileChange(e)}
          />
        </Space>
      </Header>

      <Content
        className="app-content"
        style={{
          padding: isMobile ? '16px 12px' : '24px',
          paddingBottom: isMobile
            ? 'calc(16px + env(safe-area-inset-bottom))'
            : 24,
          maxWidth: 1280,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Outlet />
      </Content>
    </AntLayout>
  );
}
