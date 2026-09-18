import { useRef, type ChangeEvent } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  App,
  Button,
  Dropdown,
  Layout as AntLayout,
  Segmented,
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
import { useLocale } from '../context/LocaleContext';
import { useEmployees } from '../context/EmployeesContext';
import { useIsMobile } from '../hooks/useBreakpoint';

const { Header, Content } = AntLayout;

export function AppLayout() {
  const { mode, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const { exportDatabase, importDatabase } = useEmployees();
  const { token } = theme.useToken();
  const { message, modal } = App.useApp();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      await exportDatabase();
      message.success(t('layout.exportSuccess'));
    } catch {
      message.error(t('layout.exportError'));
    }
  };

  const handleImportClick = () => {
    modal.confirm({
      title: t('layout.importTitle'),
      content: t('layout.importWarning'),
      okText: t('layout.chooseFile'),
      cancelText: t('common.cancel'),
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
      message.success(t('layout.importSuccess'));
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : t('layout.importError'),
      );
    }
  };

  const themeToggle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <SunOutlined style={{ color: token.colorTextSecondary }} />
      <Switch
        checked={mode === 'dark'}
        onChange={toggleTheme}
        aria-label={t('layout.themeToggle')}
        size={isMobile ? 'small' : 'default'}
      />
      <MoonOutlined style={{ color: token.colorTextSecondary }} />
    </div>
  );

  const languageToggle = (
    <Segmented
      value={locale}
      onChange={setLocale}
      options={[
        { label: 'RU', value: 'ru' },
        { label: 'EN', value: 'en' },
      ]}
      size="small"
      aria-label={t('layout.language')}
    />
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
              {languageToggle}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'export',
                      icon: <DownloadOutlined />,
                      label: t('layout.export'),
                      onClick: () => void handleExport(),
                    },
                    {
                      key: 'import',
                      icon: <UploadOutlined />,
                      label: t('layout.import'),
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
                  aria-label={t('layout.menu')}
                  style={{ width: 40, height: 40 }}
                />
              </Dropdown>
            </>
          ) : (
            <>
              <Button icon={<DownloadOutlined />} onClick={() => void handleExport()}>
                {t('layout.export')}
              </Button>
              <Button icon={<UploadOutlined />} onClick={handleImportClick}>
                {t('layout.import')}
              </Button>
              {themeToggle}
              {languageToggle}
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
