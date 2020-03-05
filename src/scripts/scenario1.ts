import {
  Validation,
  init_client,
  setGroupMembership_client,
  setWorkingGroup_client,
} from '../lib/index';
import {
  getExperimentCondition_client,
  deleteExperiment_server,
  validate_local,
} from '../lib/index';
import {
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
  // creating user
  await init_client('1');
  await init_client('2');
  await init_client('3');

  // creating group
  await setGroupMembership_client('1', {
    class: ['1', '2'],
  });
  await setGroupMembership_client('2', {
    class: ['1', '2'],
  });
  await setGroupMembership_client('3', {
    class: ['1', '2'],
  });

  // creating working group
  const user1 = await setWorkingGroup_client('1', { class: '1' });
  const user2 = await setWorkingGroup_client('2', { class: '1' });
  const user3 = await setWorkingGroup_client('3', { class: '1' });

  const experimentName = 'experiment1';

  // Delete experiment
  await deleteExperiment_server(experimentName);

  // ================    define experiment
  await defineExperiment_server(
    experimentName,
    [{ id: 'W2', point: 'WorkSpace' }],
    ['A', 'B'],
    ASSIGNMENT_UNIT.INDIVIDUAL,
    CONSISTENCY_RULE.INDIVIDUAL,
    POST_EXPERIMENT_RULE.CONTINUE
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
  let user2conditionEnrolling = getExperimentCondition_client(
    user2Conditions,
    'WorkSpace',
    'W2'
  );
  validate_local(
    user2conditionEnrolling,
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
    Validation.Equal,
    `[${experimentStateUpdate.state}] user1 is default`
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
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user2 is not default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user2);

  validate_local(
    condition,
    user2conditionEnrolling,
    Validation.Equal,
    `[${experimentStateUpdate.state}] user2 condition is same as assigned in enrolling state`
  );

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
