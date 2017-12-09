interface JenkinsConfigType {
  whitelist? : string | string[];
  blacklist? : string | string[];
}

interface JenkinsJobType {
  type : 'job' | 'folder';
  name : string;
  url : string;
  pending : boolean;
  jobs? : { [ name : string ] : JenkinsJobType };
}

interface JenkinsJobInfoType {
  building? : boolean;
  enabled? : boolean;
  name? : string;
  displayName? : string;
  status? : 'successful' | 'failed' | 'unstable' | 'aborted' | 'disabled' | 'notbuilt' | 'unknown';
  health? : number;
  inQueue? : boolean;
  lastBuildFailed? : boolean;
  lastBuildSucceeded? : boolean;
  type: 'job' | 'folder',
}

export {
  JenkinsConfigType,
  JenkinsJobType,
  JenkinsJobInfoType,
};
