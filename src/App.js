import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { v4 as uuidv4 } from 'uuid';
import he from 'he';
import QuestionText from './Question/questionText';
import Answer from './Question/answer';

function App() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [clickable, setClickable] = useState(true);
  const [count, setCount] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const BASE_URL = 'https://opentdb.com/api.php?amount=1'
  
  const shuffle = (array) => {
    const sortedArr = array;
    for (let i = sortedArr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [sortedArr[i], sortedArr[j]] = [sortedArr[j], sortedArr[i]];
    }
    return sortedArr;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(json => {
        setIsLoaded(true);
        setItems(json.results)
      },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [count]);
  
  useEffect(() => {
    [...document.querySelectorAll(".correct-ans, .next-container")].map(elem => elem.style.display = "block");
  }, [correct, wrong]);
  
  useEffect(() => {
    if (items[0] !== undefined) {
      var answers = [...items[0].incorrect_answers, items[0].correct_answer];
      setAnswers(() => shuffle([...answers]));
    }
  }, [items]);

  useEffect(() => {
    if (!clickable) {
      var correct_answer = [...document.getElementsByClassName('option-btn')].filter(elem => elem.innerHTML === items[0].correct_answer)[0];
      correct_answer.style.backgroundColor = "#0d0";
    }
  }, [items, clickable]);

  function nextQuestion() {
    setCount(count + 1);
    setClickable(true);
    setIsLoaded(false);
  }
  
  function showCorrect(selected) {
    setClickable(false);
    if (items[0].correct_answer === selected) {
      setCorrect(correct + 1);
    }
    else {
      setWrong(wrong + 1);
    }
  }

  function resetResults() {
    setCount(1);
    setCorrect(0);
    setWrong(0);
  }

  if (error) {
    return <div data-testid="error">Error: {error.message}</div>
  }
  else if (!isLoaded) {
    return <ReactLoading data-testid="spinner" type="spin" color="#f50" />
  }
  else return (
    <>
      {items.map(item => {
        return <div className="content" data-testid="content" key={uuidv4()}>
          <div className="reset" onClick={() => resetResults()}>Reset</div>
          <div className="q-num">Question number {count}</div>
          <div>Correct answers: {correct}</div>
          <div>Wrong answers: {wrong}</div>
          <div className="question">
            <QuestionText text={item.question} />
          </div>

          <div className="options-group">
            {answers.map(option => {
              return <div className="option-btn" onClick={() => clickable ? showCorrect(option) : null} key={uuidv4()}>
                <Answer answer={option} />
              </div>
            })}
          </div>
          
          <div className="correct-ans">
            <div>Correct answer: {he.decode(item.correct_answer)}</div>
          </div>
          <div className="next-container">
            <div onClick={nextQuestion}>Next Question</div>
          </div>
        </div>
      })}
    </>
  );
}

export default App;
