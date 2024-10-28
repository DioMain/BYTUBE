import "./style.scss";

const LowHeader: React.FC = () => {
  return (
    <header className="lowheader">
      <div className="lowheader-logo" onClick={() => window.location.assign("/App/Main")}>
        <h2>
          <span style={{ color: "red" }}>B</span>
          <span style={{ color: "green", marginRight: "4px" }}>Y</span>
          TUBE
        </h2>
      </div>
    </header>
  );
};

export default LowHeader;
