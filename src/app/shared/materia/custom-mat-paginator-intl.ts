import { TranslateService } from "@ngx-translate/core";
import { MatPaginatorIntl } from "@angular/material";
import { Injectable } from "@angular/core";

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });

    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this.translate
      .get(["items_per_page", "next_page", "previous_page", "of_label"])
      .subscribe(translation => {
        this.itemsPerPageLabel = translation["items_per_page"];
        this.nextPageLabel = translation["next_page"];
        this.previousPageLabel = translation["previous_page"];
        this.changes.next();
      });
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  };
}
