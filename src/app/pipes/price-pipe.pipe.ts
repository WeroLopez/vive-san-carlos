import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePipe'
})
export class PricePipePipe implements PipeTransform {

  transform(pirce: number): string {
    if (pirce){
      return "$ " + ((pirce * 100) / 100).toFixed(2)
    }
    return " - "
  }

}
