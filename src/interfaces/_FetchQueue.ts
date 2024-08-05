export interface IFetchQueue {
  queued: {
    key: number, value: string[]
  }[];
  invalid: String[];
}