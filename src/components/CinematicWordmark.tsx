import logo from "../../assets/logos/sain-on-dark.svg";

export function CinematicWordmark() {
  return (
    <h1 id="home-orbit-title" className="home-orbit-hero__wordmark" aria-label="SAIN MOTORS">
      {/* Frame the artwork within the square Illustrator canvas. */}
      <svg className="cinematic-wordmark" viewBox="934 1667 1981 521" aria-hidden="true">
        <image href={logo.src} width="3849.57" height="3849.57" />
      </svg>
    </h1>
  );
}
