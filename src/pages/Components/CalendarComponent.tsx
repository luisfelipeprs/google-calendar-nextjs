import React from 'react';

type CalendarComponentProps = {
  onDateChange: (date: Date) => void;
  selectedDate: Date;
};

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateChange, selectedDate }) => {
  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const previousMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      const newDate = new Date(currentYear, currentMonth, day);
      if (!isDisabled(newDate)) {
        onDateChange(newDate);
      }
    }
  };

  const isSelected = (day: number) =>
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getFullYear() === currentYear;

  const isWeekend = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Domingo (0) e Sábado (6)
  };

  const isDisabled = (date: Date) => {
    return date < today || isWeekend(date);
  };

  return (
    <div className="my-4">
      <h2 className="text-xl text-gray-800 font-poppins font-extrabold">Agenda</h2>
      <h2 className="size-16 text-gray-800 font-poppins w-32 font-medium">
        {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <div className="grid grid-cols-7 gap-2 text-center text-gray-800">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="flex items-center justify-center font-semibold w-8 h-8"
          >
            {day}
          </div>
        ))}
        {/* Preenchendo os dias finais do mês anterior */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => {
          const day = previousMonthDays - firstDayOfMonth + i + 1;
          return (
            <div
              key={`prev-${day}`}
              className="flex items-center justify-center w-8 h-8 rounded-full cursor-not-allowed font-poppins font-semibold text-gray-300 text-sm"
            >
              {day}
            </div>
          );
        })}
        {/* Dias do mês atual */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const currentDate = new Date(currentYear, currentMonth, day);
          const isDayDisabled = isDisabled(currentDate);
          const dayIsSelected = isSelected(day);

          return (
            <div
              key={day}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-poppins ${
                isDayDisabled ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer text-gray-800 text-[#060F33]'
              } ${dayIsSelected ? 'bg-[#060F33] font-bold' : 'font-medium '}`}
              onClick={() => handleDayClick(day, !isDayDisabled)}
            >
              <p className={`${dayIsSelected ? 'text-sm text-[#FEED24]' : ''}`}>{day}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarComponent;
