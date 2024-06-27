import React from 'react';
import styles from './loader.module.scss'; 

const Loader: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderText}>Welcome to CocktailFounder</div>
    </div>
  );
};

export default Loader;
