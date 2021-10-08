import {
  IconDisc,
  IconDots,
  IconFileAlert,
  IconFileCheck,
  IconUpload,
} from "@tabler/icons";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useGlobalState } from "../../state";
import { strings } from "../../strings";
import { BASE_API_URL } from "../../variables";

import Genres from './genres';

interface FileObj {
  file: File;
  progress: number;
  serverName: string;
}

export default function ContentAdd() {
  const [method, setMethod] = useState("upload");
  const [token, setToken] = useGlobalState("token");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaGenre, setMetaGenre] = useState("");
  const [metaYear, setMetaYear] = useState("");
  const [metaTags, setMetaTags] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaType, setMetaType] = useState("");
  const [metaBannerUrl, setMetaBannerUrl] = useState("");
  const [metaUserGrant, setMetaUserGrant] = useState("");
  const [metaGroupGrant, setMetaGroupGrant] = useState("");

  const [metaTMDB, setMetaTMDB] = useState<any>({});

  // I don't have types for the API and don't want to write them.
  const [suggestions, setSuggestions] = useState<Array<any>>([]);

  const [files, setFiles] = useState<{
    [key: string]: FileObj;
  }>({});

  const submitSingleFile = async () => {
    if (Object.keys(files).length !== 1) {
      console.error("Invalid file count");
      return;
    }

    const fileData: FileObj = Object.values(files)[0];

    // https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/.........
    // https://www.themoviedb.org/t/p/w300_and_h450_bestv2/.........
    // fetch('https://api.themoviedb.org/3/search/multi?api_key=c9c068dc34db03848dfa45f92157e6e3&query=How to Train Your Dragon')

    // Make the mediaItem
    const res = fetch(`${BASE_API_URL}/api/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uri: fileData.serverName,
        type: metaType,
        tags: metaTags.split(";"),
        meta: {
          released: metaYear,
          title: metaTitle,
          thumb: metaBannerUrl,
          description: metaDescription,
          tmdb: metaTMDB,
          // If set, the genre, or if existing, the first tag, or nothing
          primaryTag:
            metaGenre != ""
              ? metaGenre
              : metaTags.split(";")[0]
              ? metaTags.split(";")[0]
              : "",
        },
      }),
    });

    const serverMedia = (await res).json();
    const id = (await serverMedia)._id;
    console.log(id);

    // Grant user permissions
    metaUserGrant.split(";").forEach((email) => {
      fetch(`${BASE_API_URL}/user/grant-media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Note that we use the requesting user's token, not that of the person we're adding.
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          id,
        }),
      }).then((res) => console.log(res.body));
      // .then(data => console.log(data));
    });

    // grant group permissions
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log(acceptedFiles);

      let add: {
        [key: string]: FileObj;
      } = {};

      acceptedFiles.forEach((file: File) => {
        const nfo = {
          file,
          progress: 0,
          serverName: "",
        };
        add[file.name] = nfo;

        uploadFile(nfo);
      });

      setFiles({
        ...files,
        ...add,
      });
    },
    [files]
  );

  // Uploads the file to the server and alters the files state when progress occurs.
  const uploadFile = useCallback(
    (fileObj) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${BASE_API_URL}/contentupload`);

      // Runs when completed
      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText);

        // Progress 101 = file saved on server
        // Servername = md5 given by server (use with db)
        const name = fileObj.file.name;
        let update: {
          [key: string]: FileObj;
        } = {};
        update[name] = {
          ...fileObj,
          progress: 101,
          serverName: res.data.name,
        };

        setFiles({
          ...files,
          ...update,
        });
      };

      xhr.onerror = (e) => {
        console.error(e);
      };

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;

          const name = fileObj.file.name;
          let update: {
            [key: string]: FileObj;
          } = {};
          update[name] = {
            ...fileObj,
            progress: percent,
          };

          setFiles({
            ...files,
            ...update,
          });
        }
      };

      const formData = new FormData();
      formData.append("file", fileObj.file);

      xhr.send(formData);
    },
    [files]
  );

  const processNewTitle = async (title: string) => {
    setMetaTitle(title);

    const titleSearch = fetch(`${BASE_API_URL}/tmdb/${title}`);
    const json = await (await titleSearch).json();

    setSuggestions(json.results);
  };

  const applySuggestion = async (suggestion: any) => {

    setMetaBannerUrl(suggestion.backdrop_path ? suggestion.backdrop_path : '');
    setMetaDescription(suggestion.overview ? suggestion.overview : '');
    setMetaGenre(suggestion.genre_ids ? (Genres as any)[suggestion.genre_ids[0]].name : '');
    setMetaYear(suggestion.release_date ? suggestion.release_date.substring(0, 4) : '');
    setMetaTags(suggestion.genre_ids ? suggestion.genre_ids.map((s: any) => (Genres as any)[s].name).join(';') : '');
    setMetaTitle(suggestion.original_title);

    setMetaTMDB(suggestion);

    // return;
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "audio/*, video/*",
  });

  // url: `${BASE_API_URL}/contentupload`,
  // method: "POST",
  // headers: {
  //   Authorization: `Bearer: ${token}`,
  // },

  return (
    <div className="admin-section">
      <div className="admin-heading">
        <h2>{strings.admin_add_title}</h2>
        <div>{strings.admin_add_desc}</div>
      </div>
      <div className="admin-content">
        {/* <div id="admin-content-type-select">
          <h3>Select add method</h3>
          <div>
            <button
              onClick={() => {
                setMethod("upload");
              }}
            >
              upload
            </button>
            <button
              onClick={() => {
                setMethod("server");
              }}
            >
              server path
            </button>
          </div>
        </div> */}
        <div id="admin-content-add">
          <div id="admin-content-source">
            {(() => {
              switch (method) {
                case "upload":
                  return (
                    <div className="upload-container">
                      <div className="dropzone-contain" {...getRootProps()}>
                        <div className="dropzone-title">
                          <div>
                            <IconUpload />
                          </div>
                          <div>{strings.admin_add_dropzone}</div>
                        </div>
                        <div
                          className={`dropzone-files ${
                            Object.keys(files).length == 0 ? "empty" : ""
                          }`}
                        >
                          {Object.keys(files).map(
                            (fileKey: string, idx: number) => {
                              let { file, progress } = files[fileKey];

                              return (
                                <div key={idx}>
                                  <div>{file.name}</div>
                                  <div>
                                    <progress
                                      max="100"
                                      value={progress}
                                      className={
                                        progress > 100 ? "saved" : "loading"
                                      }
                                    ></progress>
                                    {(() => {
                                      if (progress < 100) {
                                        return <IconDots />;
                                      } else if (progress == 100) {
                                        return <IconDisc />;
                                      } else if (progress > 100) {
                                        return <IconFileCheck />;
                                      } else {
                                        return <IconFileAlert />;
                                      }
                                    })()}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>

                        <input {...getInputProps()}></input>
                      </div>
                    </div>
                  );
                case "server":
                  return "server";
                case "unset":
                  return "select a method";
              }
            })()}
          </div>
          <div id="admin-content-meta">
            {(() => {
              if (Object.keys(files).length == 0) {
                return (
                  <div className="author-meta author-meta-empty">
                    <div>
                      <IconFileAlert></IconFileAlert>
                    </div>{" "}
                    <div>{strings.admin_add_fileRequired}</div>
                  </div>
                );
              } else if (Object.keys(files).length == 1) {
                return (
                  <div className="author-meta author-meta-single">
                    <div>
                      <h3>{strings.admin_add_single_title}</h3>
                      <p>{strings.admin_add_single_desc}</p>
                    </div>

                    <div className="meta-input-container">
                      <p>{strings.admin_add_type_title}</p>
                      <div>
                        <input
                          type="radio"
                          value="video/series"
                          name="type"
                          checked={metaType === "video/series"}
                          onChange={(e) => {
                            setMetaType(e.target.value);
                          }}
                        />{" "}
                        {strings.admin_add_type_series}
                        <br />
                        <input
                          type="radio"
                          value="video/movie"
                          name="type"
                          checked={metaType === "video/movie"}
                          onChange={(e) => {
                            setMetaType(e.target.value);
                          }}
                        />{" "}
                        {strings.admin_add_type_movie}
                        <br />
                        <input
                          type="radio"
                          value="audio/song"
                          name="type"
                          checked={metaType === "audio/song"}
                          onChange={(e) => {
                            setMetaType(e.target.value);
                          }}
                        />{" "}
                        {strings.admin_add_type_audio}
                      </div>
                    </div>

                    <div className="meta-input-container">
                      <p>{strings.admin_add_media_title}</p>
                      <input
                        type="text"
                        value={metaTitle}
                        id="media-title-input"
                        onChange={(e) => {
                          processNewTitle(e.target.value);
                        }}
                      />
                      <span></span>
                      <div id="media-title-suggest-container">
                        {suggestions.map((suggestion, key) => {
                          return (
                            <div
                              className="media-suggestion"
                              key={key}
                              onClick={() => {
                                applySuggestion(suggestion);
                              }}
                            >
                              <div className="media-suggestion-poster"></div>
                              <div className="media-suggestion-title">{suggestion.original_title}</div>
                              <div className="media-suggestion-year">{suggestion.release_date?.substring(0,4)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="meta-input-container">
                      <p>{strings.admin_add_media_release}</p>
                      <input
                        type="text"
                        value={metaYear}
                        onChange={(e) => {
                          setMetaYear(e.target.value);
                        }}
                      />
                      <span></span>
                    </div>

                    <div className="meta-input-container">
                      <p>{strings.admin_add_media_genre}</p>
                      <input
                        type="text"
                        value={metaGenre}
                        onChange={(e) => {
                          setMetaGenre(e.target.value);
                        }}
                      />
                      <span></span>
                    </div>

                    <div className="meta-input-container">
                      <p>{strings.admin_add_media_banner}</p>
                      <input
                        type="text"
                        value={metaBannerUrl}
                        onChange={(e) => {
                          setMetaBannerUrl(e.target.value);
                        }}
                      />
                      <span></span>
                    </div>

                    <div className="meta-input-container">
                      <p>{strings.admin_add_media_tags}</p>
                      <input
                        type="text"
                        value={metaTags}
                        onChange={(e) => {
                          setMetaTags(e.target.value);
                        }}
                      />
                      <span></span>
                    </div>

                    <div className="meta-input-container">
                      <p>{strings.admin_add_media_users}</p>
                      <input
                        type="text"
                        value={metaUserGrant}
                        onChange={(e) => {
                          setMetaUserGrant(e.target.value);
                        }}
                      />
                      <span></span>
                    </div>

                    <div className="meta-input-container">
                      <p>{strings.admin_add_media_group}</p>
                      <input
                        type="text"
                        value={metaGroupGrant}
                        onChange={(e) => {
                          setMetaGroupGrant(e.target.value);
                        }}
                      />
                      <span></span>
                    </div>

                    <div className="submit-content-container">
                      <button onClick={() => submitSingleFile()}>
                        {strings.admin_add_create}
                      </button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="author-meta series">meta series edit</div>
                );
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
