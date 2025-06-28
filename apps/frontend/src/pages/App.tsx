import { useState, useEffect } from "react";

import GameCard from "@/components/Game/GameCard";
import Layout from "@/components/Layout";
import api from "@/utils/api";
import type { Game } from "../utils/types";

function App() {
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    api.fetchGames().then((res) => {
      setGames(res);
    });
  }, []);

  return (
    <Layout>
      <div className="container flex justify-center mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 my-2">
          {games?.map((v, k) => {
            return <GameCard key={k} game={v} />;
          })}
        </div>
      </div>
    </Layout>
  );
}

export default App;
