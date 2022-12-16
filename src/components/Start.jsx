export default function Start(props) {

    return (
        <div id="start-container">
            <p id="start-title">Quizzical</p>
            <p id="start-caption">Test your general knowledge in this fun quiz!</p>
            <button id="start-button" onClick={props.start}>Start</button>
        </div>
    )
}