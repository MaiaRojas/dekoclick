import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';


BigCalendar.momentLocalizer(moment);


const createStartEvent = startDate => ({
  id: 'start',
  start: startDate,
  end: new Date(startDate + (24 * 60 * 60 * 1000)),
  allDay: true,
  title: 'Inicio',
  description: 'lorem ipsum',
});


const createEndEvent = (endString) => {
  if (!endString) {
    return [];
  }

  const endDate = moment(endString).toDate();

  return {
    id: 'end',
    start: endDate,
    end: new Date(endDate + (24 * 60 * 60 * 1000)),
    allDay: true,
    title: 'Fin',
  };
};


const CohortCalendar = (props) => {
  const startDate = moment(props.cohort.start).toDate();
  const events = (props.events || [])
    .concat(createStartEvent(startDate), createEndEvent(props.cohort.end));

  return (
    <div style={{ height: '500px' }}>
      <BigCalendar
        views={['month', 'day', 'agenda']}
        defaultDate={startDate}
        events={events}
        onNavigate={() => console.log('navigate')}
        onSelectEvent={props.toggleCalendarAddDialog}
      />
    </div>
  );
};


const selectCalendarEvents = (ordered) =>
  (!ordered || !ordered.calendar)
    ? undefined
    : ordered.calendar.map(item =>
      (item.allDay && item.start && !item.end)
        ? { ...item, end: new Date(item.start + (24 * 60 * 60 * 1000)) }
        : item
    );


export default compose(
  firestoreConnect(props => [{
    collection: 'calendar',
    where: ['cohortid', '==', props.cohortid],
    orderBy: [['start', 'desc']],
  }]),
  connect(
    ({ firestore: { ordered } }, { cohortid }) => ({
      events: selectCalendarEvents(ordered),
    }),
  ),
)(CohortCalendar);
