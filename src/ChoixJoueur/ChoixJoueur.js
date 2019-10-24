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
			    />
			    <InputGroup.Append>
			      <Button onClick={props.onClick} variant="outline-secondary"> - </Button>
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
		}
	}

	addJoueur = () => {
		let oldJoueur = this.state.joueurs;
		let newJoueur = oldJoueur;
		newJoueur.push({"name": "", "main": Array(4).fill({"value": "", "symbol": "", "name": "blue_back"})});

		this.setState({
			joueurs: newJoueur,
		})

		console.log(this.state.joueurs)
	}

	componentDidMount(){
		this.addJoueur();
		this.addJoueur();
	}

	onChangeName = (position, event) => {
		let oldJoueur = this.state.joueurs;
		let newJoueur = oldJoueur;

		newJoueur[position].name = event.target.value;

		this.setState({
			joueurs: newJoueur,
		})
	}

	handleRemoveJoueur(position){
		if(this.state.joueurs.length > 2){
			let oldJoueur = this.state.joueurs;
			let newJoueur = oldJoueur;
			newJoueur.splice(position, 1);

			this.setState({
				joueurs: newJoueur,
			});	
		}
	}

	renderInput(){
		const inputs = [];
		for(let position in this.state.joueurs){
			inputs.push(
				<div key={position} onChange={(e) => this.onChangeName(position, e)}>
					<JoueurInput position={position} 
								 name={this.state.joueurs[position].name}
								 onClick ={() => this.handleRemoveJoueur(position)}/>
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