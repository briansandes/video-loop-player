import { useRef, useState, useEffect } from "react";

export default function VideoLoopPlayer() {
  const mediaRef = useRef(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [isLooping, setIsLooping] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const onTimeUpdate = () => {
      if (isLooping && media.currentTime >= end) {
        media.currentTime = start;
        media.play();
      }
    };

    media.addEventListener("timeupdate", onTimeUpdate);
    return () => media.removeEventListener("timeupdate", onTimeUpdate);
  }, [start, end, isLooping]);

  useEffect(() => {
    const media = mediaRef.current;
    if (media) media.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const onKey = (e) => {
      if (!mediaRef.current) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (!isLooping) {
          mediaRef.current.currentTime = start;
          mediaRef.current.play();
          setIsLooping(true);
        } else {
          mediaRef.current.pause();
          setIsLooping(false);
        }
      }

      if (e.key === "a") setStart(mediaRef.current.currentTime);
      if (e.key === "b") setEnd(mediaRef.current.currentTime);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, isLooping]);

  const playLoop = () => {
    const media = mediaRef.current;
    if (!media) return;
    media.currentTime = start;
    media.play();
    setIsLooping(true);
  };

  const stopLoop = () => {
    setIsLooping(false);
    mediaRef.current.pause();
  };

  return (
    <div className="min-vh-100 bg-dark text-light d-flex align-items-center justify-content-center p-4">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="mb-4">🎵 Video loop player</h1>

        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept="audio/*,video/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) mediaRef.current.src = URL.createObjectURL(file);
            }}
          />
        </div>

        <video ref={mediaRef} controls className="w-100 rounded bg-black mb-3" />

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Start (A)</label>
            <input
              type="number"
              step="0.1"
              className="form-control"
              value={start}
              onChange={(e) => setStart(+e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">End (B)</label>
            <input
              type="number"
              step="0.1"
              className="form-control"
              value={end}
              onChange={(e) => setEnd(+e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Playback Speed: {speed}x</label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            className="form-range"
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
          />
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <button className="btn btn-success" onClick={playLoop}>▶ Play Loop (Space)</button>
          <button className="btn btn-danger" onClick={stopLoop}>■ Stop</button>
          <button className="btn btn-primary" onClick={() => setStart(mediaRef.current.currentTime)}>Set Start (A)</button>
          <button className="btn btn-secondary" onClick={() => setEnd(mediaRef.current.currentTime)}>Set End (B)</button>
        </div>

        <div className="alert alert-secondary small mb-0">
          Shortcuts: <strong>Space</strong> play/stop loop · <strong>A</strong> set start · <strong>B</strong> set end
        </div>
      </div>
    </div>
  );
}
