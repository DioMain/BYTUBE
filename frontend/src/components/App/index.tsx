import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/Catalog" />
          <Route path="/Search" />
          <Route path="/Video" />
          <Route path="/Channel" />
          <Route path="/Playlist" />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
