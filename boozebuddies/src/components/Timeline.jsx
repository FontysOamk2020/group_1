import React, { Component } from "react";
import axios from "axios";
import { Button, ListGroup } from "react-bootstrap";
import "./Timeline.css";

class Timeline extends Component {
  state = {
    activitiesUpdated: false,
    activities: [],
    sortedActivities: [],
    friendIds: [],
    dates: [],
    times: [],
    toggleButtonText: "Friends",
    showEveryone: true,
  };

  componentDidMount() {
    this.getAllActivities();
  }

  async getAllActivities() {
    await axios
      .get("http://217.101.44.31:8085/api/public/activity/getAllActivities")
      .then((res) => {
        console.log("getAllActivities:");
        console.log(res);
        console.log(res.data);
        if (res.data.activities !== null) {
          res.data.activities.forEach((item) => {
            this.state.activities.push(item);
          });
          this.state.activities.reverse();

          this.getTimeAndDate();
        } else {
          this.getAllActivities();
        }
      });
  }

  async getFriendIds() {
    await axios
      .get(
        "http://217.101.44.31:8082/api/public/friend/getFriendsByUserId/" +
          this.props.userId
      )
      .then((res) => {
        console.log("getFriendsByUserId:");
        console.log(res);
        console.log(res.data);
        console.log(res.data.relationships);
        res.data.relationships.forEach((item) => {
          if (item.status === "accepted") {
            if (item.userOneId.id === this.props.userId) {
              this.state.friendIds.push(item.userTwoId.id);
            } else {
              this.state.friendIds.push(item.userOneId.id);
            }
          }
        });
        this.getFriendActivities();
      });
  }

  async getFriendActivities() {
    await axios
      .get("http://217.101.44.31:8085/api/public/activity/getAllActivities")
      .then((res) => {
        res.data.activities.forEach((item) => {
          this.state.friendIds.forEach((friendItem) => {
            if (item.user.id === friendItem) {
              this.state.activities.push(item);
            }
          });
        });
        this.state.activities.reverse();
        this.getTimeAndDate();
      });
  }

  getTimeAndDate() {
    let offset = new Date().getTimezoneOffset();
    offset = offset * -1;
    offset = offset / 60;

    this.state.activities.forEach((item) => {
      let piece = item.timeEnteredBar.substring(11, 16).split(":");
      let hours = +piece[0] + +offset;

      if (hours > 23) {
        hours = hours - 24;
        hours = "0" + hours;

        let datePiece = item.timeEnteredBar.substring(0, 8);
        let datePiece2 = item.timeEnteredBar.substring(8, 10);

        datePiece2 = +datePiece2 + 1;
        let date = datePiece + datePiece2;

        this.state.dates.push(date);
      } else {
        this.state.dates.push(item.timeEnteredBar.substring(0, 10));
      }

      let time = hours + ":" + piece[1];

      this.state.times.push(time);
    });

    this.setState({ activitiesUpdated: true });
  }

  toggleButtonHandler = () => {
    if (this.state.showEveryone === true) {
      this.setState({
        showEveryone: false,
        toggleButtonText: "Everyone",
        activitiesUpdated: false,
        activities: [],
        friendIds: [],
        times: [],
        dates: [],
      });
      this.getFriendIds();
    } else {
      this.setState({
        showEveryone: true,
        toggleButtonText: "Friends",
        activitiesUpdated: false,
        activities: [],
        times: [],
        dates: [],
      });
      this.getAllActivities();
    }
  };

  hideButtonHandler = () => {
    this.props.callBack();
  };

  render() {
    return (
      <div className="timeline">
        <h4 className="timelineHeader">Timeline</h4>
        <Button
          className="timelineToggleButton"
          onClick={() => this.toggleButtonHandler()}
        >
          {this.state.toggleButtonText}
        </Button>
        <Button
          className="timelineHideButton"
          onClick={() => this.hideButtonHandler()}
        >
          Hide
        </Button>
        <ListGroup>
          {this.state.activitiesUpdated &&
            this.state.activities.map((item, i) => (
              <ListGroup.Item key={i} className="timelineListItem">
                <div className="activityHeader">
                  {this.state.activities[i].user.name}
                  <span className="activitySpan">{this.state.times[i]}</span>
                </div>
                Checked into {this.state.activities[i].bar.name}
                <span className="activitySpan">{this.state.dates[i]}</span>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </div>
    );
  }
}

export default Timeline;
