import {Box} from '@mui/material'

import {getBorderPoints} from './helpers'

export const ButtonOutline = ({
  thickness,
  cornerDepth,
}: {thickness: number; cornerDepth?: number}) => {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        clipPath: `polygon(${getBorderPoints({thickness, cornerDepth}).join(', ')})`,
        position: 'absolute',
      }}
    />
  )
}
