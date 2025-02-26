import {
  Skeleton as MuiSkeleton,
  type SkeletonProps as MuiSkeletonProps,
  alpha,
  styled,
} from '@mui/material'

const StyledSkeleton = styled(MuiSkeleton, {
  shouldForwardProp: (prop) => prop !== 'transparentBackground',
})<{transparentBackground?: boolean}>(
  ({theme: {palette}, transparentBackground}) => {
    const backgroundColor = transparentBackground
      ? 'transparent'
      : alpha(palette.background.body, 0.5)
    const highlightColor = alpha(palette.primary.main, 0.2)

    return {
      background: backgroundColor,
      '&::after': {
        background: `linear-gradient(90deg, transparent, ${highlightColor}, transparent)`,
      },
    }
  },
)

export type SkeletonProps = MuiSkeletonProps & {
  if?: boolean
  fullWidth?: boolean
  transparentBackground?: boolean
}

export const Skeleton = ({
  if: cond,
  fullWidth,
  children: childrenProp,
  transparentBackground,
  ...props
}: SkeletonProps) => {
  const children =
    typeof childrenProp === 'string' || typeof childrenProp === 'number' ? (
      <span>{childrenProp}</span>
    ) : (
      childrenProp
    )

  return cond ? (
    <StyledSkeleton
      variant="rectangular"
      animation="wave"
      width={fullWidth ? '100%' : undefined}
      transparentBackground={transparentBackground}
      {...props}
    >
      {children}
    </StyledSkeleton>
  ) : (
    <>{children}</>
  )
}
