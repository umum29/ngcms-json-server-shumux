export class ClickToggle {
  constructor(private _atrId: number, private _atrTagSel: string, private _atrTag: string[]) {}

  set atrId(_atrId: number) {
    this._atrId = _atrId;
  }

  set atrTagSel(_atrTagSel: string) {
    this._atrTagSel = _atrTagSel;
  }

  set atrTag(_atrTag: string[]) {
    this._atrTag = _atrTag;
  }

  get atrId(): number {
    return this._atrId;
  }

  get atrTagSel(): string {
    return this._atrTagSel;
  }

  get atrTag(): string[] {
    return this._atrTag;
  }

  reset() {
    this._atrId = 0;
    this._atrTagSel = "";
  }
}
