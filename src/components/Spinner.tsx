import {Box, type SxProps, type Theme, keyframes} from '@mui/material'
import {combineSx} from '../theme'

const U = 100 // arbitrary "unit" for SVG coords
const RATIO = 0.6 // inner to outer circle

export type SpinnerProps = {
  size?: number
  thickness?: number
  color?: string
  sx?: SxProps<Theme>
  variant?: 'double' | 'outer' | 'cross'
}

export const Spinner = ({
  thickness = 1,
  size = 24,
  color = 'inherit',
  variant = 'double',
  sx,
}: SpinnerProps) => {
  return (
    <Box
      display="inline-block"
      color={color}
      width={size}
      height={size}
      sx={combineSx(
        {
          '& .outer': {animation: `${spinCW} 1.4s linear infinite`},
          '& .inner': {animation: `${spinCCW} 1.4s linear infinite`},
        },
        sx,
      )}
    >
      <svg
        viewBox={`${U / -2} ${U / -2} ${U} ${U}`}
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <title>loading</title>
        <g className="outer">
          <mask id="outer-mask">
            <rect x="0" y="0" width={U} height={2 * U} fill="white" />
          </mask>
          <circle
            transform={`translate(${-U}, ${-U})`}
            cx={U}
            cy={U}
            r={(U - thickness) / 2}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            vectorEffect="non-scaling-stroke"
            mask="url(#outer-mask)"
          />
        </g>
        {variant === 'double' && (
          <g className="inner">
            <mask id="inner-mask">
              <rect x="0" y="0" width={U} height={2 * U} fill="white" />
            </mask>
            <circle
              transform={`translate(${-U}, ${-U})`}
              cx={U}
              cy={U}
              r={(U * RATIO - thickness) / 2}
              fill="none"
              stroke="currentColor"
              strokeWidth={thickness}
              vectorEffect="non-scaling-stroke"
              mask="url(#inner-mask)"
            />
          </g>
        )}
        {variant === 'cross' && (
          <g transform={`scale(${RATIO * 0.7})`}>
            <line
              x1={-U / 2}
              y1={-U / 2}
              x2={U / 2}
              y2={U / 2}
              stroke="currentColor"
              strokeWidth={thickness}
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={U / 2}
              y1={-U / 2}
              x2={-U / 2}
              y2={U / 2}
              stroke="currentColor"
              strokeWidth={thickness}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
      </svg>
    </Box>
  )
}

const spinCCW = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(-360deg)
  }
`

const spinCW = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`
