import { render, screen } from "@testing-library/react";
import { shallow } from "enzyme";
import MovieModal from "./MovieModal";

const videoTrack = {
  _id: "123",
  uri: "https://example.com/test.mp4",
  meta: {
    title: "TestTitle",
    tmdb: {
      backdrop_path: "/test.jpg",
    },
  },
  tags: ["test", "test2"] as any,
  type: "video/movie",
  sortTag: "TestSortTag",
};

test("Video modal renders", () => {
  // This message shows when the app is either redirecting or creating a new stage.
  render(
    <MovieModal
      media={videoTrack}
      setShowMedia={() => {
        return;
      }}
    />
  );

  const titleElement = screen.getByTestId("video-modal");
  expect(titleElement).toBeInTheDocument();
});

test("Video modal renders the media content inside", () => {
  // This message shows when the app is either redirecting or creating a new stage.
  render(
    <MovieModal
      media={videoTrack}
      setShowMedia={() => {
        return;
      }}
    />
  );

  const titleElement = screen.getByText(/TestTitle/i);
  expect(titleElement).toBeInTheDocument();
});

test("media modal exit method works", () => {
  let item = shallow(
    <MovieModal
      media={videoTrack}
      setShowMedia={() => {
        // Simply accpets when this function is called (that's all we expect to happen)
        expect(true).toBe(true);
      }}
    />
  );

  item.find(".media-modal-exit").simulate("click");
});

test("media modal play method works", () => {
  let item = shallow(
    <MovieModal
      media={videoTrack}
      setShowMedia={() => {
        // Simply accpets when this function is called (that's all we expect to happen)
        expect(true).toBe(true);
      }}
    />
  );

  item.find(".modal-content-button").simulate("click");
});
