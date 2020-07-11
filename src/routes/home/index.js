import { h, Component } from "preact";

import letters from "./letters";

import style from "./style";

class Home extends Component {
  state = {
    gameResult: null,
    hangmanString: "",
    guessed: [],
    wrongGuesses: 0,
    fullGuess: ""
  };

  componentDidMount() {
    // make request to service for hangman string...
    fetch("https://type.fit/api/quotes")
      .then(res => res.json())
      .then(data => {
        const quote = data[Math.floor(Math.random() * data.length)].text
        this.setState({
          hangmanString: quote
        });
      });
  }

  fullGuess() {
    const guess = this.state.fullGuess;
    if (guess === this.state.hangmanString) {
      this.setState({
        gameResult: "success"
      });
    } else if (this.state.wrongGuesses >= 7) {
      this.setState(prevState => ({
        gameResult: "failure",
        wrongGuesses: prevState.wrongGuesses + 1
      }));
    } else {
      this.setState(prevState => ({
        wrongGuesses: prevState.wrongGuesses + 1
      }));
    }
  }

  guess(letter) {
    const { hangmanString, gameResult, wrongGuesses } = this.state;

    if (gameResult === "failure") {
      return;
    }

    if (gameResult === "success") {
      return;
    }

    const letters = hangmanString.split("").filter(c => /[A-Z0-9]/i.test(c));

    const uniqueLetters = [];
    for (const c of letters) {
      const l = c.toLowerCase();
      if (!uniqueLetters.includes(l)) {
        uniqueLetters.push(l);
      }
    }

    if (
      uniqueLetters.includes(letter.toLowerCase()) &&
      !this.state.guessed.includes(letter.toLowerCase())
    ) {
      this.setState(prevState => {
        const guessed = prevState.guessed.concat(letter);
        return {
          guessed,
          gameResult:
            guessed.length >= uniqueLetters.length
              ? "success"
              : prevState.gameResult
        };
      });
    } else if (wrongGuesses >= 7) {
      this.setState(prevState => ({
        gameResult: "failure",
        wrongGuesses: prevState.wrongGuesses + 1
      }));
    } else {
      this.setState(prevState => ({
        wrongGuesses: prevState.wrongGuesses + 1
      }));
    }
  }

  handleChange(e) {
    this.setState({
      fullGuess: e.target.value
    });
  }

  render({ }, { hangmanString, gameResult, guessed, wrongGuesses }) {
    let head;
    let body;
    let rightArm;
    let leftArm;
    let leftLeg;
    let rightLeg;
    let leftFoot;
    let rightFoot;

    if (this.state.wrongGuesses > 0) {
      head = (
        <hr
          style={{
            height: "35px",
            width: "35px",
            backgroundColor: "#bbb",
            borderRadius: "50%",
            transform: "translateX(95px) translateY(-5px)"
          }}
        />
      );
    }

    if (this.state.wrongGuesses > 1) {
      body = (
        <hr
          style={{
            transform: "translateX(92px) translateY(10px) rotate(90deg)",
            width: "60px"
          }}
        />
      );
    }

    if (this.state.wrongGuesses > 2) {
      rightArm = (
        <hr
          style={{
            transform: "translateX(97px) translateY(5px) rotate(75deg)",
            width: "40px"
          }}
        />
      );
    }

    if (this.state.wrongGuesses > 3) {
      leftArm = (
        <hr
          style={{
            transform: "translateX(87px) translateY(-4px) rotate(-75deg)",
            width: "40px"
          }}
        />
      );
    }

    if (this.state.wrongGuesses > 4) {
      leftLeg = (
        <hr
          style={{
            transform: "translateX(87px) translateY(27px) rotate(-75deg)",
            width: "50px"
          }}
        />
      );
    }

    if (this.state.wrongGuesses > 5) {
      rightLeg = (
        <hr
          style={{
            transform: "translateX(99px) translateY(19px) rotate(75deg)",
            width: "50px"
          }}
        />
      );
    }

    if (this.state.wrongGuesses > 6) {
      leftFoot = (
        <hr
          style={{
            width: "15px",
            transform: "translateX(77px) translateY(35px) rotate(-55deg)"
          }}
        />
      );
    }

    if (this.state.wrongGuesses > 7) {
      rightFoot = (
        <hr
          style={{
            width: "15px",
            transform: "translateX(109px) translateY(29px) rotate(55deg)"
          }}
        />
      );
    }
    return (
      <div class={style.home}>
        {hangmanString ? (
          <div>
            <div style={{ marginBottom: "160px" }}>
              <hr
                style={{
                  width: "100px",
                  transform: "translateY(-5px) translateX(50px)",
                  border: "red 1px solid"
                }}
              />
              <hr
                style={{
                  width: "30px",
                  transform: "translateX(95px) rotate(90deg)",
                  border: "1px blue solid"
                }}
              />
              <hr
                style={{
                  width: "300px",
                  transform: "rotate(90deg)"
                }}
              />
              {head}
              {body}
              {rightArm}
              {leftArm}
              {leftLeg}
              {rightLeg}
              {leftFoot}
              {rightFoot}
            </div>
            <h1>Take your guess</h1>
            <div class={style.blanksContainer}>
              {hangmanString.split("").map(c => (
                <span class={style.blank}>
                  {gameResult === "success"
                    ? c
                    : guessed.includes(c.toLowerCase())
                      ? c
                      : "_"}
                </span>
              ))}
            </div>
            <div class={style.lettersContainer}>
              {letters
                .split("")
                .filter(l => !guessed.includes(l))
                .map(l => (
                  <span class={style.btnContainer}>
                    <button onClick={() => this.guess(l)} type="button">
                      {l}
                    </button>
                  </span>
                ))}
            </div>
            <div>
              {!gameResult ? (
                <div>
                  <textarea onChange={this.handleChange.bind(this)} />
                  <button onClick={this.fullGuess.bind(this)} type="button">
                    Full Guess
                  </button>
                </div>
              ) : (
                  ""
                )}
              {<h2>{wrongGuesses} wrong guesses</h2>}
            </div>
          </div>
        ) : (
            <h1>Loading hangman string...</h1>
          )}
        {gameResult === "success" ? <h1>Finished!</h1> : ""}
        {gameResult === "failure" ? <h1>Failed!</h1> : ""}
      </div>
    );
  }
}

export default Home;
