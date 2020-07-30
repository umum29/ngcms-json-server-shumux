export class ChildToggle {
  constructor(
    private _selectMarkID: string,
    private _selectTag: string,
    private _selectId: number
  ) {}

  set selectMarkID(_selectMarkID: string) {
    this._selectMarkID = _selectMarkID;
  }

  set selectTag(_selectTag: string) {
    this._selectTag = _selectTag;
  }

  set selectId(_selectId: number) {
    this._selectId = _selectId;
  }

  get selectMarkID(): string {
    return this._selectMarkID;
  }

  get selectTag(): string {
    return this._selectTag;
  }

  get selectId(): number {
    return this._selectId;
  }

  reset() {
    this._selectId = 0;
    this._selectTag = "";
  }

  setData(_selectTag: string, _selectId: number) {
    this._selectTag = _selectTag;
    this._selectId = _selectId;
  }
}
