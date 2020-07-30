import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/internal/Subscription";
import { TabService } from "../../modules/tab/tab.service";
import { StorageService } from "../../service/storage.service";
import { ITabBase, ITabMain } from "../../model/tabs";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.css"]
})
export class TabComponent implements OnInit, OnDestroy {
  listTabs: ITabBase[] = [];
  subscription: Subscription;
  selected = 0;

  constructor(
    private storageService: StorageService,
    private tabService: TabService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listTabs = this.storageService.getStorage();
    if (!!this.listTabs.length) {
      this.selected = this.listTabs.length - 1;
      this.goResolve(this.listTabs[this.selected]);
      this.goUrl(this.listTabs[this.selected]);
    }

    if (!!this.tabService.isTabMainIn()) {
      this.subscription = this.tabService.isTabMainIn().subscribe((tabMain: ITabMain) => {
        if (!!tabMain && !!tabMain.request) {
          switch (tabMain.request) {
            case "insert":
              if (this.searchListTabIndex(tabMain.content) != -1) {
                //exist arr so update
                this.selected = this.searchListTabIndex(tabMain.content);
                this.listTabs[this.selected] = tabMain.content;
                this.goResolve(this.listTabs[this.selected]);
                this.goUrl(this.listTabs[this.selected]);
                this.saveTabs();
                return;
              }
              if (tabMain.content.tag === "index_list") {
                this.listTabs = [];
                this.saveTabs();
                this.goHome();
                return;
              }
              let dateTime = Date.now();
              let timestamp = Math.floor(dateTime / 1000);
              tabMain.content.unix = `${timestamp}`;

              this.listTabs.push(tabMain.content);
              this.selected = this.listTabs.length - 1;
              this.goResolve(this.listTabs[this.selected]);
              this.goUrl(this.listTabs[this.selected]);
              this.saveTabs();

              break;
            case "update":
              let i = this.searchListTabIndex(tabMain.content);
              this.listTabs[i] = tabMain.content;
              this.saveTabs();
              break;
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  selectTab(index: number) {
    this.selected = index;
    let t = this.listTabs[index];
    this.goResolve(t);
    this.goUrl(t);
  }

  delTab(index: number) {
    this.listTabs.splice(index, 1);
    this.saveTabs();
    if (!!this.listTabs.length) {
      this.selected = this.listTabs.length - 1;
      this.goResolve(this.listTabs[this.selected]);
      this.goUrl(this.listTabs[this.selected]);
    } else {
      this.goHome();
    }
  }

  goResolve(listTab: ITabBase) {
    this.tabService.nextTab(listTab);
  }

  goUrl(listTab: ITabBase) {
    if (!!listTab && !!listTab.path) {
      this.router.navigate([listTab.path, { unix: listTab.unix }], {
        skipLocationChange: true,
        queryParamsHandling: "merge"
      });
    }
  }

  goHome() {
    this.router.navigate(["cms/index/", { tag: "" }], {
      skipLocationChange: true,
      queryParamsHandling: "merge"
    });
  }

  saveTabs() {
    this.storageService.setStorage(this.listTabs);
  }

  searchListTab(listTab: ITabBase): ITabBase {
    let c = this.listTabs.filter(item => {
      return item.tag == listTab.tag;
    });
    if (!c[0]) {
      return null;
    }
    return c[0];
  }

  searchListTabIndex(listTab: ITabBase): number {
    let indexOf = -1;
    this.listTabs.forEach((item, index) => {
      if (item.tag != listTab.tag) {
        return;
      }
      indexOf = index;
    });

    return indexOf;
  }

  getTagName(tag: string): string {
    return tag;
  }
}
