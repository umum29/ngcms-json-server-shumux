import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from "@angular/core";
import { Moment } from "moment";
import { Search, IValid } from "../search";

interface IDateData {
  valid: boolean;
  value: Moment;
}

@Component({
  selector: "public-search-date",
  templateUrl: "./search-date.component.html",
  styleUrls: ["./search-date.component.css"],
})
export class SearchDateComponent {
  @Input() searchObj: Search;
  @Input() toggleMb: boolean;
  @Output() searchSend: EventEmitter<Search> = new EventEmitter<Search>();
  startObj = <IDateData>{ valid: false, value: null };
  endObj = <IDateData>{ valid: false, value: null };

  constructor() {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.startObj.value = this.searchObj.start;
    this.endObj.value = this.searchObj.end;
  }

  setDate(type: string, event) {
    if (type === "start") {
      this.startObj.valid = event.valid;
      this.setSearch(type, this.startObj);
    } else {
      this.endObj.valid = event.valid;
      this.setSearch(type, this.endObj);
    }
    this.getSearch();
  }

  setSearch(type: string, obj: IDateData) {
    if (obj.valid) {
      this.searchObj[type] = obj.value;
    }
  }

  getSearch() {
    this.searchObj.setValidObjs(<IValid>{ type: "start", valid: this.startObj.valid });
    this.searchObj.setValidObjs(<IValid>{ type: "end", valid: this.endObj.valid });
    this.searchSend.emit(this.searchObj);
  }
}
