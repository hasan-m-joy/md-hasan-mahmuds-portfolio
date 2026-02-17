export function ToolTile({ tool }) {
  return (
    <div className="tile">
      <div className="icon">
        {tool.iconImage ? (
          <img className="brand-icon" loading="lazy" alt={tool.iconAlt} src={tool.iconImage} />
        ) : (
          <span style={{ fontWeight: 800, fontSize: 12 }}>{tool.iconText}</span>
        )}
      </div>
      <div className="label">
        <b>{tool.name}</b>
        <small>{tool.detail}</small>
      </div>
    </div>
  );
}
