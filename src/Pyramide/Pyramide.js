import React from 'react';
import './Pyramide.css';

import { Table, ButtonGroup, Button } from 'react-bootstrap'


const LABELS = {
	"1": ["Rouge", "Noire"], 
	"2": ["Plus", "Moins"],
	"3": ["Intérieur", "Extérieur"],
	"4": ["Trèfle", "Coeur", "Pique", "Carreau"],
}

const LABELS_PYRAMIDE = {
	"1": "1 Gorgée", 
	"2": "2 Gorgées",
	"3": "3 Gorgées",
	"4": "4 Gorgées", 
	"5": "1 Cul Sec !"
}

const BACKGROUND_GREEN = "back-green"
const MAX_TOUR_PYRAMIDE = 10;

function Card(props){
	let card = props.card;
	return(
		<td className={card.background}><img className='card' src={require(`./cards/${card.name}.png`)} alt="card" /></td>
	)
}

function ManchePyramide(props){
	let pyramide = props.pyramide;
	return(
		<div id="pyramide-game">
			<table>
				<tbody>
					<tr>
						<td key="pyramide_9" rowSpan="2"><img className='min-card' src={require(`./cards/${pyramide[8].name}.png`)} alt="card" /></td>
						<td key="pyramide_1"><img className='min-card' src={require(`./cards/${pyramide[0].name}.png`)} alt="card" /></td>
						<td key="pyramide_3"><img className='min-card' src={require(`./cards/${pyramide[2].name}.png`)} alt="card" /></td>
						<td key="pyramide_5"><img className='min-card' src={require(`./cards/${pyramide[4].name}.png`)} alt="card" /></td>
						<td key="pyramide_7"><img className='min-card' src={require(`./cards/${pyramide[6].name}.png`)} alt="card" /></td>
						<td key="pyramide_10" rowSpan="2"><img className='min-card' src={require(`./cards/${pyramide[9].name}.png`)} alt="card" /></td>
					</tr>
					<tr>
						<td key="pyramide_2"><img className='min-card' src={require(`./cards/${pyramide[1].name}.png`)} alt="card" /></td>
						<td key="pyramide_4"><img className='min-card' src={require(`./cards/${pyramide[3].name}.png`)} alt="card" /></td>
						<td key="pyramide_6"><img className='min-card' src={require(`./cards/${pyramide[5].name}.png`)} alt="card" /></td>
						<td key="pyramide_8"><img className='min-card' src={require(`./cards/${pyramide[7].name}.png`)} alt="card" /></td>
					</tr>
				</tbody>
			</table>
			<div className="tour-button"><Button onClick={props.action} className="button-choice" variant="danger">Tour {props.tour} / {MAX_TOUR_PYRAMIDE}</Button></div>
		</div>
	)
}

class Pyramide extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			joueurs: props.joueurs,
			history: ["Début de la partie"],
			deck: [],
			isManche: true,
			isEnd: false,
			manche: 1,
			joueurEnCours: 0,
			pyramide: Array(10).fill({"value": "", "symbol": "", "name": "blue_back"}),
			tourPyramide: 0,
			compteurVerre: 1,

		}
		//this.handleClick.bind(this);
	}

	componentDidMount(){
    	this.generateCards();
 	}

	tableRender(){
		let rows = [];
		let i = 0;
		this.state.joueurs.forEach((joueur) => {
			rows.push(
				<tr className={joueur.background}>
					<td className="player-name">{joueur.name}</td>
					{joueur.main.map((card) => <Card key={joueur.name} card={card}/>)}
				</tr>
			)
		});
		return rows;
	}

	resetBackground(){
		this.state.joueurs.forEach((joueur) => {
			joueur.main.forEach((card) => {
				card.background = "";
			});
		});
	}

	resetActivePlayer = () => {
		this.state.joueurs.forEach((joueur) => {
			joueur.background = ""
		});
	}
	activePlayer(p){
		this.resetActivePlayer();
		this.state.joueurs[p].background = "active";	
	}

    shuffle(array){
    	this.addHistoryMessage("Mélange du paquet de carte...")
		array.sort(() => Math.random() - 0.5);
	}

	generateCards(){
		this.addHistoryMessage("Chargement du paquet de carte...")
		let cards = [];
		let symboles = ["C", "D", "H", "S"];

		symboles.forEach((e) => {
			for(let j = 1 ; j < 14 ; j++){
				cards.push({
					"value": j,
					"symbol": e,
					"name": j + e,
				});
			}
		})

		this.shuffle(cards);
		this.setState({
			deck: cards,
		});
	}

	addHistoryMessage(message){
		this.state.history.unshift(message);
	}

	endTurn(){

		if(this.state.isManche){
			let newJoueurEnCours = this.state.joueurEnCours;
			let newManche        = this.state.manche;
					this.activePlayer(newJoueurEnCours);
			if( newJoueurEnCours == this.state.joueurs.length - 1){
				newJoueurEnCours = 0;
				newManche++;
				if(newManche == 5){
					this.resetActivePlayer()
				}
			}else{
				newJoueurEnCours++;
			}

			this.setState({
				joueurEnCours: newJoueurEnCours,
				manche: newManche,
			});
		}
	}

	handleClickChoixJoueur(id){
		let fromPlayer = this.state.joueurs[this.state.joueurEnCours].name
		let toPlayer   = this.state.joueurs[id].name

		this.addHistoryMessage(`${fromPlayer} donne ${this.state.manche} gorgée(s) à ${toPlayer}`);

		this.setState({
			isManche: true
		});

		this.endTurn();
	}

	handleClick(value){


		this.resetBackground();

		let playerName = this.state.joueurs[this.state.joueurEnCours].name;
		let label      = LABELS[this.state.manche][value];

		this.addHistoryMessage(`${playerName} a choisi ${label}`);

		let oldDeck = this.state.deck;
		let newDeck = oldDeck;

		let card = newDeck.shift();

		let oldJoueurs = this.state.joueurs;
		let newJoueurs  = oldJoueurs;

		newJoueurs[this.state.joueurEnCours].main[this.state.manche - 1] = card

		let joueurPrecedent  = this.state.joueurEnCours;

		let newJoueurEnCours = this.state.joueurEnCours;
		let oldJoueurEnCours = this.state.joueurEnCours;

		let newManche = this.state.manche;



		if(this.state.manche == 1){
			if((LABELS[this.state.manche][value] == LABELS[this.state.manche][0] && (card.symbol == "D" || value.charAt(0) == "H")) 
			|| (LABELS[this.state.manche][value] == LABELS[this.state.manche][1] && (card.symbol == "S" || value.charAt(0) == "C"))){
				this.addHistoryMessage(`${playerName} donne ${this.state.manche} gorgée(s)`);
				this.setState({isManche: false});
			}else{
				this.addHistoryMessage(`${playerName} prend ${this.state.manche} gorgée(s)`);
			}
		}else if(this.state.manche == 2){
			let firstCard = newJoueurs[this.state.joueurEnCours].main[0];
			if((LABELS[this.state.manche][value] == LABELS[this.state.manche][0] &&  card.value > firstCard.value)
			|| (LABELS[this.state.manche][value] == LABELS[this.state.manche][1] &&  card.value < firstCard.value)){
				this.addHistoryMessage(`${playerName} donne ${this.state.manche} gorgée(s)`);
				this.setState({isManche: false});
			}else{
				this.addHistoryMessage(`${playerName} prend ${this.state.manche} gorgée(s)`);
			}
		}else if(this.state.manche == 3){
			let values = [];
			values.push(newJoueurs[this.state.joueurEnCours].main[0].value);
			values.push(newJoueurs[this.state.joueurEnCours].main[1].value);
			let min = Math.min(...values);
			let max = Math.max(...values);
			if((LABELS[this.state.manche][value] == LABELS[this.state.manche][0] && (min < card.value && card.value < max))
			|| (LABELS[this.state.manche][value] == LABELS[this.state.manche][1] && (min > card.value || card.value > max))){
				this.addHistoryMessage(`${playerName} donne ${this.state.manche} gorgée(s)`);
				this.setState({isManche: false});
			}else{
				this.addHistoryMessage(`${playerName} prend ${this.state.manche} gorgée(s)`);
			}
		}else if(this.state.manche == 4){
			if(LABELS[this.state.manche][value] == LABELS[this.state.manche][0] && card.symbol == "C"
			||(LABELS[this.state.manche][value] == LABELS[this.state.manche][1] && card.symbol == "H")
			||(LABELS[this.state.manche][value] == LABELS[this.state.manche][2] && card.symbol == "S")
			||(LABELS[this.state.manche][value] == LABELS[this.state.manche][3] && card.symbol == "D")){
				this.addHistoryMessage(`${playerName} donne ${this.state.manche} gorgée(s)`);
				this.setState({isManche: false});
			}else{
				this.addHistoryMessage(`${playerName} prend ${this.state.manche} gorgée(s)`);
			}
		}

		this.endTurn();

		this.setState({
			deck: newDeck,
			joueurs: newJoueurs,
		})
	}

	activeBackground(value){
		this.state.joueurs.forEach((joueur) => {
			joueur.main.forEach((card) =>{
				if(card.value == value){
					card.background = BACKGROUND_GREEN;
					let labelAction = "";
					if(this.state.tourPyramide % 2 == 0){
						labelAction = "prend";
					}
					else{
						labelAction = "donne";
					}

					this.addHistoryMessage(`${joueur.name} ${labelAction} ${LABELS_PYRAMIDE[this.state.compteurVerre]}`);
					
				}else{
					card.background = "";
				}
			});
		});
	}

	handleClickPyramide(){

		let position = this.state.tourPyramide;
		let oldDeck = this.state.deck;
		let newDeck = oldDeck;

		let card = newDeck.shift();

		
		this.activeBackground(card.value);
		this.state.compteurVerre += ((position + 1) % 2 == 0 ? 1 : 0);

		let oldPyramide = this.state.pyramide;
		let newPyramide = oldPyramide;

		newPyramide[position] = card

		position++;

		if(MAX_TOUR_PYRAMIDE == position){
			this.setState({
				isEnd: true,
			});
		}

		this.setState({
			deck:	newDeck,
			pyramide: newPyramide,
			tourPyramide: position,
		});
		
	}

	loadContentView(){
		let content = [];

		if(this.state.isEnd){
			content.push(<Button onClick={() => this.props.retour()} className="button-choice">Retour Menu</Button>);
			content.push(<Button onClick={() => this.props.retour()} className="button-choice">Restart</Button>);
		}else if(this.state.isManche){
			if(this.state.manche == 5){
				content.push(<ManchePyramide action={() => this.handleClickPyramide()} tour={this.state.tourPyramide + 1} pyramide={this.state.pyramide}/>)
			}else{
				let labels = LABELS[this.state.manche];
				for(let l in labels){
					content.push(<Button onClick={() => this.handleClick(l)} className="button-choice">{labels[l]}</Button>);
				}
			}
		}else{
			for(let i in this.state.joueurs){
				let joueur = this.state.joueurs[i];
				content.push(<Button onClick={() => this.handleClickChoixJoueur(i)} className="button-choice" variant="danger">{joueur.name}</Button>);
			}	
		}
		return content;
	}

	loadHistory(){
		let history = []
		for(let h in this.state.history){
			history.push(<tr><td>{this.state.history[h]}</td></tr>);
		}
		return history;
	}

	render(){
		return(
			<div className="flex-row">
				<div className="panel-left">
					<Table id="pyramide" responsive>
						<thead>
							<tr>
								<th></th>
								<th className="center">M1</th>
								<th className="center">M2</th>
								<th className="center">M3</th>
								<th className="center">M4</th>
							</tr>
						</thead>
						<tbody>
							{this.tableRender()}
						</tbody>
					</Table>
				</div>
				<div className="panel-right">
					<div className="panel-right-header"><h3>Manche {this.state.manche}</h3></div>
					<div className="panel-right-center">
						<div className="content">
							{this.loadContentView()}
						</div>
					</div>
					<div className="panel-right-footer">
						<Table>
							<tbody className="left">
								{this.loadHistory()}
							</tbody>
						</Table>
					</div>
				</div>
			</div>
		)
	}

}

export default Pyramide;