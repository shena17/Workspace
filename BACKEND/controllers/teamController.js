const Team = require("../models/Team.model");
const User = require("../models/User.model");
const Project = require("../models/Project.model");
const Task = require("../models/Task.model")

//CREATE TEAM
const createTeam = async (req, res) => {
  try {
    const { teamName, description, members } = req.body;
    members.push(req.user.id);

    // Check if the same Team name exists
    const teamExists = await Team.findOne({ teamName });

    if(teamExists){
      res.status(401).json({
        errorMessage: "Team name already exists! Please choose another name.",
        status: false
      })
    }else{
    const team = await Team.create({
      teamName,
      description,
      members,
    });
    

    if (team) {
      res.status(200).json({
        data: "Team created successfully",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed to create team",
        status: false,
      });
    }
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Error : " + e,
      status: false,
    });
  }
};

//GET SPECIFIC TEAM
const getTeam = async (req, res) => {
  let teamId = req.params.id;

  await Team.findById(teamId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

//GET ALL TEAMS
const getAllTeams = async (req, res) => {
  await Team.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};

//DELETE TEAM
const deleteTeam = async (req, res) => {
  let teamId = req.params.id;

  const projectExist = await Project.findOne({ team:teamId })

  if(projectExist === null){
    await Team.findByIdAndDelete(teamId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });

  }
  else{
    res.status(401).json({
      errorMessage: "Cannot Delete Team ! This team has allocated projects",
      status: false,
    });
  }

  console.log(projectExist)
};

//UPDATE TEAM
const updateTeam = async (req, res) => {
  try {
    const { currentTeam, teamName, description, members } = req.body;
    members.push(req.user.id);

    const teamExists = await Team.findOne({ teamName });

    if (teamExists && teamExists.teamName !== currentTeam) {
      res.status(401).json({
        errorMessage: "Cannot Update! Team name already exists, Please choose another name.",
        status: false,
      });
    } else {
      //const updateTeam = {teamName, description}
      // members.push(req.user.id)
      const update = await Team.findByIdAndUpdate(req.params.id, {
        teamName,
        description,
        members,
      });

      if (update) {
        res.status(200).json({
          data: "Team updated",
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: "Failed to update",
          status: false,
        });
      }
    }
  } catch (error) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

//================================================//
//OTHER API

//
const getRelevantTeams = async (req, res) => {
  let userId = req.user.id;

  await Team.find({ members: userId })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getRelevantTeams2 = async (req, res) => {
  let userId = req.user.id;

  var teamIds = [];
  var teamName = [];
  var memberCount = [];
  var memberDetails = [];
  var projectCount = [];
  var totalScore = [];
  var leaders = []

  var projects = [];
  var teamCards = [];

  const teams = await Team.find({ members: userId }).populate({ path: "members" })

  const desiredCharacteristics = {
    role: "leader",
  };

  teams.forEach(async (team) => {
    teamIds.push(team._id);
    teamName.push(team.teamName);
    memberCount.push(team.members.length);
    memberDetails.push(team.members);

    const leader = team.members.filter((node)=>{
     
      for(const key in desiredCharacteristics){
        if(node[key] !== desiredCharacteristics[key]){
          return false
        }
      }

      return true
    })

    leaders.push(leader)
    
  })

  for (var i = 0; i < teamIds.length; i++) {
    projects = await Project.find({ team: teamIds[i] });

    var score = 0;
    projects.forEach((proj) => {
      score += proj.credits;
    });

    totalScore.push(score);
    projectCount.push(projects.length);

    teamCards.push({
      teamId: teamIds[i],
      team: teamName[i],
      leader: leaders[i],
      memberCount: memberCount[i],
      projectCount: projectCount[i],
      score: totalScore[i],
      memberDetails: memberDetails[i],
    });
  }

  res.json(teamCards)

    
};

//GET USERS WITHOUT Leaders
const getUsersWithoutLeaders = async (req, res) => {
  const abc = await User.find({ role: { $eq: "employee" } })
    .then((users) => {
      res.json(users);
    })
    .catch((e) => {
      console.log(e);
    });
};

const returnLoggedId = async(req,res)=>{
  var loggedId = req.user.id 

  const user = await User.findOne({ _id: loggedId })
  .then((users) => {
    res.json(users);
  })
  .catch((e) => {
    console.log(e);
  });
}

//GET TEAM MEMBER DETAILS // view team pages details fetch
const getTeamMembers = async (req, res) => {
  var currentTeam = ({});

  const team = await Team.findById(req.params.id).populate({path: "members"})
  const projects = await  Project.find({ team: req.params.id })
  
  var score = 0;
      projects.forEach((proj) => {
        score += proj.credits;
  });

  currentTeam = {
    teamName: team.teamName,
    description: team.description,
    memberCount: team.members.length,
    projectCount: projects.length,
    score: score,
    members: team.members,
    projects: projects

  }

  res.json(currentTeam)
};

//GET TEAM MEMBER DETAILS
const getTeamMembersForEdit = async (req, res) => {
  await Team.findById(req.params.id)
    .populate({
      path: "members",
      match: { _id: { $ne: req.user.id } },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};

//GET ALL TEAM DETAILS
const getReport = async (req, res) => {
  await Project.find()
    .populate({
      path: "team",
      populate: [
        {
          path: "members",
        },
      ],
    })
    .then((data) => {
      res.json(data);
    })

    .catch((err) => {
      res.json(err);
    });
};

const getReport2 = async (req, res) => {
  // Getting team ids
  var teamIds = [];
  var teamName = [];
  var teamProjects = [];
  var projects = [];
  var members = [];

  try {
    const teams = await Team.find();

    teams.forEach(async (team) => {
      teamIds.push(team._id);
      teamName.push(team.teamName);
    });

    for (var i = 0; i < teamIds.length; i++) {
      for (var j = 0; j < teamIds.length; j++) {
        projects = await Project.find({ team: teamIds[i] });
      }

      members.push(
        await Team.findById(teamIds[i]).populate("members", "fullName")
      );

      var names = [];

      members[i].members.forEach((member) => {
        names.push(member.fullName);
      });

      var proj = [];

      projects.forEach((project) => {
        proj.push(project.projectName);
      });

      teamProjects.push({
        team: teamName[i],
        projects: proj,
        members: names,
      });
    }

    res.json(teamProjects);
  } catch (error) {
    console.log(error);
  }
};

const leaderboard = async (req, res) => {
  var teamIds = [];
  var teamName = [];
  var memberCount = [];
  var projectCount = [];
  var totalScore = [];
  var teamLeader = [];
  var leaderBoardRow = [];

  var projects = [];

  try {
    const teams = await Team.find();

    teams.forEach(async (team) => {
      teamIds.push(team._id);
      teamName.push(team.teamName);
      memberCount.push(team.members.length);
    });

    for (var i = 0; i < teamIds.length; i++) {
      projects = await Project.find({ team: teamIds[i] });

      var score = 0;
      projects.forEach((proj) => {
        score += proj.credits;
      });

      totalScore.push(score);
      projectCount.push(projects.length);

      leaderBoardRow.push({
        teamId: teamIds[i],
        team: teamName[i],
        memberCount: memberCount[i],
        projectCount: projectCount[i],
        score: totalScore[i],
      });
    }

    leaderBoardRow.sort((a,b)=>{
      return b.score - a.score
    })
    res.json(leaderBoardRow);
    
  } catch (error) {
    console.log(error);
  }
};

const leaderboard2 = async (req, res) => {
  var teamIds = [];
  var teamName = [];
  var memberCount = [];
  var memberDetails = [];
  var projectCount = [];
  var totalScore = [];

  var projects = [];

  var leaderBoardRow = [];

  try {
    const teams = await Team.find().populate({ path: "members" });

    teams.forEach(async (team) => {
      teamIds.push(team._id);
      teamName.push(team.teamName);
      memberCount.push(team.members.length);
      memberDetails.push(team.members);
    });

    for (var i = 0; i < teamIds.length; i++) {
      projects = await Project.find({ team: teamIds[i] });

      var score = 0;
      projects.forEach((proj) => {
        score += proj.credits;
      });

      totalScore.push(score);
      projectCount.push(projects.length);

      leaderBoardRow.push({
        teamId: teamIds[i],
        team: teamName[i],
        memberCount: memberCount[i],
        projectCount: projectCount[i],
        score: totalScore[i],
        memberDetails: memberDetails[i],
      });
    }

    leaderBoardRow.sort((a, b) => {
      return b.score - a.score;
    });
    res.json(leaderBoardRow);
  } catch (error) {
    console.log(error);
  }
};


const trackEmployee = async (req, res) => {

  var taskId = []
  var taskname = []
  var assignee = []
  var projectName = []
  var isStarted = []

  var tEmp = []
  const Tasks = await Task.find().populate("assignee", {"fullName": 1}).populate("projectId", {"projectName":1})
  
  Tasks.forEach(async(task)=>{
      taskId.push(task._id)
      taskname.push(task.taskName)
      assignee.push(task.assignee.fullName)
      projectName.push(task.projectId?.projectName)
      isStarted.push(task.isStarted)
  })

  for (var i = 0; i < taskId.length; i++) {
    tEmp.push({
      taskId:taskId[i],
      taskname:taskname[i],
      assignee:assignee[i],
      projectName:projectName[i],
      isStarted:isStarted[i]
    })
  }

  res.json(tEmp)
}

const trackEmployee2 = async (req, res) => {

  let teamId = req.params.id;

  var projectId = []
  var projectName = []
  var taskList = []
  

  var retDetails = []

  const projects  = await Project.find({ team: teamId })

  projects.forEach(async(project)=>{
    projectId.push(project._id)
    projectName.push(project.projectName)

    taskList = await Task.find({projectId: project._id})
  })


  
  console.log(projectId)
  console.log(projectName)
  console.log(taskList)
  
}

module.exports = {
  createTeam,
  getTeam,
  getAllTeams,
  getReport,
  deleteTeam,
  updateTeam,
  getRelevantTeams,
  getRelevantTeams2,
  getUsersWithoutLeaders,
  getTeamMembers,
  getTeamMembersForEdit,
  getReport2,
  leaderboard,
  leaderboard2,
  trackEmployee,
  trackEmployee2,
  returnLoggedId
};
