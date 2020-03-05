// init_client(userId, group, workingGroup)
// setGroupMembership_client(userId, group)
// setWorkingGroup_client(userId, workingGroup)
// defineExperiment_server(name, [{id, point}], [conditions], unitOfAssignment, consistencyRule, postExperimentRule, group)
// setExperimentStatus_server(name, state)
// getAllExperimentConditions_client(user)
// getExperimentCondition_client(experimentCondition, experimentPoint, experimentId)
// markExperimentPoint_client(experimentPoint, experimentId, user)
// validate_local(condition1, condition2)
// deleteExperiment_server(name)

import {
  ASSIGNMENT_UNIT,
  CONSISTENCY_RULE,
  POST_EXPERIMENT_RULE,
  EXPERIMENT_STATE,
} from 'ees_types';
import fetch from 'node-fetch';

interface IUser {
  id: string;
  group: any;
  workingGroup: any;
}

export enum Validation {
  Equal = 'equal',
  NotEqual = 'notEqual',
}

const baseUrl = `http://upgrade-development.us-east-1.elasticbeanstalk.com/api/`;

export async function init_client(
  userId: string,
  group?: any,
  workingGroup?: any
): Promise<IUser> {
  const url = `${baseUrl}experimentusers`;
  const postData = JSON.stringify([
    {
      id: userId,
      group: group || {},
      workingGroup: workingGroup || {},
    },
  ]);

  const result: IUser[] = await fetch(url, {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(error => console.log(error));

  return result[0];
}

export async function setGroupMembership_client(
  userId: string,
  group: any
): Promise<IUser> {
  const url = `${baseUrl}groupmembership`;
  const postData = JSON.stringify({
    id: userId,
    group,
  });

  const result: IUser = await fetch(url, {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(error => console.log(error));

  return result;
}

export async function setWorkingGroup_client(
  userId: string,
  workingGroup: any
): Promise<IUser> {
  const url = `${baseUrl}workinggroup`;
  const postData = JSON.stringify({
    id: userId,
    workingGroup,
  });

  const result: IUser = await fetch(url, {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(error => console.log(error));

  return result;
}

interface ISegmentDefinition {
  id: string;
  point: string;
}
export async function defineExperiment_server(
  name: string,
  segmentDefinition: ISegmentDefinition[],
  conditions: string[],
  unitOfAssignment: ASSIGNMENT_UNIT,
  consistencyRule: CONSISTENCY_RULE,
  postExperimentRule: POST_EXPERIMENT_RULE,
  group?: string
) {
  const url = `${baseUrl}experiments`;
  const postData = JSON.stringify({
    name: name,
    description: '',
    startOn: null,
    consistencyRule,
    assignmentUnit: unitOfAssignment,
    postExperimentRule,
    state: 'inactive',
    tags: [],
    group: group || undefined,
    conditions: conditions.map((condition, index) => {
      return {
        assignmentWeight: (1 / conditions.length) * 100,
        conditionCode: condition,
        twoCharacterId: `C${index}`,
      };
    }),
    partitions: segmentDefinition.map((segmentInd, index) => ({
      id: `${segmentInd.id}_${segmentInd.point}`,
      point: segmentInd.point,
      name: segmentInd.id,
      description: '',
      twoCharacterId: `S${index}`,
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
    .catch(error => console.log(error));

  return result;
}

async function getAllExperiment() {
  const url = `${baseUrl}experiments`;
  const result = await fetch(url)
    .then(res => res.json())
    .catch(error => console.log(error));
  return result;
}

export async function setExperimentStatus_server(
  name: string,
  state: EXPERIMENT_STATE
) {
  // get all experiment
  const allExperiment = await getAllExperiment();
  const experiment: any = allExperiment.find(
    (experiment: any) => experiment.name === name
  );
  const url = `${baseUrl}state`;
  const postData = JSON.stringify({
    experimentId: experiment.id,
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
    .catch(error => console.log(error));
  return result && result[0];
}

export async function deleteExperiment_server(name: string) {
  const allExperiment = await getAllExperiment();
  const experiment: any = allExperiment.find(
    (experiment: any) => experiment.name === name
  );
  if (experiment) {
    const url = `${baseUrl}experiments/${experiment.id}`;
    const result = await fetch(url, { method: 'DELETE' })
      .then(res => res.json())
      .catch(error => console.log(error));
    return result;
  }
}

export async function getAllExperimentConditions_client(user: IUser) {
  const url = `${baseUrl}assign`;
  const postData = JSON.stringify({
    userId: user.id,
  });

  const result = await fetch(url, {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(error => console.log(error));

  return result;
}

export function getExperimentCondition_client(
  experimentCondition: any,
  experimentPoint: string,
  experimentId: string
) {
  const expCondition = experimentCondition.find((condition: any) => {
    return (condition.name =
      experimentId && condition.point === experimentPoint);
  });
  return (
    (expCondition && expCondition.assignedCondition.conditionCode) || 'default'
  );
}

export async function markExperimentPoint_client(
  experimentPoint: string,
  experimentId: string,
  user: IUser
) {
  const postData = JSON.stringify({
    experimentId,
    experimentPoint,
    userId: user.id,
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
    .catch(error => console.log(error));
  return result;
}

export async function validate_local(
  condition1: string,
  condition2: string,
  validation: Validation,
  validationName?: string
) {
  switch (validation) {
    case Validation.Equal:
      return condition1 === condition2
        ? console.log('\x1b[32m', `${validationName} ======> Passed`)
        : console.log('\x1b[31m', `${validationName} ======> Failed`);
    case Validation.NotEqual:
      return condition1 !== condition2
        ? console.log('\x1b[32m', `${validationName} ======> Passed`)
        : console.log('\x1b[31m', `${validationName} ======> Failed`);
  }
}
