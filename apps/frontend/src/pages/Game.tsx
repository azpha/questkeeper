import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Game, IGDBGameAddition, PossibleGameStates } from "@/utils/types";
import { Button } from "@/components/ui/button";

export default function Game() {
  const [game, setGame] = useState<Game | null>(null);
  const [igdbGame, setIgdbGame] = useState<IGDBGameAddition | null>(null);
  const [error, setError] = useState<string>("");
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // hooks
  const params = useParams();
  const navigate = useNavigate();
  const isSearchPage = useMemo(() => params.type === "search", [params]);

  useEffect(() => {
    if (params.slug && params.type) {
      if (params.type === "search") {
        api.fetchGameDataFromIgdb(params.slug).then((res) => {
          console.log(res);
          if (res) {
            setIgdbGame(res);
          }
        });
      } else if (params.type === "game") {
        api.fetchGame(params.slug).then((res) => {
          console.log(res);
          if (res) {
            setGame(res);
          }
        });
      } else {
        navigate("/");
      }

      setHasLoaded(true);
    }
  }, [params.slug, params.type]);

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
  const handleCreation = (status: string) => {
    if (params.slug) {
      api
        .createGame(params.slug, status as unknown as PossibleGameStates)
        .then((res) => {
          if (!res) {
            setError("Failed to update!");
          } else {
            navigate(`/game/${params.slug}`);
          }
        });
    }
  };
  const handleDeletion = () => {
    if (params.slug && params.type === "game" && game) {
      api.deleteGame(game.id).then((res) => {
        if (!res) {
          setError("Failed to delete!");
        } else {
          navigate(`/`);
        }
      });
    }
  };

  return (
    <Layout>
      {game || igdbGame ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={
                    !isSearchPage
                      ? `/api/images/${game?.coverId}`
                      : `http:${igdbGame?.cover.url.replace("t_thumb", "t_cover_big")}`
                  }
                  alt={game?.title}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {!isSearchPage ? (
                  <>
                    {game?.screenshotIds.slice(0, 6).map((v, k) => {
                      return (
                        <div
                          key={k}
                          className="relative rounded overflow w-full"
                        >
                          <img
                            src={`/api/images/${v}`}
                            alt={game?.title + " Screenshot"}
                            className="hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {igdbGame?.screenshots.map((v, k) => {
                      console.log(v);
                      return (
                        <div
                          key={k}
                          className="relative rounded overflow-hidden max-w-fit"
                        >
                          <img
                            src={`http:${v.url.replace("t_thumb", "t_cover_big")}`}
                            alt={igdbGame?.name + " Screenshot"}
                            className="hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-semibold text-3xl mb-2">
                  {!isSearchPage ? game?.title : igdbGame?.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">
                      {!isSearchPage ? (
                        <>
                          {game && game.genres.length > 1
                            ? game?.genres.join(", ")
                            : game?.genres[0]}
                        </>
                      ) : (
                        <>
                          {igdbGame && igdbGame.genres.length > 1
                            ? igdbGame.genres.map((v) => v.name).join(", ")
                            : igdbGame?.genres[0].name}
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <p>{!isSearchPage ? game?.summary : igdbGame?.summary}</p>
              </div>

              <Card className="bg-zinc-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {!isSearchPage ? "Update Status" : "Add to library"}
                  </CardTitle>
                  <Select
                    defaultValue={
                      !isSearchPage
                        ? (game?.currentState as unknown as string)
                        : undefined
                    }
                    onValueChange={
                      isSearchPage ? handleCreation : handleStatusUpdate
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
                {!isSearchPage && (
                  <CardContent>
                    <h1 className="text-lg font-semibold">Delete</h1>
                    <div className="my-2">
                      <Button onClick={handleDeletion} variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card className="bg-zinc-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Game Info</CardTitle>
                  <span className="text-sm">
                    Released:{" "}
                    <span className="font-semibold">
                      {!isSearchPage && game
                        ? new Date(game.releaseDate).toLocaleDateString()
                        : isSearchPage &&
                          igdbGame &&
                          new Date(
                            igdbGame?.first_release_date
                          ).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="text-sm">
                    Developer:{" "}
                    <span className="font-semibold">
                      {!isSearchPage
                        ? game?.developer
                        : igdbGame?.involved_companies.filter(
                            (v) => v.developer
                          )[0].company.name}
                    </span>
                  </span>
                  <span className="text-sm">
                    Publisher:{" "}
                    <span className="font-semibold">
                      {!isSearchPage
                        ? game?.publisher
                        : igdbGame?.involved_companies.filter(
                            (v) => v.publisher
                          )[0].company.name}
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
                  <p className="leading">
                    {!isSearchPage ? game?.storyline : igdbGame?.storyline}
                  </p>
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
