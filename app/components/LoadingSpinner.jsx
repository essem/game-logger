import React from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import PropTypes from 'prop-types';

class LoadingSpinner extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  render() {
    if (this.props.loading) {
      return <div className="loading"><Spinner spinnerName="chasing-dots" noFadeIn /></div>;
    }
    return <div />;
  }
}

const mapStateToProps = state => ({
  loading: state.app.loading,
});

export default connect(mapStateToProps)(LoadingSpinner);
