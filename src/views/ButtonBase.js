import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import Ripple from "./Ripple";

import "./ButtonBase.css";

const PRESS_EVENTS = ["pointerdown"];
const RELEASE_EVENTS = ["pointerup", "pointerleave", "pointercancel"];

class ButtonBase extends React.Component {
  static propTypes = {};
  static defaultProps = {
    component: "button",
  };

  timerHandler = null;
  timer = null;
  releaseTimer = null;

  componentDidMount() {
    const root = ReactDOM.findDOMNode(this);
    root.setAttribute("touch-action", "auto");
    PRESS_EVENTS.forEach(event =>
      root.addEventListener(event, this.handlePress, { passive: true }),
    );
    RELEASE_EVENTS.forEach(event =>
      root.addEventListener(event, this.handleRelease, { passive: true }),
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    cancelAnimationFrame(this.releaseTimer);

    const root = ReactDOM.findDOMNode(this);
    PRESS_EVENTS.forEach(event =>
      root.removeEventListener(event, this.handlePress, { passive: true }),
    );
    RELEASE_EVENTS.forEach(event =>
      root.removeEventListener(event, this.handleRelease, { passive: true }),
    );
  }

  handlePress = event => {
    const point = {
      x: event.clientX,
      y: event.clientY,
    };

    if (event.pointerType === "touch") {
      this.timerHandler = () => {
        this.ripple.press(point);
      };
      this.timer = setTimeout(() => {
        this.timerHandler();
        this.timerHandler = null;
      }, 80);
    } else if (event.buttons === 1) {
      this.ripple.press(point);
    }
  };

  handleRelease = event => {
    clearTimeout(this.timer);

    if (this.timerHandler && event.type === "pointerup") {
      this.timerHandler();
    }
    this.timerHandler = null;

    cancelAnimationFrame(this.releaseTimer);
    this.releaseTimer = requestAnimationFrame(() => {
      this.ripple.release();
    });
  };

  render() {
    const {
      ripple,
      component: Component,
      className,
      children,
      ...props
    } = this.props;
    return (
      <Component className={classNames("ButtonBase", className)} {...props}>
        {children}
        <Ripple ref={node => (this.ripple = node)} {...ripple} />
      </Component>
    );
  }
}

export default ButtonBase;
