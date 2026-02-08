import { XStack } from "tamagui";
import { DateWheel } from "./DateWheel";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

export function DateSelector({ date, setDate }) {
  return (
    <XStack justifyContent="center">
      <DateWheel
        data={months}
        value={months[date.getMonth()]}
        onChange={(month) => {
          const newDate = new Date(date)
          newDate.setMonth(months.indexOf(month))
          setDate(newDate)
        }}
      /> 

      <DateWheel
        data={days}
        value={date.getDate()}
        onChange={(day) => {
          const newDate = new Date(date)
          newDate.setDate(day)
          setDate(newDate)
        }}
      />

      <DateWheel
        data={years}
        value={date.getFullYear()}
        onChange={(year) => {
          const newDate = new Date(date)
          newDate.setFullYear(year)
          setDate(newDate)
        }}
      />
    </XStack>
  );
}