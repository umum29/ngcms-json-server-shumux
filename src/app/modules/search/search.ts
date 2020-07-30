import * as _moment from "moment";
import { Moment } from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

class Base {
  public static getGetters(): string[] {
    return Object.keys(this.prototype).filter(name => {
      return typeof Object.getOwnPropertyDescriptor(this.prototype, name)["get"] === "function";
    });
  }

  public static getSetters(): string[] {
    return Object.keys(this.prototype).filter(name => {
      return typeof Object.getOwnPropertyDescriptor(this.prototype, name)["set"] === "function";
    });
  }
}

export interface IValid {
  type: string;
  valid: boolean;
}

export class Search extends Base {
  private validObjs: IValid[] = [];

  constructor(
    private _id: number = 0,
    private _idSel: string = "",
    private _levelId: number = 0,
    private _levelIdSel: string = "",
    private _typeId: number = 0,
    private _typeIdSel: string = "",
    private _name: string = "",
    private _status: number = 0,
    private _statusSel: string = "",
    private _start: Moment = null,
    private _end: Moment = null,
  //  private _expand:string = "",
  //  private _embed:string = "",
    private _check: boolean = true
  ) {
    super();
  }

  set id(_id) {
    this._id = _id;
  }

  set idSel(_idSel) {
    this._idSel = _idSel;
  }

  set levelId(_levelId) {
    this._levelId = _levelId;
  }

  set levelIdSel(_levelIdSel) {
    this._levelIdSel = _levelIdSel;
  }

  set typeId(_typeId) {
    this._typeId = _typeId;
  }

  set typeIdSel(_typeIdSel) {
    this._typeIdSel = _typeIdSel;
  }

  set name(_name) {
    this._name = _name;
  }

  set status(_status) {
    this._status = _status;
  }

  set statusSel(_statusSel) {
    this._statusSel = _statusSel;
  }

  set start(_start) {
    this._start = _start;
  }

  set end(_end) {
    this._end = _end;
  }


  set check(_check) {
    this._check = _check;
  }

  /**GET */
  get id(): number {
    return this._id;
  }

  get idSel(): string {
    return this._idSel;
  }

  get levelId(): number {
    return this._levelId;
  }

  get levelIdSel(): string {
    return this._levelIdSel;
  }

  get typeId(): number {
    return this._typeId;
  }

  get typeIdSel(): string {
    return this._typeIdSel;
  }

  get name(): string {
    return this._name;
  }

  get status(): number {
    return this._status;
  }

  get statusSel(): string {
    return this._statusSel;
  }

  get check(): boolean {
    return this._check;
  }

  get start(): Moment {
    return this._start;
  }

  get end(): Moment {
    return this._end;
  }

  setValidObjs(obj: IValid) {
    let index = this.validObjs
      .map((validObj: IValid) => {
        return validObj.type;
      })
      .indexOf(obj.type);
    if (index === -1) {
      this.validObjs.push(obj);
    } else {
      this.validObjs[index] = obj;
    }
    this.setCheck();
  }

  setCheck() {
    this._check = true;
    this.validObjs.forEach((validObj: IValid) => {
      if (!validObj.valid) {
        this._check = false;
        return;
      }
    });
  }

  getSearch(): Search {
    let obj = <Search>{};

    if (!!this._id) {
      obj["id"] = this._id;
    }
    if (!!this._idSel) {
      obj["id"] = +this._idSel;
    }
    if (!!this._levelId) {
      obj["levelId"] = this._levelId;
    }
    if (!!this._levelIdSel) {
      obj["levelId"] = +this._levelIdSel;
    }
    if (!!this._typeId) {
      obj["typeId"] = this._typeId;
    }
    if (!!this._typeIdSel) {
      obj["typeId"] = +this._typeIdSel;
    }
    if (!!this._name) {
      obj["name"] = this._name;
    }
    if (!!this._status) {
      obj["status"] = this._status;
    }
    if (!!this._statusSel) {
      obj["status"] = +this._statusSel;
    }
    if (!!this._start) {
      obj["inserted_gte"] = this._start.valueOf();
    }
    if (!!this._end) {
      obj["inserted_lte"] = this._end.valueOf();
    }

    return obj;
  }

  setSearchDate(indexDateTab: string) {
    switch (indexDateTab) {
      case "now":
        this._start = moment().subtract(1, "hours");
        this._end = moment()
          .startOf("date")
          .add(1, "days");
        break;
      case "today":
        this._start = moment().startOf("date");
        this._end = moment()
          .startOf("date")
          .add(1, "days");
        break;
      case "yesterday":
        this._start = moment()
          .startOf("date")
          .subtract(1, "days");
        this._end = moment().startOf("date");
        break;
      case "month":
        this._start = moment().startOf("month");
        this._end = moment()
          .startOf("month")
          .add(1, "months");
        break;
    }
  }
}
