import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import EventCell from './EventCell';
import getHeight from 'dom-helpers/query/height';
import { accessor, elementType } from './utils/propTypes';
import { segStyle } from './utils/eventLevels';
import { isSelected } from './utils/selection';

/* eslint-disable react/prop-types */
export default {
  propTypes: {
    slots: PropTypes.number.isRequired,
    end: PropTypes.instanceOf(Date),
    start: PropTypes.instanceOf(Date),

    selected: PropTypes.object,
    eventPropGetter: PropTypes.func,
    titleAccessor: accessor,
    allDayAccessor: accessor,
    startAccessor: accessor,
    endAccessor: accessor,

    eventComponent: elementType,
    eventWrapperComponent: elementType.isRequired,
    onSelect: PropTypes.func
  },

  defaultProps: {
    segments: [],
    selected: {},
    slots: 7
  },

  renderEvent(props, event) {
    let {
        eventPropGetter, selected, start, end
      , startAccessor, endAccessor, titleAccessor
      , allDayAccessor, eventComponent
      , eventWrapperComponent
      , onSelect, week } = props;

    // console.log('********** WEEK OF A ROW: ', week);
    // console.log('** EventRowMixin event: ', event);
    // console.log('** startAccesor: ', startAccessor);
    // console.log('** endAccessor: ', endAccessor);
    // console.log('** slotStart: ', start);
    // console.log('** slotEnd: ', end);

    return (
      <EventCell
        event={event}
        eventWrapperComponent={eventWrapperComponent}
        eventPropGetter={eventPropGetter}
        onSelect={onSelect}
        selected={isSelected(event, selected)}
        startAccessor={startAccessor}
        endAccessor={endAccessor}
        titleAccessor={titleAccessor}
        allDayAccessor={allDayAccessor}
        slotStart={start}
        slotEnd={end}
        eventComponent={eventComponent}
        week={week}
      />
    )
  },

  renderSpan(props, len, key, content = ' '){
    let { slots } = props;

    return (
      <div key={key} className='rbc-row-segment' style={segStyle(Math.abs(len), slots)}>
        {content}
      </div>
    )
  },

  getRowHeight(){
    getHeight(findDOMNode(this))
  }
}
