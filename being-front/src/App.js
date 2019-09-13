import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginForm from './components/loginFormComponent';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={LoginForm} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
