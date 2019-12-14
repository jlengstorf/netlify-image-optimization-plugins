import React from 'react';

export default () => {
  const [count, setCount] = React.useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  );
};
