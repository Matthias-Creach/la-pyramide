import React from 'react';
import './App.css';

import ChoixJoueur from '../ChoixJoueur/ChoixJoueur';
import Pyramide    from '../Pyramide/Pyramide';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonGroup  } from 'react-bootstrap';

const DEFAULT_BACK = "blue_back";

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      joueurs: [], 
      isMenu: true,
      isChoixJoueur: false,
      isPyramide: false,
    };
  }

  loadViewApp = () => {
    this.setState({
      joueurs: [], 
      isMenu: true,
    });
  }

  loadViewChoixJoueur = () => {
    this.setState({
      isMenu: false,
      isChoixJoueur: true,
    });
  }

  loadPyramideView = () => {
    this.setState({
      isMenu: false,
      isChoixJoueur: false,
      isPyramide: true,
    });
  }

  render() {

      if(this.state.isMenu){
        return(
          <div className="App">
            <h1>La pyramide des casses couilles</h1>
            <div>
              <ButtonGroup className="ButtonGroup" size="lg" vertical>
                <Button className="Button" onClick={this.loadViewChoixJoueur} variant="outline-primary">Lancer une partie</Button>
                <Button className="Button" disabled={true} variant="outline-primary">Paramètres</Button>
                <Button className="Button" disabled={true} variant="outline-primary">Historiques</Button>
              </ButtonGroup >
            </div>
          </div>
        )
      }
      else if(this.state.isChoixJoueur){
        return(<ChoixJoueur joueurs={this.state.joueurs} retour={this.loadViewApp} play={this.loadPyramideView} />)
      }
      else if(this.state.isPyramide){
        return(<Pyramide retour={this.loadViewApp} joueurs={this.state.joueurs} />)
      }
  }

};


export default App;
