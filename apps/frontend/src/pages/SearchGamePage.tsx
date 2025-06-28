import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import type { IGDBGameAddition, PossibleGameStates } from "@/utils/types";

export default function SearchGamePage() {
  const [game, setGame] = useState<IGDBGameAddition | null>(null);
  const [error, setError] = useState<string>("");
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.slug) {
      api.fetchGameDataFromIgdb(params.slug).then((res) => {
        if (res) {
          setGame(res);
        }
      });

      setHasLoaded(true);
    }
  }, []);

  // update funcs
  const handleCreation = (status: PossibleGameStates) => {
    if (params.slug) {
      api.createGame(params.slug, status).then((res) => {
        if (!res) {
          setError("Failed to update!");
        } else {
          navigate(`/game/${params.slug}`);
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
              <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                <img
                  src={`http:${game?.cover.url.replace("t_thumb", "t_cover_big")}`}
                  alt={game?.name}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {game.screenshots.map((v, k) => {
                  console.log(v);
                  return (
                    <div
                      key={k}
                      className="aspect-video relative rounded overflow-hidden"
                    >
                      <img
                        src={`http:${v.url.replace("t_thumb", "t_cover_big")}`}
                        alt={game?.name + " Screenshot"}
                        className="hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-semibold text-3xl mb-2">{game.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">
                      {game.genres.length > 1
                        ? game.genres.map((v) => v.name).join(", ")
                        : game.genres[0].name}
                    </span>
                  </div>
                </div>
                <p>{game.summary}</p>
              </div>

              <Card className="bg-zinc-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Add to library</CardTitle>
                  <Select
                    onValueChange={(v: string) =>
                      handleCreation(v as unknown as PossibleGameStates)
                    }
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
                      {new Date(game.first_release_date).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="text-sm">
                    Developer:{" "}
                    <span className="font-semibold">
                      {
                        game.involved_companies.filter((v) => v.developer)[0]
                          .company.name
                      }
                    </span>
                  </span>
                  <span className="text-sm">
                    Publisher:{" "}
                    <span className="font-semibold">
                      {" "}
                      {
                        game.involved_companies.filter((v) => v.publisher)[0]
                          .company.name
                      }
                    </span>
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
