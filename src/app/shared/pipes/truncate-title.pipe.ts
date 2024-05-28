import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncateTitle'
})
export class TruncateTitlePipe implements PipeTransform {

  transform(value: string, limit: number = 58): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
