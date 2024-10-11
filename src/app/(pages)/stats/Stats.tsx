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
import {ArrowUpDown, ChevronDown, Filter} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {Progress} from "@/components/ui/progress"
import {StatsTable} from "@/lib/types"
import {useEffect} from "react";

const AbilityBar = ({ value, label }: { value: number; label: string; color?: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="w-20 text-xs font-medium">{label}</div>
            <Progress value={value * 10} className="h-2" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}: {value}/10</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
)

const formatPercentage = (value: number) => (value * 100).toFixed(2) + '%'

export const columns: ColumnDef<StatsTable>[] = [
  {
    accessorKey: "name",
    header: "Hero",
    cell: ({ row }) => (
        <div className="flex items-center space-x-2">
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
    cell: ({ row }) => <div>{formatPercentage(row.getValue("win_rate"))}</div>,
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
    cell: ({ row }) => <div>{formatPercentage(row.getValue("ban_rate"))}</div>,
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
    cell: ({ row }) => <div>{formatPercentage(row.getValue("pick_rate"))}</div>,
  },
  {
    accessorKey: "speciality",
    header: ({ column }) => {
      return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Tags
                <Filter className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Array.from(new Set(column.getFacetedUniqueValues())).map((tag) => (
                  <DropdownMenuCheckboxItem
                      key={tag as string}
                      className="capitalize"
                      checked={(column.getFilterValue() as string[] | undefined)?.includes(tag as string) ?? false}
                      onCheckedChange={(value) => {
                        const filterValue = (column.getFilterValue() as string[] | undefined) ?? []
                        if (value) {
                          column.setFilterValue([...filterValue, tag])
                        } else {
                          column.setFilterValue(filterValue.filter((v) => v !== tag))
                        }
                      }}
                  >
                    {tag as string}
                  </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
      )
    },
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
        />
    ),
  },
]

interface StatsTableProps {
  stats: StatsTable[]
}

export default function StatsTableComponent({ stats }: StatsTableProps) {
  useEffect(() => {
    console.log("In table component: ", stats)
  }, [stats]);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data: stats,
    columns,
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

  // Generate unique speciality tags from the passed stats
  const uniqueSpecialities = React.useMemo(() =>
          Array.from(new Set(stats.flatMap(hero => hero.speciality))),
      [stats]
  )

  return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
              placeholder="Filter heroes..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
                                column.toggleVisibility(!!value)
                            }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                    )
                  })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                          <TableHead key={header.id}>
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
              {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
  )
}