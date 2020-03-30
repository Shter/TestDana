import {ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
})
export class SelectComponent implements ControlValueAccessor{
  @Input() public placeholder: string;
  @Input() public options: any[];
  @Input() public valueName: string;
  @Input() public displayName: string;
  @Input() public set formValue(value: any) {
    this._formValue = value;
    this.onChange(value);
  }
  public get formValue(): any {
    return this._formValue;
  }

  private _formValue: any;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private cdr: ChangeDetectorRef) { }

  writeValue(outsideValue: number) {
    this.formValue = outsideValue;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
}
