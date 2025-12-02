import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Simple portfolio-friendly logging
    console.error("UI ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container terminal" style={{ textAlign: "center" }}>
          <h2 className="page-title">SYSTEM_FAILURE_DETECTED</h2>
          <p className="muted">An unexpected error occurred in the UI.</p>
          <div className="terminal" style={{ margin: "2rem 0", padding: "1rem", textAlign: "left" }}>
            <div>ERROR: {String(this.state.error)}</div>
            <div>STATUS: RECOVERED_WITH_BOUNDARY</div>
            <div>SOLUTION: REFRESH_OR_NAVIGATE_HOME</div>
          </div>
          <a className="btn accent" href="#/">RETURN_TO_HOME</a>
        </div>
      );
    }
    return this.props.children;
  }
}