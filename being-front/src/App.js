import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginForm from './components/loginFormComponent';
import PrivateRoute from './routes/privateRoute';
import Main from './components/mainPageComponent'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={LoginForm} />
          <PrivateRoute exact path='/items' component={Main} />
          <Route path="*" component={() => <h1>Page not found</h1>} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
