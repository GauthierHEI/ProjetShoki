import React from "react";
import tripadvisor from './tripadivsor.png';
import './App.css';
import { useFetch } from "./hooks";


const API = 'http://localhost:8083/?url=';

class App extends React.Component {

  constructor(props){
    super(props);

    this.fetchData = this.fetchData.bind(this);

    this.state = {
      data: [],
    };
  }

  render() {
      return (
          <div className="App">
            <header className="App-header">

              <div className="App-container">

                <img src={tripadvisor} className="App-logo" alt="logo"/>

                <input onChange={this.handleURL} type="text" placeholder="https://www.tripadvisor.fr/..." id="input-url" className="App-input"/>

                <div className="error" id="error"> ...</div>

                <button  onClick={this.fetchData} className="App-button" id="button-url"> C'est parti</button>

                <div className="Label-container">
                  <label> Comments : <label id="label-words"> 0 </label></label>
                  <label> Average : <label id="label-avg"> 0 </label> / 5</label>
                </div>
              </div>
            </header>
          </div>
      );
  }

  handleURL(){
    let url = document.getElementById("input-url").value;
    let error = document.getElementById("error");
    let RegularURLExpression = /https?:\/\/(www\.)?tripadvisor\.[a-z]{2,4}\/([-a-zA-Z0-9.]*)/ ;
    if (RegularURLExpression.test(url)){
      error.innerText="URL valide !";
      error.style.color="darkgreen";
      error.style.display="block";
      return true;
    }
    else if(url === ""){
      error.style.display="none";
    }
    else {
      error.innerText="Ceci n'est pas une adresse tripadvisor valide !";
      error.style.display="block";
      return false;
    }

  }

  fetchData(){
    let Erreur = document.getElementById("error");
    if (this.handleURL()) {
      this.Loading(true);
      let QUERY = document.getElementById("input-url").value;
      let words = document.getElementById("label-words");
      let average = document.getElementById("label-avg");
      fetch(API + QUERY )
          .then(res => res.json())
          .then(json => {
            this.setState({data: json });
            words.innerText = this.state.data.Reviews;
            average.innerText = this.state.data.Average;
            this.Loading(false);

          })
          .catch((error) => {
            console.log("error :" + error)
            Erreur.innerText="Il y a eu une erreur de communication avec le serveur!";
            Erreur.style.color="darkred";
            Erreur.style.display="block";
          });
    }
  }

  Loading(bool){
    let loading = document.getElementById("error");
    if(bool) {
      loading.innerText = "Loading...";
      loading.style.color = "black";
    }else{
      loading.style.display="none";
    }
  }
}



export default App;
