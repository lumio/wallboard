interface ScreenBuildJobStyledPropsType {
  building : boolean;
  enabled : boolean;
  status : string;
  name : string;
  folder : string;
  health : number;
  lastBuildFailed : boolean;
  lastBuildSucceeded : boolean;

  extraMargin? : boolean;
}

interface ScreenBuildJobProgressStyledPropsType {
  visible? : boolean;
  progress : number;
  enabled : boolean;
  health : number;
  lastBuildFailed : boolean;
  status : string;
}

interface ScreenBuildJobWithProgressStateType {
  currentTimestamp : number;
}

export {
  ScreenBuildJobStyledPropsType,
  ScreenBuildJobProgressStyledPropsType,
  ScreenBuildJobWithProgressStateType,
};
