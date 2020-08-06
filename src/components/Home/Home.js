import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import './style.css';

/*
 *  Home Page
 *
 *  The first page users see in our App, at the '/' route.
 *  Contains form with inputs for usernames and submit button.
 */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username1: '',
      username2: '',
      showValidationMessage: false,
      validationMessage: '',
    };
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // Go to battle page on form submit
  onSubmit(event) {
    event.preventDefault();
    if (this.state.username1.toLowerCase() === this.state.username2.toLowerCase()) {
      this.setState({
        showValidationMessage: true,
        validationMessage: 'You have entered two identical usernames. Change one of them.',
      });
    } else {
      let path = '/battle/' + this.state.username1 + '/' + this.state.username2;
      this.props.history.push(path);
    }
  }

  render() {
    return (
      <div className='home-container'>
        <header className='large-logo'>
          <h1>
            Last.fm <span className='logo-white'>battle</span>
          </h1>
        </header>
        <form className='home-form' onSubmit={this.onSubmit.bind(this)}>
          <div className='form-group left'>
            <input
              className='username-input'
              type='text'
              name='username1'
              id='input-user1'
              value={this.state.username1}
              onChange={this.onChange.bind(this)}
              required
            ></input>
            <label htmlFor='input-user1'>Username #1</label>
          </div>
          <div className='form-group right'>
            <input
              className='username-input'
              type='text'
              name='username2'
              id='input-user2'
              value={this.state.username2}
              onChange={this.onChange.bind(this)}
              required
            ></input>
            <label htmlFor='input-user2'>Username #2</label>
          </div>
          {this.state.showValidationMessage ? (
            <div className='validation-message'>{this.state.validationMessage}</div>
          ) : null}
          <div className='form-group submit'>
            <button className='battle-button' type='submit'>
              battle
            </button>
          </div>
        </form>
      </div>
    );
  }
}

Home.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Home);
