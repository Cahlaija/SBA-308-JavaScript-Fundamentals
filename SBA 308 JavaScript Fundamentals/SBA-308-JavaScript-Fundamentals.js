// SAMPLE DATA
const courseInfo = {
    id: 451,
    name:"Introduction to Javascript"
};

const AssignmentGroup = {
    id: 1,
    name:"Fundamentals",
    course_id:451,
    group_weight:100
,
assignments:[
    {id:1,
        name: "Variables",
        due_at: "2024-01-25",
        points_possible:50
    },
    {
        id: 2,
        name:"Functions",
        due_at:"2024-01-30",
        points_possible:100
    },
{
    id:3,
    name:"Objects",
    due_at:"2099-12-31",//Future assignemnt (should be ignored)
    points_possible:75
}
]
};
const learnerSubmissions = [
    {
    learner_id:132,
    assignment_id:1,
    submission:{
        submitted_at:"2024-01-25",
        score:39
    }
},
{
    learner_id:132,
    assignment_id:2,
    submission:{
        submitted_at:"2024-01-29",
        score:85
    }
}
];


//HELPER FUNCTIONS

//Check if value is a valid number function isValidMumber(value){
function isValidNumber(value){
return typeof value === "number" && !isNaN(value);
}

//Determine whether an assignment is due yet
function isAssignmentDue(dueDate){
const today = new Date();
return new Date(dueDate)<=today;
}

//Apply late penalty if submission is after due date
function applyLatePenalty(score,submittedAt,dueAt,pointsPossible){
    let adjustedScore = score;
    if (new Date(submittedAt)>new Date(dueAt)){
        adjustedScore = score - (pointsPossible * 0.10);
}

//Prevent negative scores
if (adjustedScore<0){
    adjustedScore =0;
}

return adjustedScore;
}

//Find assignment info by assignment ID
function findAssignmentById(assignments,assignmentId){
    for (const assignment of assignments){
        if (assignment.id === assignmentId){
            return assignment;
        }
    }
    return null;
}

//Main Funtion

function getLearnerData(course, assignmentGroup, submissions){
try {



if (assignmentGroup.course_id !== course.id){
throw new Error("Assignment group does not belong to this course.");
}


const learners ={};



for(const submission of submissions){
const assignment = findAssignmentById(
assignmentGroup.assignments,
submission.assignment_id
);
if (!assignment){
continue;
}


//Ignore future Assignments
if(!isAssignmentDue(assignment.due_at)){
    continue;
}

if (
    !isValidNumber(assignment.points_possible) ||
    assignment.points_possible <=0
) {
throw new Error(
    `Invalid points possible for assignment ${assignment.id}`
);
}
let score = submission.submission.score;

if (!isValidNumber(score)){
    throw new Error(
        `Invalid score for learner ${submission.learner_id}`
    );
}

score = applyLatePenalty(
    score,
    submission.submission.submitted_at,
    assignment.due_at,
    assignment.points_possible
);

const learnerId = submission.learner_id;


if (!learners[learnerId]) {
learners[learnerId] = {
id: learnerId,
totalEarned: 0,
totalPossible: 0
};
}

const percentage = score / assignment.points_possible;

learners[learnerId][assignment.id] = Number(
percentage.toFixed(2)
);

learners[learnerId].totalEarned +=  score;
learners[learnerId].totalPossible += assignment.points_possible;

}
const results =[];

for (const learnerId in learners) {
const learner = learners[learnerId];

learner.avg = Number(
(
learner.totalEarned /
learner.totalPossible
).toFixed(2)
);

//Demostrate object property removal
delete learner.totalEarned;
delete learner.totalPossible;

results.push(learner);
}

return results;

} catch (error){
    console.error("Error:", error.message);
    return [];
}
}

// output
console.log(
getLearnerData(
    courseInfo,
    AssignmentGroup,
    learnerSubmissions
)
);
//validate that the assignment group belongs to the course

