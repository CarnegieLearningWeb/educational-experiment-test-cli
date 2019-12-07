# Command-Line-Test-EES
### Node command line compatible script for testing EES system

## Pre-requirement
Node should be installed
##### To check type `node -v`


## Start Running Script
1. Download [index.js](https://github.com/VivekFitkariwala/Command-Line-Test-EES/blob/master/dist/index.js "index.js") from [Command-Line-Test-EES](https://github.com/VivekFitkariwala/Command-Line-Test-EES "Command-Line-Test-EES")
2. Start node console
`node`
1. Load the script into node console
`.load $path of download script`

## API
- **getAllUsers()**  
List all the users in the experiment system  
`getAllUsers()`  
- **defineUser(userId:string, groupName:string, groupId:string)**  
Create new user  
`defineUser("1", "class", "1")`  
- **setUserGroup(userId:string, groupName:string, groupId:string)**  
Change user group  
`setUserGroup("1", "class", "1")`  
- **getAllExperiments()**  
List all the experiments in the experiment system  
`getAllExperiment()`  
- **defineExperiment(id:string, point:string, group:string, unitOfAssignment:string, consistencyRule:string, postExperimentRule:string, conditions:string[])**  
Create new experiment  
`defineExperiment("W1", "Workspace", "class", "individual", "group", "revertToDefault", ["C1", "C2"])`  
- **setExperimentStatus(experimentId: string, state: string)**  
Change experiment status  
`setExperimentStatus("1dc0f595-262b-44d0-8d2d-3ff121c031bc", "enrolling")`  
- **getAllExperimentConditions(userId: string, groupName: string, groupId: string)**  
Assign experiment condition to all the experiment for a user and return array of experiment conditions assigned  
`getAllExperimentConditions("1", "class", "1")`  
- **getExperimentCondition(experimentId: string, experimentPoint: string)**  
Get Experiment's Condition  
`getExperimentCondition("W1", "Workspace")`  
- **markExperimentPoint(experimentId: string, experimentPoint: string, userId: string, groupName: string, groupId: string)**  
Marks the experiment point for a User  
`markExperimentPoint("W1", "Workspace", "1", "class", "1")`  
- **getGroupAssignments()**  
List all the group assignments in the experiment system  
`getGroupAssignment()`  
- **getIndividualAssignments()**  
List all the individual assignments in the experiment system  
`getIndividualAssignment()`  
- **getGroupExclusions()**  
List all the group exclusion in the experiment system  
`getGroupExclusion()`  
- **getIndividualExclusions()**  
List all the individual exclusion in the experiment system  
`getIndividualExclusion()`  
- **getMonitoredExperimentPoints()**  
List all the monitored experiment points in the experiment system  
`getMonitoredExperimentPoint()`  

## Enum Values
###### CONSISTENCY RULE
- individual
- experiment
- group
###### ASSIGNMENT UNIT
- individual
- group
###### POST EXPERIMENT RULE
- continue
- revertToDefault
###### EXPERIMENT STATE
- inactive
- demo
- scheduled
- enrolling
- enrollmentComplete
- cancelled
## Postman Link
Import http calls from this postman [link](https://www.getpostman.com/collections/0a0cf0c77eb203eb231f "link")
