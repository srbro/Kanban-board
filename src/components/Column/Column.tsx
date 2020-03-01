import React, { useState, DragEvent, Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Ticket from '../Ticket';
import { TicketModel } from '../../models';
import {
  Container,
  Separator,
  Header,
  AddTicketButton,
  Title,
  TicketCount,
  Body
} from './styles';

import { createTicket, deleteTicket } from '../../store/actions';

type Props = {
  columnId: string;
  title: string;
  tickets: TicketModel[];
};

function Column({ columnId, title, tickets }: Props) {
  const dispatch = useDispatch();
  const [draggedOver, setDraggedOver] = useState<boolean>(false);

  const handleCreateClick = (): void => {
    dispatch(createTicket(columnId));
  };

  const onDragOver = (event: DragEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    setDraggedOver(true);
  };

  const onDragLeave = (event: DragEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    setDraggedOver(false);
  };

  const onDrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const dragData = event.dataTransfer.getData('text/plain');

    const { originColumnId, ticketId, text } = JSON.parse(dragData);

    if (originColumnId !== columnId) {
      dispatch(deleteTicket(ticketId));
      dispatch(createTicket(columnId, text));
    }

    setDraggedOver(false);
  };

  return (
    <Container
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Header columnId={columnId}>
        <AddTicketButton
          type="button"
          aria-label="Add new ticket"
          onClick={handleCreateClick}
        >
          +
        </AddTicketButton>
        <Title>{title}</Title>
        <TicketCount>({tickets.length})</TicketCount>
      </Header>
      <Body columnId={columnId} draggedOver={draggedOver}>
        {tickets.map(({ id, text }: TicketModel) => (
          <Fragment key={id}>
            <Ticket columnId={columnId} ticketId={id} text={text} />
            <Separator />
          </Fragment>
        ))}
      </Body>
    </Container>
  );
}

export default Column;
