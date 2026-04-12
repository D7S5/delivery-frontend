function PageLayout({ eyebrow, title, description, actions, children, narrow = false }) {
  return (
    <main className="app-main">
      <section className={`page-shell${narrow ? " page-shell-narrow" : ""}`}>
        <div className="page-hero">
          <div>
            {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {description ? <p className="page-description">{description}</p> : null}
          </div>
          {actions ? <div className="page-actions">{actions}</div> : null}
        </div>
        {children}
      </section>
    </main>
  );
}

export default PageLayout;
