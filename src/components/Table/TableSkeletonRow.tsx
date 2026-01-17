import { TableCell, TableRow } from '../ui/table'

export default function TableSkeletonRow({ columns }: { columns: number }) {
    return (
        <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
                <TableCell key={i}>
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                </TableCell>
            ))}
            <TableCell>
                <div className="h-4 w-6 animate-pulse rounded bg-gray-200" />
            </TableCell>
        </TableRow>
    )
}
