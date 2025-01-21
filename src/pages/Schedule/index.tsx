import React, { useState } from 'react';
import CalendarComponent from '../Components/CalendarComponent';
import TimeSelectComponent from '../Components/TimeSelectComponent';
import ButtonComponent from '../Components/ButtonComponent';

const SchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Adiciona um dia
    return today;
  });

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState<string>('your-name-here');
  const [email, setEmail] = useState<string>('your-email-here');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleScheduleClick = async () => {
    console.log(name, email, selectedTime);

    if (!name || !email || !selectedTime) {
      alert('Por favor, preencha todos os campos e selecione um horário.');
      return;
    }

    const dateString = selectedDate.toISOString().split('T')[0];

    try {
      const response = await fetch('/api/google/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          date: dateString,
          time: selectedTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao agendar a reunião.');
      }

      const data = await response.json();
      alert('Reunião marcada com sucesso!');
    } catch (error) {
      console.error('Erro ao marcar a reunião:', error);
      alert('Houve um erro ao marcar a reunião.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl flex">
        <div className="flex-1">
          <CalendarComponent selectedDate={selectedDate} onDateChange={handleDateChange} />
        </div>
        <div className="w-[2px] bg-gray-300 mx-10"></div>
        <div className="flex-1 flex flex-col justify-center items-center space-y-4">
          <TimeSelectComponent
            selectedDate={selectedDate}
            onTimeChange={(time) => setSelectedTime(time)}
          />
          <ButtonComponent onClick={handleScheduleClick} text="Agendar consultoria gratuita" />
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
