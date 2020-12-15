import React from 'react';
import { useSelector } from 'react-redux';
import Spinner from 'react-spinkit';

export default function LoadingSpinner() {
  const loading = useSelector((state) => state.app.loading);

  if (loading) {
    return (
      <div className="loading">
        <Spinner name="chasing-dots" fadeIn="none" />
      </div>
    );
  }
  return <div />;
}
