import {Box} from '@mui/material'

type CssSpinnerProps = {
  size?: 'large' | 'small'
  center?: boolean
}

export const CssSpinner = ({
  size = 'large',
  center = false,
}: CssSpinnerProps) => {
  const spinner = (
    <Box
      className={`spinner ${size === 'large' ? 'spinner-large' : 'spinner-small'}`}
      sx={({palette}) => ({'--wr-spinner-color': palette.text.primary})}
    >
      <div className="outer" />
      <div className="inner" />
    </Box>
  )
  return center ? <div className="center">{spinner}</div> : spinner
}
