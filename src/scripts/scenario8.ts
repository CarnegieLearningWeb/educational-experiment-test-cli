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
  await init_client('4');

  // creating group
  await setGroupMembership_client('1', {
    class: ['1'],
  });
  await setGroupMembership_client('2', {
    class: ['2'],
  });
  await setGroupMembership_client('3', {
    class: ['2'],
  });
  await setGroupMembership_client('4', {
    class: ['1'],
  });

  // creating working group
  let user1 = await setWorkingGroup_client('1', { class: '1' });
  const user2 = await setWorkingGroup_client('2', { class: '2' });
  const user3 = await setWorkingGroup_client('3', { class: '2' });
  const user4 = await setWorkingGroup_client('4', { class: '1' });

  const experimentName = 'experiment1';

  // Delete experiment
  await deleteExperiment_server(experimentName);

  // ================    define experiment
  await defineExperiment_server(
    experimentName,
    [{ id: 'W2', point: 'WorkSpace' }],
    ['A', 'B'],
    ASSIGNMENT_UNIT.GROUP,
    CONSISTENCY_RULE.GROUP,
    POST_EXPERIMENT_RULE.CONTINUE,
    'class'
  );

  // ================ Enrolling State =================
  let experimentStateUpdate = await setExperimentStatus_server(
    experimentName,
    EXPERIMENT_STATE.ENROLLING
  );

  // ---- user 1
  let user1Conditions = await getAllExperimentConditions_client(user1);
  let user1OldAssignedConditionEnrolling = getExperimentCondition_client(
    user1Conditions,
    'WorkSpace',
    'W2'
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user1);

  validate_local(
    user1OldAssignedConditionEnrolling,
    'default',
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user1 is not default`
  );

  // --- user 3
  let user3Conditions = await getAllExperimentConditions_client(user3);
  let user3conditionEnrolling = getExperimentCondition_client(
    user3Conditions,
    'WorkSpace',
    'W2'
  );
  validate_local(
    user3conditionEnrolling,
    'default',
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user3 is not default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user3);

  // ----- user1 group change
  await setGroupMembership_client('1', {
    class: ['2'],
  });
  user1 = await setWorkingGroup_client('1', { class: '2' });

  validate_local(
    user1.workingGroup.class,
    '2',
    Validation.Equal,
    `[${experimentStateUpdate.state}] user3 working group for class is changed to 2`
  );

  user1Conditions = await getAllExperimentConditions_client(user1);
  let condition = getExperimentCondition_client(
    user1Conditions,
    'WorkSpace',
    'W2'
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user1);

  validate_local(
    condition,
    'default',
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user1 is not default`
  );

  validate_local(
    condition,
    user3conditionEnrolling,
    Validation.Equal,
    `[${experimentStateUpdate.state}] user1 condition is same as user3 condition`
  );

  // ------- user 2
  let user2Conditions = await getAllExperimentConditions_client(user2);
  let user2conditionEnrolling = getExperimentCondition_client(
    user2Conditions,
    'WorkSpace',
    'W2'
  );
  validate_local(
    user2conditionEnrolling,
    user3conditionEnrolling,
    Validation.Equal,
    `[${experimentStateUpdate.state}] user2 is same as user3 assigned condition`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user3);

  //   ================ Enrollment Complete State =================
  experimentStateUpdate = await setExperimentStatus_server(
    experimentName,
    EXPERIMENT_STATE.ENROLLMENT_COMPLETE
  );

  // ---- user 1
  user1Conditions = await getAllExperimentConditions_client(user1);
  let user1conditionEnrolmentComplete = getExperimentCondition_client(
    user1Conditions,
    'WorkSpace',
    'W2'
  );
  validate_local(
    user1conditionEnrolmentComplete,
    'default',
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user1 is not default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user1);

  validate_local(
    user1conditionEnrolmentComplete,
    user3conditionEnrolling,
    Validation.Equal,
    `[${experimentStateUpdate.state}] user1 condition is same as user 3 condition during enrolling`
  );

  // --- user 2
  user2Conditions = await getAllExperimentConditions_client(user2);
  let user2conditionEnrolmentComplete = getExperimentCondition_client(
    user2Conditions,
    'WorkSpace',
    'W2'
  );
  validate_local(
    user2conditionEnrolmentComplete,
    'default',
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user2 is not default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user2);

  validate_local(
    user2conditionEnrolmentComplete,
    user2conditionEnrolling,
    Validation.Equal,
    `[${experimentStateUpdate.state}] user2 condition is same as assigned in enrolling state`
  );

  validate_local(
    user1conditionEnrolmentComplete,
    user2conditionEnrolmentComplete,
    Validation.Equal,
    `[${experimentStateUpdate.state}] user2 condition is same as assigned to user1`
  );

  // --- user 3
  user3Conditions = await getAllExperimentConditions_client(user3);
  condition = getExperimentCondition_client(user3Conditions, 'WorkSpace', 'W2');
  validate_local(
    condition,
    'default',
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user3 is not default`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user3);

  validate_local(
    condition,
    user3conditionEnrolling,
    Validation.Equal,
    `[${experimentStateUpdate.state}] user3 condition is same as assigned in enrolling state`
  );

  // --- user 4
  let user4Conditions = await getAllExperimentConditions_client(user4);
  condition = getExperimentCondition_client(user4Conditions, 'WorkSpace', 'W2');
  validate_local(
    condition,
    'default',
    Validation.NotEqual,
    `[${experimentStateUpdate.state}] user4 is not default`
  );
  validate_local(
    condition,
    user1OldAssignedConditionEnrolling,
    Validation.Equal,
    `[${experimentStateUpdate.state}] user4 condition is same as assigned user1 for the first time when his group was 1`
  );
  await markExperimentPoint_client('WorkSpace', 'W2', user4);
}

init();
