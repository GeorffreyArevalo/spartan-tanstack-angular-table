import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-row-selection',
  standalone: true,
  imports: [
    HlmCheckboxComponent
  ],
  templateUrl: './row-selection.component.html',
  styleUrl: './row-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowSelectionComponent<T> {
  public context = injectFlexRenderContext<CellContext<T, unknown>>();
}
