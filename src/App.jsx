import React from "react"
import Start from "./components/Start"
import Quiz from "./components/Quiz"
import { nanoid } from 'nanoid'
import './styles.css'

export default function App() {
  const [started, setStarted] = React.useState(false)
  const [quizArray, setQuizArray] = React.useState([])
  const [ansArray, setAnsArray] = React.useState([])
  const [submitted, setSubmitted] = React.useState(false)
  const [correctCount, setCorrectCount] = React.useState(0)

  function getQuizArray() {
    fetch("https://opentdb.com/api.php?amount=5&difficulty=easy")
      .then((response) => response.json())
      .then((data) => {
        setQuizArray(data.results)
      })
  }

  React.useEffect(() => {
    getQuizArray()
  }, [])

  React.useEffect(() => {
    setAnsArray(formatAnswersArray)
  }, [quizArray])

  function formatAnswersArray() {
    // concat corrent and incorrect answers
    const answersArray = []
    quizArray.map(quiz => {
      answersArray.push({
        value: quiz.correct_answer,
        correct: true,
        id: nanoid(),
        qn: quiz.question,
        isSelected: false,
        isChecked: false
      })

      quiz.incorrect_answers.map(ans => {
        answersArray.push({
          value: ans,
          correct: false,
          id: nanoid(),
          qn: quiz.question,
          isSelected: false,
          isChecked: false
        })
      })
    })
    return shuffleArray(answersArray)
  }

  // fisher yates array shuffle algorithm
  function shuffleArray(arr) {
    let lastIndex = arr.length - 1
    while (lastIndex > 0) {
      const randomIndex = Math.floor(Math.random() * lastIndex)
      const temp = arr[lastIndex]
      arr[lastIndex] = arr[randomIndex]
      arr[randomIndex] = temp
      lastIndex -= 1
    }
    return arr
  }

  function start() {
    setStarted(true)
  }

  function handleSubmit() {
    if (submitted) {
      // new game
      getQuizArray()
      setCorrectCount(0)
      setSubmitted(false)
    } else {
      // check answers
      setAnsArray(prevArr => prevArr.map(ans => {
        return { ...ans, isChecked: true }
      }))
      ansArray.map(ans => {
        if (ans.isSelected && ans.correct) {
          setCorrectCount(count => count + 1)
        }
      })
      setSubmitted(true)
    }
  }

  function selectAnswer(id, qn) {
    setAnsArray(prevArr => prevArr.map(ans => {
      // same question, other not selected options
      if (ans.qn === qn && ans.id !== id) {
        return { ...ans, isSelected: false }
        // same question, selected option
      } else if (ans.qn === qn && ans.id === id) {
        return { ...ans, isSelected: !ans.isSelected }
        // all other questions' options
      } else {
        return ans
      }
    }))
  }

  return (
    <div>
      <div id="blob-one"></div>
      {!started && <div id="blob-two"></div>}
      {started ? <Quiz quizArray={quizArray} ansArray={ansArray} handleSubmit={handleSubmit}
        selectAnswer={(id, qn) => selectAnswer(id, qn)} submitted={submitted} correctCount={correctCount} /> : <Start start={start} />}
      {started && <div id="blob-three"></div>}
    </div>
  )
}

