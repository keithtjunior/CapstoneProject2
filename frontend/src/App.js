import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import FaunaFinder from './FaunaFinder';

const App = () => {
  return (
    <BrowserRouter>
      <FaunaFinder/>
    </BrowserRouter>
  );
}

export default App;
