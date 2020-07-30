import { Component, OnInit, OnDestroy } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/internal/Subscription";
import { ITabMain, ITabBase } from "../model/tabs";
import { LANG, COPYRIGHT, TOGGLELANG } from "../config/config";
import { CoreService } from "./core.service";
import { TabService } from "../modules/tab/tab.service";
import { UserService } from "../service/user.service";
import { DataService } from "../service/data.service";
import { SlideInOutAnimation } from "./animations";
import { IUser } from "../model/data";

@Component({
  selector: "app-core",
  templateUrl: "./core.component.html",
  styleUrls: ["./core.component.css"],
  animations: [SlideInOutAnimation]
})
export class CoreComponent implements OnInit, OnDestroy {
  COPYRIGHT = COPYRIGHT;
  LANG = LANG;
  TOGGLELANG = TOGGLELANG;
  subscription: Subscription;
  animationState = "in";
  isHamburger = false;
  isDevice = "";

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private service: CoreService,
    private userService: UserService,
    private tabService: TabService,
    protected dataService: DataService
  ) {}

  ngOnInit() {
    if (!!this.service.isHamburgerIn()) {
      this.subscription = this.service.isHamburgerIn().subscribe(val => {
        if (this.isDevice==='mb') {
          this.isHamburger = val !== "";
          this.toggleMenu();
        }
      });
    }

    this.breakpointObserver.observe("(max-width: 1199px)").subscribe(r => {
      this.isHamburger = r.matches;
      this.isDevice = r.matches ? "mb" : "pc";
      this.toggleMenu();
    });

    this.goHome();
  }

  ngOnDestroy() {
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggle() {
    this.isHamburger = !this.isHamburger;
    this.toggleMenu();
  }

  toggleMenu() {
    this.animationState = this.isHamburger ? "out" : "in";
  }

  useLanguage($event) {
    if (!!$event) {
      this.service.useLanguage($event);
    }
  }

  getUserAccount(): string {
    if (!!this.userService.getUser() && !!this.userService.getUser().account) {
      return this.userService.getUser().account;
    }
  }

  nextUser() {
    let tab = <ITabBase>{
      tag: `user_list`,
      path: `cms/user`
    };
    let tabMain = <ITabMain>{
      request: "insert",
      content: tab
    };
    this.tabService.nextTabMain(tabMain);
  }

  goHome() {
    this.router.navigate(["cms/index/", { tag: "" }], {
      skipLocationChange: true,
      queryParamsHandling: "merge"
    });
  }
}
