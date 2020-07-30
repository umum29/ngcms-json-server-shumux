import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Search } from "../search";

@Component({
  selector: "public-search-select",
  templateUrl: "./search-select.component.html",
  styleUrls: ["./search-select.component.css"]
})
export class SearchSelectComponent {
  @Input() label: string;
  @Input() selectLabel: string;
  @Input() searchObj: Search;
  @Input() selects: { id: number; name: number }[];
  @Output() searchSend: EventEmitter<Search> = new EventEmitter<Search>();
  searchValue: string = "";

  constructor() {}

  ngOnInit() {
    this.init();
  }

  init() {
    if (!!this.selectLabel) {
      switch (this.selectLabel) {
        case "levelId":
          this.searchValue = this.searchObj.levelIdSel;
          break;
        case "typeId":
          this.searchValue = this.searchObj.typeIdSel;
          break;
        case "status":
          this.searchValue = this.searchObj.statusSel;
          break;
      }
    }
  }

  setSearch() {
    switch (this.selectLabel) {
      case "levelId":
        this.searchObj.levelIdSel = this.searchValue;
        break;
      case "typeId":
        this.searchObj.typeIdSel = this.searchValue;
        break;
      case "status":
        this.searchObj.statusSel = this.searchValue;
        break;
    }
  }

  getSearch() {
    this.setSearch();
    this.searchSend.emit(this.searchObj);
  }
}
