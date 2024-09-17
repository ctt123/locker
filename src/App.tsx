import './App.css'
import data from './assets/box.json'
import DraggableBoxes from "./components/DraggableBoxes";
import {useEffect} from "react";

function App() {
  // const [count, setCount] = useState(0)
  console.log(data)
    data.boxes.map((item)=>{
        console.log(item.number)
    })

    useEffect(() => {
        function setFontSize() {
            const screenWidth = window.innerWidth;
            const fontSize = screenWidth / 37.5;
            document.documentElement.style.fontSize = `${fontSize}px`;
        }

        setFontSize();

        window.addEventListener('resize', setFontSize);

        return () => {
            window.removeEventListener('resize', setFontSize);
        };
    }, []);

  return (
    <>
        <DraggableBoxes></DraggableBoxes>
    </>
  )
}

export default App
