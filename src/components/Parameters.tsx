import {
  Box,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';

interface Props {
  capacity: number;
  setCapacity: React.Dispatch<React.SetStateAction<number>>;
  travellingTimes: number[];
  setTravellingTimes: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function Parameters({
  capacity,
  setCapacity,
  travellingTimes,
  setTravellingTimes,
}: Props) {
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
    <HStack align="top">
      <Box>
        <FormLabel>Travelling times: </FormLabel>
        <Input onChange={handleTravellingTimesChange} defaultValue={travellingTimes.toString()} />
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
  );
}
