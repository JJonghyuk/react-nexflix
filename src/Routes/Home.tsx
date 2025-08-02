import { useQuery } from "@tanstack/react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import Banner from "../Components/Banner";
import Movie from "../Components/Movie";

const Wrapper = styled.div`
  overflow-x: hidden;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 30px;
  font-weight: 600;
`;

function Home() {
  const { isLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movieBanner01", "popular"],
    queryFn: () => getMovies({ type: "movie", category: "popular" }),
  });

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner id="movieBanner01" type="movie" category="popular" />
          <Movie
            id="movie01"
            type="movie"
            category="now_playing"
            title="Now Playing"
          />
          <Movie id="movie02" type="movie" category="popular" title="Popular" />
          <Movie
            id="movie03"
            type="movie"
            category="top_rated"
            title="Top Rated"
          />
          <Movie
            id="movie04"
            type="movie"
            category="upcoming"
            title="Upcoming"
          />
        </>
      )}
    </Wrapper>
  );
}
export default Home;
