
import { Directive, ElementRef, NgZone, OnInit, inject, input } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, switchMap } from 'rxjs';


@Directive({
  selector: 'input[debouncedInput]',
  standalone: true
})
export class DebouncedInputDirective {

  inputRef = inject(ElementRef).nativeElement as HTMLInputElement;

  readonly debounce = input<number>(500);
  readonly debounce$ = toObservable(this.debounce);

  readonly changeEvent = outputFromObservable(
    this.debounce$.pipe(
      switchMap(debounce => fromEvent(this.inputRef, 'input').pipe(debounceTime(debounce)))
    )
  );


}
