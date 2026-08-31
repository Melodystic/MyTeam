import { Grid } from 'antd';

/** true for phone-sized screens (< md / 768px) */
export function useIsMobile() {
  const screens = Grid.useBreakpoint();
  return !screens.md;
}

/** true for phone and small tablet (< lg / 992px) */
export function useIsCompact() {
  const screens = Grid.useBreakpoint();
  return !screens.lg;
}
