import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
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
import type { Game, PossibleGameStates } from "@/utils/types";
import { Button } from "@/components/ui/button";
import GenrePill from "@/components/Game/GenrePill";

export default function Game() {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string>("");
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // hooks
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = useMemo(() => params.type === "search", [params]);
  const backState = useMemo(() => location.state?.from, [location.state]);

  useEffect(() => {
    if (params.slug && params.type) {
      if (params.type === "search") {
        api.fetchGameFromIgdb(params.slug).then((res) => {
          console.log(res);
          if (res) {
            setGame(res);
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
      {game ? (
        <div className="container mx-auto px-4 py-8">
          {backState && (
            <Link
              to={`/${location.state?.from?.page}`}
              state={{ query: location.state?.from?.query }}
            >
              <h1 className="font-semibold mb-4">
                Back to {location.state?.from?.page}
              </h1>
            </Link>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={
                    !isSearchPage
                      ? `/api/images/${game?.coverId}`
                      : game?.coverUrl
                  }
                  alt={game?.title}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {!isSearchPage ? (
                  <>
                    {game?.screenshotIds?.slice(0, 6).map((v, k) => {
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
                    {game?.screenshotUrls?.map((v, k) => {
                      console.log(v);
                      return (
                        <div
                          key={k}
                          className="relative rounded overflow-hidden max-w-fit"
                        >
                          <img
                            src={v}
                            alt={game?.title + " Screenshot"}
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
                <h1 className="font-semibold text-3xl mb-2">{game?.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <GenrePill
                      genre={
                        game && game.genres.length > 1
                          ? game?.genres.join(", ")
                          : game?.genres[0]
                      }
                    />
                  </div>
                </div>
                <p>{game?.summary}</p>
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
                  <span className="text-sm flex flex-col">
                    <p className="font-semibold">Released:</p>{" "}
                    <span>
                      {new Date(game.releaseDate).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="text-sm flex flex-col">
                    <p className="font-semibold">Developer</p>{" "}
                    <span>{game?.developer}</span>
                  </span>
                  <span className="text-sm flex flex-col">
                    <p className="font-semibold">Publisher:</p>{" "}
                    <span>{game?.publisher}</span>
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
                  <p className="leading">{game?.storyline}</p>
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
