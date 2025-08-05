import { useQuery } from "@tanstack/react-query";
import Banner from "../Components/Banner";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import Movie from "../Components/Movie";

const Wrapper = styled.div`
  overflow-x: hidden;
  padding-bottom: 100px;
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

function Tv() {
  const { isLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["tv01", "popular"],
    queryFn: () => getMovies({ type: "tv", category: "popular" }),
  });
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner id="tvBanner01" type="tv" category="popular" />
          <Movie id="tv01" type="tv" category="popular" title="Popular" />
          <Movie
            id="tv02"
            type="tv"
            category="airing_today"
            title="Airing Today"
          />
          <Movie id="tv03" type="tv" category="on_the_air" title="On The Air" />
          <Movie id="tv04" type="tv" category="top_rated" title="Top Rated" />
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
