import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getColor = (color) => {
  if (color <= 10) {
    return "#ff0000";
  } else if (color > 10 && color <= 20) {
    return "#e91600";
  } else if (color > 20 && color <= 30) {
    return "#d22d00";
  } else if (color > 30 && color <= 40) {
    return "#ff8105";
  } else if (color > 40 && color <= 50) {
    return "#ffaf05";
  } else if (color > 50 && color <= 60) {
    return "#ffd605";
  } else if (color > 60 && color <= 70) {
    return "#2bd500";
  } else if (color > 70 && color <= 80) {
    return "#2bd500";
  } else if (color > 80 && color <= 90) {
    return "#1ee100";
  } else if (color > 90 && color <= 100) {
    return "#00ff00";
  }
};
