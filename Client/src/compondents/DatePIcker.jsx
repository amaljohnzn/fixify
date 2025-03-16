import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DatePicker = ({ onChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    flatpickr(inputRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      onChange,
    });
  }, []);

  return <input type="text" ref={inputRef} className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white cursor-pointer" placeholder="Select Date Range" />;
};

export default DatePicker;
