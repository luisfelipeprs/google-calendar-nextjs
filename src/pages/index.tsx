import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Konami from "react-konami-code";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
function makeCapybaraWalk() {
  const capybara = document.createElement("div");
  capybara.textContent = "🦫";
  capybara.style.position = "absolute";
  capybara.style.top = "50%";
  capybara.style.left = "0";
  capybara.style.transform = "translateY(-50%)";
  capybara.style.fontSize = "50px";
  capybara.style.transition = "left 1s linear";
  document.body.appendChild(capybara);

  let position = 0;

  function walk() {
    position += 10;
    if (position > window.innerWidth) {
      position = -50;
    }
    capybara.style.left = `${position}px`;
  }

  setInterval(walk, 100);
}
export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col justify-between bg-gradient-to-b from-indigo-500 to-purple-700 text-white`}>
      <Konami action={() => makeCapybaraWalk()} />
      <main className="flex flex-col items-center justify-center text-center py-20 px-8 bg-transparent">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
          Agende Reuniões no Google Calendar
        </h1>
        <p className="text-lg sm:text-xl font-light text-white mb-8">
          Um sistema simples para integrar seu agendamento diretamente ao Google Calendar.
        </p>
        <Link
          href="/Schedule"
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 transition-all"
        >
          Agende Agora
        </Link>
      </main>

      <section className="max-w-3xl mx-auto text-center px-8 mb-16">
        <h2 className="text-3xl font-semibold text-white mb-4">Sobre o Projeto</h2>
        <p className="text-lg font-light text-white mb-8">
          Este é um projeto que permite agendar reuniões diretamente no Google Calendar. Para usar, basta configurar suas credenciais no Google Cloud Console e definir as chaves necessárias no arquivo `.env`.
        </p>

        <div className="space-y-4">
          <div className="text-base text-white font-light">
            <p>
              <span className="font-semibold">Passo 1:</span> Crie um projeto no <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-200 hover:underline">Google Cloud Console</a>.
            </p>
            <p>
              <span className="font-semibold">Passo 2:</span> Obtenha seu <code className="font-mono bg-gray-800 px-2 py-1 rounded">GOOGLE_CLIENT_ID</code>, <code className="font-mono bg-gray-800 px-2 py-1 rounded">GOOGLE_CLIENT_SECRET</code>, e <code className="font-mono bg-gray-800 px-2 py-1 rounded">GOOGLE_REFRESH_TOKEN</code>.
            </p>
            <p>
              <span className="font-semibold">Passo 3:</span> Configure essas chaves no arquivo <code className="font-mono bg-gray-800 px-2 py-1 rounded">.env</code> da sua aplicação.
            </p>
          </div>

          <div className="text-white text-base font-light">
            <p>
              Para mais detalhes sobre como configurar o Google Cloud Console, consulte a <a href="https://cloud.google.com/docs/authentication/getting-started" target="_blank" className="text-blue-200 hover:underline">documentação oficial</a>.
            </p>
            <p>
              Assista a um tutorial sobre como configurar sua conta do Google Cloud Console:{" "}
              <a href="https://www.youtube.com/watch?v=c2b2yUNWFzI" target="_blank" className="text-blue-200 hover:underline">
                Vídeo Tutorial
              </a>.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 bg-gray-900">
        <div className="flex justify-center gap-8">
          <a href="https://www.linkedin.com/in/luisfelipeprs" target="_blank" className="text-lg hover:text-blue-400 transition">
            LinkedIn
          </a>
          <a href="https://github.com/luisfelipeprs" target="_blank" className="text-lg hover:text-gray-400 transition">
            GitHub
          </a>
        </div>
      </footer>
    </div >
  );
}
