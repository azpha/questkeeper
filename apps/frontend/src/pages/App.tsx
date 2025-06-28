import { useState, useEffect } from "react";

import GameCard from "@/components/Game/GameCard";
import Layout from "@/components/Layout";
import api from "@/utils/api";
import type { Game } from "../utils/types";
import EmptyState from "@/components/EmptyState";

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
        {games && games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-2">
            {games?.map((v, k) => {
              return <GameCard key={k} game={v} />;
            })}
          </div>
        ) : (
          <EmptyState
            hint="There's nothing here. Why not start your collection?"
            buttonLabel="Take me awaaaayyyy (to search)"
            to="/search"
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
