import fetch from 'node-fetch';
import intercept from 'intercept-stdout';

// intercept std output to avoid unwanted output
intercept(function(txt) {
  if (txt.includes('Promise')) {
    return '';
  }
  return txt;
});

const hostUrl = 'http://localhost';
const port = '3030';
let baseUrl = `https://ees-backend.herokuapp.com/api/`;

interface GlobalExtended extends NodeJS.Global {
  getAllUsers: Function;
  defineUser: Function;
  setUserGroup: Function;
  getAllExperiments: Function;
  defineExperiment: Function;
  setExperimentStatus: Function;
  getAllExperimentConditions: Function;
  getExperimentCondition: Function;
  markExperimentPoint: Function;
  getGroupAssignments: Function;
  getIndividualAssignments: Function;
  getGroupExclusions: Function;
  getIndividualExclusions: Function;
  getMonitoredExperimentPoints: Function;
}

const extendedGlobal = global as GlobalExtended;

extendedGlobal.getAllUsers = async () => {
  const url = `${baseUrl}users`;
  const result = await fetch(url)
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.defineUser = async (
  userId: string,
  groupName: string,
  groupId: string
) => {
  const url = `${baseUrl}users`;
  const postData = JSON.stringify([
    {
      id: userId,
      group: {
        [groupName]: groupId,
      },
    },
  ]);
  const result = await fetch(url, {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.setUserGroup = async (
  userId: string,
  groupName: string,
  groupId: string
) => {
  const url = `${baseUrl}users/${userId}`;
  const postData = JSON.stringify([
    {
      id: userId,
      group: {
        [groupName]: groupId,
      },
    },
  ]);
  const result = await fetch(url, {
    method: 'PUT',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.getAllExperiments = async () => {
  const url = `${baseUrl}experiments`;
  const result = await fetch(url)
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

interface ISegmentDefinition {
  id: string;
  point: string;
}

extendedGlobal.defineExperiment = async (
  segmentDefinition: ISegmentDefinition[],
  group: string,
  unitOfAssignment: string,
  consistencyRule: string,
  postExperimentRule: string,
  conditions: string[]
) => {
  const url = `${baseUrl}experiments`;
  const postData = JSON.stringify({
    name: 'default',
    description: '',
    consistencyRule,
    assignmentUnit: unitOfAssignment,
    postExperimentRule,
    state: 'inactive',
    group: group || undefined,
    conditions: conditions.map(condition => {
      return {
        assignmentWeight: 1 / conditions.length,
        conditionCode: condition,
      };
    }),
    segments: segmentDefinition.map(segmentInd => ({
      id: segmentInd.id,
      point: segmentInd.point,
      name: 'default',
      description: '',
    })),
  });

  const result = await fetch(url, {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.setExperimentStatus = async (
  experimentId: string,
  state: string
) => {
  const url = `${baseUrl}state`;
  const postData = JSON.stringify({
    experimentId,
    state,
  });
  const result = await fetch(url, {
    method: 'PUT',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.getAllExperimentConditions = async (
  userId: string,
  groupName: string,
  groupId: string
) => {
  const url = `${baseUrl}assign`;
  const postData = JSON.stringify({
    userId,
    userEnvironment: {
      [groupName]: groupId,
    },
  });

  const result = await fetch(url, {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.getExperimentCondition = async (
  experimentId: string,
  experimentPoint: string
) => {
  const url = `${baseUrl}experiments/conditions/${experimentId}/${experimentPoint}`;
  const result = await fetch(url)
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.markExperimentPoint = async (
  experimentId: string,
  experimentPoint: string,
  userId: string,
  groupName: string,
  groupId: string
) => {
  const postData = JSON.stringify({
    experimentId,
    experimentPoint,
    userId,
    userEnvironment: {
      [groupName]: groupId,
    },
  });

  const url = `${baseUrl}mark`;
  const result = await fetch(url, {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.getGroupAssignments = async () => {
  const url = `${baseUrl}check/groupAssignment`;
  const result = await fetch(url)
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.getIndividualAssignments = async () => {
  const url = `${baseUrl}check/individualAssignment`;
  const result = await fetch(url)
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.getGroupExclusions = async () => {
  const url = `${baseUrl}check/groupExclusion`;
  const result = await fetch(url)
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.getIndividualExclusions = async () => {
  const url = `${baseUrl}check/individualExclusion`;
  const result = await fetch(url)
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

extendedGlobal.getMonitoredExperimentPoints = async () => {
  const url = `${baseUrl}check/monitoredExperimentPoint`;
  const result = await fetch(url)
    .then(res => res.json())
    .catch(err => prettifyBuffer(err));

  prettifyBuffer(result);
};

function prettifyBuffer(string: string): void {
  console.log(JSON.stringify(string, undefined, 2));
}
