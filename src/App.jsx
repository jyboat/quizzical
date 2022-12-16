import React from "react"
import Start from "./components/Start"
import Quiz from "./components/Quiz"
import { nanoid } from 'nanoid'
import './styles.css'

export default function App() {
  // add paint blobs
  const [started, setStarted] = React.useState(false)
  const [quizArray, setQuizArray] = React.useState([])
  const [ansArray, setAnsArray] = React.useState([])
  const [submittedQuiz, setSubmittedQuiz] = React.useState(false)
  const [correctCount, setCorrectCount] = React.useState(0)


  function formatAnswers() {
    const answerArr = []
    quizArray.map(quiz => {
      answerArr.push({
        value: quiz.correct_answer,
        correct: true,
        id: nanoid(),
        qn: quiz.question,
        isSelected: false,
        isChecked: false
      })

      quiz.incorrect_answers.map(ans => {
        answerArr.push({
          value: ans,
          correct: false,
          id: nanoid(),
          qn: quiz.question,
          isSelected: false,
          isChecked: false
        })
      })
    })
    return shuffleArray(answerArr)

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
    setAnsArray(formatAnswers)
  }, [quizArray])

  function start() {
    setStarted(true)
  }

  function handleSubmit() {
    if (submittedQuiz) {
      // new game
      getQuizArray()
      setCorrectCount(0)
      setSubmittedQuiz(false)
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
      setSubmittedQuiz(true)
    }
  }


  function selectAnswer(id, qn) {
    setAnsArray(prevArr => prevArr.map(ans => {
      if (ans.qn === qn && ans.id !== id) {
        return { ...ans, isSelected: false }
      } else if (ans.qn === qn && ans.id === id) {
        return { ...ans, isSelected: !ans.isSelected }
      } else {
        return ans
      }
    }))
  }

  return (
    <div>
      <div className="blob-one"></div>
      <div className="blob-two"></div>
      {started ? <Quiz quizArray={quizArray} ansArray={ansArray} handleSubmit={handleSubmit}
        selectAnswer={(id, qn) => selectAnswer(id, qn)} submittedQuiz={submittedQuiz} correctCount={correctCount} /> : <Start start={start} />}
    </div>
  )
}

