export class PoEvent {
  constructor(
    public key: string,
    public upId: string,
    public event: string,
    public data: object,
    public token: string,
    public nodeId: string,
    public nodeName: string,
    public nodeType: string
    ) {}
  }
  