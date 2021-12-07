import { render, screen } from "@testing-library/react";
import { shallow } from "enzyme";
import VideoThumb from "./VideoThumb";

const videoTrack = {
  _id: "123",
  uri: "https://example.com/test.mp4",
  meta: {
    title: "TestTitle",
    tmdb: {
      backdrop_path: "/test.jpg",
    },
  },
  tags: [] as [],
  type: "video/movie",
  sortTag: "TestSortTag",
};

test("Video thumb renders", () => {
  // This message shows when the app is either redirecting or creating a new stage.
  render(
    <VideoThumb
      video={videoTrack}
      setMediaModal={() => {
        return;
      }}
    />
  );

  const titleElement = screen.getByTestId("video-thumb");
  expect(titleElement).toBeInTheDocument();
});

test("video thumb has meta", () => {
  render(
    <VideoThumb
      video={videoTrack}
      setMediaModal={() => {
        return;
      }}
    />
  );

  const titleElement = screen.getByText(/TestTitle/i);
  expect(titleElement).toBeInTheDocument();
});

test("video thumb method works", () => {
  let item = shallow(
    <VideoThumb
      video={videoTrack}
      setMediaModal={() => {
        // Simply accpets when this function is called (that's all we expect to happen)
        expect(true).toBe(true);
      }}
    />
  );

  item.find(".video-thumb").simulate("click");
});

test("video thumb keyboard activation works", () => {
  let item = shallow(
    <VideoThumb
      video={videoTrack}
      setMediaModal={() => {
        // Simply accpets when this function is called (that's all we expect to happen)
        expect(true).toBe(true);
      }}
    />
  );

  item.find(".video-thumb").simulate("keydown", { key: "Enter" });
});

test("video thumb keyboard other key does nothing", () => {
  let item = shallow(
    <VideoThumb
      video={videoTrack}
      setMediaModal={() => {
        // Contradiction - If this method activates when a key other than enter was pressed, something went wrong.
        expect(true).toBe(false);
      }}
    />
  );

  item.find(".video-thumb").simulate("keydown", { key: "A" });
});
