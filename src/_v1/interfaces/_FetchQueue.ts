export interface IFetchQueue {
  queued: {
    //TODO? - this may need to be evaluated diff on the backend
    "1": string[];
  };
  invalid: never[];
}