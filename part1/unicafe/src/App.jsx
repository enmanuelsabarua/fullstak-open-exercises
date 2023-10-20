import { useState } from 'react';

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}


const Statistics = ({ good, bad, neutral, all }) => {

  if (good || bad || neutral) {
    return (
      <>
        <h2>Statistics</h2>
        <table>
          <tbody>
            <StatisticsLine text='good' value={good}/>
            <StatisticsLine text='neutral' value={neutral}/>
            <StatisticsLine text='bad' value={bad}/>
            <StatisticsLine text='all' value={good + neutral + bad}/>
            <StatisticsLine text='average' value={all / (good + neutral + bad)}/>
            <StatisticsLine text='positive' value={(good / (good + neutral + bad) * 100) + ' %'}/>
          </tbody>
        </table>
      </>
    )
  }

  return <p>No feedback given</p>

}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);

  const handleGood = () => {
    const sumGood = good + 1;
    setGood(sumGood);
    setAll(all + 1);
  }
  
  const handleNeutral = () => {
    const sumNeutral = neutral + 1; 
    setNeutral(sumNeutral);
    setAll(all + 0);
  }

  const handleBad = () => {
    const sumBad = bad + 1;
    setBad(sumBad);
    setAll(all - 1);
  }

  return (
    <div>
      <h1>Give Feedback</h1>

      <div>
        <Button handleClick={handleGood} text='good' />
        <Button handleClick={handleNeutral} text='neutral' />
        <Button handleClick={handleBad} text='bad' />
      </div>

      <Statistics good={good} bad={bad} neutral={neutral} all={all}/>
    </div>
  )
}

export default App