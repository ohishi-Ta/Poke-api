import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon, getPokemon } from "./utils/pokemon.js";
import { Card } from "./components/card.js";
import "./css/card.css";
import loadimg from "./img/ball.svg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon/?limit=21";
  //カントー地方  const initialURL = "https://pokeapi.co/api/v2/pokemon/?limit=21";
  //ジョウト地方  const initialURL = "https://pokeapi.co/api/v2/pokemon/?offset=151&limit=21
  //ホウエン地方 const initialURL = "https://pokeapi.co/api/v2/pokemon/?offset=251&limit=21
  //シンオウ地方 const initialURL = "https://pokeapi.co/api/v2/pokemon/?offset=386&limit=21
  //イッシュ地方 const initialURL = "https://pokeapi.co/api/v2/pokemon/?offset=493&limit=21
  //カロス地方  const initialURL = "https://pokeapi.co/api/v2/pokemon/?offset=649&limit=21
  //アローラ地方 const initialURL = "https://pokeapi.co/api/v2/pokemon/?offset=721&limit=21
  //ガラル地方  const initialURL = "https://pokeapi.co/api/v2/pokemon/?offset=809&limit=21
  //パルデア地方 const initialURL = "https://pokeapi.co/api/v2/pokemon/?offset=905&limit=21

  const [loading, setLoading] = useState(true);
  const [pokemonData, setpokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      //各ポケモンデータを取得
      loadPokemon(res.results);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonrecord = getPokemon(pokemon.url);
        return pokemonrecord;
      })
    );
    setpokemonData(_pokemonData);
  };

  const handlePrevPage = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  return (
    <div className="App">
      {loading ? (
        <img src={loadimg} className="loading" />
      ) : (
        <>
          <div className="box">
            {pokemonData.map((pokemon, i) => {
              return <Card key={i} pokemon={pokemon} />;
            })}
          </div>
          <div>
            {!prevUrl ? (
              ""
            ) : (
              <button className="btn prev" onClick={handlePrevPage}>
                前へ
              </button>
            )}
            {!nextUrl ? (
              ""
            ) : (
              <button className="btn next" onClick={handleNextPage}>
                次へ
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
