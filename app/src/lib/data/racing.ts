import { Race } from "../../types/racing";
import { snails } from "./snail";

export const dailyRaces: Race[] = [
  {
    id: "1",
    name: "Race 1",
    snails: snails,
    winner: snails[1].id,
  },
  {
    id: "2",
    name: "Race 2",
    snails: snails,
    winner: snails[1].id,
  },
  {
    id: "3",
    name: "Race 3",
    snails: snails,
    winner: snails[2].id,
  },
  {
    id: "4",
    name: "Race 4",
    snails: snails,
    winner: snails[3].id,
  },
  {
    id: "5",
    name: "Race 5",
    snails: snails,
    winner: snails[4].id,
  },
  {
    id: "6",
    name: "Race 6",
    snails: snails,
    winner: snails[4].id,
  },
];