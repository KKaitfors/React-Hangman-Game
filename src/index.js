import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

//COMPONENTS

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "hangman",
      input: "",
      submit: "",
      correct: [0, 1, 2, 3, 4, 5, 6],
      wrong: 0,
      selected: [],
      alphabet: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  componentDidMount() {}
  handleChange(event) {
    let banned = new RegExp("[^a-z]|[" + this.state.selected + "]", "i");
    event.target.value = event.target.value.replace(banned, "");
    this.setState({
      input: event.target.value,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    if (event.target.querySelector("input").value === "") {
      return;
    }
    let indices = [];
    for (let i = 0; i < this.state.keyword.length; i++) {
      if (this.state.input === this.state.keyword[i]) {
        indices.push(i);
      }
    }
    let count = 0;
    if (indices.length === 0) {
      count = 1;
    }
    console.log(this.state.wrong);
    let tempAlpha = this.state.alphabet;
    if (this.state.alphabet.indexOf(this.state.input) !== -1) {
      tempAlpha.splice(this.state.alphabet.indexOf(this.state.input), 1, "");
    }
    this.setState({
      submit: this.state.input,
      correct: this.state.correct.concat(indices).sort(),
      wrong: this.state.wrong + count,
      selected: this.state.selected.concat(this.state.input),
      alphabet: tempAlpha,
    });
    event.target.querySelector("input").value = "";
  }
  handleReset() {
    fetch("https://random-word-api.herokuapp.com/word")
      .then((response) => response.text())
      .then((response) => response.replace(/[^a-zA-Z ]/g, ""))
      .then((response) => {
        this.setState({
          keyword: response,
          input: "",
          submit: "",
          correct: [],
          wrong: 0,
          selected: [],
          alphabet: [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
          ],
        });
      });
  }
  render() {
    return (
      <div className="container">
        <Hangman wrong={this.state.wrong} />
        <Word
          keyword={this.state.keyword}
          submit={this.state.submit}
          correct={this.state.correct}
          wrong={this.state.wrong}
        />
        <LetterBank
          keyword={this.state.keyword}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          correct={this.state.correct}
          wrong={this.state.wrong}
          selected={this.state.selected}
          alphabet={this.state.alphabet}
        />
        <NewGame handleReset={this.handleReset} />
      </div>
    );
  }
}

class Hangman extends React.Component {
  render() {
    return (
      <div className="hangman">
        <div className="gallows">
          <div className="top-beam"></div>
          <div className="side-beam"></div>
          <div className="base"></div>
          <div className="skeleton">
            <div className="rope"></div>
            {this.props.wrong > 0 && <div className="head"></div>}
            {this.props.wrong > 1 && <div className="body"></div>}
            {this.props.wrong > 2 && <div className="left-arm"></div>}
            {this.props.wrong > 3 && <div className="right-arm"></div>}
            {this.props.wrong > 4 && <div className="left-leg"></div>}
            {this.props.wrong > 5 && <div className="right-leg"></div>}
          </div>
        </div>
      </div>
    );
  }
}

class Word extends React.Component {
  render() {
    const spaces = Array(this.props.keyword.length)
      .fill()
      .map((space, index) =>
        this.props.correct.indexOf(index) !== -1 ? (
          <span key={index} id={index}>
            {this.props.keyword[index]}
          </span>
        ) : this.props.wrong === 6 ? (
          <span style={{ color: "red" }} key={index} id={index}>
            {this.props.keyword[index]}
          </span>
        ) : (
          <span key={index} id={index}>
            {space}
          </span>
        )
      );
    return <div className="word">{spaces}</div>;
  }
}

class LetterBank extends React.Component {
  render() {
    const letters = this.props.alphabet.map((letter, index) => (
      <span key={index}>{letter}</span>
    ));
    const win = <p className="win">you win!</p>;
    const loss = <p className="loss">game over</p>;
    return (
      <div className="letter-bank">
        <div className="guess">
          <form onSubmit={this.props.handleSubmit}>
            {this.props.wrong === 6 ||
            this.props.correct.length === this.props.keyword.length ? (
              <input
                type="text"
                id="letter-guess"
                placeholder="?"
                maxlength="1"
                autocomplete="off"
                disabled
              />
            ) : (
              <input
                type="text"
                id="letter-guess"
                placeholder="?"
                maxlength="1"
                autocomplete="off"
                onChange={this.props.handleChange}
              />
            )}
            <br />
            <input type="submit" id="submit-guess" value="Guess" />
          </form>
        </div>
        <div className="remaining-letters">
          <h1>Available Letters:</h1>
          <div className="letters">
            {(this.props.correct.length !== this.props.keyword.length &&
              this.props.wrong < 6) ||
            this.props.keyword === "hangman"
              ? letters
              : this.props.wrong < 6
              ? win
              : loss}
          </div>
        </div>
      </div>
    );
  }
}

class NewGame extends React.Component {
  render() {
    return (
      <input
        type="submit"
        id="reset"
        value="New Game"
        onClick={this.props.handleReset}
      />
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
