import { Map, Ship, MoonStar, BedDouble, Ticket, Bus, Sun } from "lucide-react";

const map = {
  map: Map,
  ship: Ship,
  sun: Sun,
  moon: MoonStar,
  bed: BedDouble,
  ticket: Ticket,
  bus: Bus,
};

export const CategoryIcon = ({ name, ...props }) => {
  const Icon = map[name] || Map;
  return <Icon {...props} />;
};

export default CategoryIcon;
