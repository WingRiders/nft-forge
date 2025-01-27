'use client'

import {
  type PaletteOptions,
  type SxProps,
  type Theme,
  alpha,
  createTheme,
} from '@mui/material'

const COLORS = {
  success: {
    greenMatrixLight: '#00E68C',
    greenMatrix: '#05BF75',
  },
  system: {
    blue: '#276EF1',
    blueDark: '#0F2D65',
    green: '#099953',
    greenDark: '#0F4B30',
    yellow: '#FCBB3A',
    yellowDark: '#674C19',
    red: '#E32209',
    redDark: '#5C0F06',
    redError: '#4E0505',
  },
  neutral: {
    gray0: '#FFFFFF',
    gray0_1: '#FAFAFA',
    gray1: '#F5F5F5',
    gray2: '#D9D9D9',
    gray3: '#8C8C8C',
    gray4: '#595959',
    gray5: '#262626',
    gray6: '#151918',
    gray7: '#000000',
  },
}

declare module '@mui/material/styles' {
  interface Border {
    default: string
    paper: string
    annotation: string
    divider: string
    faint: string
    glass: string
    contrast: string
    selected: string
    container: string
  }
  interface Gradient {
    success: string
    error: string
    selected: string
  }
  interface Shadow {
    pagePaper: string
  }
  interface ButtonColors {
    content: string
    background: string
    border: string
  }
  interface ButtonStatesColors {
    normal: ButtonColors
    hover: ButtonColors
    disabled: ButtonColors
  }
  interface Button {
    primary: ButtonStatesColors
    secondary: ButtonStatesColors
    error: ButtonStatesColors
  }
  interface IconButton {
    default: ButtonStatesColors
    brand: ButtonStatesColors
    secondary: ButtonStatesColors
    plain: ButtonStatesColors
  }
  interface TextButton {
    primary: ButtonStatesColors
    secondary: ButtonStatesColors
    brand: ButtonStatesColors
  }
  interface TooltipColors {
    title: string
    text: string
    background: string
  }
  interface Tooltip {
    black: TooltipColors
    gray: TooltipColors
    brand: TooltipColors
    warning: TooltipColors
  }
  interface PaletteOptions {
    border: Border
    gradient: Gradient
    shadow: Shadow
    button: Button
    iconButton: IconButton
    textButton: TextButton
    tooltip: Tooltip
    logo: string
    chartSeries: string[]
  }
  interface Palette {
    border: Border
    gradient: Gradient
    shadow: Shadow
    button: Button
    iconButton: IconButton
    textButton: TextButton
    tooltip: Tooltip
    logo: string
    chartSeries: string[]
  }
  interface TypeText {
    subtitle: string
    dark: string
    highlight: string
    tab: string
    onHighlight: string
  }
  interface TypeBackground {
    body: string
    pagePaper: string
    annotation: string
    dark: string
    light: string
    glass: string
    primaryGlass: string
    disabled: string
    elementDisabled: string
    modal: string
    scrollbar: string
  }

  interface PaletteColor {
    highlight?: string
    darkest?: string
  }
  interface SimplePaletteColorOptions {
    highlight?: string
    darkest?: string
  }
}

const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    contrastText: COLORS.neutral.gray7,
    main: COLORS.neutral.gray0,
    darkest: COLORS.neutral.gray2,
    dark: COLORS.neutral.gray1,
    highlight: COLORS.neutral.gray2,
  },
  secondary: {
    main: COLORS.neutral.gray3,
  },
  background: {
    body: COLORS.neutral.gray7,
    default: alpha(COLORS.neutral.gray0, 0.05),
    paper: COLORS.neutral.gray6,
    pagePaper: COLORS.neutral.gray7,
    annotation: COLORS.neutral.gray4,
    dark: COLORS.neutral.gray5,
    light: COLORS.neutral.gray3,
    glass: alpha(COLORS.neutral.gray0, 0.1),
    primaryGlass: alpha(COLORS.neutral.gray0, 0.2),
    disabled: alpha(COLORS.neutral.gray0, 0.24),
    elementDisabled: COLORS.neutral.gray4,
    modal: COLORS.neutral.gray7,
    scrollbar: alpha(COLORS.neutral.gray0, 0.4),
  },
  button: {
    primary: {
      normal: {
        background: COLORS.neutral.gray1,
        border: COLORS.neutral.gray0,
        content: COLORS.neutral.gray7,
      },
      hover: {
        background: alpha(COLORS.neutral.gray3, 0.8),
        border: alpha(COLORS.neutral.gray3, 0.8),
        content: COLORS.neutral.gray0,
      },
      disabled: {
        background: 'transparent',
        border: COLORS.neutral.gray3,
        content: COLORS.neutral.gray3,
      },
    },
    secondary: {
      normal: {
        background: alpha(COLORS.neutral.gray0, 0.15),
        border: COLORS.neutral.gray0,
        content: COLORS.neutral.gray0,
      },
      hover: {
        background: alpha(COLORS.neutral.gray0, 0.3),
        border: COLORS.neutral.gray1,
        content: COLORS.neutral.gray1,
      },
      disabled: {
        background: 'transparent',
        border: COLORS.neutral.gray3,
        content: COLORS.neutral.gray3,
      },
    },
    error: {
      normal: {
        background: alpha(COLORS.system.red, 0.15),
        border: COLORS.system.red,
        content: COLORS.system.red,
      },
      hover: {
        background: alpha(COLORS.system.red, 0.3),
        border: COLORS.system.red,
        content: COLORS.system.red,
      },
      disabled: {
        background: 'transparent',
        border: COLORS.neutral.gray3,
        content: COLORS.neutral.gray3,
      },
    },
  },
  iconButton: {
    default: {
      normal: {
        background: COLORS.neutral.gray4,
        border: 'transparent',
        content: COLORS.neutral.gray0,
      },
      hover: {
        background: COLORS.neutral.gray2,
        border: 'transparent',
        content: COLORS.neutral.gray7,
      },
      disabled: {
        background: COLORS.neutral.gray6,
        border: 'transparent',
        content: alpha(COLORS.neutral.gray0, 0.4),
      },
    },
    brand: {
      normal: {
        background: COLORS.neutral.gray0,
        border: 'transparent',
        content: COLORS.neutral.gray7,
      },
      hover: {
        background: COLORS.neutral.gray3,
        border: 'transparent',
        content: COLORS.neutral.gray5,
      },
      disabled: {
        background: COLORS.neutral.gray6,
        border: 'transparent',
        content: alpha(COLORS.neutral.gray0, 0.4),
      },
    },
    secondary: {
      normal: {
        background: 'transparent',
        border: COLORS.neutral.gray0,
        content: COLORS.neutral.gray0,
      },
      hover: {
        background: COLORS.neutral.gray0,
        border: COLORS.neutral.gray0,
        content: COLORS.neutral.gray7,
      },
      disabled: {
        background: 'transparent',
        border: alpha(COLORS.neutral.gray0, 0.4),
        content: alpha(COLORS.neutral.gray0, 0.4),
      },
    },
    plain: {
      normal: {
        background: 'transparent',
        border: 'transparent',
        content: COLORS.neutral.gray0,
      },
      hover: {
        background: 'transparent',
        border: 'transparent',
        content: COLORS.neutral.gray2,
      },
      disabled: {
        background: 'transparent',
        border: 'transparent',
        content: alpha(COLORS.neutral.gray0, 0.4),
      },
    },
  },
  textButton: {
    primary: {
      normal: {
        background: 'transparent',
        border: 'transparent',
        content: COLORS.neutral.gray0,
      },
      hover: {
        background: 'transparent',
        border: 'transparent',
        content: COLORS.neutral.gray2,
      },
      disabled: {
        background: 'transparent',
        border: 'transparent',
        content: alpha(COLORS.neutral.gray0, 0.4),
      },
    },
    secondary: {
      normal: {
        background: 'transparent',
        border: 'transparent',
        content: alpha(COLORS.neutral.gray0, 0.8),
      },
      hover: {
        background: 'transparent',
        border: 'transparent',
        content: COLORS.neutral.gray0,
      },
      disabled: {
        background: 'transparent',
        border: 'transparent',
        content: alpha(COLORS.neutral.gray0, 0.4),
      },
    },
    brand: {
      normal: {
        background: 'transparent',
        border: 'transparent',
        content: COLORS.neutral.gray0,
      },
      hover: {
        background: 'transparent',
        border: 'transparent',
        content: COLORS.neutral.gray2,
      },
      disabled: {
        background: 'transparent',
        border: 'transparent',
        content: alpha(COLORS.neutral.gray0, 0.4),
      },
    },
  },
  tooltip: {
    black: {
      title: COLORS.neutral.gray0,
      text: COLORS.neutral.gray2,
      background: COLORS.neutral.gray7,
    },
    gray: {
      title: COLORS.neutral.gray0,
      text: COLORS.neutral.gray2,
      background: COLORS.neutral.gray6,
    },
    brand: {
      title: COLORS.neutral.gray0,
      text: COLORS.neutral.gray2,
      background: COLORS.neutral.gray7,
    },
    warning: {
      title: COLORS.neutral.gray7,
      text: COLORS.neutral.gray7,
      background: COLORS.system.yellow,
    },
  },
  border: {
    default: COLORS.neutral.gray7,
    paper: COLORS.neutral.gray6,
    annotation: COLORS.neutral.gray4,
    divider: COLORS.neutral.gray5,
    faint: COLORS.neutral.gray3,
    glass: alpha(COLORS.neutral.gray0, 0.1),
    contrast: COLORS.neutral.gray0,
    selected: COLORS.neutral.gray0,
    container: alpha(COLORS.neutral.gray0, 0.1),
  },
  gradient: {
    success: `linear-gradient(90deg, ${alpha(COLORS.neutral.gray0, 0.1)}, ${
      COLORS.neutral.gray2
    } 50%, ${alpha(COLORS.neutral.gray0, 0.1)}) 100%`,
    error: `linear-gradient(90deg, ${alpha(COLORS.neutral.gray0, 0.1)}, ${
      COLORS.system.red
    } 50%, ${alpha(COLORS.neutral.gray0, 0.1)}) 100%`,
    selected: `linear-gradient(90deg, ${alpha(COLORS.neutral.gray0, 0.12)} 0.43%, ${alpha(
      COLORS.neutral.gray0,
      0.12,
    )} 52.09%, ${alpha(COLORS.neutral.gray0, 0.12)} 99.61%)`,
  },
  shadow: {
    pagePaper: `0px 0px 200px 57px ${alpha(COLORS.neutral.gray0, 0.1)}`,
  },
  text: {
    disabled: alpha(COLORS.neutral.gray0, 0.4),
    secondary: alpha(COLORS.neutral.gray0, 0.6),
    primary: COLORS.neutral.gray0,
    subtitle: COLORS.neutral.gray2,
    dark: COLORS.neutral.gray5,
    highlight: COLORS.neutral.gray0,
    onHighlight: COLORS.neutral.gray7,
    tab: COLORS.neutral.gray0,
  },
  logo: COLORS.neutral.gray0,
  success: {
    main: COLORS.success.greenMatrix,
    light: COLORS.success.greenMatrixLight,
    contrastText: COLORS.neutral.gray0,
  },
  info: {
    main: COLORS.system.blue,
    contrastText: COLORS.neutral.gray0,
  },
  error: {
    main: COLORS.system.red,
    darkest: COLORS.system.redError,
    contrastText: COLORS.neutral.gray0,
  },
  warning: {
    main: COLORS.system.yellow,
    darkest: COLORS.system.yellowDark,
    contrastText: COLORS.neutral.gray7,
  },
  chartSeries: [
    '#7ad151',
    '#22a884',
    '#fde725',
    '#2a788e',
    '#414487',
    '#440154',
  ],
}

export const theme = createTheme({
  palette: darkPalette,
  typography: {
    fontFamily: 'Chakra Petch',
    body1: {
      fontSize: '0.9375rem', // 15px
      lineHeight: '1.125rem', // 18px
    },
    button: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.35rem', // 21.6px
    },
  },
  spacing: 4,
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0,0,0,0.7)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // Works on Firefox
          scrollbarColor: `${darkPalette.background?.scrollbar} transparent`,
          scrollBarWidth: 'thin',
          // Works on Chrome, Edge, and Safari
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            background: darkPalette.background?.scrollbar,
            borderRadius: 0,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1030,
      lg: 1260,
      xl: 1536,
    },
  },
})

export const combineSx = (
  ...sxs: Array<SxProps<Theme> | false | undefined>
): SxProps<Theme> =>
  sxs.flatMap((sx) => (!sx ? [] : Array.isArray(sx) ? sx : [sx]))
