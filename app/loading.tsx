export default function Loading() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-card">
        <div className="loader" aria-hidden="true">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>

        <p className="loading-text">Good things take time</p>
      </div>
    </div>
  );
}
