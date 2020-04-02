/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
// TODO(olc): re-enable this rule

import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

// Layout
import Header from './header';
import LayerButtons from './layerbuttons';
import LeftPanel from './leftpanel';
import Legend from './legend';
import ProdConsToggle from './prodconstoggle';
import Tabs from './tabs';
import Tooltips from './tooltips';

// Modules
import { __ } from '../helpers/translation';
import OnboardingModal from '../components/onboardingmodal';
import Toggle from '../components/toggle';
import { TIMESCALE } from '../helpers/constants';

// TODO: Move all styles from styles.css to here
// TODO: Remove all unecessary id and class tags

const mapStateToProps = state => ({
  brightModeEnabled: state.application.brightModeEnabled,
  isLeftPanelCollapsed: state.application.isLeftPanelCollapsed,
  timescale: state.application.timescale,
  currentDate: (state.data.grid || {}).datetime,
});

const Main = ({ brightModeEnabled, electricityMixMode, isLeftPanelCollapsed, timescale, currentDate }) => (
  <React.Fragment>
    <div
      style={{
        position: 'fixed', /* This is done in order to ensure that dragging will not affect the body */
        width: '100vw',
        height: 'inherit',
        display: 'flex',
        flexDirection: 'column', /* children will be stacked vertically */
        alignItems: 'stretch', /* force children to take 100% width */
      }}
    >
      <Header />
      <div id="inner">
        <div id="loading" className="loading overlay" />
        <LeftPanel />
        <div id="map-container">
          <div id="zones" className="map-layer" />
          <canvas id="wind" className="map-layer" />
          <canvas id="solar" className="map-layer" />
          <div id="watermark" className={`watermark small-screen-hidden ${props.brightModeEnabled ? 'brightmode' : ''}`}>
            <a href="http://www.tmrow.com/mission?utm_source=electricitymap.org&utm_medium=referral&utm_campaign=watermark" target="_blank">
              <div id="built-by-tomorrow" />
            </a>
            <a id="hiring-flag" href="https://tmrow.com/jobs" target="_blank">
              <p>we&apos;re hiring!</p>
            </a>
          </div>
          <Legend />
          <div className="controls-container">
            <Toggle
              infoHTML={__('tooltips.cpinfo')}
              onChange={value => dispatchApplication('electricityMixMode', value)}
              options={[
                { value: 'production', label: __('tooltips.production') },
                { value: 'consumption', label: __('tooltips.consumption') },
              ]}
              value={electricityMixMode}
            />
            <br />
            <Toggle
              onChange={value => dispatchApplication('timescale', value)}
              options={[TIMESCALE.MONTHLY, TIMESCALE.LIVE].map((k) => {
                if (k === TIMESCALE.MONTHLY) {
                  return { value: k, label: 'monthly historical' };
                }
                if (k === TIMESCALE.LIVE) {
                  return { value: k, label: 'live' };
                }
                return { value: 'unknown', label: 'unknown' };
              })}
              value={timescale}
            />
          </div>
          <LayerButtons />
        </div>

        <div id="connection-warning" className="flash-message">
          <div className="inner">
            {__('misc.oops')}
            {' '}
            <a
              href=""
              onClick={(e) => {
                window.retryFetch();
                e.preventDefault();
              }}
            >
              {__('misc.retrynow')}
            </a>
            .
          </div>
        </div>
        <div id="new-version" className="flash-message">
          <div className="inner">
            <span dangerouslySetInnerHTML={{ __html: __('misc.newversion') }} />
          </div>
        </div>

        <div
          id="left-panel-collapse-button"
          className={`small-screen-hidden ${props.isLeftPanelCollapsed ? 'collapsed' : ''}`}
          role="button"
          tabIndex="0"
        >
          <i className="material-icons">arrow_drop_down</i>
        </div>

        { /* end #inner */}
      </div>
      <Tabs />
    </div>
    <Tooltips />
    <OnboardingModal />
    <div
      style={{
        position: 'absolute',
        fontFamily: 'Catamaran',
        top: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        marginRight: 'auto',
        marginLeft: 'auto',
        padding: 18,
        borderRadius: 3,
        cursor: 'pointer',
        color: brightModeEnabled ? '#000' : '#fff',
        fontSize: '3em',
        fontWeight: 'bold',
        display: timescale !== TIMESCALE.LIVE ? undefined : 'none',
        pointerEvents: 'none',
      }}
    >
      {moment(currentDate).format('MMMM YYYY')}
    </div>
  </React.Fragment>
);

export default connect(mapStateToProps)(Main);
