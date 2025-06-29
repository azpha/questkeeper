import Layout from "@/components/Layout";
import api from "@/utils/api";
import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/contexts/AuthContext";
import { Link } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import type { IGDBSearchData, SteamGame } from "@/utils/types";

export default function Import() {
  const steamIdField = useRef<HTMLInputElement | null>(null);
  const [results, setResults] = useState<IGDBSearchData[]>([]);
  const [steamData, setSteamData] = useState<SteamGame[] | null>(null);
  const [steamOffset, setSteamOffset] = useState<number>(1);
  const [addedGames, setAddedGames] = useState<string[] | null>(null);
  const [query, setQuery] = useState<string>("");
  const auth = useAuth();

  const fetchSteamGames = (start?: number, end?: number) => {
    if (steamData) {
      const dataSubset = steamData.slice(start || 0, end || 5);
      let idString = ``;
      for (const game of dataSubset) {
        if (idString !== "") {
          idString += `${game.appid},`;
        } else {
          idString += `${game.appid}`;
        }
      }

      api.fetchSteamIgdbGames(idString).then((res) => {
        console.log(res);
        setResults((prevState) => {
          return [...prevState, ...res];
        });
      });
    }
  };

  useEffect(() => {
    if (steamData) {
      fetchSteamGames();
    }
  }, [steamData]);
  useEffect(() => {}, [steamOffset]);
  useEffect(() => {
    if (auth.currentUser?.steamId) {
      api.fetchSteamGames().then((res) => {
        setSteamData(res);
      });
    }
  }, [auth.currentUser?.steamId]);
  useEffect(() => {
    api.getAddedSlugs().then((res) => {
      if (res) {
        setAddedGames(res);
      }
    });
  }, []);

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
  const handleUpdateSteamId = async () => {
    const id = steamIdField.current?.value;
    if (id) {
      await api.updateUser({
        steamId: id,
      });
      auth.loadUserAuth();
    }
  };
  const nextPage = () => {
    console.log(steamOffset * 5, (steamOffset + 1) * 5);
    fetchSteamGames(steamOffset * 5, (steamOffset + 1) * 5);
    setSteamOffset((prevState) => {
      return prevState + 1;
    });
  };

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
                <Link state={{ query }} to={`/game/${v.slug}`} key={k}>
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
      {auth.currentUser?.steamId && (
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
      )}
      {!auth.currentUser?.steamId && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold">What's your Steam ID?</h1>
                  <p>You can find it in your settings</p>
                </div>

                <input
                  type="text"
                  placeholder="Steam ID.."
                  ref={steamIdField}
                  className="bg-black text-white rounded-lg w-full p-2"
                />

                <div className="mt-2">
                  <Button onClick={handleUpdateSteamId}>Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {query && results && results.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Search results for "{query}"</h2>
            <p>Found {results?.length} games</p>
          </div>
        )}

        {results && results.length > 0 ? (
          <div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Games you own</h1>
              <p>All of the games we've found in your Steam library</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results
                .filter((v) => !addedGames?.includes(v.slug))
                .map((v, k) => {
                  return (
                    <Link state={{ query }} to={`/search/${v.slug}`} key={k}>
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
              <Button variant={"secondary"} onClick={nextPage}>
                Load More
              </Button>
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
          <EmptyState hint="Nothing was found with that term :(" />
        )}
      </div>
    </Layout>
  );
}
