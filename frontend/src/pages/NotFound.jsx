import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container terminal" style={{ textAlign: "center" }}>
      <h2 className="page-title">404 - PAGE_NOT_FOUND.exe</h2>
      <p className="muted">ERROR: THE_REQUESTED_PAGE_DOES_NOT_EXIST</p>
      <div className="spacer" />
      <div
        className="terminal"
        style={{ margin: "2rem 0", padding: "1rem", textAlign: "left" }}
      >
        <div>ERROR_CODE: 404</div>
        <div>STATUS: NOT_FOUND</div>
        <div>MESSAGE: PAGE_NOT_FOUND</div>
        <div>SOLUTION: RETURN_TO_HOME</div>
      </div>
      <Link className="btn accent" to="/">
        RETURN_TO_HOME
      </Link>
    </div>
  );
}
