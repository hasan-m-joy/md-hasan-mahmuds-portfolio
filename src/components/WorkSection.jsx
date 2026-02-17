export function WorkSection({ workItems, onOpenWorkItem }) {
  return (
    <section id="work" className="fade-in">
      <div className="section-head">
        <div>
          <h2>Selected Work</h2>
          <p>Each card opens in a preview modal.</p>
        </div>
        <a className="btn" href="#contact">
          Hire Me
        </a>
      </div>

      <div className="grid">
        <div className="work">
          {workItems.map((item) => (
            <a
              key={item.title}
              className="card work-card"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onOpenWorkItem(item);
              }}
            >
              <div className="thumb" aria-hidden="true"></div>
              <div className="info">
                <div className="title">
                  <span>{item.title}</span>
                  <span className="chip">{item.type}</span>
                </div>
                <p className="desc">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
