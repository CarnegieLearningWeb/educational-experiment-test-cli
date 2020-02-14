import { Validation } from '../lib/index';
import {
  getExperimentCondition_client,
  deleteExperiment_server,
  validate_local,
} from '../lib/index';
import {
  defineUser_local,
  getAllExperimentConditions_client,
  setExperimentStatus_server,
  defineExperiment_server,
  markExperimentPoint_client,
} from '../lib/index';
import {
  ASSIGNMENT_UNIT,
  CONSISTENCY_RULE,
  POST_EXPERIMENT_RULE,
  EXPERIMENT_STATE,
} from 'ees_types';

async function init() {
  const user1 = defineUser_local('1', { class: '1' });
  const user2 = defineUser_local('2', { class: '1' });
  const user3 = defineUser_local('3', { class: '1' });

  const experimentName = 'experiment1';

  // Delete experiment
  await deleteExperiment_server(experimentName);

  // ================    define experiment
  await defineExperiment_server(
    experimentName,
    [{ id: 'W2', point: 'WorkSpace' }],
    ['A', 'B'],
    ASSIGNMENT_UNIT.INDIVIDUAL,
    CONSISTENCY_RULE.EXPERIMENT,
    POST_EXPERIMENT_RULE.REVERT
  );

  // ================ PREVIEW State =================
  let experimentStateUpdate = await setExperimentStatus_server(
    experimentName,
    EXPERIMENT_STATE.PREVIEW
  );

  // ---- user 1
  let user1Conditions = await getAllExperimentConditions_client(user1);
  let condition = getExperimentCondition_client(
    user1Conditions,
    'WorkSpace',
    'W2'
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user1);

  validate_local(
    condition,
    'default',
    Validation.Equal,
    `[${experimentStateUpdate.state}] user1 is default`
  );

  // ================ Enrolling State =================
  experimentStateUpdate = await setExperimentStatus_server(
    experimentName,
    EXPERIMENT_STATE.ENROLLING
  );

  // --- user 2
  let user2Conditions = await getAllExperimentConditions_client(user2);
  condition = getExperimentCondition_client(user2Conditions, 'WorkSpace', 'W2');
  validate_local(
    condition,
    'default',
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user2 is not default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user2);

  // ---- user 1
  user1Conditions = await getAllExperimentConditions_client(user1);
  condition = getExperimentCondition_client(user1Conditions, 'WorkSpace', 'W2');
  validate_local(
    condition,
    'default',
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user1 is not default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user1);

  // ================ Enrollment Complete State =================
  experimentStateUpdate = await setExperimentStatus_server(
    experimentName,
    EXPERIMENT_STATE.ENROLLMENT_COMPLETE
  );

  // ---- user 1
  user1Conditions = await getAllExperimentConditions_client(user1);
  condition = getExperimentCondition_client(user1Conditions, 'WorkSpace', 'W2');
  validate_local(
    condition,
    'default',
    Validation.Equal,
    `[${experimentStateUpdate.state}] user1 is default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user1);

  // --- user 2
  user2Conditions = await getAllExperimentConditions_client(user2);
  condition = getExperimentCondition_client(user2Conditions, 'WorkSpace', 'W2');
  validate_local(
    condition,
    'default',
    Validation.Equal,
    `[${experimentStateUpdate.state}] user2 is default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user2);

  // --- user 3
  let user3Conditions = await getAllExperimentConditions_client(user3);
  condition = getExperimentCondition_client(user3Conditions, 'WorkSpace', 'W2');
  validate_local(
    condition,
    'default',
    Validation.Equal,
    `[${experimentStateUpdate.state}] user3 is default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user3);
}

init();
