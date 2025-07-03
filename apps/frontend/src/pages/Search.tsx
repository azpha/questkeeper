import api from "@/utils/api";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import GameList from "@/components/Game/GameList";
import Layout from "@/components/Layout";
import EmptyState from "@/components/EmptyState";
import type { Game } from "@/utils/types";

export default function Search() {
  const [results, setResults] = useState<Game[] | null>(null);
  const [addedGames, setAddedGames] = useState<{ gameSlug: string }[] | null>(
    null
  );
  const [query, setQuery] = useState<string>("");
  const [params] = useSearchParams();
  const location = useLocation();

  const debounced = useCallback(
    debounce((query: string) => {
      api.searchIgdb(query).then((res) => {
        if (res) {
          setResults(res);
        }
      });
    }, 500),
    []
  );

  useEffect(() => {
    api.fetchGames(`select=gameSlug`).then((res) => {
      if (res) {
        setAddedGames(res);
      }
    });
  }, []);
  useEffect(() => {
    const q = params.get("q") || location.state?.query;
    if (q) {
      setQuery(q);
      debounced(q);
    }
  }, [params.get("q"), location.state?.query]);
  const listOfExistingGames = useMemo(() => {
    const matchedInArray = results
      ?.filter((v) => {
        return addedGames?.some(
          (addedGame) => addedGame.gameSlug === v.gameSlug
        );
      })
      .map((v) => v.gameSlug);
    return matchedInArray;
  }, [results]);

  const ExistingGames = () => {
    return (
      <div>
        <div className="my-6">
          <h1 className="text-2xl font-bold">Already added</h1>
          <p>Games in your library matching this search query</p>
        </div>

        <GameList>
          {results
            ?.filter((v) => {
              return listOfExistingGames?.includes(v.gameSlug);
            })
            .map((v, k) => {
              return (
                <Link
                  state={{
                    from: {
                      page: "search",
                      query,
                    },
                  }}
                  to={`/game/${v.gameSlug}`}
                  key={k}
                >
                  <div className="select-none bg-zinc-800 border-white border border-solid rounded-lg p-2">
                    <h1 className="font-bold text-2xl whitespace-nowrap truncate">
                      {v.title}
                    </h1>
                    <p className="whitespace-nowrap truncate">
                      {v.summary || "A Very Cool Game"}
                    </p>
                  </div>
                </Link>
              );
            })}
        </GameList>
      </div>
    );
  };

  return (
    <Layout>
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a game.."
                defaultValue={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  debounced(e.target.value);
                }}
                className="bg-black text-white rounded-lg w-full p-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {query && results && results.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Search results for "{query}"</h2>
            <p>Found {results?.length} games</p>
          </div>
        )}

        {results && results.length > 0 ? (
          <div>
            <GameList>
              {results
                .filter((v) => !listOfExistingGames?.includes(v.gameSlug))
                .map((v, k) => {
                  return (
                    <Link
                      state={{
                        from: {
                          page: "search",
                          query,
                        },
                      }}
                      to={`/search/${v.gameSlug}`}
                      key={k}
                    >
                      <div className="select-none bg-zinc-800 border-white border border-solid rounded-lg p-2">
                        <h1 className="font-bold text-2xl whitespace-nowrap truncate">
                          {v.title}
                        </h1>
                        <p className="whitespace-nowrap truncate">
                          {v.summary}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </GameList>

            <div className="my-2">
              {listOfExistingGames && listOfExistingGames.length > 0 && (
                <ExistingGames />
              )}
            </div>
          </div>
        ) : !query || query === "" ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Search for a game!</h1>
            <p>
              Search for a game to add to your library, or import from Steam
            </p>
            <div className="my-2">
              <Link to="/import">
                <Button
                  variant={"outline"}
                  className="hover:cursor-pointer text-black"
                  size="sm"
                >
                  Import
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <EmptyState hint="Nothing was found with that term :(" />
        )}
      </div>
    </Layout>
  );
}
