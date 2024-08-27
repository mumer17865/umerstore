import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'pkrCurrency',
  standalone: true
})
export class PkrCurrencyPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: number, ...args: unknown[]): string {
    if (value !== undefined && value !== null) {
      return `₨ ` + value // format as PKR with two decimal places
    }
    return `₨ 0.00`;
  }
}




