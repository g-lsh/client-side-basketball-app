import React, { Component } from 'react';
import Navbar from './navbar.jsx'
import DivisionCards from './DivisionCard.jsx'
import TeamCards from './TeamCards.jsx'
import PlayerCards from './playercards.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import '../styles/App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import jwtDecode from'jwt-decode';

injectTapEventPlugin();
//Hello
//--------------------------------------------------------------------

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamCardsAppear: false,
      playerCardsAppear: false,
      Conference:true,
      teamPlayers: null,
      selectedPlayers: [],
      userID: null,
      customTeams: []

      // selectedTeam:null
    };
  }
//--------------------------------------------------------------------
  
  loadUser = () => {
    let token = sessionStorage.getItem('token');
    let decoded = jwtDecode(token)
      console.log('decoded',decoded)
      console.log(decoded.email)
      this.setState({currentUser:decoded.email})
  }


  getTeams = () => {
    fetch(`http://www.localhost:3000/teams`)
      .then((response) => {
        return response.json()
      })
      .then((teams) => {
        console.log(`this are all the teams`, teams)
        this.setState({teams})
      })
  }

  getCustomTeams = () => {
    fetch(`http://www.localhost:3000/custom_teams/`, {
      method:'GET',
      headers: {
        "Authorization" : `Bearer ${sessionStorage.getItem('token')} `
      }
    })
     .then(response => {
      if (response.status >= 400) {
        throw new Error('la;sdkfj')
      }
      return response

     })
     .then((response) => response.json())
     .then((responseJson) => {
       
       let customTeams = responseJson
       console.log(customTeams);
       this.setState({customTeams})
     })
     .catch((err) => {
       console.log("There's an error")
     })
  }

  addPlayerCustomTeams = (custom_team_id, player_id) => {
    console.log("customid",custom_team_id,"playerid",player_id)
    fetch(`http://www.localhost:3000/custom_teams/${custom_team_id}/${player_id}/add`, {
      method:'PUT',
      headers: {
        "Authorization" : `Bearer ${sessionStorage.getItem('token')} `
      }
    })
     .then((response) => response.json())
     .then((responseJson) => {
       console.log(responseJson);

     })
  }



  emptyHeadShot = (playerObject) => {
    if (playerObject.head_shot != null)
      return playerObject;
  }

  getPlayersFromTeam = (team_id) => {
    fetch(`http://www.localhost:3000/teams/${team_id}/players`)
      .then((response) => {
        return response.json()
      })
      .then((player_json) => {
        console.log(`this are the players from ${team_id}`,player_json)
        player_json = player_json.filter(this.emptyHeadShot)
        this.setState(
          {
            teamPlayers:player_json,
            playerCardsAppear: !this.state.playerCardsAppear
          }
        )
      })
  }
//--------------------------------------------------------------------
  selectPlayer = (player) => {
    let selectedPlayers = this.state.selectedPlayers
    let found = selectedPlayers.some((existPlayer) => {
      return existPlayer.id === player.id;
    })
    if (!found) {
      selectedPlayers.push(player)
      console.log("You just added a player")
      console.log(selectedPlayers);
      this.setState({selectedPlayers})
      console.log(this.state)
    }
  }

  getPlayerInfo = (player_id) => {
    fetch(`http://www.localhost:3000/players/${player_id}`)
      .then((response) => {
        return response.json()
      })
      .then((playerInfo) => {
      let player = playerInfo[0]
          console.log(`this is the player bio object:`, player)
          this.selectPlayer(player)
      })
  }

  deletePlayer = (selectPlayer) => {
    let newState = this.state.selectedPlayers;
    let found = newState.forEach((existPlayer) => {
      if (existPlayer.id === selectPlayer.id) {
        let position = newState.indexOf(selectPlayer)
        newState.splice(position, 1)
        this.setState({selectedPlayers:newState})
      }
    })
  }

  teamName = (event) => {
    let teamName = event.target.value
    this.setState({teamName:teamName})
  }

  selectPlayer_id = (selectedPlayers) => {
    let player_id = []
    selectedPlayers.forEach((object) => {
      player_id.push(object.id)
    })
    return player_id;
  }



  saveTeam = (teamName) => {
    if (this.state.selectedPlayers.length > 0 && teamName) {
    console.log("condition passed")
    let customTeam = {
      players: this.selectPlayer_id(this.state.selectedPlayers),
      name: teamName
    }

    let customTeamJSON = JSON.stringify(customTeam);
    console.log("customTeamJSON",customTeamJSON)
    fetch(`http://www.localhost:3000/custom_teams/new `, {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${sessionStorage.getItem('token')} `
      } ,
      cache: 'default',
      body: customTeamJSON,
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({
        selectedPlayers: []
      })
      
    });

   }
   else {
    console.log("Please Select Players and Provide a Team Name")
   }
  }
//----------------------------------------------------------------------
//This function is passed down as a prop to navbar.js, then to Registration.jsx
//checks to see if email and password are not blank, userInfo as JSON String, will
// be passed to server via post request
registerUser = (email, password) => {
   if (email != "" && password != "") {
   let userInfo = {
      email : email.trim(),
      password : password.trim()
    }

    let userInfoJSON = JSON.stringify(userInfo);
    console.log("userInfo object sending to server", userInfo)
    fetch(`http://www.localhost:3000/users/signup`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type" : "application/json",
        // "Authorization" : `Bearer ${this.state.token} `
      },
      cache: 'default',
      body: userInfoJSON,
    })
    .then(response => {
      if (response.status >= 400) {
        throw new Error('')
      }
      return response
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("responsejson",responseJson)
      sessionStorage.setItem('token',responseJson.token);
      console.log("Stored in SessionStorage");
      this.loadUser();
    })
    .catch((err) => {
      this.setState({RegisterError:"Email already exists"})
    })
      //The response coming back from the server will be a User ID
      // console.log("response",response.json)
      // let userID = response
      // cookie.save('UserID', userID, { path: '/' });
    }
     else {
      console.log("Missing information")
     }
  }
//--------------------------------------------------------------------
loginUser = (email,password) => {
  if (email != "" && password != "") {
   let userInfo = {
      email : email.trim(),
      password : password.trim()
    }
    let userInfoJSON = JSON.stringify(userInfo);
    console.log("userInfo object sending to server", userInfo)
    fetch(`http://www.localhost:3000/users/signin`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type" : "application/json",
      },
      cache: 'default',
      body: userInfoJSON,
    })
    .then(response => {
      if (response.status >= 400) {
        throw new Error("Wrong Password")
      }
      return response
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("responsejson",responseJson)
      sessionStorage.setItem('token',responseJson.token);
      this.loadUser();

      console.log("Stored");
    })
    .catch((err) => {
      this.setState({LoginError:"Incorrect Login Information"})
    })
  }

 else {
  console.log("Missing information")
 }
}

logoutUser = () => {
  sessionStorage.clear();
  console.log("JWT session cleared")
  this.setState({currentUser:""})
}
//--------------------------------------------------------------------
  getPlayerBoxscores = (player_id) => {
    fetch(`http://www.localhost:3000/players/${player_id}/boxscores`)
      .then((response) => {
        return response.json()
      })
      .then((playerStats) => {
        console.log(`this is the player boxscores:`, playerStats)
        this.setState({playerStats})
      })
    }
//--------------------------------------------------------------------
  onWestern = () => {
    console.log("Western felt something")
    this.setState(
      {
        teamCardsAppear: !this.state.teamCardsAppear,
        Conference: false
      })
  }

  onEastern = () => {
    console.log("Eastern felt something")
    this.setState(
      {
        teamCardsAppear: !this.state.teamCardsAppear,
        Conference: true
      })
  }

//--------------------------------------------------------------------

  componentDidMount() {
    this.getTeams()
    this.getCustomTeams()
    this.loadUser()
    
  }
//--------------------------------------------------------------------


  render() {

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <section className="App">
          <Navbar className="Navbar"
            selectedPlayers={this.state.selectedPlayers}
            deletePlayer={this.deletePlayer}
            registerUser={this.registerUser}
            loginUser={this.loginUser}
            logoutUser={this.logoutUser}
            teamName={this.teamName}
            teamNameSnack={this.state.teamName}
            saveTeam={this.saveTeam}
            currentUser={this.state.currentUser}
            LoginError={this.state.LoginError}
            RegisterError={this.state.RegisterError}

          />
        <div className="Body">
          <DivisionCards
            onEastern={this.onEastern}
            onWestern={this.onWestern}
          />
          {
            this.state.teamCardsAppear ?
              <TeamCards className="teamCards"
                conferenceValue={this.state.Conference}
                getPlayersFromTeam={this.getPlayersFromTeam}
                teams={this.state.teams}
              />
            : null
          }
          {
            this.state.playerCardsAppear ?
              <PlayerCards
                getPlayerBoxscores={this.getPlayerBoxscores}
                getPlayerInfo={this.getPlayerInfo}
                playersData={this.state.teamPlayers}
                playerStats={this.state.playerStats}
                teams={this.state.teams}
                customTeams={this.state.customTeams}
                addPlayerCustomTeams={this.addPlayerCustomTeams}
              />
            : null
          }
        </div>
        <footer
            className="BottomBar"
        >
          {
            sessionStorage.getItem('token')?
            <div className="userName">Welcome {this.state.currentUser}</div>
            :null
          }
          
        </footer>
        </section>
      </MuiThemeProvider>
    );
  }
}
export default App;