import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">WELCOME TO RECIPEHUB</p>

          <h1>
            Good food brings
            <br />
            us <span>together.</span>
          </h1>

          <p className="hero-description">
            Discover delicious recipes, find inspiration for your next
            meal, and make something wonderful with the ingredients you
            already have.
          </p>

          <div className="hero-actions">
            <Link to="/recipes" className="hero-primary-button">
              Explore Recipes <span>→</span>
            </Link>

            <Link
              to="/ingredient-finder"
              className="hero-secondary-button"
            >
              Find recipes by ingredients
            </Link>
          </div>

          <div className="hero-note">
            <span>🍲</span>
            <p>Everyday ingredients. Extraordinary meals.</p>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85"
            alt="A colourful table of freshly prepared food"
          />

          <div className="hero-image-label">
            <span>MADE WITH LOVE</span>
            <strong>Your next favourite meal starts here.</strong>
          </div>

          <div className="hero-sticker" aria-hidden="true">
            <span>GOOD</span>
            <span>FOOD</span>
            <span>♥</span>
          </div>
        </div>
      </section>

      {/* Recipe Discovery Section */}
      <section className="home-discover">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE INSPIRATION</p>
            <h2>What are you craving?</h2>
            <p>Find something delicious for every kind of day.</p>
          </div>
        </div>

        <div className="discover-grid">
          <Link to="/recipes" className="discover-card">
            <div className="discover-icon">🥘</div>
            <div>
              <h3>Everyday Recipes</h3>
              <p>Explore meals worth making again.</p>
            </div>
            <span className="discover-arrow">↗</span>
          </Link>

          <Link to="/trending" className="discover-card">
            <div className="discover-icon">🔥</div>
            <div>
              <h3>Trending Now</h3>
              <p>See what everyone is cooking.</p>
            </div>
            <span className="discover-arrow">↗</span>
          </Link>

          <Link to="/top-rated" className="discover-card">
            <div className="discover-icon">⭐</div>
            <div>
              <h3>Top Rated</h3>
              <p>Discover highly rated favourites.</p>
            </div>
            <span className="discover-arrow">↗</span>
          </Link>

          <Link to="/ingredient-finder" className="discover-card">
            <div className="discover-icon">🥕</div>
            <div>
              <h3>Ingredient Finder</h3>
              <p>Find recipes using what you have.</p>
            </div>
            <span className="discover-arrow">↗</span>
          </Link>
        </div>
      </section>

      {/* Featured Food Section */}
      <section className="home-feature">
        <div className="feature-image">
          <img
            src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=85"
            alt="A delicious Indian curry served fresh"
            loading="lazy"
          />
        </div>

        <div className="feature-copy">
          <p className="eyebrow">YOUR NEXT FOOD ADVENTURE</p>

          <h2>Bring a little more flavour to your table.</h2>

          <p>
            From comforting Indian classics to new dishes waiting to
            be discovered, your next meal idea is just a click away.
          </p>

          <Link to="/recipes" className="hero-primary-button">
            Browse All Recipes <span>→</span>
          </Link>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="home-bottom-cta">
        <span className="cta-decoration" aria-hidden="true">
          ✳
        </span>

        <p className="eyebrow">COOK • SHARE • ENJOY</p>

        <h2>Every recipe has a story.</h2>

        <p>Discover yours with RecipeHub.</p>

        <Link to="/recipes" className="hero-light-button">
          Let's Get Cooking
        </Link>
      </section>
    </main>
  );
}

export default Home;