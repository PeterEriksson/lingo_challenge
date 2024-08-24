import styles from "../app/main.module.css";
function LoadingSidebar() {
  return (
    <div className={styles.loadingSidebarAnimation}>
      <div className={styles.sidebarDot} />
      <div className={styles.sidebarDot} />
      <div className={styles.sidebarDot} />
    </div>
  );
}

export default LoadingSidebar;
