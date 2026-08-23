// @ts-check
import { forEach } from 'lodash';

/**
 * @typedef ... ScreepsAPI
 * @typedef ... TerminalState
 */

/**
 * @typedef {Object} MainState
 * @property {string} [error]
 * @property {string} [message]
 * @property {boolean} [success]
 */

/** @type ... ScreepsAPI, state: MainState}>} */
const Main = ({ api, state }) => {
  if (state.error) {
    return (
      <main className="terminal">
        <div className="terminal-error">
          <h2>Error</h2>
          <p>{state.error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="terminal">
      <div className="terminal-success">
        <h2>Success</h2>
        {state.message && <p>{state.message}</p>}
      </div>
    </main>
  );
};

export default Main;