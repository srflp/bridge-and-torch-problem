import Head from 'next/head';
import DynamicProgramming from '../src/algorithms/bridge-torch-dynamic';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  NumberInputField,
  NumberInput,
  Text,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Box,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
} from '@chakra-ui/react';

export default function Home() {
  const [travellingTimes, setTravellingTimes] = useState([1, 2, 5, 8]);
  const [capacity, setCapacity] = useState(2);

  const problem = new DynamicProgramming(travellingTimes, capacity);

  const handleTravellingTimesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const travellingTimes = e.target.value
      .replace(/[^0-9,]/g, '') // remove unwanted characters
      .replace(/,+/g, ',')
      .replace(/(\s*,?\s*)*$/, '') // remove trailing commas
      .replace(/^(\s*,?\s*)*/, '') // remove leading commas
      .split(',')
      .map((n) => Number(n))
      .sort((a, b) => a - b);
    if (travellingTimes.length <= capacity) {
      // the algorithm assumes, that numberOfPeople > capacity
      if (capacity > 2) {
        setCapacity(travellingTimes.length - 1);
      } else {
        return;
      }
    }

    setTravellingTimes(travellingTimes);
  };

  const handleCapacityChange = (_: string, valueNumber: number) => {
    if (travellingTimes.length > valueNumber && valueNumber > 1) {
      setCapacity(valueNumber);
    }
  };

  return (
    <>
      <Head>
        <title>Bridge and torch problem</title>
      </Head>
      <Container maxW="3xl" marginY="20px">
        <Heading as="h1">Bridge and torch problem</Heading>
        <Heading size="md" marginTop="20px" marginBottom="5px">
          Parameters
        </Heading>
        <HStack align="top">
          <Box>
            <FormLabel>Travelling times: </FormLabel>
            <Input
              onChange={handleTravellingTimesChange}
              defaultValue={travellingTimes.toString()}
            />
            <Text>Parsed: {travellingTimes.toString()}</Text>
          </Box>
          <Box>
            <FormLabel>Bridge capacity: </FormLabel>
            <NumberInput
              defaultValue={capacity}
              min={2}
              max={travellingTimes.length - 1}
              value={capacity}
              onChange={handleCapacityChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
        </HStack>
        <Heading size="md" marginTop="20px" marginBottom="5px">
          Results
        </Heading>
        <Text marginBottom="5px">Optimal time: {problem.getOptimalTime()}</Text>
        <Table size="sm" display="block" overflowX="auto">
          <Thead>
            <Tr>
              <Th>time elapsed</Th>
              <Th>duration</Th>
              <Th>who moves</Th>
              <Th>direction</Th>
            </Tr>
          </Thead>
          <Tbody>
            {problem.getSequenceOfCrossings().map((crossing, i) => (
              <Tr key={i}>
                <Td>0</Td>
                <Td>{crossing.duration}</Td>
                <Td>
                  {crossing.entityIds.map((entityId) => travellingTimes[entityId]).join(', ')}
                </Td>
                <Td>{crossing.direction}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
    </>
  );
}
