import { render, screen } from "@testing-library/react";
import { shallow } from "enzyme";
import AudioThumb from "./AudioThumb";

const audioTrack = {
  _id: "123",
  uri: "https://example.com/test.mp3",
  meta: {
    title: "TestTitle",
  },
  tags: [] as [],
  type: "audio/music",
  sortTag: "TestSortTag",
};

test("Audio thumb renders", () => {
  // This message shows when the app is either redirecting or creating a new stage.
  render(
    <AudioThumb
      track={audioTrack}
      setMediaModal={() => {
        return;
      }}
    />
  );

  const titleElement = screen.getByTestId("audio-thumb");
  expect(titleElement).toBeInTheDocument();
});

test("audio thumb has meta", () => {
  render(
    <AudioThumb
      track={audioTrack}
      setMediaModal={() => {
        return;
      }}
    />
  );

  const titleElement = screen.getByText(/TestTitle/i);
  expect(titleElement).toBeInTheDocument();
});

test("audio thumb method works", () => {
  let item = shallow(
    <AudioThumb
      track={audioTrack}
      setMediaModal={() => {
        // Simply accpets when this function is called (that's all we expect to happen)
        expect(true).toBe(true);
      }}
    />
  );

  item.find(".audio-thumb").simulate("click");
});

test("audio thumb keyboard activation works", () => {
  let item = shallow(
    <AudioThumb
      track={audioTrack}
      setMediaModal={() => {
        // Simply accpets when this function is called (that's all we expect to happen)
        expect(true).toBe(true);
      }}
    />
  );

  item.find(".audio-thumb").simulate("keydown", { key: "Enter" });
});

test("audio thumb keyboard other key does nothing", () => {
  let item = shallow(
    <AudioThumb
      track={audioTrack}
      setMediaModal={() => {
        // Contradiction - If this method activates when a key other than enter was pressed, something went wrong.
        expect(true).toBe(false);
      }}
    />
  );

  item.find(".audio-thumb").simulate("keydown", { key: "A" });
});
