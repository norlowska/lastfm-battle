/*
 *  App
 *
 *  Component-wrapper for whole application. Provides routing
 *  and configaration for Redux store.
 */
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import { reducer } from '../../reducers';
import Home from '../Home/Home';
import Battle from '../Battle/Battle';
import './style.css';

// Create store with thunk middleware
const store = createStore(reducer, applyMiddleware(thunk));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/battle" component={Battle} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
