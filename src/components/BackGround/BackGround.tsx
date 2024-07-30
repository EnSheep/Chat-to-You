import React from 'react';
import styles from './background.module.scss';

const BackGround: React.FC = () => {
    return (
        <>
            <div className={styles.layer1}></div>
            <div className={styles.layer2}></div>
            <div className={styles.layer3}></div>
            <div className={styles.layer4}></div>
            <div className={styles.layer5}></div>
            <div className={styles.layer6}></div>
        </>
    );
};

export default BackGround;
