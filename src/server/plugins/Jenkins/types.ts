export interface JenkinsJobType {
  type : 'job' | 'folder';
  name : string;
  url : string;
  pending : boolean;
  jobs? : { [ name : string ] : JenkinsJobType };
}

export interface JenkinsJobInfoType {
  building? : boolean;
  enabled? : boolean;
  name? : string;
  displayName? : string;
  status? : 'successful' | 'failed' | 'unstable' | 'aborted' | 'disabled';
  health? : number;
  inQueue? : boolean;
  lastBuildFailed? : boolean;
  lastBuildSucceeded? : boolean;
  type: 'job' | 'folder',
}
