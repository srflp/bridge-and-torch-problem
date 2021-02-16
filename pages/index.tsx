import Head from 'next/head';
import DynamicProgramming from '../src/algorithms/DynamicProgramming';
import React, { useEffect, useState } from 'react';
import { Container, Heading, Text } from '@chakra-ui/react';
import SolutionTable from 'src/components/SolutionTable';
import Parameters from 'src/components/Parameters';
import Greedy from '../src/algorithms/Greedy';
import Algorithm from '../src/algorithms/Algorithm';
import { AlgorithmType } from 'src/algorithms/types';
import BruteForce from '../src/algorithms/BruteForce';

export default function Home() {
  const [travellingTimes, setTravellingTimes] = useState([1, 2, 5, 8]);
  const [capacity, setCapacity] = useState(2);
  const [solution, setSolution] = useState<Algorithm>();
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(AlgorithmType.Dynamic);

  useEffect(() => {
    switch (algorithm) {
      case AlgorithmType.Dynamic:
        setSolution(new DynamicProgramming(travellingTimes, capacity));
        break;
      case AlgorithmType.Greedy:
        setSolution(new Greedy(travellingTimes, capacity));
        break;
      case AlgorithmType.Brute:
        // js-combinatorics is broken and not compatible with Node,
        // thus BruteForce class should only be instantiated on the client-side.
        if (typeof window !== 'undefined') {
          import('js-combinatorics').then(({Combination}) => {
            // the worst hack ever
            // @ts-ignore
            window.Combination = Combination;
            setSolution(new BruteForce(travellingTimes, capacity));
          })
        }
        break;
    }
  }, [travellingTimes, capacity, algorithm]);

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
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
        />
        {solution ? (
          <>
            <Heading size="md" marginTop="20px" marginBottom="5px">
              Results
            </Heading>
            <Text marginBottom="5px">Total time: {solution.getTotalTime()}</Text>
            <SolutionTable solution={solution} />
          </>
        ) : null}
      </Container>
    </>
  );
}
