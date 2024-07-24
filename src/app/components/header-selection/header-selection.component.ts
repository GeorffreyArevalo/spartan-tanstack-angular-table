import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HeaderContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-header-selection',
  standalone: true,
  imports: [
    HlmCheckboxComponent,
  ],
  templateUrl: './header-selection.component.html',
  styleUrl: './header-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderSelectionComponent<T> {
  public context = injectFlexRenderContext<HeaderContext<T, unknown>>();
}
