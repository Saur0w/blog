import styles from "./style.module.scss";

export default function ArticlesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.empty}>
        <span className={styles.label}>ARTICLES</span>
        <h1 className={styles.title}>Adding Soon</h1>
        <p className={styles.desc}>
          This space is reserved for upcoming breakdowns. Check back shortly.
        </p>
        <div className={styles.line} />
      </div>
    </div>
  );
}
