// Display a retry screen if a component cannot render.
import { Component } from "react";

/** A failed view must leave a recovery action and must not expose private data. */
export default class AppErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="catalog-state" role="alert">
          <h1>This page could not be displayed</h1>
          <p>Reload the page to try again.</p>
          <button className="btn-ink" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
