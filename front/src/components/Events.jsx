import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@material-ui/core';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import nl2br from 'react-nl2br';
import NewEvent from './NewEvent';
import http from '../http';

export default function Events() {
  const events = useSelector((state) => state.events.list);
  const hasMore = useSelector((state) => state.events.hasMore);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    return () => dispatch({ type: 'RESET_EVENTS' });
  }, [dispatch]);

  const renderSummary = (event) => {
    if (!event.finished) {
      return <i>Event is in progress...</i>;
    }

    return nl2br(event.summary);
  };

  const handleLoadMore = () => {
    let params = '';
    if (events.length > 0) {
      const last = _.last(events);
      params = `?createdAt=${last.createdAt}&id=${last.id}`;
    }
    http
      .get(`/api/events${params}`)
      .then((events) => {
        dispatch({
          type: 'LOAD_EVENTS',
          list: events.list,
          hasMore: events.list.length > 0,
        });
      })
      .catch(() => {});
  };

  const handleNewEvent = () => {
    setShowNewEventModal(true);
  };

  const handleCreateEvent = (name) => {
    if (!name.trim()) {
      return;
    }

    setShowNewEventModal(false);

    http
      .post('/api/events', { name })
      .then((res) => {
        dispatch({
          type: 'CREATE_EVENT',
          event: res,
        });
        history.push(`/events/${res.id}/players`);
      })
      .catch(() => {});
  };

  const handleCloseNewEventModal = () => {
    setShowNewEventModal(false);
  };

  const renderNewEventModal = () => {
    if (!showNewEventModal) {
      return '';
    }

    return (
      <NewEvent
        onCreate={handleCreateEvent}
        onClose={handleCloseNewEventModal}
      />
    );
  };

  const renderEvent = (event) => {
    const header = [];
    if (event.name) {
      header.push(<span key="name">{event.name}</span>);
    } else {
      header.push(<i key="name">noname</i>);
    }
    return (
      <RouterLink
        to={`/events/${event.id}/summary`}
        style={{ textDecoration: 'none' }}
      >
        <Card
          key={event.id}
          style={{ marginBottom: '20px', cursor: 'pointer' }}
        >
          <CardContent>
            <Typography
              // className={classes.title}
              variant="h6"
              component="h2"
            >
              {header}
            </Typography>
            <br />
            {renderSummary(event)}
          </CardContent>
        </Card>
      </RouterLink>
    );
  };

  const loader = (
    <div key="loader" className="loader">
      Loading ...
    </div>
  );

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} style={{ marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: '100%', height: '50px' }}
            onClick={handleNewEvent}
          >
            New Event
          </Button>
          {renderNewEventModal()}
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          xs={12}
          style={{
            textAlign: 'center',
            marginBottom: '10px',
            fontSize: '12px',
            fontStyle: 'italic',
          }}
        >
          Total {events.length} events
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <InfiniteScroll
            pageStart={0}
            loadMore={handleLoadMore}
            hasMore={hasMore}
            loader={loader}
          >
            <div className="tracks">
              {events.map((event) => renderEvent(event))}
            </div>
          </InfiniteScroll>
        </Grid>
      </Grid>
    </Container>
  );
}
