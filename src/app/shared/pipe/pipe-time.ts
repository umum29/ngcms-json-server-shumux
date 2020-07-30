import { Pipe, PipeTransform } from "@angular/core";
import moment from 'moment';
import {Moment} from 'moment';

@Pipe({
  name: "pipetime",
  pure: false
})
export class TimePipe implements PipeTransform {
  constructor() {}

  transform(value: string, args: string = "YYYY-MM-DD HH:mm:ss"): any {
    return moment(value).format(args);
  }
}
