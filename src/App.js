import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import image from './assets/security.png';
import image1 from './assets/clock.png';
import ai from './assets/ai.png';
import brain from './assets/artificial-intelligence.png';
import speaker from './assets/speaker.png';
import axios from 'axios';
import robo from './assets/robotics.png'
function App() {
  const [mode, setMode] = useState('Dark');
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const msg = useRef('');
  const [history, setHistory] = useState([])
  const [answer, setAnswer] = useState('');
  const [bool, setBool] = useState(false);



  const deleteAll=()=>{
    axios.delete(`http://localhost:2022/deleteAll/`).then((p)=>{
  console.log(p)
  
    getHistory()
  
},(e)=>{
  console.log(e);
})
  }

const deleteHistory=(p1)=>{
axios.delete(`http://localhost:2022/delete/${p1}`).then((p)=>{
  console.log(p)
  const {data}=p
  if(data!=null){
    getHistory()
  }
},(e)=>{
  console.log(e);
})
}






  const func = () => {
    setAnswer("")
    setBool(true);

    axios.get(`http://localhost:2022/answer/${msg.current.value}`).then(
      (p) => {
        console.log(p);
        let { data } = p;
        setAnswer(data);
      },
      (e) => {
        console.log(e);
      }
    );

    axios.post(`http://localhost:2022/save`, {
      "description": msg.current.value
    }).then((p) => {
      const {data}=p
      
      if(data!=null){
        getHistory()
      }
    }, (e) => {
      console.log(e)
    })
    
  };

  const getHistory=()=>{
    axios.get(`http://localhost:2022/getHistory/`).then((p) => {
      const { data } = p
      
      setHistory(data)
      console.log(data  ,`-----history---`)
    }, (e) => {
        console.log(e)
    })
  }

  const darkmode = () => {
    if (mode == `Dark`) {
      setMode('light')

      document.body.style.backgroundColor = `rgb(0, 28, 53)`
    } else {
      setMode('Dark')

      document.body.style.backgroundColor = `rgb(181, 246, 255)`
    }

  }

  useEffect(() => {


    axios.get(`http://localhost:2022/getHistory/`).then((p) => {
      const { data } = p
      setHistory(data)
    }, (e) => {

    })

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };



  }, []);

const change=()=>{
  setAnswer("")
  if(answer.length==0){
    setBool(false)
  }
}


  const func1=(p1)=>{
    setAnswer("")
    setBool(true);
    axios.get(`http://localhost:2022/answer/${p1}`).then((p)=>{
      const {data}=p
      setAnswer(data)
    },(e)=>{
      console.log(e)
    })

  }

 

  const separateCodeAndText = (response) => {
    const messages = response.split('\n');

    const structuredMessages = messages.map((message, index) => {
      if (message.startsWith('```')) {
        return { content: message, type: 'code', key: `code-${index}` };
      } else {
        return { content: message, type: 'text', key: `text-${index}` };
      }
    });

    return structuredMessages;
  };

  const renderMessages = () =>{
    if (answer.length === 0) {
      if (bool) {
        return (
          <div className='d-flex justify-content-center mt-5'>
            <div style={{ fontSize: '40px',color:`${mode==`Dark`?`black`:`white`}` }} className='fa fa-spinner fa-spin'></div>
          </div>
        );
      } else {
        return (
          <div className='d-flex justify-content-center mt-5'>
       <img className='image-fluid mt-5'
              src={robo}
              style={{ height: 120, width: 120 }}

            ></img>
            <h2 style={{height:`72px`,borderRadius:`80px`}} id='hover' className={`  font text-dark mt-5 bg-light p-3  `}>Ask Me... &nbsp;</h2>
          </div>
        );
      }
    } else {
      const messages = separateCodeAndText(answer);

      return messages.map((message) => {
        if (message.type === 'code') {
          return (
         
            <p className={` p-3 rounded 30px code-message font ${mode == `Dark` ? `text-dark` : `text-light`}`} key={message.key}>
              {message.content}
              CODE
            </p>
  
          );
        } else {
          return (
          
            <p  className={`  p-3 rounded 30px code-message font ${mode == `Dark` ? `text-dark` : `text-light`}`} key={message.key}>
              {message.content}
            </p>
           
          );
        }
      });
    }
  };

  return (
    <>

<div
  style={{
    height: "100px",
    backgroundColor: `${mode === "Dark" ? "rgb(63, 231, 243)" : "rgb(0, 4, 37)"}`,
  }}
  className="row d-flex justify-content-between align-items-center m-1 rounded-30px"
>
  <div className="col-4 col-md-auto p-2 d-flex align-items-center">
    <img
      className="img-fluid"
      src={image}
      style={{
        height: 80,
        width: 80,
      }}
      alt="Security"
    />
    <h2
      className={`font ${mode === "Dark" ? "text-dark" : "text-light"} d-inline`}
      style={{ display: "inline-block", margin: 0, marginLeft: "10px" }}
    >
      GPT Turbo
    </h2>
  </div>

  <div className="col-4 col-md-auto text-center text-dark d-flex align-items-center">
    {mode === "Dark" ? (
      <i
        style={{ fontSize: "30px", paddingRight: 0 }}
        className="fa fa-sun-o"
        value=""
        aria-hidden="true"
        onClick={darkmode}
      ></i>
    ) : (
      <i
        style={{ fontSize: "30px", paddingRight: 0 }}
        className="fa fa-moon-o text-light"
        value="light"
        onClick={darkmode}
        aria-hidden="true"
      ></i>
    )}
  </div>
</div>


<div className="row mt-2 d-flex">
  <div
    className=" col-auto col-md-auto  scroll-container"
    style={{
      maxWidth: "90vw",
      maxHeight: "150px",
      overflow: "auto",
      background: "transparent",
    }}
  >
    <div className="btn-group ">
      {history.map((e, i) => {
        return (
          <button
            style={{ width: "220px", height: 40, borderRadius: "6px" }}
            className={`${
              mode === "Dark" ? "btn btn-info text-light" : "btn bg-black text-light"
            } container mx-2 btn-sm p-2`}
          >
            <h6 className="d-inline" onClick={() => func1(e.description)}>
              {e.description.slice(0, 19)}
            </h6>
            &emsp;&emsp;
            <i
              className="fa fa-trash"
              style={{ color: "red" }}
              onClick={() => deleteHistory(e.id)}
            ></i>
            &emsp;
          </button>
        );
      })}
    </div>
  </div>
  <div className="col-md-auto d-flex justify-content-center align-items-center mb-3">
    {history.length === 0 ? (
      <div></div>
    ) : (
      <button onClick={deleteAll} className="btn btn-danger btn-sm">
        Delete All
      </button>
    )}
  </div>
</div>




<div className="row ">
  <div className="col-12 col-md-4 ">
    <div className="d-flex justify-content-center align-items-center">
      <img
        className="mx-2"
        src={image1}
        style={{
          height: 50,
          width: 50,
        }}
        id="clock"
      />
      <label htmlFor="clock">
        <h4 className="text-light mt-2 font gradient-text">{time}</h4>
      </label>
    </div>
    <div className="form-group mt-5">
      <input
        type="text"
        onChange={change}
        className="form-control form-control-sm  mx-3 mx-md-5"
        placeholder="Ask me..."
        ref={msg}
      />
    </div>
    <div className="form-group d-flex justify-content-center mt-3">
      <button
        id="search"
        className={`btn ${
          mode === "Dark" ? "bg-dark text-light" : "bg-light text-dark"
        }`}
        onClick={func}
      >
        Search
      </button>
    </div>
    <div className="image-fluid mx-5">
      <img
        className="mx-5 mt-4"
        src={brain}
        style={{
          height: 200,
          width: 200,
        }}
      />
    </div>
  </div>
  <div
    id="answer"
    style={{
      height: "65vh",
      background: `${
        mode === "Dark"
          ? "linear-gradient(185deg, rgb(255, 255, 255), rgb(145, 248, 255))"
          : "linear-gradient(185deg, rgb(0, 28, 53), rgb(3, 72, 134))"
      }`,
    }}
    className="  col-md-7 rounded 30px  mt-2 mx-5"
  >
    <div
      className="scroll-container"
      style={{ overflowX: "auto", maxHeight: "65vh" }}
    >
      <h4
        className={`text-light bg-black font text-center rounded-30px p-2`}
        style={{ position: "sticky", top: 0 }}
      >
        Answer
      </h4>
      <p
        className={`bg-info ${
          msg.current.value !== null ? "p-0" : "p-5"
        } rounded-30px text-center text-light`}
      >
        {msg.current.value}
      </p>
      {renderMessages()}
    </div>
  </div>
</div>


    </>
  );
}

export default App;
