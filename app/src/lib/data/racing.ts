import { Race } from "../../types/racing";
import { snails } from "./snail";

export const dailyRaces: Race[] = [
  {
    id: "1",
    name: "Carrera 1",
    snails: snails,
    winner: snails[1].id,
  },
  {
    id: "2",
    name: "Carrera 2",
    snails: snails,
    winner: snails[1].id,
  },
  {
    id: "3",
    name: "Carrera 3",
    snails: snails,
    winner: snails[2].id,
  },
  {
    id: "4",
    name: "Carrera 4",
    snails: snails,
    winner: snails[3].id,
  },
  {
    id: "5",
    name: "Carrera 5",
    snails: snails,
    winner: snails[4].id,
  },
  {
    id: "6",
    name: "Carrera 6",
    snails: snails,
    winner: snails[4].id,
  },
];
