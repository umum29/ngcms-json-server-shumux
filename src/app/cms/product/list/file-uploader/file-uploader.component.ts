import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "file-uploader",
  templateUrl: "file-uploader.component.html",
  styleUrls: ["file-uploader.component.css"]
})
export class FileUploaderComponent implements OnInit {
  @Input() parent: FormGroup;
  imageSrc: string = "null";
  activeColor: string = "green";
  baseColor: string = "#ccc";
  overlayColor: string = "rgba(255,255,255,0.5)";
  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;

  ngOnInit() {
    if (!!this.parent) {
      this.imageSrc = this.parent.value.file;
    }
  }

  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
  }

  handleInputChange(e) {
    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    let pattern = /image-*/;
    let reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert("invalid format");
      return;
    }
    this.loaded = false;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
    this.parent.patchValue({
      file: this.imageSrc
    });
  }

  cancel() {
    this.imageSrc = "";
  }
}
