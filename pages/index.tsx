import Head from 'next/head';
import DynamicProgramming from '../src/algorithms/bridge-torch-dynamic';
import { useEffect, useState } from 'react';
import { Container, Heading, Text } from '@chakra-ui/react';
import SolutionTable from 'src/components/SolutionTable';
import Parameters from 'src/components/Parameters';

export type Solution = DynamicProgramming;

export default function Home() {
  const [travellingTimes, setTravellingTimes] = useState([1, 2, 5, 8]);
  const [capacity, setCapacity] = useState(2);
  const [solution, setSolution] = useState<Solution>();

  useEffect(() => {
    setSolution(new DynamicProgramming(travellingTimes, capacity));
  }, [travellingTimes, capacity]);

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
        <Parameters
          capacity={capacity}
          setCapacity={setCapacity}
          travellingTimes={travellingTimes}
          setTravellingTimes={setTravellingTimes}
        />
        {solution ? (
          <>
            <Heading size="md" marginTop="20px" marginBottom="5px">
              Results
            </Heading>
            <Text marginBottom="5px">Optimal time: {solution.getOptimalTime()}</Text>
            <SolutionTable solution={solution} />
          </>
        ) : null}
      </Container>
    </>
  );
}
