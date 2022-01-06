import React from "react"
import DatePicker from "react-datepicker"
import TimeInput from "./TimeInput.jsx"
import "react-datepicker/dist/react-datepicker.css"
import "./DateTimePicker.css"
import { Form } from "react-bootstrap"

const TimeWrapper = ({ selectedTime, setSelectedTime }) => {
  const onTimeChangeHandler = (val) => {
    if (val.length === 5) {
      setSelectedTime(val)
    }
  }

  return (
    <TimeInput
      name="time-input"
      initTime={selectedTime}
      className="s-input -time w-100"
      mountFocus={false}
      onTimeChange={onTimeChangeHandler}
    />
  )
}

export default function DateTimePicker({
  selectedTime,
  setSelectedTime,
  selectedDate,
  setSelectedDate,
}) {
  return (
    <div>
      <Form.Group>
        <Form.Label>Data de início</Form.Label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </Form.Group>
      <Form.Group className="my-2">
        <Form.Label>Hora de início</Form.Label>
        <TimeWrapper selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
      </Form.Group>
    </div>
  )
}
