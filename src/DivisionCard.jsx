import React, {Component} from 'react';
import {Card, CardMedia} from 'material-ui/Card';

import '../styles/card.css'

export default class DivisionCards extends Component {

  render(){
    return (
      <section className="divisions">
        <div className="division" onClick={this.props.onWestern} >
          <Card style={{backgroundColor: 'rgba(48, 48, 48, 0)'}} >
            <CardMedia>
              <img role="presentation" src="https://upload.wikimedia.org/wikipedia/en/0/02/Western_Conference_(NBA)_logo.gif"/>
            </CardMedia>
          </Card>
        </div>
        <div className="division" onClick={this.props.onEastern}>
          <Card style={{backgroundColor: 'rgba(48, 48, 48, 0)'}} >
            <CardMedia>
              <img role="presentation" src="https://upload.wikimedia.org/wikipedia/en/e/ed/Eastern_Conference_(NBA)_logo.gif"/>
            </CardMedia>
          </Card>
        </div>
      </section>

    );
  }
}
