import './App.css'
import Scene from './components/Scene'
import baseImage from './assets/horse.webp'

function App() {
  const date = new Date();
  const currentHour = date.getHours();
  const hoursNorm = (currentHour % 12) || 12;
  const minutes = date.getMinutes();
  const amPm = currentHour >= 12 ? 'PM' : 'AM';
  const timeZone = 'Eastern Standard Time';

  return (
    <>
      <div className='container'>
        <Scene image={baseImage} />
        <span className='timestamp'>
          {hoursNorm}
          <span className="colon">:</span>
          {minutes}{' '}
          {amPm}{' '}
          {timeZone}
        </span>
      </div>
    </>
  )
}

export default App
