'use client'

import * as React from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, Check, ChevronDown, Filter, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {Skeleton} from "@/components/ui/skeleton";
import {StatsTableType} from "@/lib/types";

const AbilityBar = ({ value, label, color = "bg-blue-500" }: { value: number; label: string; color?: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-2">
            <div className="w-full bg-gray-700 rounded-full h-2.5 relative overflow-hidden">
              <div
                  className={`${color} h-2.5 rounded-full transition-all duration-300 ease-in-out`}
                  style={{ width: `${value}%` }}
              />
              {value}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}: {value}/100</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
)

const formatPercentage = (value: number) => (value * 100).toFixed(2) + '%'

const columns = (stats: StatsTableType[]): ColumnDef<StatsTableType>[] => [
  {
    accessorKey: "name",
    header: () => <div className={"text-center"}>Hero</div>,
    cell: ({ row }) => (
        <div className="flex flex-col justify-center items-center space-y-2">
          <img
              src={row.original.head}
              alt={row.getValue("name")}
              className="h-10 w-10 rounded-full"
          />
          <span>{row.getValue("name")}</span>
        </div>
    ),
  },
  {
    accessorKey: "win_rate",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Win Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <div className={"text-center"}>{formatPercentage(row.getValue("win_rate"))}</div>,
  },
  {
    accessorKey: "ban_rate",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ban Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <div className={"text-center"}>{formatPercentage(row.getValue("ban_rate"))}</div>,
  },
  {
    accessorKey: "pick_rate",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pick Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <div className={"text-center"}>{formatPercentage(row.getValue("pick_rate"))}</div>,
  },
  {
    accessorKey: "speciality",
    header: ({ column }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              Speciality
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Array.from(new Set(stats.flatMap(hero => hero.speciality))).map((tag) => (
                <DropdownMenuCheckboxItem
                    key={tag}
                    className="capitalize"
                    checked={(column.getFilterValue() as string[] | undefined)?.includes(tag) ?? false}
                    onCheckedChange={(value) => {
                      const filterValue = (column.getFilterValue() as string[] | undefined) ?? []
                      if (value) {
                        column.setFilterValue([...filterValue, tag])
                      } else {
                        column.setFilterValue(filterValue.filter((v) => v !== tag))
                      }
                    }}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
    ),
    filterFn: (row, id, value: string[] | undefined) => {
      const rowTags = row.getValue(id) as string[]
      return !value || value.length === 0 || value.some(v => rowTags.includes(v))
    },
    cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.getValue("speciality") as string[]).filter(Boolean).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
          ))}
        </div>
    ),
  },
  {
    accessorKey: "abilities.Durability",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Durability
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => (
        <AbilityBar
            value={row.original.abilities.Durability}
            label="Durability"
            color="bg-green-500"
        />
    ),
  },
  {
    accessorKey: "abilities.Offense",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Offense
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => (
        <AbilityBar
            value={row.original.abilities.Offense}
            label="Offense"
            color="bg-red-500"
        />
    ),
  },
  {
    accessorKey: "abilities.Ability Effects",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ability Effects
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => (
        <AbilityBar
            value={row.original.abilities["Ability Effects"]}
            label="Ability Effects"
            color="bg-purple-500"
        />
    ),
  },
  {
    accessorKey: "abilities.Difficulty",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Difficulty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => (
        <AbilityBar
            value={row.original.abilities.Difficulty}
            label="Difficulty"
            color="bg-yellow-500"
        />
    ),
  },
  {
    accessorKey: "lanes",
    header: ({ column }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              Lanes
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Array.from(new Set(stats.flatMap(hero => hero.lanes))).map((lane) => (
                <DropdownMenuCheckboxItem
                    key={lane}
                    className="capitalize"
                    checked={(column.getFilterValue() as string[] | undefined)?.includes(lane) ?? false}
                    onCheckedChange={(value) => {
                      const filterValue = (column.getFilterValue() as string[] | undefined) ?? []
                      if (value) {
                        column.setFilterValue([...filterValue, lane])
                      } else {
                        column.setFilterValue(filterValue.filter((v) => v !== lane))
                      }
                    }}
                >
                  {lane}
                </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
    ),
    filterFn: (row, id, value: string[] | undefined) => {
      const rowLanes = row.getValue(id) as string[]
      return !value || value.length === 0 || value.some(v => rowLanes.includes(v))
    },
    cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.lanes.map((lane) => (
              <Badge key={lane} variant="secondary">
                {lane}
              </Badge>
          ))}
        </div>
    ),
  },
]

interface StatsTableProps {
  stats: StatsTableType[] | undefined,
  isLoading: boolean,
  error: Error | null
}

export default function StatsTable({ stats, isLoading, error }: StatsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowsPerPage, setRowsPerPage] = React.useState(50)

  const table = useReactTable({
    data: stats || [],
    columns: stats ? columns(stats) : [],
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
  })


  React.useEffect(() => {
    table.setPageSize(rowsPerPage)
  }, [rowsPerPage, table])

  const rows = table.getRowModel().rows

  if (isLoading) {
    return (
        <div className="w-full space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-[250px]"/> {/* Search input skeleton */}
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-[100px]"/> {/* Columns button skeleton */}
              <Skeleton className="h-10 w-[100px]"/> {/* Show rows button skeleton */}
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array(9).fill(0).map((_, index) => (
                      <TableHead key={index}>
                        <Skeleton className="h-8 w-full"/>
                      </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(10).fill(0).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array(9).fill(0).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-10 w-full"/>
                          </TableCell>
                      ))}
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-[250px]"/> {/* Pagination info skeleton */}
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-[80px]"/> {/* Previous button skeleton */}
              <Skeleton className="h-8 w-[80px]"/> {/* Next button skeleton */}
            </div>
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="text-red-500 bg-red-100 border border-red-400 rounded-md p-4 my-4">
          Error: {error.message}
        </div>
    )
  }

  if (!stats) {
    return (
        <div className="text-gray-500 bg-gray-100 border border-gray-400 rounded-md p-4 my-4">
          No data available
        </div>
    )
  }

  return (
      <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <Input
              placeholder="Filter heroes..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
          />
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-700 text-gray-100 hover:bg-gray-600">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100">
                {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                          <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                  column.toggleVisibility(value)
                              }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                      )
                    })}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-700 text-gray-100 hover:bg-gray-600">
                  Show {rowsPerPage} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100">
                {[10, 20, 30, 40, 50, 100, 150].map((pageSize) => (
                    <DropdownMenuItem
                        key={pageSize}
                        onClick={() => setRowsPerPage(pageSize)}
                        className={rowsPerPage === pageSize ? "bg-gray-700" : ""}
                    >
                      <div className="flex w-full justify-between">
                        <span>Show {pageSize}</span>
                        <span>
                      {rowsPerPage === pageSize && <Check className="h-4 w-4" />}
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
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-gray-700">
                    {headerGroup.headers.map((header) => {
                      return (
                          <TableHead key={header.id} className="text-gray-300">
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                          </TableHead>
                      )
                    })}
                  </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows?.length ? (
                  rows.map((row) => (
                      <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="hover:bg-gray-700"
                      >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
          <div className="text-sm text-gray-400">
            Showing {table.getState().pagination.pageIndex * rowsPerPage + 1} to{" "}
            {Math.min((table.getState().pagination.pageIndex + 1) * rowsPerPage, table.getFilteredRowModel().rows.length)}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="bg-gray-700 text-gray-100 hover:bg-gray-600"
            >
              Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="bg-gray-700 text-gray-100 hover:bg-gray-600"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
  )
}