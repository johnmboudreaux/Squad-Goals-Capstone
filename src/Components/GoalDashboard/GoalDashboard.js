import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Conversation from '../Conversation/Conversation';
import SubmitComment from '../SubmitComment/SubmitComment';

class GoalDashboard extends Component {
  constructor() {
    super();
    this.state = {
      goal: {},
      activeUser: false,
    };
  }

  componentDidMount() {
    this.getGoalData();
  }

  getGoalData() {
    const url = `/api/v1/goals/${this.props.match.params.id}`;
    return this.contentFetch(url)
      .then((parsedData) => {
        this.setState({ goal: parsedData });
        this.checkForEnrolledUser();
      })
      .catch(error => console.error(error));
  }

  checkForEnrolledUser() {
    const { userId } = this.props.location.state;
    const goalId = parseInt(this.props.match.params.id);
    const url = `/api/v1/users/${userId}/goals/${goalId}`;
    return fetch(url)
      .then(result => result.json())
      .then((response) => {
        if (response.length === 1) {
          this.setState({ activeUser: true });
        }
      })
      .catch(error => console.error(error));
  }


  joinGoal() {
    const { userId } = this.props.location.state;
    const goalId = parseInt(this.props.match.params.id);
    const postBody = {
      user_id: userId,
      goal_id: goalId,
    };
    fetch(`/api/v1/users/${userId}/goals/${goalId}`, {
      method: 'POST',
      body: JSON.stringify(postBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response)
      .catch(error => console.error(error));
  }

  leaveGoal(path1, id1) {
    const { userId } = this.props.location.state;
    const goalId = parseInt(this.props.match.params.id);
    fetch(`/api/v1/users/${userId}/goals/${goalId}`, {
      method: 'DELETE',
    })
      .then(response => response)
      .catch(error => console.error(error));
  }

  contentFetch(url) {
    return fetch(url)
      .then(result => result.json())
      .catch(error => console.error(error));
  }

  render() {
    return (
      <div className="dashboard-container">
        <div className="dashboard-body">
          <h1 className="dashboard-body-title">Goal Name</h1>
          <div className="dashboard-body-info">
            <div>
              <h2>{this.state.goal.title}</h2>
            </div>
            <div>
              <h2>{this.state.goal.description}</h2>
            </div>
            <div>
              <h2>{this.state.goal.goal_time}</h2>
            </div>
            <div>
              <h2>{this.state.goal.goal_points}</h2>
            </div>
            { this.state.activeUser ?
              <div>
                <input
                  onClick={() => this.leaveGoal()}
                  type="submit"
                  value="Leave"
                />
              </div>
              :
              <div>
                <input
                  onClick={() => this.joinGoal()}
                  type="submit"
                  value="Join"
                />
              </div>
            }
          </div>
          { this.state.goal.conversation !== undefined &&
            <div className="conversation-container">
              <Conversation comments={this.state.goal.conversation} />
              <SubmitComment conversationId={this.state.goal.conversation_id} />
            </div>
          }
        </div>
      </div>
    );
  }
}

GoalDashboard.propTypes = {
  match: PropTypes.object,
  params: PropTypes.object,
  location: PropTypes.object,
  state: PropTypes.object,
  id: PropTypes.string,
};

export default GoalDashboard;
