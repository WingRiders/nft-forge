import {format} from 'date-fns'

export const formatDateTime = (date: Date | number) =>
  format(date, 'dd/MM/yyyy HH:mm')
