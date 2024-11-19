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
import { cn, getRanks } from '@/lib/utils';

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
        className={cn(
          'text-violet-100 hover:bg-violet-900/50',
          column.getIsSorted() && 'bg-violet-900/50'
        )}
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
        className={cn(
          'text-violet-100 hover:bg-violet-900/50',
          column.getIsSorted() && 'bg-violet-900/50'
        )}
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
        className={cn(
          'text-violet-100 hover:bg-violet-900/50',
          column.getIsSorted() && 'bg-violet-900/50'
        )}
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
              className={cn(
                'text-violet-100 hover:bg-violet-900/50',
                isFiltered && 'bg-violet-900/50'
              )}
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
          <Badge
            key={tag}
            variant="secondary"
            className="px-2 py-0.5 text-xs font-medium bg-blue-900 text-neutral-300 cursor-default"
          >
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
        className={cn(
          'text-violet-100 hover:bg-violet-900/50',
          column.getIsSorted() && 'bg-violet-900/50'
        )}
      >
        Durability
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <AbilityBar
        value={Number(row.original.abilities.Durability)}
        label="Durability"
      />
    ),
  },
  {
    accessorKey: 'abilities.Offense',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={cn(
          'text-violet-100 hover:bg-violet-900/50',
          column.getIsSorted() && 'bg-violet-900/50'
        )}
      >
        Offense
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <AbilityBar
        value={Number(row.original.abilities.Offense)}
        label="Offense"
      />
    ),
  },
  {
    accessorKey: 'abilities.Ability Effects',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={cn(
          'text-violet-100 hover:bg-violet-900/50',
          column.getIsSorted() && 'bg-violet-900/50'
        )}
      >
        Ability Effects
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <AbilityBar
        value={Number(row.original.abilities['Ability Effects'])}
        label="Ability Effects"
      />
    ),
  },
  {
    accessorKey: 'abilities.Difficulty',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={cn(
          'text-violet-100 hover:bg-violet-900/50',
          column.getIsSorted() && 'bg-violet-900/50'
        )}
      >
        Difficulty
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <AbilityBar
        value={Number(row.original.abilities.Difficulty)}
        label="Difficulty"
      />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      const filterValue = column.getFilterValue() as string[] | undefined;
      const isFiltered = filterValue && filterValue.length > 0;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className={cn(
              'text-violet-100 hover:bg-violet-900/50',
              isFiltered && 'bg-violet-900/50'
            )}
          >
            <Button variant="ghost">
              Lanes
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Array.from(new Set(stats.flatMap(hero => hero.role))).map(
              lane =>
                lane &&
                lane !== ' ' &&
                lane !== '' && (
                  <DropdownMenuCheckboxItem
                    key={lane}
                    className="capitalize"
                    checked={
                      (
                        column.getFilterValue() as string[] | undefined
                      )?.includes(lane) ?? false
                    }
                    onCheckedChange={value => {
                      const filterValue =
                        (column.getFilterValue() as string[] | undefined) ?? [];
                      if (value) {
                        column.setFilterValue([...filterValue, lane]);
                      } else {
                        column.setFilterValue(
                          filterValue.filter(v => v !== lane)
                        );
                      }
                    }}
                  >
                    {lane}
                  </DropdownMenuCheckboxItem>
                )
            )}
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
        {(row.original.role || []).map(lane => {
          if (!lane || lane === ' ' || lane === '') return null;
          return (
            <Badge
              key={lane}
              variant="secondary"
              className="px-2 py-0.5 text-xs font-medium bg-green-800 text-neutral-300 cursor-default"
            >
              {lane}
            </Badge>
          );
        })}
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
      <div className="text-red-400 bg-red-950/50 backdrop-blur-sm border border-red-500/20 rounded-md p-4 my-4">
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
          className="max-w-sm bg-violet-950/50 border-violet-500/20 text-violet-100 placeholder:text-violet-400/70"
        />
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-between bg-violet-950/50 border-violet-500/20 text-violet-100 hover:bg-violet-900/50 hover:border-violet-500/40"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-violet-300">Rank:</span>
                  <span className="text-violet-100">{currentRank}</span>
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[200px] bg-gray-900/95 backdrop-blur-sm border-violet-500/20"
            >
              {getRanks().map(rank => (
                <DropdownMenuItem
                  key={rank}
                  onSelect={() => setRank(rank)}
                  className="flex items-center justify-between py-2 px-4 hover:bg-violet-950/50 cursor-pointer text-violet-100"
                >
                  {rank}
                  {currentRank === rank && (
                    <Check className="h-4 w-4 text-violet-400" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-violet-950/50 border-violet-500/20 text-violet-100 hover:bg-violet-900/50 hover:border-violet-500/40"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-900/95 backdrop-blur-sm border-violet-500/20"
            >
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-violet-100 hover:bg-violet-950/50"
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
                className="bg-violet-950/50 border-violet-500/20 text-violet-100 hover:bg-violet-900/50 hover:border-violet-500/40"
              >
                Show {rowsPerPage} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-900/95 backdrop-blur-sm border-violet-500/20"
            >
              {[10, 20, 30, 40, 50, 100, 150].map(pageSize => (
                <DropdownMenuItem
                  key={pageSize}
                  onClick={() => setRowsPerPage(pageSize)}
                  className={cn(
                    'text-violet-100 hover:bg-violet-950/50',
                    rowsPerPage === pageSize && 'bg-violet-950/50'
                  )}
                >
                  <div className="flex w-full justify-between">
                    <span>Show {pageSize}</span>
                    {rowsPerPage === pageSize && (
                      <Check className="h-4 w-4 text-violet-400" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border border-violet-500/20 overflow-hidden">
        <Table className="bg-gray-900/80 backdrop-blur-sm">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-violet-950/50 border-b border-violet-500/20"
              >
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-violet-300">
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
                  <TableRow
                    key={rowIndex}
                    className="hover:bg-violet-950/50 border-b border-violet-500/10"
                  >
                    {Array(table.getAllColumns().length)
                      .fill(0)
                      .map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-10 w-full bg-violet-950/50" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : rows?.length ? (
              rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-violet-950/50 border-b border-violet-500/10"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="text-violet-100">
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
                  className="h-24 text-center text-violet-300"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
        <div className="text-sm text-violet-400">
          {isLoading ? (
            <Skeleton className="h-5 w-[250px] bg-violet-950/50" />
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
            className="bg-violet-950/50 border-violet-500/20 text-violet-100 hover:bg-violet-900/50 hover:border-violet-500/40 disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
            className="bg-violet-950/50 border-violet-500/20 text-violet-100 hover:bg-violet-900/50 hover:border-violet-500/40 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
