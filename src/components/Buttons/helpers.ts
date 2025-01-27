type GetBorderPointsProps = {
  cornerDepth?: number
  thickness: number
}

export const getBorderPoints = ({
  cornerDepth = 16,
  thickness,
}: GetBorderPointsProps): string[] => {
  let offset = thickness / Math.tan(67.5 * (Math.PI / 180))

  // The delta is a magic coefficient that increases the offset for the diagonal line
  // to make its appearance uniform with straight lines.
  // (2x for 1px, circa 1.56x for 2px, circa 1.36x for 3px, 1.25x for 4px, etc.)
  // See: https://www.wolframalpha.com/input?i=plot+9%2F%28x%5E2%2B4*x%2B4%29%2B1+between+0+and+10
  const delta = 9 / (thickness ** 2 + 4 * thickness + 4) + 1

  offset *= delta

  return [
    '0 0',
    '100% 0',
    `100% calc(100% - ${cornerDepth}px)`,
    `calc(100% - ${cornerDepth}px) 100%`,
    '0 100%',
    `0 calc(100% - ${thickness}px)`,
    `calc(100% - ${cornerDepth + offset}px) calc(100% - ${thickness}px)`,
    `calc(100% - ${thickness}px) calc(100% - ${cornerDepth + offset}px)`,
    `calc(100% - ${thickness}px) ${thickness}px`,
    `${thickness}px ${thickness}px`,
    `${thickness}px 100%`,
    '0 100%',
  ]
}
