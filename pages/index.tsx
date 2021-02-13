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

  // useEffect(() => {
  console.log(`travelling times: ${travellingTimes}`);
  console.log(`bridge capacity: ${capacity}`);

  const problem = new DynamicProgramming(travellingTimes, capacity);

  // console.log(problem.getSequenceOfCrossings());
  const sequenceOfCrossings = problem.getSequenceOfCrossings();
  console.log();
  console.log(`optimal time: ${problem.getOptimalTime()}`);
  for (let crossing of sequenceOfCrossings) {
    console.log(
      `${crossing.direction}: ${travellingTimes.slice(...crossing.entityRange)} (time: ${
        crossing.duration
      }), ${crossing.entityRange}`,
    );
  }
  // }, []);

  const handleTravellingTimesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const travellingTimes = e.target.value
      .replace(/[^0-9,]/g, '') // remove unwanted characters
      .replace(/,+/g, ',')
      .replace(/(\s*,?\s*)*$/, '') // remove trailing commas
      .replace(/^(\s*,?\s*)*/, '') // remove leading commas
      .split(',')
      .map((n) => Number(n));

    if (travellingTimes.length > capacity) {
      // the algorithm assumes, that numberOfPeople > capacity
      setTravellingTimes(travellingTimes);
    }
  };

  const handleCapacityChange = (_: string, valueNumber: number) => {
    setCapacity(valueNumber);
  };

  return (
    <>
      <Head>
        <title>Bridge and torch problem</title>
      </Head>
      <Container maxW="3xl" marginY="20px">
        <VStack spacing="20px">
          <Heading>Bridge and torch problem</Heading>
          <FormControl id="travellingTimes">
            <HStack align="top">
              <Box>
                <FormLabel>Travelling times: </FormLabel>
                <Input
                  name="travellingTimes"
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
                  max={100}
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
          </FormControl>
          <Text>Optimal time: {problem.getOptimalTime()}</Text>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>time elapsed</Th>
                <Th>duration</Th>
                <Th>who moves</Th>
                <Th>direction</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sequenceOfCrossings.map((crossing, i) => (
                <Tr key={i}>
                  <Td>0</Td>
                  <Td>{crossing.duration}</Td>
                  <Td>{travellingTimes.slice(...crossing.entityRange).join(', ')}</Td>
                  <Td>{crossing.direction}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Container>
    </>
  );
}
