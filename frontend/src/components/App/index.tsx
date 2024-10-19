import { observer } from "mobx-react-lite";
import counterStore from "stores/counter-store";

const App: React.FC = observer(() => {
  const { count, increment, total } = counterStore;

  console.log(count);
  console.log(increment);
  console.log(total);

  return (
    <div>
      <div>{total}</div>
      <input type="button" value="remove" onClick={() => increment(-1)} />
      <div>{count}</div>
      <input type="button" value="add" onClick={() => increment(1)} />
    </div>
  );
});

export default App;
