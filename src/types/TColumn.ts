export type TColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  hideable?: boolean;
  minWidth?: number;
  tooltip?: boolean;
  tooltipValue?: (row: T) => string;
}
