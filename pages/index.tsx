import Head from 'next/head';
import DynamicProgramming from '../src/algorithms/DynamicProgramming';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import SolutionTable from 'src/components/SolutionTable';
import Parameters from 'src/components/Parameters';
import Greedy from '../src/algorithms/Greedy';
import Algorithm from '../src/algorithms/Algorithm';
import { AlgorithmType } from 'src/algorithms/types';
import BruteForce from '../src/algorithms/BruteForce';
import ReactMarkdown from 'react-markdown';

interface SectionProps {
  children: React.ReactChild;
  /** @deprecated */
  bg?: string;
  headingText?: string;
}

function Section(props: SectionProps) {
  const { bg, children, headingText } = props;
  return (
    <Box bg={bg ?? 'inherit'} color={'gray.200'} minW={'100%'}>
      <Container maxW="3xl">
        {headingText && (
          <Heading size="lg" paddingV={6} color={'blue.400'}>
            {headingText}
          </Heading>
        )}
        {children}
      </Container>
    </Box>
  );
}

const Contributor = (id: number, name: string, avatar: string, profile: string) => ({
  id,
  name,
  avatar,
  profile,
  link: `https://github.com/${profile}`,
});

const contributors = [
  Contributor(
    1,
    'Filip Sauer',
    'https://avatars.githubusercontent.com/u/17103865?s=460&amp;u=4f9c9b007dd9474165e53bc7b8d49b44393e778c&amp;v=4',
    'srflp',
  ),
  Contributor(
    2,
    'Konrad Szychowiak',
    'https://avatars.githubusercontent.com/u/39061969?s=460&amp;u=e0426fc55edf7ad92728a170bbbd7c4b322af789&amp;v=4',
    'konrad-szychowiak',
  ),
];

const textOnPage = {
  description: `
**Bridge-and-torch** problem is, in its basic form, a riddle: for given people and their
speeds you have to find the shortest time possible in which they can cross a bridge at
night, if:

1. the bridge can only hold a certain amount of people,
1. it's dark outside so when crossing the bridge one person has to hold a torch (hence the name of the problem),
1. there is only one torch, so somebody has to go bring it back to the rest of the waiting people, and
1. when a group is passing the bridge they are moving with the speed of the slowest one among them.`,
  prompt: `Below you will find a simulator which will allow you to input desired speeds of the
travellers and bridge capacity and use three different algorithms to solve the
problem.

We encourage you to play around with it!`,
};

function Top() {
  return (
    <Stack direction={'column'} spacing={4} paddingY={6}>
      <Heading>🌉 Bridge and torch problem</Heading>
      <Stack spacing={2} direction={'row'} align={'center'}>
        <Button size={'sm'} colorScheme={'blue'}>
          in English
        </Button>
      </Stack>
    </Stack>
  );
}

function Info() {
  return (
    <Section bg={'inherit'} headingText={'Wait, what?'}>
      <Box paddingTop={'2em'}>
        <ReactMarkdown children={textOnPage.description} />
      </Box>
    </Section>
  );
}

function Bottom() {
  return (
    <Section headingText={'Authors'}>
      <>
        <Stack direction={'column'} spacing={3} py={6}>
          {contributors.map((contributor, index) => {
            const { id, name, avatar, profile, link } = contributor;
            return (
              <a href={link} key={index}>
                <Stack direction={'row'} align={'center'}>
                  <Avatar name={name} src={avatar} size={'sm'} />
                  <Heading size={'sm'}>{name}</Heading>
                  {/*<code>{'@' + profile}</code>*/}
                </Stack>
              </a>
            );
          })}
        </Stack>
      </>
    </Section>
  );
}

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
        // TODO: are we importing `js-combinatorics` every time we select BruteForce algorithm?
        // js-combinatorics is broken and not compatible with Node,
        // thus BruteForce class should only be instantiated on the client-side.
        if (typeof window !== 'undefined') {
          import('js-combinatorics').then(({ Combination }) => {
            // the worst hack ever
            // @ts-ignore
            window.Combination = Combination;
            setSolution(new BruteForce(travellingTimes, capacity));
          });
        }
        break;
    }
  }, [travellingTimes, capacity, algorithm]);

  return (
    <>
      <Head>
        <title>Bridge and torch problem</title>
      </Head>

      <VStack color={'gray.200'} bgColor={'black'}>
        <Top />

        <Info />

        <Section>
          <>
            <Heading size="lg" marginTop="20px" marginBottom="5px" color={'blue.400'}>
              Setup
            </Heading>
            <Box pb={'2em'}>
              <ReactMarkdown children={textOnPage.prompt} />
            </Box>
          </>
        </Section>

        <Parameters
          capacity={capacity}
          setCapacity={setCapacity}
          travellingTimes={travellingTimes}
          setTravellingTimes={setTravellingTimes}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
        />

        {solution && (
          <>
            <Section headingText={'Results'}>
              <Text marginBottom="5px">Generated answer: {solution.getTotalTime()}</Text>
              {/*<Text marginBottom="5px">Time spent: {solution.getTotalTime()}</Text>*/}
            </Section>
            <Box>
              <SolutionTable solution={solution} />
            </Box>
          </>
        )}

        <Bottom />
      </VStack>
    </>
  );
}
