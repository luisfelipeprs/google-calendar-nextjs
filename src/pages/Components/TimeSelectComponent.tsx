import React, { useEffect, useState } from 'react';
import Arrow from '../assets/Vector.svg'

type AvailableTime = {
  start: string;
  end: string;
};

type TimeSelectComponentProps = {
  selectedDate: Date;
  onTimeChange: (time: string) => void; // Prop para notificar o horário selecionado
};

const TimeSelectComponent: React.FC<TimeSelectComponentProps> = ({ selectedDate, onTimeChange }) => {
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const fetchAvailableTimes = async () => {
    try {
      const dateISOString = selectedDate.toISOString();
      const response = await fetch('/api/google/available-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: dateISOString }),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar horários disponíveis.');
      }

      const data = await response.json();
      setAvailableTimes(data);
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
    }
  };

  useEffect(() => {
    fetchAvailableTimes();
  }, [selectedDate]);

  const handleTimeChange = (time: string) => {
    setSelectedTime(time); // Atualiza o estado interno
    const formattedTime = new Date(time).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    onTimeChange(formattedTime); // Envia o horário formatado para o componente pai
  };
  

  const now = new Date();

  const isPast = (time: string) => {
    const startTime = new Date(time);
    return startTime < now;
  };

  return (
    <div className="my-4 relative">
      <select
        className="w-72 px-4 py-3 mt-1 border-0 rounded-lg focus:outline-none text-lg font-bold text-[#060F33] appearance-none text-poppins"
        value={selectedTime}
        onChange={(e) => handleTimeChange(e.target.value)}
      >
        <option value=""></option>
        <option className="font-semibold" disabled>
          Manhã
        </option>
        {availableTimes
          .filter((time) => new Date(time.start).getHours() < 12)
          .map((time, index) => {
            const startTime = new Date(time.start);
            const isDisabled = isPast(time.start);
            return (
              <option
                key={index}
                value={time.start}
                disabled={isDisabled}
                className={isDisabled ? 'text-gray-500' : 'font-bold text-black'}
              >
                {startTime.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </option>
            );
          })}
        <option className="font-semibold" disabled>
          Tarde
        </option>
        {availableTimes
          .filter((time) => new Date(time.start).getHours() >= 12)
          .map((time, index) => {
            const startTime = new Date(time.start);
            const isDisabled = isPast(time.start);
            return (
              <option
                key={index}
                value={time.start}
                disabled={isDisabled}
                className={isDisabled ? 'text-gray-500' : 'font-bold text-black'}
              >
                {startTime.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </option>
            );
          })}
      </select>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-[#060F33]">
        <svg width="15" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 1.5L9 9L1.5 1.5" stroke="#060F33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="w-full h-[2px] bg-black mt-1"></div>
    </div>
  );
};

export default TimeSelectComponent;
