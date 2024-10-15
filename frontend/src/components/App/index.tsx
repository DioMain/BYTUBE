import { BrowserRouter, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div>
      <header>
        <video src="/videos/template/video.mp4" controls width={512}></video>
      </header>
      <BrowserRouter>
        <Routes></Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
