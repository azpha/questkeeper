import Layout from "@/components/Layout";
import api from "@/utils/api";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import type { IGDBSearchData } from "@/utils/types";

export default function Search() {
  const [results, setResults] = useState<IGDBSearchData[] | null>(null);
  const [addedGames, setAddedGames] = useState<string[] | null>(null);
  const [query, setQuery] = useState<string>("");

  const debounced = useCallback(
    debounce((v: string) => {
      setQuery(v);
    }, 500),
    []
  );

  useEffect(() => {
    if (query && query !== "") {
      api.searchIgdb(query).then((res) => {
        if (res) {
          setResults(res);
        }
      });
    }
  }, [query]);
  useEffect(() => {
    api.getAddedSlugs().then((res) => {
      if (res) {
        setAddedGames(res);
      }
    });
  }, []);

  const ExistingGames = () => {
    return (
      <div>
        <div className="my-6">
          <h1 className="text-2xl font-bold">Already added</h1>
          <p>Games in your library matching this search query</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results
            ?.filter((v) => addedGames?.includes(v.slug))
            .map((v, k) => {
              return (
                <Link to={`/game/${v.slug}`} key={k}>
                  <div className="select-none bg-zinc-800 border-white border border-solid rounded-lg p-2">
                    <h1 className="font-bold text-2xl whitespace-nowrap truncate">
                      {v.name}
                    </h1>
                    <p className="whitespace-nowrap truncate">{v.summary}</p>
                  </div>
                </Link>
              );
            })}
        </div>
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
                onChange={(e) => debounced(e.target.value)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results
                .filter((v) => !addedGames?.includes(v.slug))
                .map((v, k) => {
                  return (
                    <Link to={`/search/${v.slug}`} key={k}>
                      <div className="select-none bg-zinc-800 border-white border border-solid rounded-lg p-2">
                        <h1 className="font-bold text-2xl whitespace-nowrap truncate">
                          {v.name}
                        </h1>
                        <p className="whitespace-nowrap truncate">
                          {v.summary}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>

            <div className="my-2">
              {results.filter((v) => addedGames?.includes(v.slug)).length >
                0 && <ExistingGames />}
            </div>
          </div>
        ) : !query || query === "" ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Search for a game!</h1>
            <p>Search for a game to add to your library.</p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Uh-oh!</h1>
            <p>Nothing was found with that term :(</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
