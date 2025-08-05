export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export function noImagePath() {
  return "/react-nexflix/no_image.svg";
}
