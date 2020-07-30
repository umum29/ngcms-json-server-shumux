import {
  Component,
  OnInit,
  HostListener,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, AfterViewInit {
  innerWidth = 0;
  innerHeight = 0;
  isDevice = "pc";

  constructor(
    private breakpointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.breakpointObserver.observe("(max-width: 1199px)").subscribe(r => {
      this.isDevice = r.matches ? "mb" : "pc";
    });
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.changeDetectorRef.markForCheck();
    }, 500);
    this.initSize();
  }

  @HostListener("window:resize", ["$event"]) onResize(event: Event) {
    this.initSize();
  }

  initSize() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.reviseSize();
  }

  reviseSize() {
    if (this.isDevice === "pc") {
      this.innerWidth = this.innerWidth - 270;
      this.innerHeight = (this.innerHeight - 125) / 2;
    } else {
      this.innerWidth = this.innerWidth - 40;
      this.innerHeight = (this.innerHeight - 140) / 2;
    }
  }
}
