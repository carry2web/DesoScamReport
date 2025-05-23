"use client";

import { Page } from "@/components/Page";

import { Button } from "@/components/Button";

import { useToast } from "@/hooks/useToast";

import styles from "./page.module.css";

export default function Test() {

  const {
    showToast,
    showErrorToast,
    showSuccessToast,
    showWarningToast,
    showInfoToast,
  } = useToast();  

  return (
    <Page>
      <div className={styles.pageContainer}>

        <div className={styles.toastBts}>
          <Button onClick={() => showToast('Wow so easy!')}>Toast</Button>
          <Button onClick={() => showErrorToast('Something went wrong!')}>Toast Error</Button>
          <Button onClick={() => showSuccessToast('Success 🎉')}>Toast Success</Button>
          <Button onClick={() => showWarningToast('Watch out!')}>Toast Warning</Button>
          <Button onClick={() => showInfoToast('Heads up!')}>Toast Info</Button>
        </div>

      </div>
    </Page>
  );
}