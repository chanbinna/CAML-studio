import styles from "./page.module.css";
import Image from "next/image";

export default function Contact() {
  return (
    <div className={styles.container}>
      <div className={styles.leftPic}>
        <Image
          src={"/contactImg.jpeg"}
          alt='Contact Image'
          className={styles.leftImage}
          priority
          width={385}
          height={685}
        />
      </div>
      <div className={styles.rightForm}>
        <p>
          Should you have any questions, our Ambassadors are here to assist you.
        </p>

        <p>Contact Form</p>

        <form className={styles.contactForm}>
          <fieldset className={styles.formSection}>
            <p>First Name: *</p>
            <input id='firstName' type='text' placeholder='Name' />
          </fieldset>

          <fieldset className={styles.formSection}>
            <p>Last Name: *</p>
            <input id='lastName' type='text' placeholder='Last Name' />
          </fieldset>

          <fieldset className={styles.formSection}>
            <p>Email: *</p>
            <input id='email' type='text' placeholder='Email' />
          </fieldset>

          <fieldset className={styles.formSection}>
            <p>Phone: </p>
            <input id='phone' type='tel' placeholder='Phone' />
          </fieldset>

          <fieldset className={styles.formSection}>
            <p className={styles.message}>Message *</p>
            <textarea id='message' placeholder='Message' rows={8} />
          </fieldset>

          <button className={styles.submitButton} type='submit'>
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}
