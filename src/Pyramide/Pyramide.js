import React from 'react';
import './Pyramide.css';

import { Table, Button } from 'react-bootstrap'

/**********************
 *     Constantes     *
 **********************/

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

/**********************
 *     Composants     *
 **********************/

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

 	resetBackground(){
		this.state.joueurs.forEach((joueur) => {
			joueur.main.forEach((card) => {
				card.background = "";
			});
		});
	}


 	/********************************
 	 *     Gestion de la partie     *
 	 ********************************/

	/* Fonctions associées à la génération du jeu de carte (mélange + création) */

    shuffle(array){
    	this.addHistoryMessage("Mélange du paquet de carte...")
		array.sort(() => Math.random() - 0.5);
	}

	generateCards(){
		this.addHistoryMessage("Chargement du paquet de carte...")
		let cards = [];
		let symboles = ["C", "D", "H", "S"];

		symboles.forEach((e) => {
			console.log(e)
			for(let j = 1 ; j < 14 ; j++){
				cards.push({
					"value": j,
					"symbol": e,
					"name": j + e,
				});
			}
		})
		console.log(cards);
		this.shuffle(cards);
		this.setState({
			deck: cards,
		});
	}

	/* Fonctions associées à la gestion de l'historique */

	addHistoryMessage(message){
		let history = this.state.history;
		history.unshift(message);
		this.setState({history:history});
	}

	/*
		Règles du jeu
	*/
	rules(manche, card, joueur, value){

		let finDeManche = true;

		/* Définitions des différentes règles selon la manche */
		if(manche === 1){
			console.log(value)
			if((LABELS[manche][value] === LABELS[manche][0] && (card.symbol === "D" || card.symbol === "H")) 
			|| (LABELS[manche][value] === LABELS[manche][1] && (card.symbol === "S" || card.symbol === "C"))){
				finDeManche = false;
			}

		}else if(manche === 2){
			let firstCard = joueur.main[0];
			if((LABELS[manche][value] === LABELS[manche][0] && card.value > firstCard.value)
			|| (LABELS[manche][value] === LABELS[manche][1] && card.value < firstCard.value)){
				finDeManche = false;
			}

		}else if(manche === 3){

			let values = [];
			values.push(joueur.main[0].value);
			values.push(joueur.main[1].value);
			let min = Math.min(...values);
			let max = Math.max(...values);

			if((LABELS[manche][value] === LABELS[manche][0] && (min < card.value && card.value < max))
			|| (LABELS[manche][value] === LABELS[manche][1] && (min > card.value || card.value > max))){
				finDeManche = false;
			}

		}else if(manche === 4){
			if((LABELS[manche][value] === LABELS[manche][0] && card.symbol === "C")
			|| (LABELS[manche][value] === LABELS[manche][1] && card.symbol === "H")
			|| (LABELS[manche][value] === LABELS[manche][2] && card.symbol === "S")
			|| (LABELS[manche][value] === LABELS[manche][3] && card.symbol === "D")){
				finDeManche = false;
			}
		}

		/* Ajout d'un message dans l'historique selon le résultat du joueur */
		if(finDeManche){
			this.addHistoryMessage(`${joueur.name} prend ${manche} gorgée(s)`);
		}

		/* Mise à jour du statut de la manche */
		return finDeManche;

	}


	/*  Fonction qui s'applique au moment de la fin d'un tour d'un joueur
			-> Passage au joueur suivant
			-> Passage à la manche suivante
	*/
	endTurn(isManche, manche, joueurEnCours){
		if(isManche){
			if( joueurEnCours === this.state.joueurs.length - 1){
				joueurEnCours = 0;
				manche++;
			}else{
				joueurEnCours++;
			}
		}

		this.setState({
			isManche: isManche,
			manche: manche, 
			joueurEnCours: joueurEnCours,
		});	
	}

	/**
		Mise en avant d'une / des cartes des joueurs concernées, avec l'ajout d'un message dans l'historique
	**/

	activeBackground(value){
		this.state.joueurs.forEach((joueur) => {
			joueur.main.forEach((card) =>{
				if(card.value === value){
					card.background = BACKGROUND_GREEN;
					let labelAction = "";
					if(this.state.tourPyramide % 2 === 0){
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

	/*******************************
	 *     Actions utilisateur     *
	 *******************************/

	handleClickChoixJoueur(id, joueurs, manche, joueurEnCours){

		console.log('Joueur en cours: ' +  joueurEnCours);
		let fromPlayer = joueurs[joueurEnCours].name
		let toPlayer   = joueurs[id].name

		console.log("handleClickJoueur")
		this.addHistoryMessage(`${fromPlayer} donne ${manche} gorgée(s) à ${toPlayer}`);
	
		this.endTurn(true, manche, joueurEnCours);
	}

	handleClick(value, manche, joueurEnCours){

		this.resetBackground();

		let joueurs = this.state.joueurs;
		let deck = this.state.deck;

		let joueur  = joueurs[joueurEnCours];
		let label   = LABELS[manche][value];

		this.addHistoryMessage(`${joueur.name} a choisi ${label}`);

		let card = deck.shift();

		joueur.main[this.state.manche - 1] = card

		let isManche = this.rules(manche, card, joueur, value)

		this.setState({
			deck: deck,
			joueurs: joueurs,
			isManche: isManche,
		});

		this.endTurn(isManche, manche, joueurEnCours);		
	}

	/**
		Action jouée lorsqu'on arrive sur la dernière phase du jeu
		On retourne une des cartes de la pyramide et on actionne les effets associés
	*/
	handleClickPyramide(){

		//On récupère le tour en cours et la card jouée
		let tour = this.state.tourPyramide;
		let card = this.state.deck.shift();
		this.state.pyramide[tour] = card

		//Si un joueur possède la carte jouée, alors on la met en avant
		this.activeBackground(card.value);

		//Le compteur de gorgée qui augmente de 1 tous les deux tours
		this.state.compteurVerre += ((tour + 1) % 2 == 0 ? 1 : 0);

		//Le tour est terminée, on pass au tour suivant
		tour++;
		this.setState({tourPyramide: tour});

		//Si on atteint le dernier tour, alors on arrive sur l'écrand de fin de la partie
		if(MAX_TOUR_PYRAMIDE === tour){
			this.state.isEnd = true;
		}
		
	}

	/********************************************
	 *     Fonctions de chargement des vues     *
	 ********************************************/

	
	/**
		Affichage du tableau d'historique
	**/
	loadHistory(){
		let history = []
		this.state.history.forEach((msg) => {
			history.push(<tr><td>{msg}</td></tr>);
		});
		return history;
	}

	/**
		Affichage du panel gauche
		Le tableau présentant les joueurs avec leurs cartes associées
	**/
	tableRender(){
		let rows = [];
		let i = 0;
		this.state.joueurs.forEach((joueur) => {
			rows.push(
				<tr key={joueur.name} className={joueur.background}>
					<td className="player-name">{joueur.name}</td>
					{joueur.main.map((card) => <Card card={card}/>)}
				</tr>
			)
		});
		return rows;
	}


	/**
		Afficahge du panel droit
		Toutes les intéractions utilisateurs y sont présentes
	**/
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
					content.push(<Button onClick={() => this.handleClick(l, this.state.manche, this.state.joueurEnCours)} className="button-choice">{labels[l]}</Button>);
				}
			}
		}else{
			for(let i in this.state.joueurs){
				let joueur = this.state.joueurs[i];
				content.push(<div>
					<Button onClick={() => this.handleClickChoixJoueur(i, this.state.joueurs, this.state.manche, this.state.joueurEnCours)} className="button-choice" variant="danger">{joueur.name}</Button>
				</div>);
			}	
		}
		return content;
	}

	/**
		Render
	**/
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