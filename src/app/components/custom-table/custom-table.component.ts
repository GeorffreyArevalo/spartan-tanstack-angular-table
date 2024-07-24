import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';

// * Spartan Imports
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTableDirective,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';

import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucideCheck, lucideSearch, lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';

// * Tanstack Imports
import {
  CellContext,
  Column,
  ColumnDef,
  ColumnFiltersState,
  createAngularTable,
  FilterFn,
  FlexRenderComponent,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/angular-table'

import { CommonModule } from '@angular/common';
import { DebouncedInputDirective } from '../../directives/debounced-input.directive';
import { HeaderSelectionComponent } from '../header-selection/header-selection.component';
import { RowSelectionComponent } from '../row-selection/row-selection.component';
import { HlmToasterComponent } from '../../spartan/components/ui-sonner-helm/src/lib/hlm-toaster.component';
import { toast } from 'ngx-sonner';
import { HeaderDataTable } from '../../interfaces/header-data-table.interface';


const customFilterFn: FilterFn<Record<string, unknown>> = ( row: Row<Record<string, unknown>>, columnId: string, filterValue: any, addMeta: (meta: any) => void) => {

  filterValue = filterValue.toLowerCase();
  const rowValues = Object.keys(row.original).map( key => row.original[key] ).join(' ').toLowerCase();
  return rowValues.includes(filterValue);
}



@Component({
  selector: 'custom-table',
  standalone: true,
  imports: [

    CommonModule,

    BrnMenuTriggerDirective,
    HlmMenuModule,

    HlmCaptionComponent,
    HlmTableComponent,
    HlmTdComponent,
    HlmThComponent,
    HlmTrowComponent,
    HlmTableDirective,
    HlmButtonDirective,


    HlmCommandImports,
    HlmIconComponent,
    BrnCommandImports,

    BrnPopoverComponent,
    BrnPopoverContentDirective,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,

    HlmCheckboxComponent,
    HlmLabelDirective,
    HlmInputDirective,

    HlmToasterComponent,

    DebouncedInputDirective,

    FlexRenderDirective

  ],
  providers: [provideIcons({lucideChevronsUpDown, lucideCheck, lucideSearch, lucideChevronDown, lucideEllipsis})],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTableComponent implements OnInit, OnChanges {


  //protected _invoices = generateRandomInvoices(100);

  public readonly pageSizes = input<number[]>([10, 20, 30, 50]);
  public readonly data = input.required<Record<string, unknown>[]>();
  public readonly columnsHeader = input.required<HeaderDataTable[]>();
  public readonly copyOnClipboard = input<string>('');
  public readonly showSelect = input(false, {
    transform: booleanAttribute
  });
  public readonly showActions = input(false, {
    transform: booleanAttribute
  });

  public headerTableComboVisibility = computed<Record<string, HeaderDataTable>>(() =>
    {
      let columns: Record<string, HeaderDataTable> = {};
      this.columnsHeader().forEach( header =>  {columns[header.id] = header });
      return columns;
    }
  )

  public comlumnsDefinition = computed<ColumnDef<Record<string, unknown>>[]>(() => {
      let columnsDef:ColumnDef<Record<string, unknown>>[] = [];
      if(this.showSelect()){
        columnsDef = [...columnsDef,
          {
            id: 'select',
            enableSorting: false,
            enableHiding: false
          }
        ]
      }
      columnsDef = [...columnsDef,
        ...this.columnsHeader().map( (headerColumn, index) => (
            {
              id: headerColumn.id,
              accessorFn: (row: Record<string, unknown>) => row[headerColumn.id],
              cell: (info: CellContext<Record<string, unknown>, unknown>) => info.getValue(),
              header: `<span>${headerColumn.title}</span>`,
              filterFn: index === 0 ? customFilterFn : undefined,
            }
          )
        )
      ];
      if(this.showActions()) {
        columnsDef = [...columnsDef,
          {
            id: 'actions',
            enableSorting: false,
            enableHiding: false
          }
        ]
      }
      return columnsDef;
    }
  );



  public stateCombobox = signal<'closed' | 'open'>('closed');
  public readonly columnVisibility = signal<VisibilityState>({});
  public readonly columnFilters = signal<ColumnFiltersState>([]);
  public readonly sorting = signal<SortingState>([]);
  public readonly rowSelection = signal<RowSelectionState>({});
  public readonly isVisibleButtonShowSelected = computed(() => Object.keys(this.rowSelection()).length > 0 );
  public readonly paginationState = signal<PaginationState>(
    {
      pageIndex: 0,
      pageSize: this.pageSizes()[0]
    }
  );


  public tanstackTable = createAngularTable(() => ({
    data: this.data(),
    columns: this.comlumnsDefinition(),
    state: {
      columnVisibility: this.columnVisibility(),
      columnFilters: this.columnFilters(),
      sorting: this.sorting(),
      rowSelection: this.rowSelection(),
      pagination: this.paginationState()
    },
    onPaginationChange: (pageChange) => {
      typeof pageChange === 'function'
      ? this.paginationState.update(pageChange)
      : this.paginationState.set(pageChange);
    },
    onColumnVisibilityChange: updaterOrValue => {
      const visibilityState =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(this.columnVisibility())
        : updaterOrValue;
      this.columnVisibility.set(visibilityState)
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function
      ? this.columnFilters.update(updater)
      : this.columnFilters.set(updater);
    },
    onSortingChange: (sortingChanged) => {
      sortingChanged instanceof Function
      ? this.sorting.update(sortingChanged)
      : this.sorting.set(sortingChanged);
    },
    onRowSelectionChange: (selectionChanged) => {
      this.rowSelection.set(
        typeof selectionChanged === 'function'
        ? selectionChanged(this.rowSelection())
        : selectionChanged
      );
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    enableRowSelection: true,
  }));

  ngOnInit(): void {
    const ids = this.columnsHeader().map( header => header.id );
    if( ids.includes('actions') || ids.includes('select') ){
      throw new Error('ID actions or select is not allowed for table header.');
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!!changes['pageSizes']) {
      this.paginationState.set( {pageIndex: 0, pageSize: this.pageSizes()[0] ?? 5} );
    }

  }


  changeStateCombobox(state: 'open' | 'closed'){
    this.stateCombobox.set(state);
  }

  onPageSizeChange(size: number) {
    this.stateCombobox.set('closed');
    if( this.tanstackTable.getState().pagination.pageSize !== size ) {
      this.tanstackTable.setPageSize(size);
    }

  }

  onDeboucedInputChange(e: Event){
    const valueSearch: string = (e.target as HTMLInputElement).value;
    this.tanstackTable.getColumn( this.columnsHeader()[0]?.id ?? '' )?.setFilterValue(valueSearch);
  }

  onSortingColumn(column: Column<Record<string, unknown>>){
    column.toggleSorting( column.getIsSorted() === 'asc' );
  }

  showSelection(){
    const selected = this.tanstackTable.getSelectedRowModel().rows.map(row => row.original);
    console.log(selected);
  }

  copyIdToClipboard(text: unknown) {
    navigator.clipboard.writeText(
      typeof text === 'string' || typeof text === 'number' ? text.toString() : ''
    );
    toast.success(`${text} copied to the clipboard`);
  }

}
