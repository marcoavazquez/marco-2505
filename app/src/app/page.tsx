import Image from "next/image";
import Link from "next/link";
import { SnailAvatar } from "@/components/ui/SnailAvatar";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Snail, inicio">
          <SnailAvatar className="size-10" />
          <span>Snail</span>
        </Link>
        <nav className={styles.navigation} aria-label="Acceso a la cuenta">
          <Link href="/login" className={styles.loginLink}>Iniciar sesión</Link>
          <Link href="/register" className={styles.registerLink}>Registrarse</Link>
        </nav>
      </header>
      <main>
        <section className={styles.hero} aria-labelledby="home-title">
          <Image
            src="/snail-racing-hero.webp"
            alt="Tres caracoles de caparazones coloridos compiten en una pista rodeada de flores"
            fill
            preload
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Carreras de caracoles</p>
            <h1 id="home-title">Snail</h1>
            <p className={styles.tagline}>La emoción va a su propio ritmo.</p>
            <p className={styles.description}>
              Pequeños competidores. Grandes emociones.
            </p>
            <div className={styles.actions}>
              <Link href="/register" className={styles.primaryButton}>Registrarse</Link>
              <Link href="/login" className={styles.secondaryButton}>Iniciar sesión</Link>
            </div>
          </div>
        </section>
        <section className={styles.about} aria-labelledby="about-title">
          <div className={styles.aboutHeading}>
            <p className={styles.eyebrow}>Bienvenido a la pista</p>
            <h2 id="about-title">Aquí, cada carrera cuenta.</h2>
          </div>
          <div className={styles.highlights}>
            <div>
              <span className={styles.number}>01</span>
              <h3>Pequeños competidores</h3>
              <p>Cada caracol tiene su nombre, su historia y su lugar en la pista.</p>
            </div>
            <div>
              <span className={styles.number}>02</span>
              <h3>Grandes emociones</h3>
              <p>La meta está cerca. El resultado siempre puede sorprenderte.</p>
            </div>
            <div>
              <span className={styles.number}>03</span>
              <h3>A tu propio ritmo</h3>
              <p>Un rincón para disfrutar las carreras y celebrar cada victoria.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <span className={styles.footerBrand}>Snail</span>
        <p>Carreras pequeñas. Emociones grandes.</p>
        <Link href="/login">Entrar a la pista</Link>
      </footer>
    </div>
  );
}
