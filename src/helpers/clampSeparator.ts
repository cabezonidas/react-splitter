/**
 * Delimits the separator position value between 0 to 100 by default.
 * It will prioritize supplied min and max delimiters as long as they are within the 0-100 range.
 * @param props Expects a separator value and optional min and max delimiters
 */
export const clampSeparator = (props: {
  min?: number;
  value: number;
  max?: number;
}) => {
  const { min = 0, value, max = 100 } = props;
  const minValue = Math.max(isNaN(min) ? 0 : min, 0);
  const maxValue = Math.min(isNaN(max) ? 100 : max, 100);
  return Math.min(Math.max(value, minValue), maxValue);
};
