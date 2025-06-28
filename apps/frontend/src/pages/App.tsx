import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
        {games && games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 my-2">
            {games?.map((v, k) => {
              return <GameCard key={k} game={v} />;
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="my-6">
              <h1 className="text-2xl font-bold">
                Unlimited games, but no games?
              </h1>
              <p>There's nothing here. Why not start your collection?</p>
              <div className="text-center my-2">
                <Link to="/search">
                  <button
                    type="button"
                    className="hover:cursor-pointer bg-white text-black rounded-lg p-2 font-semibold"
                  >
                    Take me awaaaayyyy
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
