import React from 'react'
import events from '../events'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import * as _ from 'lodash';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.less';

import styled from 'styled-components';

const EventWrapper = styled.div`
    position: relative;
    background-color: #77BC1F;
    border: solid 1px #77BC1F;
    height: 13.5px;
    z-index: 10;
    width: 90%;
    padding-left: 20px;
`;

const StartPoint = styled.span`
    position: absolute;
    left: -10px;
    top: -10px;
    width: 5px;
    height: 5px;
    font-size: 20px;
    color: blue;
    z-index: 20;
    cursor: col-resize;
`;

const EndPoint = styled.span`
    position: absolute;
    right: -5px;
    top: -10px;
    width: 5px;
    height: 5px;
    font-size: 20px;
    color: blue;
    z-index: 20;
    cursor: col-resize;
`;

function CustomMonthEvent ({ event }) {
  return (
    <EventWrapper>
      <StartPoint>o</StartPoint>
      <div onClick={event => console.log('**Event: ', event)}>
        {/* <span>{event.title}</span> */}
      </div>
      <EndPoint onClick={event => console.log('** Click endpoint')}>o</EndPoint>
    </EventWrapper>
  );
}


const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const ResizeDirection = {
    START_TO_LEFT: 'START_TO_LEFT',
    START_TO_RIGHT: 'START_TO_RIGHT',
    END_TO_LEFT: 'END_TO_LEFT',
    END_TO_RIGHT: 'END_TO_RIGHT'
  };

class Dnd extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      events: events,
      resizing: false,
    }
    this.moveEvent = this.moveEvent.bind(this)
    this.onEventResize = this.onEventResize.bind(this);
  }

  addDays(theDate, days) {
      return new Date(theDate.getTime() + days*24*60*60*1000);
  }

  moveEvent({ event, start, end }) {
    const { events } = this.state;
    this.setState({ resizing: false, resizeDirection: undefined });
  }

  getResizeDirection(changingValue, start, end, resizedDays) {
    if (this.addDays(end, -resizedDays).getTime() === changingValue.getTime() || this.addDays(end, -resizedDays-1).getTime() === changingValue.getTime()) {
      return ResizeDirection.END_TO_LEFT;
    }
    return undefined;
  }

  onEventResize = (itemType, event, value) => {
    if(!this.state.resizing) {
      this.setState({ resizing: true, resizeDirection: this.getResizeDirection(value, event.start, event.end, 1)});
    }

    let startDate;
    let endDate;
    if (this.state.resizeDirection === ResizeDirection.END_TO_LEFT) {
      startDate = event.start;
      endDate = value;
    } else {
      startDate = value > event.start ? value < event.end ? value : event.start : value;
      endDate = value > event.start ? value < event.end ? event.end : value : event.end;
    }

    const dates = {
      start: startDate,
      end: endDate,
    }

    const updatedEvent = { ...event, ...dates };
    const { events } = this.state;
    const oldEvents = [...events];

     _.remove(oldEvents, eventItem => {
        return (eventItem.id === event.id)
     });

    const newEvents = [...oldEvents, updatedEvent];
    this.setState({
      events: newEvents
    })
  };

  render(){
    return (
      <DragAndDropCalendar
        selectable
        events={this.state.events}
        onEventDrop={this.moveEvent}
        defaultView='month'
        components={{
          month: {
            event: CustomMonthEvent
          }
        }}
        defaultDate={new Date(2015, 3, 12)}
        onEventResize={this.onEventResize}
      />
    )
  }
}

export default DragDropContext(HTML5Backend)(Dnd)
