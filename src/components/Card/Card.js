import React, { Component } from "react";

import { database } from "../../config/firebase";
import { formatTime } from "../../utils/FormatTime";

import * as KeyPopup from "../../controllers/KeyPopupController";

import Tv from "../../assets/tv.png";

import "./styles.css";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.uid,
      index: this.props.index,
      events: this.props.events,
      checkin: "",
      checkout: "",
      check: this.props.check,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        uid: nextProps.uid,
        index: nextProps.index,
        events: nextProps.events,
        check: nextProps.check,
      });
    }
  }

  handleCheckin = async (ev) => {
    ev.preventDefault();

    var time = KeyPopup.timeNow();
    time = time.substring(0, time.length - 3);

    const data = {
      checkin: time,
    };

    this.handleSend(data);

    this.setState({ checkin: time });
  };

  handleCheckout = async (ev) => {
    ev.preventDefault();

    var time = KeyPopup.timeNow();
    time = time.substring(0, time.length - 3);

    const data = {
      checkout: time,
    };

    this.handleSend(data);

    this.setState({ checkout: time });
  };

  handleSend = (data) => {
    var messageRequest = `frequency/${this.props.classroom}/${
      this.state.events[this.state.index].key
    }/${this.state.uid}`;
    database.ref(messageRequest).update(data);
  };

  render() {
    let checkin = !this.state.checkin
      ? this.state.events[this.state.index].frequency.checkin
        ? formatTime(this.state.events[this.state.index].frequency.checkin)
        : ""
      : formatTime(this.state.checkin);
    let checkout = !this.state.checkout
      ? this.state.events[this.state.index].frequency.checkout
        ? formatTime(this.state.events[this.state.index].frequency.checkout)
        : ""
      : formatTime(this.state.checkout);

    let active = this.state.events[this.state.index].isActive;

    return (
      <div className="card">
        <header>
          <p
            style={{
              width: "100%",
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {this.state.events[this.state.index].event.name}
          </p>
          <p
            className="subtitle top"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {this.state.events[this.state.index].event.subject}
          </p>
        </header>

        <div className="content">
          <div>
            <p>Início: {this.state.events[this.state.index].event.begin}</p>
            <p>Fim: {this.state.events[this.state.index].event.end}</p>
          </div>
          <div style={{ width: "75px" }}>
            <a
              href={this.state.events[this.state.index].event.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="center">
                <img src={Tv} alt="Hangouts" />
              </div>
              <p
                className="subtitle"
                style={{ width: "75px", margin: "0 auto" }}
              >
                Ir para live
              </p>
            </a>
          </div>
        </div>

        <div className="buttonGroup">
          <button
            onClick={this.handleCheckin}
            disabled={checkin || !active ? true : false}
          >
            CHECK IN
          </button>
          <button
            onClick={this.handleCheckout}
            disabled={!checkin || checkout ? true : false}
          >
            CHECK OUT
          </button>
        </div>

        <div className="caption">
          <p>{checkin ? `Check in realizado às ${checkin}` : ""}</p>
          <p>{checkout ? `Check out realizado às ${checkout}` : ""}</p>
        </div>
      </div>
    );
  }
}
