import { Component, OnInit } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { LOGOURL, LANG, TOGGLELANG } from "../../config/config";
import { CoreService } from "../../core/core.service";
import { TabService } from "../../modules/tab/tab.service";
import { DataService } from "../../service/data.service";
import { UserService } from "../../service/user.service";
import { IMenu, Menu } from "./menu";
import { ITabBase, ITabMain } from "../../model/tabs";
import { IData } from "../../model/base";
import { IPower, IHold } from "../../model/data";
@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {
  LOGOURL = LOGOURL;
  LANG = LANG;
  TOGGLELANG = TOGGLELANG;
  menu: IMenu[] = Menu;
  isDevice = "";

  constructor(
    private coreService: CoreService,
    private breakpointObserver: BreakpointObserver,
    private tabService: TabService,
    private dataService: DataService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.breakpointObserver.observe("(max-width: 1199px)").subscribe(r => {
      this.isDevice = r.matches ? "mb" : "pc";
      this.filterMenu();
    });
    this.setMenu();
  }

  setMenu() {
    this.dataService.getData("powers").subscribe((data: IData) => {
      if (!!data && !!data.res) {
        let powers = <IPower[]>data.res;
        powers.forEach((power: IPower) => {
          this.userService.getUser().holds.forEach((hold: IHold) => {
            if (hold.powerId === power.id) {
              let obj = <IMenu>{
                name: `${power.name}`,
                path: `/${power.name}`,
                check: false
              };
              this.menu.push(obj);
            }
          });
        });
      }
    });
    this.filterMenu();
  }

  filterMenu() {
    let index = this.menu
      .map(item => {
        return item.name;
      })
      .indexOf("user");
    if (this.isDevice === "pc" && index !== -1) {
      this.menu.splice(index, 1);
    }
    if (this.isDevice === "mb" && index === -1) {
      this.menu.splice(1, 0, {
        name: "user",
        path: "/user",
        check: false
      });
    }
  }

  toggleMenuInfo(menuInfo: IMenu) {
    menuInfo.check = !menuInfo.check;
    this.setListTab(menuInfo);
  }

  setListTab(menuInfo: IMenu) {
    this.coreService.nextHamburger("next");
    let tab = <ITabBase>{
      tag: `${menuInfo.name}_list`,
      path: "cms" + menuInfo.path
    };
    let tabMain = <ITabMain>{
      request: "insert",
      content: tab
    };
    this.tabService.nextTabMain(tabMain);
  }

  logout() {
    this.coreService.logout();
  }

  useLanguage($event?) {
    if (!!$event) {
      this.coreService.useLanguage($event);
    }
  }

  getNowLang() {
    return this.coreService.getNowLang();
  }
}
