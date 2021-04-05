import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAlumni'
})
export class FilterAlumniPipe implements PipeTransform {

  transform(value: any[], keyword: string): any {
    console.log('filterAlumni');
    if (!value) {
      return [];
    }
    const result = value.filter(x => (x.first_name + ' ' + x.last_name).toUpperCase().indexOf(keyword.toUpperCase()) > -1);
    return result;
  }

}
