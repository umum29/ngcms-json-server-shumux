import { Component, Input } from "@angular/core";

@Component({
  selector: "app-preview",
  templateUrl: "preview.component.html",
  styleUrls: ["preview.component.css"]
})
export class PreviewComponent {
  @Input() imageSrc: string = "";
  imageLoaded: boolean = false;

  constructor() {}

  handleImageLoad() {
    this.imageLoaded = true;
  }
}
