import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Check, ChevronDown, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FinalHeroDataType, RanksType } from '@/lib/types';
import { AbilityBar } from '@/components/AbilityBar';
import { getRanks } from '@/lib/utils';

const formatPercentage = (value: number) => (value * 100).toFixed(2) + '%';

const getColumnNames = (id: string) => {
  switch (id) {
    case 'name':
      return 'Hero';
    default:
      return id.split('_').join(' ').replace('abilities', ' ');
  }
};

const columns = (
  stats: FinalHeroDataType[]
): ColumnDef<FinalHeroDataType>[] => [
  {
    accessorKey: 'name',
    header: () => <div className={'text-center'}>Hero</div>,
    cell: ({ row }) => (
      <a
        href={'/search#' + row.getValue('name')}
        className="flex flex-col justify-center items-center space-y-2"
      >
        <img
          src={row.original.images.head}
          alt={row.getValue('name')}
          className="h-10 w-10 rounded-full"
        />
        <span>{row.getValue('name')}</span>
      </a>
    ),
  },
  {
    accessorKey: 'win_rate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={
          column.getIsSorted() ? 'bg-primary text-primary-foreground' : ''
        }
      >
        Win Rate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className={'text-center'}>
        {formatPercentage(row.getValue('win_rate'))}
      </div>
    ),
  },
  {
    accessorKey: 'ban_rate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={
          column.getIsSorted() ? 'bg-primary text-primary-foreground' : ''
        }
      >
        Ban Rate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className={'text-center'}>
        {formatPercentage(row.getValue('ban_rate'))}
      </div>
    ),
  },
  {
    accessorKey: 'pick_rate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={
          column.getIsSorted() ? 'bg-primary text-primary-foreground' : ''
        }
      >
        Pick Rate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className={'text-center'}>
        {formatPercentage(row.getValue('pick_rate'))}
      </div>
    ),
  },
  {
    accessorKey: 'speciality',
    header: ({ column }) => {
      const filterValue = column.getFilterValue() as string[] | undefined;
      const isFiltered = filterValue && filterValue.length > 0;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={isFiltered ? 'bg-primary text-primary-foreground' : ''}
            >
              Speciality
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Array.from(new Set(stats.flatMap(hero => hero.speciality))).map(
              tag => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  className="capitalize"
                  checked={
                    (column.getFilterValue() as string[] | undefined)?.includes(
                      tag
                    ) ?? false
                  }
                  onCheckedChange={value => {
                    const filterValue =
                      (column.getFilterValue() as string[] | undefined) ?? [];
                    if (value) {
                      column.setFilterValue([...filterValue, tag]);
                    } else {
                      column.setFilterValue(filterValue.filter(v => v !== tag));
                    }
                  }}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    filterFn: (row, id, value: string[] | undefined) => {
      const rowTags = row.getValue(id) as string[];
      return (
        !value || value.length === 0 || value.some(v => rowTags.includes(v))
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {(row.getValue('speciality') as string[]).filter(Boolean).map(tag => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'abilities.Durability',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={
          column.getIsSorted() ? 'bg-primary text-primary-foreground' : ''
        }
      >
        Durability
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <AbilityBar
        value={Number(row.original.abilities.Durability)}
        label="Durability"
        color="bg-green-500"
      />
    ),
  },
  {
    accessorKey: 'abilities.Offense',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={
          column.getIsSorted() ? 'bg-primary text-primary-foreground' : ''
        }
      >
        Offense
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <AbilityBar
        value={Number(row.original.abilities.Offense)}
        label="Offense"
        color="bg-red-500"
      />
    ),
  },
  {
    accessorKey: 'abilities.Ability Effects',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={
          column.getIsSorted() ? 'bg-primary text-primary-foreground' : ''
        }
      >
        Ability Effects
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <AbilityBar
        value={Number(row.original.abilities['Ability Effects'])}
        label="Ability Effects"
        color="bg-purple-500"
      />
    ),
  },
  {
    accessorKey: 'abilities.Difficulty',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={
          column.getIsSorted() ? 'bg-primary text-primary-foreground' : ''
        }
      >
        Difficulty
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <AbilityBar
        value={Number(row.original.abilities.Difficulty)}
        label="Difficulty"
        color="bg-yellow-500"
      />
    ),
  },
  {
    accessorKey: 'lanes',
    header: ({ column }) => {
      const filterValue = column.getFilterValue() as string[] | undefined;
      const isFiltered = filterValue && filterValue.length > 0;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className={isFiltered ? 'bg-primary text-primary-foreground' : ''}
          >
            <Button variant="ghost">
              Lanes
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Array.from(new Set(stats.flatMap(hero => hero.role))).map(lane => (
              <DropdownMenuCheckboxItem
                key={lane}
                className="capitalize"
                checked={
                  (column.getFilterValue() as string[] | undefined)?.includes(
                    lane
                  ) ?? false
                }
                onCheckedChange={value => {
                  const filterValue =
                    (column.getFilterValue() as string[] | undefined) ?? [];
                  if (value) {
                    column.setFilterValue([...filterValue, lane]);
                  } else {
                    column.setFilterValue(filterValue.filter(v => v !== lane));
                  }
                }}
              >
                {lane}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    filterFn: (row, id, value: string[] | undefined) => {
      const rowLanes = row.getValue(id) as string[];
      return (
        !value || value.length === 0 || value.some(v => rowLanes.includes(v))
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.role.map(lane => {
          if (!lane || lane === ' ' || lane === '') return null;
            return (
              <Badge key={lane} variant="secondary">
                {lane}
              </Badge>
            )
          }
        )}
      </div>
    ),
  },
];

interface StatsTableProps {
  stats: FinalHeroDataType[] | undefined;
  isLoading: boolean;
  error: Error | null;
  currentRank: RanksType;
  setRank: (rank: RanksType) => void;
}

export default function StatsTable({
  stats,
  isLoading,
  error,
  currentRank,
  setRank,
}: StatsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const table = useReactTable({
    data: stats || [],
    columns: columns(stats || []),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  React.useEffect(() => {
    table.setPageSize(rowsPerPage);
  }, [rowsPerPage, table]);

  const rows = table.getRowModel().rows;

  if (error) {
    return (
      <div className="text-red-500 bg-red-100 border border-red-400 rounded-md p-4 my-4">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <Input
          placeholder="Filter heroes..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-700 text-gray-100 hover:bg-gray-600"
              >
                Rank <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-800 text-gray-100"
            >
              {getRanks().map((rank: RanksType) => (
                <DropdownMenuCheckboxItem
                  key={rank}
                  checked={currentRank === rank}
                  onCheckedChange={() => {
                    if (rank !== currentRank) {
                      setRank(rank);
                    }
                  }}
                >
                  {rank}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-700 text-gray-100 hover:bg-gray-600"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-800 text-gray-100"
            >
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(value)}
                  >
                    {getColumnNames(column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-700 text-gray-100 hover:bg-gray-600"
              >
                Show {rowsPerPage} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-800 text-gray-100"
            >
              {[10, 20, 30, 40, 50, 100, 150].map(pageSize => (
                <DropdownMenuItem
                  key={pageSize}
                  onClick={() => setRowsPerPage(pageSize)}
                  className={rowsPerPage === pageSize ? 'bg-gray-700' : ''}
                >
                  <div className="flex w-full justify-between">
                    <span>Show {pageSize}</span>
                    <span>
                      {rowsPerPage === pageSize && (
                        <Check className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border border-gray-700 overflow-hidden">
        <Table className="bg-gray-800 text-gray-100">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="hover:bg-gray-700">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-gray-300">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(10)
                .fill(0)
                .map((_, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-700">
                    {Array(table.getAllColumns().length)
                      .fill(0)
                      .map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-10 w-full" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : rows?.length ? (
              rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-gray-700"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
        <div className="text-sm text-gray-400">
          {isLoading ? (
            <Skeleton className="h-5 w-[250px]" />
          ) : (
            <>
              Showing {table.getState().pagination.pageIndex * rowsPerPage + 1}{' '}
              to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * rowsPerPage,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} entries
            </>
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
            className="bg-gray-700 text-gray-100 hover:bg-gray-600"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
            className="bg-gray-700 text-gray-100 hover:bg-gray-600"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
