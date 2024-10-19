import "./style.scss";

const LowHeader: React.FC = () => {
  return (
    <header className="lowheader">
      <div
        className="lowheader-logo"
        onClick={() => window.location.assign("/App")}
      >
        <h3>BYTUBE</h3>
      </div>
    </header>
  );
};

export default LowHeader;
