import Layout from "@/components/Layout";
import api from "@/utils/api";
import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/contexts/AuthContext";
import { Link } from "react-router-dom";
import type { IGDBSearchData, SteamGame } from "@/utils/types";
import EmptyState from "@/components/EmptyState";

export default function Import() {
  const steamIdField = useRef<HTMLInputElement | null>(null);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [results, setResults] = useState<IGDBSearchData[]>([]);
  const [steamData, setSteamData] = useState<SteamGame[] | null>(null);
  const [steamOffset, setSteamOffset] = useState<number>(1);
  const [addedGames, setAddedGames] = useState<{ gameSlug: string }[] | null>(
    null
  );
  const auth = useAuth();

  const fetchSubsetOfSteamGames = () => {
    if (steamData) {
      const dataSubset = steamData.slice(
        (steamOffset - 1) * 10,
        steamOffset * 10
      );
      const idString = dataSubset.map((v) => v.appid).join(",");

      api.fetchSteamIgdbGames(idString).then((res) => {
        const doesExist = results.some((v) =>
          res.some((value) => value.slug === v.slug)
        );
        if (!doesExist) {
          setResults((prevState) => {
            return [...prevState, ...res];
          });
        }
      });
    }
  };

  useEffect(() => {
    if (steamData) {
      fetchSubsetOfSteamGames();
    }
  }, [steamOffset, steamData]);
  useEffect(() => {
    if (results.length > 0 && !initialLoad) {
      setInitialLoad(true);
    }
  }, [results]);
  useEffect(() => {
    if (auth.hasAuthLoaded && auth.currentUser?.steamId) {
      api.fetchSteamGames().then((res) => {
        if (res) {
          setSteamData(res);
        }
      });
    }
    api.fetchGames(`select=gameSlug`).then((res) => {
      if (res) {
        setAddedGames(res);
      }
    });
  }, [auth]);
  useEffect(() => {
    if (steamData && !results) {
      fetchSubsetOfSteamGames();
    }
  }, [steamData]);

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
    console.log(steamOffset * 10, (steamOffset + 1) * 10);
    setSteamOffset((prevState) => {
      return prevState + 1;
    });
  };
  const listOfExistingGames = useMemo(() => {
    const matchedInArray = results
      ?.filter((v) => {
        return addedGames?.some((addedGame) => addedGame.gameSlug === v.slug);
      })
      .map((v) => v.slug);
    return matchedInArray;
  }, [results]);

  const ExistingGames = () => {
    return (
      <div>
        <div className="my-6">
          <h1 className="text-2xl font-bold">Already added</h1>
          <p>Games in your library matching this search query</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results
            ?.filter((v) => {
              return listOfExistingGames?.includes(v.slug);
            })
            .map((v, k) => {
              return (
                <Link
                  state={{
                    from: {
                      page: "import",
                    },
                  }}
                  to={`/game/${v.slug}`}
                  key={k}
                >
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
      {!auth.currentUser?.steamId && auth.hasAuthLoaded && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold">What's your Steam ID?</h1>
                  <p>You can find it in your Steam Account Details page.</p>
                </div>

                <input
                  type="text"
                  placeholder="Steam ID.."
                  ref={steamIdField}
                  className="bg-black text-white rounded-lg w-full p-2"
                />

                <div className="mt-2 h-full">
                  <Button onClick={handleUpdateSteamId}>Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {results && results.length > 0 && initialLoad ? (
          <div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Games you own</h1>
              <p>All of the games found in your Steam library</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.filter((v) => !listOfExistingGames?.includes(v.slug)) &&
                results.map((v, k) => {
                  return (
                    <Link
                      state={{
                        from: {
                          page: "import",
                        },
                      }}
                      to={`/search/${v.slug}`}
                      key={k}
                    >
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
              {listOfExistingGames && listOfExistingGames.length > 0 && (
                <ExistingGames />
              )}
            </div>
          </div>
        ) : !initialLoad && auth.hasAuthLoaded && auth.currentUser?.steamId ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Loading your Steam library..</h1>
            <p>Hang tight, this might take a minute..</p>
          </div>
        ) : (
          initialLoad &&
          results &&
          results.length <= 0 && <EmptyState hint="No games found :(" />
        )}
      </div>
    </Layout>
  );
}
