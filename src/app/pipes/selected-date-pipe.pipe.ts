import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../constants';
import { Day } from '../entities/day';

@Pipe({
  name: 'selectedDatePipe'
})
export class SelectedDatePipePipe implements PipeTransform {

  transform(value: Day): string {
    if (value){
      let day = value.date
      if (day) {
        return day.getDate() + " de " + Constants.monthNames[day.getMonth()] + " del " + day.getFullYear()
      }
    }
    return " - "
  }

}
