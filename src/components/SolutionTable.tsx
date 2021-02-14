import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { Crossing } from '../algorithms/types';
import Algorithm from '../algorithms/Algorithm';

interface TableData {
  timeElapsed: string;
  duration: string;
  start: string;
  move: string;
  destination: string;
}

const makeMaskedString = <T,>(table: T[], booleanTable: T[]) => {
  // mask when false
  return table.map((item, i) => (booleanTable[i] ? item : '-')).join(' ');
};

const makeTableData = (sequenceOfCrossings: Crossing[], travellingTimes: number[]) => {
  let startBools = Array(travellingTimes.length).fill(true);
  let destBools = Array(travellingTimes.length).fill(false);
  let timeElapsed = 0;
  const tableData: TableData[] = [
    {
      timeElapsed: timeElapsed.toString(),
      duration: '-',
      start: makeMaskedString(travellingTimes, startBools),
      move: '-',
      destination: makeMaskedString(travellingTimes, destBools),
    },
  ];

  for (let crossing of sequenceOfCrossings) {
    for (let id of crossing.entityIds) {
      startBools[id] = crossing.direction === 'left';
      destBools[id] = crossing.direction === 'right';
    }
    timeElapsed += crossing.duration;
    tableData.push({
      timeElapsed: timeElapsed.toString(),
      duration: crossing.duration.toString(),
      start: makeMaskedString(travellingTimes, startBools),
      move:
        (crossing.direction === 'left' ? '⤺ ' : '') +
        crossing.entityIds.map((entityId) => travellingTimes[entityId]).join(', ') +
        (crossing.direction === 'right' ? ' →' : ''),
      destination: makeMaskedString(travellingTimes, destBools),
    });
  }
  return tableData;
};

interface Props {
  solution: Algorithm;
}

export default function SolutionTable({ solution }: Props) {
  const seqOfCrossings = solution.getSequenceOfCrossings();
  const tableData = makeTableData(seqOfCrossings, solution.getTravellingTimes());
  return (
    <Table size="sm" display="block" overflowX="auto">
      <Thead>
        <Tr>
          <Th>time elapsed</Th>
          <Th>duration</Th>
          <Th>start</Th>
          <Th>move</Th>
          <Th>destination</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tableData.map((row, i) => (
          <Tr key={i}>
            <Td isNumeric>{row.timeElapsed}</Td>
            <Td isNumeric>{row.duration}</Td>
            <Td>{row.start}</Td>
            <Td>{row.move}</Td>
            <Td>{row.destination}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
