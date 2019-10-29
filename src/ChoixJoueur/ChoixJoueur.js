import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ChoixJoueur.css'

import { Button, ButtonGroup, Form, FormControl, InputGroup  } from 'react-bootstrap';

function JoueurInput(props){ 
	return(
		<div>
			  <InputGroup className="mb-3" size="lg">
			    <FormControl
			    	value={props.name}
			      	aria-describedby="basic-addon2"
			      	placeholder="Search..."
			    />
			    <InputGroup.Append>
			      <Button onClick={props.remove} variant="outline-secondary"> - </Button>
			    </InputGroup.Append>
			  </InputGroup>
		</div>
	)
}

class ChoixJoueur extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			joueurs: props.joueurs,
			idCardCompteur: 0,
		}
	}

	componentDidMount(){
		this.addJoueur();
		this.addJoueur();
	}

	/** Actions de modifications de la liste des joueurs **/

	addJoueur = () => {
		let joueurs = this.state.joueurs;
		let main = Array(4);
		joueurs.push({"name": "", "main": Array(4).fill({"value": "", "symbol": "", "name": "blue_back"})});
		this.setState({joueurs: joueurs});
	}

	removeJoueur(position){
		if(this.state.joueurs.length > 2){
			let joueurs = this.state.joueurs;
			joueurs.splice(position, 1);
			this.setState({joueurs: joueurs});	
		}
	}

	onChangeName = (position, event) => {
		let joueurs = this.state.joueurs;
		joueurs[position].name = event.target.value;
		this.setState({joueurs: joueurs});
	}

	/** Modification de la vue **/

	renderInput(){
		const inputs = [];
		for(let position in this.state.joueurs){
			inputs.push(
				<div onChange={(e) => this.onChangeName(position, e)}>
					<JoueurInput position={position} 
								 name={this.state.joueurs[position].name}
								 remove ={() => this.removeJoueur(position)}/>
				</div>
			)
		}
		return inputs;
	}

	render(){
		return(
			<div id="app">
				<div id="header">
					<h2>Choix des joueurs</h2>
				</div>
				<div id="container" className="ChoixJoueur">
					<div>
						<ButtonGroup vertical>
							{this.renderInput()}
						</ButtonGroup>
					</div>
				</div>
				<div id="footer">
					<footer className="flex-footer">
						<Button className="button retour" onClick={this.props.retour} variant="info">Retour</Button>
						<Button className="button add"    onClick={this.addJoueur}    variant="info">Ajouter</Button>
						<Button className="button play"   onClick={this.props.play}   variant="info">Go !</Button>
					</footer>
				</div>
			</div>
		);
	}	
}


export default ChoixJoueur;