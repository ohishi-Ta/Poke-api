import React, { useEffect, useState } from "react";
import { getPokemonAbility, getPokemonType } from "../utils/pokemon.js";
import Modal from "react-modal";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export const Card = ({ pokemon }) => {
  const [pokemonName, setPokemonName] = useState([]);
  const [pokemonMainAbility, setPokemonMainAbility] = useState([]);
  const [pokemonHiddenAbility, setPokemonHiddenAbility] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pokemonTypeURL, setPokemonTypeURL] = useState([]);

  // ポケモンの名前を日本語として出力する関数
  let pokemonNameDetail = pokemon.species.url;

  const loadPokemonName = async (data) => {
    let response = await fetch(data);
    let result = await response.json();
    let jaName = result.names.find(
      (name) => name.language.name === "ja-Hrkt"
    ).name;
    //これでもいける
    //  let jaName = result.names[0].name;
    setPokemonName(jaName);
  };

  // ポケモンの名前を日本語として出力する関数 end

  // ポケモンのタイプを日本語として出力する関数
  let resPokemonTypes = pokemon.types.map((v) => {
    let typesURL = v.type.url;
    return typesURL;
  });

  const loadPokemonType = async (data) => {
    let _pokemonType = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonTypeDetail = await getPokemonType(pokemon);
        let jaName = pokemonTypeDetail.names.find(
          (name) => name.language.name === "ja"
        ).name;
        return jaName;
      })
    );
    let joinedTypes = _pokemonType.join(" / ");
    setPokemonTypeURL(joinedTypes);
  };

  // ポケモンのタイプを日本語として出力する関数 end

  // ポケモンのアビリティを日本語として出力する関数

  //メインの特性
  let pokemonMainAbilitydata = pokemon.abilities.filter(
    (names) => names.is_hidden === false
  );
  let pokemonMainAbilityDetail = pokemonMainAbilitydata.map((abilityData) => {
    let MainAbilityURL = abilityData.ability.url;

    return MainAbilityURL;
  });

  //夢特性
  let pokemonHiddenAbilitydata = pokemon.abilities.filter(
    (names) => names.is_hidden === true
  );
  let pokemonHiddenAbilityDetail = pokemonHiddenAbilitydata.map(
    (abilityData) => {
      let HiddenAbilityURL = abilityData.ability.url;
      return HiddenAbilityURL;
    }
  );

  const loadMainPokemonAbility = async (data) => {
    let _pokemonAbility = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonMainAbilityDetail = await getPokemonAbility(pokemon);
        let jaName = pokemonMainAbilityDetail.names.find(
          (name) => name.language.name === "ja"
        ).name;
        return jaName;
      })
    );

    let joinedAbilitys = _pokemonAbility.join(" / ");
    setPokemonMainAbility(joinedAbilitys);
  };

  const loadHiddenPokemonAbility = async (data) => {
    let _pokemonAbility = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonHiddenAbilityDetail = await getPokemonAbility(pokemon);
        let jaName = pokemonHiddenAbilityDetail.names.find(
          (name) => name.language.name === "ja"
        ).name;
        return jaName;
      })
    );

    let joinedAbilitys = _pokemonAbility.join(" / ");
    setPokemonHiddenAbility(joinedAbilitys);
  };

  // ポケモンの名前を日本語として出力する関数

  useEffect(() => {
    loadPokemonName(pokemonNameDetail);
    loadPokemonType(resPokemonTypes);
    loadMainPokemonAbility(pokemonMainAbilityDetail);
    loadHiddenPokemonAbility(pokemonHiddenAbilityDetail);
  }, []);

  return (
    <>
      <div className="card" onClick={() => setModalIsOpen(true)}>
        <div className="card-inner">
          <div className="images">
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
            ></img>
          </div>
          <p>No.{pokemon.id}</p>
          <h3 className="cardNames">
            {pokemonName}
            <span>{pokemon.name}</span>
          </h3>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} className="modalbox">
        <span
          className="closebtn-icon"
          onClick={() => setModalIsOpen(false)}
        ></span>
        <Swiper
          // autoplay={{
          //   delay: 2000,
          //   disableOnInteraction: false,
          // }}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Navigation, Pagination]}
          loop={true}
        >
          <SwiperSlide>
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
            ></img>
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={pokemon.sprites.other["official-artwork"].front_shiny}
            ></img>
          </SwiperSlide>
        </Swiper>
        <div className="modal-inner">
          <p className="cardId">No.{pokemon.id}</p>
          <h3 className="cardNames">{pokemonName}</h3>
          <div className="item">
            <p className="title">タイプ</p>
            <p className="content">{pokemonTypeURL}</p>
          </div>
          <div className="itembox">
            <div className="item">
              <p className="title">重さ</p>
              <p className="content">{pokemon.weight / 10}kg</p>
            </div>
            <div className="item">
              <p className="title">高さ</p>
              <p className="content">{pokemon.height / 10}m</p>
            </div>
          </div>
          <div className="itembox">
            <div className="item">
              <p className="title">特性</p>
              <p className="content">{pokemonMainAbility}</p>
            </div>
            <div className="item">
              <p className="title">夢特性</p>
              <p className="content">{pokemonHiddenAbility}</p>
            </div>
          </div>

          <button className="closebtn" onClick={() => setModalIsOpen(false)}>
            閉じる
          </button>
        </div>
      </Modal>
    </>
  );
};
