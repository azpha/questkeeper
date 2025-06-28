import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/api";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Game } from "@/utils/types";

export default function Game() {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string>("");
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const params = useParams();

  useEffect(() => {
    if (params.slug) {
      api.fetchGame(params.slug).then((res) => {
        console.log(res);
        if (res) {
          setGame(res);
        }
      });

      setHasLoaded(true);
    }
  }, []);

  // update funcs
  const handleStatusUpdate = (status: string) => {
    if (game) {
      api
        .updateGame(game.id, {
          currentState: status,
        })
        .then((res) => {
          if (!res) {
            setError("Failed to update!");
          }
        });
    }
  };

  return (
    <Layout>
      {game ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={`/api/games/image/${game?.coverId}`}
                  alt={game?.title}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {game.screenshotIds.slice(0, 6).map((v, k) => {
                  return (
                    <div key={k} className="relative rounded overflow w-full">
                      <img
                        src={`/api/games/image/${v}`}
                        alt={game?.title + " Screenshot"}
                        className="hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-semibold text-3xl mb-2">{game.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">
                      {game.genres.length > 1
                        ? game.genres.join(", ")
                        : game.genres[0]}
                    </span>
                  </div>
                </div>
                <p>{game.summary}</p>
              </div>

              <Card className="bg-zinc-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Update Status</CardTitle>
                  <Select
                    defaultValue={game.currentState as unknown as string}
                    onValueChange={handleStatusUpdate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={"Select status"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"WISHLIST"}>Wishlisted</SelectItem>
                      <SelectItem value={"PLAYING"}>Playing</SelectItem>
                      <SelectItem value={"PLANNED"}>Planned</SelectItem>
                      <SelectItem value={"PAUSED"}>Paused</SelectItem>
                      <SelectItem value={"COMPLETED"}>Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {error && <p className="text-red-500">{error}</p>}
                </CardHeader>
              </Card>

              <Card className="bg-zinc-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Game Info</CardTitle>
                  <span className="text-sm">
                    Released:{" "}
                    <span className="font-semibold">
                      {new Date(game.releaseDate).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="text-sm">
                    Developer:{" "}
                    <span className="font-semibold">{game.developer}</span>
                  </span>
                  <span className="text-sm">
                    Publisher:{" "}
                    <span className="font-semibold">{game.publisher}</span>
                  </span>
                </CardHeader>
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-zinc-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">About This Game</CardTitle>
                  <p className="leading">{game.storyline}</p>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      ) : hasLoaded ? (
        <div className="flex flex-col items-center my-4">
          <p className="text-2xl font-bold">Uh oh! there's nothing here :(</p>
          <p>
            Try another path or{" "}
            <a href="/" className="underline">
              go home
            </a>
            .
          </p>
        </div>
      ) : error ? (
        <>
          <h1 className="text-2xl font-bold">Well, this is awkward</h1>
          <p>Something went wrong fetching this content.</p>
        </>
      ) : (
        <p className="my-2 font-bold text-center">Loading..</p>
      )}
    </Layout>
  );
}
