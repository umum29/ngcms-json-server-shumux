import { Injectable } from "@angular/core";
import { Md5 } from "ts-md5/dist/md5";
import { LangKey, UserKey } from "../config/config";
import { ITabBase } from "../model/tabs";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  defaultLangVal = "tw";
  key = "";

  constructor() {}

  setKey(account: string) {
    this.key = JSON.stringify(Md5.hashStr(account + UserKey));
    this.getStorage();
  }

  setStorage(listTabs: ITabBase[]) {
    sessionStorage.setItem(this.key, JSON.stringify(listTabs));
  }

  getStorage(): ITabBase[] {
    if (!sessionStorage.getItem(this.key)) {
      this.setStorage([]);
    }
    return JSON.parse(sessionStorage.getItem(this.key));
  }

  setLangStorage(lang: string) {
    sessionStorage.setItem(LangKey, lang);
  }

  getLangStorage() {
    if (!sessionStorage.getItem(LangKey)) {
      this.setLangStorage(this.defaultLangVal);
    }
    return sessionStorage.getItem(LangKey);
  }

  delStorage() {
    sessionStorage.clear();
  }
}
