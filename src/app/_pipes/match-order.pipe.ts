import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchOrder'
})
export class MatchOrderPipe implements PipeTransform {

  transform(value: any[], ...args: any[]): any {
    if (!value || !value.length) {
      return [];
    } else {
      const result = value.sort((a, b) => {
        return a.match < b.match ? 1 : (a.match > b.match ? -1 : 0);
      });
      return result;
    }
  }

}
