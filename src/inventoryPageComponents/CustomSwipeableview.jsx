import React, {Component} from 'react';
import {Tabs,Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

const stationComponents = (playerStats = []) => {
  return playerStats.map((game,key)=> {
    return (
    <table key={key}>
    <tbody >
      <tr>
        <th>Game</th>
        <th>AST</th>
        <th>BLK</th>
        <th>DREB</th>
        <th>FG3A</th>
        <th>FG3M</th>
        <th>FGA</th>
        <th>FGM</th>
        <th>FTA</th>
        <th>FTM</th>
        <th>OREB</th>
        <th>PF</th>
        <th>PTS</th>
        <th>STL</th>
        <th>TOV</th>
      </tr>
      <tr>
        <td>{game.game_id}</td>
        <td>{game.AST}</td>
        <td>{game.BLK}</td>
        <td>{game.DREB}</td>
        <td>{game.FG3A}</td>
        <td>{game.FG3M}</td>
        <td>{game.FGA}</td>
        <td>{game.FGM}</td>
        <td>{game.FTA}</td>
        <td>{game.FTM}</td>
        <td>{game.OREB}</td>
        <td>{game.PF}</td>
        <td>{game.PTS}</td>
        <td>{game.STL}</td>
        <td>{game.TOV}</td>
      </tr>
    </tbody>
    </table>
  )
  });
}

export default class CustomSwipeableview extends Component {
	
	constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    }
  }

  handleTab = (value) => {
   this.setState({
     slideIndex: value,
   });
  };



  render() {
  const player = this.props.player
		
    return (
			<div>
       <Tabs
         onChange={this.handleTab}
         value={this.state.slideIndex}
       >
         <Tab
           label="Statistics"
           value={0}
         / >
       </Tabs>
       <SwipeableViews
         index={this.state.slideIndex}
         onChangeIndex={this.handleTab}
       >
         <div>
         {
            stationComponents(this.props.playerStats)
         }
         </div>

       </SwipeableViews>
      </div>
     

		)
	}
}