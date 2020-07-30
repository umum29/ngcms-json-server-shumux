import { Component, OnInit, Input } from "@angular/core";
import { DataService } from "../../../../service/data.service";
import { IData } from "../../../../model/base";
import { IPower, IHold } from "../../../../model/data";

@Component({
  selector: "app-admin-power",
  templateUrl: "./power.component.html",
  styleUrls: ["./power.component.css"]
})
export class AdminPowerComponent implements OnInit {
  @Input() toggleUpdate: string; //view, update, close-update, insert
  @Input() holds: IHold[] = [];
  powers: IPower[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (!!this.holds) {
      this.initPowers();
    }
  }

  initPowers() {
    this.dataService.getData("powers").subscribe((data: IData) => {
      if (!data.errorcode && !!data.res) {
        this.powers = <IPower[]>data.res;
        this.powers.forEach((power: IPower) => {
          power.check = false;
        });
        this.setPowers();
      }
    });
  }

  setPowers() {
    for (let i = 0; i < this.powers.length; i++) {
      for (let y = 0; y < this.holds.length; y++) {
        if (this.holds[y].powerId === this.powers[i].id) {
          this.powers[i].check = true;
        }
      }
    }
  }

  getPowers(): IPower[] {
    return this.powers;
  }
}
