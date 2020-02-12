# Command-Line-Test-EES

### Node command line compatible script for testing EES system

## Pre-requirement

Node should be installed

##### To check type `node -v`

## Start Running Script

1. Clone github project from [Command-Line-Test-EES](https://github.com/CarnegieLearningWeb/educational-experiment-test-cli)
2. Run 
`npm install`
3. Load the script into node console
   `SCRIPT={scenario1.js} npm run script`

## API

- **defineUser_local(userId, [{groupName, groupId}])**  
  Create new user 
  `defineUser_local("1", [{"class", "1"}])`
- **setUserGroup_local(userId, groupName, groupId)**  
  Change user group  
  `setUserGroup_local("1", "class", "2")`
- **defineExperiment_server(name, [{id, point}], [conditions], unitOfAssignment, consistencyRule, postExperimentRule, group)** 
  Create new experiment  
  `defineExperiment_server("Experiment1", [{ id: 'W2', point: 'WorkSpace' }], ['A', 'B'], ASSIGNMENT_UNIT.INDIVIDUAL, CONSISTENCY_RULE.INDIVIDUAL, POST_EXPERIMENT_RULE.CONTINUE, 'class')`
- **setExperimentStatus_server(name, state)**  
  Change experiment status  
  `setExperimentStatus_server("Experiment1", EXPERIMENT_STATE.PREVIEW)`
- **getAllExperimentConditions_client(userId)**  
  Assign experiment condition to all the experiment for a user and return array of experiment conditions assigned  
  `getAllExperimentConditions_client(user)`
- **getExperimentCondition_client(experimentCondition, experimentPoint, experimentId)**  
  Return Experiment Condition assigned for the Experiment Point and Experiment Id  
  `getExperimentCondition_client(experimentCondition, 'WorkSpace', 'W2')`
- **markExperimentPoint_client(userEnvironment, experimentPoint, experimentId, user)**  
  Marks the experiment point for a User  
  `markExperimentPoint_client('WorkSpace', 'W2', user1)`
- **markExperimentPoint(experimentId: string, experimentPoint: string, userId: string, groupType: string, groupId: string)**  
  Marks the experiment point for a User  
  `markExperimentPoint("W1", "Workspace", "1", "class", "1")`
- **validate_local(condition1, condition2, validation, validationName)**  
  Validate locally condition1 and condition2  
  `validate_local('A', 'A', Validation.Equal, 'Pass')`
- **deleteExperiment_server(name)**  
  Delete Experiment by name  
  `deleteExperiment_server(name)`
