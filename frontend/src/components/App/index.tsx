import { BrowserRouter, Routes } from "react-router-dom";

const App: React.FC = () => {
  const getSecret = () => {
    fetch("/api/auth/secret-jwt", {
      method: "GET",
      credentials: "include",
    })
      .then((raw) => raw.text())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div>
      <header>
        <video src="/videos/template/video.mp4" controls width={512}></video>
      </header>
      <BrowserRouter>
        <Routes></Routes>
      </BrowserRouter>
      <a href={"/api/auth/signin-jwt"}>sign in</a> <br />
      <a href={"/api/auth/signout-jwt"}>sign out</a> <br />
      <button onClick={() => getSecret()}>Secret data</button>
    </div>
  );
};

export default App;
