import React from "react"
import parse from "html-react-parser"


export default function Quiz(props) {

    let resultsStyles = {
        display: "none"
    }

    const quizElements = props.quizArray.map(quiz => {
        return (
            <div>
                <p id="quiz-question">{parse(quiz.question)}</p>
                <div id="quiz-answers-container">
                    {props.ansArray.map(ans => {
                        let bgColor = "#F5F7FB"
                        let bdr = "0.8px solid #4D5B9E"
                        let opc = 1
                        let pointerEvents = "pointer-events"
                        let pointerEventsValue = ""

                        if (ans.isSelected) {
                            bgColor = "#D6DBF5"
                            bdr = "none"
                        }

                        if (ans.isChecked) {
                            pointerEventsValue = "none"

                            resultsStyles = {
                                display: "block"
                            }

                            if (ans.isSelected && ans.correct) {
                                // correct ans
                                bgColor = "#94D7A2"
                                opc = 1
                            } else if (ans.isSelected && !ans.correct) {
                                // incorrect ans
                                bgColor = "#F8BCBC"
                                bdr = "none"
                                opc = 0.5
                            } else if (!ans.isSelected && ans.correct) {
                                // no ans chosen
                                bgColor = "#94D7A2"
                                bdr = "none"
                                opc = 1
                            } else {
                                // all other options
                                opc = 0.5
                            }
                        }

                        const ansStyles = {
                            backgroundColor: bgColor,
                            border: bdr,
                            opacity: opc,
                            [pointerEvents]: pointerEventsValue
                        }

                        return (
                            ans.qn === quiz.question &&
                            <div className="quiz-answers" style={ansStyles} onClick={() => props.selectAnswer(ans.id, quiz.question)}>
                                {parse(ans.value)}
                            </div>
                        )
                    })}
                </div>
                <div id="breakline"></div>
            </div>
        )
    })

    return (
        <div id="quizzes-container">
            {quizElements}
            <div id="results-button-container">
                <p id="results" style={resultsStyles} >You scored {props.correctCount} / {props.quizArray.length} correct answers</p>
                <button id="check-button" onClick={props.handleSubmit}>{props.submitted ? "Play Again" : "Check Answers"}</button>
            </div>
        </div>
    )
}