import { useState, useEffect } from 'react';
import Link from 'next/link';

const Schedule = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    selectedDateTime: '',
  });
  type AvailableTime = {
    start: string;
    end: string;
  };
  
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.selectedDateTime) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const selectedDateTime = new Date(Number(formData.selectedDateTime));
    console.log(formData.name, formData.email, selectedDateTime);

    if (isNaN(selectedDateTime.getTime())) {
      alert('Data e hora inválidas.');
      return;
    }

    const date = selectedDateTime.toISOString().split('T')[0];
    const time = selectedDateTime.toISOString().split('T')[1].split('.')[0];

    try {
      const response = await fetch('/api/google/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          date,
          time,
        }),
      });

      if (response.ok) {
        alert('Reunião marcada com sucesso!');
        setFormData({ name: '', email: '', selectedDateTime: '' });
        fetchAvailableTimes();
      } else {
        alert('Erro ao marcar a reunião.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao marcar a reunião.');
    }
  };

  const fetchAvailableTimes = async () => {
    try {
      const response = await fetch('/api/google/available-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: new Date().toISOString(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        }),
      });
      const data = await response.json();
      setAvailableTimes(data);
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis', error);
    }
  };

  useEffect(() => {
    fetchAvailableTimes();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-700">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg space-y-8">
      <Link href="/">
          <p className="text-indigo-600 hover:text-indigo-800 font-semibold underline">
            &larr; Voltar para Home
          </p>
        </Link>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Agendar Reunião</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Escolha o horário</label>
            <select
              name="selectedDateTime"
              value={formData.selectedDateTime}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione um horário</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={time.start}>
                  {new Date(time.start).toLocaleString()} - {new Date(time.end).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Agendar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Schedule;
