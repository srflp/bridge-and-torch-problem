import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const fonts = { mono: `'JetBrains Mono', 'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
});

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  fonts,
  breakpoints,
};

const theme = extendTheme({
  ...config,
  colors: {
    black: '#282a36',
    grey: '#44475a',
  },
  // fonts,
  // breakpoints,
});

export default theme;
