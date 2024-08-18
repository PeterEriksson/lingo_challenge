import styles from "../app/main.module.css";
function Loading() {
  return (
    <div className={styles.loadingAnimation}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
}

export default Loading;
