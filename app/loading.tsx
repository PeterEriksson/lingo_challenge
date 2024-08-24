import styles from "../app/main.module.css";

function loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex space-x-2">
        <div className={styles.loadingScreenDot}></div>
        <div className={styles.loadingScreenDot}></div>
        <div className={styles.loadingScreenDot}></div>
      </div>
    </div>
  );
}

export default loading;
