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

export {
  ScreenBuildJobStyledPropsType,
};
