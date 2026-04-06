import type { BaseEntity, Column } from './types';

interface CardViewProps<T extends BaseEntity> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  onView?: (record: T) => void;
  viewActionLabel?: string;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  emptyMessage?: string;
  rowKey?: keyof T | ((record: T) => string | number);
  theme?: 'light' | 'dark';
}

const CardView = <T extends BaseEntity>({
  data,
  columns,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onView,
  viewActionLabel = 'Ver',
  onEdit,
  onDelete,
  emptyMessage = 'No hay datos disponibles',
  rowKey = 'id',
  theme = 'light',
}: CardViewProps<T>) => {
  const getRowKey = (record: T): string | number => {
    if (typeof rowKey === 'function') return rowKey(record);
    return record[rowKey] as string | number;
  };

  const isRowSelected = (record: T) =>
    selectedRows.some(r => getRowKey(r) === getRowKey(record));

  const handleToggle = (record: T, checked: boolean) => {
    if (!onSelectionChange) return;
    const key = getRowKey(record);
    const next = checked
      ? [...selectedRows, record]
      : selectedRows.filter(r => getRowKey(r) !== key);
    onSelectionChange(next);
  };

  // Determine which columns to show in the card body
  const visibleColumns = (() => {
    const explicitlyVisible = columns.filter(c => c.mobileVisible === true);
    if (explicitlyVisible.length > 0) return explicitlyVisible;
    // Default: first 3 non-title columns
    const titleCol = columns.find(c => c.mobileIsTitle);
    const rest = titleCol ? columns.filter(c => c.key !== titleCol.key) : columns.slice(1);
    return rest.slice(0, 3);
  })();

  // Title column: explicit mobileIsTitle OR first column
  const titleColumn = columns.find(c => c.mobileIsTitle) ?? columns[0];

  const getCellValue = (col: Column<T>, record: T, idx: number) => {
    if (col.render) return col.render(record[col.key as keyof T], record, idx);
    return String(record[col.key as keyof T] ?? '');
  };

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200';
  const titleColor = isDark ? 'text-white' : 'text-gray-900';
  const labelColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const valueColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const dividerColor = isDark ? 'border-gray-600' : 'border-gray-100';

  if (data.length === 0) {
    return (
      <div className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((record, idx) => {
        const selected = isRowSelected(record);
        return (
          <div
            key={getRowKey(record)}
            className={`rounded-xl border shadow-sm transition-shadow hover:shadow-md ${cardBg} ${
              selected ? (isDark ? 'ring-2 ring-blue-400' : 'ring-2 ring-blue-500 border-blue-300') : ''
            }`}
          >
            {/* Card header: checkbox + title value */}
            <div className={`flex items-center gap-3 px-4 py-3 border-b ${dividerColor}`}>
              {selectable && (
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={e => handleToggle(record, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                />
              )}
              <span className={`font-semibold text-sm truncate ${titleColor}`}>
                {titleColumn
                  ? getCellValue(titleColumn, record, idx)
                  : String(getRowKey(record))}
              </span>
            </div>

            {/* Card body: label/value pairs */}
            <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {visibleColumns.map(col => (
                <div key={String(col.key)} className="flex flex-col min-w-0">
                  <span className={`text-xs font-medium uppercase tracking-wide ${labelColor}`}>
                    {col.mobileLabel ?? col.title}
                  </span>
                  <span className={`text-sm mt-0.5 truncate ${valueColor}`}>
                    {getCellValue(col, record, idx)}
                  </span>
                </div>
              ))}
            </div>

            {/* Card footer: actions */}
            {(onView || onEdit || onDelete) && (
              <div className={`flex gap-2 px-4 py-2.5 border-t ${dividerColor}`}>
                {onView && (
                  <button
                    onClick={() => onView(record)}
                    className="flex-1 inline-flex justify-center items-center px-2 py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium transition"
                  >
                    {viewActionLabel}
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(record)}
                    className="flex-1 inline-flex justify-center items-center px-2 py-1.5 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-medium transition"
                  >
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(record)}
                    className="flex-1 inline-flex justify-center items-center px-2 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CardView;
