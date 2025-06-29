import { useState, useEffect } from "react";

import GameCard from "@/components/Game/GameCard";
import Layout from "@/components/Layout";
import api from "@/utils/api";
import { PossibleGameStates, type Game } from "../utils/types";
import EmptyState from "@/components/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function App() {
  const [games, setGames] = useState<Game[] | null>(null);
  const [actionableGames, setActionableGames] = useState<Game[] | null>(null);
  const [tabValue, setTabValue] = useState<string>("PLAYING");

  useEffect(() => {
    api.fetchGames().then((res) => {
      setGames(res);
    });
    api.fetchBacklogGames().then((res) => {
      setActionableGames(res);
    });
  }, []);

  const GameGrid = () => {
    if (games && games.filter((v) => v.currentState === tabValue).length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-2">
          {games
            ?.filter((v) => v.currentState === tabValue)
            .map((v, k) => {
              return <GameCard key={k} game={v} />;
            })}
        </div>
      );
    } else {
      return <EmptyState hint="No games with this filter :(" />;
    }
  };
  const BacklogGrid = () => {
    if (actionableGames && actionableGames.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-2">
          {actionableGames
            ?.filter((v) => v.currentState === tabValue)
            .map((v, k) => {
              return <GameCard key={k} game={v} />;
            })}
        </div>
      );
    }
  };

  return (
    <Layout>
      <div className="flex w-full items-center flex-col">
        {actionableGames && actionableGames.length > 0 && (
          <div className="my-2">
            <h1 className="text-2xl font-bold">Are you still playing?</h1>
            <p>These games have been set to "Playing" for over a month.</p>
            <BacklogGrid />
          </div>
        )}
        {games && games.length > 0 ? (
          <Tabs
            defaultValue={"PLAYING"}
            onValueChange={(e: string) => setTabValue(e as PossibleGameStates)}
          >
            <div className="justify-center flex mt-6">
              <TabsList>
                <TabsTrigger value="PLAYING">Playing</TabsTrigger>
                <TabsTrigger value="PAUSED">Paused</TabsTrigger>
                <TabsTrigger value="PLANNED">Planned</TabsTrigger>
                <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
                <TabsTrigger value="WISHLIST">Wishlisted</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="PLAYING">
              <GameGrid />
            </TabsContent>
            <TabsContent value="PAUSED">
              <GameGrid />
            </TabsContent>
            <TabsContent value="PLANNED">
              <GameGrid />
            </TabsContent>
            <TabsContent value="WISHLIST">
              <GameGrid />
            </TabsContent>
            <TabsContent value="COMPLETED">
              <GameGrid />
            </TabsContent>
          </Tabs>
        ) : (
          <EmptyState
            hint="There's nothing here. Why not start your collection?"
            buttonLabel="Take me awaaaayyyy (to search)"
            to="/search"
          />
        )}
      </div>
      <div className="container flex justify-center mx-auto w-full"></div>
    </Layout>
  );
}

export default App;
