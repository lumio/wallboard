export interface CronWorkerConfigType {
  nextRun : number;
  skipFirstRun? : boolean;
  url? : string;
  urlResponseFormat? : 'json' | 'xml';
  callback?() : void;
  data? : { [ key : string ] : any };
}

export interface CronWorkerCollectionType {
  [ key : string ] : {
    config : CronWorkerConfigType;
    timer? : any;
    busy? : boolean;
  };
}
